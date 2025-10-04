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
  IsInt,
  Min,
  ValidateNested,
} from "class-validator";
import { Type, Transform } from "class-transformer";
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
class ApplicationDataDTO {
  @IsString()
  full_name!: string;

  @IsInt()
  @Min(18)
  age!: number;

  @IsString()
  employment_status!: string;

  @IsNumber()
  monthly_income!: number;

  @IsNumber()
  requested_amount!: number;

  @IsInt()
  repayment_period_months!: number;

}

export class FinancingApplicationDTO {
  @IsString()
  user_id!: string;

  @IsString()
  product_id!: string;

  @IsOptional()
  @IsString()
  message_text?: string;

  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value; // return raw string if not valid JSON
      }
    }
    return value;
  })
  @ValidateNested()
  @Type(() => ApplicationDataDTO)
  application_data!: ApplicationDataDTO;
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
