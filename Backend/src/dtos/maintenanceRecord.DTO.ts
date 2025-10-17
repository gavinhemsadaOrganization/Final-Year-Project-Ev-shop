import {
  IsString,
  IsDate,
  IsOptional,
  IsArray,
  IsMongoId,
} from "class-validator";
import { Type } from "class-transformer";

/**
 * Data Transfer Object (DTO) for creating a new maintenance record.
 * Defines the validation rules for the maintenance record creation payload.
 */
export class MaintenanceRecordDTO {
  /**
   * The MongoDB ObjectId of the seller who performed the maintenance.
   */
  @IsMongoId()
  seller_id!: string;

  /**
   * The type of service performed (e.g., "Battery Check", "Tire Rotation").
   */
  @IsString()
  service_type!: string;

  /**
   * The date the service was performed.
   * The `@Type(() => Date)` decorator ensures the incoming string is transformed into a Date object.
   */
  @IsDate()
  @Type(() => Date)
  service_date!: Date;

  /**
   * A detailed description of the service performed. This field is optional.
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * An array of strings listing any parts that were replaced during the service. This field is optional.
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  parts_replaced?: string[];

  /**
   * The location or address where the service was performed. This field is optional.
   */
  @IsOptional()
  @IsString()
  location?: string;
}

/**
 * Data Transfer Object (DTO) for updating an existing maintenance record.
 * All fields are optional, allowing for partial updates.
 */
export class UpdateMaintenanceRecordDTO {
  /**
   * The updated type of service performed.
   */
  @IsOptional()
  @IsString()
  service_type?: string;

  /**
   * The updated description of the service.
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * The updated date the service was performed.
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  service_date?: Date;

  /**
   * An updated list of parts that were replaced.
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  parts_replaced?: string[];

  /**
   * The updated location where the service was performed.
   */
  @IsOptional()
  @IsString()
  location?: string;
}
