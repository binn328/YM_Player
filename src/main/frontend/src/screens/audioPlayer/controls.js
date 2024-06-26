
/*
import React from "react";
import "./controls.css";
import { IconContext } from "react-icons";
import { FaPause,FaRandom } from "react-icons/fa";
import { IoPlaySkipBack, IoPlaySkipForward, IoPlay } from "react-icons/io5";
import { TbRepeatOnce,TbRepeat } from "react-icons/tb";

export default function Controls({
  isPlaying,
  setIsPlaying,
  handleNext,
  handlePrev,
  handleShuffle, 
  isShuffleOn,
}) {
  return (
    <IconContext.Provider value={{ size: "35px", color: "#C4D0E3" }}>
      <div className="controls-wrapper flex">

        <div
          className={
            isShuffleOn ? "shuffle-icon flex active" : "shuffle-icon flex"
          } 
            onClick={handleShuffle}
        >
          <FaRandom /> 
        </div>


        <div className="action-btn flex" onClick={handlePrev}>
          <IoPlaySkipBack />
        </div>
        <div
          className={
            isPlaying ? "play-pause-btn flex active" : "play-pause-btn flex"
          }
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <FaPause /> : <IoPlay />}
        </div>
        <div className="action-btn flex" onClick={handleNext}>
          <IoPlaySkipForward />
        </div>

          <div >
            <TbRepeatOnce />
            <TbRepeat />
          </div>
        
        
      </div>
    </IconContext.Provider>
  );
}
*/

import React from "react";
import "./controls.css";
import { IconContext } from "react-icons";
import { FaPause, FaRandom } from "react-icons/fa";
import { IoPlaySkipBack, IoPlaySkipForward, IoPlay } from "react-icons/io5";
import { TbRepeatOnce, TbRepeat } from "react-icons/tb";

export default function Controls({
  isPlaying,
  setIsPlaying,
  handleNext,
  handlePrev,
  handleShuffle,
  isShuffleOn,
  repeatMode,
  handleRepeatToggle,
}) {
  return (
    <IconContext.Provider value={{ size: "35px", color: "#C4D0E3" }}>
      <div className="controls-wrapper flex">
        <div
          className={
            isShuffleOn ? "shuffle-icon flex active" : "shuffle-icon flex"
          }
          onClick={handleShuffle}
        >
          <FaRandom />
        </div>

        <div className="action-btn flex" onClick={handlePrev}>
          <IoPlaySkipBack />
        </div>

        <div
          className={
            isPlaying ? "play-pause-btn flex active" : "play-pause-btn flex"
          }
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <FaPause /> : <IoPlay />}
        </div>

        <div className="action-btn flex" onClick={handleNext}>
          <IoPlaySkipForward />
        </div>

        <div 
          className={
            repeatMode === "one"? "play-repeat-one flex active" : "play-repeat flex" 
          }
          onClick={handleRepeatToggle}
        
        >
          {repeatMode === "one" ? <TbRepeatOnce /> : <TbRepeat />}
        </div>

      </div>
    </IconContext.Provider>
  );
}
