import { IsMongoId, IsNotEmpty, IsString, MinLength } from "class-validator";

/**
 * Data Transfer Object (DTO) for creating a new forum post.
 * Defines the validation rules for the post creation payload.
 */
export class PostDTO {
  /**
   * The MongoDB ObjectId of the user creating the post.
   */
  @IsMongoId()
  user_id!: string;

  /**
   * The title of the post. It must not be empty and should have a minimum length.
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: "Title must be at least 5 characters long" })
  title!: string;

  /**
   * The main content/body of the post. It must not be empty.
   */
  @IsString()
  @IsNotEmpty()
  content!: string;
}

/**
 * Data Transfer Object (DTO) for creating a new reply to a forum post.
 * Defines the validation rules for the reply creation payload.
 */
export class PostReplyDTO {
  /**
   * The MongoDB ObjectId of the user creating the reply.
   */
  @IsMongoId()
  user_id!: string;
  /**
   * The MongoDB ObjectId of the post being replied to.
   */
  @IsMongoId()
  post_id!: string;
  /**
   * The content of the reply. It must not be empty.
   */
  @IsString()
  @IsNotEmpty()
  content!: string;
}
