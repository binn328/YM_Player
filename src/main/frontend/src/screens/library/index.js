//음악 반복 재생
import React, { useState, useEffect, useRef } from 'react';
import './library.css';
import { FaHeart } from "react-icons/fa";
import { AiOutlineStepBackward, AiOutlineStepForward } from "react-icons/ai";
import { FaPause, FaPlay } from "react-icons/fa6";
import { LuRepeat, LuRepeat1 } from "react-icons/lu";
import MusicController from './musicController';

function MusicPlayer() {
  const [musicData, setMusicData] = useState([]);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'all', 'one'

  const audioRef = useRef(null);

  useEffect(() => {
    fetchMusicData();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', handleTrackEnd);
    }
    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleTrackEnd);
      }
    };
  }, [currentTrack, repeatMode]);

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
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      const nextIndex = (currentIndex + 1) % musicData.length;
      const nextMusic = musicData[nextIndex];
      setCurrentIndex(nextIndex);
      playMusic(nextMusic, nextIndex);
    }
  };

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatMode === 'all') {
      playNext();
    } else {
      setIsPlaying(false);
    }
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

  const handleRepeatToggle = () => {
    if (repeatMode === 'none') {
      setRepeatMode('all');
    } else if (repeatMode === 'all') {
      setRepeatMode('one');
    } else {
      setRepeatMode('none');
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
          repeatMode={repeatMode}
          handleRepeatToggle={handleRepeatToggle}
        />
      )}
    </div>
  );
}

export default MusicPlayer;
