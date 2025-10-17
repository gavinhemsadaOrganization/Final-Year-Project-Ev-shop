import { Schema, model, Document, Types } from "mongoose";

/**
 * Represents a time slot available for a test drive in the database.
 * Each document defines a specific time and location where a seller offers a test drive for a particular EV model.
 */
export interface ITestDriveSlot extends Document {
  /** The unique identifier for the test drive slot document. */
  _id: Types.ObjectId;
  /** The ID of the `Seller` offering this slot. */
  seller_id: Types.ObjectId;
  /** The physical location (e.g., address) where the test drive will take place. */
  location: string;
  /** The ID of the `EvModel` available for the test drive in this slot. */
  model_id: Types.ObjectId;
  /** The date the slot is available. */
  available_date: Date;
  /** The maximum number of individual bookings allowed for this slot. */
  max_bookings: number;
  /** A boolean flag indicating if the slot is currently active and available for booking. */
  is_active: boolean;
}

/**
 * Mongoose schema for the TestDriveSlot collection.
 */
const TestDriveSlotSchema = new Schema<ITestDriveSlot>(
  {
    /** A reference to the `Seller` document offering the test drive. */
    seller_id: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    /** The location of the test drive, which is required. */
    location: { type: String, required: true },
    /** A reference to the `EvModel` document available for the test drive. */
    model_id: { type: Schema.Types.ObjectId, ref: "EvModel", required: true },
    /** The date the slot is available, which is required. */
    available_date: { type: Date, required: true },
    /** The maximum number of bookings for this slot, which is required. */
    max_bookings: { type: Number, required: true },
    /** A flag to indicate if the slot is active. Defaults to true. */
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/**
 * Creates indexes on key fields to optimize common query performance.
 * - `seller_id`: To quickly find all slots offered by a specific seller.
 * - `model_id`: To find all slots for a particular vehicle model.
 * - `available_date`: To sort slots chronologically.
 * - `location`: To allow for searching or filtering slots by location.
 * - `is_active`: To efficiently query for only active slots.
 */
TestDriveSlotSchema.index({ seller_id: 1 });
TestDriveSlotSchema.index({ model_id: 1 });
TestDriveSlotSchema.index({ available_date: 1 });
TestDriveSlotSchema.index({ location: 1 });
TestDriveSlotSchema.index({ is_active: 1 });

/**
 * The Mongoose model for the TestDriveSlot collection.
 */
export const TestDriveSlot = model<ITestDriveSlot>(
  "TestDriveSlot",
  TestDriveSlotSchema
);
