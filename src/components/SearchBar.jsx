import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { songs } from './Queue';
import { BsSpeedometer2, BsTrophy, BsFire } from 'react-icons/bs';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    
    // Featured/Recommended songs
    const recommendedSongs = [
        {
            id: 'featured-1',
            title: "Turbo Dreams",
            author: "Night Racers",
            category: "Top Speed",
            coverSvg: "https://images.pexels.com/photos/3422964/pexels-photo-3422964.jpeg"
        },
        {
            id: 'featured-2',
            title: "Midnight Circuit",
            author: "Drift Kings",
            category: "Trending",
            coverSvg: "https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg"
        },
        {
            id: 'featured-3',
            title: "Neon Overdrive",
            author: "Street Legion",
            category: "New Release",
            coverSvg: "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg"
        }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        const filteredSongs = songs.filter(song =>
            song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(filteredSongs);
    };

    return (
        <div className="search-container">
            <motion.form 
                className="search-form"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSearch}
            >
                <div className="search-input-container">
                    <input
                        type="text"
                        placeholder="Search for tracks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <motion.button 
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="search-button"
                    >
                        Rev Up
                    </motion.button>
                </div>
            </motion.form>

            <div className="recommended-section">
                <h2 className="section-title">
                    <BsTrophy className="section-icon" />
                    Featured Tracks
                </h2>
                <div className="recommended-grid">
                    {recommendedSongs.map((song) => (
                        <motion.div
                            key={song.id}
                            className="recommended-card"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <div className="card-image">
                                <img src={song.coverSvg} alt={song.title} />
                                <div className="card-category">
                                    <BsFire className="category-icon" />
                                    {song.category}
                                </div>
                            </div>
                            <div className="card-content">
                                <h3>{song.title}</h3>
                                <p className="author">
                                    <BsSpeedometer2 className="speed-icon" />
                                    {song.author}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {results.length > 0 && (
                    <motion.div 
                        className="search-results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <h2 className="section-title">Search Results</h2>
                        <div className="results-grid">
                            {results.map((song) => (
                                <motion.div
                                    key={song.id}
                                    className="result-card"
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => navigate(`/player/${encodeURIComponent(song.title)}`)}
                                >
                                    <img src={song.coverSvg} alt={song.title} />
                                    <div className="result-info">
                                        <h3>{song.title}</h3>
                                        <p>{song.author}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;