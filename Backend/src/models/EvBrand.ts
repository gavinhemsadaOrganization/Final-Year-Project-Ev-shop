import { Schema, model, Document, Types } from 'mongoose';

export interface IEvBrand extends Document {
  _id: Types.ObjectId;
  brand_name: string;
  brand_logo?: string;
  description?: string;
}

const EvBrandSchema = new Schema<IEvBrand>({
  brand_name: { type: String, required: true },
  brand_logo: { type: String },
  description: { type: String },
}, { timestamps: true });

export default model<IEvBrand>('EvBrand', EvBrandSchema);
