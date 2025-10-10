import { validateDto } from "../middlewares/DtoValidator.middleware";

import { Router } from "express";
import { IAuthController } from "./auth.controller";
import { RegisterDto, LoginDTO, ForgetPasswordDTO, OTPverifyDTO, ResetPasswordDTO } from "./auth.dto";
import { container } from "./auth.di";

export const authRouter = (): Router => {
  const router = Router();

  const authController = container.resolve<IAuthController>("IAuthController");

  router.post("/register", validateDto(RegisterDto), (req, res) =>
    authController.register(req, res)
  );
  router.post("/login", validateDto(LoginDTO), (req, res) =>
    authController.login(req, res)
  );
  router.get("/google", (req, res, next) =>
    authController.googleAuth(req, res, next)
  );

  router.get("/google/callback", (req, res, next) =>
    authController.googleCallback(req, res, next)
  );

  router.get("/facebook", (req, res, next) =>
    authController.facebookAuth(req, res, next)
  );

  router.get("/facebook/callback", (req, res, next) =>
    authController.facebookCallback(req, res, next)
  );
  router.post("/checkpassword", (req, res) =>
    authController.checkPassword(req, res)
  );
  router.post("/forgetpassword", validateDto(ForgetPasswordDTO), (req, res) =>
    authController.forgetpassword(req, res)
  );

  router.post("/verifyotp", validateDto(OTPverifyDTO), (req, res) =>
    authController.verifyOTP(req, res)
  );

  router.post("/resetpassword", validateDto(ResetPasswordDTO), (req, res) =>
    authController.resetPassword(req, res)
  );

  router.post("/logout", (req, res) => authController.logout(req, res));
  
  return router;
}
