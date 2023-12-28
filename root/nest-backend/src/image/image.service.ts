import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Image, ImageDocument } from './entities/image.entity';
import mongoose, { Model } from 'mongoose';
import { Album, AlbumDocument } from 'src/album/entities/album.entity';
import { UpdateResult } from 'mongodb';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel("Image") private readonly imageModel: Model<Image>,
    @InjectModel("Album") private readonly albumModel: Model<Album>
  ){} 
  async uploadImage(createImageDto: CreateImageDto):Promise<ImageDocument> {
    try {
      let doc:ImageDocument;
      const userId = new mongoose.Types.ObjectId(createImageDto.user);
      if(createImageDto.album) {
        const albumId = new mongoose.Types.ObjectId(createImageDto.album);
        const album:AlbumDocument = await this.albumModel.findById(albumId)
        doc = new this.imageModel({...createImageDto,albumId,userId});
        await doc.save(); 
        if(album) { 
          const albumDoc = album as AlbumDocument 
          albumDoc.images.push(doc._id);
          await albumDoc.save();
        }
      } else {
        doc = new this.imageModel({...createImageDto,albumId:false,userId});
      }
      return doc;
    } catch (error) {
      return error
    }
  }

  findAll() {
    return `This action returns all image`;
  }

  async getOneImage(id:string, populated:boolean) {
    try {
      console.log(populated);
      
      if(!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException({message:"id is not valid"});
      let result = populated? await this.imageModel.findById(id).populate({path:"album",populate:{path:"images"}}) : await this.imageModel.findById(id);
      if(result!==null) {
        return {message: 'success', value: result}
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

};

  async deleteImage(id:string) {
    try {
    const imageId = new mongoose.Types.ObjectId(id)
    let result:ImageDocument = await this.imageModel.findByIdAndDelete(id);
    await this.albumModel.findOneAndUpdate({ _id: result.album}, { $pull: { images: imageId }});
    if(result!==null) {
      return {message: 'success', value: result}
    } else {
      throw new NotFoundException();
    }
  } catch (error) {
    throw new InternalServerErrorException();
  }
};
  async updateImage(id:string, image:UpdateImageDto):Promise<Image> {
    const updatedImage = await this.imageModel.findByIdAndUpdate(id, {
      ...image
    });
    return updatedImage;
  }
}


