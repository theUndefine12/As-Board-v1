import { IsNotEmpty } from "class-validator";

export class DashboardDto {
    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    image: string
}