import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

@Entity('artist')
export class ArtistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  toArtist(): Artist {
    return this;
  }
}
