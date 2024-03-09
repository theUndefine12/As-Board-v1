import { IsNotEmpty, IsOptional } from "class-validator";

export class updateDto {
    @IsNotEmpty()
    title: string

    @IsOptional()
    @IsNotEmpty()
    image: string
}