import { Multer } from "multer";
import {
  EvBrandDTO,
  EvCategoryDTO,
  EvModelDTO,
  VehicleListingDTO,
  UpdateVehicleListingDTO,
} from "../dtos/ev.DTO";
import { IEvRepository } from "../repositories/ev.repository";
import { addImage, addImages, deleteImage, deleteImages } from "../utils/imageHandel";
import { ISellerRepository } from "../repositories/seller.repository";

export interface IEvService {
  // Brand
  createBrand(
    data: EvBrandDTO,
    file: Express.Multer.File
  ): Promise<{ success: boolean; brand?: any; error?: string }>;
  getAllBrands(): Promise<{ success: boolean; brands?: any[]; error?: string }>;
  getById(id: string) : Promise<{ success: boolean; brand?: any; error?: string }>;
  updateBrand(
    id: string,
    data: Partial<EvBrandDTO>,
    file : Express.Multer.File
  ): Promise<{ success: boolean; brand?: any; error?: string }>;
  deleteBrand(id: string): Promise<{ success: boolean; error?: string }>;

  // Category
  createCategory(
    data: EvCategoryDTO,
  ): Promise<{ success: boolean; category?: any; error?: string }>;
  getAllCategories(): Promise<{
    success: boolean;
    categories?: any[];
    error?: string;
  }>;
  getCategoryByid(id: string) : Promise<{ success: boolean; category?: any; error?: string }>;
  updateCategory(
    id: string,
    data: Partial<EvCategoryDTO>
  ): Promise<{ success: boolean; category?: any; error?: string }>;
  deleteCategory(id: string): Promise<{ success: boolean; error?: string }>;

  // Model
  createModel(
    data: EvModelDTO,
    file: Express.Multer.File[]
  ): Promise<{ success: boolean; model?: any; error?: string }>;
  getAllModels(): Promise<{ success: boolean; models?: any[]; error?: string }>;
  getModelById(
    id: string
  ): Promise<{ success: boolean; model?: any; error?: string }>;
  updateModel(
    id: string,
    data: Partial<EvModelDTO>,
    file?: Express.Multer.File[]
  ): Promise<{ success: boolean; model?: any; error?: string }>;
  deleteModel(id: string): Promise<{ success: boolean; error?: string }>;

  // Listing
  createListing(
    data: VehicleListingDTO,
    file?: Express.Multer.File[]
  ): Promise<{ success: boolean; listing?: any; error?: string }>;
  getAllListings(
    filters: any
  ): Promise<{ success: boolean; listings?: any[]; error?: string }>;
  getListingById(
    id: string
  ): Promise<{ success: boolean; listing?: any; error?: string }>;
  getListingsBySeller(
    sellerId: string
  ): Promise<{ success: boolean; listings?: any[]; error?: string }>;
  updateListing(
    id: string,
    data: UpdateVehicleListingDTO,
    file?: Express.Multer.File[]
  ): Promise<{ success: boolean; listing?: any; error?: string }>;
  deleteListing(id: string): Promise<{ success: boolean; error?: string }>;
}

export function evService(repo: IEvRepository, sellerRepo: ISellerRepository): IEvService {
  const bandFolder = "EvBrand";
  const modelFolder = "EvCategory";
  const listingFolder = "EvListing";
  return {
    // Brand
    createBrand: async (data, file) => {
      try {
        let url = "";
        if (file) url = addImage(file, bandFolder);
        const barndata = {
          ...data,
          brand_logo: url,
        };
        const brand = await repo.createBrand(barndata);
        return { success: true, brand };
      } catch (err) {
        return { success: false, error: "Failed to create brand" };
      }
    },
    getAllBrands: async () => {
      try {
        const brands = await repo.findAllBrands();
        return { success: true, brands };
      } catch (err) {
        return { success: false, error: "Failed to fetch brands" };
      }
    },
    getById: async (id) => {
      try {
        const brand = await repo.findBrandById(id);
        if (!brand) return { success: false, error: "Brand not found" };
        return { success: true, brand };
      } catch (err) {
        return { success: false, error: "Failed to fetch brand" };
      }
    },
    updateBrand: async (id, data, file) => {
      try {
        const existing = await repo.findBrandById(id);
        if (!existing) return { success: false, error: "Brand not found" };
        let url = "";
        if(file){
          if(existing.brand_logo) deleteImage(existing.brand_logo);
          url = addImage(file, bandFolder)
        }
        const updateDate = {
          ...data,
          brand_logo: url,
        }
        const brand = await repo.updateBrand(id, updateDate);
        if (!brand) return { success: false, error: "Failed to update brand" };
        return { success: true, brand };
      } catch (err) {
        return { success: false, error: "Failed to update brand" };
      }
    },
    deleteBrand: async (id) => {
      try {
        const existing = await repo.findBrandById(id);
        if (!existing) return { success: false, error: "Brand not found" };
        if (existing.brand_logo) deleteImage(existing.brand_logo);
        const success = await repo.deleteBrand(id);
        if (!success)
          return { success: false, error: "Failed to delete brand" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete brand" };
      }
    },

    // Category
    createCategory: async (data) => {
      try {
        const category = await repo.createCategory(data);
        return { success: true, category };
      } catch (err) {
        return { success: false, error: "Failed to create category" };
      }
    },
    getAllCategories: async () => {
      try {
        const categories = await repo.findAllCategories();
        return { success: true, categories };
      } catch (err) {
        return { success: false, error: "Failed to fetch categories" };
      }
    },
    getCategoryByid: async (id) => {
      try {
        const category = await repo.findCategoryById(id); 
        if(!category) return { success: false, error: "Category not found" };
        return { success: true, category };
      }
      catch(err){
        return { success: false, error: "Failed to fetch category" };
      }
    },
    updateCategory: async (id, data) => {
      try {
        const existing = await repo.findCategoryById(id);
        if (!existing) return { success: false, error: "Category not found" };
        const category = await repo.updateCategory(id, data);
        if (!category)
          return { success: false, error: "Failed to update category" };
        return { success: true, category };
      } catch (err) {
        return { success: false, error: "Failed to update category" };
      }
    },
    deleteCategory: async (id) => {
      try {
        const existing = await repo.findCategoryById(id);
        if (!existing) return { success: false, error: "Category not found" };
        const success = await repo.deleteCategory(id);
        if (!success)
          return { success: false, error: "Failed to delete category" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete category" };
      }
    },

    // Model
    createModel: async (data, file) => {
      try {
        const existingBrand = await repo.findBrandById(data.brand_id);
        if (!existingBrand) return { success: false, error: "Brand not found" };
        const existingCategory = await repo.findCategoryById(data.category_id);
        if (!existingCategory)
          return { success: false, error: "Category not found" };
        let url: string[] = [];
        if (file) url = addImages(file, modelFolder);
        const modelData = {
          ...data,
          images: url,
        };
        const model = await repo.createModel(modelData);
        return { success: true, model };
      } catch (err) {
        return { success: false, error: "Failed to create model" };
      }
    },
    getAllModels: async () => {
      try {
        const models = await repo.findAllModels();
        return { success: true, models };
      } catch (err) {
        return { success: false, error: "Failed to fetch models" };
      }
    },
    getModelById: async (id) => {
      try {
        const model = await repo.findModelById(id);
        if (!model) return { success: false, error: "Model not found" };
        return { success: true, model };
      } catch (err) {
        return { success: false, error: "Failed to fetch model" };
      }
    },
    updateModel: async (id, data, file) => {
      try {
        const existing = await repo.findModelById?.(id);
        if (!existing) return { success: false, error: "Model not found" };
        let url: string[] = [];
        if(file){
          if(existing.images) deleteImages(existing.images);
          url = addImages(file, modelFolder);
        }
        const updateData = {
          ...data,
          images: url,
        }
        const model = await repo.updateModel(id, updateData);
        if (!model) return { success: false, error: "Failed to update model" };
        return { success: true, model };
      } catch (err) {
        return { success: false, error: "Failed to update model" };
      }
    },
    deleteModel: async (id) => {
      try {
        const existing = await repo.findModelById?.(id);
        if (!existing) return { success: false, error: "Model not found" };
        if(existing.images) deleteImages(existing.images);
        const success = await repo.deleteModel(id);
        if (!success)
          return { success: false, error: "Failed to delete model" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete model" };
      }
    },

    // Listing
    createListing: async (data, file) => {
      try {
        const existingSeller = await sellerRepo.findById(data.seller_id);
        if (!existingSeller)
          return { success: false, error: "Seller not found" };
        let url: string[] = [];
        if (file) url = addImages(file, listingFolder);
        const listingData = {
          ...data,
          images: url,
        };
        const listing = await repo.createListing(listingData);
        return { success: true, listing };
      } catch (err) {
        return { success: false, error: "Failed to create listing" };
      }
    },
    getAllListings: async (filters) => {
      try {
        const listings = await repo.findAllListings(filters);
        return { success: true, listings };
      } catch (err) {
        return { success: false, error: "Failed to fetch listings" };
      }
    },
    getListingById: async (id) => {
      try {
        const listing = await repo.findListingById(id);
        if (!listing) return { success: false, error: "Listing not found" };
        return { success: true, listing };
      } catch (err) {
        return { success: false, error: "Failed to fetch listing" };
      }
    },
    getListingsBySeller: async (sellerId) => {
      try {
        const listings = await repo.findListingsBySeller(sellerId);
        return { success: true, listings };
      } catch (err) {
        return { success: false, error: "Failed to fetch seller listings" };
      }
    },
    updateListing: async (id, data, file) => {
      try {
        const existing = await repo.findListingById?.(id);
        if (!existing) return { success: false, error: "Listing not found" };
        let url: string[] = [];
        if(file){
          if(existing.images) deleteImages(existing.images);
          url = addImages(file, listingFolder)
        }
        const updateData = {
          ...data,
          images: url,
        }
        const listing = await repo.updateListing(id, updateData);
        if (!listing)
          return { success: false, error: "Failed to update listing" };
        return { success: true, listing };
      } catch (err) {
        return { success: false, error: "Failed to update listing" };
      }
    },
    deleteListing: async (id) => {
      try {
        const existing = await repo.findListingById?.(id);
        if (!existing) return { success: false, error: "Listing not found" };
        if(existing.images) deleteImages(existing.images);
        const success = await repo.deleteListing(id);
        if (!success)
          return { success: false, error: "Failed to delete listing" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete listing" };
      }
    },
  };
}
