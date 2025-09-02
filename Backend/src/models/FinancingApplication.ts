import { Schema, model, Document, Types } from 'mongoose';

export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under_review'
}

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
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  message_text: { type: String },
  application_data: { type: Map, of: Schema.Types.Mixed, required: true },
  status: { type: String, enum: Object.values(ApplicationStatus), required: true },
  approval_amount: { type: Number },
  terms: { type: Map, of: Schema.Types.Mixed },
  rejection_reason: { type: String },
  processed_at: { type: Date },
}, { timestamps: true });

export default model<IFinancingApplication>('FinancingApplication', FinancingApplicationSchema);
