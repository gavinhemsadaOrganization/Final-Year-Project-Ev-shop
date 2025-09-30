import {
  IsString,
  IsDate,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";

export class TestDriveSlotDTO {
  @IsString()
  seller_id!: string;

  @IsString()
  location!: string;

  @IsString()
  model_id!: string;

  @IsDate()
  @Type(() => Date)
  available_date!: Date;

  @IsNumber()
  max_bookings!: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class TestDriveBookingDTO {
  @IsString()
  customer_id!: string;

  @IsString()
  slot_id!: string;

  @IsString()
  booking_time!: string;

  @IsNumber()
  duration_minutes!: number;
}

