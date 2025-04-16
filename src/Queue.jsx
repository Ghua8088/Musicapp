import React from 'react';
import Song from './song.jsx';

export const songs = [
  {
    id: 1,
    title: "Song 1",
    author: "Author 1",
    coverSvg: "/assets/covers/cover1.svg",
    audioSrc: "/assets/audio/song1.mp3",
    album: "Album 1",
    year: "2023"
  },
  {
    id: 2,
    title: "Song 2",
    author: "Author 2",
    coverSvg: "/assets/covers/cover2.svg",
    audioSrc: "/assets/audio/song2.mp3",
    album: "Album 2",
    year: "2023"
  },
  {
    id: 3,
    title: "Song 3",
    author: "Author 3",
    coverSvg: "/assets/covers/cover3.svg",
    audioSrc: "/assets/audio/song3.mp3",
    album: "Album 3",
    year: "2023"
  }
];

const Queue = () => (
  <div className="queue">
    {songs.map(song => (
      <Song
        key={song.id}
        songName={song.title}
        authorName={song.author}
        coverSvg={song.coverSvg}
      />
    ))}
  </div>
);

export default Queue;