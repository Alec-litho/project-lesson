import {  Length, IsNotEmpty, IsString, IsEmail, Min, } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto implements ICreateUserDto {
    @ApiProperty({example:"OLEG_2005!311", description:"user password"})
    @IsString()
    @IsNotEmpty()
    @Length(3, 16, {message:"password must contain at least 3 characters"})
    password: string;
    @ApiProperty({example: "useremail12@gmail.com", description:"User's Email"})
    @IsNotEmpty()
    @IsEmail()
    email: string; 
    @ApiProperty({example: "Oleg", description:"Name of the user"})
    @IsString()
    @IsNotEmpty()
    @Length(4, 16, {message:"email must contain at least 4 characters"})
    fullName:string
    @ApiProperty({example: "2005-12-31", description:"User birth date"})
    @IsNotEmpty()
    birth: string
    @ApiProperty({example: "male", description:"User's gender"})
    @IsNotEmpty()
    gender: string
}
