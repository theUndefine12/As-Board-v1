import { IsNotEmpty } from "class-validator";


export class ColumnDto {
    @IsNotEmpty()
    title: string
}
