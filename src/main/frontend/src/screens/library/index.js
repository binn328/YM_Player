//음악 재생 테스트11
import React, { useState, useEffect, useRef } from 'react';
import './library.css';
import { FaHeart } from "react-icons/fa";
import { AiOutlineStepBackward, AiOutlineStepForward } from "react-icons/ai";
import { FaPause, FaPlay } from "react-icons/fa6";

function MusicPlayer() {
  const [musicData, setMusicData] = useState([]);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const audioRef = useRef(null);

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
    if (currentTrack && isPlaying) {
      stopMusic();
    }
    setCurrentTrack(music);
    setSelectedMusic(music.id);
    setCurrentIndex(index);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = `http://localhost:8080/api/music/item/${music.id}`;
      audioRef.current.play();
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setSelectedMusic(null);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
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

  const toggleFavorite = async (music) => {
    try {
      const formData = new FormData();
      formData.append('id', music.id);
      formData.append('title', music.title);
      formData.append('artist', music.artist);
      formData.append('group', music.group);
      formData.append('favorite', !music.favorite);
      if (music.chapters) {
        formData.append('chapters', JSON.stringify(music.chapters));
      }

      const response = await fetch(`http://localhost:8080/api/music/update/${music.id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to update favorite status');
      }

      const updatedMusicData = await response.json();

      const updatedMusicList = musicData.map(item => {
        if (item.id === music.id) {
          return updatedMusicData;
        }
        return item;
      });
      setMusicData(updatedMusicList);
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
          {musicData.map((music, index) => (
            <div key={music.id} className="music-card" onClick={() => playMusic(music, index)}>
              <div className="music-info">
                <p className="music-title">
                  {music.title}
                  <button className='heart-button' onClick={(e) => {
                    e.stopPropagation(); toggleFavorite(music); }}>
                    <FaHeart color={music.favorite ? 'red' : 'gray'} />
                  </button>
                </p>
                <p className="artist">by {music.artist}</p>
                <p className="group">({music.group})</p>
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
          audioRef={audioRef}
        />
      )}
    </div>
  );
}

const MusicController = ({ currentTrack, isPlaying, stopMusic, togglePlay, playPrevious, playNext, audioRef }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const handleTimeUpdate = (event) => {
    setCurrentTime(event.target.currentTime);
  };

  const handleRangeChange = (event) => {
    const audio = audioRef.current;
    audio.currentTime = event.target.value;
    setCurrentTime(event.target.value);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="music-controller">
      <div className="music-info">
        <p className="music-title">{currentTrack.title}</p>
        <p className="artist">{currentTrack.artist}</p>
      </div>
      <div className="player-controls">
        <audio ref={audioRef} controls onTimeUpdate={handleTimeUpdate}>
          <source src={`http://localhost:8080/api/music/item/${currentTrack.id}`} type="audio/mpeg" />
        </audio>
        <div className="range-controls">
          <div className="time-range-container">
            <span className="current-time">{formatTime(currentTime)}</span>
            <input
              type='range'
              value={currentTime}
              id='progress'
              max={duration}
              onChange={handleRangeChange}
            />
            <span className="duration-time">{formatTime(duration)}</span>
          </div>
          <div className='controls'>
            <button onClick={playPrevious}>
              <AiOutlineStepBackward />
            </button>
            <button onClick={togglePlay}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={playNext}>
              <AiOutlineStepForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;