import {
  IsString,
  IsOptional,
  IsUrl,
  IsEmail,
  IsPhoneNumber,
  IsNumber,
  IsObject,
  IsArray,
  IsBoolean,
  IsEnum,
} from "class-validator";
import { ApplicationStatus } from "../enum/enum";

export class FinancialInstitutionDTO {
  @IsString()
  user_id!: string;

  @IsString()
  name!: string;

  @IsString()
  type!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @IsOptional()
  @IsPhoneNumber()
  contact_phone?: string;
}

export class FinancialProductDTO {
  @IsString()
  institution_id!: string;

  @IsString()
  product_name!: string;

  @IsString()
  product_type!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  interest_rate_min?: number;

  @IsOptional()
  @IsNumber()
  interest_rate_max?: number;

  @IsOptional()
  @IsNumber()
  term_months_min?: number;

  @IsOptional()
  @IsNumber()
  term_months_max?: number;

  @IsOptional()
  @IsNumber()
  down_payment_min?: number;

  @IsOptional()
  @IsObject()
  eligibility_criteria?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class FinancingApplicationDTO {
  @IsString()
  user_id!: string;

  @IsString()
  product_id!: string;

  @IsOptional()
  @IsString()
  message_text?: string;

  @IsObject()
  application_data!: Record<string, any>;
}

export class UpdateFinancingApplicationDTO {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;

  @IsOptional()
  @IsNumber()
  approval_amount?: number;

  @IsOptional()
  @IsObject()
  terms?: Record<string, any>;

  @IsOptional()
  @IsString()
  rejection_reason?: string;
}
