import React, { useState, useRef, useEffect } from "react";
import "./audioPlayer.css";
import Controls from "./controls";
import ProgressCircle from "./progressCircle";
import WaveAnimation from "./waveAnimation";

const AudioPlayer = ({ playlistMusicDetails, setPlaylistMusicDetails }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState("none");

  const audioRef = useRef(new Audio());
  const intervalRef = useRef();
  const isReady = useRef(false);

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

  const handleNext = () => {
    if (repeatMode === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      if (playlistMusicDetails && playlistMusicDetails.length > 0) {
        setCurrentSongIndex((prevIndex) =>
          isShuffleOn
            ? Math.floor(Math.random() * playlistMusicDetails.length)
            : (prevIndex + 1) % playlistMusicDetails.length
        );
      }
    }
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    }
  };

  const handlePrev = () => {
    if (playlistMusicDetails && playlistMusicDetails.length > 0) {
      setCurrentSongIndex((prevIndex) =>
        isShuffleOn
          ? Math.floor(Math.random() * playlistMusicDetails.length)
          : prevIndex === 0
          ? playlistMusicDetails.length - 1
          : prevIndex - 1
      );
    }
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    }
  };

  useEffect(() => {
    const storedIndex = localStorage.getItem("currentSongIndex");
    if (storedIndex !== null) {
      setCurrentSongIndex(parseInt(storedIndex));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentSongIndex", currentSongIndex);
  }, [currentSongIndex]);

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
      setAudioSrc( `/api/music/item/${currentSong.id}`);
      setTrackProgress(0);
    }
  }, [currentSongIndex, playlistMusicDetails]);

  useEffect(() => {
    if (!audioSrc) return;

    const audio = audioRef.current;
    audio.pause();
    audio.src = audioSrc;
    audio.load();

    const updateTime = () => setTrackProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("durationchange", updateDuration);

    if (isReady.current) {
      if (isPlaying) {
        audio.play().then(startTimer).catch(console.error);
      }
    } else {
      isReady.current = true;
    }

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("durationchange", updateDuration);
      clearInterval(intervalRef.current);
    };
  }, [audioSrc]);

  useEffect(() => {
    const handleEnd = () => handleNext();
    const audio = audioRef.current;

    audio.removeEventListener("ended", handleEnd);
    audio.addEventListener("ended", handleEnd);

    return () => {
      audio.removeEventListener("ended", handleEnd);
    };
  }, [repeatMode]);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      audio.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isShuffleOn) {
      const shuffledPlaylist = [...playlistMusicDetails].sort(() => Math.random() - 0.5);
      setPlaylistMusicDetails(shuffledPlaylist);
    }
  }, [isShuffleOn]);

  useEffect(() => {
    if (playlistMusicDetails && playlistMusicDetails.length > 0) {
      const currentSong = playlistMusicDetails[currentSongIndex];
      setSongTitle(currentSong.title);
      setSongArtist(currentSong.artist);
      setAudioSrc( `/api/music/item/${currentSong.id}`);
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [playlistMusicDetails]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => {
          startTimer();
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error occurred while playing audio:", error);
        });
    }
  };

  const handleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
    if (!isPlaying) {
      const shuffledPlaylist = [...playlistMusicDetails].sort(() => Math.random() - 0.5);
      setPlaylistMusicDetails(shuffledPlaylist);
    }
  };

  const handleRepeatToggle = () => {
    setRepeatMode(repeatMode === "none" ? "one" : "none");
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
          image={
            playlistMusicDetails && playlistMusicDetails[currentSongIndex]
              ? playlistMusicDetails[currentSongIndex].album?.images[0]?.url
              : null
          }
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
          <div className="playbar flex">
            <input
              type="range"
              value={trackProgress}
              step="1"
              min="0"
              max={duration ? duration : `${duration}`}
              onChange={(e) => {
                setTrackProgress(Number(e.target.value));
                audioRef.current.currentTime = Number(e.target.value);
              }}
            />
          </div>
          <Controls
            isPlaying={isPlaying}
            setIsPlaying={togglePlay}
            handleNext={handleNext}
            handlePrev={handlePrev}
            handleShuffle={handleShuffle}
            isShuffleOn={isShuffleOn}
            repeatMode={repeatMode}
            handleRepeatToggle={handleRepeatToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
