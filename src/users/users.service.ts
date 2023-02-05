import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'uuid';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto): User {
    const id = uuidv4();
    // const id = '1';
    const version = 0;
    const login = createUserDto.login;
    const createdAt = Date.now();
    const updatedAt = Date.now();
    this.users.push({ ...createUserDto, id, version, createdAt, updatedAt });
    return { id, login, version, createdAt, updatedAt };
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);
    if (user.password !== updateUserDto.oldPassword)
      throw new ForbiddenException('Invalid password');

    user.password = updateUserDto.newPassword;

    this.users = this.users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          version: user.version + 1,
          updatedAt: Date.now(),
        };
      }
      return user;
    });

    const { password, ...args } = user;
    return { id, ...args };
  }

  remove(id: string) {
    this.findOne(id); // check if user exists
    this.users = this.users.filter((user) => user.id !== id);
  }
}
