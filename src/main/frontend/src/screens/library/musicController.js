// musicController.js
import React, { useEffect, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa6";
import { LuRepeat, LuRepeat1 } from "react-icons/lu";
import {
    AiFillCaretDown,
    AiFillCaretUp,
    AiOutlineStepBackward,
    AiOutlineStepForward,
} from "react-icons/ai";

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
    toggleMusicController, // 토글 함수 추가
    isExpanded, // 펼침 상태 추가
}) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        if (audio) {
            audio.addEventListener("timeupdate", updateTime);
            audio.addEventListener("loadedmetadata", updateDuration);
        }

        return () => {
            if (audio) {
                audio.removeEventListener("timeupdate", updateTime);
                audio.removeEventListener("loadedmetadata", updateDuration);
            }
        };
    }, [audioRef]);

    const handleRangeChange = (event) => {
        const newTime = event.target.value;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <div className={`library-music-controller ${isExpanded ? "" : "collapsed"}`}>
            <div className="music-controller">
                {/* 음악 정보와 컨트롤 영역 */}
                {isExpanded && (
                    <>
                        <div className="music-info">
                            <p className="music-title">{currentTrack.title}</p>
                            <p className="artist">{currentTrack.artist}</p>
                        </div>
                        <div className="player-controls">
                            <audio ref={audioRef}>
                                <source
                                    src={`/api/music/item/${currentTrack.id}`}
                                    type="audio/mpeg"
                                />
                            </audio>
                            <div className="range-controls">
                                <div className="time-range-container">
                                    <span className="current-time">{formatTime(currentTime)}</span>
                                    <input
                                        type="range"
                                        value={currentTime}
                                        max={duration || 0}
                                        onChange={handleRangeChange}
                                        id="progress"
                                    />
                                    <span className="duration-time">{formatTime(duration)}</span>
                                </div>
                            </div>
                            <div className="controls">
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
                                    {repeatMode === "none" && <LuRepeat color="gray" />}
                                    {repeatMode === "all" && <LuRepeat color="#f53192" />}
                                    {repeatMode === "one" && <LuRepeat1 color="#f53192" />}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <button className="toggle-controller" onClick={toggleMusicController}>
                {isExpanded ? <AiFillCaretDown /> : <AiFillCaretUp />}
            </button>
        </div>
    );
};

export default MusicController;
