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
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterDto:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *           description: Full name of the user
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *           description: Email address
 *         password:
 *           type: string
 *           format: password
 *           example: Password123!
 *           description: Strong password (min 8 chars, uppercase, lowercase, number, special char)
 *         phone:
 *           type: string
 *           example: "1234567890"
 *           description: Phone number (optional)
 *     
 *     LoginDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: Password123!
 *     
 *     ForgetPasswordDto:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *           description: Email address to send OTP
 *     
 *     OTPVerifyDto:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         otp:
 *           type: string
 *           example: "123456"
 *           description: 6-digit OTP code
 *     
 *     ResetPasswordDto:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *         - newPassword
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         otp:
 *           type: string
 *           example: "123456"
 *         newPassword:
 *           type: string
 *           format: password
 *           example: NewPassword123!
 *     
 *     CheckPasswordDto:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *     
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Operation successful
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439011
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john@example.com
 *                 role:
 *                   type: string
 *                   example: user
 *             token:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 */

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
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     description: Creates a new user account with email and password
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterDto'
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       400:
   *         description: Bad request - Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       409:
   *         description: Conflict - Email already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post("/register", validateDto(RegisterDto), (req, res) =>
    authController.register(req, res)
  );

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user
   *     description: Authenticates a user with email and password
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginDto'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       401:
   *         description: Unauthorized - Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       400:
   *         description: Bad request - Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post("/login", validateDto(LoginDTO), (req, res) =>
    authController.login(req, res)
  );

  /**
   * @swagger
   * /auth/google:
   *   get:
   *     summary: Initiate Google OAuth
   *     description: Redirects to Google OAuth2 authentication flow
   *     tags: [Authentication]
   *     responses:
   *       302:
   *         description: Redirect to Google OAuth
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get("/google", (req, res, next) =>
    authController.googleAuth(req, res, next)
  );

  /**
   * @swagger
   * /auth/google/callback:
   *   get:
   *     summary: Google OAuth callback
   *     description: Callback endpoint for Google OAuth2 authentication
   *     tags: [Authentication]
   *     parameters:
   *       - in: query
   *         name: code
   *         schema:
   *           type: string
   *         required: true
   *         description: Authorization code from Google
   *       - in: query
   *         name: state
   *         schema:
   *           type: string
   *         description: State parameter for CSRF protection
   *     responses:
   *       200:
   *         description: Authentication successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       401:
   *         description: Authentication failed
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get("/google/callback", (req, res, next) =>
    authController.googleCallback(req, res, next)
  );

  /**
   * @swagger
   * /auth/facebook:
   *   get:
   *     summary: Initiate Facebook OAuth
   *     description: Redirects to Facebook OAuth2 authentication flow
   *     tags: [Authentication]
   *     responses:
   *       302:
   *         description: Redirect to Facebook OAuth
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get("/facebook", (req, res, next) =>
    authController.facebookAuth(req, res, next)
  );

  /**
   * @swagger
   * /auth/facebook/callback:
   *   get:
   *     summary: Facebook OAuth callback
   *     description: Callback endpoint for Facebook OAuth2 authentication
   *     tags: [Authentication]
   *     parameters:
   *       - in: query
   *         name: code
   *         schema:
   *           type: string
   *         required: true
   *         description: Authorization code from Facebook
   *       - in: query
   *         name: state
   *         schema:
   *           type: string
   *         description: State parameter for CSRF protection
   *     responses:
   *       200:
   *         description: Authentication successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       401:
   *         description: Authentication failed
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get("/facebook/callback", (req, res, next) =>
    authController.facebookCallback(req, res, next)
  );

  /**
   * @swagger
   * /auth/checkpassword:
   *   post:
   *     summary: Check if user has password
   *     description: Checks if a user account has a password set (useful for OAuth users)
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CheckPasswordDto'
   *     responses:
   *       200:
   *         description: Password check result
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     hasPassword:
   *                       type: boolean
   *                       example: true
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post("/checkpassword", (req, res) =>
    authController.checkPassword(req, res)
  );

  /**
   * @swagger
   * /auth/forgetpassword:
   *   post:
   *     summary: Initiate password reset
   *     description: Sends an OTP to the user's email for password reset
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ForgetPasswordDto'
   *     responses:
   *       200:
   *         description: OTP sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: OTP sent to your email
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post("/forgetpassword", validateDto(ForgetPasswordDTO), (req, res) =>
    authController.forgetpassword(req, res)
  );

  /**
   * @swagger
   * /auth/verifyotp:
   *   post:
   *     summary: Verify OTP
   *     description: Verifies the OTP code sent to user's email
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/OTPVerifyDto'
   *     responses:
   *       200:
   *         description: OTP verified successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: OTP verified successfully
   *       400:
   *         description: Invalid or expired OTP
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post("/verifyotp", validateDto(OTPverifyDTO), (req, res) =>
    authController.verifyOTP(req, res)
  );

  /**
   * @swagger
   * /auth/resetpassword:
   *   post:
   *     summary: Reset password
   *     description: Resets the user's password after successful OTP verification
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ResetPasswordDto'
   *     responses:
   *       200:
   *         description: Password reset successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Password reset successfully
   *       400:
   *         description: Invalid OTP or bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post("/resetpassword", validateDto(ResetPasswordDTO), (req, res) =>
    authController.resetPassword(req, res)
  );

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Logout user
   *     description: Logs out the current user by destroying their session
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logout successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Logout successful
   *       401:
   *         description: Unauthorized - No active session
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post("/logout", (req, res) => authController.logout(req, res));

  return router;
};