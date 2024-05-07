import React, { useState, useEffect } from 'react';

function MusicPlayer() {
  const [musicData, setMusicData] = useState([]);
  const [error, setError] = useState(null);
  const [currentMusic, setCurrentMusic] = useState(null);

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
      // 첫 번째 음악을 현재 재생 음악으로 설정
      setCurrentMusic(data[0]);
    } catch (error) {
      setError(error.message);
    }
  };

  const playMusic = (id) => {
    return `http://localhost:8080/api/music/item/${id}`;
  };

  const handleMusicSelect = (selectedMusic) => {
    setCurrentMusic(selectedMusic);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div>
        <h1>My Playlist</h1>
        <ul>
          {musicData.map((music) => (
            <li key={music.id} onClick={() => handleMusicSelect(music)}>
              <strong>{music.title}</strong> by {music.artist} ({music.group})
              {music.favorite && <span> - Favorite</span>}
            </li>
          ))}
        </ul>
      </div>
      <div>
        {currentMusic && (
          <div>
            <h2>Title: {currentMusic.title}</h2>
            <h3>Artist: {currentMusic.artist}</h3>
            <h3>Group: {currentMusic.group}</h3>
            <audio controls autoPlay>
              <source src={playMusic(currentMusic.id)} type="audio/mpeg" />
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}

export default MusicPlayer;