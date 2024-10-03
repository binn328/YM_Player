import React, {useState} from 'react';
import './playlistMenu.css'; // 필요에 따라 스타일을 정의하세요.

const PlaylistMenu = ({music, playlists, addMusicToPlaylist, onClose}) => {
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

    const handleAddMusic = () => {
        if (selectedPlaylistId) {
            addMusicToPlaylist(selectedPlaylistId, music);
            onClose();
        }
    };

    return (
        <div className="playlist-menu">
            <h2>플레이리스트 선택</h2>
            <ul>
                {playlists.map((playlist) => (
                    <li
                        key={playlist.id}
                        className={`playlist-item ${selectedPlaylistId === playlist.id ? 'selected' : ''}`}
                        onClick={() => setSelectedPlaylistId(playlist.id)}
                    >
                        {playlist.name}
                    </li>
                ))}
            </ul>
            <button onClick={handleAddMusic}>추가</button>
            <button onClick={onClose}>취소</button>
        </div>
    );
};

export default PlaylistMenu;
