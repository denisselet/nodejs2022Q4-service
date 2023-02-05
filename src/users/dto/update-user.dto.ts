import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString({ each: true })
  readonly oldPassword: string;

  @IsString({ each: true })
  readonly newPassword: string;
}
