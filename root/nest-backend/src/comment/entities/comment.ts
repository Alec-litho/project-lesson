import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose,{ HydratedDocument } from "mongoose";

export type CommentDocument = HydratedDocument<Comment> 

@Schema({timestamps: true})
export class Comment {
    @ApiProperty({example:"I love the youtube lo-fi community. We all just chillin and being coz...", description:"user comment"})
    @Prop({trim: true, required:true})
    text: string
    @ApiProperty({example:"651125073b4359d9bd5f7b74", description:"Author"})
    @Prop({required:true, ref: "User", type: mongoose.Types.ObjectId || String}) 
    user;
    @ApiProperty({example:"656ed9be81058725b67659fd", description:"Post that user commented on"})
    @Prop({required:true, ref:"Post", type: mongoose.Types.ObjectId || String})
    post;
    @ApiProperty({example:"656ed9be81058725b67659fd", description:"Comment that user replied to"})
    @Prop({ref:"Comment", default: false, type: mongoose.Types.ObjectId || Boolean})
    replyTo;
    @ApiProperty({example:"[656ed9be81058725b67659fd,656ed9be81058725b67659f7]", description:"Comment's like count"})
    @Prop({ref:"User", default: [], type: mongoose.Types.ObjectId || [String]})
    likes;s
    @ApiProperty({example:"[656ed9be81058725b67659fd,656ed9be81058725b67659f7]", description:"Comment's reply count"})
    @Prop({ref:"Comment", default: [], type: mongoose.Types.ObjectId || [String]})
    replies;
    @ApiProperty({example: "656395f24db3c1a422c2e8c9",description:"comment's mongoose model id",type:mongoose.Types.ObjectId})
    _id:mongoose.Types.ObjectId;
    @ApiProperty({example: "2023-08-17T15:41:10.645+00:00", description: 'Created At' })
      @Prop()
      createdAt?: Date
}

export const CommentSchema = SchemaFactory.createForClass(Comment);