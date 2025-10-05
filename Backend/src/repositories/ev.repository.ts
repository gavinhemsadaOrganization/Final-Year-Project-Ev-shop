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
import { withErrorHandling } from "../utils/CustomException";

export interface IEvRepository {
  // Brand
  createBrand(data: EvBrandDTO): Promise<IEvBrand | null>;
  findAllBrands(): Promise<IEvBrand[] | null>;
  findBrandById(id: string): Promise<IEvBrand | null>;
  updateBrand(id: string, data: Partial<EvBrandDTO>): Promise<IEvBrand | null>;
  deleteBrand(id: string): Promise<boolean | null>;

  // Category
  createCategory(data: EvCategoryDTO): Promise<IEvCategory | null>;
  findAllCategories(): Promise<IEvCategory[] | null>;
  findCategoryById(id: string): Promise<IEvCategory | null>;
  updateCategory(
    id: string,
    data: Partial<EvCategoryDTO>
  ): Promise<IEvCategory | null>;
  deleteCategory(id: string): Promise<boolean | null>;

  // Model
  createModel(data: EvModelDTO): Promise<IEvModel | null>;
  findAllModels(): Promise<IEvModel[] | null>;
  findModelById(id: string): Promise<IEvModel | null>;
  findModelsByBrand(brandId: string): Promise<IEvModel[] | null>;
  updateModel(id: string, data: Partial<EvModelDTO>): Promise<IEvModel | null>;
  deleteModel(id: string): Promise<boolean | null>;

  // Listing
  createListing(data: VehicleListingDTO): Promise<IVehicleListing | null>;
  findAllListings(filters: any): Promise<IVehicleListing[] | null>;
  findListingById(id: string): Promise<IVehicleListing | null>;
  findListingsBySeller(sellerId: string): Promise<IVehicleListing[] | null>;
  updateListing(
    id: string,
    data: Partial<UpdateVehicleListingDTO>
  ): Promise<IVehicleListing | null>;
  deleteListing(id: string): Promise<boolean | null>;
}

export const EvRepository: IEvRepository = {
  // Brand
  createBrand: withErrorHandling(async (data) => {
    const brand = new EvBrand(data);
    return await brand.save();
  }),
  findAllBrands: withErrorHandling(async () => EvBrand.find()),
  findBrandById: withErrorHandling(async (_id) => EvBrand.findById({ _id })),
  updateBrand: withErrorHandling(async (id, data) =>
    EvBrand.findByIdAndUpdate(id, data, { new: true })
  ),
  deleteBrand: withErrorHandling(async (id) => {
    const result = await EvBrand.findByIdAndDelete(id);
    return result !== null;
  }),

  // Category
  createCategory: withErrorHandling(async (data) => {
    const category = new EvCategory(data);
    return await category.save();
  }),
  findAllCategories: withErrorHandling(async () => EvCategory.find()),
  findCategoryById: withErrorHandling(async (id) => EvCategory.findById(id)),
  updateCategory: withErrorHandling(async (id, data) =>
    EvCategory.findByIdAndUpdate(id, data, { new: true })
  ),
  deleteCategory: withErrorHandling(async (id) => {
    const result = await EvCategory.findByIdAndDelete(id);
    return result !== null;
  }),

  // Model
  createModel: withErrorHandling(async (data) => {
    const model = new EvModel(data);
    return await model.save();
  }),
  findAllModels: withErrorHandling(async () =>
    EvModel.find().populate("brand_id").populate("category_id")
  ),
  findModelById: withErrorHandling(async (id) =>
    EvModel.findById(id).populate("brand_id").populate("category_id")
  ),
  findModelsByBrand: withErrorHandling(async (brandId) =>
    EvModel.find({ brand_id: new Types.ObjectId(brandId) }).populate(
      "category_id"
    )
  ),
  updateModel: withErrorHandling(async (id, data) =>
    EvModel.findByIdAndUpdate(id, data, { new: true })
  ),
  deleteModel: withErrorHandling(async (id) => {
    const result = await EvModel.findByIdAndDelete(id);
    return result !== null;
  }),

  // Listing
  createListing: withErrorHandling(async (data) => {
    const listing = new VehicleListing(data);
    return await listing.save();
  }),
  findAllListings: withErrorHandling(async (filters) => {
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
  }),
  findListingById: withErrorHandling(async (id) => {
    return await VehicleListing.findById(id)
      .populate({
        path: "model_id",
        populate: [
          { path: "brand_id", select: "name logo_url" },
          { path: "category_id", select: "name" },
        ],
      })
      .populate("seller_id", "business_name user_id");
  }),
  findListingsBySeller: withErrorHandling(async (sellerId) => {
    return await VehicleListing.find({
      seller_id: new Types.ObjectId(sellerId),
    })
      .populate("model_id")
      .sort({ createdAt: -1 });
  }),
  updateListing: withErrorHandling(async (id, data) =>
    VehicleListing.findByIdAndUpdate(id, data, { new: true })
  ),
  deleteListing: withErrorHandling(async (id) => {
    // Soft delete by setting status to inactive
    const result = await VehicleListing.findByIdAndUpdate(id, {
      status: "inactive",
    });
    return result !== null;
  }),
};
