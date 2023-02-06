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
import { db } from 'src/store/db';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto): User {
    const id = uuidv4();
    const version = 0;
    const login = createUserDto.login;
    const createdAt = Date.now();
    const updatedAt = Date.now();
    db.users.addUser({ ...createUserDto, id, version, createdAt, updatedAt });
    return { id, login, version, createdAt, updatedAt };
  }

  findAll(): User[] {
    const users = db.users.getUsers();
    return users.reduce((acc, user) => {
      const { password, ...userWithoutPassword } = user;
      return [...acc, userWithoutPassword];
    }, []);
  }

  findOne(id: string): User {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const user = db.users.getUser(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const user = db.users.getUser(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    const { password, ...userWithoutPassword } = user;
    if (user.password != updateUserDto.oldPassword) {
      throw new ForbiddenException('Invalid password');
    }

    user.password = updateUserDto.newPassword;

    db.users.updateUser(id, {
      ...user,
      version: user.version + 1,
      updatedAt: Date.now(),
    });

    return userWithoutPassword;
  }

  remove(id: string) {
    this.findOne(id);
    db.users.deleteUser(id);
  }
}
