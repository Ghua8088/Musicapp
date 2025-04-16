import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsFillPlayFill, BsPauseFill, BsSpeedometer2 } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

const Song = ({ songName, authorName, coverSvg, audioSrc, album, genre, bpm }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [engineRevving, setEngineRevving] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio();
    audio.src = audioSrc;
    audioRef.current = audio;

    const handlePlay = () => {
      setIsPlaying(true);
      setEngineRevving(true);
    };
    const handlePause = () => {
      setIsPlaying(false);
      setEngineRevving(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setEngineRevving(false);
    };
    const handleError = () => {
      setError('Engine stalled! Checking fuel lines...');
      setIsPlaying(false);
      setIsLoading(false);
      setEngineRevving(false);
      setTimeout(() => setError(null), 3000);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, [audioSrc]);

  const togglePlay = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      }
    } catch (err) {
      setError('Engine stalled! Checking fuel lines...');
      console.error('Playback error:', err);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="song"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Link to={`/player/${encodeURIComponent(songName)}`} className="song-content">
        <div className="song-cover">
          <motion.img 
            src={coverSvg} 
            alt={`${songName} cover`}
            whileHover={{ scale: 1.05 }}
          />
          <div className={`speed-lines ${engineRevving ? 'active' : ''}`}></div>
        </div>
        <div className="song-info">
          <h2 className="song-name">{songName}</h2>
          <p className="author-name">
            <BsSpeedometer2 className={`speed-icon ${engineRevving ? 'revving' : ''}`} />
            {authorName}
          </p>
          {album && <p className="album-tag">{album}</p>}
          <div className="song-details">
            <span className="genre-tag">{genre}</span>
            <span className="bpm-display">
              <BsSpeedometer2 /> {bpm} BPM
            </span>
          </div>
        </div>
      </Link>
      
      <AnimatePresence>
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <span className="error-text">{error}</span>
            <div className="error-flames"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        className={`play-button ${isLoading ? 'loading' : ''} ${isPlaying ? 'playing' : ''}`}
        onClick={togglePlay}
        disabled={isLoading}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? <BsPauseFill size={24} /> : <BsFillPlayFill size={24} />}
        <div className="button-glow" />
      </motion.button>
      
      <div className="engine-lights">
        <div className={`light ${isPlaying ? 'active' : ''}`}></div>
        <div className={`light ${isPlaying ? 'active' : ''}`}></div>
      </div>
    </motion.div>
  );
};

export default Song;