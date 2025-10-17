import { Schema, model, Document, Types } from "mongoose";

/**
 * Represents an Electric Vehicle (EV) brand in the database.
 * This is a top-level entity in the vehicle catalog.
 */
export interface IEvBrand extends Document {
  /** The unique identifier for the brand document. */
  _id: Types.ObjectId;
  /** The name of the brand (e.g., "Tesla", "Nissan"). */
  brand_name: string;
  /** The file path or URL to the brand's logo image. This field is optional. */
  brand_logo?: string;
  /** A brief description of the brand. This field is optional. */
  description?: string;
}

/**
 * Mongoose schema for the EvBrand collection.
 */
const EvBrandSchema = new Schema<IEvBrand>(
  {
    /**
     * The name of the brand, which is required and should be unique.
     */
    brand_name: { type: String, required: true },
    /**
     * The path to the brand's logo. Stored as a string.
     */
    brand_logo: { type: String },
    /**
     * A text description of the brand.
     */
    description: { type: String },
  },
  { timestamps: true }
);

/**
 * Creates an index on the `brand_name` field to ensure fast lookups and sorting by brand name.
 */
EvBrandSchema.index({ brand_name: 1 });

/**
 * The Mongoose model for the EvBrand collection.
 */
export const EvBrand = model<IEvBrand>("EvBrand", EvBrandSchema);
