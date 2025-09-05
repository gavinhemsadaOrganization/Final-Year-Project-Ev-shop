import { validateDto } from "../middlewares/DtoValidator.middleware";

import { Router } from "express";
import { IAuthController } from "./auth.controller";
import { RegisterDto, LoginDTO, GoogleLoginDTO, FacebookLoginDTO } from "./auth.dto";
import { container } from "./auth.di";

export function authRouter(): Router {
  const router = Router();

  const controller = container.resolve<IAuthController>("IAuthController");

  router.post("/register", validateDto(RegisterDto), (req, res) =>
    controller.register(req, res)
  );
  router.post("/login", validateDto(LoginDTO), (req, res) =>
    controller.login(req, res)
  );
  router.post("/google", validateDto(GoogleLoginDTO), (req, res) =>
    controller.googleLogin(req, res)
  );
  router.post("/facebook", validateDto(FacebookLoginDTO), (req, res) =>
    controller.facebookLogin(req, res)
  );

  return router;
}
