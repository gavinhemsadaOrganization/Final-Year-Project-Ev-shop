import { Schema, model, Document, Types } from "mongoose";

/**
 * Represents a maintenance record for a vehicle, performed by a seller.
 */
export interface IMaintenanceRecord extends Document {
  /** The unique identifier for the maintenance record document. */
  _id: Types.ObjectId;
  /** The ID of the `Seller` who performed the maintenance. */
  seller_id: Types.ObjectId;
  /** The type of service performed (e.g., "Battery Check", "Tire Rotation"). */
  service_type: string;
  /** The date the service was performed. */
  service_date: Date;
  /** A detailed description of the service performed. This field is optional. */
  description?: string;
  /** An array of strings listing any parts that were replaced during the service. This field is optional. */
  parts_replaced?: string[];
  /** The location or address where the service was performed. This field is optional. */
  location?: string;
}

/**
 * Mongoose schema for the MaintenanceRecord collection.
 */
const MaintenanceRecordSchema = new Schema<IMaintenanceRecord>(
  {
    /** A reference to the `Seller` document who performed the service. */
    seller_id: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    /** The type of service, which is required. */
    service_type: { type: String, required: true },
    /** The date the service was performed, which is required. */
    service_date: { type: Date, required: true },
    /** An optional text description of the work done. */
    description: { type: String },
    /** An optional list of parts that were replaced. */
    parts_replaced: [{ type: String }],
    /** An optional string indicating the location of the service. */
    location: { type: String },
  },
  { timestamps: true }
);

/**
 * Creates indexes on key fields to optimize common query performance.
 * - `seller_id`: To quickly find all maintenance records for a specific seller.
 * - `service_date`: To sort records chronologically.
 * - `service_type`: To filter records by the type of service performed.
 */
MaintenanceRecordSchema.index({ seller_id: 1 });
MaintenanceRecordSchema.index({ service_date: -1 });
MaintenanceRecordSchema.index({ service_type: 1 });

/**
 * The Mongoose model for the MaintenanceRecord collection.
 */
export const MaintenanceRecord = model<IMaintenanceRecord>(
  "MaintenanceRecord",
  MaintenanceRecordSchema
);
