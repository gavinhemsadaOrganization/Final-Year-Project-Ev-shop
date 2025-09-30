import { IsString, IsOptional, IsUrl, IsMongoId } from "class-validator";

export class SellerDTO {
  @IsMongoId()
  user_id!: string;

  @IsString()
  business_name!: string;

  @IsOptional()
  @IsString()
  license_number?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;
}

export class UpdateSellerDTO {
  @IsOptional()
  @IsString()
  business_name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;
}
