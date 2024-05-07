import React, { useState, useEffect } from 'react';

function MusicPlayer() {
  const [musicData, setMusicData] = useState([]);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);

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
              <div key={music.id} className="music-card" onClick={() => playMusic(music)}>
                <div className="music-info">
                  <p className="music-title">{music.title}</p>
                  <p>by {music.artist}</p>
                  <p>({music.group})</p>
                  {music.favorite && <p>Favorite</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
        {currentTrack && (
          <div className="currently-playing">
            <h2>Now Playing</h2>
            <p>{currentTrack.title} by {currentTrack.artist} ({currentTrack.group})</p>
            <audio controls autoPlay>
              <source src={`http://localhost:8080/api/music/item/${currentTrack.id}`} type="audio/mpeg" />
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}

export default MusicPlayer;