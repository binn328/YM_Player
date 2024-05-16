/*import React, { useState, useEffect } from 'react';
import { BsMusicPlayer } from 'react-icons/bs';
import { TbMusicHeart, TbMusicExclamation } from 'react-icons/tb';
import PlaylistRecentModal from './playlist_recent_modal';
import PlaylistFavoriteModal from './playlist_favorite_modal';
import Modal from './modal';
import './playlist.css';

const Playlist = () => {
  const [likedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, index: -1 });
  const [recentModalOpen, setRecentModalOpen] = useState(false);
  const [favoriteModalOpen, setFavoriteModalOpen] = useState(false);
  const [recentlyAddedCount, setRecentlyAddedCount] = useState(0);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleRecentModal = () => {
    setRecentModalOpen(!recentModalOpen);
  };

  const toggleFavoriteModal = () => {
    setFavoriteModalOpen(!favoriteModalOpen);
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
    setPlaylists([...playlists, { name, image: null, songs: [] }]);
  };

  const deletePlaylist = (index) => {
    const updatedPlaylists = [...playlists];
    updatedPlaylists.splice(index, 1);
    setPlaylists(updatedPlaylists);
  };

  const showContextMenu = (index, e) => {
    e.preventDefault();
    setContextMenu({ show: true, x: e.clientX, y: e.clientY, index });
  };

  const hideContextMenu = () => {
    setContextMenu({ ...contextMenu, show: false });
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/music')
      .then(response => response.json())
      .then(data => {
        setRecentlyAddedCount(data.length);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="playlist-container screen-container" onClick={hideContextMenu}>
      <div className="playlist-header">
        <h2>Play List</h2>
      </div>
      <div className="song">
        <div className="recently-added">
          <h3>최근에 추가한 곡({recentlyAddedCount})</h3>
          <div className="song-icons" onClick={toggleRecentModal}>
            <TbMusicExclamation />
          </div>
        </div>
        <div className="liked-songs">
          <h3>좋아요 한 곡 ({likedSongs.length})</h3>
          <div className="song-icons" onClick={toggleFavoriteModal}>
            <TbMusicHeart />
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
            {playlist.image ? (
              <img src={playlist.image} alt="playlist" className="playlist-image" />
            ) : (
              <BsMusicPlayer className="playlist-icon" />
            )}
            <p>{playlist.name}</p>
          </div>
        ))}
      </div>

      {contextMenu.show && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div onClick={() => deletePlaylist(contextMenu.index)}>삭제</div>
          <div>재생 목록</div>
        </div>
      )}

      <PlaylistRecentModal isOpen={recentModalOpen} toggleModal={toggleRecentModal} />
      <PlaylistFavoriteModal isOpen={favoriteModalOpen} toggleModal={toggleFavoriteModal} />

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
import PlaylistFavoriteModal from './playlist_favorite_modal';
import Modal from './modal';
import './playlist.css';

const Playlist = () => {
  const [likedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, index: -1 });
  const [recentModalOpen, setRecentModalOpen] = useState(false);
  const [favoriteModalOpen, setFavoriteModalOpen] = useState(false);
  const [recentlyAddedCount, setRecentlyAddedCount] = useState(0);

  const serverURL = 'http://localhost:8080/api/music';

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleRecentModal = () => {
    setRecentModalOpen(!recentModalOpen);
  };

  const toggleFavoriteModal = () => {
    setFavoriteModalOpen(!favoriteModalOpen);
  };

  const handlePlaylistSubmit = () => {
    createPlaylist(playlistName);
    setModalOpen(false);
    setPlaylistName('');
  };

  const handlePlaylistNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const createPlaylist = (name) => {
    fetch(`${serverURL}/playlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, image: null, songs: [] }),
    })
      .then(response => response.json())
      .then(data => {
        setPlaylists([...playlists, data]);
      })
      .catch(error => console.error('플레이리스트 생성 오류:', error));
  };

  const deletePlaylist = (index) => {
    const playlistId = playlists[index].id;
    fetch(`${serverURL}/playlist/delete/${playlistId}`, {
      method: 'POST',
    })
      .then(() => {
        const updatedPlaylists = [...playlists];
        updatedPlaylists.splice(index, 1);
        setPlaylists(updatedPlaylists);
      })
      .catch(error => console.error('플레이리스트 삭제 오류:', error));
  };

  const showContextMenu = (index, e) => {
    e.preventDefault();
    setContextMenu({ show: true, x: e.clientX, y: e.clientY, index });
  };

  const hideContextMenu = () => {
    setContextMenu({ ...contextMenu, show: false });
  };

  useEffect(() => {
    fetch(serverURL)
      .then(response => response.json())
      .then(data => {
        setRecentlyAddedCount(data.length);
      })
      .catch(error => console.error('데이터 가져오기 오류:', error));
    
    fetch(`${serverURL}/playlist`)
      .then(response => response.json())
      .then(data => {
        setPlaylists(data);
      })
      .catch(error => console.error('플레이리스트 가져오기 오류:', error));
  }, []);

  return (
    <div className="playlist-container screen-container" onClick={hideContextMenu}>
      <div className="playlist-header">
        <h2>Play List</h2>
      </div>
      <div className="song">
        <div className="recently-added">
          <h3>최근에 추가한 곡({recentlyAddedCount})</h3>
          <div className="song-icons" onClick={toggleRecentModal}>
            <TbMusicExclamation />
          </div>
        </div>
        <div className="liked-songs">
          <h3>좋아요 한 곡 ({likedSongs.length})</h3>
          <div className="song-icons" onClick={toggleFavoriteModal}>
            <TbMusicHeart />
          </div>
        </div>
      </div>
      <div className="add-playlist">
        <button onClick={toggleModal}>+</button>
      </div>
      <div className="playlists">
        {playlists.map((playlist, index) => (
          <div
            key={playlist.id}
            className="playlist-item"
            onContextMenu={(e) => showContextMenu(index, e)}
          >
            {playlist.image ? (
              <img src={playlist.image} alt="playlist" className="playlist-image" />
            ) : (
              <BsMusicPlayer className="playlist-icon" />
            )}
            <p>{playlist.name}</p>
          </div>
        ))}
      </div>

      {contextMenu.show && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div onClick={() => deletePlaylist(contextMenu.index)}>삭제</div>
          <div>재생 목록</div>
        </div>
      )}

      <PlaylistRecentModal isOpen={recentModalOpen} toggleModal={toggleRecentModal} />
      <PlaylistFavoriteModal isOpen={favoriteModalOpen} toggleModal={toggleFavoriteModal} />

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

