import {
  IsString,
  IsOptional,
  IsUrl,
  IsNumber,
  IsEnum,
  IsArray,
  Min,
  Max,
  IsMongoId,
} from "class-validator";
import { ListingType, VehicleCondition } from "../shared/enum/enum";

// --- Brand DTOs ---
/**
 * Data Transfer Object (DTO) for creating or updating an EV Brand.
 */
export class EvBrandDTO {
  /**
   * The name of the brand (e.g., "Tesla", "Nissan").
   */
  @IsString()
  brand_name!: string;

  /**
   * A brief description of the brand. This field is optional.
   */
  @IsOptional()
  @IsString()
  description?: string;
}

// --- Category DTOs ---
/**
 * Data Transfer Object (DTO) for creating or updating an EV Category.
 */
export class EvCategoryDTO {
  /**
   * The name of the category (e.g., "Sedan", "SUV", "Hatchback").
   */
  @IsString()
  category_name!: string;

  /**
   * A brief description of the category. This field is optional.
   */
  @IsOptional()
  @IsString()
  description?: string;
}

// --- Model DTOs ---
/**
 * Data Transfer Object (DTO) for creating or updating an EV Model.
 */
export class EvModelDTO {
  /**
   * The MongoDB ObjectId of the brand this model belongs to.
   */
  @IsMongoId()
  brand_id!: string;

  /**
   * The MongoDB ObjectId of the category this model belongs to.
   */
  @IsMongoId()
  category_id!: string;

  /**
   * The specific name of the model (e.g., "Model 3", "Leaf").
   */
  @IsString()
  model_name!: string;

  /**
   * The manufacturing year of the model.
   */
  @IsNumber()
  year!: number;

  /**
   * The capacity of the model's battery in kilowatt-hours (kWh).
   */
  @IsNumber()
  battery_capacity_kwh!: number;

  /**
   * The estimated driving range on a full charge, in kilometers (km).
   */
  @IsNumber()
  range_km!: number;

  /**
   * The approximate time to fully charge the battery, in hours. This field is optional.
   */
  @IsOptional()
  @IsNumber()
  charging_time_hours?: number;

  /**
   * The type of electric motor used (e.g., "AC Induction", "Permanent Magnet"). This field is optional.
   */
  @IsOptional()
  @IsString()
  motor_type?: string;
}

// --- Vehicle Listing DTOs ---
/**
 * Data Transfer Object (DTO) for creating a new vehicle listing for sale.
 */
export class VehicleListingDTO {
  /**
   * The MongoDB ObjectId of the seller creating the listing.
   */
  @IsMongoId()
  seller_id!: string;

  /**
   * The MongoDB ObjectId of the EV model being listed.
   */
  @IsMongoId()
  model_id!: string;

  /**
   * The type of listing (e.g., 'ForSale', 'ForRent').
   * Must be one of the values defined in the `ListingType` enum.
   */
  @IsEnum(ListingType)
  listing_type!: ListingType;

  /**
   * The condition of the vehicle (e.g., 'New', 'Used').
   * Must be one of the values defined in the `VehicleCondition` enum.
   */
  @IsEnum(VehicleCondition)
  condition!: VehicleCondition;

  /**
   * The asking price for the vehicle. Must be a non-negative number.
   */
  @IsNumber()
  @Min(0)
  price!: number;

  /**
   * The battery health percentage (0-100). This field is optional, typically for used vehicles.
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  battery_health?: number;

  /**
   * The color of the vehicle. This field is optional.
   */
  @IsOptional()
  @IsString()
  color?: string;

  /**
   * The year the vehicle was first registered. This field is optional.
   */
  @IsOptional()
  @IsNumber()
  registration_year?: number;

  /**
   * An array of URLs for images of the vehicle. Each must be a valid URL. This field is optional.
   */
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  /**
   * The number of units available for this listing (e.g., for a dealer with multiple identical new cars).
   * Defaults to 1 if not provided. This field is optional.
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  number_of_ev?: number;
}

/**
 * Data Transfer Object (DTO) for updating an existing vehicle listing.
 * All fields are optional, allowing for partial updates.
 */
export class UpdateVehicleListingDTO {
  /**
   * The updated price for the vehicle.
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  /**
   * The updated type of listing.
   */
  @IsOptional()
  @IsEnum(ListingType)
  listing_type?: ListingType;

  /**
   * The updated condition of the vehicle.
   */
  @IsOptional()
  @IsEnum(VehicleCondition)
  condition?: VehicleCondition;

  /**
   * The updated status of the listing (e.g., "Available", "Sold"). This field is optional.
   */
  @IsOptional()
  @IsString()
  status?: string;
}
