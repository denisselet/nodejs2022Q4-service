import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { validate } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { db } from 'src/store/db';

@Injectable()
export class ArtistsService {
  create(createArtistDto: CreateArtistDto): Artist {
    const id = uuidv4();
    db.artists.addArtist({ ...createArtistDto, id });
    return { ...createArtistDto, id };
  }

  findAll(): Artist[] {
    return db.artists.getArtists();
  }

  findOne(id: string): Artist {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const artist = db.artists.getArtist(id);
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artist = this.findOne(id);
    db.artists.updateArtist(id, { ...artist, ...updateArtistDto });
    return { ...artist, ...updateArtistDto };
  }

  remove(id: string): void {
    const tracks = db.tracks.getTracks();
    const albums = db.albums.getAlbums();
    const tracksWithArtist = tracks.filter((track) => track.artistId === id);
    const albumsWithArtist = albums.filter((album) => album.artistId === id);

    if (tracksWithArtist)
      for (const track of tracksWithArtist) {
        db.tracks.updateTrack(track.id, { ...track, artistId: null });
      }
    if (albumsWithArtist)
      for (const album of albumsWithArtist) {
        db.albums.updateAlbum(album.id, { ...album, artistId: null });
      }

    const favorites = db.favorites.getFavoritesIds();
    if (favorites.artists.includes(id))
      db.favorites.deleteFavorite('artists', id);
    this.findOne(id);
    db.artists.deleteArtist(id);
  }
}
