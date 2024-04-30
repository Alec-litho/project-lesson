import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";

 
@Schema({timestamps:true})
export class NotificationModel {
    @ApiProperty({example: "Friend request was sent to you from...",description:"notification message text"})
    @Prop({type:String})
    text: string
    // @ApiProperty({example: "20.04.2024/12:22:10",description:"notification message received at"})
    // @Prop({type:String})
    // date: string
    @ApiProperty({example: "{description: Friend request, image: http://imgbb.com/image-14532-id-9842}",description:"notification type"})
    @Prop({type:{description: String, imageUrl: String}})
    type: {description: string, imageUrl: string}
    @ApiProperty({example: "true",description:"if notification was viewed to user (new notification)"})
    @Prop({type:String})
    viewed: boolean
    @ApiProperty({example: "656395f24db3c1a422c2e8c9",description:"notification's id"})
    // @Prop({unique:true})
    _id:mongoose.Types.ObjectId;
    @ApiProperty({example: "656395f24db3c1a422c2e8c9",description:"user who sent notification message"})
    @Prop()
    sentBy:mongoose.Types.ObjectId;
    @ApiProperty({example: "656395f24db3c1a422c2e8c9",description:"user who received notification message"})
    @Prop()
    sentTo:mongoose.Types.ObjectId;
    @ApiProperty({example: "2023-08-17T15:41:10.645+00:00", description: 'Created At' })
    @Prop({default:Date.now()})
    createdAt?: Date
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationModel);