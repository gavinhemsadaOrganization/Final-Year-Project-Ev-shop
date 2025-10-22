import {
  IsString,
  IsMongoId,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
} from "class-validator";
import { OrderStatus, PaymentStatus } from "../shared/enum/enum";

/**
 * Data Transfer Object (DTO) for creating a new order.
 * Defines the validation rules for the order creation payload.
 */
export class CreateOrderDTO {
  /**
   * The MongoDB ObjectId of the user placing the order.
   */
  @IsMongoId()
  user_id!: string;

  /**
   * The MongoDB ObjectId of the vehicle listing being purchased.
   * This is optional as an order might relate to a service (e.g., a booked test drive).
   */
  @IsOptional()
  @IsMongoId()
  listing_id?: string;

  /**
   * The MongoDB ObjectId of a test drive booking associated with this order.
   * This is optional and typically used when an order is for a service.
   */
  @IsOptional()
  @IsMongoId()
  booking_id?: string;

  /**
   * The MongoDB ObjectId of the seller fulfilling the order.
   */
  @IsMongoId()
  seller_id!: string;

  /**
   * The total monetary amount for the order. Must be a non-negative number.
   */
  @IsNumber()
  @Min(0)
  total_amount!: number;
}

/**
 * Data Transfer Object (DTO) for updating an existing order.
 * All fields are optional, allowing for partial updates (e.g., only updating the status).
 */
export class UpdateOrderDTO {
  /**
   * The new status of the order (e.g., 'Shipped', 'Delivered', 'Cancelled').
   * Must be one of the values defined in the `OrderStatus` enum.
   */
  @IsOptional()
  @IsEnum(OrderStatus)
  order_status?: OrderStatus;

  /**
   * The new payment status of the order (e.g., 'Paid', 'Refunded').
   * Must be one of the values defined in the `PaymentStatus` enum.
   */
  @IsOptional()
  @IsEnum(PaymentStatus)
  payment_status?: PaymentStatus;
}
