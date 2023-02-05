import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { validate } from 'uuid';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];
  create(createTrackDto: CreateTrackDto) {
    const id = uuidv4();
    const track = { artistId: null, albumId: null, ...createTrackDto, id };
    this.tracks.push(track);
    return track;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const track = this.tracks.find((track) => track.id === id);
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);

    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.findOne(id);
    this.tracks = this.tracks.map((track) => {
      if (track.id === id) {
        return {
          ...track,
          ...updateTrackDto,
        };
      }
      return track;
    });
    return { ...track, ...updateTrackDto };
  }

  remove(id: string) {
    this.findOne(id);
    this.tracks = this.tracks.filter((track) => track.id !== id);
  }
}
