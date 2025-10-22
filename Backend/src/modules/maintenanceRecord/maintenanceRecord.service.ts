import {
  MaintenanceRecordDTO,
  UpdateMaintenanceRecordDTO,
} from "../../dtos/maintenanceRecord.DTO";
import { IMaintenanceRecordRepository } from "./maintenanceRecord.repository";
import { ISellerRepository } from "../seller/seller.repository";
import CacheService from "../../shared/cache/CacheService";

/**
 * Defines the interface for the maintenance record service, outlining methods for managing vehicle maintenance records.
 */
export interface IMaintenanceRecordService {
  /**
   * Creates a new maintenance record.
   * @param data - The data for the new maintenance record.
   * @returns A promise that resolves to an object containing the created record or an error.
   */
  createRecord(
    data: MaintenanceRecordDTO
  ): Promise<{ success: boolean; record?: any; error?: string }>;
  /**
   * Retrieves a maintenance record by its unique ID.
   * @param id - The ID of the record to find.
   * @returns A promise that resolves to an object containing the record data or an error.
   */
  getRecordById(
    id: string
  ): Promise<{ success: boolean; record?: any; error?: string }>;
  /**
   * Retrieves all maintenance records for a specific seller.
   * @param sellerId - The ID of the seller.
   * @returns A promise that resolves to an object containing an array of the seller's records or an error.
   */
  getRecordsBySellerId(
    sellerId: string
  ): Promise<{ success: boolean; records?: any[]; error?: string }>;
  /**
   * Retrieves all maintenance records from the system.
   * @returns A promise that resolves to an object containing an array of all records or an error.
   */
  getAllRecords(): Promise<{
    success: boolean;
    records?: any[];
    error?: string;
  }>;
  /**
   * Updates an existing maintenance record.
   * @param id - The ID of the record to update.
   * @param data - The data to update the record with.
   * @returns A promise that resolves to an object containing the updated record data or an error.
   */
  updateRecord(
    id: string,
    data: UpdateMaintenanceRecordDTO
  ): Promise<{ success: boolean; record?: any; error?: string }>;
  /**
   * Deletes a maintenance record by its unique ID.
   * @param id - The ID of the record to delete.
   * @returns A promise that resolves to an object indicating success or failure.
   */
  deleteRecord(id: string): Promise<{ success: boolean; error?: string }>;
}

/**
 * Factory function to create an instance of the maintenance record service.
 * It encapsulates the business logic for managing maintenance records, including caching strategies
 * to improve performance.
 *
 * @param repo - The repository for maintenance record data access.
 * @param sellerRepo - The repository for seller data access.
 * @returns An implementation of the IMaintenanceRecordService interface.
 */
export function maintenanceRecordService(
  repo: IMaintenanceRecordRepository,
  sellerRepo: ISellerRepository
): IMaintenanceRecordService {
  return {
    /**
     * Creates a new maintenance record after validating the seller exists.
     * It invalidates relevant record caches to ensure data consistency.
     */
    createRecord: async (data) => {
      try {
        const seller = await sellerRepo.findById(data.seller_id);
        if (!seller) return { success: false, error: "Seller not found" };
        const record = await repo.create(data);

        // Invalidate caches for all records and the seller's records
        await Promise.all([
          CacheService.delete("records"),
          CacheService.delete(`records_seller_${data.seller_id}`),
        ]);

        return { success: true, record };
      } catch (err) {
        return { success: false, error: "Failed to create maintenance record" };
      }
    },
    /**
     * Finds a single maintenance record by its ID, using a cache-aside pattern.
     * Caches the individual record data for one hour.
     */
    getRecordById: async (id) => {
      try {
        const cacheKey = `record_${id}`;
        // Attempt to get from cache, otherwise fetch from repository and set cache.
        const record = await CacheService.getOrSet(
          cacheKey,
          async () => {
            const recordData = await repo.findById(id);
            return recordData ?? null;
          },
          3600 // Cache for 1 hour
        );
        if (!record) return { success: false, error: "Record not found" };
        return { success: true, record };
      } catch (err) {
        return { success: false, error: "Failed to fetch record" };
      }
    },
    /**
     * Finds all records for a specific seller, using a cache-aside pattern.
     * Caches the list of records for that seller for one hour.
     */
    getRecordsBySellerId: async (sellerId) => {
      try {
        const cacheKey = `records_seller_${sellerId}`;
        // Attempt to get from cache, otherwise fetch from repository and set cache.
        const records = await CacheService.getOrSet(
          cacheKey,
          async () => {
            const recordsData = await repo.findBySellerId(sellerId);
            return recordsData ?? [];
          },
          3600 // Cache for 1 hour
        );
        if (!records) return { success: false, error: "Records not found" };
        return { success: true, records };
      } catch (err) {
        return { success: false, error: "Failed to fetch records" };
      }
    },
    /**
     * Retrieves all maintenance records, utilizing a cache-aside pattern.
     * Caches the list of all records for one hour.
     */
    getAllRecords: async () => {
      try {
        const cacheKey = "records";
        // Attempt to get from cache, otherwise fetch from repository and set cache.
        const records = await CacheService.getOrSet(
          cacheKey,
          async () => {
            const recordsData = await repo.findAll();
            return recordsData ?? [];
          },
          3600 // Cache for 1 hour
        );
        if (!records) return { success: false, error: "Records not found" };
        return { success: true, records };
      } catch (err) {
        return { success: false, error: "Failed to fetch records" };
      }
    },
    /**
     * Updates a maintenance record's information.
     * Invalidates all caches related to this record to ensure data consistency.
     */
    updateRecord: async (id, data) => {
      try {
        // Fetch the existing record to get its seller_id for cache invalidation.
        const existingRecord = await repo.findById(id);
        if (!existingRecord)
          return { success: false, error: "Record not found" };

        const record = await repo.update(id, data);
        if (!record) return { success: false, error: "Record not found" };

        // Invalidate all relevant caches
        await Promise.all([
          CacheService.delete(`record_${id}`),
          CacheService.delete("records"),
          CacheService.delete(`records_seller_${existingRecord.seller_id}`),
        ]);

        return { success: true, record };
      } catch (err) {
        return { success: false, error: "Failed to update record" };
      }
    },
    /**
     * Deletes a maintenance record from the system.
     * Invalidates all caches related to this record before deletion.
     */
    deleteRecord: async (id) => {
      try {
        // Fetch the existing record to get its seller_id for cache invalidation.
        const existingRecord = await repo.findById(id);
        if (!existingRecord)
          return { success: false, error: "Record not found" };

        const success = await repo.delete(id);
        if (!success) return { success: false, error: "Record not found" };

        // Invalidate all relevant caches
        await Promise.all([
          CacheService.delete(`record_${id}`),
          CacheService.delete("records"),
          CacheService.delete(`records_seller_${existingRecord.seller_id}`),
        ]);

        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete record" };
      }
    },
  };
}
