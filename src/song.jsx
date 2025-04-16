import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router

const Song = ({ songName, authorName, coverSvg }) => {
  return (
    <Link to={`/player/${songName}`} className="song-link"> {/* Wrap the song in a Link */}
      <div className="song">
        <h2 className="song-name">{songName}</h2>
        <p className="author-name">By: {authorName}</p>
        <div className="song-cover">
          <img src={coverSvg} alt={`${songName} cover`} />
        </div>
      </div>
    </Link>
  );
};
export default Song;