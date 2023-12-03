import {IsNotEmpty, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
    @ApiProperty({example:"Stuff", description:"Album's name"})
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty({example:"656395f24db3c1a422c2e8c9", description:"Album's owner"})
    @IsNotEmpty()
    user: any;
    @ApiProperty({example:"Just weird stuff that i like", description:"Album's description"})
    description: string;
}
