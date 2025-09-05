import { IAuthService } from "./auth.service";
import { Request, Response } from "express";
import {
  RegisterDto,
  LoginDTO,
  GoogleLoginDTO,
  FacebookLoginDTO,
} from "./auth.dto";
import Jwt from "jsonwebtoken";

export interface IAuthController {
  register(req: Request, res: Response): Promise<Response>;
  login(req: Request, res: Response): Promise<Response>;
  googleLogin(req: Request, res: Response): Promise<Response>;
  facebookLogin(req: Request, res: Response): Promise<Response>;
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

    googleLogin: async (req: Request, res: Response) => {
      try {
        const token = <GoogleLoginDTO>req.body;
        const user = await authService.googleLogin(token);
        const jwtToken = Jwt.sign(
          { userId: user.user.id },
          process.env.JWT_SECRET!,
          {
            expiresIn: "24h",
          }
        );
        return res.status(200).json({ ...user, token: jwtToken });
      } catch (err) {
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },

    facebookLogin: async (req: Request, res: Response) => {
      try{
      const token = <FacebookLoginDTO>req.body;
      const user = await authService.facebookLogin(token);
      const jwtToken = Jwt.sign(
        { userId: user.user.id },
        process.env.JWT_SECRET!,
      );
      return res.status(200).json({ ...user, token: jwtToken });
      }catch(err){
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },
  };
}
