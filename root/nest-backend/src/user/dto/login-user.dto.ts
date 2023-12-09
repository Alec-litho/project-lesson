import {  MinLength, IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto implements ILoginUserDto {
    @ApiProperty({example:"OLEG_2005!311", description:"user password"})
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    password: string;
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({example: "useremail12@gmail.com", description:"User's Email"})
    email: string; 
}
