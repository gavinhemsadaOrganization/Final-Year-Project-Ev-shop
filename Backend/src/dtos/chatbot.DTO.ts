import { IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator";

/**
 * Data Transfer Object (DTO) for creating a new chatbot conversation entry.
 * This is typically used to log a user's message.
 */
export class ChatbotConversationDTO {
  /**
   * The MongoDB ObjectId of the user interacting with the chatbot.
   */
  @IsMongoId()
  user_id!: string;

  /**
   * The text of the message sent by the user. Must not be an empty string.
   */
  @IsString()
  @IsNotEmpty()
  message_text!: string;
}

/**
 * Data Transfer Object (DTO) for creating a new prediction record.
 * This is used to log the inputs and the corresponding outputs from the chatbot's prediction model.
 */
export class PredictionDTO {
  /**
   * The MongoDB ObjectId of the conversation this prediction belongs to.
   */
  @IsMongoId()
  conversation_id!: string;

  /**
   * An array of strings representing the user's inputs that led to this prediction.
   */
  @IsArray()
  @IsString({ each: true })
  user_inputs!: string[];

  /**
   * An array of strings representing the chatbot's predicted responses.
   */
  @IsArray()
  @IsString({ each: true })
  prediction_result!: string[];
}
