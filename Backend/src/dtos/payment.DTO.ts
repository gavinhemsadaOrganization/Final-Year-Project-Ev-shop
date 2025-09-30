import {
  IsString,
  IsMongoId,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from "class-validator";
import { PaymentMethod, PaymentStatus, PaymentType } from "../enum/enum";

export class CreatePaymentDTO {
  @IsMongoId()
  order_id!: string;

  @IsEnum(PaymentMethod)
  payment_method!: PaymentMethod;

  @IsEnum(PaymentType)
  payment_type!: PaymentType;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tax_amount?: number;
}

export class UpdatePaymentDTO {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}

export class PaymentQueryDTO {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}


