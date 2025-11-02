import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const apiURL = import.meta.env.VITE_API_URL;

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

export const apiAxios = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});


axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axiosInstance.get(
          "/auth/refresh",
          { withCredentials: true }
        );
        return axiosPrivate(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export const imageread = async (fileName: string) => {
  const result = await apiAxios.get(`/images/${fileName}`);
  return result.data;
}