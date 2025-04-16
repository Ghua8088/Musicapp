import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BsChevronDoubleDown, BsPlayFill, BsMusicNote, BsVinyl } from 'react-icons/bs';
import { engineSound } from '../utils/engineSounds';
import './styles.css';

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    // Initial loading sequence
    engineSound.playRev();
    
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      engineSound.playIdle();
      setShowTitle(true);
    }, 2000);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(loadingTimer);
      engineSound.stopAll();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <motion.div 
        className="initial-loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Racing stripes animation */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="racing-line"
            initial={{ x: "-100vw" }}
            animate={{ 
              x: ["-100vw", "100vw"],
              y: [0, i % 2 === 0 ? 20 : -20, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "linear",
              y: {
                duration: 1,
                repeat: Infinity,
                yoyo: true
              }
            }}
            style={{
              top: `${20 + i * 15}%`,
              opacity: 0.5 - (i * 0.08)
            }}
          />
        ))}
        
        <motion.h1
          animate={{
            scale: [1, 1.2, 1],
            textShadow: [
              "0 0 10px #ff0000",
              "0 0 20px #ff0000",
              "0 0 10px #ff0000"
            ]
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          LOADING
        </motion.h1>
      </motion.div>
    );
  }

  return (
    <div className="new-home">
      <section className="hero-section">
        {/* Replace video background with animated background */}
        <div className="dynamic-background">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="racing-stripe"
              initial={{ x: "-100%" }}
              animate={{
                x: "200%",
                y: [0, i % 2 === 0 ? 20 : -20, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "linear",
                y: {
                  duration: 2,
                  repeat: Infinity,
                  yoyo: true
                }
              }}
              style={{
                top: `${10 + i * 8}%`,
                opacity: 0.3 - (i * 0.02)
              }}
            />
          ))}
        </div>

        <div className="hero-content">
          <AnimatePresence>
            {showTitle && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: "spring" }}
              >
                <motion.h1
                  className="hero-title"
                  initial={{ letterSpacing: "20px" }}
                  animate={{ letterSpacing: "4px" }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  RACE
                  <motion.span
                    className="highlight"
                    animate={{
                      textShadow: [
                        "0 0 10px #ff0000",
                        "0 0 20px #ff0000",
                        "0 0 10px #ff0000"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    TUNES
                  </motion.span>
                </motion.h1>
                
                <motion.p
                  className="hero-subtitle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Where Music Meets Motion
                </motion.p>

                <motion.div 
                  className="hero-buttons"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  <motion.button
                    className="primary-btn"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,0,0,0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/queue')}
                  >
                    <BsPlayFill /> Start Listening
                  </motion.button>
                </motion.div>

                <motion.div
                  className="scroll-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1], y: [0, 10, 0] }}
                  transition={{ 
                    opacity: { delay: 2 },
                    y: { duration: 1.5, repeat: Infinity }
                  }}
                  onClick={scrollToContent}
                >
                  <BsChevronDoubleDown />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <motion.section 
        className="features-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: hasScrolled ? 1 : 0, 
          y: hasScrolled ? 0 : 50 
        }}
        transition={{ duration: 0.8 }}
      >
        <div className="features-grid">
          <motion.div 
            className="feature-card"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 30px rgba(255,0,0,0.3)"
            }}
            onClick={() => navigate('/queue')}
          >
            <BsMusicNote className="feature-icon" />
            <h3>Top Tracks</h3>
            <p>Experience our curated collection of high-octane beats</p>
          </motion.div>

          <motion.div 
            className="feature-card"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 30px rgba(255,0,0,0.3)"
            }}
            onClick={() => navigate('/search')}
          >
            <BsVinyl className="feature-icon" />
            <h3>Racing Playlists</h3>
            <p>Custom playlists for every type of race</p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;