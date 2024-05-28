//라이브러리 인덱스 앨범,플리추가
import React, { useState, useEffect, useRef } from 'react';
import './library.css';
import { FaHeart } from "react-icons/fa";
import { AiOutlineStepBackward, AiOutlineStepForward } from "react-icons/ai";
import { FaPause, FaPlay } from "react-icons/fa6";
import { LuRepeat, LuRepeat1 } from "react-icons/lu";
import { CiMenuKebab } from "react-icons/ci";
import MusicController from './musicController';
import PlaylistMenu from './playlistMenu';
import AlbumMenu from './albumMenu';

function MusicPlayer() {
  const [musicData, setMusicData] = useState([]);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [repeatMode, setRepeatMode] = useState('none');
  const [showMenu, setShowMenu] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [showAlbumMenu, setShowAlbumMenu] = useState(false);
  const [musicToAdd, setMusicToAdd] = useState(null);
  const [editingMusic, setEditingMusic] = useState(null);
  const [openedMenuIndex, setOpenedMenuIndex] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    fetchMusicData();
    fetchPlaylists();
    fetchAlbums();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', handleTrackEnd);
    }
    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleTrackEnd);
      }
    };
  }, [currentTrack, repeatMode]);

  const fetchMusicData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/music');
      if (!response.ok) {
        throw new Error('Failed to fetch music data');
      }
      const data = await response.json();
      setMusicData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/playlist');
      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchAlbums = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/album');
      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const playMusic = (music, index) => {
    if (currentTrack && isPlaying) {
      stopMusic();
    }
    setCurrentTrack(music);
    setSelectedMusic(music.id);
    setCurrentIndex(index);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = `http://localhost:8080/api/music/item/${music.id}`;
      audioRef.current.play();
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setSelectedMusic(null);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playPrevious = () => {
    const previousIndex = currentIndex === 0 ? musicData.length - 1 : currentIndex - 1;
    const previousMusic = musicData[previousIndex];
    setCurrentIndex(previousIndex);
    playMusic(previousMusic, previousIndex);
  };

  const playNext = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      const nextIndex = (currentIndex + 1) % musicData.length;
      const nextMusic = musicData[nextIndex];
      setCurrentIndex(nextIndex);
      playMusic(nextMusic, nextIndex);
    }
  };

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatMode === 'all') {
      playNext();
    } else {
      setIsPlaying(false);
    }
  };

  const toggleFavorite = async (music) => {
    try {
      const formData = new FormData();
      formData.append('id', music.id);
      formData.append('title', music.title);
      formData.append('artist', music.artist);
      formData.append('group', music.group);
      formData.append('favorite', !music.favorite);
      if (music.chapters) {
        formData.append('chapters', JSON.stringify(music.chapters));
      }

      const response = await fetch(`http://localhost:8080/api/music/update/${music.id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to update favorite status');
      }

      const updatedMusicData = await response.json();

      const updatedMusicList = musicData.map(item => {
        if (item.id === music.id) {
          return updatedMusicData;
        }
        return item;
      });
      setMusicData(updatedMusicList);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const deleteMusic = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/music/delete/${id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to delete music');
      }

      // Filter out the deleted music from the list
      const updatedMusicList = musicData.filter(music => music.id !== id);
      setMusicData(updatedMusicList);
    } catch (error) {
      console.error('Error deleting music:', error);
    }
  };

  const handleRepeatToggle = () => {
    if (repeatMode === 'none') {
      setRepeatMode('all');
    } else if (repeatMode === 'all') {
      setRepeatMode('one');
    } else {
      setRepeatMode('none');
    }
  };

  const addMusicToPlaylist = async (playlistId, music) => {
    try {
      const playlist = playlists.find(p => p.id === playlistId);
      if (!playlist) return;

      const updatedMusics = [...playlist.musics, { id: music.id }];
      const updatedPlaylist = { ...playlist, musics: updatedMusics };

      const response = await fetch(`http://localhost:8080/api/playlist/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPlaylist)
      });

      if (!response.ok) {
        throw new Error('Failed to update playlist');
      }

      const updatedPlaylistData = await response.json();
      setPlaylists(playlists.map(p => p.id === playlistId ? updatedPlaylistData : p));
    } catch (error) {
      console.error('Error adding music to playlist:', error);
    }
  };

  const addMusicToAlbum = async (albumId, music) => {
    try {
      const album = albums.find(a => a.id === albumId);
      if (!album) return;

      const updatedMusics = [...album.musics, { id: music.id }];
      const updatedAlbum = { ...album, musics: updatedMusics };

      const response = await fetch(`http://localhost:8080/api/album/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAlbum)
      });

      if (!response.ok) {
        throw new Error('Failed to update album');
      }

      const updatedAlbumData = await response.json();
      setAlbums(albums.map(a => a.id === albumId ? updatedAlbumData : a));
    } catch (error) {
      console.error('Error adding music to album:', error);
    }
  };

  const toggleMenu = (index) => {
    if (openedMenuIndex !== null && openedMenuIndex !== index) {
      setShowMenu(prevState => ({
        ...prevState,
        [openedMenuIndex]: false
      }));
    }
    setShowMenu(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
    setOpenedMenuIndex(prevState => (prevState === index ? null : index));
  };

  const openPlaylistMenu = (music) => {
    setMusicToAdd(music);
    setShowPlaylistMenu(true);
  };

  const closePlaylistMenu = () => {
    setShowPlaylistMenu(false);
    setMusicToAdd(null);
  };

  const openAlbumMenu = (music) => {
    setMusicToAdd(music);
    setShowAlbumMenu(true);
  };

  const closeAlbumMenu = () => {
    setShowAlbumMenu(false);
    setMusicToAdd(null);
  };

  const openEditMenu = (music) => {
    setEditingMusic(music);
  };

  const closeEditMenu = () => {
    setEditingMusic(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingMusic(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('id', editingMusic.id);
      formData.append('title', editingMusic.title);
      formData.append('artist', editingMusic.artist);
      formData.append('group', editingMusic.group);
      formData.append('favorite', editingMusic.favorite);
      if (editingMusic.chapters) {
        formData.append('chapters', JSON.stringify(editingMusic.chapters));
      }

      const response = await fetch(`http://localhost:8080/api/music/update/${editingMusic.id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to update music info');
      }

      const updatedMusicData = await response.json();
      const updatedMusicList = musicData.map(item => {
        if (item.id === editingMusic.id) {
          return updatedMusicData;
        }
        return item;
      });

      setMusicData(updatedMusicList);
      closeEditMenu();
    } catch (error) {
      console.error('Error updating music info:', error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="screen-container">
      <div className='playlist-list'>
        <h1 className='library-h1'>My Playlist</h1>
        <div className="library-card">
          {musicData.map((music, index) => (
            <div key={music.id} className="music-card" onClick={() => playMusic(music, index)}>
              <div className="music-info">
                <p className="music-title">
                  {music.title}
                  <button className='heart-button' onClick={(e) => {
                    e.stopPropagation(); toggleFavorite(music); }}>
                    <FaHeart color={music.favorite ? 'red' : 'gray'} />
                  </button>
                </p>
                <p className="artist">by {music.artist}</p>
                <p className="group">({music.group})</p>
                <button className='menu-button' onClick={(e) => { e.stopPropagation(); toggleMenu(index); }}>
                  <CiMenuKebab />
                </button>
                {showMenu[index] && (
                  <div className="menu">
                    <p onClick={(e) => { e.stopPropagation(); openPlaylistMenu(music); }}>플레이리스트에 추가</p>
                    <p onClick={(e) => { e.stopPropagation(); openAlbumMenu(music); }}>앨범에 추가</p>
                    <p onClick={(e) => { e.stopPropagation(); openEditMenu(music); toggleMenu(index);}}>정보 수정</p>
                    <p onClick={(e) => { e.stopPropagation(); deleteMusic(music.id); }}>삭제</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showPlaylistMenu && (
        <PlaylistMenu
          music={musicToAdd}
          playlists={playlists}
          addMusicToPlaylist={addMusicToPlaylist}
          onClose={closePlaylistMenu}
        />
      )}
      {showAlbumMenu && (
        <AlbumMenu
          music={musicToAdd}
          albums={albums}
          addMusicToAlbum={addMusicToAlbum}
          onClose={closeAlbumMenu}
        />
      )}
      {selectedMusic && (
        <MusicController
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          stopMusic={stopMusic}
          togglePlay={togglePlay}
          playPrevious={playPrevious}
          playNext={playNext}
          audioRef={audioRef}
          repeatMode={repeatMode}
          handleRepeatToggle={handleRepeatToggle}
        />
      )}
      {editingMusic && (
        <div className="edit-menu">
        <form onSubmit={handleEditSubmit}>
          <table className="edit-table">
            <tbody>
              <tr>
                <td><label htmlFor="title">제목:</label></td>
                <td>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={editingMusic.title}
                    onChange={handleEditChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="artist">아티스트:</label></td>
                <td>
                  <input
                    type="text"
                    id="artist"
                    name="artist"
                    value={editingMusic.artist}
                    onChange={handleEditChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="group">그룹:</label></td>
                <td>
                  <input
                    type="text"
                    id="group"
                    name="group"
                    value={editingMusic.group}
                    onChange={handleEditChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className='edit-btn'>
            <button type="submit">수정</button>
            <button type="button" onClick={closeEditMenu}>취소</button>
          </div>
        </form>
      </div>      
      )}
    </div>
  );
}

export default MusicPlayer;