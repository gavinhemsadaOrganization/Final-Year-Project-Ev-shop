import {axiosInstance} from "@/config";
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const googleLogin = async (state: string) => {
  window.location.href = `${baseURL}auth/google?state=${state}`;
};

export const facebookLogin = async (state: string) => {
   window.location.href = `${baseURL}auth/facebook?state=${state}`;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const register = async (email: string, password: string, confirmPassword: string) => {
  const response = await axiosInstance.post("/auth/register", {
    email,
    password,
    confirmPassword
  });
  return response.data;
};

export const forgetPassword = async (email: string) => {
  const response = await axiosInstance.post("/auth/forgetpassword", {
    email,
  });
  return response.data;
  };

export const verifyOTP = async (email: string, otp: string) => {
    const response = await axiosInstance.post("/auth/verifyotp", {
    email,
    otp,
  });
  return response.data;
};

export const resetPassword = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/resetpassword", {
    email,
    password,
  });
  return response.data;
};