import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { songs } from './Queue';

const SongList = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('title');
  const [searchTerm, setSearchTerm] = useState('');

  const sortedSongs = [...songs].sort((a, b) => {
    return a[sortBy].localeCompare(b[sortBy]);
  });

  const filteredSongs = sortedSongs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="song-list">
      <div className="song-list-controls">
        <input
          type="text"
          placeholder="Filter songs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="title">Sort by Title</option>
          <option value="author">Sort by Author</option>
          <option value="album">Sort by Album</option>
          <option value="year">Sort by Year</option>
        </select>
      </div>

      <div className="songs-grid">
        {filteredSongs.map((song) => (
          <div 
            key={song.id}
            className="song-card"
            onClick={() => navigate(`/player/${encodeURIComponent(song.title)}`)}
          >
            <img src={song.coverSvg} alt={song.title} />
            <div className="song-details">
              <h3>{song.title}</h3>
              <p>{song.author}</p>
              {song.album && <p className="album-name">{song.album}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList;