import { Schema, model, Document, Types } from "mongoose";

/**
 * Represents a financial product (e.g., a loan, lease) offered by an institution.
 */
export interface IFinancialProduct extends Document {
  /** The unique identifier for the financial product document. */
  _id: Types.ObjectId;
  /** The ID of the `FinancialInstitution` offering this product. */
  institution_id: Types.ObjectId;
  /** The name of the financial product (e.g., "EV Green Loan"). */
  product_name: string;
  /** The type of product (e.g., "Auto Loan", "Personal Loan"). */
  product_type: string;
  /** A detailed description of the product. This field is optional. */
  description?: string;
  /** The minimum applicable interest rate. This field is optional. */
  interest_rate_min?: number;
  /** The maximum applicable interest rate. This field is optional. */
  interest_rate_max?: number;
  /** The minimum loan term in months. This field is optional. */
  term_months_min?: number;
  /** The maximum loan term in months. This field is optional. */
  term_months_max?: number;
  /** The minimum required down payment percentage or amount. This field is optional. */
  down_payment_min?: number;
  /** An object containing various eligibility criteria (e.g., `{ "min_credit_score": 650 }`). This field is optional. */
  eligibility_criteria?: Record<string, any>;
  /** An array of strings describing the key features of the product. This field is optional. */
  features?: string[];
  /** Indicates if the product is currently active and available for applications. */
  is_active: boolean;
}

/**
 * Mongoose schema for the FinancialProduct collection.
 */
const FinancialProductSchema = new Schema<IFinancialProduct>(
  {
    /** A reference to the parent `FinancialInstitution` document. */
    institution_id: {
      type: Schema.Types.ObjectId,
      ref: "FinancialInstitution",
      required: true,
    },
    /** The name of the product, which is required. */
    product_name: { type: String, required: true },
    /** The type of product, which is required. */
    product_type: { type: String, required: true },
    /** A text description of the product. */
    description: { type: String },
    /** The minimum interest rate. */
    interest_rate_min: { type: Number },
    /** The maximum interest rate. */
    interest_rate_max: { type: Number },
    /** The minimum loan term in months. */
    term_months_min: { type: Number },
    /** The maximum loan term in months. */
    term_months_max: { type: Number },
    /** The minimum down payment required. */
    down_payment_min: { type: Number },
    /** A flexible map to store various eligibility criteria. */
    eligibility_criteria: { type: Map, of: Schema.Types.Mixed },
    /** A list of feature strings. */
    features: [{ type: String }],
    /** A boolean flag to indicate if the product is currently offered. Defaults to true. */
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/**
 * Creates indexes on key fields to optimize common query performance.
 * - `institution_id`: To quickly find all products from a specific institution.
 * - `product_type`: To allow for efficient filtering by product type.
 * - `is_active`: To quickly filter for active products.
 */
FinancialProductSchema.index({ institution_id: 1 });
FinancialProductSchema.index({ product_type: 1 });
FinancialProductSchema.index({ is_active: 1 });

/**
 * The Mongoose model for the FinancialProduct collection.
 */
export const FinancialProduct = model<IFinancialProduct>(
  "FinancialProduct",
  FinancialProductSchema
);
