import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackDto } from './create-track.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {
  @IsString({ each: true })
  name: string;

  @IsOptional()
  @IsString({ each: true })
  artistId: string | null;

  @IsOptional()
  @IsString({ each: true })
  albumId: string | null;

  @IsOptional()
  @IsNumber()
  duration: number;
}
