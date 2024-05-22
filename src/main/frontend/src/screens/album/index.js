import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "./album.css";

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
  const [selectedSongs, setSelectedSongs] = useState([]);


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
              musics: musicList.map(({ id, title, artist }) => ({ id, title, artist })),
            });
          }
        });
  
        for (const album of newAlbums) {
          try {
            const formData = new FormData();
            formData.append('name', album.name);
            formData.append('favorite', 'false');
            formData.append('cover', album.cover);
  
            const response = await fetch('http://localhost:8080/api/album', {
              method: 'POST',
              body: formData
            });
  
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
  
            const data = await response.json();
            setAlbums((prevAlbums) => [...prevAlbums, data]);
  
            // Save songs for the created album
            for (const song of album.musics) {
              const songFormData = new FormData();
              songFormData.append('song', song.id);
  
              const songResponse = await fetch(`http://localhost:8080/api/album/${data.id}/add-song`, {
                method: 'POST',
                body: songFormData,
              });
  
              if (!songResponse.ok) {
                throw new Error('Failed to add song to album');
              }
  
              const songData = await songResponse.json();
              // Update the album with the added song
              setAlbums((prevAlbums) =>
                  prevAlbums.map((prevAlbum) =>
                      prevAlbum.id === data.id ? { ...prevAlbum, musics: [...prevAlbum.musics, songData] } : prevAlbum
                  )
              );
            }
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
  
      const albumData = await response.json();
  
      // 추가할 뮤직들의 ID 배열
      const musicIds = [];
  
      // 뮤직을 서버에 추가하고 뮤직의 ID를 가져옴
      for (const selectedSong of selectedSongs) {
        const musicFormData = new FormData();
        musicFormData.append('song', selectedSong);
  
        const musicResponse = await fetch('http://localhost:8080/api/music', {
          method: 'POST',
          body: musicFormData
        });
  
        if (!musicResponse.ok) {
          throw new Error('Failed to upload music');
        }
  
        const musicData = await musicResponse.json();
        musicIds.push(musicData.id);
      }
  
      // 앨범에 뮤직들의 ID를 추가
      const albumUpdateResponse = await fetch(`http://localhost:8080/api/album/${albumData.id}/add-musics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ musics: musicIds })
      });
  
      if (!albumUpdateResponse.ok) {
        throw new Error('Failed to update album with musics');
      }
  
      const updatedAlbumData = await albumUpdateResponse.json();
  
      // 앨범 데이터 업데이트
      setAlbums([...albums, updatedAlbumData]);
      setAlbumName("");
      setAlbumCover("");
      setSelectedSongs([]);
    } catch (error) {
      console.error('Error creating album:', error);
    }
  };
  

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setEditMode(false);
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
        cover: updatedCover !== null ? updatedCover : album.cover,
        musics: album.musics ? album.musics.map((music) => ({ id: music.id })) : []
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

      const response = await fetch(`http://localhost:8080/api/album/${album.id}/upload-cover`, {
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

  const handleSongAdd = async (album) => {
    if (!selectedSong) {
      alert("Please select a song to add.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('musics', selectedSong);

      const response = await fetch(`http://localhost:8080/api/album/${album.id}/add-music`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add music to album');
      }

      const data = await response.json();
      const updatedAlbums = albums.map((a) =>
        a.id === album.id ? { ...a, musics: [...a.musics, data] } : a
      );
      setAlbums(updatedAlbums);
      setSelectedSong(null);
    } catch (error) {
      console.error('Error adding music to album:', error);
    }
  };

  const handleAlbumDelete = async (albumToDelete) => {
    try {
      const response = await fetch(`http://localhost:8080/api/album/delete/${albumToDelete.id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to delete album');
      }

      const updatedAlbums = albums.filter((album) => album.id !== albumToDelete.id);
      setAlbums(updatedAlbums);
      if (selectedAlbum === albumToDelete) {
        setSelectedAlbum(null);
      }
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };

  const handleAlbumDrag = (dragIndex, hoverIndex) => {
    const updatedAlbums = [...albums];
    const draggedAlbum = updatedAlbums[dragIndex];
    updatedAlbums.splice(dragIndex, 1);
    updatedAlbums.splice(hoverIndex, 0, draggedAlbum);
    setAlbums(updatedAlbums);
  };

  const handleSongDelete = (album, songIndex) => {
    const updatedAlbums = albums.map((a) =>
      a.id === album.id ? { ...a, musics: a.musics.filter((_, index) => index !== songIndex) } : a
    );
    setAlbums(updatedAlbums);
  };

  return (
    <div className="screen-container">
      <div className="library-body">
        <div className="create-album">
          <input
            type="text"
            placeholder="Album Name"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
          />
          <label htmlFor="album-cover-input" className="text-color">
            Select image
          </label>
          <input
            id="album-cover-input"
            type="file"
            accept="image/*"
            onChange={(e) => setAlbumCover(e.target.files[0])}
          />
          <button id="create-abum" onClick={handleAlbumCreate}>
            Create Album
          </button>
        </div>

        <div id="select-music">
          Select music file
          <input
            id="audio-input"
            type="file"
            accept="audio/*"
            onChange={(e) => setSelectedSong(e.target.files[0])}
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
            >
              <h3>{album.name}</h3>
              <img
                src={album.cover}
                alt={album.name}
                className="album-cover"
                onClick={() => handleAlbumClick(album)}
              />

              {selectedAlbum === album ? (
                <div>
                  {editMode ? (
                    <div className="edit-album-details">
                      <input
                        type="text"
                        value={editAlbumName}
                        onChange={(e) => setEditAlbumName(e.target.value)}
                        placeholder="New Album Name"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAlbumCoverEdit(e)}
                      />
                      {editAlbumCover && (
                        <button id="save-cover" onClick={() => handleSaveAlbumCover(album)}>
                          Save Cover
                        </button>
                      )}
                      <button id="save-name" onClick={() => handleSaveAlbumName(album)}>
                        Save Name
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button id="edit" onClick={handleToggleEditMode}>
                        {editMode ? "Cancel" : "Edit"}
                      </button>
                      <button id="delete" onClick={() => handleAlbumDelete(album)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ))}
      </div>
    </div>
  );
}
