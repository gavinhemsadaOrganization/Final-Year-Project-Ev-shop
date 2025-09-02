import { Schema, model, Document, Types } from 'mongoose';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash'
}

export enum PaymentType {
  PURCHASE = 'purchase',
  REFUND = 'refund',
  PARTIAL_REFUND = 'partial_refund'
}

export interface IPayment extends Document {
  _id: Types.ObjectId;
  order_id: Types.ObjectId;
  payment_method: PaymentMethod;
  payment_type: PaymentType;
  amount: number;
  tax_amount?: number;
  status: string;
}

const PaymentSchema = new Schema<IPayment>({
  order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  payment_method: { type: String, enum: Object.values(PaymentMethod), required: true },
  payment_type: { type: String, enum: Object.values(PaymentType), required: true },
  amount: { type: Number, required: true },
  tax_amount: { type: Number },
  status: { type: String, required: true },
}, { timestamps: true });

export default model<IPayment>('Payment', PaymentSchema);
