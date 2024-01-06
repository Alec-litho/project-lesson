import { IsString, Length, IsNotEmpty, IsArray} from "class-validator"
import mongoose from "mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { CreateImageDto } from "src/image/dto/create-image.dto"
import { Image } from "src/image/entities/image.entity"


export class CreatePostDto implements ICreatePostDto {
    @ApiProperty({example: "Random text of this very long post...", description:"Post's text"})
    @IsString()
    @IsNotEmpty()
    text: string
    @ApiProperty({example: "656395f24db3c1a422c2e8c9", description:"Post's author"})
    @IsNotEmpty()
    author: string
    @IsArray()
    @ApiProperty({example: "[CreateImageDto]",description:"post's images"})
    images: Image[] | [] 

}