import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { db } from 'src/store/db';
import { validate } from 'uuid';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  findAll(): Favorite {
    const tracks = db.tracks.getTracks();
    const artists = db.artists.getArtists();
    const albums = db.albums.getAlbums();
    const favorites = db.favorites.getFavoritesIds();
    return {
      tracks: tracks.filter((track) => favorites.tracks.includes(track.id)),
      artists: artists.filter((artist) =>
        favorites.artists.includes(artist.id),
      ),
      albums: albums.filter((album) => favorites.albums.includes(album.id)),
    };
  }

  addAttribute(attribute: string, id: string): void {
    switch (attribute) {
      case 'track':
        if (!validate(id)) throw new BadRequestException('Invalid ID');
        const track = db.tracks.getTrack(id);
        if (!track)
          throw new UnprocessableEntityException(`Track ${id} not found`);
        db.favorites.addFavorite('tracks', id);
        break;
      case 'album':
        if (!validate(id)) throw new BadRequestException('Invalid ID');
        const album = db.albums.getAlbum(id);
        if (!album)
          throw new UnprocessableEntityException(`Album ${id} not found`);
        db.favorites.addFavorite('albums', id);
        break;
      case 'artist':
        if (!validate(id)) throw new BadRequestException('Invalid ID');
        const artist = db.artists.getArtist(id);
        if (!artist)
          throw new UnprocessableEntityException(`Artist ${id} not found`);
        db.favorites.addFavorite('artists', id);
        break;
      default:
        throw new NotFoundException(`Attribute ${attribute} not found`);
        break;
    }
  }

  deleteAttribute(attribute: string, id: string): void {
    switch (attribute) {
      case 'track':
        if (!validate(id)) throw new BadRequestException('Invalid ID');
        const trackExist = db.tracks.getTrack(id);
        if (!trackExist) throw new NotFoundException(`Track ${id} not found`);
        db.favorites.deleteFavorite('tracks', id);
        break;
      case 'artist':
        if (!validate(id)) throw new BadRequestException('Invalid ID');
        const artistExist = db.artists.getArtist(id);
        if (!artistExist) throw new NotFoundException(`Artist ${id} not found`);
        db.favorites.deleteFavorite('artists', id);
        break;
      case 'album':
        if (!validate(id)) throw new BadRequestException('Invalid ID');
        const albumExist = db.albums.getAlbum(id);
        if (!albumExist) throw new NotFoundException(`Album ${id} not found`);
        db.favorites.deleteFavorite('albums', id);
        break;
      default:
        throw new NotFoundException(`Attribute ${attribute} not found`);
        break;
    }
  }
}
