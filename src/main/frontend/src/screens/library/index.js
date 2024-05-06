import React, { useState, useEffect } from 'react';
import './library.css';

function Playlist() {
  const [musicData, setMusicData] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [audio] = useState(new Audio());

  useEffect(() => {
    fetchMusicData();
  }, []);

  // 서버의 API URL을 구성하는 함수
  const getMusicUrl = (musicId) => {
    return `http://localhost:8080/api/music/item/${musicId}`;
  };

  const fetchMusicData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/music');
      const data = await response.json();
      setMusicData(data);
    } catch (error) {
      console.error('Error fetching music data:', error);
    }
  };

  const playMusic = async (music) => {
    setCurrentTrack(music);
    if (music) {
      try {
        const response = await fetch(getMusicUrl(music.id));
        if (!response.ok) {
          throw new Error('Failed to fetch music data');
        }
        const musicData = await response.json();
        audio.src = musicData.audioUrl;
        audio.play();
      } catch (error) {
        console.error('Error playing music:', error);
      }
    } else {
      audio.pause();
    }
  };

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
          </div>
        )}
      </div>
    </div>
  );
}

export default Playlist;