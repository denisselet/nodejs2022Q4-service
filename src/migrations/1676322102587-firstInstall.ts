import { uniqueDateNow } from '../users/users.utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
const idUser = uuidv4();
const idArtist = uuidv4();
const idAlbum = uuidv4();
const idTrack = uuidv4();

const createdAt = uniqueDateNow();
const updatedAt = uniqueDateNow();

export class firstInstall1676322102587 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "version" integer NOT NULL, "createdAt" integer NOT NULL, "updatedAt" integer NOT NULL, CONSTRAINT "PK_78a916df40e02a9deb1c4b75edb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "artist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "grammy" boolean NOT NULL )`,
    );
    await queryRunner.query(
      `CREATE TABLE "track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "duration" integer NOT NULL, "albumId" uuid, "artistId" uuid, CONSTRAINT "PK_8a3d2ad02c15208b952d1b8b1b3" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" integer NOT NULL, "artistId" uuid, CONSTRAINT "PK_0c59645040e02a9deb1c4b75edc" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "favorite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "artists" uuid, "tracks" uuid, "albums" uuid, PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `INSERT INTO "user" ("id", "login", "password", "version", "createdAt", "updatedAt") VALUES ('${idUser}', 'admin', 'admin', 1, ${createdAt}, ${updatedAt})`,
    );

    await queryRunner.query(
      `INSERT INTO "artist" ("id", "name", "grammy") VALUES ('${idArtist}', 'The Beatles', true)`,
    );

    await queryRunner.query(
      `INSERT INTO "album" ("id", "name", "year", "artistId") VALUES ('${idAlbum}', 'Abbey Road', 1969, '${idArtist}')`,
    );

    await queryRunner.query(
      `INSERT INTO "track" ("id", "name", "duration", "albumId", "artistId") VALUES ('${idTrack}', 'Come Together', 180, '${idAlbum}', '${idArtist}')`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "artist"`);
    await queryRunner.query(`DROP TABLE "album"`);
    await queryRunner.query(`DROP TABLE "track"`);
    await queryRunner.query(`DROP TABLE "favorite"`);
  }
}
