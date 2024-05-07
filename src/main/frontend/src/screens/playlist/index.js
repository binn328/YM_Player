/*import React, { useState, useEffect } from 'react';
import { BsMusicPlayer } from 'react-icons/bs';
import { TbMusicHeart, TbMusicExclamation } from 'react-icons/tb';
import Modal from './modal'; 
import './playlist.css';
import PlaylistRecentModal from './playlist_recent_modal';


const Playlist = () => {
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); 
  const [playlistName, setPlaylistName] = useState(''); // 플레이리스트 이름 상태
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, index: -1 }); // 컨텍스트 메뉴 상태
  const [serverSongs, setServerSongs] = useState([]); // 서버에서 가져온 곡 목록 상태

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

  // 플레이리스트 삭제 함수
  const deletePlaylist = (index) => {
    const updatedPlaylists = [...playlists];
    updatedPlaylists.splice(index, 1);
    setPlaylists(updatedPlaylists);
  };

  // 컨텍스트 메뉴 표시 함수
  const showContextMenu = (index, e) => {
    e.preventDefault();
    setContextMenu({ show: true, x: e.clientX, y: e.clientY, index });
  };

  // 컨텍스트 메뉴 숨기기 함수
  const hideContextMenu = () => {
    setContextMenu({ ...contextMenu, show: false });
  };

  // 최근에 추가된 곡 목록 아이콘 클릭 시 서버에서 가져온 곡 목록 보여주기
  const showServerSongs = () => {
    // 서버에서 가져온 곡 목록을 최근에 추가된 곡 목록으로 설정
    setRecentlyAdded(serverSongs);
  };

  return (
    <div className="playlist-container screen-container">
      <div className="playlist-header">
        <h2>Play List</h2>
      </div>
      <div className="song">
        <div className="recently-added">
          <h3>최근에 추가한 곡 ({recentlyAdded.length})</h3>
          <div className="song-icons" onClick={showServerSongs}>
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
          <div
            key={index}
            className="playlist-item"
            onContextMenu={(e) => showContextMenu(index, e)}
          >
            <BsMusicPlayer className="playlist-icon" />
            <p>{playlist.name}</p>
          </div>
        ))}
      </div>
      
      {contextMenu.show && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={hideContextMenu}
        >
          <div onClick={() => deletePlaylist(contextMenu.index)}>삭제</div>
          <div>재생 목록</div>
        </div>
      )}
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

export default Playlist;*/

import React, { useState, useEffect } from 'react';
import { BsMusicPlayer } from 'react-icons/bs';
import { TbMusicHeart, TbMusicExclamation } from 'react-icons/tb';
import PlaylistRecentModal from './playlist_recent_modal'; 
import Modal from './modal'; 
import './playlist.css';

const Playlist = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); 
  const [playlistName, setPlaylistName] = useState(''); 
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, index: -1 }); // 컨텍스트 메뉴 상태

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

  // 플레이리스트 삭제 함수
  const deletePlaylist = (index) => {
    const updatedPlaylists = [...playlists];
    updatedPlaylists.splice(index, 1);
    setPlaylists(updatedPlaylists);
  };

  // 컨텍스트 메뉴 표시 함수
  const showContextMenu = (index, e) => {
    e.preventDefault();
    setContextMenu({ show: true, x: e.clientX, y: e.clientY, index });
  };

  // 컨텍스트 메뉴 숨기기 함수
  const hideContextMenu = () => {
    setContextMenu({ ...contextMenu, show: false });
  };

  return (
    <div className="playlist-container screen-container">
      <div className="playlist-header">
        <h2>Play List</h2>
      </div>
      <div className="song">
        <div className="recently-added">
          <h3>최근에 추가한 곡</h3>
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
          <div
            key={index}
            className="playlist-item"
            onContextMenu={(e) => showContextMenu(index, e)}
          >
            <BsMusicPlayer className="playlist-icon" />
            <p>{playlist.name}</p>
          </div>
        ))}
      </div>
    
      {contextMenu.show && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={hideContextMenu}
        >
          <div onClick={() => deletePlaylist(contextMenu.index)}>삭제</div>
          <div>재생 목록</div>
        </div>
      )}
      
      <PlaylistRecentModal isOpen={modalOpen} toggleModal={toggleModal} />
    
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

