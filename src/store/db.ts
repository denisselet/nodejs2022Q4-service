import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { User } from 'src/users/entities/user.entity';

const memory = {
  users: [],
  artists: [],
  albums: [],
  tracks: [],
  favorites: {
    artists: [],
    albums: [],
    tracks: [],
  },
};

export const db = {
  users: {
    addUser: (user: User) => {
      memory.users.push(user);
    },
    getUsers: () => {
      return memory.users;
    },
    getUser: (id: string) => {
      return memory.users.find((user) => user.id === id);
    },
    updateUser: (id: string, user: User) => {
      const index = memory.users.findIndex((user) => user.id === id);
      if (index === -1) return;
      memory.users[index] = user;
    },
    deleteUser: (id: string) => {
      const index = memory.users.findIndex((user) => user.id === id);
      if (index === -1) return;
      memory.users.splice(index, 1);
    },
  },
  tracks: {
    addTrack: (track: Track) => {
      memory.tracks.push(track);
    },
    getTracks: () => {
      return memory.tracks;
    },
    getTrack: (id: string) => {
      return memory.tracks.find((track) => track.id === id);
    },
    updateTrack: (id: string, track: Track) => {
      const index = memory.tracks.findIndex((track) => track.id === id);
      if (index === -1) return;
      memory.tracks[index] = track;
    },
    deleteTrack: (id: string) => {
      const index = memory.tracks.findIndex((track) => track.id === id);
      if (index === -1) return;
      memory.tracks.splice(index, 1);
    },
  },
  artists: {
    addArtist: (artist: Artist) => {
      memory.artists.push(artist);
    },
    getArtists: () => {
      return memory.artists;
    },
    getArtist: (id: string) => {
      return memory.artists.find((artist) => artist.id === id);
    },
    updateArtist: (id: string, artist: Artist) => {
      const index = memory.artists.findIndex((artist) => artist.id === id);
      if (index === -1) return;
      memory.artists[index] = artist;
    },
    deleteArtist: (id: string) => {
      const index = memory.artists.findIndex((artist) => artist.id === id);
      if (index === -1) return;
      memory.artists.splice(index, 1);
    },
  },
  albums: {
    addAlbum: (album: Album) => {
      memory.albums.push(album);
    },
    getAlbums: () => {
      return memory.albums;
    },
    getAlbum: (id: string) => {
      return memory.albums.find((album) => album.id === id);
    },
    updateAlbum: (id: string, album: Album) => {
      const index = memory.albums.findIndex((album) => album.id === id);
      if (index === -1) return;
      memory.albums[index] = album;
    },
    deleteAlbum: (id: string) => {
      const index = memory.albums.findIndex((album) => album.id === id);
      if (index === -1) return;
      memory.albums.splice(index, 1);
    },
  },
  favorites: {
    addFavorite: (attribute: string, id: string) => {
      memory.favorites[attribute].push(id);
    },
    deleteFavorite: (attribute: string, id: string) => {
      const index = memory.favorites[attribute].findIndex(
        (favorite: string) => favorite === id,
      );
      if (index === -1) return;
      memory.favorites[attribute].splice(index, 1);
    },
    getFavoritesIds: () => {
      return memory.favorites;
    },
    checkFavorite: (attribute: string, id: string) => {
      return memory.favorites[attribute].includes(id);
    },
  },
};
