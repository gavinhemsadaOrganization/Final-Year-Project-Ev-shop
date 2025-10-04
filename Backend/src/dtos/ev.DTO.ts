import {
  IsString,
  IsOptional,
  IsUrl,
  IsMongoId,
  IsNumber,
  IsEnum,
  IsArray,
  Min,
  Max,
} from "class-validator";
import { ListingType, VehicleCondition } from "../enum/enum";

// --- Brand DTOs ---
export class EvBrandDTO {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

// --- Category DTOs ---
export class EvCategoryDTO {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

// --- Model DTOs ---
export class EvModelDTO {
  @IsMongoId()
  brand_id!: string;

  @IsMongoId()
  category_id!: string;

  @IsString()
  name!: string;

  @IsNumber()
  year!: number;

  @IsNumber()
  battery_capacity_kwh!: number;

  @IsNumber()
  range_km!: number;

  @IsOptional()
  @IsNumber()
  charging_time_hours?: number;

  @IsOptional()
  @IsString()
  motor_type?: string;
}

// --- Vehicle Listing DTOs ---
export class VehicleListingDTO {
  @IsMongoId()
  seller_id!: string;

  @IsMongoId()
  model_id!: string;

  @IsEnum(ListingType)
  listing_type!: ListingType;

  @IsEnum(VehicleCondition)
  condition!: VehicleCondition;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  battery_health?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  registration_year?: number;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  number_of_ev?: number;
}

export class UpdateVehicleListingDTO {
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsEnum(ListingType)
  listing_type?: ListingType;

  @IsOptional()
  @IsEnum(VehicleCondition)
  condition?: VehicleCondition;

  @IsOptional()
  @IsString()
  status?: string;
}
