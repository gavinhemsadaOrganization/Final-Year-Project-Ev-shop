import { IsString, IsOptional, IsUrl, IsMongoId } from "class-validator";

/**
 * Data Transfer Object (DTO) for creating a new seller profile.
 * Defines the validation rules for the seller creation payload.
 */
export class SellerDTO {
  /**
   * The MongoDB ObjectId of the user account associated with this seller profile.
   */
  @IsMongoId()
  user_id!: string;

  /**
   * The legal or trading name of the seller's business.
   */
  @IsString()
  business_name!: string;

  /**
   * The seller's business license or registration number. This field is optional.
   */
  @IsOptional()
  @IsString()
  license_number?: string;

  /**
   * A brief description of the seller's business. This field is optional.
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * The URL of the seller's business website. Must be a valid URL format. This field is optional.
   */
  @IsOptional()
  @IsUrl()
  website?: string;
}

/**
 * Data Transfer Object (DTO) for updating an existing seller profile.
 * All fields are optional, allowing for partial updates.
 */
export class UpdateSellerDTO {
  /**
   * The new business name for the seller.
   */
  @IsOptional()
  @IsString()
  business_name?: string;

  /**
   * An updated description for the seller's business.
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * The new URL for the seller's business website. Must be a valid URL format.
   */
  @IsOptional()
  @IsUrl()
  website?: string;
}
