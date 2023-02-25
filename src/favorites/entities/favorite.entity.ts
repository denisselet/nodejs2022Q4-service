import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class Favorite {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

@Entity('favorite')
export class FavoriteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  artists: string;

  @Column()
  albums: string;

  @Column()
  tracks: string;

  toFavorite() {
    return this;
  }
}
