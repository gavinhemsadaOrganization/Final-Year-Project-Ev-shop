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

export interface IAuthController {
  register(req: Request, res: Response): Promise<Response>;
  login(req: Request, res: Response): Promise<Response>;
  googleAuth(req: Request, res: Response, next: NextFunction): void;
  googleCallback(req: Request, res: Response, next: NextFunction): void;
  facebookAuth(req: Request, res: Response, next: NextFunction): void;
  facebookCallback(req: Request, res: Response, next: NextFunction): void;
  forgetpassword(req: Request, res: Response): Promise<Response>;
  verifyOTP(req: Request, res: Response): Promise<Response>;
  resetPassword(req: Request, res: Response): Promise<Response>;
  logout(req: Request, res: Response): void;
}

export function authController(authService: IAuthService): IAuthController {
  const passport = initializePassport();
  return {
    register: async (req: Request, res: Response) => {
      try {
        const data = <RegisterDto>req.body;
        const result = await authService.register(data);
        if (!result.success)
          return res.status(400).json({ message: result.error });
        return res.status(201).json({
          message: "User registered successfully",
          result: result.user,
        });
      } catch (err) {
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },

    login: async (req: Request, res: Response) => {
      try {
        const data = <LoginDTO>req.body;
        const result = await authService.login(data);
        if (!result.success)
          return res.status(400).json({ message: result.error });
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
            console.error("Failed to save session:", err);
          }
        });

        return res.status(200).json({
          message: "User logged in successfully",
          user: result.user.id,
        });
      } catch (error: any) {
        return res
          .status(500)
          .json({ error: error?.message || "Internal server error" });
      }
    },
    googleAuth: (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate("google", {
        scope: ["profile", "email"],
      })(req, res, next);
    },
    googleCallback: (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate(
        "google",
        { session: false },
        async (err: any, user: any) => {
          try {
            if (err) {
              return res.status(400).json({
                success: false,
                message: "Google authentication failed",
                error: err.message,
              });
            }

            if (!user) {
              return res.status(400).json({
                success: false,
                message: "Google authentication failed - no user data",
              });
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
                console.error("Failed to save session:", err);
              }
            });

            return res.status(200).json({
              success: true,
              message: "Google authentication successful",
              userid: user.id,
              checkpass: user.checkpass,
            });
          } catch (error: any) {
            return res.status(500).json({
              success: false,
              message: "Internal server error",
              error: error.message,
            });
          }
        }
      )(req, res, next);
    },
    facebookAuth: (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate("facebook", {
        scope: ["public_profile", "email", "user_gender", "user_location"],
      })(req, res, next);
    },
    facebookCallback: (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate(
        "facebook",
        { session: false },
        async (err: any, user: any) => {
          try {
            if (err) {
              return res.status(400).json({
                success: false,
                message: "Facebook authentication failed",
                error: err.message,
              });
            }

            if (!user) {
              return res.status(400).json({
                success: false,
                message: "Facebook authentication failed - no user data",
              });
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
                console.error("Failed to save session:", err);
              }
            });

            return res.status(200).json({
              success: true,
              message: "Facebook authentication successful",
              userid: user.id,
              checkpass: user.checkpass,
            });
          } catch (error: any) {
            return res.status(500).json({
              success: false,
              message: "Internal server error",
              error: error.message,
            });
          }
        }
      )(req, res, next);
    },
    forgetpassword: async (req: Request, res: Response) => {
      try {
        const data = <ForgetPasswordDTO>req.body;
        const result = await authService.forgetPassword(data);
        if (!result.success)
          return res.status(400).json({ message: result.error });
        return res.status(200).json({
          message: "OTP sent to email if it exists in our system",
        });
      } catch (err) {
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },
    verifyOTP: async (req: Request, res: Response) => {
      try {
        const data = <OTPverifyDTO>req.body;
        const result = await authService.verifyOTP(data);
        if (!result.success)
          return res.status(400).json({ message: result.error });
        return res.status(200).json({ message: "OTP verified successfully" });
      } catch (err) {
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
            console.error("Session destroy error:", err);
            return res.status(500).json({ error: "Logout failed" });
          }

          res.clearCookie("connect.sid"); // Clear session cookie
          return res.status(200).json({ message: "Logout successful" });
        });
      } catch (error) {
        return res.status(500).json({ error: "Logout failed" });
      }
    },
  };
}
