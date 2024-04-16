import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { TiMediaPause, TiMediaPlay } from "react-icons/ti";
import { RxTrackPrevious, RxTrackNext } from "react-icons/rx";
import { IoMdMusicalNotes } from "react-icons/io";
import './queue.css'

const Music = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [currentSong, setCurrentSong] = useState({
      title: "",
      artist: "",
      album: "",
      cover: "",
      audio: null,
    });
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
  
    useEffect(() => {
      if (currentSong.audio) {
        currentSong.audio.addEventListener("timeupdate", updateTime);
        currentSong.audio.addEventListener("loadedmetadata", () => {
          setDuration(currentSong.audio.duration);
        });
        return () => {
          currentSong.audio.removeEventListener("timeupdate", updateTime);
        };
      }
    }, [currentSong.audio]);
  
    useEffect(() => {
      // Stop the previous song when a new song is selected
      if (currentSong.audio && previousSong && previousSong !== currentSong.audio) {
        previousSong.pause();
        previousSong.currentTime = 0;
        setIsPlaying(false);
      }
    }, [currentSong.audio]);
  
    const updateTime = () => {
      setCurrentTime(currentSong.audio.currentTime);
    };
  
    const handlePlayPause = () => {
      if (currentSong.audio) {
        if (isPlaying) {
          currentSong.audio.pause();
        } else {
          currentSong.audio.play();
        }
        setIsPlaying(!isPlaying);
      }
    };
  
    const handleLike = () => {
      if (currentSong.audio) {
        setIsLiked(!isLiked);
      }
    };
  
    const handlePrevious = () => {
      if (currentSong.audio) {
        currentSong.audio.currentTime = 0; // Move to the beginning of the song
      }
    };
  
    const handleNext = () => {
      if (currentSong.audio) {
        currentSong.audio.currentTime = currentSong.audio.duration; // Move to the end of the song
      }
    };
  
    const handleSeek = (e) => {
      if (currentSong.audio) {
        currentSong.audio.currentTime = e.target.value;
      }
    };
  
    const handleAlbumClick = (e) => {
      // Show album info when album cover clicked
      if (currentSong.title && currentSong.artist && currentSong.album) {
        alert(`Album: ${currentSong.album}\nArtist: ${currentSong.artist}\nTitle: ${currentSong.title}`);
      }
    };
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const newAudio = new Audio(reader.result); // 새로운 오디오 요소 생성
        if (currentSong.audio) {
          currentSong.audio.pause(); // 이전 음악 중지
          currentSong.audio.currentTime = 0; // 재생 위치 초기화
        }
        setCurrentSong({
          title: file.name,
          artist: "Unknown Artist",
          album: "Unknown Album",
          cover: "", // No cover image provided
          audio: newAudio,
        });
        setIsPlaying(false); // 재생 상태 초기화
        setIsLiked(false); // 하트 상태 초기화
    };
      reader.readAsDataURL(file);
    };
  
    const previousSong = currentSong.audio;
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
  
    return (
      <div className="screen-container total-container">
        <div className="music-container">
          <input type="file" accept="audio/*" onChange={handleFileChange} />
          {currentSong.cover ? (
            <img src={currentSong.cover} alt={currentSong.album} onClick={handleAlbumClick} />
          ) : (
            <span className="icon-btn">
              <IoMdMusicalNotes />
            </span>
          )}
          <button onClick={handleLike} disabled={!currentSong.audio}>
            <span className="icon">
              <FaHeart className={currentSong.audio ? "icon-heart" : ""} color={isLiked ? "red" : "black"} />
            </span>
          </button>
          <button onClick={handlePrevious} disabled={!currentSong.audio}>
            <span className="icon">
              <RxTrackPrevious />
            </span>
          </button>
          <button onClick={handlePlayPause} disabled={!currentSong.audio}>
            <span className="icon">
              {isPlaying ? <TiMediaPause /> : <TiMediaPlay />}
            </span>
          </button>
          <button onClick={handleNext} disabled={!currentSong.audio}>
            <span className="icon">
              <RxTrackNext />
            </span>
          </button>
          <input
            className="music-bar"
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            disabled={!currentSong.audio}
          />
          <div>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    );
  };
  
  export default Music;
  