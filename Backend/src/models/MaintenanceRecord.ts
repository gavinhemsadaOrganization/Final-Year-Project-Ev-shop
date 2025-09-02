import { Schema, model, Document, Types } from 'mongoose';

export interface IMaintenanceRecord extends Document {
  _id: Types.ObjectId;
  seller_id: Types.ObjectId;
  service_type: string;
  service_date: Date;
  description?: string;
  parts_replaced?: string[];
  location?: string;
}

const MaintenanceRecordSchema = new Schema<IMaintenanceRecord>({
  seller_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  service_type: { type: String, required: true },
  service_date: { type: Date, required: true },
  description: { type: String },
  parts_replaced: [{ type: String }],
  location: { type: String },
}, { timestamps: true });

export default model<IMaintenanceRecord>('MaintenanceRecord', MaintenanceRecordSchema);
