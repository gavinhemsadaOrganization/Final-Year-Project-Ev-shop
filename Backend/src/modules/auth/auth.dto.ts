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

/**
 * Custom validator constraint to check if the `confirmPassword` field
 * matches the `password` field in a DTO.
 */
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

/**
 * Data Transfer Object (DTO) for user registration.
 * Defines the validation rules for the registration payload.
 */
export class RegisterDto {
  /**
   * The user's email address. Must be a valid email format.
   */
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;

  /**
   * The user's password. Must be at least 6 characters long and contain
   * an uppercase letter, a lowercase letter, a number, and a special character.
   */
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        "Password must contain uppercase, lowercase, number, and special character",
    }
  )
  @IsString()
  password!: string;

  /**
   * The password confirmation field. Must match the `password` field.
   */
  @IsString()
  @Validate(MatchPasswordConstraint)
  confirmPassword!: string;
}

/**
 * Data Transfer Object (DTO) for user login.
 * Defines the validation rules for the login payload.
 */
export class LoginDTO {
  /**
   * The user's email address. Must be a valid email format.
   */
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;

  /**
   * The user's password. Must be at least 6 characters long.
   */
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @IsString()
  password!: string;
}

/**
 * Data Transfer Object (DTO) for the "forget password" request.
 */
export class ForgetPasswordDTO {
  /**
   * The email address of the user who forgot their password.
   */
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;
}

/**
 * Data Transfer Object (DTO) for verifying the One-Time Password (OTP).
 */
export class OTPverifyDTO {
  /**
   * The user's email address.
   */
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;
  /**
   * The 6-digit OTP sent to the user's email.
   */
  @IsString()
  otp!: string;
}

/**
 * Data Transfer Object (DTO) for resetting the user's password.
 */
export class ResetPasswordDTO {
  /**
   * The user's email address.
   */
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;
  /**
   * The new password. Must be at least 6 characters long and contain
   * an uppercase letter, a lowercase letter, a number, and a special character.
   */
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        "Password must contain uppercase, lowercase, number, and special character",
    }
  )
  @IsString()
  password!: string;
}
