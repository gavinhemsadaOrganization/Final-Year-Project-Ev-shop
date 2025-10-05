import { Seller, ISeller } from "../models/Seller";
import { SellerDTO, UpdateSellerDTO } from "../dtos/seller.DTO";
import { Types } from "mongoose";
import { withErrorHandling } from "../utils/CustomException";

export interface ISellerRepository {
  create(data: SellerDTO): Promise<ISeller | null>;
  findById(id: string): Promise<ISeller | null>;
  findByUserId(userId: string): Promise<ISeller | null>;
  findAll(): Promise<ISeller[] | null>;
  updateRatingAndReviewCount(
    id: string,
    rating: number,
    reviewCount: number
  ): Promise<ISeller | null>;
  update(id: string, data: Partial<UpdateSellerDTO>): Promise<ISeller | null>;
  delete(id: string): Promise<boolean | null>;
}

export const SellerRepository: ISellerRepository = {
  create: withErrorHandling(async (data: SellerDTO) => {
    const seller = new Seller(data);
    return await seller.save();
  }),

  findById: withErrorHandling(async (id: string) => {
    return await Seller.findById(id).populate(
      "user_id"
    );
  }),

  findByUserId: withErrorHandling(async (userId: string) => {
    return await Seller.findOne({
      user_id: new Types.ObjectId(userId),
    }).populate("user_id");
  }),

  findAll: withErrorHandling(async () => {
    return await Seller.find().populate("user_id");
  }),
  updateRatingAndReviewCount: withErrorHandling(async (
    id: string,
    rating: number,
    reviewCount: number
  ) => {
    return await Seller.findByIdAndUpdate(
      id,
      { rating, total_reviews: reviewCount },
      { new: true }
    );
  }),
  update: withErrorHandling(async (id: string, data: Partial<UpdateSellerDTO>) => {
    return await Seller.findByIdAndUpdate(id, data, { new: true });
  }),

  delete: withErrorHandling(async (id: string) => {
    const result = await Seller.findByIdAndDelete(id);
    return result !== null;
  }),
};
