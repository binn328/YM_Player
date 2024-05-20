import React, { useState, useEffect } from "react";
import "./album.css";//수정9

const defaultAlbumCover = "https://i.ibb.co/hfBLJ5S/default-album-cover.jpg";

export default function Album() {
  const [albums, setAlbums] = useState([]);
  const [albumName, setAlbumName] = useState("");
  const [albumCover, setAlbumCover] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editAlbumName, setEditAlbumName] = useState("");
  const [editAlbumCover, setEditAlbumCover] = useState("");

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/album');
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error('앨범을 불러오는 중 에러 발생:', error);
      }
    };

    fetchAlbums();
  }, []);

  useEffect(() => {
    const fetchMusicAndCreateAlbums = async () => {
      try {
        const albumResponse = await fetch('http://localhost:8080/api/album');
        const albumsData = await albumResponse.json();
        const existingAlbumNames = albumsData.map((album) => album.name);

        const musicResponse = await fetch('http://localhost:8080/api/music');
        const musicData = await musicResponse.json();

        const groupedMusic = {};
        musicData.forEach((music) => {
          if (!groupedMusic[music.group]) {
            groupedMusic[music.group] = [];
          }
          groupedMusic[music.group].push(music);
        });

        const newAlbums = [];

        Object.entries(groupedMusic).forEach(([group, musicList]) => {
          if (!existingAlbumNames.includes(group)) {
            newAlbums.push({
              name: group,
              cover: defaultAlbumCover,
              musics: musicList.map(({ id }) => id),
            });
          }
        });

        for (const album of newAlbums) {
          try {
            const response = await fetch('http://localhost:8080/api/album', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: album.name,
                favorite: false,
                cover: album.cover,
                musics: album.musics,
              })
            });

            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setAlbums((prevAlbums) => [...prevAlbums, data]);
          } catch (error) {
            console.error('Error creating album:', error);
          }
        }
      } catch (error) {
        console.error('앨범을 자동 생성하는 중 에러 발생:', error);
      }
    };

    fetchMusicAndCreateAlbums();
  }, []);

  const handleAlbumCreate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', albumName);
      formData.append('favorite', 'false');
      formData.append('cover', albumCover || defaultAlbumCover);

      const response = await fetch('http://localhost:8080/api/album', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      await addMusicToAlbum(data); // Add music to the created album
      setAlbums([...albums, data]);
      setAlbumName("");
      setAlbumCover("");
    } catch (error) {
      console.error('Error creating album:', error);
    }
  };

  const addMusicToAlbum = async (album) => {
    try {
      const formData = new FormData();
      formData.append('song', selectedSong);

      const response = await fetch(`http://localhost:8080/api/album/${album.id}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to add song');
      }

      const data = await response.json();
      const updatedAlbum = { ...album, songs: [...(album.songs || []), data] };
      const updatedAlbums = albums.map((a) => (a.id === album.id ? updatedAlbum : a));
      setAlbums(updatedAlbums);
    } catch (error) {
      console.error('Error adding song:', error);
    }
  };

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setEditMode(false);
  };

  const handleAlbumDoubleClick = async (album) => {
    try {
      const response = await fetch(`http://localhost:8080/api/album/${album.id}`);
      const data = await response.json();
      const updatedAlbum = { ...album, songs: data };
      setSelectedAlbum(updatedAlbum);
    } catch (error) {
      console.error('Error fetching album songs:', error);
    }
  };

  const handleToggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  const handleAlbumNameEdit = (e) => {
    setEditAlbumName(e.target.value);
  };

  const handleAlbumCoverEdit = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditAlbumCover(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateAlbum = async (album, updatedName, updatedCover) => {
    try {
      const updatedAlbum = {
        ...album,
        name: updatedName !== null ? updatedName : album.name,
        cover: updatedCover !== null ? updatedCover : album.cover
      };

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

      const data = await response.json();
      const updatedAlbums = albums.map((a) => (a.id === album.id ? data : a));
      setAlbums(updatedAlbums);
    } catch (error) {
      console.error('Error updating album:', error);
    }
  };

  const handleSaveAlbumName = (album) => {
    handleUpdateAlbum(album, editAlbumName, null);
    setEditMode(false);
  };

  const handleSaveAlbumCover = async (album) => {
    if (!editAlbumCover) return;

    try {
      const formData = new FormData();
      formData.append('cover', editAlbumCover);

      const response = await fetch(`http://localhost:8080/api/album/art/${album.id}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload cover');
      }

      const data = await response.json();
      handleUpdateAlbum(album, album.name, data.coverUrl); // Update the album with the new cover URL
    } catch (error) {
      console.error('Error uploading cover:', error);
    }

    setEditMode(false);
  };

  const handleSongSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedSong(file);
    }
  };

  const handleDeleteSong = async (album, songIndex) => {
    try {
      const response = await fetch(`http://localhost:8080/api/album/${album.id}/${songIndex}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete song');
      }

      const data = await response.json();
      const updatedAlbum = { ...album, songs: data };
      const updatedAlbums = albums.map((a) => (a.id === album.id ? updatedAlbum : a));
      setAlbums(updatedAlbums);
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  // handleAlbumDrag function definition
  const handleAlbumDrag = (dragIndex, dropIndex) => {
    const draggedAlbum = albums[dragIndex];
    const updatedAlbums = [...albums];
    updatedAlbums.splice(dragIndex, 1);
    updatedAlbums.splice(dropIndex, 0, draggedAlbum);
    setAlbums(updatedAlbums);
  };

  // handleAlbumDelete function definition
  const handleAlbumDelete = async (albumToDelete) => {
    try {
      const response = await fetch(`http://localhost:8080/api/album/${albumToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete album');
      }

      const filteredAlbums = albums.filter(album => album.id !== albumToDelete.id);
      setAlbums(filteredAlbums);
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };

  return (
    <div className="screen-container">
      <div className="library-body">
        <div className="create-album">
          <input
            type="text"
            placeholder="앨범 이름"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
          />
          <label htmlFor="album-cover-input" className="text-color">
            이미지 선택
          </label>
          <input
            id="album-cover-input"
            type="file"
            accept="image/*"
            onChange={(e) => setAlbumCover(e.target.files[0])}
          />
          <button id="create-abum" onClick={handleAlbumCreate}>
            앨범 생성
          </button>
        </div>
        <div id="select-music">
          음악 파일 선택
          <input
            id="audio-input"
            type="file"
            accept="audio/*"
            onChange={handleSongSelect}
            className="audio-input"
          />
        </div>

        {albums.length > 0 &&
          albums.map((album, index) => (
            <div
              key={album.id}
              className="album-card"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", index);
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
                handleAlbumDrag(dragIndex, index);
              }}
              onClick={() => handleAlbumClick(album)}
              onDoubleClick={() => handleAlbumDoubleClick(album)}
            >
              <h3>{album.name}</h3>
              <img
                src={album.cover}
                alt={album.name}
                className="album-cover"
              />

              {selectedAlbum === album && (
                <div>
                  {editMode ? (
                    <div className="edit-album-details">
                      <input
                        type="text"
                        value={editAlbumName}
                        onChange={handleAlbumNameEdit}
                        placeholder="새 앨범 이름"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAlbumCoverEdit}
                      />
                      {editAlbumCover && (
                        <button id="save-cover" onClick={() => handleSaveAlbumCover(album)}>
                          커버 저장
                        </button>
                      )}
                      <button id="save-name" onClick={() => handleSaveAlbumName(album)}>
                        이름 저장
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button id="edit" onClick={handleToggleEditMode}>
                        {editMode ? "취소" : "편집"}
                      </button>
                      <button id="delete" onClick={() => handleAlbumDelete(album)}>
                        삭제
                      </button>
                    </div>
                  )}

                  <div className="song-list">
                    <h4>노래 목록:</h4>
                    {album.songs && album.songs.length > 0 ? (
                      album.songs.map((song, songIndex) => (
                        <div key={songIndex} className="song-item">
                          <p>{song.title} - {song.artist}</p>
                          <button onClick={() => handleDeleteSong(album, songIndex)}>삭제</button>
                        </div>
                      ))
                    ) : (
                      <p>이 앨범에 노래가 없습니다.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

