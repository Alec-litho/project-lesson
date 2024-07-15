import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {  MinLength, IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) implements UpdatedUserDataDto {
    @IsNotEmpty()
    @ApiProperty({example: "Ivan", description:"User's name"})
    name: string;
    @IsNotEmpty()
    @ApiProperty({example: "london", description:"User's location"})
    location: string;
    @IsNotEmpty()
    @ApiProperty({example: "23", description:"User's age"})
    age: number;
    @IsNotEmpty()
    @ApiProperty({example: "ivan2005", description:"User's password"})
    password: string
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({example: "useremail12@gmail.com", description:"User's Email"})
    email: string;
    @IsNotEmpty()
    @ApiProperty({example: "male", description:"User's gender"})
    gender: string
}
