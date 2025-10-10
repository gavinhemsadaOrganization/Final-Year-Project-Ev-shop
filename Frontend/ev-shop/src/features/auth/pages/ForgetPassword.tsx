import React, { useState, useRef, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import Label from "../components/Label";
import Input from "../components/inputFiled";
import Loader from "@/components/Loader";

import bgImage from "@/assets/bg_img2.png";
import Logo from "@/assets/logo_no-bg.png";

import { forgetPassword, verifyOTP, resetPassword } from "../authService";

// Main Component
const ForgotPasswordPage = () => {
  const [step, setStep] = useState("enter-email"); // 'enter-email', 'enter-otp', 'reset-password'
  const [email, setEmail] = useState(() => {
    try {
      const savedState = localStorage.getItem("forgotPasswordState");
      return savedState ? JSON.parse(savedState).email : "";
    } catch (error) {
      return "";
    }
  });

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    otp?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    id: number;
    type: string;
    text: string;
  }| undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // On component mount, restore state from localStorage
    try {
      const savedState = localStorage.getItem("forgotPasswordState");
      if (savedState) {
        const { step: savedStep, email: savedEmail } = JSON.parse(savedState);
        if (savedStep && savedEmail) {
          setStep(savedStep);
          setEmail(savedEmail);
        }
      }
    } catch (error) {
      // If parsing fails, start fresh
      localStorage.removeItem("forgotPasswordState");
    }

    // On component unmount, clean up localStorage
    return () => {
      localStorage.removeItem("forgotPasswordState");
    };
  }, []); // Run only on mount and unmount

  useEffect(() => {
    if (resendCooldown > 0) {
      const timerId = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timerId);
    }
  }, [resendCooldown]);

  useEffect(() => {
    // Persist state to localStorage whenever step or email changes
    if (step !== "success" && email) {
      localStorage.setItem(
        "forgotPasswordState",
        JSON.stringify({ step, email })
      );
    } else {
      localStorage.removeItem("forgotPasswordState");
    }
  }, [step, email]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(undefined), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const showMessage = (text: string, type = "error") => {
    setMessage({ id: Date.now(), text, type });
    setTimeout(() => setMessage(undefined), 5000);
  };

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");

    if (!localPart || !domain) return email; // fallback if invalid

    // Show first 3–4 characters, hide the rest before '@'
    const visible = localPart.slice(0, 4);
    const masked = "*".repeat(Math.max(localPart.length - 4, 0));

    // Example: exam****@gmail.com
    return `${visible}${masked}@${domain}`;
  }
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }
    setErrors({});
    setMessage(undefined);
    setLoading(true);
    try {
      await forgetPassword(email);
      setStep("enter-otp");
      showMessage(`An OTP has been sent to ${maskEmail((email))}.`, "success");
      setResendCooldown(60); // Start 60s cooldown
    } catch (err: any) {
      showMessage(
        err.response?.data?.message || "Failed to send OTP.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element: any, index: number) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setErrors({ otp: "Please enter the complete 6-digit OTP." });
      return;
    }
    setErrors({});
    setMessage(undefined);
    setLoading(true);
    try {
      await verifyOTP(email, enteredOtp);
      showMessage("OTP verified successfully!", "success");
      setStep("reset-password");
    } catch (err: any) {
      showMessage("Invalid OTP. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return; // Prevent clicking if on cooldown

    setLoading(true);
    setMessage(undefined);
    setErrors({});
    try {
      await forgetPassword(email);
      showMessage(`OTP has been sent to ${maskEmail(email)} again.`, "success");
      setResendCooldown(60); // Restart cooldown
    } catch (err: any) {
      showMessage("Failed to resend OTP.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { password?: string; confirmPassword?: string } = {};
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        newPassword
      )
    )
      newErrors.password =
        "Password must contain uppercase, lowercase, number, and special character.";
    if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setLoading(true);
    setMessage(undefined);
    try {
      await resetPassword(email, newPassword);
      setStep("success"); // Final success step
    } catch (err: any) {
      showMessage("Failed to reset password.", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "enter-email":
        return (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all
                ${
                  loading
                    ? "bg-transparent cursor-default"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
            >
              {loading ? <Loader size={10} color="#4f46e5" /> : "Send OTP"}
            </button>
          </form>
        );
      case "enter-otp":
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                  ref={(el) => {
                    otpInputs.current[index] = el;
                  }}
                  className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-red-600 text-center text-xs mt-1">
                {errors.otp}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all
                ${
                  loading
                    ? "bg-transparent cursor-default"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
            >
              {loading ? <Loader size={10} color="#4f46e5" /> : "Verify OTP"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Didn't receive code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
                className="font-medium text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
              </button>
            </p>
          </form>
        );
      case "reset-password":
        return (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        );
      case "success":
        return (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Success!</h1>
            <p className="mt-2 text-sm text-gray-600">{message!.text}</p>
            <a
              href="/auth/login"
              className="mt-6 inline-block w-full py-3 px-4 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Login
            </a>
          </div>
        );
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row h-screen w-full bg-gray-100 md:bg-black font-sans overflow-hidden">
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white md:bg-black p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className=" relative w-full max-w-md p-6 md:p-8 space-y-6 bg-white rounded-xl shadow-lg">
          <img src={Logo} alt="Logo" className="w-20 h-20 mx-auto" />
         {message && (
            <div
              key={message.id}
              className={`absolute top-[20%] left-1/2 transform -translate-x-1/2 w-[70%] text-center p-3 rounded-md font-medium shadow-lg z-10 ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-400"
                  : "bg-red-100 text-red-700 border border-red-400"
              }`}
            >
              {message.text}
            </div>
          )}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {step === "enter-email" && "Forgot Password?"}
              {step === "enter-otp" && "Enter Verification Code"}
              {step === "reset-password" && "Reset Your Password"}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {step === "enter-email" &&
                "No worries, we'll send you reset instructions."}
              {step === "enter-otp" && "Enter the OTP sent to your email."}
              {step === "reset-password" && "Please enter a new password."}
            </p>
          </div>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
