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
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { uniqueDateNow } from './users.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const userId = uuidv4();
    const createdUser = this.usersRepository.create({
      ...createUserDto,
      id: userId,
      version: 1,
      createdAt: uniqueDateNow(),
      updatedAt: uniqueDateNow(),
    });
    return (await this.usersRepository.save(createdUser)).toUser();
  }

  async findAll() {
    const users = await this.usersRepository.find();
    return users.map((user) => user.toUser());
  }

  async findOne(userId: string) {
    if (!validate(userId)) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    return user.toUser();
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    if (!validate(userId)) throw new BadRequestException('Invalid id');
    const updateUser = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!updateUser)
      throw new NotFoundException(`User with id ${userId} not found`);
    if (updateUser.password != updateUserDto.oldPassword) {
      throw new ForbiddenException('Invalid password');
    }
    Object.assign(updateUser, {
      password: updateUserDto.newPassword,
      version: updateUser.version + 1,
      updatedAt: uniqueDateNow(),
    });
    return (await this.usersRepository.save(updateUser)).toUser();
  }

  async remove(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    const deleteUser = await this.usersRepository.delete(id);
    if (deleteUser.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async findLogin(login: string) {
    return await this.usersRepository.findOneBy({ login });
  }
}
