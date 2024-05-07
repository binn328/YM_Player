import React, { useState, useEffect } from 'react';
import './recent.css'; // recent.css 파일 import

const PlaylistRecentModal = ({ isOpen, toggleModal }) => {
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null); // 선택한 곡 상태 추가

  // 서버에서 최근에 추가된 곡 목록 가져오기
  useEffect(() => {
    fetch('http://localhost:8080/api/music')
      .then(response => response.json())
      .then(data => {
        // 서버에서 가져온 데이터를 반대로 정렬하여 최근에 추가된 곡이 위에 오도록 함
        setRecentlyAdded(data.reverse());
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSongClick = (song) => {
    setSelectedSong(song);
  };

 
  const closeSongInfo = () => {
    setSelectedSong(null);
  };

  return (
    isOpen && (
      <div className="recently-added-modal">
        <div className="modal">
          <h2>최근에 추가한 곡</h2>
          <ul className="recently-added-list">
            {recentlyAdded.map((song, index) => (
              <li key={index} onClick={() => handleSongClick(song)}>
                {song.title}
              </li>
            ))}
          </ul>
          <button onClick={toggleModal}>닫기</button>
        </div>

        {/* 선택한 곡 정보 모달 */}
        {selectedSong && (
          <div className="song-info-modal">
            <div className="modal">
              <h2>{selectedSong.title}</h2>
              <p>Artist: {selectedSong.artist}</p>
              <p>Group: {selectedSong.group}</p>
              <p>Favorite: {selectedSong.favorite ? 'Yes' : 'No'}</p>
              <button onClick={closeSongInfo}>닫기</button>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default PlaylistRecentModal;
