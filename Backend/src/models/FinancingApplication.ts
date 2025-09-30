import { Schema, model, Document, Types } from 'mongoose';
import { ApplicationStatus } from '../enum/enum';

export interface IFinancingApplication extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  product_id: Types.ObjectId;
  message_text?: string;
  application_data: Record<string, any>;
  status: ApplicationStatus;
  approval_amount?: number;
  terms?: Record<string, any>;
  rejection_reason?: string;
  processed_at?: Date;
}

const FinancingApplicationSchema = new Schema<IFinancingApplication>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: Schema.Types.ObjectId, ref: 'FinancialProduct', required: true },
  message_text: { type: String },
  application_data: { type: Map, of: Schema.Types.Mixed, required: true },
  status: { type: String, enum: Object.values(ApplicationStatus), required: true },
  approval_amount: { type: Number },
  terms: { type: Map, of: Schema.Types.Mixed },
  rejection_reason: { type: String },
  processed_at: { type: Date },
}, { timestamps: true });

// Indexes for efficient queries
FinancingApplicationSchema.index({ user_id: 1 });
FinancingApplicationSchema.index({ product_id: 1 });
FinancingApplicationSchema.index({ status: 1 });

export const FinancingApplication = model<IFinancingApplication>('FinancingApplication', FinancingApplicationSchema);
