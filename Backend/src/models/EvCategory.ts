import { Schema, model, Document, Types } from 'mongoose';

export interface IEvCategory extends Document {
  _id: Types.ObjectId;
  category_name: string;
  description?: string;
}

const EvCategorySchema = new Schema<IEvCategory>({
  category_name: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

export default model<IEvCategory>('EvCategory', EvCategorySchema);
