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
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ensures cookies are sent
});

