import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import SongPlayer from './components/SongPlayer';
import Queue from './components/Queue';
import SearchBar from './components/SearchBar';
import Home from './components/Home';
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <Router>
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loader"
            className="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: '#0a0a0a',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 0 rgba(255, 0, 0, 0)',
                  '0 0 50px rgba(255, 0, 0, 0.8)',
                  '0 0 20px rgba(255, 0, 0, 0.3)'
                ]
              }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(145deg, #ff0000, #cc0000)'
              }}
            />
          </motion.div>
        ) : (
          <motion.div 
            className="App"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/queue" element={<Queue />} />
                <Route path="/player/:songName" element={<SongPlayer />} />
                <Route path="/search" element={<SearchBar />} />
              </Routes>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;