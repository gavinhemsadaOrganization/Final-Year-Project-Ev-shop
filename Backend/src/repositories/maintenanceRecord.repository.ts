import {
  MaintenanceRecord,
  IMaintenanceRecord,
} from "../models/MaintenanceRecord";
import {
  MaintenanceRecordDTO,
  UpdateMaintenanceRecordDTO,
} from "../dtos/maintenanceRecord.DTO";
import { Types } from "mongoose";

export interface IMaintenanceRecordRepository {
  create(data: MaintenanceRecordDTO): Promise<IMaintenanceRecord>;
  findById(id: string): Promise<IMaintenanceRecord | null>;
  findBySellerId(sellerId: string): Promise<IMaintenanceRecord[]>;
  findAll(): Promise<IMaintenanceRecord[]>;
  update(
    id: string,
    data: Partial<UpdateMaintenanceRecordDTO>
  ): Promise<IMaintenanceRecord | null>;
  delete(id: string): Promise<boolean>;
}

export const MaintenanceRecordRepository: IMaintenanceRecordRepository = {
  create: async (data) => {
    const record = new MaintenanceRecord(data);
    return await record.save();
  },
  findById: async (id) => {
    return await MaintenanceRecord.findById(id).populate(
      "seller_id",
      "business_name"
    );
  },
  findBySellerId: async (sellerId) => {
    return await MaintenanceRecord.find({
      seller_id: new Types.ObjectId(sellerId),
    }).sort({ service_date: -1 });
  },
  findAll: async () => {
    return await MaintenanceRecord.find().sort({ service_date: -1 });
  },
  update: async (id, data) => {
    return await MaintenanceRecord.findByIdAndUpdate(id, data, { new: true });
  },
  delete: async (id) => {
    const result = await MaintenanceRecord.findByIdAndDelete(id);
    return result !== null;
  },
};
