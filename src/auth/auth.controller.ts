import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() AuthDto: AuthDto) {
    const oldUser = await this.authService.findLogin(AuthDto.login);
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    return this.authService.signup(AuthDto);
  }

  @Post('login')
  async login(@Body() AuthDto: AuthDto) {
    const { id, login } = await this.authService.validateUser(AuthDto);
    return this.authService.login(id, login);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Body() AuthDto: AuthDto) {
    // return this.authService.refresh(AuthDto);
  }
}
