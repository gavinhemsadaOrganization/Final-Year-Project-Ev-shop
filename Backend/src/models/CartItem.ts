import { Schema, model, Document, Types } from 'mongoose';

export interface ICartItem extends Document {
  _id: Types.ObjectId;
  cart_id: Types.ObjectId;
  listing_id: Types.ObjectId;
  order_id?: Types.ObjectId;
  quantity: number;
}

const CartItemSchema = new Schema<ICartItem>({
  cart_id: { type: Schema.Types.ObjectId, ref: 'Cart', required: true },
  listing_id: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  order_id: { type: Schema.Types.ObjectId, ref: 'Order' },
  quantity: { type: Number, required: true },
}, { timestamps: true });

export default model<ICartItem>('CartItem', CartItemSchema);
