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

  return (
    <div>
      <h1>My Playlist</h1>
      <ul>
        {musicData.map((music) => (
          <li key={music.id}>
            <strong>{music.title}</strong> by {music.artist} ({music.group})
            {music.favorite && <span> - Favorite</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlist;
