import { Seller, ISeller } from "../models/Seller";
import { SellerDTO, UpdateSellerDTO } from "../dtos/seller.DTO";
import { Types } from "mongoose";

export interface ISellerRepository {
  create(data: SellerDTO): Promise<ISeller>;
  findById(id: string): Promise<ISeller | null>;
  findByUserId(userId: string): Promise<ISeller | null>;
  findAll(): Promise<ISeller[]>;
  update(id: string, data: Partial<UpdateSellerDTO>): Promise<ISeller | null>;
  delete(id: string): Promise<boolean>;
}

export const SellerRepository: ISellerRepository = {
  create: async (data: SellerDTO) => {
    const seller = new Seller(data);
    return await seller.save();
  },

  findById: async (id: string) => {
    return await Seller.findById(id).populate(
      "user_id",
      "name email profile_image"
    );
  },

  findByUserId: async (userId: string) => {
    return await Seller.findOne({
      user_id: new Types.ObjectId(userId),
    }).populate("user_id", "name email profile_image");
  },

  findAll: async () => {
    return await Seller.find().populate("user_id", "name email profile_image");
  },

  update: async (id: string, data: Partial<UpdateSellerDTO>) => {
    return await Seller.findByIdAndUpdate(id, data, { new: true });
  },

  delete: async (id: string) => {
    const result = await Seller.findByIdAndDelete(id);
    return result !== null;
  },
};
