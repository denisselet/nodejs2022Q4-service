import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { genSalt, hash, compare } from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { NO_EXIST_USER_OR_INCORRECT_PASSWORD } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private user: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async signup(AuthDto: AuthDto) {
    const salt = await genSalt(10);
    const newUser = await this.user.create({
      login: AuthDto.login,
      password: await hash(AuthDto.password, salt),
    });
    return newUser;
  }

  async findLogin(login: string) {
    return this.user.findLogin(login);
  }

  async validateUser(AuthDto: AuthDto) {
    const user = await this.user.findLogin(AuthDto.login);
    if (!user) {
      throw new ForbiddenException(NO_EXIST_USER_OR_INCORRECT_PASSWORD);
    }
    const isCorrectPassword = await compare(AuthDto.password, user.password);
    if (!isCorrectPassword) {
      throw new ForbiddenException(NO_EXIST_USER_OR_INCORRECT_PASSWORD);
    }
    return user;
  }

  async login(userId: string, login: string) {
    const payload = { login: login, userId: userId };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refreshToken: 'c',
    };
  }

  async refresh(userId: string, login: string) {
    const payload = { login: login, userId: userId };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refreshToken: 'c',
    };
  }
}
