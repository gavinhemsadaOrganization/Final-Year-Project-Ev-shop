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
import logger from "../utils/logger";

export interface IAuthController {
  register(req: Request, res: Response): Promise<Response>;
  login(req: Request, res: Response): Promise<Response>;
  googleAuth(req: Request, res: Response, next: NextFunction): void;
  googleCallback(req: Request, res: Response, next: NextFunction): void;
  facebookAuth(req: Request, res: Response, next: NextFunction): void;
  facebookCallback(req: Request, res: Response, next: NextFunction): void;
  forgetpassword(req: Request, res: Response): Promise<Response>;
  checkPassword(req: Request, res: Response): Promise<Response>;
  verifyOTP(req: Request, res: Response): Promise<Response>;
  resetPassword(req: Request, res: Response): Promise<Response>;
  logout(req: Request, res: Response): void;
}

const redirect_login_url = process.env.REDIRECT_LOGIN_URL;
const redirect_register_url = process.env.REDIRECT_REGISTER_URL;

export function authController(authService: IAuthService): IAuthController {
  const passport = initializePassport();
  return {
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
            console.error("Failed to save session:", err);
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
    googleAuth: (req: Request, res: Response, next: NextFunction) => {
      const state =
        typeof req.query.state === "string" ? req.query.state : "login";
      passport.authenticate("google", {
        scope: ["profile", "email"],
        state: state,
        prompt: "select_account",
      })(req, res, next);
    },
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
                console.error("Failed to save session:", err);
              }
            });
            logger.info(`User logged in successfully: ${user._id}`);
            res.redirect(`${redirect_url}?userid=${user._id}&role=${user.role}`);
          } catch (error: any) {
            logger.error(`Error Google logging in user: ${error}`);
            res.redirect(`${redirect_url}?userid=null`);
          }
        }
      )(req, res, next);
    },
    facebookAuth: (req: Request, res: Response, next: NextFunction) => {
      const state =
        typeof req.query.state === "string" ? req.query.state : "login";
      passport.authenticate("facebook", {
        scope: ["public_profile", "email", "user_gender", "user_location"],
        state: state,
      })(req, res, next);
    },
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
                console.error("Failed to save session:", err);
              }
            });
            logger.info(`User logged in successfully: ${user.id}`);
            res.redirect(
              `http://localhost:5173/auth/login?userid=${user.id}&role=${user.role}`
            );
          } catch (error: any) {
            logger.error(`Error Facebook logging in user: ${error}`);
            res.redirect(`${redirect_url}?userid=null`);
          }
        }
      )(req, res, next);
    },
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
    logout: async (req: Request, res: Response) => {
      try {
        const lastlogin = new Date();
        const userid = req.session.userId as string;
        await authService.updateLastLogin(userid, lastlogin);
        req.session.destroy((err) => {
          if (err) {
            logger.error(`Error destroying session during logout: ${err}`);
            console.error("Session destroy error:", err);
            return res.status(500).json({ error: "Logout failed" });
          }
          logger.info(`User logged out successfully: ${userid}`);
          res.clearCookie("connect.sid"); // Clear session cookie
          return res.status(200).json({ message: "Logout successful" });
        });
      } catch (error) {
        logger.error(`Error logging out user: ${error}`);
        return res.status(500).json({ error: "Logout failed" });
      }
    },
  };
}
