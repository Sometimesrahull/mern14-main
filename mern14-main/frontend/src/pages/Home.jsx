import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import axios from 'axios';

const Home = () => {
    const [songs, setSongs] = useState([
        { title: 'Midnight Serenade', year: 2023, artist: 'Olivia Carter', thumbnail: 'https://via.placeholder.com/56' },
    ]);
    const [currentSongPlaying, setCurrentSongPlaying] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showFullScreenPlayer, setShowFullScreenPlayer] = useState(false);
    const [search, setSearch] = useState("");
    const audioRef = useRef(null);

    useEffect(() => {
        axios.get("http://localhost:3000/rahul")
            .then(response => {
                setSongs(response.data.songs)
            })
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setCurrentTime(0);
            setDuration(0);
            setIsPlaying(false);
        }
    }, [currentSongPlaying]);

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
const handleProgressClick = (e) => {
    if (!audioRef.current || !duration) return;
    // Always get the bounding rect of the bar, not the child
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    audioRef.current.currentTime = percent * duration;
};

    const currentSong = songs.find(song => song._id === currentSongPlaying);

    // Filtered songs based on search
    const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(search.toLowerCase()) ||
        (song.artist && song.artist.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="home-container">
            <h1 className='rahh'>
                Moments
            </h1>

            {/* Search Bar */}
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search songs or artist..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="search-bar"
                />
            </div>

            <div className="song-list">
                {filteredSongs.length === 0 && (
                    <div className="no-songs-found">
                        No songs found.
                    </div>
                )}
                {filteredSongs.map((song, index) => (
                    <div 
                        className="song-item" 
                        key={index}
                        onClick={() => {
                            if (currentSongPlaying !== song._id) {
                                setCurrentSongPlaying(song._id);
                            }
                            setShowFullScreenPlayer(true);
                            if (audioRef.current) {
                                audioRef.current.play();
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={song.coverImage} alt={`${song.title} thumbnail`} className="song-thumbnail" />
                        <div className="song-info">
                            <h2 className="song-title">{song.title}</h2>
                            <p className="song-details">{song.releaseDate}</p>
                            <p className="song-details">{song.artist}</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (currentSongPlaying === song._id) {
                                    if (audioRef.current) {
                                        if (isPlaying) {
                                            audioRef.current.pause();
                                        } else {
                                            audioRef.current.play();
                                            setShowFullScreenPlayer(true);
                                        }
                                    }
                                } else {
                                    setCurrentSongPlaying(song._id);
                                    setShowFullScreenPlayer(true);
                                }
                            }}
                            className="play-button"
                        >
                            {currentSongPlaying === song._id && isPlaying ? (
                                <svg
                                    className='play-icon'
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 5H8V19H6V5ZM16 5H18V19H16V5Z" />
                                </svg>
                            ) : (
                                <svg className="play-icon" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Full-Screen Player */}
            {showFullScreenPlayer && currentSong && (
                <div className="fullscreen-player">
                    <button className="close-btn" onClick={() => setShowFullScreenPlayer(false)}>✕</button>

                    {/* Song Details */}
                    <div className="song-details-top">
                        <h2>{currentSong.title}</h2>
                        <p>{currentSong.artist}</p>
                        <p>{currentSong.releaseDate}</p>
                    </div>

                    {/* Big Cover Image */}
                    <img src={currentSong.coverImage} alt="cover" className="fullscreen-cover" />

                    {/* Controller at Footer */}
                    <div className="fullscreen-controls">
                        <div className="progress-bar" onClick={handleProgressClick}>
                            <div className="progress" style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }} />
                        </div>
                        <div className="time-display">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                        <div className="control-buttons">
                            <button className="but"
                                onClick={() => {
                                    if (!songs.length) return;
                                    const idx = songs.findIndex(song => song._id === currentSongPlaying);
                                    if (idx > 0) setCurrentSongPlaying(songs[idx - 1]._id);
                                }}
                            >
                                ⏮</button>
                            <button className="but" onClick={() => audioRef.current && (isPlaying ? audioRef.current.pause() : audioRef.current.play())}>
                                {isPlaying ? "⏸" : "▶"}
                            </button>
                            <button className="but"
                                onClick={() => {
                                    if (!songs.length) return;
                                    const idx = songs.findIndex(song => song._id === currentSongPlaying);
                                    if (idx < songs.length - 1) setCurrentSongPlaying(songs[idx + 1]._id);
                                }}
                            >⏭</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Song Controller Footer */}
            {currentSong && (
                <div 
                    className="song-controller-footer" 
                    onClick={() => setShowFullScreenPlayer(true)}
                    style={{ cursor: 'pointer' }}
                >
                    <img src={currentSong.coverImage} alt="cover" className="controller-cover" />
                    <div className="controller-info">
                        <div className="controller-title">{currentSong.title}</div>
                        <div className="controller-artist">{currentSong.artist}</div>
                    </div>
                    <div 
                        className="controller-progress-container" 
                        onClick={handleProgressClick}
                    >
                        <div 
                            className="controller-controls" 
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                className="controller-btn"
                                onClick={() => {
                                    if (!songs.length) return;
                                    const idx = songs.findIndex(song => song._id === currentSongPlaying);
                                    if (idx > 0) setCurrentSongPlaying(songs[idx - 1]._id);
                                }}
                            >
                                <svg width="24" height="24" fill="currentColor"><path d="M6 12V7l7 5-7 5v-5zm8 5V7h2v10h-2z"/></svg>
                            </button>
                            <button
                                className="controller-btn"
                                onClick={() => {
                                    if (audioRef.current) {
                                        if (isPlaying) {
                                            audioRef.current.pause();
                                        } else {
                                            audioRef.current.play();
                                            setShowFullScreenPlayer(true);
                                        }
                                    }
                                }}
                            >
                                {isPlaying ? (
                                    <svg width="28" height="28" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="16" y="5" width="4" height="14"/></svg>
                                ) : (
                                    <svg width="28" height="28" fill="currentColor"><polygon points="8,5 24,14 8,23"/></svg>
                                )}
                            </button>
                            <button
                                className="controller-btn"
                                onClick={() => {
                                    if (!songs.length) return;
                                    const idx = songs.findIndex(song => song._id === currentSongPlaying);
                                    if (idx < songs.length - 1) setCurrentSongPlaying(songs[idx + 1]._id);
                                }}
                            >
                                <svg width="24" height="24" fill="currentColor"><path d="M18 12V7l-7 5 7 5v-5zm-8 5V7h-2v10h2z"/></svg>
                            </button>
                        </div>
                        <div className="controller-progress-bar">
                            <div
                                className="controller-progress"
                                style={{
                                    width: duration ? `${(currentTime / duration) * 100}%` : '0%'
                                }}
                            />
                        </div>
                        <div className="controller-timer">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>
                    <audio
                        ref={audioRef}
                        src={currentSong.audioUrl}
                        autoPlay
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        controls
                        style={{ display: 'none' }}
                    />
                </div>
            )}

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <Link to="/" className="nav-item active">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                    <span>Home</span>
                </Link>
                <Link to="/upload" className="nav-item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                    </svg>
                    <span>upload</span>
                </Link>
            </nav>
        </div>
    );
};

function formatTime(sec) {
    if (!sec) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default Home;