import { validateDto } from "../middlewares/DtoValidator.middleware";

import { Router } from "express";
import { IAuthController } from "./auth.controller";
import { RegisterDto, LoginDTO, ForgetPasswordDTO, OTPverifyDTO, ResetPasswordDTO } from "./auth.dto";
import { container } from "./auth.di";

export const authRouter = (): Router => {
  const router = Router();

  const controller = container.resolve<IAuthController>("IAuthController");

  router.post("/register", validateDto(RegisterDto), (req, res) =>
    controller.register(req, res)
  );
  router.post("/login", validateDto(LoginDTO), (req, res) =>
    controller.login(req, res)
  );
  router.get("/google", (req, res, next) =>
    controller.googleAuth(req, res, next)
  );

  router.get("/google/callback", (req, res, next) =>
    controller.googleCallback(req, res, next)
  );

  router.get("/facebook", (req, res, next) =>
    controller.facebookAuth(req, res, next)
  );

  router.get("/facebook/callback", (req, res, next) =>
    controller.facebookCallback(req, res, next)
  );

  router.post("/forgetpassword", validateDto(ForgetPasswordDTO), (req, res) =>
    controller.forgetpassword(req, res)
  );

  router.post("/verifyotp", validateDto(OTPverifyDTO), (req, res) =>
    controller.verifyOTP(req, res)
  );

  router.post("/resetpassword", validateDto(ResetPasswordDTO), (req, res) =>
    controller.resetPassword(req, res)
  );
  
  return router;
}
