import {Prop,Schema,SchemaFactory} from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, {HydratedDocument} from 'mongoose'; 
  
  export type ImageDocument = HydratedDocument<Image>;

@Schema()
export class Image implements ImageModel {
  @ApiProperty({example:"Name", description:"Name of the image", type: String})
    @Prop({required:true})
    title: string; 
  @ApiProperty({example:"651125073b4359d9bd5f7b74", description:"user id", type: mongoose.Types.ObjectId})
    @Prop({required:true, ref: "User"})
    user: mongoose.Types.ObjectId; 
  @ApiProperty({example:"In this image you can see me and...", description:"description of this image", type: String})
    @Prop({default: ''})
    description: string;
  @ApiProperty({example:"771125073b435y39bd5f7024 || false", description:"album id", type: mongoose.Types.ObjectId})
    @Prop({type: mongoose.Types.ObjectId || Boolean, ref: "Album" })
    album;
  @ApiProperty({example:"https://i.ibb.co/Bqm8N2r/default-avatar-trendal-me", description:"url of the image", type: String})
    @Prop({required: true})
    imageURL: string;
    @ApiProperty({example:"771125073b435y39bd5f7024 || false", description:"id to the post if user uploaded image specifically for this post", type: Boolean || mongoose.Types.ObjectId})
    @Prop({type: mongoose.Types.ObjectId || Boolean })
    postId;
    @ApiProperty({example:"771125073b435y39bd5f7024", description:"image mongoose model id", type: mongoose.Types.ObjectId})
    // @Prop({type: mongoose.Types.ObjectId })
    _id: mongoose.Types.ObjectId;
}


export const ImageSchema = SchemaFactory.createForClass(Image);