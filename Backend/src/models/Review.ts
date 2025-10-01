import { Schema, model, Document, Types } from "mongoose";
import { ReviewType } from "../enum/enum";

export interface IReview extends Document {
  _id: Types.ObjectId;
  reviewer_id: Types.ObjectId;
  order_id?: Types.ObjectId;
  target_type: ReviewType;
  target_id: Types.ObjectId;
  rating: number;
  title?: string;
  comment?: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    reviewer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    target_type: { type: String, enum: Object.values(ReviewType) , required: true },
    order_id: { type: Schema.Types.ObjectId, ref: "Order" },
    target_id: { type: Schema.Types.ObjectId, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: String,
    comment: String,
  },
  { timestamps: true }
);

// Indexes for efficient queries
ReviewSchema.index({ reviewer_id: 1 });
ReviewSchema.index({ target_id: 1 });
ReviewSchema.index({ rating: 1 });

export const Review = model<IReview>("Review", ReviewSchema);
