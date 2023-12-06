import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";




export class UpdateCommentDto {
    @ApiProperty({example:"I honestly don't think there's...", description:"comment's text"})
    @IsNotEmpty()
    @IsString()
    text: string
    @ApiProperty({example:"656ed9be81058725b67659fd", description:"comment's id"})
    @IsNotEmpty()
    _id: mongoose.Types.ObjectId | string
}