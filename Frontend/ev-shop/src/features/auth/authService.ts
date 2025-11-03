import { axiosInstance, axiosPrivate } from "@/config/config";

// Get the base URL for the API from environment variables.
const baseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * Sends a login request to the server.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<any>} A promise that resolves with the server's response data (e.g., user info, tokens).
 */
export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });
  // Return the data from the API response.
  return response.data;
};

/**
 * Initiates the Google OAuth flow by redirecting the user to the backend's Google auth endpoint.
 * @param {string} state - A state parameter, typically 'login' or 'register', to inform the backend of the user's intent.
 */
export const googleLogin = async (state: string) => {
  // Redirect the browser to the Google authentication URL.
  window.location.href = `${baseURL}auth/google?state=${state}`;
};

/**
 * Initiates the Facebook OAuth flow by redirecting the user to the backend's Facebook auth endpoint.
 * @param {string} state - A state parameter, typically 'login' or 'register', to inform the backend of the user's intent.
 */
export const facebookLogin = async (state: string) => {
  // Redirect the browser to the Facebook authentication URL.
  window.location.href = `${baseURL}auth/facebook?state=${state}`;
};

/**
 * Sends a logout request to the server to invalidate the user's session.
 * @returns {Promise<any>} A promise that resolves with the server's response data.
 */
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

/**
 * Sends a registration request to create a new user account.
 * @param {string} email - The new user's email address.
 * @param {string} password - The new user's chosen password.
 * @param {string} confirmPassword - The password confirmation.
 * @returns {Promise<any>} A promise that resolves with the server's response data.
 */
export const register = async (
  email: string,
  password: string,
  confirmPassword: string
) => {
  const response = await axiosInstance.post("/auth/register", {
    email,
    password,
    confirmPassword,
  });
  return response.data;
};

/**
 * Sends a request to initiate the password reset process for a given email.
 * @param {string} email - The email address of the account to reset the password for.
 * @returns {Promise<any>} A promise that resolves with the server's response data.
 */
export const forgetPassword = async (email: string) => {
  const response = await axiosInstance.post("/auth/forgetpassword", {
    email,
  });
  return response.data;
};

/**
 * Sends the OTP (One-Time Password) to the server for verification.
 * @param {string} email - The user's email address.
 * @param {string} otp - The OTP entered by the user.
 * @returns {Promise<any>} A promise that resolves with the server's response data.
 */
export const verifyOTP = async (email: string, otp: string) => {
  const response = await axiosInstance.post("/auth/verifyotp", {
    email,
    otp,
  });
  return response.data;
};

/**
 * Sends a request to set a new password after successful OTP verification.
 * @param {string} email - The user's email address.
 * @param {string} password - The new password to set.
 * @returns {Promise<any>} A promise that resolves with the server's response data.
 */
export const resetPassword = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/resetpassword", {
    email,
    password,
  });
  return response.data;
};

export const logOut = async () => {
  const response = await axiosPrivate.post(`/user/logout`);
  return response.data;
}