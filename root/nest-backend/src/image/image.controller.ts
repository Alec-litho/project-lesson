import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Image } from './entities/image.entity';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  @ApiOperation({summary:"Upload an image"})
  @ApiResponse({status:201,type:Image})
  @Post()
  async uploadImage(@Body() image: CreateImageDto, @Res() res: Response) {
    const result = await this.imageService.uploadImage(image);
    res.send(result)
  }
  @ApiOperation({summary:"Get posts' images"})
  @ApiResponse({status:200,type:[Image]})
  @Get('postImgs/:postId') 
  async getPostsImages(@Param('postId') postId: string, @Res() res: Response) {
    const result = await this.imageService.getPostsImages(postId);
    res.send(result)
  }
  @ApiOperation({summary:"Get an image, 'populated' parameter is required to specify if you want to receive detailed information about image's album. If album wasn't populated then img doesn't have it"})
  @ApiResponse({status:200,type:Image}) 
  @Get(':id/:populated') 
  async getOneImage(@Param('id') id:string, @Param('populated') populated: boolean, @Res() res: Response) {
    const result = await this.imageService.getOneImage(id, populated);
    res.send(result)
  }
  @ApiOperation({summary:"Delete an image"})
  @ApiResponse({status:200,type:Image})
  @Delete(':id')
  async deleteImage(@Param('id') id: string, @Res() res: Response) {
    const result = await this.imageService.deleteImage(id);
    res.send({image:result.value, message:result.message})
  }
  @ApiOperation({summary:"Update an image"})
  @ApiResponse({status:200,type:Image})
  @Patch(":id")
  async updateImage(@Param('id') id: string, image: UpdateImageDto, @Res() res: Response) {
    return this.imageService.updateImage(id, image);
  }

}
