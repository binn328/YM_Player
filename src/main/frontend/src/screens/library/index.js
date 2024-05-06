import React, { useState } from 'react';

const MusicPlayer = () => {
  const [music, setMusic] = useState(null);

  const fetchMusic = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/music');
      const data = await response.json();
      setMusic(data);
    } catch (error) {
      console.error('Error fetching music:', error);
    }
  };

  const playMusic = async (id) => {
    try {
      const response = await fetch(`{SERVER_URL}/api/music/item/${id}`);
      // Assuming the server returns the music file to play
      // Handle playing the music here (e.g., using an audio player)
    } catch (error) {
      console.error('Error playing music:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchMusic}>Fetch Music</button>
      {music && (
        <div>
          <h2>{music.title}</h2>
          <p>Artist: {music.artist}</p>
          <p>Group: {music.group}</p>
          <button onClick={() => playMusic(music.id)}>Play</button>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
