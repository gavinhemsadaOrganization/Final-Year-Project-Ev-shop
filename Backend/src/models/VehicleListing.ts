import { Schema, model, Document, Types } from 'mongoose';
import { ListingType, VehicleCondition } from '../enum/enum';

export interface IVehicleListing extends Document {
  _id: Types.ObjectId;
  seller_id: Types.ObjectId;
  model_id: Types.ObjectId;
  listing_type: ListingType;
  condition: VehicleCondition;
  price: number;
  battery_health?: number;
  color?: string;
  registration_year?: number;
  images?: string[];
  status: string;
  number_of_ev?: number;
}

const VehicleListingSchema = new Schema<IVehicleListing>({
  seller_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  model_id: { type: Schema.Types.ObjectId, ref: 'CarModel', required: true },
  listing_type: { type: String, enum: ['sale', 'rent'], required: true },
  condition: { type: String, enum: ['new', 'used'], required: true },
  price: { type: Number, required: true },
  battery_health: { type: Number, min: 0, max: 100 },
  color: { type: String },
  registration_year: { type: Number },
  images: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  number_of_ev: { type: Number, min: 0 },
}, { timestamps: true });

export const VehicleListing = model<IVehicleListing>('VehicleListing', VehicleListingSchema);
