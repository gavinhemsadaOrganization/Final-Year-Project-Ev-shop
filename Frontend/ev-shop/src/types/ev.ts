import { ListingType, VehicleCondition, ListingStatus } from "@/types/enum";

export type Listing = {
  _id: string;
  name: string;
  model: string;
  price: string;
  status: ListingStatus;
  condition: VehicleCondition;
  listing_type: ListingType;
  battery_health: string;
  registration_year: string;
  number_of_ev: string;
  color: string;
  images: string[];
};

export type Vehicle = {
  id: number;
  name: string;
  model: string;
  price: string;
  range: string;
  image: string;
  topSpeed: string;
};

export interface Brand {
  id: string;
  name: string;
  description: string;
}

export interface categorie {
  id: string;
  name: string;
  description: string;
}

export interface EvListingFormData {
  // Step 1
  brand_id: string;
  category_id: string;

  // Step 2
  model_name: string;
  year: number | string;
  battery_capacity_kwh: number | string;
  range_km: number | string;
  charging_time_hours: number | string;
  motor_type: string;
  seating_capacity: number | string;
  price_range: string;
  specifications: string[];
  features: string[];

  // Step 3
  listing_type: ListingType | "";
  condition: VehicleCondition | "";
  price: number | string;
  battery_health: number | string;
  color: string;
  registration_year: string;
  number_of_ev: number | string;

  // Step 4
  images: File[];
}