import { IsString, IsEnum } from "class-validator";
import { NotificationType } from "../enum/enum";

export class NotificationDTO {
  @IsString()
  user_id!: string;

  @IsEnum(NotificationType)
  type!: NotificationType;

  @IsString()
  title!: string;

  @IsString()
  message!: string;
}
