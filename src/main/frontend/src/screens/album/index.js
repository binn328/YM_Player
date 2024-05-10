import React, { useState } from "react";
import ReactPlayer from "react-player";
import "./album.css";

export default function Album() {
  const [albums, setAlbums] = useState([]);
  const [albumName, setAlbumName] = useState("");
  const [albumCover, setAlbumCover] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editAlbumName, setEditAlbumName] = useState("");
  const [editAlbumCover, setEditAlbumCover] = useState("");

  const handleAlbumNameChange = (e) => {
    setAlbumName(e.target.value);
  };

  const handleAlbumCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAlbumCover(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAlbumCreate = () => {
    if (albumName && albumCover) {
      const newAlbum = {
        name: albumName,
        cover: albumCover,
        songs: [],
      };
      setAlbums([...albums, newAlbum]);
      setAlbumName("");
      setAlbumCover("");
    } else {
      alert("Please provide album name and cover image.");
    }
  };

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setEditMode(false);
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

  const handleSaveAlbumName = (album) => {
    const updatedAlbums = albums.map((a) =>
      a === album ? { ...a, name: editAlbumName } : a
    );
    setAlbums(updatedAlbums);
    setEditMode(false);
  };

  const handleSaveAlbumCover = (album) => {
    const updatedAlbums = albums.map((a) =>
      a === album ? { ...a, cover: editAlbumCover } : a
    );
    setAlbums(updatedAlbums);
    setEditMode(false);
  };

  const handleSongSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedSong(file);
    }
  };

  const handleSongAdd = (album) => {
    if (selectedSong) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const songUrl = e.target.result;
        const songName = selectedSong.name;
        const updatedAlbums = albums.map((a) =>
          a === album ? { ...a, songs: [...a.songs, { name: songName, url: songUrl }] } : a
        );
        setAlbums(updatedAlbums);
        setSelectedSong(null);
      };
      reader.readAsDataURL(selectedSong);
    } else {
      alert("Please select a song to add.");
    }
  };

  const handleAlbumDelete = (albumToDelete) => {
    const updatedAlbums = albums.filter((album) => album !== albumToDelete);
    setAlbums(updatedAlbums);
    if (selectedAlbum === albumToDelete) {
      setSelectedAlbum(null);
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
      a === album ? { ...a, songs: a.songs.filter((_, index) => index !== songIndex) } : a
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
            onChange={handleAlbumNameChange}
          />
          <label htmlFor="album-cover-input" className="text-color">
            Select image
          </label>
          <input
            id="album-cover-input"
            type="file"
            accept="image/*"
            onChange={handleAlbumCoverChange}
          />
          <button id="create-album" onClick={handleAlbumCreate}>
            Create Album
          </button>
        </div>
        <div id="select-music">Select music file
          <input
            id="audio-input"
            type="file"
            accept="audio/*"
            onChange={handleSongSelect}
            className="audio-input"
          />
        </div>

        {albums.map((album, index) => (
          <div
            key={album.name}
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
              <div className="song-list">
                <h4>Songs in {album.name}</h4>
                <ul>
                  {album.songs.map((song, songIndex) => (
                    <li key={songIndex}>
                      {song.name} -{" "}
                      <ReactPlayer
                        url={song.url}
                        controls
                        width="200px"
                        height="20px"
                        style={{ marginTop: "5px" }}
                      />
                      <button onClick={() => handleSongDelete(album, songIndex)}>Delete</button>
                    </li>
                  ))}
                </ul>
                <button id="add-song" onClick={() => handleSongAdd(album)}>Add Song</button>
              </div>
            ) : null}
            {selectedAlbum === album ? (
              <div>
                {editMode ? (
                  <div className="edit-album-details">
                    <input
                      type="text"
                      value={editAlbumName}
                      onChange={handleAlbumNameEdit}
                      placeholder="New Album Name"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAlbumCoverEdit}
                    />
                    {editAlbumCover && (
                      <button id="save-cover" onClick={() => handleSaveAlbumCover(album)}>Save Cover</button>
                    )}
                    <button id="save-name" onClick={() => handleSaveAlbumName(album)}>Save Name</button>
                  </div>
                ) : (
                  <div>
                    <button id="edit" onClick={() => setEditMode(true)}>Edit</button>
                    <button id="delete" onClick={() => handleAlbumDelete(album)}>Delete</button>
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
