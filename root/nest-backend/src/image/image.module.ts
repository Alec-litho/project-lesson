import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema,Image } from './entities/image.entity';
import { AlbumSchema } from 'src/album/entities/album.entity';


@Module({
  imports: [
    MongooseModule.forFeature([{name: "Image", schema:ImageSchema}]),
    MongooseModule.forFeature([{ name: "Album", schema: AlbumSchema }]),
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports:[ImageModule, MongooseModule, ImageService]
})
export class ImageModule {}
