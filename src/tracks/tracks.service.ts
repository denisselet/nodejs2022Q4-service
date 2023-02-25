import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { Track, TrackEntity } from './entities/track.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(TrackEntity)
    private tracksRepository: Repository<TrackEntity>, // private favoritesService: FavoritesService,
  ) {}
  async create(createTrackDto: CreateTrackDto) {
    const trackId = uuidv4();
    const createdTrack = this.tracksRepository.create({
      artistId: null,
      albumId: null,
      ...createTrackDto,
      id: trackId,
    });
    return (await this.tracksRepository.save(createdTrack)).toTrack();
  }

  async findAll() {
    const tracks = await this.tracksRepository.find();
    return tracks.map((track) => track.toTrack());
  }

  async findOne(id: string): Promise<Track | Error> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid id');
    }
    const track = await this.tracksRepository.findOne({ where: { id } });
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);

    return track.toTrack();
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const updateTrack = await this.tracksRepository.findOne({ where: { id } });
    if (!updateTrack)
      throw new NotFoundException(`Track with id ${id} not found`);

    Object.assign(updateTrack, updateTrackDto);
    return (await this.tracksRepository.save(updateTrack)).toTrack();
  }

  async remove(id: string) {
    // await this.favoritesService.deleteId(id);
    if (!validate(id)) {
      throw new BadRequestException('Invalid id');
    }
    const track = await this.tracksRepository.findOne({ where: { id } });
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);
    const deleteTrack = await this.tracksRepository.delete(id);
    if (deleteTrack.affected === 0) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }

  async deleteArtistFromTrack(artistId: string) {
    const tracks = await this.tracksRepository.find({ where: { artistId } });
    for (const track of tracks) {
      track.artistId = null;
      await this.tracksRepository.save(track);
    }
  }

  async deleteAlbumFromTrack(albumId: string) {
    const tracks = await this.tracksRepository.find({ where: { albumId } });
    for (const track of tracks) {
      track.albumId = null;
      await this.tracksRepository.save(track);
    }
  }

  async checkTrack(id: string) {
    const track = await this.tracksRepository.findOne({ where: { id } });
    if (!track)
      throw new UnprocessableEntityException(`Track with id ${id} not found`);
  }
}
