import { Schema, model, Document, Types } from "mongoose";
import { ListingType, VehicleCondition, ListingStatus } from "../enum/enum";

/**
 * Represents a vehicle listing in the database.
 * This is a specific instance of an EV model being sold or rented by a seller.
 */
export interface IVehicleListing extends Document {
  /** The unique identifier for the vehicle listing document. */
  _id: Types.ObjectId;
  /** The ID of the `Seller` who created the listing. */
  seller_id: Types.ObjectId;
  /** The ID of the `EvModel` being listed. */
  model_id: Types.ObjectId;
  /** The type of listing (e.g., 'ForSale', 'ForRent'). */
  listing_type: ListingType;
  /** The condition of the vehicle (e.g., 'New', 'Used'). */
  condition: VehicleCondition;
  /** The asking price for the vehicle. */
  price: number;
  /** The battery health percentage (0-100). This field is optional, typically for used vehicles. */
  battery_health?: number;
  /** The color of the vehicle. This field is optional. */
  color?: string;
  /** The year the vehicle was first registered. This field is optional. */
  registration_year?: number;
  /** An array of URLs for images of the vehicle. This field is optional. */
  images?: string[];
  /** The current status of the listing (e.g., 'Active', 'Inactive', 'Sold'). */
  status: ListingStatus;
  /** The number of units available for this listing. Defaults to 1. This field is optional. */
  number_of_ev?: number;
}

/**
 * Mongoose schema for the VehicleListing collection.
 */
const VehicleListingSchema = new Schema<IVehicleListing>(
  {
    /** A reference to the `Seller` document who owns this listing. */
    seller_id: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    /** A reference to the `EvModel` document being listed. */
    model_id: { type: Schema.Types.ObjectId, ref: "EvModel", required: true },
    /** The type of listing, controlled by the `ListingType` enum. */
    listing_type: {
      type: String,
      enum: Object.values(ListingType),
      required: true,
    },
    /** The condition of the vehicle, controlled by the `VehicleCondition` enum. */
    condition: {
      type: String,
      enum: Object.values(VehicleCondition),
      required: true,
    },
    /** The price of the vehicle, which is required. */
    price: { type: Number, required: true },
    /** The battery health percentage, with a range of 0 to 100. */
    battery_health: { type: Number, min: 0, max: 100 },
    /** The color of the vehicle. */
    color: { type: String },
    /** The year of first registration. */
    registration_year: { type: Number },
    /** An array of image URLs. */
    images: [{ type: String }],
    /** The status of the listing, controlled by the `ListingStatus` enum. Defaults to 'ACTIVE'. */
    status: {
      type: String,
      enum: Object.values(ListingStatus),
      default: ListingStatus.ACTIVE,
    },
    /** The number of identical vehicles available in this listing. Defaults to 1. */
    number_of_ev: { type: Number, min: 1, default: 1 },
  },
  { timestamps: true }
);

/**
 * Creates indexes on key fields to optimize common query performance.
 * - `seller_id`: To quickly find all listings by a specific seller.
 * - `model_id`: To find all listings for a specific model.
 * - `price`: To allow for efficient filtering and sorting by price.
 * - `status`: To efficiently query for listings by their status (e.g., find all active listings).
 */
VehicleListingSchema.index({ seller_id: 1 });
VehicleListingSchema.index({ model_id: 1 });
VehicleListingSchema.index({ price: 1 });
VehicleListingSchema.index({ status: 1 });

/**
 * The Mongoose model for the VehicleListing collection.
 */
export const VehicleListing = model<IVehicleListing>(
  "VehicleListing",
  VehicleListingSchema
);
