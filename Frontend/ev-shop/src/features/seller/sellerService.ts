import { axiosPrivate } from "@/config/config";

export const sellerService = {
    getSellerProfile: async (id: string) => {
      const response = await axiosPrivate.get(`/seller/${id}`);
      return response.data;
    },
};
