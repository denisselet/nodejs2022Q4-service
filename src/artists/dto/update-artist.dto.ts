import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';
import { IsString, IsBoolean } from 'class-validator';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  @IsString({ each: true })
  readonly name: string;

  @IsBoolean({ each: true })
  readonly grammy: boolean;
}
