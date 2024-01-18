import {
    Prop,
    Schema,
    SchemaFactory
  } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
  import mongoose, {
    HydratedDocument
  } from 'mongoose'; 
  import { Image, ImageDocument } from 'src/image/entities/image.entity';
export type PostDocument = HydratedDocument<PostModel>;

@Schema({ timestamps: true })
export class PostModel {
  @ApiProperty({example: "In this post i'd like to tell...",description:"post's text"})
    @Prop()
    text: string 
  @ApiProperty({example: "[fun,interesting,animals]",description:"post's tags"})
    @Prop({type: Array, default: []})
    tags:[]
  @ApiProperty({example: "[656395f24db3c1a422c2e8c9]",description:"post's views"})
    @Prop({default: []})
    views: mongoose.Types.ObjectId[] | [] 
  @ApiProperty({example: "656395f24db3c1a422c2e8c9",description:"post's author"})
    @Prop({required: true, ref:'User'})
    author:mongoose.Schema.Types.ObjectId
  @ApiProperty({example: "[656395f24db3c1a422c2e8c9]",description:"post's images"})
    @Prop({ref:'Image', default:[]})
    images: mongoose.Types.ObjectId[] | [] | ImageDocument[]
  @ApiProperty({example: "[656395f24db3c1a422c2e8c9]",description:"post's comments"})
    @Prop({ref:"Comment", default: []})
    comments: mongoose.Types.ObjectId[] | []
  @ApiProperty({example: "991",description:"post's likes count"})
    @Prop({ref:"User", default: []})
    likes: mongoose.Types.ObjectId[] | []
  @ApiProperty({example: "23",description:"post's shares count"})
    @Prop({ref:"User", default: []})
    shares: mongoose.Types.ObjectId[] | []
    @ApiProperty({example: "[656395f24db3c1a422c2e8c9]",description:"post's list of users that removed it from their recommendations"})
    @Prop({ref:"User", default: []})
    removedRecommendation: mongoose.Types.ObjectId[] | []
  @ApiProperty({example: "656395f24db3c1a422c2e8c9",description:"post mongoose model id",type:mongoose.Types.ObjectId})
    // @Prop({type:mongoose.Types.ObjectId})
    _id:mongoose.Types.ObjectId;
  @ApiProperty({example: "2023-08-17T15:41:10.645+00:00", description: 'Created At' })
    @Prop({default:Date.now()})
    createdAt?: Date
}

export const PostSchema = SchemaFactory.createForClass(PostModel);