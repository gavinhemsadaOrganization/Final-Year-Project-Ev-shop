import { axiosPrivate } from "@/config/config";

// user profile operations
export const updateUserProfile = async (id: string, formdata: FormData ) => {
  const response = await axiosPrivate.put(`/user/${id}`, formdata);
  return response.data;
}
export const getUserProfile = async (id: string) => {
  const response = await axiosPrivate.get(`/user/${id}`);
  return response.data;
}

// cart operations
export const addToCart = async (productId: string, quantity: number) => {
  const response = await axiosPrivate.post(`/cart/items`, { productId, quantity });
  return response.data;
}
export const getUserCart = async (userId: string) => {
  const response = await axiosPrivate.get(`/cart/${userId}`);
  return response.data;
}
export const updateCartItem = async (itemId: string, quantity: number) => {
  const response = await axiosPrivate.put(`/cart/items/${itemId}`, { quantity });
  return response.data;
}
export const removeCartItem = async (itemId: string) => {
  const response = await axiosPrivate.delete(`/cart/items/${itemId}`);
  return response.data;
}
export const clearCart = async (userId: string) => {
  const response = await axiosPrivate.delete(`/cart/${userId}`);
  return response.data;
}

// orders operations

// ev list operations
export const getEVList = async () => {
  const response = await axiosPrivate.get(`/ev/listings`);
  return response.data;
}

// chatbot operations
export const sendMessageToChatbot = async (question: string) => {
  const response = await axiosPrivate.post(`/chatbot/ask`, { question });
  return response.data;
}

// financing operations
export const getFinancingOptions = async () => {
  const response = await axiosPrivate.get(`/financing/options`);
  return response.data;
}
export const getUserFinancingApplications = async (userId: string) => {
  const response = await axiosPrivate.get(`/financing/applications/${userId}`);
  return response.data;
}
export const submitFinancingApplication = async (applicationData: any) => {
  const response = await axiosPrivate.post(`/financing/apply`, applicationData);
  return response.data;
}
export const updateFinancingApplicationStatus = async (applicationId: string, status: string) => {
  const response = await axiosPrivate.put(`/financing/applications/${applicationId}`, { status });
  return response.data;
}
export const deleteFinancingApplication = async (applicationId: string) => {
  const response = await axiosPrivate.delete(`/financing/applications/${applicationId}`);
  return response.data;
}