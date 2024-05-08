import React, { useState, useEffect } from 'react';
import './library.css';

function MusicPlayer() {
  const [musicData, setMusicData] = useState([]);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // 음악 재생 상태 추가

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

  const playMusic = (music) => {
    setCurrentTrack(music); // 선택한 음악을 현재 재생 음악으로 설정
    setIsPlaying(true); // 재생 상태 설정
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="screen-container">
      <div>
        <h1>My Playlist</h1>
        <div className='playlist-list'>
          <div className="library-body">
            {musicData.map((music) => (
              <div key={music.id} className="music-card">
                <div className="music-info">
                  <p className="music-title">{music.title}</p>
                  <p>by {music.artist}</p>
                  <p>({music.group})</p>
                  {music.favorite && <p>Favorite</p>}
                </div>
                {/* 음악 재생 컨트롤러 */}
                {currentTrack && currentTrack.id === music.id && (
                  <div className="music-controller">
                    <audio controls autoPlay={isPlaying}>
                      <source src={`http://localhost:8080/api/music/item/${currentTrack.id}`} type="audio/mpeg" />
                    </audio>
                  </div>
                )}
                {/* 현재 음악이 선택된 경우에만 재생 버튼 표시 */}
                {!currentTrack && (
                  <button onClick={() => playMusic(music)}>Play</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;