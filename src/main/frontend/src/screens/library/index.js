import React, { useState, useEffect } from 'react';
import './library.css';

function Playlist() {
  const [musicData, setMusicData] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    fetchMusicData();
  }, []);

  const fetchMusicData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/music');
      const data = await response.json();
      setMusicData(data);
    } catch (error) {
      console.error('Error fetching music data:', error);
    }
  };

  const playMusic = (music) => {
    setCurrentTrack(music);
  };

  return (
      <div className="screen-container">
        <div>
          <h1>My Playlist</h1>
          <div className="playlist-container">
            {musicData.map((music) => (
              <div key={music.id} className="music-item" onClick={() => playMusic(music)}>
                <strong>{music.title}</strong> by {music.artist} ({music.group})
                {music.favorite && <span> - Favorite</span>}
              </div>
            ))}
          </div>
          {currentTrack && (
            <div className="currently-playing">
              <h2>Now Playing</h2>
              <p>{currentTrack.title} by {currentTrack.artist} ({currentTrack.group})</p>
              {/* Add audio player component and controls here */}
            </div>
          )}
        </div>
    </div>
  );
}

export default Playlist;