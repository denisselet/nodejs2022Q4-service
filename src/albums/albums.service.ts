import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'uuid';
import { db } from 'src/store/db';

@Injectable()
export class AlbumsService {
  create(createAlbumDto: CreateAlbumDto): Album {
    const id = uuidv4();
    db.albums.addAlbum({ artistId: null, ...createAlbumDto, id });
    return { artistId: null, ...createAlbumDto, id };
  }

  findAll(): Album[] {
    return db.albums.getAlbums();
  }

  findOne(id: string): Album {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const album = db.albums.getAlbum(id);
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);

    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const album = this.findOne(id);
    db.albums.updateAlbum(id, { ...album, ...updateAlbumDto });
    return { ...album, ...updateAlbumDto };
  }

  remove(id: string): void {
    const tracks = db.tracks.getTracks();
    const tracksWithAlbumId = tracks.filter((track) => track.albumId === id);
    if (tracksWithAlbumId)
      for (const track of tracksWithAlbumId) {
        db.tracks.updateTrack(track.id, { ...track, albumId: null });
      }
    const favorites = db.favorites.getFavoritesIds();
    if (favorites.albums.includes(id))
      db.favorites.deleteFavorite('albums', id);

    this.findOne(id);
    db.albums.deleteAlbum(id);
  }
}
