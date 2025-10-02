import { SellerDTO, UpdateSellerDTO } from "../dtos/seller.DTO";
import { ISellerRepository } from "../repositories/seller.repository";
import { container } from "tsyringe";
import { IUserRepository } from "../repositories/user.repository";
import { IReviewRepository } from "../repositories/review.repository";
import { UserRole } from "../enum/enum";

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
  updateRatingAndReviewCount(
    id: string
  ): Promise<{ success: boolean; seller?: any; error?: string }>;
  updateSeller(
    id: string,
    data: UpdateSellerDTO
  ): Promise<{ success: boolean; seller?: any; error?: string }>;
  deleteSeller(id: string): Promise<{ success: boolean; error?: string }>;
}

export function sellerService(repo: ISellerRepository, userRepo: IUserRepository, reviwRepo: IReviewRepository): ISellerService {
  return {
    createSeller: async (data) => {
      try {
        const existingSeller = await repo.findByUserId(data.user_id);
        if (existingSeller) {
          return { success: false, error: "User already has a seller profile" };
        }
        const seller = await repo.create(data);
        const user = await userRepo.findById(data.user_id);
        if (!user) return { success: false, error: "User not found" };
        user.role.push(UserRole.SELLER);

        const updatedUser = await user.save();
        if (!updatedUser)
          return { success: false, error: "Failed to update user role" };

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
    updateRatingAndReviewCount: async (id) => {
      try {
        const reviews = await reviwRepo.getAllReviews();
        if (!reviews)
          return { success: false, error: "Failed to retrieve reviews" };
        let rating = 0;
        let reviewCount = 0;
        reviews.forEach((element) => {
          const order: any = element.order_id;
          if (order?.seller_id?.toString() === id) {
            reviewCount++;
            rating += element.rating;
          }
        });

        const avgRating = reviewCount > 0 ? rating / reviewCount : 0;

        const seller = await repo.updateRatingAndReviewCount(
          id,
          avgRating,
          reviewCount
        );
        if (!seller)
          return {
            success: false,
            error: "Failed to retrieve reviewscount and rating",
          };
        return { success: true, seller };
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
