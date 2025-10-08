import { IAuthRepository } from "./auth.repository";
import { RegisterDto, LoginDTO, ForgetPasswordDTO, OTPverifyDTO, ResetPasswordDTO } from "./auth.dto";
import { sendOtpEmail } from "../utils/Email.util";
import crypto from "crypto";

export interface IAuthService {
  register(
    data: RegisterDto
  ): Promise<{ success: boolean; user?: any; error?: string }>;
  login(
    data: LoginDTO
  ): Promise<{ success: boolean; user?: any; error?: string }>;
  oauthLogin(
    email: string,
    name: string
  ): Promise<{
    success: boolean;
    user?: any;
    error?: string;
    checkpass?: boolean;
  }>;
  forgetPassword(data: ForgetPasswordDTO): Promise<{ success: boolean; error?: string }>;
  verifyOTP(
    data: OTPverifyDTO
  ): Promise<{ success: boolean; error?: string }>;
  resetPassword(
    data: ResetPasswordDTO
  ): Promise<{ success: boolean; error?: string }>;
  updateLastLogin(userId: string, lastLogin: Date): Promise<void>;
}

export function authService(authRepo: IAuthRepository): IAuthService {
  const MAX_OTP_ATTEMPTS = 5;
  const OTP_EXPIRES_MIN = +(process.env.OTP_EXPIRES_MIN || 10);

  const hashOtp = (otp: string): string => {
    return crypto.createHash("sha256").update(otp).digest("hex");
  };
  return {
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
    login: async (data: LoginDTO) => {
      try {
        const { email, password } = data;
        const user = await authRepo.findUser(email, password);
        console.log(user);
        if (!user) {
          return { success: false, error: "Invalid credentials" };
        }
        return { success: true, user };
      } catch (err) {
        return { success: false, error: "Login failed" };
      }
    },
    oauthLogin: async (email: string, name: string) => {
      try {
        const user = authRepo.findOrCreate(email, name);
        if (!user) {
          return { success: false, error: "OAuth login failed" };
        }
        const checkpass = await authRepo.checkPassword(email);
        if(!checkpass) return { success: false, error: "Password not set" };
        return { success: true, user, checkpass };
      } catch (err) {
        return { success: false, error: "OAuth login failed" };
      }
    },
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
        const otp = Array.from({ length: 6 }, () =>
          Math.floor(Math.random() * 10)
        ).join("");

        const otpHash = hashOtp(otp);

        user.resetOtp = {
          otpHash,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          attempts: 0,
        };
        await user.save();

        const subject = "Your OTP Code";
        const text = `Your OTP code is ${otp}. It is valid for 10 minutes.`;
        const html = `<p>Your OTP code is <b>${otp}</b>. It is valid for 10 minutes.</p>`;

        const mailResponse = await sendOtpEmail(
          email,
          Number(otp),
          subject,
          text,
          html
        );
        if (!mailResponse) {
          return { success: false, error: "Failed to send OTP email" };
        }
        return { success: true };
      } catch (err) {
        return { success: false, error: "Forget password process failed" };
      }
    },
    verifyOTP: async (data: OTPverifyDTO) => {
      try {
        const { email, otp } = data;
        const user = await authRepo.findByEmail(email);
        if (!user || !user.resetOtp) {
          return { success: false, error: "Invalid request" };
        }
        if (new Date() > user.resetOtp.expiresAt) {
          user.resetOtp = undefined;
          await user.save();
          return { success: false, error: "OTP expired" };
        }
        if (user.resetOtp.attempts >= MAX_OTP_ATTEMPTS) {
          user.resetOtp = undefined;
          await user.save();
          return { success: false, error: "Max OTP attempts reached" };
        }
        if (hashOtp(otp) !== user.resetOtp.otpHash) {
          user.resetOtp.attempts += 1;
          if (user.resetOtp.attempts >= MAX_OTP_ATTEMPTS) {
            user.resetOtp = undefined;
          }
          await user.save();
          return { success: false, error: "Invalid OTP" };
        }
        user.resetOtp = undefined;
        await user.save();
        return { success: true };
      } catch (err) {
        return { success: false, error: "Verify OTP process failed" };
      }
    },
    resetPassword: async (data: ResetPasswordDTO) => {
      try {
        const { email, password } = data;
        const user = await authRepo.findByEmail(email);
        if (!user || !user.resetOtp) {
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
    updateLastLogin: async (userId: string, lastLogin: Date) => {
      try {
        await authRepo.updateLastLogin(userId, lastLogin);
      } catch (err) {
        console.error("Failed to update last login:", err);
      }
    },
  };
}