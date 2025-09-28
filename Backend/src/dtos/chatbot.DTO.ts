import { IsArray, IsString } from "class-validator";

export class ChatbotConversationDTO {
  @IsString()
  user_id!: string;
  @IsString()
  message_text!: string;
}
export class PredictionDTO {
  @IsString()
  conversation_id!: string;
  @IsArray() @IsString({ each: true })
  user_inputs!: string[];
  @IsArray() @IsString({ each: true })
  prediction_result!: string[];
}
