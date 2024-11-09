import React, {useEffect, useRef, useState} from 'react';
import './library.css';
import {FaHeart} from "react-icons/fa";
import {AiFillCaretUp} from "react-icons/ai";
import {CiMenuKebab} from "react-icons/ci";
import MusicController from './musicController';
import PlaylistMenu from './playlistMenu';
import AlbumMenu from './albumMenu';
import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import SortMenu from './sortMenu';
import { FaMusic } from "react-icons/fa6";

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
    const [showMusicController, setShowMusicController] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true); // 펼쳐진 상태 여부를 저장
    const [sortMethod, setSortMethod] = useState(localStorage.getItem("sortMethod") || "upload");
    const [initialMusicData, setInitialMusicData] = useState([]);

    const audioRef = useRef(null);
    const menuRef = useRef(null);

   // 초기 데이터 로드 (최초 1회만)
useEffect(() => {
    const savedSortMethod = localStorage.getItem("sortMethod") || "upload";
    
    setSortMethod(savedSortMethod);
    fetchMusicData(savedSortMethod); // savedSortMethod를 전달하여 초기 정렬 상태를 반영

    fetchPlaylists();
    fetchAlbums();
}, []); // 빈 의존성 배열로 최초 1회 실행

// 오디오 종료 이벤트 관리
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

// 정렬 방식 변경 시마다 정렬 수행
useEffect(() => {
    if (initialMusicData.length > 0) { // 초기 데이터가 로드된 경우에만 정렬
        sortMusicData();
    }
}, [sortMethod]);

// fetchMusicData가 초기 정렬 상태를 반영하도록 수정
const fetchMusicData = async (initialSortMethod) => {
    try {
        const response = await fetch('http://localhost:8080/api/music');
        if (!response.ok) {
            throw new Error('Failed to fetch music data');
        }
        const data = await response.json();

        setInitialMusicData(data); // 초기 데이터를 저장

        // 가져온 데이터에 초기 정렬 방식 적용
        const sortedData = applySort(data, initialSortMethod);
        setMusicData(sortedData); // 정렬된 데이터를 설정
    } catch (error) {
        console.error("Error fetching music data:", error);
    }
};

// 정렬 적용 함수
const applySort = (data, sortMethod) => {
    let sortedData = [...data];
    if (sortMethod === "title") {
        sortedData.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    } else if (sortMethod === "favorite") {
        sortedData.sort((a, b) => (b.favorite === true) - (a.favorite === true));
    }
    return sortedData;
};

// 정렬 함수
const sortMusicData = () => {
    if (sortMethod === "upload") {
        setMusicData(initialMusicData); // 업로드순일 때 원본 데이터 유지
    } else {
        const sortedData = applySort(initialMusicData, sortMethod);
        setMusicData(sortedData);
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
            const response = await fetch('/api/album');
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
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setCurrentTrack(music);
        setSelectedMusic(music.id);
        setCurrentIndex(index);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.src = `/api/music/item/${music.id}`;
            audioRef.current.play().catch(error => {
                console.log("Playback failed due to autoplay policy:", error);
            });
        }
        setShowMusicController(true);
        setIsExpanded(true);
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
        const updatedMusicList = musicData.map(item =>
            item.id === music.id ? { ...item, favorite: !item.favorite } : item
        );
        setMusicData(updatedMusicList);

        try {
            const formData = new FormData();
            formData.append('id', music.id);
            formData.append('favorite', !music.favorite);

            const response = await fetch(`/api/music/update/${music.id}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to update favorite status');
            await response.json();
            fetchMusicData(sortMethod);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const deleteMusic = async (id) => {
        setMusicData(musicData.filter(music => music.id !== id));

        try {
            const response = await fetch(`/api/music/delete/${id}`, {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Failed to delete music');
            fetchMusicData();
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

            const response = await fetch(`/api/playlist/update`, {
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

            const response = await fetch(`/api/album/update`, {
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

    const closeMenu = () => {
        setShowMenu({});
        setOpenedMenuIndex(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    
    
    
/*
    const handleSortMethodChange = (method) => {
        setSortMethod(method);
        localStorage.setItem("sortMethod", method);
    
        if (method === "latest") {
            fetchMusicData(); // 최신순 선택 시 서버에서 다시 데이터 가져오기
        } else {
            sortMusicData(); // 다른 정렬 방식일 경우 클라이언트에서 정렬 수행
        }
    };    */

    const handleSortMethodChange = (method) => {
        setSortMethod(method);
        localStorage.setItem("sortMethod", method);
        sortMusicData(); // 업로드순, 최신순, 하트순 모두 여기서 처리
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
        const {name, value} = e.target;
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

            const response = await fetch(`/api/music/update/${editingMusic.id}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Failed to update music info');
            }

            const updatedMusicData = await response.json();
            setMusicData(musicData.map(item => (item.id === editingMusic.id ? updatedMusicData : item)));
            closeEditMenu();
        } catch (error) {
            console.error('Error updating music info:', error);
        }
    };

    /*const toggleMusicController = () => {
        setShowMusicController(!showMusicController);
    };*/
/*
    const toggleMusicController = () => {
        if (!showMusicController) {
            setShowMusicController(true);
        } else {
            setIsExpanded(prev => !prev); // showMusicController가 true일 때만 isExpanded 토글
        }
    };    */
    const toggleMusicController = () => {
        setIsExpanded(!isExpanded);  // 토글 버튼 클릭 시 상태 전환
      };

    const toggleController = () => {
        setIsExpanded((prev) => !prev);
    };

    const checkIfTruncated = (element) => {
        return element.scrollWidth > element.clientWidth;
    };

    const downloadMusic = async (music) => {
        try {
            const response = await fetch(`/api/music/item/${music.id}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Failed to download music');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${music.title}.mp3`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading music:', error);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="screen-container">
            <div className='playlist-list'>
                <div className='library-header'>
                    <h2>Library</h2>
                    <SortMenu setSortMethod={setSortMethod} />
                </div>
                <div className="library-card">
                    {musicData.map((music, index) => (
                        <div key={music.id || index} className="music-card" onClick={() => playMusic(music, index)}>
                            <div className="music-card-top">
                                <div className="music-image">
                                    <FaMusic className="music-icon" />
                                </div>
                                <button className="menu-button" onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMenu(index);
                                }}>
                                    <CiMenuKebab />
                                </button>
                            </div>
                            <div className="music-info">
                                <div className="music-title-container">
                                    <div className="music-title" ref={el => {
                                        if (el) {
                                            if (checkIfTruncated(el)) {
                                                el.classList.add('truncated');
                                            } else {
                                                el.classList.remove('truncated');
                                            }
                                        }
                                    }}>
                                        {music.title}
                                    </div>
                                    <button className='heart-button' onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(music);
                                    }}>
                                        <FaHeart color={music.favorite ? 'red' : 'gray'}/>
                                    </button>
                                </div>
                                <p className="artist">by {music.artist}</p>
                                {showMenu[index] && (
                                    <div className="menu" ref={menuRef}>
                                        <p onClick={(e) => {
                                            e.stopPropagation();
                                            openPlaylistMenu(music);
                                        }}>플레이리스트에 추가</p>
                                        <p onClick={(e) => {
                                            e.stopPropagation();
                                            openAlbumMenu(music);
                                        }}>앨범에 추가</p>
                                        <p onClick={(e) => {
                                            e.stopPropagation();
                                            openEditMenu(music);
                                            toggleMenu(index);
                                        }}>정보 수정</p>
                                        <p onClick={(e) => {
                                            e.stopPropagation();
                                            downloadMusic(music);
                                        }}>다운로드</p>
                                        <p onClick={(e) => {
                                            e.stopPropagation();
                                            deleteMusic(music.id);
                                        }}>삭제</p>
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
    
            {showMusicController && (
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
                    toggleMusicController={toggleMusicController}
                    isExpanded={isExpanded}
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