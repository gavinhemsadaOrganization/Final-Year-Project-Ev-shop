import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

//  Public axios instance (for login/register)
export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // required for sending/receiving cookies
});

//  Private axios instance (for protected endpoints)
export const axiosPrivate = axios.create({
  baseURL,
  withCredentials: true, // ensures cookies are sent
});

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // refresh logic here, or redirect to login
    }
    return Promise.reject(error);
  }
);