import React, { useState, useEffect } from 'react';
import './library.css';

function MusicPlayer() {
  const [musicData, setMusicData] = useState([]);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchMusicData();
  }, []);

  const fetchMusicData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/music');
      if (!response.ok) {
        throw new Error('Failed to fetch music data');
      }
      const data = await response.json();
      setMusicData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const playMusic = (music) => {
    if (currentTrack && currentTrack.id === music.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(music);
      setIsPlaying(true);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const response = await fetch(`{SERVER_URL}/api/music/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favorite: !musicData.find((music) => music.id === id).favorite }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }

      setMusicData((prevData) =>
        prevData.map((music) =>
          music.id === id ? { ...music, favorite: !music.favorite } : music
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="screen-container">
      <h1>My Playlist</h1>
      <div className='playlist-list'>
        <div className="library-body">
          {musicData.map((music) => (
            <div key={music.id} className="music-card" onClick={() => playMusic(music)}>
              <div className="music-info">
                <p className="music-title">{music.title}</p>
                <p>by {music.artist}</p>
                <p>({music.group})</p>
                {music.favorite && <p>Favorite</p>}
              </div>
              {currentTrack && currentTrack.id === music.id && (
                <div className="music-controller">
                  <audio controls autoPlay={isPlaying}>
                    <source src={`http://localhost:8080/api/music/item/${currentTrack.id}`} type="audio/mpeg" />
                  </audio>
                </div>
              )}
              <button onClick={() => toggleFavorite(music.id)}>
                {music.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
