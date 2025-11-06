import { Schema, model, Document, Types } from "mongoose";

/**
 * Represents a specific Electric Vehicle (EV) model in the database.
 * This is a detailed entity that belongs to a brand and a category.
 */
export interface IEvModel extends Document {
  /** The unique identifier for the model document. */
  _id: Types.ObjectId;
  /** The ID of the `EvCategory` this model belongs to (e.g., "SUV", "Sedan"). */
  category_id: Types.ObjectId;
  /** The ID of the `EvBrand` this model belongs to (e.g., "Tesla", "Nissan"). */
  brand_id: Types.ObjectId;
  /** The specific name of the model (e.g., "Model 3", "Leaf"). */
  model_name: string;
  /** The manufacturing year of the model. */
  year: number;
  /** The capacity of the model's battery in kilowatt-hours (kWh). This field is optional. */
  battery_capacity_kwh?: number;
  /** The estimated driving range on a full charge, in kilometers (km). This field is optional. */
  range_km?: number;
  /** The approximate time to fully charge the battery using a standard charger, in hours. This field is optional. */
  charging_time_hours?: number;
  /** The type of electric motor used (e.g., "AC Induction", "Permanent Magnet"). This field is optional. */
  motor_type?: string;
  /** The number of seats in the vehicle. This field is optional. */
  seating_capacity?: number;
  /** A string representing the price range (e.g., "$40,000 - $55,000"). This field is optional. */
  price_range?: string;
  /** An object for storing detailed technical specifications as key-value pairs. This field is optional. */
  specifications?: Record<string, any>;
  /** An array of strings describing the key features of the model. This field is optional. */
  features?: string[];
}

/**
 * Mongoose schema for the EvModel collection.
 */
const EvModelSchema = new Schema<IEvModel>(
  {
    /** A reference to the parent `EvCategory` document. */
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "EvCategory",
      required: true,
    },
    /** A reference to the parent `EvBrand` document. */
    brand_id: { type: Schema.Types.ObjectId, ref: "EvBrand", required: true },
    /** The name of the model, which is required. */
    model_name: { type: String, required: true },
    /** The manufacturing year, which is required. */
    year: { type: Number, required: true },
    /** The battery capacity in kWh. */
    battery_capacity_kwh: { type: Number },
    /** The estimated range in kilometers. */
    range_km: { type: Number },
    /** The charging time in hours. */
    charging_time_hours: { type: Number },
    /** The type of motor. */
    motor_type: { type: String },
    /** The seating capacity. */
    seating_capacity: { type: Number },
    /** A string representation of the price range. */
    price_range: { type: String },
    /** A flexible map to store various technical specifications. */
    specifications: { type: Map, of: Schema.Types.Mixed },
    /** A list of feature strings. */
    features: [{ type: String }]
  },
  { timestamps: true }
);

/**
 * Creates indexes on key fields to optimize common query performance, such as
 * filtering or sorting by category, brand, model name, year, or price.
 */
EvModelSchema.index({ category_id: 1 });
EvModelSchema.index({ brand_id: 1 });
EvModelSchema.index({ model_name: 1 });
EvModelSchema.index({ year: -1 });
EvModelSchema.index({ price_range: 1 });

/**
 * The Mongoose model for the EvModel collection.
 */
export const EvModel = model<IEvModel>("EvModel", EvModelSchema);
