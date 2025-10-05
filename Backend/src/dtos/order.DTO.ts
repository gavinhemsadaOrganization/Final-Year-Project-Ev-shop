import {
  IsString,
  IsMongoId,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
} from "class-validator";
import { OrderStatus, PaymentStatus } from "../enum/enum";

export class CreateOrderDTO {
  @IsMongoId()
  user_id!: string;
  
  @IsOptional()
  @IsMongoId()
  listing_id?: string;
  
  @IsOptional()
  @IsMongoId()
  booking_id?: string;


  @IsMongoId()
  seller_id!: string;

  @IsNumber()
  @Min(0)
  total_amount!: number;
}

export class UpdateOrderDTO {
  @IsOptional()
  @IsEnum(OrderStatus)
  order_status?: OrderStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  payment_status?: PaymentStatus;
}
