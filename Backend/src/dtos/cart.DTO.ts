import { IsString, IsNumber, Min, IsOptional } from "class-validator";

export class CartDTO {
  @IsString()
  user_id!: string;
}

export class CartItemDTO {
  @IsString()
  user_id!: string;

  @IsString()
  listing_id!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class UpdateCartItemDTO {
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;
}
