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
import { db } from 'src/store/db';

@Injectable()
export class TracksService {
  create(createTrackDto: CreateTrackDto) {
    const id = uuidv4();
    const track = { artistId: null, albumId: null, ...createTrackDto, id };
    db.tracks.addTrack(track);
    return track;
  }

  findAll() {
    return db.tracks.getTracks();
  }

  findOne(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const track = db.tracks.getTrack(id);
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);

    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.findOne(id);
    db.tracks.updateTrack(id, {
      ...track,
      ...updateTrackDto,
    });
    return { ...track, ...updateTrackDto };
  }

  remove(id: string) {
    const favorites = db.favorites.getFavoritesIds();
    if (favorites.tracks.includes(id))
      db.favorites.deleteFavorite('tracks', id);
    this.findOne(id);
    db.tracks.deleteTrack(id);
  }
}
