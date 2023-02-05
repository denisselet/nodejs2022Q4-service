import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumDto } from './create-album.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {
  @IsString({ each: true })
  name: string;

  @IsNumber()
  year: number;

  @IsOptional()
  @IsString({ each: true })
  artistId: string | null; // refers to Artist
}
