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
    // 만약 현재 음악이 이미 재생 중이라면 정지시킵니다.
    if (currentTrack && currentTrack.id === music.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(music);
      setIsPlaying(true);
    }
  };

  const stopMusic = () => {
    setIsPlaying(false);
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
        />
      )}
    </div>
  );
}

const MusicController = ({ currentTrack, isPlaying, stopMusic }) => (
  <div className="music-controller">
    <audio controls autoPlay={isPlaying} onEnded={stopMusic}>
      <source src={`http://localhost:8080/api/music/item/${currentTrack.id}`} type="audio/mpeg" />
    </audio>
  </div>
);

export default MusicPlayer;
