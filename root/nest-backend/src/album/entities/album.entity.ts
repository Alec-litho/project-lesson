import {Prop,SchemaFactory,Schema} from '@nestjs/mongoose';
import mongoose,{HydratedDocument} from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
export type AlbumDocument = HydratedDocument<Album>;



@Schema()
export class Album {
    @ApiProperty({example:"Stuff", description:"Album's name"})
    @Prop({required:true})
    name: string; 
    @ApiProperty({example:"656395f24db3c1a422c2e8c9", description:"Album's owner"})
    @Prop({required:true, ref: "User" })
    user: mongoose.Types.ObjectId;
    @ApiProperty({example:"[Image]", description:"Album's images"})
    @Prop({ ref: "Image", default: []})
    images: mongoose.Types.ObjectId[];
    @ApiProperty({example:"Just weird stuff that i like", description:"Album's description"})
    @Prop({default:''})
    description: string;
    @ApiProperty({example: "656395f24db3c1a422c2e8c9",description:"album's mongoose model id",type:mongoose.Types.ObjectId})
    // @Prop({type:mongoose.Types.ObjectId})
    _id:mongoose.Types.ObjectId;

}

export const AlbumSchema = SchemaFactory.createForClass(Album);
