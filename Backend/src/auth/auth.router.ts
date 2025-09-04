import { validateDto } from "../middlewares/DtoValidator.middleware";

import { Router } from "express";
import { authController, IAuthController } from "./auth.controller";
import { authService, IAuthService } from "./auth.service";
import { RegisterDto, LoginDTO } from "./auth.dto";
import { AuthRepository, IAuthRepository } from "./auth.repository";

export function authRouter(): Router {
  const router = Router();
  const repository: IAuthRepository = AuthRepository;
  const service: IAuthService = authService(repository);
  const controller: IAuthController = authController(service);

  router.post("/register", validateDto(RegisterDto), (req, res) => controller.register(req, res));
  router.post("/login", validateDto(LoginDTO), (req, res) => controller.login(req, res));

  return router;
}