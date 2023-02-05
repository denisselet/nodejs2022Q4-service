import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateTrackDto {
  @IsString({ each: true })
  name: string;

  @IsOptional()
  @IsString({ each: true })
  artistId: string | null; // refers to Artist

  @IsOptional()
  @IsString({ each: true })
  albumId: string | null; // refers to Album

  @IsNumber()
  duration: number; // integer number
}
