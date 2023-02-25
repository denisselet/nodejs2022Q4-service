import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'uuid';
import { AlbumEntity } from './entities/album.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TracksService } from 'src/tracks/tracks.service';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumsRepository: Repository<AlbumEntity>,

    private tracksService: TracksService, // private favoritesService: FavoritesService,
  ) {}
  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const id = uuidv4();
    const createdAlbum = this.albumsRepository.create({
      artistId: null,
      ...createAlbumDto,
      id,
    });
    return (await this.albumsRepository.save(createdAlbum)).toAlbum();
  }

  async findAll(): Promise<Album[]> {
    const albums = await this.albumsRepository.find();
    return albums.map((album) => album.toAlbum());
  }

  async findOne(id: string): Promise<Album | Error> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid id');
    }
    const album = await this.albumsRepository.findOne({ where: { id } });
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);

    return album.toAlbum();
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const album = await this.albumsRepository.findOne({ where: { id } });
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);
    Object.assign(album, updateAlbumDto);
    return (await this.albumsRepository.save(album)).toAlbum();
  }

  async remove(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid id');
    }
    const album = await this.albumsRepository.findOne({ where: { id } });
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);

    await this.tracksService.deleteAlbumFromTrack(id);
    const deleteAlbum = await this.albumsRepository.delete(id);
    if (deleteAlbum.affected === 0)
      throw new NotFoundException(`Album with id ${id} not found`);
  }

  async deleteArtistFromAlbum(artistId: string): Promise<void> {
    const albums = await this.albumsRepository.find({ where: { artistId } });
    for (const album of albums) {
      album.artistId = null;
      await this.albumsRepository.save(album);
    }
  }

  async checkAlbum(id: string) {
    const album = await this.albumsRepository.findOne({ where: { id } });
    if (!album)
      throw new UnprocessableEntityException(`Track with id ${id} not found`);
  }
}
