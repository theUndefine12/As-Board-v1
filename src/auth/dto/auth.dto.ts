import { IsEmail, IsNotEmpty, MinLength } from "class-validator";



export class AuthDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MinLength(8, {
        message: 'Password need be min 8'
    })
    password: string
}