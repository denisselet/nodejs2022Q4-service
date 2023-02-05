import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString({ each: true })
  name: string;

  @IsNumber()
  year: number;

  @IsOptional()
  @IsString({ each: true })
  artistId: string | null; // refers to Artist
}
