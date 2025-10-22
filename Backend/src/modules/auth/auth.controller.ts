import { IAuthService } from "./auth.service";
import { Request, Response, NextFunction } from "express";
import {
  RegisterDto,
  LoginDTO,
  ForgetPasswordDTO,
  OTPverifyDTO,
  ResetPasswordDTO,
} from "./auth.dto";
import { initializePassport } from "./passport";
import Jwt from "jsonwebtoken";
import logger from "../../shared/utils/logger";

/**
 * Defines the contract for the authentication controller, specifying methods for handling all authentication-related HTTP requests.
 */
export interface IAuthController {
  /**
   * Handles the HTTP request for user registration.
   * @param req - The Express request object, containing registration data in the body.
   * @param res - The Express response object.
   */
  register(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request for user login.
   * @param req - The Express request object, containing login credentials in the body.
   * @param res - The Express response object.
   */
  login(req: Request, res: Response): Promise<Response>;
  /**
   * Initiates the Google OAuth2 authentication flow.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The Express next middleware function.
   */
  googleAuth(req: Request, res: Response, next: NextFunction): void;
  /**
   * Handles the callback from the Google OAuth2 service after authentication.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The Express next middleware function.
   */
  googleCallback(req: Request, res: Response, next: NextFunction): void;
  /**
   * Initiates the Facebook OAuth2 authentication flow.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The Express next middleware function.
   */
  facebookAuth(req: Request, res: Response, next: NextFunction): void;
  /**
   * Handles the callback from the Facebook OAuth2 service after authentication.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The Express next middleware function.
   */
  facebookCallback(req: Request, res: Response, next: NextFunction): void;
  /**
   * Handles the HTTP request to initiate the password reset process.
   * @param req - The Express request object, containing the user's email in the body.
   * @param res - The Express response object.
   */
  forgetpassword(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to check if a user account has a password set.
   * @param req - The Express request object, containing the user's email in the body.
   * @param res - The Express response object.
   */
  checkPassword(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to verify a One-Time Password (OTP).
   * @param req - The Express request object, containing the email and OTP in the body.
   * @param res - The Express response object.
   */
  verifyOTP(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to reset the user's password after successful OTP verification.
   * @param req - The Express request object, containing the email and new password in the body.
   * @param res - The Express response object.
   */
  resetPassword(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to log out a user by destroying their session.
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  logout(req: Request, res: Response): Promise<Response>;
}

const redirect_login_url = process.env.REDIRECT_LOGIN_URL;
const redirect_register_url = process.env.REDIRECT_REGISTER_URL;

/**
 * Factory function to create an instance of the authentication controller.
 * It encapsulates the logic for handling all authentication-related API requests.
 *
 * @param authService - The authentication service dependency that contains the business logic.
 * @returns An implementation of the IAuthController interface.
 */
export function authController(authService: IAuthService): IAuthController {
  const passport = initializePassport();
  return {
    /**
     * Handles user registration with email and password.
     */
    register: async (req: Request, res: Response) => {
      try {
        const data = <RegisterDto>req.body;
        const result = await authService.register(data);
        if (!result.success) {
          logger.warn(`Registration failed: ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`User registered successfully: ${result.user}`);
        return res.status(201).json({
          message: "User registered successfully",
          result: result.user,
        });
      } catch (err) {
        logger.error(`Error registering user: ${err}`);
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },

    /**
     * Handles user login with email and password. On success, it generates JWT and Refresh tokens,
     * stores them in the user's session, and returns user details.
     */
    login: async (req: Request, res: Response) => {
      try {
        const data = <LoginDTO>req.body;
        const result = await authService.login(data);
        if (!result.success) {
          logger.warn(`Login failed: ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        // Generate JWT token
        const token = Jwt.sign(
          { userId: result.user.id, role: result.user.role },
          process.env.JWT_SECRET!,
          {
            expiresIn: "24h",
          }
        );
        // Generate Refresh Token
        const refreshToken = Jwt.sign(
          { userId: result.user.id, role: result.user.role },
          process.env.JWT_REFRESH_SECRET!,
          { expiresIn: "7d" }
        );

        // Store tokens and user info in session
        req.session.jwt = token;
        req.session.userId = result.user.id;
        req.session.refreshToken = refreshToken;
        req.session.role = result.user.role;
        req.session.save((err) => {
          if (err) {
            logger.error("Failed to save session:", err);
          }
        });
        logger.info(`User logged in successfully: ${result.user.id}`);
        return res.status(200).json({
          message: "User logged in successfully",
          user: result.user.id,
          role: result.user.role,
        });
      } catch (error: any) {
        logger.error(`Error logging in user: ${error}`);
        return res
          .status(500)
          .json({ error: error?.message || "Internal server error" });
      }
    },
    /**
     * Initiates the Google OAuth2 flow, using passport. It includes the 'state'
     * parameter to differentiate between login and registration flows on the frontend.
     */
    googleAuth: (req: Request, res: Response, next: NextFunction) => {
      const state =
        typeof req.query.state === "string" ? req.query.state : "login";
      passport.authenticate("google", {
        scope: ["profile", "email"],
        state: state,
        prompt: "select_account",
      })(req, res, next);
    },
    /**
     * Handles the callback from Google. On success, it generates tokens, saves the session,
     * and redirects the user back to the frontend with user details in the query string.
     */
    googleCallback: (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate(
        "google",
        { session: false },
        async (err: any, user: any) => {
          const state =
            typeof req.query.state === "string" ? req.query.state : "login";
          const redirect_url =
            state === "register" ? redirect_register_url : redirect_login_url;
          try {
            if (err || !user) {
              logger.error("Google authentication failed", err);
              return res.redirect(
                `${redirect_url}?error=Google authentication failed`
              );
            }
            // Generate JWT token
            const token = Jwt.sign(
              { userId: user._id, role: user.role },
              process.env.JWT_SECRET!,
              {
                expiresIn: "24h",
              }
            );
            // Generate Refresh Token
            const refreshToken = Jwt.sign(
              { userId: user._id, role: user.role },
              process.env.JWT_REFRESH_SECRET!,
              { expiresIn: "7d" }
            );

            // Store tokens and user info in session
            req.session.jwt = token;
            req.session.userId = user._id;
            req.session.refreshToken = refreshToken;
            req.session.role = user.role;
            req.session.save((err) => {
              if (err) {
                logger.error("Failed to save session:", err);
              }
            });
            logger.info(`User logged in successfully: ${user._id}`);
            res.redirect(
              `${redirect_url}?userid=${user._id}&role=${user.role}`
            );
          } catch (error: any) {
            logger.error(`Error Google logging in user: ${error}`);
            res.redirect(`${redirect_url}?userid=null`);
          }
        }
      )(req, res, next);
    },
    /**
     * Initiates the Facebook OAuth2 flow, using passport. It includes the 'state'
     * parameter to differentiate between login and registration flows on the frontend.
     */
    facebookAuth: (req: Request, res: Response, next: NextFunction) => {
      const state =
        typeof req.query.state === "string" ? req.query.state : "login";
      passport.authenticate("facebook", {
        scope: ["public_profile", "email", "user_gender", "user_location"],
        state: state,
      })(req, res, next);
    },
    /**
     * Handles the callback from Facebook. On success, it generates tokens, saves the session,
     * and redirects the user back to the frontend with user details in the query string.
     */
    facebookCallback: (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate(
        "facebook",
        { session: false },
        async (err: any, user: any) => {
          const state =
            typeof req.query.state === "string" ? req.query.state : "login";
          const redirect_url =
            state === "register" ? redirect_register_url : redirect_login_url;
          try {
            if (err || !user) {
              logger.error(`Error Facebook logging in user: ${err}`);
              return res.redirect(
                `${redirect_url}?error=Facebook authentication failed`
              );
            }
            // Generate JWT token
            const token = Jwt.sign(
              { userId: user.id, role: user.role },
              process.env.JWT_SECRET!,
              {
                expiresIn: "24h",
              }
            );
            // Generate Refresh Token
            const refreshToken = Jwt.sign(
              { userId: user.id, role: user.role },
              process.env.JWT_REFRESH_SECRET!,
              { expiresIn: "7d" }
            );

            // Store tokens and user info in session
            req.session.jwt = token;
            req.session.userId = user.id;
            req.session.refreshToken = refreshToken;
            req.session.role = user.role;
            req.session.save((err) => {
              if (err) {
                logger.error("Failed to save session:", err);
              }
            });
            logger.info(`User logged in successfully: ${user.id}`);
            res.redirect(`${redirect_url}?userid=${user.id}&role=${user.role}`);
          } catch (error: any) {
            logger.error(`Error Facebook logging in user: ${error}`);
            res.redirect(`${redirect_url}?userid=null`);
          }
        }
      )(req, res, next);
    },
    /**
     * Checks if a user account (identified by email) has a password.
     * This is useful for frontend logic to guide users who signed up via OAuth to log in that way.
     */
    checkPassword: async (req: Request, res: Response) => {
      try {
        const email = req.body.email;
        const result = await authService.checkPassword(email);
        if (!result.success) {
          logger.warn(
            `Error checking password for user ${email}: ${result.error}`
          );
        }
        logger.info(`Password check successful for user: ${email}`);
        return res.status(200).json({ message: "Password check successful" });
      } catch (err) {
        logger.error(`Error checking password for user: ${err}`);
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },
    /**
     * Initiates the "forget password" process by triggering the service to send an OTP email.
     */
    forgetpassword: async (req: Request, res: Response) => {
      try {
        const data = <ForgetPasswordDTO>req.body;
        const result = await authService.forgetPassword(data);
        if (!result.success) {
          logger.warn(`Error sending OTP: ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`OTP sent successfully to user: ${data.email}`);
        return res.status(200).json({
          message: "OTP sent to email if it exists in our system",
        });
      } catch (err) {
        logger.error(`Error sending OTP: ${err}`);
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },
    /**
     * Verifies the OTP provided by the user.
     */
    verifyOTP: async (req: Request, res: Response) => {
      try {
        const data = <OTPverifyDTO>req.body;
        const result = await authService.verifyOTP(data);
        if (!result.success) {
          logger.warn(`Error verifying OTP: ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`OTP verified successfully for user: ${data.email}`);
        return res.status(200).json({ message: "OTP verified successfully" });
      } catch (err) {
        logger.error(`Error verifying OTP: ${err}`);
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },
    /**
     * Resets the user's password with a new one after successful OTP verification.
     */
    resetPassword: async (req: Request, res: Response) => {
      try {
        const data = <ResetPasswordDTO>req.body;
        const result = await authService.resetPassword(data);
        if (!result.success)
          return res.status(400).json({ message: result.error });
        return res.status(200).json({ message: "Password reset successfully" });
      } catch (err) {
        logger.error(`Error resetting password: ${err}`);
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },
    /**
     * Logs the user out by updating their last login time and destroying the session.
     */
    logout: async (req: Request, res: Response) => {
      try {
        const lastlogin = new Date();
        const userid = req.session.userId as string;
        await authService.updateLastLogin(userid, lastlogin);
        req.session.destroy((err) => {
          if (err) {
            logger.error(`Error destroying session during logout: ${err}`);
            return res.status(500).json({ error: "Logout failed" });
          }
          logger.info(`User logged out successfully: ${userid}`);
          res.clearCookie("connect.sid"); // Clear session cookie
        });
        return res.status(200).json({ message: "Logout successful" });
      } catch (error) {
        logger.error(`Error logging out user: ${error}`);
        return res.status(500).json({ error: "Logout failed" });
      }
    },
  };
}
