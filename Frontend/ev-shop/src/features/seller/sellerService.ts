import { axiosPrivate } from "@/config/config";

export const sellerService = {
    getSellerProfile: async (userId: string) => {
      const response = await axiosPrivate.get(`/seller/user/${userId}`);
      return response.data;
    },
    getSellerEvList: async (sellerId: string) => {
        const response = await axiosPrivate.get(`/ev/listings/seller/${sellerId}`);
        return response.data;
    },
    getAllEvCateogry: async () => {
        const response = await axiosPrivate.get('/ev/categories');
        return response.data;
    },
    createnewBrand: async (barngdata: any) => {
        const response = await axiosPrivate.post('/ev/brands', barngdata);
        return response.data;
    },
    createnewModel: async (modelData: any) => {
        const response = await axiosPrivate.post('/ev/models', modelData);
        return response.data;
    },
    createListing: async (listingData: any) => {
        const response = await axiosPrivate.post('/ev/listings', listingData);
        return response.data;
    },
};
