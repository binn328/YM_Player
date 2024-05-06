import React, { useState, useEffect } from 'react';

function Playlist() {
  const [musicData, setMusicData] = useState([]);

  useEffect(() => {
    fetchMusicData();
  }, []);

  const fetchMusicData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/music');
      const data = await response.json();
      setMusicData(data);
    } catch (error) {
      console.error('Error fetching music data:', error);
    }
  };

  const playMusic = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/music/item/${id}`);
      // Assuming the server returns the music file to play
      // Handle playing the music here (e.g., using an audio player)
    } catch (error) {
      console.error('Error playing music:', error);
    }
  };

  return (
    <div>
      <h1>My Playlist</h1>
      <ul>
        {musicData.map((music) => (
          <li key={music.id}>
            <strong>{music.title}</strong> by {music.artist} ({music.group})
            {music.favorite && <span> - Favorite</span>}
            <button onClick={() => playMusic(music.id)}>Play</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlist;