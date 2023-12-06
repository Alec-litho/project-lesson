import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose,{ HydratedDocument } from "mongoose";

export type CommentDocument = HydratedDocument<Comment>

@Schema()
export class Comment {
    @ApiProperty({example:"I love the youtube lo-fi community. We all just chillin and being coz...", description:"user comment"})
    @Prop({trim: true, required:true})
    text: string
    @ApiProperty({example:"651125073b4359d9bd5f7b74", description:"Author"})
    @Prop({required:true, ref: "User"})
    user: mongoose.Types.ObjectId | string
    @ApiProperty({example:"https://i.ibb.co/Bqm8N2r/default-avatar-trendal-me", description:"Author profile picture"})
    @Prop({required:true})
    userProfilePicture: string
    @ApiProperty({example:"656ed9be81058725b67659fd", description:"Post that user commented on"})
    @Prop({required:true, ref:"Post"})
    post: mongoose.Types.ObjectId | string
    @ApiProperty({example:"656ed9be81058725b67659fd", description:"Comment that user replied to"})
    @Prop({ref:"Comment", default: false})
    replyTo: mongoose.Types.ObjectId | boolean
    @ApiProperty({example:"[656ed9be81058725b67659fd,656ed9be81058725b67659f7]", description:"Comment's like count"})
    @Prop({ref:"User", default: []})
    likes: mongoose.Types.ObjectId[] | string[]
    @ApiProperty({example:"[656ed9be81058725b67659fd,656ed9be81058725b67659f7]", description:"Comment's reply count"})
    @Prop({ref:"Comment", default: []})
    replies: mongoose.Types.ObjectId[] | string[]
}

export const CommentSchema = SchemaFactory.createForClass(Comment);