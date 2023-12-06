import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateCommentDto{
    @ApiProperty({example:"I honestly don't think there's...", description:"comment's text"})
    @IsNotEmpty()
    @IsString()
    text: string
    @ApiProperty({example:"656395f24db3c1a422c2e8c9", description:"comment's author"})
    @IsNotEmpty()
    user: mongoose.Types.ObjectId | string
    @ApiProperty({example:"656ed9be81058725b67659fd", description:"Post that user commented on"})
    @IsNotEmpty()
    post: mongoose.Types.ObjectId | string
    @ApiProperty({example:"656ed9be81058725b67659fd", description:"Comment that user replied to"})
    @IsNotEmpty()
    replyTo: mongoose.Types.ObjectId | string
}