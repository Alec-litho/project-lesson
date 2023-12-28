import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import mongoose from "mongoose";


export class CreateImageDto implements ICreateImageDto {
    @ApiProperty({example:"Name", description:"Name of the image"})
    @IsNotEmpty()
    title: string
    @ApiProperty({example:"6563912b95db05b60c92022a || false", description:"album in which the image is stored"})
    @IsNotEmpty()
    album: string /*| mongoose.Types.ObjectId*/
    @ApiProperty({example:"In this image you can see me and...", description:"description of this image"})
    description: string 
    @IsNotEmpty()
    @ApiProperty({example:"https://i.ibb.co/Bqm8N2r/default-avatar-trendal-me", description:"url of the image"})
    imageURL: string
    @ApiProperty({example:"771125073b435y39bd5f7024 || false", description:"id to the post if user uploaded image specifically for this post"})
    @IsNotEmpty()
    postId: boolean /*| mongoose.Types.ObjectId*/
    @ApiProperty({example:"651125073b4359d9bd5f7b74", description:"user id"})
    @IsNotEmpty()
    user: string /*| mongoose.Types.ObjectId*/
} 
