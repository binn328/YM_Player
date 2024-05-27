import React, { useState, useEffect } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";
import "./album.css";

const defaultAlbumCover = "https://ibb.co/pLzFy1z";
const SERVER_URL = "http://localhost:8080";

export default function Album() {

    const [albums, setAlbums] = useState([]);
    const [albumName, setAlbumName] = useState("");
    const [albumCover, setAlbumCover] = useState("");
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
                        const newMusicIds = musicList.map(({ id }) => id).filter(id => !existingMusicIds.has(id));
                        const updatedMusics = [...existingAlbum.musics, ...newMusicIds];
                        const updatedAlbumData = { ...existingAlbum, musics: updatedMusics };

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
                            musics: musicList.map(({ id }) => id),
                        };

                        const formData = new FormData();
                        formData.append('name', newAlbum.name);
                        formData.append('favorite', 'false');
                        formData.append('cover', newAlbum.cover);
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

                        const data = await response.json();
                        setAlbums((prevAlbums) => [...prevAlbums, data]);

                        // 이미지 다운로드 및 업로드
                        await fetchAndUploadAlbumCover(data.id);
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
            formData.append('cover', albumCover || defaultAlbumCover);
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
            setAlbumCover("");
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

            const updatedAlbumData = { ...albumData, musics: updatedMusics };
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

    const handleAddMusicToAlbum = async (albumId, musicId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/album/${albumId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch album details');
            }
            const albumData = await response.json();

            const updatedMusics = [...albumData.musics, musicId];

            const updatedAlbumData = { ...albumData, musics: updatedMusics };
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
            setSelectedMusics(updatedAlbum.musics);
            setAlbums(prevAlbums => prevAlbums.map(album => album.id === albumId ? updatedAlbum : album));
        } catch (error) {
            console.error('Error adding music to album:', error);
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

            const updatedAlbum = await response.json();

            // Update album data with new cover URL
            setAlbums(prevAlbums =>
                prevAlbums.map(album => album.id === albumId ? {...album, cover: updatedAlbum.cover} : album)
            );

            // Immediately update the album art URL for the selected album
            if (selectedAlbum === albumId) {
                setAlbumArtUrl(updatedAlbum.cover); // Update album art URL directly
            }
        } catch (error) {
            console.error('Error uploading album art:', error);
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
                    <div key={album.id} className="album-card-container">
                        <div className="album-card">
                            <h3 onClick={() => handleAlbumClick(album)}>{album.name}
                                <button className='heart-button' onClick={(e) => {
                                    e.stopPropagation(); toggleFavorite(album); }}>
                                    <FaHeart color={album.favorite ? 'red' : 'gray'} />
                                </button>
                                <FaRegCirclePlay className='play-button' onClick={() => handleCreatePlaylist(album)} />
                            </h3>
                            <img
                                src={`http://localhost:8080/api/album/art/${album.id}`}
                                alt={album.name}
                                className="album-cover"
                                onClick={() => handleAlbumClick(album)}

                            />
                            <div className="album-menu">
                                <CiMenuKebab onClick={() => setShowMenu(album.id)} />
                                {showMenu === album.id && (
                                    <div className="menu-options">
                                        <p onClick={() => setEditAlbumId(album.id)}>정보 수정</p>
                                        <p onClick={() => handleDeleteAlbum(album.id)}>앨범 삭제</p>
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
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleAlbumArtUpload(album.id, e.target.files[0])}
                                />

                            </div>
                        )}
                        {selectedAlbum === album.id && (
                            <div className="album-songs">
                                <h4>Songs</h4>
                                {selectedMusics.length > 0 ? (
                                    <ul>
                                        {selectedMusics.map((musicId, index) => {
                                            const music = musicList.find((item) => item.id === musicId.id);
                                            return (
                                                <li key={index}>
                                                    {music ? music.title : 'No title available'}
                                                    <button
                                                        className="delete-music-button"
                                                        onClick={() => handleDeleteMusic(album.id,musicId)}
                                                    >
                                                        삭제
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p>No musics available</p>
                                )}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="New Music ID"
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
    );
}