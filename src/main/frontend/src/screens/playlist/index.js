
import React, { useState, useEffect } from 'react';//수정35
import { BsMusicPlayer } from 'react-icons/bs';
import { TbMusicHeart, TbMusicExclamation } from 'react-icons/tb';
import PlaylistModal from './playlistModal';
import PlaylistRecentModal from './playlist_recent_modal';
import PlaylistFavoriteModal from './playlist_favorite_modal';
import Modal from './modal';
import './playlist.css';

const Playlist = () => {
  const [likedSongsCount, setLikedSongsCount] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, index: -1 });
  const [recentModalOpen, setRecentModalOpen] = useState(false);
  const [favoriteModalOpen, setFavoriteModalOpen] = useState(false);
  const [recentlyAddedCount, setRecentlyAddedCount] = useState(0);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);

  const serverURL = 'http://localhost:8080/api/music';
  const playlistURL = 'http://localhost:8080/api/playlist';

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleRecentModal = () => {
    setRecentModalOpen(!recentModalOpen);
  };

  const toggleFavoriteModal = () => {
    setFavoriteModalOpen(!favoriteModalOpen);
  };

  const handlePlaylistSubmit = async () => {
    try {
      const playlistData = {
        name: playlistName,
        favorite: false,
        musics: []
      };

      const response = await fetch(playlistURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(playlistData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      setPlaylists([...playlists, responseData]);
      setModalOpen(false);
      setPlaylistName('');
    } catch (error) {
      console.error('플레이리스트 생성 오류:', error);
    }
  };

  const handlePlaylistNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const deletePlaylist = async (index) => {
    const playlistId = playlists[index].id;
    try {
      const response = await fetch(`${playlistURL}/delete/${playlistId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedPlaylists = [...playlists];
      updatedPlaylists.splice(index, 1);
      setPlaylists(updatedPlaylists);
    } catch (error) {
      console.error('플레이리스트 삭제 오류:', error);
    }
  };

  const showContextMenu = (index, e) => {
    e.preventDefault();
    setContextMenu({ show: true, x: e.clientX, y: e.clientY, index });
  };

  const hideContextMenu = () => {
    setContextMenu({ ...contextMenu, show: false });
  };

  const editPlaylistName = async (index) => {
    const playlistId = playlists[index].id;
    const newName = prompt('새 플레이리스트 이름을 입력하세요:', playlists[index].name);
    if (newName) {
      try {
        const response = await fetch(`${playlistURL}/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...playlists[index], name: newName })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const updatedPlaylist = await response.json();
        const updatedPlaylists = playlists.map((playlist, i) =>
          i === index ? updatedPlaylist : playlist
        );
        setPlaylists(updatedPlaylists);
      } catch (error) {
        console.error('플레이리스트 이름 수정 오류:', error);
      }
    }
  };

  useEffect(() => {
    fetch(serverURL)
        .then((response) => response.json())
        .then((data) => {
          setRecentlyAddedCount(data.length);
          setLikedSongsCount(data.filter((song) => song.favorite).length);
        })
        .catch((error) => console.error('데이터 가져오기 오류:', error));

    fetch(playlistURL)
        .then((response) => response.json())
        .then((data) => {
          setPlaylists(data);
        })
        .catch((error) => console.error('플레이리스트 가져오기 오류:', error));
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
            <h3>좋아요 한 곡 ({likedSongsCount})</h3>
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
                  onClick={() => setSelectedPlaylistId(playlist.id)}
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
              <div>재생</div>
              <div onClick={() => deletePlaylist(contextMenu.index)}>삭제</div>
              <div onClick={() => editPlaylistName(contextMenu.index)}>정보 수정</div>
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

        <PlaylistModal
            isOpen={selectedPlaylistId !== null}
            toggleModal={() => setSelectedPlaylistId(null)}
            playlistId={selectedPlaylistId}
            playlistURL={playlistURL}
            serverURL={serverURL}
        />
      </div>
  );
};

export default Playlist;

