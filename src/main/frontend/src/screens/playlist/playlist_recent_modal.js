import React, { useState, useEffect } from 'react';
import Modal from './modal'; 
import './playlist.css';

const PlaylistRecentModal = ({ isOpen, toggleModal }) => {
  const [recentlyAdded, setRecentlyAdded] = useState([]);

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

  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal}>
      <div className="recently-added-modal">
        <h2>최근에 추가한 곡</h2>
        <ul className="recently-added-list">
          {recentlyAdded.map((song, index) => (
            <li key={index}>{song.title}</li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default PlaylistRecentModal;
