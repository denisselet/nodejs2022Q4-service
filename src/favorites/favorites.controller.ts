import { Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post(':attribute/:id')
  addAttribute(@Param('attribute') attribute: string, @Param('id') id: string) {
    return this.favoritesService.addAttribute(attribute, id);
  }

  @Delete(':attribute/:id')
  deleteAttribute(
    @Param('attribute') attribute: string,
    @Param('id') id: string,
  ) {
    return this.favoritesService.deleteAttribute(attribute, id);
  }
}
