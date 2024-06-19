import React, { useState, useEffect } from 'react';
import './favorite.css'; 

const PlaylistFavoriteModal = ({ isOpen, toggleModal }) => {
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  // 서버에서 좋아요한 곡 목록 가져오기
  useEffect(() => {
    fetch( '/api/music')
      .then(response => response.json())
      .then(data => {
        const favoriteSongs = data.filter(song => song.favorite === true);
        setFavoriteSongs(favoriteSongs.reverse());
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [isOpen]);

  // 곡 정보 닫기
  const closeSongInfo = () => {
    setFavoriteSongs([]);
    toggleModal();
  };

  return (
    isOpen && (
      <div className="favorite-modal">
        <div className="Fmodal">
          <h2>좋아요 한 곡</h2>
          <ul className="favorite-list">
            {favoriteSongs.map((song, index) => (
              <li key={index}>
                {song.title}
              </li>
            ))}
          </ul>
          <button onClick={closeSongInfo}>닫기</button>
        </div>
      </div>
    )
  );
};

export default PlaylistFavoriteModal;
