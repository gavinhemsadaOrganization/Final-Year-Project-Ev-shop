import { IsEnum, IsNumber, IsString } from "class-validator";
import { ReviewType } from "../enum/enum";

export class ReviewDTO {
  @IsString()
  reviewer_id!: string;
  @IsEnum(ReviewType)
  target_type!: string;
  @IsString()
  target_id!: string;
  @IsNumber()
  rating!: number;
  @IsString()
  title!: string;
  @IsString()
  comment?: string;
}
