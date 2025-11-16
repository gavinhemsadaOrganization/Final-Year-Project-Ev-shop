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
    getAllEvBrand: async () => {
        const response = await axiosPrivate.get('/ev/brands');
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
    updateListing: async (listingId: string, listingData: any) => {
        const response = await axiosPrivate.put(`/ev/listings/${listingId}`, listingData);
        return response.data;
    },
    deleteListing: async (id: string) => {
        const response = await axiosPrivate.delete(`/ev/listings/${id}`);
        return response.data;
    },
    deleteModel: async (id: string) => {
        const response = await axiosPrivate.delete(`/ev/models/${id}`);
        return response.data;
    },

};
