import { IsString } from "class-validator";

export class PostDTO {
    @IsString()
    user_id!: string;
    @IsString()
    title!: string;
    @IsString()
    content!: string;
}

export class PostReplyDTO {
    @IsString()
    user_id!: string;
    @IsString()
    post_id!: string;
    @IsString()
    content!: string;
}

