import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";



export class LikeComment implements ILikeComment {
    @ApiProperty({example:"656395f24db3c1a422c2e8c9", description:"id of the user that liked comment"})
    userId: string
}