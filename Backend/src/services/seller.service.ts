import { SellerDTO, UpdateSellerDTO } from "../dtos/seller.DTO";
import { ISellerRepository } from "../repositories/seller.repository";

export interface ISellerService {
  createSeller(
    data: SellerDTO
  ): Promise<{ success: boolean; seller?: any; error?: string }>;
  getSellerById(
    id: string
  ): Promise<{ success: boolean; seller?: any; error?: string }>;
  getSellerByUserId(
    userId: string
  ): Promise<{ success: boolean; seller?: any; error?: string }>;
  getAllSellers(): Promise<{
    success: boolean;
    sellers?: any[];
    error?: string;
  }>;
  updateSeller(
    id: string,
    data: UpdateSellerDTO
  ): Promise<{ success: boolean; seller?: any; error?: string }>;
  deleteSeller(id: string): Promise<{ success: boolean; error?: string }>;
}

export function sellerService(repo: ISellerRepository): ISellerService {
  return {
    createSeller: async (data) => {
      try {
        const existingSeller = await repo.findByUserId(data.user_id);
        if (existingSeller) {
          return { success: false, error: "User already has a seller profile" };
        }
        const seller = await repo.create(data);
        return { success: true, seller };
      } catch (err) {
        return { success: false, error: "Failed to create seller profile" };
      }
    },

    getSellerById: async (id) => {
      const seller = await repo.findById(id);
      if (!seller) return { success: false, error: "Seller not found" };
      return { success: true, seller };
    },

    getSellerByUserId: async (userId) => {
      const seller = await repo.findByUserId(userId);
      if (!seller)
        return {
          success: false,
          error: "Seller profile not found for this user",
        };
      return { success: true, seller };
    },

    getAllSellers: async () => {
      try {
        const sellers = await repo.findAll();
        return { success: true, sellers };
      } catch (err) {
        return { success: false, error: "Failed to retrieve sellers" };
      }
    },

    updateSeller: async (id, data) => {
      try {
        const seller = await repo.update(id, data);
        if (!seller) return { success: false, error: "Seller not found" };
        return { success: true, seller };
      } catch (err) {
        return { success: false, error: "Failed to update seller profile" };
      }
    },

    deleteSeller: async (id) => {
      try {
        const success = await repo.delete(id);
        if (!success) return { success: false, error: "Seller not found" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete seller profile" };
      }
    },
  };
}
