import { axiosInstance } from "@/config/config";

export const updateUserProfile = async (id: string, formdata: FormData ) => {
  const response = await axiosInstance.put(`/user/${id}`, formdata);
  return response.data;
}

export const getUserProfile = async (id: string) => {
  const response = await axiosInstance.get(`/user/${id}`);
  return response.data;
}

