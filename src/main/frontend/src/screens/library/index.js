// 라이브러리 재생 테스트3
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
  if (!currentTrack || currentTrack.id !== music.id) {
    setCurrentTrack(music);
    setIsPlaying(true);
  }
};


  const stopMusic = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
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
            </div>
          ))}
        </div>
      </div>
      {currentTrack && (
        <MusicController
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          stopMusic={stopMusic}
          togglePlay={togglePlay}
        />
      )}
    </div>
  );
}

const MusicController = ({ currentTrack, isPlaying, stopMusic, togglePlay }) => (
  <div className="music-controller">
    <div className="music-info">
      <p className="music-title">{currentTrack.title}</p>
      <p>{currentTrack.artist}</p>
    </div>
    <div className="player-controls">
      <audio controls autoPlay={isPlaying} onEnded={stopMusic} className="audio-element">
        <source src={`http://localhost:8080/api/music/item/${currentTrack.id}`} type="audio/mpeg" />
      </audio>
      <div className="controls">
        <button onClick={togglePlay}>
          {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
        </button>
        <button onClick={stopMusic}>
          <i className="fas fa-stop"></i>
        </button>
      </div>
    </div>
  </div>
);

export default MusicPlayer;
