import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from './entities/album.entity';
import { TracksModule } from 'src/tracks/tracks.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([AlbumEntity]),
    TracksModule,
    // FavoritesService,
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
