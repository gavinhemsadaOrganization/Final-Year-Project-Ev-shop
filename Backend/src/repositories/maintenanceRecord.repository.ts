import {
  MaintenanceRecord,
  IMaintenanceRecord,
} from "../models/MaintenanceRecord";
import {
  MaintenanceRecordDTO,
  UpdateMaintenanceRecordDTO,
} from "../dtos/maintenanceRecord.DTO";
import { Types } from "mongoose";
import { withErrorHandling } from "../utils/CustomException";

/**
 * Defines the contract for the maintenance record repository, specifying the methods for data access operations related to maintenance records.
 */
export interface IMaintenanceRecordRepository {
  /**
   * Creates a new maintenance record.
   * @param data - The DTO containing the details for the new record.
   * @returns A promise that resolves to the created maintenance record document or null.
   */
  create(data: MaintenanceRecordDTO): Promise<IMaintenanceRecord | null>;
  /**
   * Finds a maintenance record by its unique ID.
   * @param id - The ID of the record to find.
   * @returns A promise that resolves to the maintenance record document or null if not found.
   */
  findById(id: string): Promise<IMaintenanceRecord | null>;
  /**
   * Finds all maintenance records for a specific seller.
   * @param sellerId - The ID of the seller.
   * @returns A promise that resolves to an array of maintenance record documents or null.
   */
  findBySellerId(sellerId: string): Promise<IMaintenanceRecord[] | null>;
  /**
   * Retrieves all maintenance records from the database.
   * @returns A promise that resolves to an array of all maintenance record documents or null.
   */
  findAll(): Promise<IMaintenanceRecord[] | null>;
  /**
   * Updates an existing maintenance record.
   * @param id - The ID of the record to update.
   * @param data - The partial DTO containing the fields to update.
   * @returns A promise that resolves to the updated maintenance record document or null.
   */
  update(
    id: string,
    data: Partial<UpdateMaintenanceRecordDTO>
  ): Promise<IMaintenanceRecord | null>;
  /**
   * Deletes a maintenance record by its unique ID.
   * @param id - The ID of the record to delete.
   * @returns A promise that resolves to true if deletion was successful, otherwise false.
   */
  delete(id: string): Promise<boolean | null>;
}

/**
 * The concrete implementation of the IMaintenanceRecordRepository interface.
 * Each method is wrapped with a higher-order function `withErrorHandling` to ensure
 * consistent error management across the repository.
 */
export const MaintenanceRecordRepository: IMaintenanceRecordRepository = {
  /** Creates a new MaintenanceRecord document. */
  create: withErrorHandling(async (data) => {
    const record = new MaintenanceRecord(data);
    return await record.save();
  }),
  /** Finds a single maintenance record by its document ID and populates the seller's business name. */
  findById: withErrorHandling(async (id) => {
    return await MaintenanceRecord.findById(id).populate(
      "seller_id",
      "business_name"
    );
  }),
  /** Finds all maintenance records for a specific seller, sorted by most recent service date. */
  findBySellerId: withErrorHandling(async (sellerId) => {
    return await MaintenanceRecord.find({
      seller_id: new Types.ObjectId(sellerId),
    }).sort({ service_date: -1 });
  }),
  /** Retrieves all maintenance records, sorted by most recent service date. */
  findAll: withErrorHandling(async () => {
    return await MaintenanceRecord.find().sort({ service_date: -1 });
  }),
  /** Finds a maintenance record by ID and updates it with new data. */
  update: withErrorHandling(async (id, data) => {
    return await MaintenanceRecord.findByIdAndUpdate(id, data, { new: true });
  }),
  /** Deletes a maintenance record by its document ID. */
  delete: withErrorHandling(async (id) => {
    const result = await MaintenanceRecord.findByIdAndDelete(id);
    return result !== null;
  }),
};
