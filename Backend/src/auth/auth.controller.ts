import { IAuthService } from "./auth.service";
import { Request, Response, NextFunction } from "express";
import { RegisterDto, LoginDTO } from "./auth.dto";
import {passport} from "./passport";
import Jwt from "jsonwebtoken";

export interface IAuthController {
  register(req: Request, res: Response): Promise<Response>;
  login(req: Request, res: Response): Promise<Response>;
  googleAuth(req: Request, res: Response, next: NextFunction): void;
  googleCallback(req: Request, res: Response, next: NextFunction): void;
  facebookAuth(req: Request, res: Response, next: NextFunction): void;
  facebookCallback(req: Request, res: Response, next: NextFunction): void;
}

export function authController(authService: IAuthService): IAuthController {
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

        const token = Jwt.sign(
          { userId: result.user.id },
          process.env.JWT_SECRET!,
          {
            expiresIn: "24h",
          }
        );
        return res.status(200).json({
          message: "User logged in successfully",
          token,
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
      passport.authenticate("google", { session: false }, async (err: any, user: any) => {
        try {
          if (err) {
            return res.status(400).json({ 
              success: false, 
              message: "Google authentication failed",
              error: err.message 
            });
          }

          if (!user) {
            return res.status(400).json({ 
              success: false, 
              message: "Google authentication failed - no user data" 
            });
          }

          // Generate JWT token
          const token = Jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: "24h" }
          );
          

          return res.status(200).json({
            success: true,
            message: "Google authentication successful",
            token,
            user: { id: user.id, email: user.email, name: user.name }
          });

        } catch (error: any) {
          return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
          });
        }
      })(req, res, next);
    },
    facebookAuth: (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate("facebook", {
        scope: ["email"],
      })(req, res, next);
    },
    facebookCallback: (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate("facebook", { session: false }, async (err: any, user: any) => {
        try {
          if (err) {
            return res.status(400).json({ 
              success: false, 
              message: "Facebook authentication failed",
              error: err.message 
            });
          }

          if (!user) {
            return res.status(400).json({ 
              success: false, 
              message: "Facebook authentication failed - no user data" 
            });
          }

          const token = Jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: "24h" }
          );
          
          return res.status(200).json({
            success: true,
            message: "Facebook authentication successful",
            token,
            user: { id: user.id, email: user.email, name: user.name }
          });

        } catch (error: any) {
          return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
          });
        }
      })(req, res, next);
    },
  };
}
