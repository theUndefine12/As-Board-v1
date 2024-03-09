import { IsNotEmpty, IsString } from "class-validator";



export class TaskDto {
    @IsString()
    @IsNotEmpty()
    title: string
    
    @IsString()
    @IsNotEmpty()
    time: string
}

