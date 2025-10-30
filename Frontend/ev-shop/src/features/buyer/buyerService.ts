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
export const placeOrder = async (orderData: any) => {
  const response = await axiosPrivate.post(`/order`, orderData);
  return response.data;
}
export const getUserOrders = async (userId: string) => {
  const response = await axiosPrivate.get(`/order/user/${userId}`);
  return response.data;
}
export const cancelOrder = async (id: string) => {
  const response = await axiosPrivate.delete(`/order/${id}/cancel`);
  return response.data;
}

// payment operations
export const createPaymentIntent = async (orderData: any) => {
  const response = await axiosPrivate.post(`/payment`, orderData);
  return response.data;
}
export const getPaymentByOrderId = async (orderId: string) => {
  const response = await axiosPrivate.get(`/payment/order/${orderId}`);
  return response.data;
}


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
export const getFinancingTypes = async () => {
  const response = await axiosPrivate.get(`/financial/institutions`);
  return response.data;
}
export const getFinancingOptions = async () => {
  const response = await axiosPrivate.get(`/financial/products`);
  return response.data;
}
export const getUserFinancingApplications = async (userId: string) => {
  const response = await axiosPrivate.get(`/financial/applications/user/${userId}`);
  return response.data;
}
export const submitFinancingApplication = async (applicationData: any) => {
  const response = await axiosPrivate.post(`/financial/applications`, applicationData);
  return response.data;
}
export const updateFinancingApplication = async (id: string, applicationData: any) => {
  const response = await axiosPrivate.put(`/financial/applications/${id}`, applicationData);
  return response.data;
}
export const deleteFinancingApplication = async (id: string) => {
  const response = await axiosPrivate.delete(`/financial/applications/${id}`);
  return response.data;
}

// services operations
export const getAvailableServices = async () => {   
  const response = await axiosPrivate.get(`/maintenance-records`);
  return response.data;
}

// notifications operations
export const getUserNotifications = async (userId: string) => {
  const response = await axiosPrivate.get(`/notification/user/${userId}`);
  return response.data;
}
export const markNotificationAsRead = async (id: string) => {
  const response = await axiosPrivate.patch(`/notification/${id}/read`);
  return response.data;
}

// community operations
export const getCommunityPosts = async () => {
  const response = await axiosPrivate.get(`/post/posts`);
  return response.data;
}
export const getCommunityPostbyUser = async (user_id: string) => {
  const response = await axiosPrivate.get(`/post/posts/user/${user_id}`);
  return response.data;
}
export const createCommunityPost = async (postData: any) => {
  const response = await axiosPrivate.post(`/post/post`, postData);
  return response.data;
}
export const updateCommunityPost = async (id: string, postData: any) => {
  const response = await axiosPrivate.put(`/post/post/${id}`, postData);
  return response.data;
}
export const deleteCommunityPost = async (id: string) => {
  const response = await axiosPrivate.delete(`/post/post/${id}`);
  return response.data;
}
export const postView = async (id: string) => {
  const response = await axiosPrivate.patch(`/post/post/${id}/views`);
  return response.data;
}
export const replyCount = async (id: string) => {
  const response = await axiosPrivate.patch(`/post/post/${id}/reply-count`);
  return response.data;
}
export const lastReplyBy = async (id: string) => {
  const response = await axiosPrivate.patch(`/post/post/${id}/last-reply-by`);
  return response.data;
}

// replies operations
export const getPostReplies = async (post_id: string) => {
  const response = await axiosPrivate.get(`/post/replies/post/${post_id}`);
  return response.data;
}
export const createPostReply = async (replyData: any) => {
  const response = await axiosPrivate.post(`/post/reply`, replyData);
  return response.data;
}
export const updatePostReply = async (id: string, replyData: any) => {
  const response = await axiosPrivate.put(`/post/reply/${id}`, replyData);
  return response.data;
}
export const deletePostReply = async (id: string) => {
  const response = await axiosPrivate.delete(`/post/reply/${id}`);
  return response.data;
}

// test drive operations
export const getTestDriveSlots = async () => {
  const response = await axiosPrivate.get(`/test-drive/slots/active`);
  return response.data;
}
export const getTestDriveByCustomer = async (customerId: string) => {
  const response = await axiosPrivate.get(`/test-drive/bookings/customer/${customerId}`);
  return response.data;
}
export const scheduleTestDrive = async (testDriveData: any) => {
  const response = await axiosPrivate.post(`/test-drive/bookings`, testDriveData);
  return response.data;
}
export const updateTestDrive = async (id: string, testDriveData: any) => {
  const response = await axiosPrivate.put(`/test-drive/bookings/${id}`, testDriveData);
  return response.data; 
}
export const cancelTestDrive = async (id: string) => {
  const response = await axiosPrivate.delete(`/test-drive/bookings/${id}`);
  return response.data;
}
export const rateTestDrive = async (ratingData: any) => {
  const response = await axiosPrivate.post(`/test-drive/ratings`, ratingData);
  return response.data;
}
export const updateTestDriveRating = async (id: string, ratingData: any) => {
  const response = await axiosPrivate.put(`/test-drive/ratings${id}`, ratingData);
  return response.data;
}
export const deleteTestDriveRating = async (id: string) => {
  const response = await axiosPrivate.delete(`/test-drive/ratings${id}`);
  return response.data;
}

// reviews operations
export const getUserReviews = async (reviewerId: string) => {
  const response = await axiosPrivate.get(`/review/reviews/reviewer/${reviewerId}`);
  return response.data;
}
export const createReview = async (reviewData: any) => {
  const response = await axiosPrivate.post(`/review/review`, reviewData);
  return response.data;
}
export const updateReview = async (id: string, reviewData: any) => {
  const response = await axiosPrivate.put(`/review/review/${id}`, reviewData);
  return response.data;
}
export const deleteReview = async (id: string) => {
  const response = await axiosPrivate.delete(`/review/review/${id}`);
  return response.data;
}