/*import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./audioPlayer.css";
import Controls from "./controls";
import ProgressCircle from "./progressCircle";
import WaveAnimation from "./waveAnimation";

const AudioPlayer = () => {
  const location = useLocation();
  const { playlistMusicDetails } = location.state || {};

  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  const audioRef = useRef(null);
  const intervalRef = useRef();

  const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        handleNext();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };

  useEffect(() => {
    console.log("playlistMusicDetails:", playlistMusicDetails);
    if (!isInitialized && playlistMusicDetails && playlistMusicDetails.length > 0) {
      setCurrentSongIndex(0);
      setIsInitialized(true);
    }
  }, [playlistMusicDetails, isInitialized]);

  useEffect(() => {
    if (playlistMusicDetails && playlistMusicDetails.length > 0) {
      const currentSong = playlistMusicDetails[currentSongIndex];
      setSongTitle(currentSong.title);
      setSongArtist(currentSong.artist);
      setAudioSrc(`http://localhost:8080/api/music/item/${currentSong.id}`);
      setTrackProgress(0);
      setIsInitialized(true);
    }
  }, [currentSongIndex, playlistMusicDetails, isInitialized]);

  useEffect(() => {
    if (!audioSrc) return;

    audioRef.current = new Audio(audioSrc);

    audioRef.current.addEventListener("timeupdate", updateTime);
    audioRef.current.addEventListener("durationchange", updateDuration);

    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("timeupdate", updateTime);
        audioRef.current.removeEventListener("durationchange", updateDuration);
        clearInterval(intervalRef.current);
      }
    };
  }, [audioSrc, isPlaying]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        clearInterval(intervalRef.current);
      }
    };
  }, [playlistMusicDetails]);

  const updateTime = () => {
    setTrackProgress(audioRef.current.currentTime);
  };

  const updateDuration = () => {
    setDuration(audioRef.current.duration);
  };

  const handleNext = () => {
    if (playlistMusicDetails && currentSongIndex < playlistMusicDetails.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setCurrentSongIndex(0);
    }
  };

  const handlePrev = () => {
    if (playlistMusicDetails && currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    } else {
      setCurrentSongIndex(playlistMusicDetails.length - 1);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.currentTime = trackProgress;
      audioRef.current.play()
          .then(() => {
            startTimer();
          })
          .catch(error => {
            console.error('Error occurred while playing audio:', error);
          });
    }
    setIsPlaying(!isPlaying);
  };

  const addZero = (n) => {
    return n > 9 ? "" + n : "0" + n;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${addZero(secs)}`;
  };

  return (
      <div className="player-body flex">
        <div className="player-left-body">
          <ProgressCircle
              percentage={currentPercentage}
              isPlaying={isPlaying}
              image={playlistMusicDetails && playlistMusicDetails[currentSongIndex] ? playlistMusicDetails[currentSongIndex].album?.images[0]?.url : null}
              size={300}
              color="#C96850"
          />
        </div>
        <div className="player-right-body flex">
          <p className="song-title">{songTitle}</p>
          <p className="song-artist">{songArtist}</p>
          <div className="player-right-bottom flex">
            <div className="song-duration flex">
              <p className="duration">{formatTime(trackProgress)}</p>
              <WaveAnimation isPlaying={isPlaying} />
              <p className="duration">{formatTime(duration)}</p>
            </div>
            <Controls
                isPlaying={isPlaying}
                setIsPlaying={togglePlay}
                handleNext={handleNext}
                handlePrev={handlePrev}
                audioRef={audioRef}
            />
          </div>
        </div>
      </div>
  );
}

export default AudioPlayer;

*/

import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./audioPlayer.css";
import Controls from "./controls";
import ProgressCircle from "./progressCircle";
import WaveAnimation from "./waveAnimation";

const AudioPlayer = () => {
  const location = useLocation();
  const { playlistMusicDetails } = location.state || {};

  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const audioRef = useRef(new Audio());
  const intervalRef = useRef();

  const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        handleNext();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };

  useEffect(() => {
    if (!isInitialized && playlistMusicDetails && playlistMusicDetails.length > 0) {
      setCurrentSongIndex(0);
      setIsInitialized(true);
    }
  }, [playlistMusicDetails, isInitialized]);

  useEffect(() => {
    if (playlistMusicDetails && playlistMusicDetails.length > 0) {
      const currentSong = playlistMusicDetails[currentSongIndex];
      setSongTitle(currentSong.title);
      setSongArtist(currentSong.artist);
      setAudioSrc(`http://localhost:8080/api/music/item/${currentSong.id}`);
      setTrackProgress(0);
    }
  }, [currentSongIndex, playlistMusicDetails]);

  useEffect(() => {
    if (!audioSrc) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = audioSrc;
      audioRef.current.load();
    } else {
      audioRef.current = new Audio(audioSrc);
    }

    audioRef.current.addEventListener("timeupdate", updateTime);
    audioRef.current.addEventListener("durationchange", updateDuration);

    if (isPlaying) {
      audioRef.current.play()
        .then(() => startTimer())
        .catch(error => {
          console.error('Error occurred while playing audio:', error);
        });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("timeupdate", updateTime);
        audioRef.current.removeEventListener("durationchange", updateDuration);
        clearInterval(intervalRef.current);
      }
    };
  }, [audioSrc]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        clearInterval(intervalRef.current);
      }
    };
  }, [playlistMusicDetails]);

  const updateTime = () => {
    setTrackProgress(audioRef.current.currentTime);
  };

  const updateDuration = () => {
    setDuration(audioRef.current.duration);
  };

  const handleNext = () => {
    if (playlistMusicDetails && currentSongIndex < playlistMusicDetails.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setCurrentSongIndex(0);
    }
  };

  const handlePrev = () => {
    if (playlistMusicDetails && currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    } else {
      setCurrentSongIndex(playlistMusicDetails.length - 1);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.currentTime = trackProgress;
      audioRef.current.play()
        .then(() => startTimer())
        .catch(error => {
          console.error('Error occurred while playing audio:', error);
        });
    }
    setIsPlaying(!isPlaying);
  };

  const addZero = (n) => {
    return n > 9 ? "" + n : "0" + n;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${addZero(secs)}`;
  };

  return (
    <div className="player-body flex">
      <div className="player-left-body">
        <ProgressCircle
          percentage={currentPercentage}
          isPlaying={isPlaying}
          image={playlistMusicDetails && playlistMusicDetails[currentSongIndex] ? playlistMusicDetails[currentSongIndex].album?.images[0]?.url : null}
          size={300}
          color="#C96850"
        />
      </div>
      <div className="player-right-body flex">
        <p className="song-title">{songTitle}</p>
        <p className="song-artist">{songArtist}</p>
        <div className="player-right-bottom flex">
          <div className="song-duration flex">
            <p className="duration">{formatTime(trackProgress)}</p>
            <WaveAnimation isPlaying={isPlaying} />
            <p className="duration">{formatTime(duration)}</p>
          </div>
          <Controls
            isPlaying={isPlaying}
            setIsPlaying={togglePlay}
            handleNext={handleNext}
            handlePrev={handlePrev}
            audioRef={audioRef}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
