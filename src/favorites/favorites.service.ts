import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate } from 'uuid';
import { FavoriteEntity } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { attributes } from './constants';
import { arrayIds } from './favorites.utils';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private favoriteRepository: Repository<FavoriteEntity>,

    private tracksService: TracksService,
    private albumsService: AlbumsService,
    private artistsService: ArtistsService,
  ) {}
  async findAll() {
    const favorites = await this.favoriteRepository.find();
    const tracksArray = await this.tracksService.findAll();
    const artistsArray = await this.artistsService.findAll();
    const albumsArray = await this.albumsService.findAll();
    const trackIds = arrayIds(favorites, attributes.tracks);
    const artistIds = arrayIds(favorites, attributes.artists);
    const albumIds = arrayIds(favorites, attributes.albums);
    const tracks = tracksArray.filter((track) => trackIds.includes(track.id));
    const artists = artistsArray.filter((artist) =>
      artistIds.includes(artist.id),
    );
    const albums = albumsArray.filter((album) => albumIds.includes(album.id));

    return { tracks, artists, albums };
  }

  async addAttribute(attribute: string, id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid ID');
    switch (attribute) {
      case 'track':
        await this.tracksService.checkTrack(id);
        const createdTrack = this.favoriteRepository.create({
          id,
          tracks: id,
        });
        return (await this.favoriteRepository.save(createdTrack)).toFavorite();
      case 'album':
        await this.albumsService.checkAlbum(id);

        const createdAlbum = this.favoriteRepository.create({
          id,
          albums: id,
        });
        return (await this.favoriteRepository.save(createdAlbum)).toFavorite();
      case 'artist':
        await this.artistsService.checkArtist(id);
        const createdArtist = this.favoriteRepository.create({
          id,
          artists: id,
        });
        return (await this.favoriteRepository.save(createdArtist)).toFavorite();
      default:
        throw new NotFoundException(`Attribute ${attribute} not found`);
    }
  }

  async deleteAttribute(attribute: string, id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid ID');
    switch (attribute) {
      case 'track':
        const track = await this.favoriteRepository.findOneBy({
          tracks: id,
        });
        if (!track)
          throw new UnprocessableEntityException(`Track ${id} not found`);
        return await this.favoriteRepository.delete(track.id);
      case 'artist':
        const artist = await this.favoriteRepository.findOneBy({
          artists: id,
        });
        if (!artist)
          throw new UnprocessableEntityException(`Artist ${id} not found`);
        return await this.favoriteRepository.delete(artist.id);
      case 'album':
        const album = await this.favoriteRepository.findOneBy({
          albums: id,
        });
        if (!album)
          throw new UnprocessableEntityException(`Album ${id} not found`);
        return await this.favoriteRepository.delete(album.id);
      default:
        throw new NotFoundException(`Attribute ${attribute} not found`);
    }
  }

  async deleteId(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid ID');
    const favorite = await this.favoriteRepository.findOneBy({ id });
    if (!favorite)
      throw new UnprocessableEntityException(`Favorite ${id} not found`);
    return await this.favoriteRepository.delete(favorite.id);
  }
}
