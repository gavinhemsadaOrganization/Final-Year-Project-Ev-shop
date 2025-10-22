import { Schema, model, Document, Types } from "mongoose";

/**
 * Represents a financial institution (e.g., a bank, credit union) in the database.
 * This entity can offer financial products to users.
 */
export interface IFinancialInstitution extends Document {
  /** The unique identifier for the financial institution document. */
  _id: Types.ObjectId;
  /** The ID of the `User` who manages this institution's profile. */
  user_id: Types.ObjectId;
  /** The official name of the institution. */
  name: string;
  /** The type of institution (e.g., "Bank", "Credit Union", "Fintech"). */
  type: string;
  /** A brief description of the institution. This field is optional. */
  description?: string;
  /** The URL of the institution's official website. This field is optional. */
  website?: string;
  /** The primary contact email for the institution. This field is optional. */
  contact_email?: string;
  /** The primary contact phone number for the institution. This field is optional. */
  contact_phone?: string;
}

/**
 * Mongoose schema for the FinancialInstitution collection.
 */
const FinancialInstitutionSchema = new Schema<IFinancialInstitution>(
  {
    /** A reference to the `User` account that manages this institution. */
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    /** The name of the institution, which is required. */
    name: { type: String, required: true },
    /** The type of institution, which is required. */
    type: { type: String, required: true },
    /** A text description of the institution. */
    description: { type: String },
    /** The institution's website URL. */
    website: { type: String },
    /** The institution's contact email address. */
    contact_email: { type: String },
    /** The institution's contact phone number. */
    contact_phone: { type: String },
  },
  { timestamps: true }
);

/**
 * Creates indexes on key fields to optimize common query performance.
 * - `user_id`: To quickly find the institution managed by a specific user.
 * - `name`: To enable fast searching and sorting by institution name.
 * - `type`: To allow for efficient filtering by institution type.
 */
FinancialInstitutionSchema.index({ user_id: 1 });
FinancialInstitutionSchema.index({ name: 1 });
FinancialInstitutionSchema.index({ type: 1 });

/**
 * The Mongoose model for the FinancialInstitution collection.
 */
export const FinancialInstitution = model<IFinancialInstitution>(
  "FinancialInstitution",
  FinancialInstitutionSchema
);
