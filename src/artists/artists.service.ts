import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist, ArtistEntity } from './entities/artist.entity';
import { validate } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsService } from 'src/albums/albums.service';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistsRepository: Repository<ArtistEntity>,

    private tracksService: TracksService,
    private albumsService: AlbumsService, // private favoritesService: FavoritesService,
  ) {}
  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const id = uuidv4();
    const createdArtist = this.artistsRepository.create({
      ...createArtistDto,
      id,
    });
    return (await this.artistsRepository.save(createdArtist)).toArtist();
  }

  async findAll(): Promise<Artist[]> {
    const artists = await this.artistsRepository.find();
    return artists.map((artist) => artist.toArtist());
  }

  async findOne(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid id');
    }
    const artist = await this.artistsRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    return artist.toArtist();
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const artist = await this.artistsRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    Object.assign(artist, updateArtistDto);
    return (await this.artistsRepository.save(artist)).toArtist();
  }

  async remove(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid id');
    }
    const artist = await this.artistsRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);

    await this.tracksService.deleteArtistFromTrack(id);
    await this.albumsService.deleteArtistFromAlbum(id);

    // await this.favoritesService.deleteId(id);

    const deleteArtist = await this.artistsRepository.delete(id);
    if (deleteArtist.affected === 0)
      throw new NotFoundException(`Artist with id ${id} not found`);
  }

  async checkArtist(id: string) {
    const artist = await this.artistsRepository.findOne({ where: { id } });
    if (!artist)
      throw new UnprocessableEntityException(`Track with id ${id} not found`);
  }
}
