import {
  IsString,
  IsDate,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { TestDriveBookingStatus } from "../enum/enum";

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


  @IsDate()
  @Type(() => Date)
  booking_date!: Date;


  @IsString()
  booking_time!: string;

  @IsNumber()
  duration_minutes!: number;
}

export class FeedbackDTO {
  @IsString()
  booking_id!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
