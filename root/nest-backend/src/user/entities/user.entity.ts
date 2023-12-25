import {
    Prop,
    Schema,
    SchemaFactory
  } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
  import mongoose, {
    HydratedDocument
  } from 'mongoose';
  import { Album } from 'src/album/entities/album.entity';
  export type UserDocument = HydratedDocument<User>;
@Schema()
export class User { 
  @ApiProperty({example: "Oleg", description:"Name of the user"})
    @Prop({required:true})
    fullName: string;
  @ApiProperty({example: "useremail12@gmail.com", description:"User's Email"})
    @Prop({required:true, unique:true})
    email: string;
  @ApiProperty({example: "OLEG123_password", description:"User's password"}) 
    @Prop({required:true})
    password: string;
  @ApiProperty({example: "Moscow", description:"User's location"}) 
    @Prop({default:'not mentioned'})
    location: string;
  @ApiProperty({example: "11", description:"User's friends list"}) 
    @Prop({default:[], ref: "User"})
    friends:mongoose.Types.ObjectId[];
  @ApiProperty({example: "2005-09-13", description:"User's birth date"})  
    @Prop({default:'not mentioned'})
    birth:string;
  @ApiProperty({example: "18", description:"User's age"}) 
    @Prop({default:'not mentioned'})
    age:number;
  @ApiProperty({example: "male", description:"User's gender"}) 
    @Prop()
    gender:string;
  @ApiProperty({example: "https://i.ibb.co/7YGBqxN/empty-Profile-Picture.webp", description:"User's avatar image"}) 
    @Prop({default:'https://i.ibb.co/Bqm8N2r/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'})
    avatarUrl: string;
    @ApiProperty({example: "656395f24db3c1a422c2e8c9",description:"user mongoose model id",type:mongoose.Types.ObjectId})
    // @Prop({type: mongoose.Types.ObjectId })
    _id: mongoose.Types.ObjectId;
}


export const UserSchema = SchemaFactory.createForClass(User);