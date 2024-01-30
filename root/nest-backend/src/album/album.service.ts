import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from './entities/album.entity';
import mongoose, {Model} from 'mongoose';

@Injectable()
export class AlbumService {
  constructor(@InjectModel(Album.name) private readonly albumModel: Model<Album>) {}


  async create(createAlbumDto: CreateAlbumDto) {
    try {
      const userId = new mongoose.Types.ObjectId(createAlbumDto.user)
      const model = new this.albumModel({
        name: createAlbumDto.name,
        user: userId,
        description: createAlbumDto.description
      }); 
      model.save();
      return model
  } catch(error) {
      throw new InternalServerErrorException({message:error})
  }}

  async getUserAlbums(id:string) {
    console.log("28",id);
    
    const userId = new mongoose.Types.ObjectId(id)
    const albums = await this.albumModel.find({user:userId}).populate("images")
    if(albums.length===0) throw new NotFoundException({message: "user doesn't have any albums"})
    return albums
    
  }

  async getAlbum(id: number) {
    const album = await this.albumModel.findById(id).populate("images");
    if(!album) throw new NotFoundException({message: "there is no album that has this id"})
    return album;
  }

  update(id: number, updateAlbumDto: UpdateAlbumDto) {
    return `This action updates a #${id} album`;
  }

  remove(id: number) {
    return `This action removes a #${id} album`;
  }
}

