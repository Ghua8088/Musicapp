import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsFillPlayFill, BsPauseFill, BsSkipBackwardFill, BsSkipForwardFill, 
         BsVolumeUpFill, BsVolumeMuteFill, BsRepeat, BsRepeat1, BsListUl, BsX } from 'react-icons/bs';
import { songs } from './Queue';
import { useParams, useNavigate } from 'react-router-dom';

const SongPlayer = () => {
  const { songName } = useParams();
  const navigate = useNavigate();
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'one', 'all'
  const [showQueue, setShowQueue] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  
  const audioRef = useRef(new Audio());
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  useEffect(() => {
    const loadSong = () => {
      try {
        setIsLoading(true);
        setError(null);

        const decodedSongName = decodeURIComponent(songName);
        const song = songs.find(s => s.title === decodedSongName);
        
        if (!song) {
          setError('Engine Failure: Track Not Found!');
          setIsLoading(false);
          return;
        }

        // Reset audio element
        const audio = audioRef.current;
        audio.src = song.audioSrc;
        audio.volume = volumeRef.current;
        audio.load();

        setCurrentSong(song);
        setIsPlaying(false);
        setCurrentTime(0);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading song:', err);
        setError('Engine Failure: Audio System Malfunction!');
        setIsLoading(false);
      }
    };

    loadSong();
  }, [songName]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
        setIsPlaying(true);
      } else if (repeatMode === 'all') {
        handleNext();
      } else {
        handleNext();
      }
    };
    const handleError = () => {
      console.error('Audio error');
      setError('Engine Stalled: Audio Playback Error!');
      setIsPlaying(false);
      setIsLoading(false);
    };
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [repeatMode]);

  // Update volume without restarting the song
  useEffect(() => {
    if (!isDraggingVolume) {
      audioRef.current.volume = volume;
    }
  }, [volume, isDraggingVolume]);

  const togglePlay = async () => {
    try {
      const audio = audioRef.current;
      
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (err) {
          console.error('Playback error:', err);
          setError('Engine Failure: Playback System Error!');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current) return;
    const progressBar = e.currentTarget;
    const clickPosition = (e.pageX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleVolumeMouseDown = () => {
    setIsDraggingVolume(true);
  };

  const handleVolumeMouseUp = () => {
    setIsDraggingVolume(false);
    audioRef.current.volume = volume;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleNext = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const nextSong = songs[(currentIndex + 1) % songs.length];
    navigate(`/player/${encodeURIComponent(nextSong.title)}`);
  };

  const handlePrevious = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const previousSong = songs[(currentIndex - 1 + songs.length) % songs.length];
    navigate(`/player/${encodeURIComponent(previousSong.title)}`);
  };

  const toggleRepeatMode = () => {
    setRepeatMode(current => {
      switch (current) {
        case 'none': return 'all';
        case 'all': return 'one';
        case 'one': return 'none';
        default: return 'none';
      }
    });
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one': return <BsRepeat1 />;
      case 'all': return <BsRepeat />;
      default: return <BsRepeat style={{ opacity: 0.5 }} />;
    }
  };

  if (error) {
    return (
      <motion.div 
        className="song-player-error"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="error-box">
          <div className="error-icon">⚠️</div>
          <h2>{error}</h2>
          <div className="error-flames"></div>
        </div>
        <motion.button 
          onClick={() => navigate('/queue')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="back-button"
        >
          Return to Garage
        </motion.button>
      </motion.div>
    );
  }

  if (!currentSong || isLoading) {
    return (
      <div className="song-player-loading">
        <div className="loading-animation">
          <div className="speedometer">
            <div className="speed-indicator"></div>
          </div>
          <p>Revving Up...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="song-player"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="song-player-content">
        <motion.div 
          className="song-cover"
          whileHover={{ scale: 1.05 }}
        >
          <img src={currentSong.coverSvg} alt={currentSong.title} />
        </motion.div>
        
        <div className="song-info">
          <h1>{currentSong.title}</h1>
          <p className="author">{currentSong.author}</p>
          {currentSong.album && <p className="album">{currentSong.album}</p>}
        </div>

        <div className="player-controls">
          <div className="progress-bar-container">
            <div className="time-display left">{formatTime(currentTime)}</div>
            <div 
              className="progress-bar" 
              onClick={handleProgressClick}
            >
              <motion.div 
                className="progress-filled"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              <div 
                className="progress-handle"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="time-display right">{formatTime(duration)}</div>
          </div>

          <div className="control-buttons">
            <motion.button 
              className={`control-btn repeat-btn ${repeatMode !== 'none' ? 'active' : ''}`}
              onClick={toggleRepeatMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={`Repeat mode: ${repeatMode}`}
            >
              {getRepeatIcon()}
            </motion.button>

            <motion.button 
              className="control-btn" 
              onClick={handlePrevious}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              <BsSkipBackwardFill />
            </motion.button>

            <motion.button 
              className={`play-pause-btn ${isPlaying ? 'playing' : ''} ${isLoading ? 'loading' : ''}`}
              onClick={togglePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isPlaying ? <BsPauseFill size={24} /> : <BsFillPlayFill size={24} />}
              <div className="button-glow" />
            </motion.button>

            <motion.button 
              className="control-btn" 
              onClick={handleNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              <BsSkipForwardFill />
            </motion.button>

            <motion.button 
              className={`control-btn queue-btn ${showQueue ? 'active' : ''}`}
              onClick={() => setShowQueue(prev => !prev)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Show queue"
            >
              <BsListUl />
            </motion.button>
          </div>

          <div className="volume-controls">
            <span>{volume > 0 ? <BsVolumeUpFill /> : <BsVolumeMuteFill />}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              onMouseDown={handleVolumeMouseDown}
              onMouseUp={handleVolumeMouseUp}
              onTouchStart={handleVolumeMouseDown}
              onTouchEnd={handleVolumeMouseUp}
              className="volume-slider"
            />
            <span className="volume-percentage">{Math.round(volume * 100)}%</span>
          </div>
        </div>

        <AnimatePresence>
          {showQueue && (
            <motion.div 
              className="queue-panel"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
            >
              <div className="queue-header">
                <h3 className="queue-title">Up Next</h3>
                <motion.button 
                  className="close-queue-btn"
                  onClick={() => setShowQueue(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Close queue"
                >
                  <BsX />
                </motion.button>
              </div>
              <div className="queue-list">
                {songs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    className={`queue-item ${currentSong.id === song.id ? 'current' : ''}`}
                    onClick={() => navigate(`/player/${encodeURIComponent(song.title)}`)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <img src={song.coverSvg} alt={song.title} className="queue-item-image" />
                    <div className="queue-item-info">
                      <span className="queue-item-title">{song.title}</span>
                      <span className="queue-item-author">{song.author}</span>
                    </div>
                    {currentSong.id === song.id && (
                      <div className="now-playing-indicator">
                        <div className="playing-bar"></div>
                        <div className="playing-bar"></div>
                        <div className="playing-bar"></div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SongPlayer;