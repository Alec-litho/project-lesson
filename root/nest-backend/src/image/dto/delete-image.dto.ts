import { ApiProperty } from '@nestjs/swagger';
import { IsString,IsNotEmpty,IsArray } from "class-validator";


export class DeleteImageDto implements IDeleteImageDto {
    @ApiProperty({example: "6563912b95db05b60c92022a", description:"id of the image to be deleted"})
    @IsString()
    @IsNotEmpty()
    id: string
}