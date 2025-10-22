import { Schema, model, Document, Types } from "mongoose";

/**
 * Represents an Electric Vehicle (EV) category in the database.
 * This helps classify vehicles into types like "Sedan", "SUV", etc.
 */
export interface IEvCategory extends Document {
  /** The unique identifier for the category document. */
  _id: Types.ObjectId;
  /** The name of the category (e.g., "Sedan", "SUV", "Hatchback"). */
  category_name: string;
  /** A brief description of the category. This field is optional. */
  description?: string;
}

/**
 * Mongoose schema for the EvCategory collection.
 */
const EvCategorySchema = new Schema<IEvCategory>(
  {
    /**
     * The name of the category, which is required and should be unique.
     */
    category_name: { type: String, required: true },
    /**
     * A text description of the category.
     */
    description: { type: String },
  },
  { timestamps: true }
);

/**
 * Creates an index on the `category_name` field to ensure fast lookups and sorting by category name.
 */
EvCategorySchema.index({ category_name: 1 });

/**
 * The Mongoose model for the EvCategory collection.
 */
export const EvCategory = model<IEvCategory>("EvCategory", EvCategorySchema);
