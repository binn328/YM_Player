import React, { useState, useEffect } from 'react';
import './library.css';

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
      const response = await fetch('http://localhost:8080/api/music/item/${id}');
      const musicFileUrl = await response.json();
      // Create an audio element
      const audio = new Audio(musicFileUrl);
      // Autoplay the audio
      audio.autoplay = true;
      // Add controls
      audio.controls = true;
      // Create a container for the audio element
      const audioContainer = document.createElement('div');
      audioContainer.classList.add('audio-container');
      // Append the audio element to the container
      audioContainer.appendChild(audio);
      // Append the container to the body
      document.body.appendChild(audioContainer);
    } catch (error) {
      console.error('Error playing music:', error);
    }
  };

  return (
    <div className='screen-container'>
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