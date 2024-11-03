/*
import React, { useState, useEffect } from 'react';
import './recent.css'; 

const PlaylistRecentModal = ({ isOpen, toggleModal }) => {
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null); 

  // 서버에서 최근에 추가된 곡 목록 가져오기
  useEffect(() => {
    fetch('http://localhost:8080/api/music')
      .then(response => response.json())
      .then(data => {
     
        setRecentlyAdded(data.reverse());
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSongClick = (song) => {
    setSelectedSong(song);
  };

  const closeSongInfo = () => {
    setSelectedSong(null);
    toggleModal(); // 모달 닫기
  };

  return (
    isOpen && (
      <div className="recently-added-modal">
        <div className="Rmodal">
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

        {selectedSong && (
          <div className="song-info-modal">
            <div className="Smodal">
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

*/

import React, {useEffect, useState} from 'react';
import './recent.css';

const PlaylistRecentModal = ({isOpen, toggleModal}) => {
    const [recentlyAdded, setRecentlyAdded] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);

    // 서버에서 최근에 추가된 곡 목록 가져오기
    useEffect(() => {
        fetch('/api/music')
            .then(response => response.json())
            .then(data => {
                setRecentlyAdded(data.reverse());
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleSongClick = (song) => {
        setSelectedSong(song);
    };

    const closeSongInfo = () => {
        setSelectedSong(null); // 선택한 곡 정보 초기화하여 정보 모달만 닫음
    };

    const handleCloseModal = () => {
        setSelectedSong(null); // 선택한 곡 정보 초기화
        toggleModal(); // 모달 닫기
    };

    return (
        isOpen && (
            <div className="recently-added-modal">
                <div className="Rmodal">
                    <h2>최근에 추가한 곡</h2>
                    <ul className="recently-added-list">
                        {recentlyAdded.map((song, index) => (
                            <li key={index} onClick={() => handleSongClick(song)}>
                                {song.title}
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleCloseModal}>닫기</button>
                </div>


                {selectedSong && (
                    <div className="song-info-modal">
                        <div className="Smodal">
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
