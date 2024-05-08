/*import React from 'react'

export default function Player() {
  return (
    <div className="screen-container">Player</div>
  )
}

import React, { useEffect, useState } from "react";
import "./player.css";
import AudioPLayer from "../../screens/audioPlayer";
import Widgets from "../../screens/widgets";
import { useLocation } from 'react-router-dom'; // useLocation 추가

export default function Player() {
  const location = useLocation();
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (location.state) {
      // apiClient를 사용하는 부분을 수정하거나, 이 부분을 사용하지 않도록 변경해야 합니다.
      // apiClient
      //   .get("playlists/" + location.state?.id + "/tracks")
      //   .then((res) => {
      //     setTracks(res.data.items);
      //     setCurrentTrack(res.data?.items[0]?.track);
      //   });
    }
  }, [location.state]);

  useEffect(() => {
    setCurrentTrack(tracks[currentIndex]?.track);
  }, [currentIndex, tracks]);

  return (
    <div className="screen-container flex">
      <div className="left-player-body">
        <AudioPLayer
          currentTrack={currentTrack}
          total={tracks}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
        <Widgets artistID={currentTrack?.album?.artists[0]?.id} />
      </div>
      
    </div>
  );
}
*/

import React, { useEffect, useState } from "react";
import "./player.css";
import AudioPlayer from "../../screens/audioPlayer"; // 수정: AudioPLayer -> AudioPlayer
import Widgets from "../../screens/widgets";
import { useLocation } from 'react-router-dom';
import axios from 'axios'; // axios 추가

export default function Player() {
  const location = useLocation();
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (location.state) {
      // API를 사용하여 서버에서 음악 목록을 가져오는 부분
      axios.get("http://localhost:8080/api/music")
        .then((res) => {
          setTracks(res.data);
          setCurrentTrack(res.data[0]); // 처음 음악을 현재 트랙으로 설정
        })
        .catch((err) => {
          console.error("Failed to fetch music:", err);
        });
    }
  }, [location.state]);

  // currentIndex가 변경될 때마다 현재 트랙 업데이트
  useEffect(() => {
    setCurrentTrack(tracks[currentIndex]);
  }, [currentIndex, tracks]);

  return (
    <div className="screen-container flex">
      <div className="left-player-body">
        <AudioPlayer
          currentTrack={currentTrack}
          total={tracks}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
        <Widgets artistID={currentTrack?.artist?.id} /> {/* 수정: album -> artist */}
      </div>
    </div>
  );
}