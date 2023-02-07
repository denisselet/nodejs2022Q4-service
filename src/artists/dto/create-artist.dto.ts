import { IsString, IsBoolean } from 'class-validator';

export class CreateArtistDto {
  @IsString({ each: true })
  readonly name: string;

  @IsBoolean({ each: true })
  readonly grammy: boolean;
}
