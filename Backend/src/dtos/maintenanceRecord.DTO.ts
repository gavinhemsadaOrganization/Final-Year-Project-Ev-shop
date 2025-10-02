import {
  IsString,
  IsDate,
  IsOptional,
  IsArray,
  IsMongoId,
} from "class-validator";
import { Type } from "class-transformer";

export class MaintenanceRecordDTO {
  @IsMongoId()
  seller_id!: string;

  @IsString()
  service_type!: string;

  @IsDate()
  @Type(() => Date)
  service_date!: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  parts_replaced?: string[];

  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdateMaintenanceRecordDTO {
  @IsOptional()
  @IsString()
  service_type?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDate()
  @Type(() => Date)
  service_date!: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  parts_replaced?: string[];

  @IsOptional()
  @IsString()
  location?: string;
}
