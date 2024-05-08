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
      setCurrentTrack(data[0]); // 첫 번째 음악을 현재 재생 음악으로 설정
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
                {/* 재생 버튼 클릭 시 해당 음악 재생 */}
                <button onClick={() => playMusic(music)}>Play</button>
              </div>
            ))}
          </div>
        </div>
        {currentTrack && (
          <div className="currently-playing">
            <h2>Now Playing</h2>
            <p>{currentTrack.title} by {currentTrack.artist} ({currentTrack.group})</p>
            {/* 재생 상태에 따라 음악을 재생하거나 일시 정지 */}
            <audio controls={isPlaying} autoPlay={isPlaying}>
              <source src={`http://localhost:8080/api/music/item/${currentTrack.id}`} type="audio/mpeg" />
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}

export default MusicPlayer;