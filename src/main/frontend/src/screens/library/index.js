//음악 재생 테스트5
import React, { useState, useEffect } from 'react';
import './library.css';

function MusicPlayer() {
  const [musicData, setMusicData] = useState([]);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 선택한 음악의 인덱스

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

  const playMusic = (music, index) => {
    if (selectedMusic === music.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(music);
      setIsPlaying(true);
      setSelectedMusic(music.id);
      setCurrentIndex(index);
    }
  };

  const stopMusic = () => {
    setIsPlaying(false);
    setSelectedMusic(null);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playPrevious = () => {
    const previousIndex = currentIndex === 0 ? musicData.length - 1 : currentIndex - 1;
    const previousMusic = musicData[previousIndex];
    setCurrentIndex(previousIndex);
    playMusic(previousMusic, previousIndex);
  };

  const playNext = () => {
    const nextIndex = (currentIndex + 1) % musicData.length;
    const nextMusic = musicData[nextIndex];
    setCurrentIndex(nextIndex);
    playMusic(nextMusic, nextIndex);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="screen-container">
      <h1>My Playlist</h1>
      <div className='playlist-list'>
        <div className="library-body">
          {musicData.map((music, index) => (
            <div key={music.id} className="music-card" onClick={() => playMusic(music, index)}>
              <div className="music-info">
                <p className="music-title">{music.title}</p>
                <p className="artist">by {music.artist}</p>
                <p className="group">({music.group})</p>
                {music.favorite && <p className="favorite">Favorite</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedMusic && (
        <MusicController
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          stopMusic={stopMusic}
          togglePlay={togglePlay}
          playPrevious={playPrevious}
          playNext={playNext}
        />
      )}
    </div>
  );
}

const MusicController = ({ currentTrack, isPlaying, stopMusic, togglePlay, playPrevious, playNext }) => {
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeUpdate = (event) => {
    setCurrentTime(event.target.currentTime);
  };

  return (
    <div className="music-controller">
      <div className="music-info">
        <p className="music-title">{currentTrack.title}</p>
        <p className="artist">{currentTrack.artist}</p>
      </div>
      <div className="player-controls">
        <audio
          controls
          autoPlay={isPlaying}
          onEnded={stopMusic}
          onTimeUpdate={handleTimeUpdate}
          className="audio-element"
        >
          <source src={`http://localhost:8080/api/music/item/${currentTrack.id}`} type="audio/mpeg" />
        </audio>
        {/*<div className="controls">
          <button onClick={playPrevious}>
            <i className="fas fa-backward"></i>
          </button>
          <button onClick={togglePlay}>
            {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
          </button>
          <button onClick={playNext}>
            <i className="fas fa-forward"></i>
          </button>
  </div>*/}
      </div>
    </div>
  );
};

export default MusicPlayer;
