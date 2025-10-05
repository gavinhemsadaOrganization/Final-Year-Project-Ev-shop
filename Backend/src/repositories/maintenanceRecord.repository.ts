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

export interface IMaintenanceRecordRepository {
  create(data: MaintenanceRecordDTO): Promise<IMaintenanceRecord | null>;
  findById(id: string): Promise<IMaintenanceRecord | null>;
  findBySellerId(sellerId: string): Promise<IMaintenanceRecord[] | null>;
  findAll(): Promise<IMaintenanceRecord[] | null>;
  update(
    id: string,
    data: Partial<UpdateMaintenanceRecordDTO>
  ): Promise<IMaintenanceRecord | null>;
  delete(id: string): Promise<boolean | null>;
}

export const MaintenanceRecordRepository: IMaintenanceRecordRepository = {
  create: withErrorHandling(async (data) => {
    const record = new MaintenanceRecord(data);
    return await record.save();
  }),
  findById:  withErrorHandling(async (id) => {
    return await MaintenanceRecord.findById(id).populate(
      "seller_id",
      "business_name"
    );
  }),
  findBySellerId:  withErrorHandling(async (sellerId) => {
    return await MaintenanceRecord.find({
      seller_id: new Types.ObjectId(sellerId),
    }).sort({ service_date: -1 });
  }),
  findAll:  withErrorHandling(async () => {
    return await MaintenanceRecord.find().sort({ service_date: -1 });
  }),
  update:  withErrorHandling(async (id, data) => {
    return await MaintenanceRecord.findByIdAndUpdate(id, data, { new: true });
  }),
  delete:  withErrorHandling(async (id) => {
    const result = await MaintenanceRecord.findByIdAndDelete(id);
    return result !== null;
  }),
};
