import GoogleIcon from "@/assets/icons/google-icon.svg";
import FacebookIcon from "@/assets/icons/facebook-icon.svg";
import SignIn from "@/assets/auth_images/sign_in_img.png";
import Logo from "@/assets/logo_no-bg.png";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import Label from "../components/Label";
import Input from "../components/inputFiled";
import Loader from "@/components/Loader";

import { useState, useEffect } from "react";

import { login, googleLogin, facebookLogin } from "../authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{
    id: number;
    text: string;
    type: string;
  } | null>(null);

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer); // cleanup if component unmounts
    }
  }, [message]);
  // Show temporary message
  const showMessage = (text: string, type = "error") => {
    setMessage({ id: Date.now(), text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  // Handle OAuth callback
  const handleOAuthCallback = () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userid");
    const error = params.get("error");
    // Clear query parameters immediately
    window.history.replaceState({}, document.title, window.location.pathname);

    if (error) {
      showMessage(error, "error");
      return;
    }

    if (userId) {
      sessionStorage.setItem("user", JSON.stringify({ id: userId, userId }));
      showMessage("OAuth authentication successful!", "success");
    }
  };

  // Validation function
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

  const handleOAuth = async (provider: string) => {
    setLoading(true);
    try {
      if (provider === "google") {
        await googleLogin();
      } else if (provider === "facebook") {
        await facebookLogin();
      }
    } catch (error) {
      console.log(error);
      showMessage("OAuth login failed", "error");
    } finally {
      setLoading(false);
    }
  };

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
      const respons = await login(email, password);
      console.log(respons);
      showMessage(respons.message, "success");
    } catch (err: any) {
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
          <img src={Logo} alt="Logo" className="w-20 h-20 mx-auto" />
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
            <button
              disabled={loading}
              onClick={() => handleOAuth("google")}
              className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <img src={GoogleIcon} alt="Google Icon" className="w-5 h-5" />
              <span className="hidden sm:inline">Continue with Google</span>
              <span className="sm:hidden">Google</span>
            </button>
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

            <div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <a
                  href="/auth/forgot-password"
                  className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
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
