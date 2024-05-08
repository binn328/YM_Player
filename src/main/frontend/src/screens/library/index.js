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
      const response = await fetch(`http://localhost:8080/api/music/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favorite: !musicData.find(music => music.id === id).favorite }),
      });
      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }
      // 서버에서 데이터 다시 가져오기
      fetchMusicData();
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
                <p onClick={(e) => { e.stopPropagation(); toggleFavorite(music.id); }}>
                  {music.favorite ? '❤️' : '🖤'}
                </p>
              </div>
              {currentTrack && currentTrack.id === music.id && (
                <div className="music-controller">
                  <audio controls autoPlay={isPlaying}>
                    <source src={`http://localhost:8080/api/music/item/${currentTrack.id}`} type="audio/mpeg" />
                  </audio>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
