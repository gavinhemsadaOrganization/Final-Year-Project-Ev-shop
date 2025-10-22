import { validateDto } from "../../shared/middlewares/DtoValidator.middleware";

import { Router } from "express";
import { IAuthController } from "./auth.controller";
import {
  RegisterDto,
  LoginDTO,
  ForgetPasswordDTO,
  OTPverifyDTO,
  ResetPasswordDTO,
} from "./auth.dto";
import { container } from "../../di/container";

/**
 * Factory function that creates and configures the router for authentication-related endpoints.
 * It resolves the authentication controller from the dependency injection container and maps
 * controller methods to specific API routes.
 *
 * @returns The configured Express Router for authentication.
 */
export const authRouter = (): Router => {
  const router = Router();

  // Resolve the authentication controller from the DI container.
  const authController = container.resolve<IAuthController>("IAuthController");

  /**
   * @route POST /api/auth/register
   * @description Registers a new user.
   * @middleware validateDto(RegisterDto) - Validates the request body against the RegisterDto.
   * @access Public
   */
  router.post("/register", validateDto(RegisterDto), (req, res) =>
    authController.register(req, res)
  );

  /**
   * @route POST /api/auth/login
   * @description Logs in an existing user.
   * @middleware validateDto(LoginDTO) - Validates the request body against the LoginDTO.
   * @access Public
   */
  router.post("/login", validateDto(LoginDTO), (req, res) =>
    authController.login(req, res)
  );

  /**
   * @route GET /api/auth/google
   * @description Initiates the Google OAuth2 authentication flow.
   * @access Public
   */
  router.get("/google", (req, res, next) =>
    authController.googleAuth(req, res, next)
  );

  /**
   * @route GET /api/auth/google/callback
   * @description The callback URL for Google OAuth2 to redirect to after authentication.
   * @access Public
   */
  router.get("/google/callback", (req, res, next) =>
    authController.googleCallback(req, res, next)
  );

  /**
   * @route GET /api/auth/facebook
   * @description Initiates the Facebook OAuth2 authentication flow.
   * @access Public
   */
  router.get("/facebook", (req, res, next) =>
    authController.facebookAuth(req, res, next)
  );

  /**
   * @route GET /api/auth/facebook/callback
   * @description The callback URL for Facebook OAuth2 to redirect to after authentication.
   * @access Public
   */
  router.get("/facebook/callback", (req, res, next) =>
    authController.facebookCallback(req, res, next)
  );

  /**
   * @route POST /api/auth/checkpassword
   * @description Checks if a user account has a password set.
   * @access Public
   */
  router.post("/checkpassword", (req, res) =>
    authController.checkPassword(req, res)
  );

  /**
   * @route POST /api/auth/forgetpassword
   * @description Initiates the password reset process by sending an OTP.
   * @middleware validateDto(ForgetPasswordDTO) - Validates the request body.
   * @access Public
   */
  router.post("/forgetpassword", validateDto(ForgetPasswordDTO), (req, res) =>
    authController.forgetpassword(req, res)
  );

  /**
   * @route POST /api/auth/verifyotp
   * @description Verifies the OTP provided by the user.
   * @middleware validateDto(OTPverifyDTO) - Validates the request body.
   * @access Public
   */
  router.post("/verifyotp", validateDto(OTPverifyDTO), (req, res) =>
    authController.verifyOTP(req, res)
  );

  /**
   * @route POST /api/auth/resetpassword
   * @description Resets the user's password after successful OTP verification.
   * @middleware validateDto(ResetPasswordDTO) - Validates the request body.
   * @access Public
   */
  router.post("/resetpassword", validateDto(ResetPasswordDTO), (req, res) =>
    authController.resetPassword(req, res)
  );

  /**
   * @route POST /api/auth/logout
   * @description Logs out the current user by destroying their session.
   * @access Private (Requires active session)
   */
  router.post("/logout", (req, res) => authController.logout(req, res));

  return router;
};
