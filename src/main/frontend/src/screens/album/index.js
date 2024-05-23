import React, { useState, useEffect } from "react";
import "./album.css";

const defaultAlbumCover = "https://i.ibb.co/hfBLJ5S/default-album-cover.jpg";

export default function Album() {
  const [albums, setAlbums] = useState([]);
  const [albumName, setAlbumName] = useState("");
  const [albumCover, setAlbumCover] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedSongs, setSelectedSongs] = useState(null); // 초기에 null로 설정

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/album');
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };

    fetchAlbums();
  }, []);

  const handleAlbumCreate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', albumName);
      formData.append('favorite', false);
      formData.append('cover', albumCover || defaultAlbumCover);
      formData.append('musics', JSON.stringify([]));

      const response = await fetch('http://localhost:8080/api/album', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create album');
      }

      const data = await response.json();
      setAlbums([...albums, data]);
      setAlbumName("");
      setAlbumCover("");
    } catch (error) {
      console.error('Error creating album:', error);
    }
  };


  const handleAlbumClick = async (album) => {
    setSelectedAlbum(album);

    try {
      const response = await fetch(`http://localhost:8080/api/album/${album.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch album details');
      }
      const albumData = await response.json();
      setSelectedSongs(albumData.musics);
    } catch (error) {
      console.error('Error fetching album details:', error);
    }
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

        {albums.map((album) => (
          <div
            key={album.id}
            className="album-card"
            onClick={() => handleAlbumClick(album)}
          >
            <h3>{album.name}</h3>
            <img
              src={album.cover}
              alt={album.name}
              className="album-cover"
            />

            {selectedAlbum === album && (
              <div>
                <h4>Songs</h4>
                {selectedSongs !== null && selectedSongs.length > 0 ? (
                  <ul>
                    {selectedSongs.map((song, index) => (
                      <li key={index}>{song.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No songs available</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}