import React, { useState, useEffect } from 'react';
import { AiOutlineStepBackward, AiOutlineStepForward, AiFillCaretDown } from "react-icons/ai";
import { FaPause, FaPlay } from "react-icons/fa6";
import { LuRepeat, LuRepeat1 } from "react-icons/lu";

const MusicController = ({
  currentTrack,
  isPlaying,
  stopMusic,
  togglePlay,
  playPrevious,
  playNext,
  audioRef,
  repeatMode,
  handleRepeatToggle,
  toggleMusicController
}) => {
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
    <div className='library-music-controller'>
    <div className="music-controller">
      <div className="music-info">
        <p className="music-title">{currentTrack.title}</p>
        <p className="artist">{currentTrack.artist}</p>
      </div>
      <div className="player-controls">
        <audio ref={audioRef} onTimeUpdate={handleTimeUpdate}>
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
            <button onClick={handleRepeatToggle}>
              {repeatMode === 'none' && <LuRepeat color="gray" />}
              {repeatMode === 'all' && <LuRepeat color="#f53192" />}
              {repeatMode === 'one' && <LuRepeat1 color="#f53192" />}
            </button>
          </div>
        </div>
      </div>
      
    </div>
    <button className="toggle-controller" onClick={toggleMusicController}>
        <AiFillCaretDown />
      </button>
    </div>
  );
};

export default MusicController;