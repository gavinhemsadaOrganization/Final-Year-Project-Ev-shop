import { Schema, model, Document, Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  listing_id: Types.ObjectId;
  seller_id: Types.ObjectId;
  booking_id?: Types.ObjectId;
  order_status: OrderStatus;
  payment_status: string;
  total_amount: number;
  order_date: Date;
}

const OrderSchema = new Schema<IOrder>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  listing_id: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  seller_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  booking_id: { type: Schema.Types.ObjectId, ref: 'Booking' },
  order_status: { type: String, enum: Object.values(OrderStatus), required: true },
  payment_status: { type: String, required: true },
  total_amount: { type: Number, required: true },
  order_date: { type: Date, required: true },
}, { timestamps: true });

export default model<IOrder>('Order', OrderSchema);
