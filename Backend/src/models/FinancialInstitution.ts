import { Schema, model, Document, Types } from "mongoose";

export interface IFinancialInstitution extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  name: string;
  type: string;
  description?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
}

const FinancialInstitutionSchema = new Schema<IFinancialInstitution>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String },
    website: { type: String },
    contact_email: { type: String },
    contact_phone: { type: String },
  },
  { timestamps: true }
);

// Indexes for efficient queries
FinancialInstitutionSchema.index({ user_id: 1 });
FinancialInstitutionSchema.index({ name: 1 });
FinancialInstitutionSchema.index({ type: 1 });

export const FinancialInstitution = model<IFinancialInstitution>(
  "FinancialInstitution",
  FinancialInstitutionSchema
);
