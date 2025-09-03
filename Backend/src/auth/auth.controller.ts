import { IAuthService } from "./auth.service";
import { Request, Response } from "express";
import { RegisterDto, LoginDTO } from "./auth.dto";
import  Jwt  from 'jsonwebtoken';

export interface IAuthController {
  register(req: Request, res: Response): Promise<Response>;
  login(req: Request, res: Response): Promise<Response>;
}

export function authController(authService: IAuthService): IAuthController {
  return {
    register: async (req: Request, res: Response) => {
      try {
        const data: RegisterDto = req.body;
        const result = await authService.register(data);
        return res
          .status(201)
          .json({ message: "User registered successfully", result });
      } catch (error: any) {
        return res
          .status(500)
          .json({ error: error?.message || "Internal server error" });
      }
    },
    login: async (req: Request, res: Response) => {
      try {
        const data: LoginDTO = req.body;
        const result = await authService.login(data);
        const token = Jwt.sign({ userId: result._id }, process.env.JWT_SECRET!, {
          expiresIn: "24h",
        });
        return res.status(200).json({ message: "User logged in successfully", token });
      } catch (error: any) {
        return res
          .status(500)
          .json({ error: error?.message || "Internal server error" });
      }
    },
  };
}
