import { Schema, model, Document, Types } from 'mongoose';

export interface IFinancialProduct extends Document {
  _id: Types.ObjectId;
  institution_id: Types.ObjectId;
  product_name: string;
  product_type: string;
  description?: string;
  interest_rate_min?: number;
  interest_rate_max?: number;
  term_months_min?: number;
  term_months_max?: number;
  down_payment_min?: number;
  eligibility_criteria?: Record<string, any>;
  features?: string[];
  is_active: boolean;
}

const FinancialProductSchema = new Schema<IFinancialProduct>({
  institution_id: { type: Schema.Types.ObjectId, ref: 'FinancialInstitution', required: true },
  product_name: { type: String, required: true },
  product_type: { type: String, required: true },
  description: { type: String },
  interest_rate_min: { type: Number },
  interest_rate_max: { type: Number },
  term_months_min: { type: Number },
  term_months_max: { type: Number },
  down_payment_min: { type: Number },
  eligibility_criteria: { type: Map, of: Schema.Types.Mixed },
  features: [{ type: String }],
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

// Indexes for efficient queries
FinancialProductSchema.index({ institution_id: 1 });
FinancialProductSchema.index({ product_type: 1 });
FinancialProductSchema.index({ is_active: 1 });

export const FinancialProduct = model<IFinancialProduct>('FinancialProduct', FinancialProductSchema);
