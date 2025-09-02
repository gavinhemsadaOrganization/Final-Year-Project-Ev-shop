import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  _id: Types.ObjectId;
  reviewer_id: Types.ObjectId;
  target_type: string;
  target_id: Types.ObjectId;
  rating: number;
  title?: string;
  comment?: string;
  created_at: Date;
  updated_at: Date;
}

const ReviewSchema = new Schema<IReview>({
  reviewer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  target_type: { type: String, required: true },
  target_id: { type: Schema.Types.ObjectId, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: String,
  comment: String,
}, { timestamps: true });

export default model<IReview>('Review', ReviewSchema);
