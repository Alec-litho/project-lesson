import { ApiProperty } from '@nestjs/swagger';
import { IsString,IsNotEmpty,IsArray } from "class-validator";
import mongoose from 'mongoose';
import { CreateImageDto } from 'src/image/dto/create-image.dto';

export class UpdatePostDto {
    @ApiProperty({example: "Random text of this very long post...", description:"Post's text"})
    @IsString()
    @IsNotEmpty()
    text: string
    @IsArray()
    @IsString({each:true})
    @ApiProperty({example: "[cats, fun, business]", description:"Post's tags"})
    tags: string[]
    @IsArray()
    @ApiProperty({example: "[CreateImageDto]",description:"post's images"})
    images: CreateImageDto[] | [] 
}