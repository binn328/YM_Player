// modal.js

import React from 'react';
import './modal.css';

const Modal = ({ isOpen, toggleModal, playlistName, handlePlaylistSubmit, handlePlaylistNameChange }) => {
  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <h2>플레이리스트 추가</h2>
          <input
            type="text"
            placeholder="플레이리스트 이름"
            value={playlistName}
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