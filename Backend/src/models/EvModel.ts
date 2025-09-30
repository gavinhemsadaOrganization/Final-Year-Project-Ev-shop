import { Schema, model, Document, Types } from 'mongoose';

export interface IEvModel extends Document {
  _id: Types.ObjectId;
  category_id: Types.ObjectId;
  brand_id: Types.ObjectId;
  model_name: string;
  year: number;
  battery_capacity?: number;
  range_km?: number;
  charging_time_fast?: number;
  charging_time_slow?: number;
  seating_capacity?: number;
  price_range?: string;
  specifications?: Record<string, any>;
  features?: string[];
  images?: string[];
}

const EvModelSchema = new Schema<IEvModel>({
  category_id: { type: Schema.Types.ObjectId, ref: 'EvCategory', required: true },
  brand_id: { type: Schema.Types.ObjectId, ref: 'EvBrand', required: true },
  model_name: { type: String, required: true },
  year: { type: Number, required: true },
  battery_capacity: { type: Number },
  range_km: { type: Number },
  charging_time_fast: { type: Number },
  charging_time_slow: { type: Number },
  seating_capacity: { type: Number },
  price_range: { type: String },
  specifications: { type: Map, of: Schema.Types.Mixed },
  features: [{ type: String }],
  images: [{ type: String }],
}, { timestamps: true });

// Indexes for efficient queries
EvModelSchema.index({ category_id: 1 });
EvModelSchema.index({ brand_id: 1 });
EvModelSchema.index({ model_name: 1 });
EvModelSchema.index({ year: -1 });
EvModelSchema.index({ price_range: 1 });

export const EvModel = model<IEvModel>('EvModel', EvModelSchema);
