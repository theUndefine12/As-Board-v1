import { IsNotEmpty, IsString } from "class-validator";


export class CommentDto {
    @IsNotEmpty()
    text: string
}
