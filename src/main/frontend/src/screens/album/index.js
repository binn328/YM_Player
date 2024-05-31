import React, { useState, useEffect } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";
import "./album.css";
import defaultAlbumCover from './icon-image.png';

const SERVER_URL = "http://localhost:8080";

export default function Album() {

    const [albums, setAlbums] = useState([]);
    const [albumName, setAlbumName] = useState("");
    const [albumCover, setAlbumCover] = useState(null); // Changed to null
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedMusics, setSelectedMusics] = useState([]);
    const [showMenu, setShowMenu] = useState(null);
    const [editAlbumId, setEditAlbumId] = useState(null);
    const [editAlbumName, setEditAlbumName] = useState("");
    const [newMusicId, setNewMusicId] = useState("");
    const [musicList, setMusicList] = useState([]);
    const [albumArtUrl, setAlbumArtUrl] = useState("");

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

                for (const [group, musicList] of Object.entries(groupedMusic)) {
                    const existingAlbum = albumsData.find((album) => album.name === group);
                    if (existingAlbum) {
                        const existingMusicIds = new Set(existingAlbum.musics.map(music => music.id));
                        const newMusicIds = musicList.map(({id}) => id).filter(id => !existingMusicIds.has(id));
                        const updatedMusics = [...existingAlbum.musics, ...newMusicIds];
                        const updatedAlbumData = {...existingAlbum, musics: updatedMusics};

                        const updateResponse = await fetch(`http://localhost:8080/api/album/update`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updatedAlbumData)
                        });

                        if (!updateResponse.ok) {
                            throw new Error('앨범 음악 목록 업데이트 실패');
                        }

                        const updatedAlbum = await updateResponse.json();
                        setAlbums((prevAlbums) =>
                            prevAlbums.map((album) => (album.id === updatedAlbum.id ? updatedAlbum : album))
                        );
                    } else {
                        const newAlbum = {
                            name: group,
                            cover: defaultAlbumCover,
                            musics: musicList.map(({id}) => id),
                        };

                        const formData = new FormData();
                        formData.append('name', newAlbum.name);
                        formData.append('favorite', 'false');
                        formData.append('cover', defaultAlbumCover); // Using defaultAlbumCover here


                        newAlbum.musics.forEach((id, index) => {
                            formData.append(`musics[${index}]`, id);
                        });

                        const response = await fetch('http://localhost:8080/api/album', {
                            method: 'POST',
                            body: formData,
                        });

                        if (!response.ok) {
                            throw new Error('네트워크 응답 실패');
                        }

                    }
                }
            } catch (error) {
                console.error('음악으로부터 앨범 생성 중 오류 발생:', error);
            }
        };

        fetchAlbums();
        fetchMusicAndCreateAlbums();
    }, []);

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/music');
                const data = await response.json();
                setMusicList(data);
                console.log("MusicList", data);
            } catch (error) {
                console.error('Error fetching music:', error);
            }
        };

        fetchMusic();
    }, []);

    const fetchAndUploadAlbumCover = async (albumId) => {
        try {
            const response = await fetch(defaultAlbumCover);
            const blob = await response.blob();

            const formData = new FormData();
            formData.append('file', blob);

            const uploadResponse = await fetch(`http://localhost:8080/api/album/art/${albumId}`, {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload album cover');
            }

            const uploadedAlbumCover = await uploadResponse.json();

            setAlbums(prevAlbums =>
                prevAlbums.map(album => album.id === albumId ? {...album, cover: uploadedAlbumCover.cover} : album)
            );
        } catch (error) {
            console.error('Error uploading album cover:', error);
        }
    };

    const handleAlbumCreate = async () => {
        try {
            const formData = new FormData();
            formData.append('name', albumName);
            formData.append('favorite', 'false');
            formData.append('cover', albumCover || defaultAlbumCover); // Using defaultAlbumCover here
            formData.append('musics', []);

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
            setAlbumCover(null); // Reset album cover after creation
        } catch (error) {
            console.error('Error creating album:', error);
        }
    };

    const handleAlbumClick = async (album) => {
        if (selectedAlbum === album.id) {
            setSelectedAlbum(null);
            setSelectedMusics([]);
            return;
        }

        setSelectedAlbum(album.id);
        console.log("Selected Album:", album);
        try {
            const response = await fetch(`http://localhost:8080/api/album/${album.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch album details');
            }
            const albumData = await response.json();
            console.log("Selected Musics:", selectedMusics);
            console.log("Music List:", musicList);
            console.log("Selected Album Music IDs:", albumData.musics);
            setSelectedMusics(albumData.musics);
        } catch (error) {
            console.error('Error fetching album details:', error);
        }
    };

    const handleUpdateAlbumName = async (albumId) => {
        try {
            const response = await fetch('http://localhost:8080/api/album/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: albumId,
                    name: editAlbumName
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update album name');
            }

            const updatedAlbum = await response.json();
            setAlbums((prevAlbums) =>
                prevAlbums.map((alb) => (alb.id === albumId ? updatedAlbum : alb))
            );
            setEditAlbumId(null);
            setEditAlbumName("");
        } catch (error) {
            console.error('Error updating album name:', error);
        }
    };

    const toggleFavorite = async (album) => {
        try {
            const response = await fetch(`http://localhost:8080/api/album/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: album.id,
                    favorite: !album.favorite
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update album favorite');
            }

            const updatedAlbum = await response.json();
            setAlbums((prevAlbums) =>
                prevAlbums.map((alb) => (alb.id === album.id ? updatedAlbum : alb))
            );
        } catch (error) {
            console.error('Error updating album favorite:', error);
        }
    };

    const handleDeleteAlbum = async (albumId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/album/delete/${albumId}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to delete album');
            }

            setAlbums((prevAlbums) => prevAlbums.filter((alb) => alb.id !== albumId));
        } catch (error) {
            console.error('Error deleting album:', error);
        }
    };

    const handleDeleteMusic = async (albumId, musicId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/album/${albumId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch album details');
            }
            const albumData = await response.json();
            console.log('앨범 정보:', albumData);

            const updatedMusics = albumData.musics.filter(music => music.id !== musicId.id);
            console.log('새로운 음악 목록:', updatedMusics);

            const updatedAlbumData = {...albumData, musics: updatedMusics};
            console.log('새로운 앨범 데이터:', updatedAlbumData);
            const updateResponse = await fetch(`http://localhost:8080/api/album/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedAlbumData)
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update album music list');
            }

            const updatedAlbum = await updateResponse.json();
            console.log('업데이트된 앨범 정보:', updatedAlbum);

            setSelectedMusics(updatedAlbum.musics);

            setAlbums(prevAlbums => prevAlbums.map(album => album.id === albumId ? updatedAlbum : album));
        } catch (error) {
            console.error('Error deleting music from album:', error);
        }
    };

    const handleAddMusicToAlbum = async (albumId, musicName) => {
        try {
            // 음악 이름으로 음악 ID 찾기
            const music = musicList.find((item) => item.title === musicName);
            if (!music) {
                console.error('해당 이름의 음악을 찾을 수 없습니다:', musicName);
                return;
            }
            const musicId = music.id;

            const response = await fetch(`http://localhost:8080/api/album/${albumId}`);
            if (!response.ok) {
                throw new Error('앨범 세부 정보를 가져오지 못했습니다');
            }
            const albumData = await response.json();

            const updatedMusics = [...albumData.musics, musicId];

            const updatedAlbumData = {...albumData, musics: updatedMusics};
            const updateResponse = await fetch(`http://localhost:8080/api/album/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedAlbumData)
            });

            if (!updateResponse.ok) {
                throw new Error('앨범 음악 목록 업데이트 실패');
            }

            const updatedAlbum = await updateResponse.json();
            setSelectedMusics(updatedAlbum.musics);
            setAlbums(prevAlbums => prevAlbums.map(album => album.id === albumId ? updatedAlbum : album));
        } catch (error) {
            console.error('앨범에 음악 추가 중 오류 발생:', error);
        }
    };


    const handleCreatePlaylist = async (album) => {
        try {
            const response = await fetch(`${SERVER_URL}/api/playlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: album.name
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create playlist');
            }

            const playlist = await response.json();
            console.log('Playlist created:', playlist);

            // Playlist가 생성된 후 음악 추가
            await handleAddMusicsToPlaylist(playlist.id, album.musics);

            // 알림 표시
            alert("Playlist에 추가되었습니다.");
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };



    const handleAddMusicsToPlaylist = async (playlistId, musics) => {
        try {
            const formattedMusics = musics.map((musicId, index) => ({
                id: musicId.id || musicId,
                order: index + 1
            }));

            const response = await fetch(`${SERVER_URL}/api/playlist/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: playlistId,
                    musics: formattedMusics
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add music to playlist');
            }

            const data = await response.json();
            console.log('Music added to playlist:', data);
        } catch (error) {
            console.error('Error adding music to playlist:', error);
        }
    };

    const handleToggleMenu = (albumId) => {
        setShowMenu((prevMenu) => (prevMenu === albumId ? null : albumId));
    };


    const handleAlbumArtUpload = async (albumId, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`http://localhost:8080/api/album/art/${albumId}`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload album art');
            }

            // 이미지 업로드가 성공하면 응답이 필요하지 않으므로 처리하지 않음

            // Update album data with new cover URL
            setAlbums(prevAlbums =>
                prevAlbums.map(album => album.id === albumId ? {...album, cover: URL.createObjectURL(file)} : album)
            );

            // Immediately update the album art URL for the selected album
            if (selectedAlbum === albumId) {
                setAlbumArtUrl(URL.createObjectURL(file)); // Update album art URL directly
            }
        } catch (error) {
            console.error('Error uploading album art:', error);
        }
    };


    return (
        <div className="screen-container">
            <div className="library-body">
                <div className="album-header">
                    <h2 id="album-title">Album</h2>
                </div>
                <div className="create-album">
                    <input
                        type="text"
                        placeholder="Album Name"
                        value={albumName}
                        onChange={(e) => setAlbumName(e.target.value)}
                    />
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
                <div className="card-body">
                    {albums.map((album) => (
                        <div key={album.id} className="album-card-container">
                            <div className="album-card">
                                <h3 onClick={() => handleAlbumClick(album)}>{album.name}
                                    <button className='heart-button' onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(album);
                                    }}>
                                        <FaHeart color={album.favorite ? 'red' : 'gray'}/>
                                    </button>
                                    <FaRegCirclePlay className='play-button'
                                                     onClick={() => handleCreatePlaylist(album)}/>
                                </h3>
                                <img
                                    src={`http://localhost:8080/api/album/art/${album.id}` ? `http://localhost:8080/api/album/art/${album.id}` : defaultAlbumCover} // Using defaultAlbumCover as fallback
                                    className="album-cover"
                                    onClick={() => handleAlbumClick(album)}

                                />
                                <div className="album-menu2">
                                    <CiMenuKebab onClick={() => handleToggleMenu(album.id)}/>
                                    {showMenu === album.id && (
                                        <div className="menu-options">
                                            <p id="p-edit" onClick={() => setEditAlbumId(album.id)}>정보 수정</p>
                                            <p id="p-delete" onClick={() => handleDeleteAlbum(album.id)}>앨범 삭제</p>
                                        </div>
                                    )}
                                </div>

                            </div>
                            {editAlbumId === album.id && (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="New Album Name"
                                        value={editAlbumName}
                                        onChange={(e) => setEditAlbumName(e.target.value)}
                                    />
                                    <button onClick={() => handleUpdateAlbumName(album.id)}>Update</button>
                                    {/* 앨범 아트 업데이트 양식 추가 */}
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleAlbumArtUpload(album.id, e.target.files[0])}
                                        />
                                    </div>
                                </div>
                            )}
                            {selectedAlbum === album.id && (
                                <div className="album-songs">
                                    <h4 id="Songs">Songs</h4>
                                    {selectedMusics.length > 0 ? (
                                        <ul>
                                            {selectedMusics.map((musicId, index) => {
                                                const music = musicList.find((item) => item.id === musicId.id);
                                                return (
                                                    <li key={index}>
                                                        {music ? (
                                                            music.title
                                                        ) : (
                                                            <span className="no-title">No title available</span>
                                                        )}
                                                        <button
                                                            className="delete-music-button"
                                                            onClick={() => handleDeleteMusic(album.id, musicId)}
                                                        >
                                                            삭제
                                                        </button>
                                                    </li>

                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p id="no-music">No musics available</p>
                                    )}
                                    <div>
                                        <input
                                            id="song-add"
                                            type="text"
                                            placeholder="New Music Name"
                                            value={newMusicId}
                                            onChange={(e) => setNewMusicId(e.target.value)}
                                        />
                                        <button onClick={() => handleAddMusicToAlbum(album.id, newMusicId)}>
                                            Add Music
                                        </button>
                                    </div>

                                </div>
                            )}
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
}