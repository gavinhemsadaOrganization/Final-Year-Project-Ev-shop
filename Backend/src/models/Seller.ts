import { Schema, model, Document, Types } from "mongoose";

export interface ISeller extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  business_name?: string;
  license_number?: string;
  description?: string;
  website?: string;
  rating?: number;
  total_reviews: number;
}

const SellerSchema = new Schema<ISeller>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    business_name: String,
    license_number: String,
    description: String,
    website: String,
    rating: { type: Number, min: 0, max: 5 },
    total_reviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for efficient queries
SellerSchema.index({ user_id: 1 });
SellerSchema.index({ rating: 1 });

export default model<ISeller>("Seller", SellerSchema);
