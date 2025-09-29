import { Schema, model, Document, Types } from 'mongoose';
import { PaymentStatus, PaymentMethod, PaymentType } from '../enum/enum';

export interface IPayment extends Document {
  _id: Types.ObjectId;
  order_id: Types.ObjectId;
  payment_method: PaymentMethod;
  payment_type: PaymentType;
  amount: number;
  tax_amount?: number;
  status: PaymentStatus;
}

const PaymentSchema = new Schema<IPayment>({
  order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  payment_method: { type: String, enum: Object.values(PaymentMethod), required: true },
  payment_type: { type: String, enum: Object.values(PaymentType), required: true },
  amount: { type: Number, required: true },
  tax_amount: { type: Number },
  status: { type: String, enum: Object.values(PaymentStatus), required: true },
}, { timestamps: true });

// Indexes for efficient queries
PaymentSchema.index({ order_id: 1 });
PaymentSchema.index({ payment_method: 1 });
PaymentSchema.index({ payment_type: 1 });
PaymentSchema.index({ status: 1 });

export default model<IPayment>('Payment', PaymentSchema);
