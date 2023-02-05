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

@Injectable()
export class AlbumsService {
  private albums: Album[] = [];

  create(createAlbumDto: CreateAlbumDto): Album {
    const id = uuidv4();
    this.albums.push({ artistId: null, ...createAlbumDto, id });
    return { artistId: null, ...createAlbumDto, id };
  }

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    if (!validate(id)) throw new BadRequestException('Invalid id');
    const album = this.albums.find((album) => album.id === id);
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);

    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const album = this.findOne(id);
    this.albums = this.albums.map((album) => {
      if (album.id === id) {
        return { ...album, ...updateAlbumDto };
      }
      return album;
    });

    return { ...album, ...updateAlbumDto };
  }

  remove(id: string): void {
    this.findOne(id);
    this.albums = this.albums.filter((album) => album.id !== id);
  }
}
