import {
  IsEmail,
  Matches,
  IsString,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  SELLER = "seller",
  FINANCE = "finance",
}

@ValidatorConstraint({ name: "MatchPassword", async: false })
class MatchPasswordConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: any, args: ValidationArguments) {
    const object = args.object as any;
    return object.password === confirmPassword;
  }

  defaultMessage(args: ValidationArguments) {
    return "Password confirmation does not match password";
  }
}

export class RegisterDto {
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;

  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, { 
    message: "Password must contain uppercase, lowercase, number, and special character" 
  })
  @IsString()
  password!: string;

  @IsString()
  @Validate(MatchPasswordConstraint)
  confirmPassword!: string;
}

export class LoginDTO {
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsString()
  password!: string;
}

export class ForgetPasswordDTO {
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;
}

export class OTPverifyDTO {
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;
  @IsString()
  otp!: string;
}

export class ResetPasswordDTO {
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, { 
    message: "Password must contain uppercase, lowercase, number, and special character" 
  })
  @IsString()
  password!: string;  
}