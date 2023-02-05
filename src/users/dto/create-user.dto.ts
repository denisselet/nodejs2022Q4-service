import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ each: true })
  readonly login: string;

  @IsString({ each: true })
  readonly password: string;
}
