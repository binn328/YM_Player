

import React, { useState } from 'react';
import { BsMusicPlayer } from 'react-icons/bs';
import { TbMusicHeart, TbMusicExclamation } from 'react-icons/tb';
import Modal from './modal'; // 모달 컴포넌트 불러오기
import './playlist.css';



const Playlist = () => {
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // 모달 열림 상태
  const [playlistName, setPlaylistName] = useState(''); // 플레이리스트 이름 상태

  const addToRecentlyAdded = (song) => {
    setRecentlyAdded([song, ...recentlyAdded]);
  };

  const addToLikedSongs = (song) => {
    setLikedSongs([song, ...likedSongs]);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handlePlaylistSubmit = () => {
    addPlaylist(playlistName);
    setModalOpen(false);
    setPlaylistName('');
  };

  const handlePlaylistNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const addPlaylist = (name) => {
    setPlaylists([...playlists, { name, songs: [] }]);
  };

  return (
    <div className="playlist-container screen-container">
      <div className="playlist-header">
        <h2>Play List</h2>
      </div>
      <div className="song">
        <div className="recently-added">
          <h3>최근에 추가한 곡 ({recentlyAdded.length})</h3>
          <div className="song-icons">
            <TbMusicExclamation />
          </div>
        </div>
        <div className="liked-songs">
          <h3>좋아요 한 곡 ({likedSongs.length})</h3>
          <div className="song-icons">
            <TbMusicHeart  />
          </div>
        </div>
      </div>
      <div className="add-playlist">
        <button onClick={toggleModal}>+</button>
      </div>
      <div className="playlists">
        {playlists.map((playlist, index) => (
          <div key={index} className="playlist-item">
            <BsMusicPlayer className="playlist-icon" />
            <p>{playlist.name}</p>
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalOpen}
        toggleModal={toggleModal}
        playlistName={playlistName}
        handlePlaylistSubmit={handlePlaylistSubmit}
        handlePlaylistNameChange={handlePlaylistNameChange}
      />
    </div>
  );
};

export default Playlist;
