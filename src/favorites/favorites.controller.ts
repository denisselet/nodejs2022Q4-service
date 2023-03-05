import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':attribute/:id')
  addAttribute(@Param('attribute') attribute: string, @Param('id') id: string) {
    return this.favoritesService.addAttribute(attribute, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':attribute/:id')
  @HttpCode(204)
  deleteAttribute(
    @Param('attribute') attribute: string,
    @Param('id') id: string,
  ) {
    return this.favoritesService.deleteAttribute(attribute, id);
  }
}
