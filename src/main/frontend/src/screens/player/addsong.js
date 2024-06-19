/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './addsong.css';

const Addsong = ({ addToPlaylist, onClose }) => {
  const [musicList, setMusicList] = useState([]);

  useEffect(() => {
    const fetchMusicList = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/music');
        setMusicList(response.data);
      } catch (error) {
        console.error('음악 목록 가져오기 오류:', error);
      }
    };

    fetchMusicList();
  }, []);

  const handleAddToPlaylist = (selectedSong) => {
    addToPlaylist(selectedSong);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="add-song-container">
      
      <div className='add-song-top'>
        <p></p>
        <h2>추가할 노래 목록</h2>
        <button onClick={handleClose}>X</button>
      </div>
      

      <ul>
        {musicList.map((song) => (
          <li key={song.id} onClick={() => handleAddToPlaylist(song)}>
            {song.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Addsong;
*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './addsong.css';

const Addsong = ({ addToPlaylist, onClose, currentPlaylist }) => {
  const [musicList, setMusicList] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMusicList = async () => {
      try {
        const response = await axios.get( '/api/music');
        setMusicList(response.data);
      } catch (error) {
        console.error('음악 목록 가져오기 오류:', error);
      }
    };

    fetchMusicList();
  }, []);

  const handleAddToPlaylist = (selectedSong) => {
    if (currentPlaylist.some(song => song.id === selectedSong.id)) {
      setMessage('이미 현재 플레이리스트에 있습니다.');
    } else {
      addToPlaylist(selectedSong);
      setMessage('');  // Reset message on successful addition
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="add-song-container">
      <div className='add-song-top'>
        <p></p>
        <h2>추가할 노래 목록</h2>
        <button onClick={handleClose}>X</button>
      </div>
      
      {message && <p className="error-message">{message}</p>}
      
      <ul>
        {musicList.map((song) => (
          <li key={song.id} onClick={() => handleAddToPlaylist(song)}>
            {song.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Addsong;
