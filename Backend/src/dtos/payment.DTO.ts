import {
  IsString,
  IsMongoId,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from "class-validator";
import { PaymentStatus, PaymentType } from "../enum/enum";

/**
 * Data Transfer Object (DTO) for creating a new payment session.
 * Defines the validation rules for the payment initiation payload.
 */
export class CreatePaymentDTO {
  /**
   * The MongoDB ObjectId of the order for which the payment is being made.
   */
  @IsMongoId()
  order_id!: string;

  /**
   * The type of payment method being used (e.g., 'Stripe', 'Khalti').
   * Must be one of the values defined in the `PaymentType` enum.
   */
  @IsEnum(PaymentType)
  payment_type!: PaymentType;

  /**
   * The URL to which the user will be redirected after a successful payment.
   */
  @IsString()
  returnUrl!: string;

  /**
   * The URL to which the user will be redirected if they cancel the payment.
   */
  @IsString()
  cancelUrl!: string;

  /**
   * The total amount to be charged, including any taxes or fees.
   * Must be a non-negative number.
   */
  @IsNumber()
  @Min(0)
  amount!: number;

  /**
   * The portion of the total amount that constitutes tax. This field is optional.
   * If provided, it must be a non-negative number.
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  tax_amount?: number;
}
