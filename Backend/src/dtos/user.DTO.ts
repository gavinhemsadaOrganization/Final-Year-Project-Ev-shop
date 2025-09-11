import {
  IsEmail,
  IsString,
  IsOptional,
  IsDate,
  IsPhoneNumber,
  ValidateNested,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";

class AddressDTO {
  @IsString()
  street!: string;

  @IsString()
  city!: string;

  @IsString()
  state!: string;

  @IsString()
  zipCode!: string;

  @IsString()
  country!: string;
}

export class UserDTO {

  @IsString()
  name!: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_of_birth?: Date;

  @IsString()
  @MinLength(10, { message: "Phone number must be at least 10 characters" })
  @IsPhoneNumber(undefined, { message: "Please provide a valid phone number" })
  phone!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDTO)
  address?: AddressDTO;
}
