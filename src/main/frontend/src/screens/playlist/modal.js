/*
import React from 'react';
import './modal.css';

const Modal = ({ isOpen, toggleModal, playlistName, handlePlaylistSubmit, handlePlaylistNameChange }) => {
const isPlaylistNameEmpty = playlistName.trim() === '';
  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <h2>플레이리스트 추가</h2>
          <input
            type="text"
            placeholder="이름"
            value={playlistName}
            onChange={handlePlaylistNameChange}
          />
          <button onClick={toggleModal}>취소</button>
          <button onClick={handlePlaylistSubmit} disabled={isPlaylistNameEmpty}>확인</button>
        </div>
      </div>
    )
  );
};

export default Modal;
*/
const Modal = ({ isOpen, toggleModal, playlistName, handlePlaylistSubmit, handlePlaylistNameChange }) => {
  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <h2>플레이리스트 추가</h2>
          <input
            type="text"
            placeholder="플레이리스트 이름"
            value={playlistName ? playlistName : ''} // playlistName이 정의되어 있는지 확인 후 사용
            onChange={handlePlaylistNameChange}
          />
          <button onClick={handlePlaylistSubmit}>확인</button>
          <button onClick={toggleModal}>취소</button>
        </div>
      </div>
    )
  );
};

export default Modal;