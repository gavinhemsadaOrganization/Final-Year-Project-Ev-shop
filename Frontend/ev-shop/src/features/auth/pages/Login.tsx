import GoogleIcon from "@/assets/icons/google-icon.svg";
import FacebookIcon from "@/assets/icons/facebook-icon.svg";
import SignIn from "@/assets/auth_images/sign_in_img.png";
import Logo from "@/assets/logo_no-bg.png";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// Import reusable UI components.
import Label from "../../../components/Label";
import Input from "../../../components/inputFiled";
import { Loader } from "@/components/Loader";

// Import authentication context and related types.
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";

// Import React hooks for state, side-effects, and navigation.
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import authentication service functions for API calls.
import { authService } from "../authService";

// The main component for the login page.
const LoginPage = () => {
  // State for form inputs.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State to hold validation errors for the form fields.
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  // State to manage the loading status during async operations (e.g., API calls).
  const [loading, setLoading] = useState(false);
  // State to toggle password visibility.
  const [showPassword, setShowPassword] = useState(false);
  // State for displaying feedback messages (e.g., success or error alerts).
  const [message, setMessage] = useState<{
    id: number;
    text: string;
    type: string;
  } | null>(null);
  // Access the setUserData function from the authentication context.
  const { setUserData, setActiveRole } = useAuth();
  // Hook for programmatic navigation.
  const nav = useNavigate();

  // On component mount, check for and handle any OAuth callback parameters in the URL.
  useEffect(() => {
    handleOAuthCallback();
  }, []);

  // This effect sets a timer to clear any displayed message after 5 seconds.
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer); // cleanup if component unmounts
    }
  }, [message]);

  // Helper function to show a temporary message to the user.
  const showMessage = (text: string, type = "error") => {
    setMessage({ id: Date.now(), text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  // This function handles the OAuth callback after a user is redirected from Google/Facebook.
  // It parses user data from the URL, sets the user state, and navigates to the dashboard.
  const handleOAuthCallback = () => {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const userId = params.get("userid");
    const role = params.getAll("role") as UserRole[];
    const roleList = role
      .flatMap((r) => r.split(","))
      .map((r) => r.trim()) as UserRole[];
    const error = params.get("error");
    // Clean the URL by removing the query parameters.
    window.history.replaceState({}, document.title, url.pathname);
    console.log(role);
    if (error) {
      showMessage(error, "error");
      return;
    }

    if (userId) {
      // If authentication is successful, set user data and redirect.
      setUserData(userId, roleList, { userid: userId });
      setActiveRole(roleList[0]);
      showMessage("OAuth authentication successful!", "success");
      setTimeout(() => {
        nav("/user/dashboard", { replace: true });
      }, 2000);
    }
  };

  // Validates the email and password fields.
  const validate = (email: string, password: string) => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format.";
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    return newErrors;
  };

  // Initiates the OAuth flow for the specified provider (Google or Facebook).
  const handleOAuth = async (provider: string) => {
    setLoading(true);
    try {
      if (provider === "google") {
        await authService.googleLogin("login");
      } else if (provider === "facebook") {
        await authService.facebookLogin("login");
      }
    } catch (error) {
      console.log(error);
      showMessage("OAuth login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handles the form submission for standard email/password login.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(email, password);

    // If there are errors, show them
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      // Call the login API service.
      const respons = await authService.login(email, password);
      console.log(respons);
      const roleList = respons.role
        .flatMap((r:any) => r.split(","))
        .map((r:any) => r.trim()) as UserRole[];
      // On success, set user data in the context.
      setUserData(respons.user, roleList, { userid: respons.userid });
      setActiveRole(roleList[0]);
      showMessage(respons.message, "success");
      // Redirect to the user dashboard after a short delay.
      setTimeout(() => {
        nav("/user/dashboard", { replace: true });
      }, 2000); // Wait 2 seconds before navigating
    } catch (err: any) {
      // Handle different types of errors (response error vs. network error).
      if (err.response) {
        showMessage(err.response.data.message || "Login failed", "error");
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
        style={{ backgroundImage: `url(${SignIn})` }}
      />

      {/* Right Panel: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white md:bg-black p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="relative w-full max-w-md p-6 sm:p-8 space-y-6 bg-white rounded-xl shadow-lg">
          {/* Logo */}
          <img src={Logo} alt="Logo" className="w-20 h-20 mx-auto" />
          {/* Message display area for success/error alerts */}
          {message && (
            <div
              key={message.id}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 w-[70%] text-center p-3 rounded-md font-medium shadow-lg z-10 ${
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome Back!
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to continue to your account.
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 sm:space-y-4">
            {/* Google Login Button */}
            <button
              disabled={loading}
              onClick={() => handleOAuth("google")}
              className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <img src={GoogleIcon} alt="Google Icon" className="w-5 h-5" />
              <span className="hidden sm:inline">Continue with Google</span>
              <span className="sm:hidden">Google</span>
            </button>
            {/* Facebook Login Button */}
            <button
              disabled={loading}
              onClick={() => handleOAuth("facebook")}
              className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <img src={FacebookIcon} alt="Facebook Icon" className="w-5 h-5" />
              <span className="hidden sm:inline">Continue with Facebook</span>
              <span className="sm:hidden">Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm font-medium text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Email Input Field */}
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-xs">{errors.email}</p>
              )}
            </div>

            {/* Password Input Field */}
            <div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                {/* Forgot Password Link */}
                <a
                  href="/auth/forgot-password"
                  className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                {/* Password Input */}
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className="mt-1 block w-full px-3 py-2 pr-10 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                />
                {/* Password visibility toggle button */}
                <button
                  type="button"
                  disabled={loading}
                  className="absolute inset-y-0 right-0 top-1 flex items-center pr-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 mt-1 text-xs">{errors.password}</p>
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
                {loading ? <Loader size={10} color="#4f46e5" /> : "Sign In"}
              </button>
            </div>
          </form>

          {/* Link to the registration page */}
          <p className="text-xs sm:text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <a
              href="/auth/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
