//albumMenu.js
import React, {useState} from 'react';
import './albumMenu.css';

const AlbumMenu = ({music, albums, addMusicToAlbum, onClose}) => {
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);

    const handleAddMusic = () => {
        if (selectedAlbumId) {
            addMusicToAlbum(selectedAlbumId, music);
            onClose();
        }
    };

    return (
        <div className="album-menu">
            <h2>앨범 선택</h2>
            <ul>
                {albums.map((album) => (
                    <li
                        key={album.id}
                        className={`album-item ${selectedAlbumId === album.id ? 'selected' : ''}`}
                        onClick={() => setSelectedAlbumId(album.id)}
                    >
                        {album.name}
                    </li>
                ))}
            </ul>
            <button onClick={handleAddMusic}>추가</button>
            <button onClick={onClose}>취소</button>
        </div>
    );
};

export default AlbumMenu;
