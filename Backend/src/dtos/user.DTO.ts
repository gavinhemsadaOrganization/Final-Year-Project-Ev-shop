import {
  IsString,
  IsOptional,
  IsDate,
  IsPhoneNumber,
  ValidateNested,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";

/**
 * Data Transfer Object (DTO) for a user's address.
 * This is a nested DTO used within the main UserDTO.
 */
export class AddressDTO {
  /**
   * The street name and number.
   */
  @IsString()
  street!: string;

  /**
   * The city name.
   */
  @IsString()
  city!: string;

  /**
   * The state, province, or region.
   */
  @IsString()
  state!: string;

  /**
   * The postal or ZIP code.
   */
  @IsString()
  zipCode!: string;

  /**
   * The country name.
   */
  @IsString()
  country!: string;
}

/**
 * Data Transfer Object (DTO) for updating a user's profile information.
 * Defines the validation rules for the user update payload.
 */
export class UserDTO {
  /**
   * The user's full name.
   */
  @IsString()
  name!: string;

  /**
   * The user's date of birth. This field is optional.
   * The `@Type(() => Date)` decorator ensures the incoming string is transformed into a Date object.
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_of_birth?: Date;

  /**
   * The user's phone number. Must be a valid phone number format and at least 10 characters long.
   */
  @IsString()
  @MinLength(10, { message: "Phone number must be at least 10 characters" })
  @IsPhoneNumber(undefined, { message: "Please provide a valid phone number" })
  phone!: string;

  /**
   * The user's address. This field is optional and is a nested object.
   * The `@ValidateNested()` decorator triggers validation on the nested AddressDTO.
   * The `@Type(() => AddressDTO)` decorator ensures the plain object is transformed into an instance of AddressDTO.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDTO)
  address?: AddressDTO;
}
