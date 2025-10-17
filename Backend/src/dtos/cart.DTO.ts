import {
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsMongoId,
} from "class-validator";

/**
 * Data Transfer Object (DTO) for cart operations that only require a user ID.
 * This is currently not used for validation but could be useful for future features.
 */
export class CartDTO {
  /**
   * The MongoDB ObjectId of the user who owns the cart.
   */
  @IsMongoId()
  user_id!: string;
}

/**
 * Data Transfer Object (DTO) for adding a new item to the shopping cart.
 * Defines the validation rules for the add-to-cart payload.
 */
export class CartItemDTO {
  /**
   * The MongoDB ObjectId of the user adding the item.
   */
  @IsMongoId()
  user_id!: string;

  /**
   * The MongoDB ObjectId of the vehicle listing being added to the cart.
   */
  @IsMongoId()
  listing_id!: string;

  /**
   * The quantity of the item to add. Must be at least 1.
   */
  @IsNumber()
  @Min(1)
  quantity!: number;
}

/**
 * Data Transfer Object (DTO) for updating an item's quantity in the shopping cart.
 * All fields are optional, allowing for partial updates.
 */
export class UpdateCartItemDTO {
  /**
   * The new quantity for the cart item. Must be at least 1.
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;
}
