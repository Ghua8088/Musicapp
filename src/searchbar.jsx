import React, { useState } from "react";
import Queue from "./Queue"; // Import the array of songs

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        const filteredSongs = Queue.filter((song) =>
            song.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(filteredSongs);
    };
    return (
        <div>
            <input
                type="text"
                placeholder="Search for a song..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <ul>
                {results.map((song, index) => (
                    <li key={index}>
                        <div>
                            <span>{song.title}</span>
                            <img src={song.coverSvg} alt={`${song.title} cover`} />
                            <p>{song.author}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;