import { ApiProperty } from '@nestjs/swagger';
import { IsString,IsNotEmpty,IsArray } from "class-validator";
import mongoose from 'mongoose';
import { CreateImageDto } from 'src/image/dto/create-image.dto';
import { DeleteImageDto } from 'src/image/dto/delete-image.dto';
import { UpdateImageDto } from 'src/image/dto/update-image.dto';
import { ImageDocument } from 'src/image/entities/image.entity';



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
    images: ImageDocument[]
}