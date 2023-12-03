import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Album } from './entities/album.entity';

@Controller('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiOperation({summary:"Create Album"})
  @ApiResponse({status:201,type:Album})
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get('user/:id')
  @ApiOperation({summary:"Get all user's albums"})
  @ApiResponse({status:200,type:[Album]})
  findAll(@Param('id') id: string) { 
    return this.albumService.getUserAlbums(id);
  }

  @Get(':id')
  @ApiOperation({summary:"Get user's album"})
  @ApiResponse({status:200,type:Album})
  findOne(@Param('id') id: string) {
    return this.albumService.getAlbum(+id);
  }

  @Patch(':id')
  @ApiOperation({summary:"Update user's album"})
  @ApiResponse({status:200,type:Album})
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumService.update(+id, updateAlbumDto);
  }

  @Delete(':id')
  @ApiOperation({summary:"Delete user's album"})
  @ApiResponse({status:200,type:Boolean})
  remove(@Param('id') id: string) {
    return this.albumService.remove(+id);
  }
}
