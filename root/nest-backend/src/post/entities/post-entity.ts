import {
    Prop,
    Schema,
    SchemaFactory
  } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
  import mongoose, {
    HydratedDocument
  } from 'mongoose'; 
  import { Image } from 'src/image/entities/image.entity';
export type PostDocument = HydratedDocument<PostModel>;

@Schema()
export class PostModel {
  @ApiProperty({example: "In this post i'd like to tell...",description:"post's text"})
    @Prop()
    text: string 
  @ApiProperty({example: "[fun,interesting,animals]",description:"post's tags"})
    @Prop({type: Array, default: []})
    tags:[]
  @ApiProperty({example: "1190",description:"post's views"})
    @Prop({default: 0})
    viewCount: number
  @ApiProperty({example: "656395f24db3c1a422c2e8c9",description:"post's author"})
    @Prop({required: true, ref:'User'})
    author:mongoose.Schema.Types.ObjectId
  @ApiProperty({example: "[656395f24db3c1a422c2e8c9]",description:"post's images"})
    @Prop({ref:'Image', type: [mongoose.Schema.Types.ObjectId] || [], default:[]})
    images: mongoose.Schema.Types.ObjectId[] | Image[] | []
  @ApiProperty({example: "[656395f24db3c1a422c2e8c9]",description:"post's comments"})
    @Prop({ref:"Comment", default: []})
    comments: mongoose.Types.ObjectId[] | []
  @ApiProperty({example: "991",description:"post's likes count"})
    @Prop({ref:"User", default: []})
    likes: mongoose.Types.ObjectId[] | []
  @ApiProperty({example: "23",description:"post's shares count"})
    @Prop({ref:"User", default: []})
    shares: mongoose.Types.ObjectId[] | []
    @ApiProperty({example: "656395f24db3c1a422c2e8c9",description:"post mongoose model id",type:mongoose.Types.ObjectId})
    // @Prop({type:mongoose.Types.ObjectId})
    _id:mongoose.Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(PostModel);