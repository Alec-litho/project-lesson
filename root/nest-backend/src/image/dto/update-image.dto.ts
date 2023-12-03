import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';



export class UpdateImageDto {
    @ApiProperty({example:"Name", description:"Name of the image"})
    @IsNotEmpty()
    title: string
    @ApiProperty({example:"6563912b95db05b60c92022a", description:"album in which the image is stored"})
    @IsNotEmpty()
    album: any
    @ApiProperty({example:"In this image you can see me and...", description:"description of this image"})
    @IsNotEmpty()
    description: string 
    @IsNotEmpty()
    @ApiProperty({example:"https://i.ibb.co/Bqm8N2r/default-avatar-trendal-me", description:"url of the image"})
    imageURL: string
    @ApiProperty({example:"771125073b435y39bd5f7024 || false", description:"id to the post if user uploaded image specifically for this post"})
    @IsNotEmpty()
    postId: any
    @ApiProperty({example:"651125073b4359d9bd5f7b74", description:"user id"})
    @IsNotEmpty()
    user: any
}
