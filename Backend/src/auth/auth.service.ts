import { IAuthRepository } from "./auth.repository";
import {
  RegisterDto,
  LoginDTO,
  ForgetPasswordDTO,
  OTPverifyDTO,
  ResetPasswordDTO,
} from "./auth.dto";
import { sendOtpEmail } from "../shared/utils/Email.util";
import crypto from "crypto";

/**
 * Defines the interface for the authentication service, outlining the methods for handling all authentication-related business logic.
 */
export interface IAuthService {
  /**
   * Registers a new user.
   * @param data - The registration data transfer object containing email and password.
   * @returns A promise that resolves to an object indicating success or failure, including user data or an error message.
   */
  register(
    data: RegisterDto
  ): Promise<{ success: boolean; user?: any; error?: string }>;
  /**
   * Logs in an existing user.
   * @param data - The login data transfer object containing email and password.
   * @returns A promise that resolves to an object indicating success or failure, including user data or an error message.
   */
  login(
    data: LoginDTO
  ): Promise<{ success: boolean; user?: any; error?: string }>;
  /**
   * Handles user login via an OAuth provider (e.g., Google, Facebook).
   * It finds an existing user by email or creates a new one if they don't exist.
   * @param email - The user's email provided by the OAuth provider.
   * @param name - The user's name provided by the OAuth provider.
   * @returns A promise that resolves to an object indicating success or failure, including user data or an error message.
   */
  oauthLogin(
    email: string,
    name: string
  ): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }>;
  /**
   * Checks if a user account has a password set. This is useful for differentiating
   * between users who registered with a password and those who signed up via OAuth.
   * @param email - The email of the user to check.
   * @returns A promise that resolves to an object indicating success or failure.
   */
  checkPassword(email: string): Promise<{ success: boolean; error?: string }>;
  /**
   * Initiates the password reset process for a user.
   * Generates an OTP, saves its hash to the user record, and sends it via email.
   * @param data - The forget password DTO containing the user's email.
   * @returns A promise that resolves to an object indicating success or failure.
   */
  forgetPassword(
    data: ForgetPasswordDTO
  ): Promise<{ success: boolean; error?: string }>;
  /**
   * Verifies the OTP provided by the user.
   * @param data - The OTP verification DTO containing the email and OTP.
   * @returns A promise that resolves to an object indicating success or failure.
   */
  verifyOTP(data: OTPverifyDTO): Promise<{ success: boolean; error?: string }>;
  /**
   * Resets the user's password after successful OTP verification.
   * @param data - The reset password DTO containing the email and new password.
   * @returns A promise that resolves to an object indicating success or failure.
   */
  resetPassword(
    data: ResetPasswordDTO
  ): Promise<{ success: boolean; error?: string }>;
  /**
   * Updates the `last_login` timestamp for a user.
   * @param userId - The ID of the user.
   * @param lastLogin - The date of the last login.
   * @returns A promise that resolves when the operation is complete.
   */
  updateLastLogin(userId: string, lastLogin: Date): Promise<void>;
}

/**
 * Factory function to create an instance of the authentication service.
 * It encapsulates all business logic for authentication, relying on the provided repository for data access.
 *
 * @param authRepo - The authentication repository for database interactions.
 * @returns An implementation of the IAuthService interface.
 */
export function authService(authRepo: IAuthRepository): IAuthService {
  // Maximum number of incorrect OTP attempts before the OTP is invalidated.
  const MAX_OTP_ATTEMPTS = 5;
  // OTP validity duration in minutes, sourced from environment variables with a default fallback.
  const OTP_EXPIRES_MIN = +(process.env.OTP_EXPIRES_MIN || 10);

  /**
   * Hashes a plain-text OTP using SHA256 for secure storage.
   * @param otp - The plain-text OTP string.
   * @returns The hex-encoded hash of the OTP.
   */
  const hashOtp = (otp: string): string => {
    return crypto.createHash("sha256").update(otp).digest("hex");
  };
  return {
    /**
     * Handles user registration. Checks if a user with the given email already exists
     * before creating a new user record.
     */
    register: async (data: RegisterDto) => {
      try {
        const { email, password } = data;
        const existingUser = await authRepo.findByEmail(email);
        if (existingUser) {
          return { success: false, error: "User already exists" };
        }
        const newUser = await authRepo.save(email, password);
        return { success: true, user: newUser };
      } catch (err) {
        return { success: false, error: "Registration failed" };
      }
    },
    /**
     * Handles user login by validating credentials against the repository.
     */
    login: async (data: LoginDTO) => {
      try {
        const { email, password } = data;
        const user = await authRepo.findUser(email, password);
        if (!user) {
          return { success: false, error: "Invalid credentials" };
        }
        return { success: true, user };
      } catch (err) {
        return { success: false, error: "Login failed" };
      }
    },
    /**
     * Handles OAuth (social) logins by finding an existing user or creating a new one.
     */
    oauthLogin: async (email: string, name: string) => {
      try {
        const user = await authRepo.findOrCreate(email, name);
        if (!user) {
          return { success: false, error: "OAuth login failed" };
        }
        return { success: true, user };
      } catch (err) {
        return { success: false, error: "OAuth login failed" };
      }
    },
    /**
     * Checks if a password is set for a user account, which helps in UI flows
     * to distinguish between OAuth-only users and those with local credentials.
     */
    checkPassword: async (email: string) => {
      try {
        const checkpass = await authRepo.checkPassword(email);
        if (!checkpass) return { success: false, error: "Password not set" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Password check failed" };
      }
    },
    /**
     * Manages the "forget password" flow by generating and sending an OTP to the user's email.
     * The hashed OTP, its expiration, and attempt count are stored in the user's record.
     */
    forgetPassword: async (data: ForgetPasswordDTO) => {
      try {
        const { email } = data;
        const user = await authRepo.findByEmail(email);
        if (!user) {
          return {
            success: false,
            error: "User with this email does not exist",
          };
        }
        // Generate a 6-digit numeric OTP.
        const otp = Array.from({ length: 6 }, () =>
          Math.floor(Math.random() * 10)
        ).join("");

        const otpHash = hashOtp(otp);

        user.resetOtp = {
          otpHash,
          expiresAt: new Date(Date.now() + OTP_EXPIRES_MIN * 60 * 1000),
          attempts: 0,
        };
        await user.save();

        const subject = "Your OTP Code";
        const text = `Your OTP code is ${otp}. It is valid for 10 minutes.`;
        const html = `<p>Your OTP code is <b>${otp}</b>. It is valid for 10 minutes.</p>`;

        const mailResponse = await sendOtpEmail(email, subject, text, html);
        if (!mailResponse) {
          return { success: false, error: "Failed to send OTP email" };
        }
        return { success: true };
      } catch (err) {
        return { success: false, error: "Forget password process failed" };
      }
    },
    /**
     * Verifies the provided OTP against the stored hash. It enforces expiration time
     * and a maximum number of attempts to prevent brute-force attacks.
     * The OTP data is cleared from the user record upon success or after too many failed attempts.
     */
    verifyOTP: async (data: OTPverifyDTO) => {
      try {
        const { email, otp } = data;
        const user = await authRepo.findByEmail(email);
        if (!user || !user.resetOtp) {
          return { success: false, error: "Invalid request" };
        }
        // Check if OTP has expired.
        if (new Date() > user.resetOtp.expiresAt) {
          user.resetOtp = undefined;
          await user.save();
          return { success: false, error: "OTP expired" };
        }
        // Check if max attempts have been reached.
        if (user.resetOtp.attempts >= MAX_OTP_ATTEMPTS) {
          user.resetOtp = undefined;
          await user.save();
          return { success: false, error: "Max OTP attempts reached" };
        }
        // Compare the provided OTP hash with the stored hash.
        if (hashOtp(otp) !== user.resetOtp.otpHash) {
          user.resetOtp.attempts += 1;
          if (user.resetOtp.attempts >= MAX_OTP_ATTEMPTS) {
            user.resetOtp = undefined;
          }
          await user.save();
          return { success: false, error: "Invalid OTP" };
        }
        // On success, clear the OTP data.
        user.resetOtp = undefined;
        await user.save();
        return { success: true };
      } catch (err) {
        return { success: false, error: "Verify OTP process failed" };
      }
    },
    /**
     * Finalizes the password reset process by updating the user's password in the database.
     */
    resetPassword: async (data: ResetPasswordDTO) => {
      try {
        const { email, password } = data;
        const user = await authRepo.findByEmail(email);
        if (!user) {
          return { success: false, error: "Invalid request" };
        }
        user.password = password;
        user.resetOtp = undefined;
        await user.save();
        return { success: true };
      } catch (err) {
        return { success: false, error: "Reset password process failed" };
      }
    },
    /**
     * Updates the last login timestamp for a user. This is a fire-and-forget operation from the controller's perspective.
     */
    updateLastLogin: async (userId: string, lastLogin: Date) => {
      try {
        await authRepo.updateLastLogin(userId, lastLogin);
      } catch (err) {
        console.error("Failed to update last login:", err);
      }
    },
  };
}
