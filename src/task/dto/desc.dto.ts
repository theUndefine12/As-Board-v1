import { IsNotEmpty } from "class-validator";


export class DesctDto {
    @IsNotEmpty()
    text: string
}