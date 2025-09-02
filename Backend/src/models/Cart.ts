import { Schema, model, Document, Types } from 'mongoose';

export interface ICart extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
}

const CartSchema = new Schema<ICart>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default model<ICart>('Cart', CartSchema);
