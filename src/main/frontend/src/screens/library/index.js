import React, { useState, useEffect } from 'react';

function MusicPlayer() {
  const [music, setMusic] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/music');
        if (!response.ok) {
          throw new Error('Failed to fetch music');
        }
        const data = await response.json();
        setMusic(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMusic();
  }, []);

  const playMusic = (id) => {
    return `http://localhost:8080/api/music/item/${id}`;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {music && (
        <div>
          <h2>Title: {music.title}</h2>
          <h3>Artist: {music.artist}</h3>
          <h3>Group: {music.group}</h3>
          <audio controls autoPlay>
            <source src={playMusic(music.id)} type="audio/mpeg" />
          </audio>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;