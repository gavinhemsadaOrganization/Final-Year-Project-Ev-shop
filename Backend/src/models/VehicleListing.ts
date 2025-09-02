import { Schema, model, Document, Types } from 'mongoose';

export enum ListingType {
  SALE = 'sale',
  RENT = 'rent',
  LEASE = 'lease'
}

export enum VehicleCondition {
  NEW = 'new',
  USED = 'used',
  CERTIFIED_PRE_OWNED = 'certified_pre_owned',
  DAMAGED = 'damaged'
}

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

export default model<IVehicleListing>('VehicleListing', VehicleListingSchema);
