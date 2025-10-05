import {
  IsString,
  IsMongoId,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from "class-validator";
import { PaymentStatus, PaymentType } from "../enum/enum";

export class CreatePaymentDTO {
  @IsMongoId()
  order_id!: string;

  @IsEnum(PaymentType)
  payment_type!: PaymentType;

  @IsString()
  returnUrl!: string;

  @IsString()
  cancelUrl!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tax_amount?: number;
}


