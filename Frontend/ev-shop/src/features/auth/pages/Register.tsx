import { useState, useEffect } from "react";

import GoogleIcon from "@/assets/icons/google-icon.svg";
import FacebookIcon from "@/assets/icons/facebook-icon.svg";
import SignUp from "@/assets/auth_images/sign_up_img.png";
import Logo from "@/assets/logo_no-bg.png";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import Label from "@/components/Label";
import Input from "@/components/inputFiled";
import {Loader} from "@/components/Loader";

// Import authentication context and related types.
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";

// Import authentication service functions for API calls.
import { register, googleLogin, facebookLogin } from "../authService";

// The main component for the registration page.
const RegisterPage = () => {
  // State for form inputs.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // State to hold validation errors for the form fields.
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  // State to manage the loading status during async operations (e.g., API calls).
  const [loading, setLoading] = useState(false);
  // State to toggle password visibility.
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // State for displaying feedback messages (e.g., success or error alerts).
  const [message, setMessage] = useState<{
    id: number;
    text: string;
    type: string;
  } | null>(null);

  // Access the setUserData function from the authentication context.
  const { setUserData } = useAuth();

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  // This effect sets a timer to clear any displayed message after 5 seconds.
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Helper function to show a temporary message to the user.
  const showMessage = (text: string, type = "error") => {
    setMessage({ id: Date.now(), text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  // This function handles the OAuth callback after a user is redirected from Google/Facebook.
  // It parses user data from the URL, sets the user state, and shows a message.
  const handleOAuthCallback = () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userid");
    const role = params.get("role") as UserRole;
    const error = params.get("error");

    // Clean the URL by removing the query parameters.
    window.history.replaceState({}, document.title, window.location.pathname);

    if (error) {
      showMessage(error, "error");
      return;
    }

    if (userId) {
      setUserData(userId, [role], { userid: userId });
      showMessage("OAuth authentication successful!", "success");
    }
  };

  // Validates the email, password, and confirm password fields.
  const validate = (email: string, password: string) => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Email validation.
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format.";
    }

    // Password validation (checks for complexity).
    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number, and special character.";
    }
    // Confirm password validation.
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  // Initiates the OAuth flow for the specified provider (Google or Facebook).
  const handleOAuth = async (provider: string) => {
    setLoading(true);
    try {
      if (provider === "google") {
        await googleLogin("register");
      } else if (provider === "facebook") {
        await facebookLogin("register");
      }
    } catch (error) {
      console.log(error);
      showMessage("OAuth register failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handles the form submission for standard email/password registration.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(email, password);
    if (Object.keys(validationErrors).length > 0) {
      // If there are validation errors, display them and stop submission.
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const response = await register(email, password, confirmPassword);
      showMessage(response.message, "success");
      // Redirect to the login page after a successful registration.
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 3000);
    } catch (err: any) {
      if (err.response) {
        showMessage(
          err.response.data.message || "Registration failed",
          "error"
        );
      } else if (err.request) {
        showMessage("No response from server", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row h-screen w-full bg-gray-100 md:bg-black font-sans overflow-hidden">
      {/* Left Panel: Image */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${SignUp})` }}
      />

      {/* Right Panel: Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white md:bg-black p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="relative w-full max-w-md p-6 sm:p-8 space-y-3 bg-white rounded-xl shadow-lg">
          {/* Logo */}
          <img src={Logo} alt="Logo" className="w-20 h-20 mx-auto" />
          {/* Message display area for success/error alerts */}
          {message && (
            <div
              key={message.id}
              className={`absolute top-[41%] left-1/2 transform -translate-x-1/2 w-[70%] text-center p-3 rounded-md font-medium shadow-lg z-10 ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-400"
                  : "bg-red-100 text-red-700 border border-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Create an Account
            </h1>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleOAuth("google")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <img src={GoogleIcon} alt="Google Icon" className="w-5 h-5" />
              Sign up with Google
            </button>
            <button
              onClick={() => handleOAuth("facebook")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <img src={FacebookIcon} alt="Facebook Icon" className="w-5 h-5" />
              Sign up with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm font-medium text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              {/* Email Input Field */}
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-xs">{errors.email}</p>
              )}
            </div>

            {/* Password field with toggle */}
            <div className="relative">
              {/* Password Input Field */}
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                autoComplete="new-password"
              />
              {/* Password visibility toggle button */}
              <button
                type="button"
                className="absolute right-3 top-[35px] text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 mt-1 text-xs">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password field with toggle */}
            <div className="relative">
              {/* Confirm Password Input Field */}
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? "confirm-password-error" : undefined
                }
                autoComplete="new-password"
              />
              {/* Confirm password visibility toggle button */}
              <button
                type="button"
                className="absolute right-3 top-[35px] text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 mt-1 text-xs">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <div>
              {/* Submit Button */}
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
                {loading ? (
                  <Loader size={10} color="#4f46e5" />
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          {/* Link to the login page */}
          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
