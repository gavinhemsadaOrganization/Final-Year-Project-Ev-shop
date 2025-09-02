import { Schema, model, Document, Types } from 'mongoose';

export interface IFinancialInstitution extends Document {
  _id: Types.ObjectId;
  name: string;
  type: string;
  description?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
}

const FinancialInstitutionSchema = new Schema<IFinancialInstitution>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  website: { type: String },
  contact_email: { type: String },
  contact_phone: { type: String },
}, { timestamps: true });

export default model<IFinancialInstitution>('FinancialInstitution', FinancialInstitutionSchema);
