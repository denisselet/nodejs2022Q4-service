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

@Injectable()
export class ArtistsService {
  private artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto): Artist {
    const id = uuidv4();
    this.artists.push({ ...createArtistDto, id });
    return { ...createArtistDto, id };
  }

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artist = this.findOne(id);
    this.artists = this.artists.map((artist) => {
      if (artist.id === id) {
        return { ...artist, ...updateArtistDto };
      }
      return artist;
    });
    return { ...artist, ...updateArtistDto };
  }

  remove(id: string): void {
    this.artists = this.artists.filter((artist) => artist.id !== id);
  }
}
