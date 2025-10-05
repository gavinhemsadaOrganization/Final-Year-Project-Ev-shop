import {
  MaintenanceRecordDTO,
  UpdateMaintenanceRecordDTO,
} from "../dtos/maintenanceRecord.DTO";
import { IMaintenanceRecordRepository } from "../repositories/maintenanceRecord.repository";
import { ISellerRepository } from "../repositories/seller.repository";

export interface IMaintenanceRecordService {
  createRecord(
    data: MaintenanceRecordDTO
  ): Promise<{ success: boolean; record?: any; error?: string }>;
  getRecordById(
    id: string
  ): Promise<{ success: boolean; record?: any; error?: string }>;
  getRecordsBySellerId(
    sellerId: string
  ): Promise<{ success: boolean; records?: any[]; error?: string }>;
  getAllRecords(): Promise<{
    success: boolean;
    records?: any[];
    error?: string;
  }>;
  updateRecord(
    id: string,
    data: UpdateMaintenanceRecordDTO
  ): Promise<{ success: boolean; record?: any; error?: string }>;
  deleteRecord(id: string): Promise<{ success: boolean; error?: string }>;
}

export function maintenanceRecordService(
  repo: IMaintenanceRecordRepository,
  sellerRepo: ISellerRepository
): IMaintenanceRecordService {
  return {
    createRecord: async (data) => {
      try {
        const seller = await sellerRepo.findById(data.seller_id);
        if (!seller) return { success: false, error: "Seller not found" };
        const record = await repo.create(data);
        return { success: true, record };
      } catch (err) {
        return { success: false, error: "Failed to create maintenance record" };
      }
    },
    getRecordById: async (id) => {
      const record = await repo.findById(id);
      if (!record) return { success: false, error: "Record not found" };
      return { success: true, record };
    },
    getRecordsBySellerId: async (sellerId) => {
      const records = await repo.findBySellerId(sellerId);
      if (!records) return { success: false, error: "Records not found" };
      return { success: true, records };
    },
    getAllRecords: async () => {
      const records = await repo.findAll();
      if(!records) return { success: false, error: "Records not found" };
      return { success: true, records };
    },
    updateRecord: async (id, data) => {
      try {
        const record = await repo.update(id, data);
        if (!record) return { success: false, error: "Record not found" };
        return { success: true, record };
      } catch (err) {
        return { success: false, error: "Failed to update record" };
      }
    },
    deleteRecord: async (id) => {
      try {
        const success = await repo.delete(id);
        if (!success) return { success: false, error: "Record not found" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete record" };
      }
    },
  };
}
