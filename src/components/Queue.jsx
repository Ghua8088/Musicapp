import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Song from './Song';

export const songs = [
  {
    id: 1,
    title: "DEAF KEV - Invincible (Sped Up)",
    author: "DEAF KEV",
    coverSvg: "https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg",
    audioSrc: "/assets/music/DEAF KEV - Invincible (Sped Up) [NCS Release].mp3",
    album: "Speed Demons",
    year: "2023",
    genre: "Electronic",
    bpm: 150
  },
  {
    id: 2,
    title: "Blank (HYLO Remix)",
    author: "Disfigure, HYLO",
    coverSvg: "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg",
    audioSrc: "/assets/music/Disfigure, HYLO - Blank (HYLO Remix) [NCS Release].mp3",
    album: "Night Riders",
    year: "2023",
    genre: "Electronic",
    bpm: 140
  },
  {
    id: 3,
    title: "Losing Sleep",
    author: "Disfigure, Tara Louise",
    coverSvg: "https://images.pexels.com/photos/3189455/pexels-photo-3189455.jpeg",
    audioSrc: "/assets/music/Disfigure, Tara Louise - Losing Sleep (feat. Tara Louise) [NCS Release].mp3",
    album: "Turbo Dreams",
    year: "2023",
    genre: "Electronic",
    bpm: 128
  },
  {
    id: 4,
    title: "Love Letter",
    author: "m3gatron",
    coverSvg: "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg",
    audioSrc: "/assets/music/m3gatron - Love Letter [NCS Release].mp3",
    album: "Circuit Breakers",
    year: "2023",
    genre: "Electronic",
    bpm: 145
  },
  {
    id: 5,
    title: "Shine (Neddie Flip)",
    author: "Neddie, Spektrem",
    coverSvg: "https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg",
    audioSrc: "/assets/music/Neddie, Spektrem - Shine (Neddie Flip) [NCS Release].mp3",
    album: "Race Kings",
    year: "2023",
    genre: "Electronic",
    bpm: 135
  },
  {
    id: 6,
    title: "Live Your Life",
    author: "Tobu",
    coverSvg: "https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg",
    audioSrc: "/assets/music/Tobu - Live Your Life [NCS Release].mp3",
    album: "Race Kings",
    year: "2023",
    genre: "Electronic",
    bpm: 130
  }
];

const Queue = () => {
  const [sortBy, setSortBy] = useState('title');
  const [filterGenre, setFilterGenre] = useState('all');

  const sortedSongs = [...songs].sort((a, b) => {
    switch (sortBy) {
      case 'bpm':
        return b.bpm - a.bpm;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      default:
        return 0;
    }
  });

  const filteredSongs = filterGenre === 'all' 
    ? sortedSongs 
    : sortedSongs.filter(song => song.genre.toLowerCase() === filterGenre.toLowerCase());

  return (
    <motion.div 
      className="queue-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="queue-header">
        <h2 className="queue-title">HIGH OCTANE PLAYLIST</h2>
        <div className="queue-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Artist</option>
            <option value="bpm">Sort by BPM</option>
          </select>
          <select 
            value={filterGenre} 
            onChange={(e) => setFilterGenre(e.target.value)}
            className="sort-select"
          >
            <option value="all">All Genres</option>
            <option value="electronic">Electronic</option>
            <option value="rock">Rock</option>
            <option value="pop">Pop</option>
          </select>
        </div>
      </div>

      <div className="speedometer">
        <div className="speed-indicator"></div>
        <div className="speed-display">
          {filteredSongs.length} TRACKS
        </div>
      </div>

      <motion.div 
        className="queue-grid"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {filteredSongs.map(song => (
          <motion.div
            key={song.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Song
              songName={song.title}
              authorName={song.author}
              coverSvg={song.coverSvg}
              audioSrc={song.audioSrc}
              album={song.album}
              genre={song.genre}
              bpm={song.bpm}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Queue;