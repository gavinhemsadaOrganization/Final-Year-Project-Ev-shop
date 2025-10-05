import { EvBrand, IEvBrand } from "../models/EvBrand";
import { EvCategory, IEvCategory } from "../models/EvCategory";
import { EvModel, IEvModel } from "../models/EvModel";
import { VehicleListing, IVehicleListing } from "../models/VehicleListing";
import {
  EvBrandDTO,
  EvCategoryDTO,
  EvModelDTO,
  VehicleListingDTO,
  UpdateVehicleListingDTO,
} from "../dtos/ev.DTO";
import { Types } from "mongoose";

export interface IEvRepository {
  // Brand
  createBrand(data: EvBrandDTO): Promise<IEvBrand | null>;
  findAllBrands(): Promise<IEvBrand[]>;
  findBrandById(id: string): Promise<IEvBrand | null>;
  updateBrand(id: string, data: Partial<EvBrandDTO>): Promise<IEvBrand | null>;
  deleteBrand(id: string): Promise<boolean>;

  // Category
  createCategory(data: EvCategoryDTO): Promise<IEvCategory>;
  findAllCategories(): Promise<IEvCategory[]>;
  findCategoryById(id: string): Promise<IEvCategory | null>;
  updateCategory(
    id: string,
    data: Partial<EvCategoryDTO>
  ): Promise<IEvCategory | null>;
  deleteCategory(id: string): Promise<boolean>;

  // Model
  createModel(data: EvModelDTO): Promise<IEvModel>;
  findAllModels(): Promise<IEvModel[]>;
  findModelById(id: string): Promise<IEvModel | null>;
  findModelsByBrand(brandId: string): Promise<IEvModel[]>;
  updateModel(id: string, data: Partial<EvModelDTO>): Promise<IEvModel | null>;
  deleteModel(id: string): Promise<boolean>;

  // Listing
  createListing(data: VehicleListingDTO): Promise<IVehicleListing>;
  findAllListings(filters: any): Promise<IVehicleListing[]>;
  findListingById(id: string): Promise<IVehicleListing | null>;
  findListingsBySeller(sellerId: string): Promise<IVehicleListing[]>;
  updateListing(
    id: string,
    data: Partial<UpdateVehicleListingDTO>
  ): Promise<IVehicleListing | null>;
  deleteListing(id: string): Promise<boolean>;
}

export const EvRepository: IEvRepository = {
  // Brand
  createBrand: async (data) => {
    try{
       const brand = new EvBrand(data);
    console.log(brand);
    const result = await brand.save();
    console.log(result);
    return result;
    }
    catch(err){
      console.log(err);
      return null;
    }
   
    // return await brand.save();
  },
  findAllBrands: async () => EvBrand.find(),
  findBrandById: async (_id  ) => EvBrand.findById({_id }),
  updateBrand: async (id, data) => {
    return await EvBrand.findByIdAndUpdate(id, data, { new: true });
  },
  deleteBrand: async (id) => {
    const result = await EvBrand.findByIdAndDelete(id);
    return result !== null;
  },

  // Category
  createCategory: async (data) => {
    const category = new EvCategory(data);
    return await category.save();
  },
  findAllCategories: async () => EvCategory.find(),
  findCategoryById: async (id) => EvCategory.findById(id),
  updateCategory: async (id, data) => {
    return await EvCategory.findByIdAndUpdate(id, data, { new: true });
  },
  deleteCategory: async (id) => {
    const result = await EvCategory.findByIdAndDelete(id);
    return result !== null;
  },

  // Model
  createModel: async (data) => {
    const model = new EvModel(data);
    return await model.save();
  },
  findAllModels: async () =>
    EvModel.find().populate("brand_id").populate("category_id"),
  findModelById: async (id) =>
    EvModel.findById(id).populate("brand_id").populate("category_id"),
  findModelsByBrand: async (brandId) =>
    EvModel.find({ brand_id: new Types.ObjectId(brandId) }).populate(
      "category_id"
    ),
  updateModel: async (id, data) => {
    return await EvModel.findByIdAndUpdate(id, data, { new: true });
  },
  deleteModel: async (id) => {
    const result = await EvModel.findByIdAndDelete(id);
    return result !== null;
  },

  // Listing
  createListing: async (data) => {
    const listing = new VehicleListing(data);
    return await listing.save();
  },
  findAllListings: async (filters) => {
    // Basic filtering for active listings, can be expanded
    const query = { status: "active", ...filters };
    return await VehicleListing.find(query)
      .populate({
        path: "model_id",
        populate: [
          { path: "brand_id", select: "name" },
          { path: "category_id", select: "name" },
        ],
      })
      .populate("seller_id", "business_name")
      .sort({ createdAt: -1 });
  },
  findListingById: async (id) => {
    return await VehicleListing.findById(id)
      .populate({
        path: "model_id",
        populate: [
          { path: "brand_id", select: "name logo_url" },
          { path: "category_id", select: "name" },
        ],
      })
      .populate("seller_id", "business_name user_id");
  },
  findListingsBySeller: async (sellerId) => {
    return await VehicleListing.find({
      seller_id: new Types.ObjectId(sellerId),
    })
      .populate("model_id")
      .sort({ createdAt: -1 });
  },
  updateListing: async (id, data) => {
    return await VehicleListing.findByIdAndUpdate(id, data, { new: true });
  },
  deleteListing: async (id) => {
    // Soft delete by setting status to inactive
    const result = await VehicleListing.findByIdAndUpdate(id, {
      status: "inactive",
    });
    return result !== null;
  },
};
