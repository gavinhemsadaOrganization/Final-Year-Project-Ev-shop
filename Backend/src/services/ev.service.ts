import {
  EvBrandDTO,
  EvCategoryDTO,
  EvModelDTO,
  VehicleListingDTO,
  UpdateVehicleListingDTO,
} from "../dtos/ev.DTO";
import { IEvRepository } from "../repositories/ev.repository";

export interface IEvService {
  // Brand
  createBrand(
    data: EvBrandDTO
  ): Promise<{ success: boolean; brand?: any; error?: string }>;
  getAllBrands(): Promise<{ success: boolean; brands?: any[]; error?: string }>;

  // Category
  createCategory(
    data: EvCategoryDTO
  ): Promise<{ success: boolean; category?: any; error?: string }>;
  getAllCategories(): Promise<{
    success: boolean;
    categories?: any[];
    error?: string;
  }>;

  // Model
  createModel(
    data: EvModelDTO
  ): Promise<{ success: boolean; model?: any; error?: string }>;
  getAllModels(): Promise<{ success: boolean; models?: any[]; error?: string }>;
  getModelById(
    id: string
  ): Promise<{ success: boolean; model?: any; error?: string }>;

  // Listing
  createListing(
    data: VehicleListingDTO
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
    data: UpdateVehicleListingDTO
  ): Promise<{ success: boolean; listing?: any; error?: string }>;
  deleteListing(id: string): Promise<{ success: boolean; error?: string }>;
}

export function evService(repo: IEvRepository): IEvService {
  const handleCreate = async (createFn: Function, data: any, type: string) => {
    try {
      const result = await createFn(data);
      return { success: true, [type]: result };
    } catch (err) {
      return { success: false, error: `Failed to create ${type}` };
    }
  };

  const handleGetAll = async (getAllFn: Function, type: string) => {
    try {
      const results = await getAllFn();
      return { success: true, [type]: results };
    } catch (err) {
      return { success: false, error: `Failed to fetch ${type}` };
    }
  };

  const handleGetById = async (
    getByIdFn: Function,
    id: string,
    type: string
  ) => {
    const result = await getByIdFn(id);
    if (!result) return { success: false, error: `${type} not found` };
    return { success: true, [type.replace("s", "")]: result };
  };

  return {
    // Brand
    createBrand: (data) => handleCreate(repo.createBrand, data, "brand"),
    getAllBrands: () => handleGetAll(repo.findAllBrands, "brands"),

    // Category
    createCategory: (data) =>
      handleCreate(repo.createCategory, data, "category"),
    getAllCategories: () => handleGetAll(repo.findAllCategories, "categories"),

    // Model
    createModel: (data) => handleCreate(repo.createModel, data, "model"),
    getAllModels: () => handleGetAll(repo.findAllModels, "models"),
    getModelById: (id) => handleGetById(repo.findModelById, id, "model"),

    // Listing
    createListing: (data) => handleCreate(repo.createListing, data, "listing"),
    getAllListings: async (filters) => {
      try {
        const listings = await repo.findAllListings(filters);
        return { success: true, listings };
      } catch (err) {
        return { success: false, error: "Failed to fetch listings" };
      }
    },
    getListingById: (id) => handleGetById(repo.findListingById, id, "listing"),
    getListingsBySeller: async (sellerId) => {
      try {
        const listings = await repo.findListingsBySeller(sellerId);
        return { success: true, listings };
      } catch (err) {
        return { success: false, error: "Failed to fetch seller listings" };
      }
    },
    updateListing: async (id, data) => {
      try {
        const listing = await repo.updateListing(id, data);
        if (!listing) return { success: false, error: "Listing not found" };
        return { success: true, listing };
      } catch (err) {
        return { success: false, error: "Failed to update listing" };
      }
    },
    deleteListing: async (id) => {
      try {
        const success = await repo.deleteListing(id);
        if (!success) return { success: false, error: "Listing not found" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete listing" };
      }
    },
  };
}
