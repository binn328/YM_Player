import React, {useEffect, useState} from 'react';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import './playlistModal.css';

const ItemTypes = {
    MUSIC: 'music'
};

const MusicItem = ({music, index, moveMusic, findMusic, onContextMenu}) => {
    const originalIndex = findMusic(music.id).index;

    const [{isDragging}, drag] = useDrag(
        () => ({
            type: ItemTypes.MUSIC,
            item: {id: music.id, originalIndex},
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
            end: (item, monitor) => {
                const {id: droppedId, originalIndex} = item;
                const didDrop = monitor.didDrop();
                if (!didDrop) {
                    moveMusic(droppedId, originalIndex);
                }
            },
        }),
        [music.id, originalIndex, moveMusic]
    );

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.MUSIC,
            hover({id: draggedId}) {
                if (draggedId !== music.id) {
                    const {index: overIndex} = findMusic(music.id);
                    moveMusic(draggedId, overIndex);
                }
            },
        }),
        [findMusic, moveMusic]
    );

    const opacity = isDragging ? 0.5 : 1;

    return (
        <li ref={(node) => drag(drop(node))} style={{opacity}} onContextMenu={(e) => onContextMenu(music.id, e)}>
            {/*{music.title} - 순서: {index + 1}*/}
            {music.title}
        </li>
    );
};

const PlaylistModal = ({isOpen, toggleModal, playlistId, playlistURL, serverURL}) => {
    const [playlist, setPlaylist] = useState(null);
    const [musicList, setMusicList] = useState([]);
    const [contextMenu, setContextMenu] = useState({show: false, x: 0, y: 0, musicId: null});

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                if (!isOpen || !playlistId) return;

                const response = await fetch(`${playlistURL}/${playlistId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const playlistData = await response.json();
                setPlaylist(playlistData);
                console.log('플레이리스트 데이터:', playlistData);
            } catch (error) {
                console.error('플레이리스트 정보 가져오기 오류:', error);
            }
        };

        fetchPlaylist();
    }, [isOpen, playlistId, playlistURL]);

    useEffect(() => {
        const fetchMusicList = async () => {
            try {
                const response = await fetch(`${serverURL}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const musicData = await response.json();
                setMusicList(musicData);
                console.log('음악 목록 데이터:', musicData);
            } catch (error) {
                console.error('음악 목록 가져오기 오류:', error);
            }
        };

        fetchMusicList();
    }, [serverURL]);

    const handleAddMusicToPlaylist = async (musicId) => {
        try {
            if (!playlist) return;

            if (playlist.musics.some((music) => music.id === musicId)) {
                alert('이미 추가된 음악입니다.');
                return;
            }

            const newOrder = playlist.musics.length + 1;
            const updatedMusics = [
                ...playlist.musics,
                {id: musicId, order: newOrder}
            ];

            const updatedPlaylist = {
                ...playlist,
                musics: updatedMusics
            };

            const response = await fetch(`${playlistURL}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPlaylist)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const updatedPlaylistData = await response.json();
            setPlaylist(updatedPlaylistData);
            console.log('업데이트된 플레이리스트 데이터:', updatedPlaylistData);
        } catch (error) {
            console.error('음악 추가 오류:', error);
        }
    };

    const handleRemoveMusicFromPlaylist = async (musicId) => {
        try {
            if (!playlist) return;

            const updatedMusics = playlist.musics
                .filter((music) => music.id !== musicId)
                .map((music, index) => ({...music, order: index + 1}));

            const updatedPlaylist = {
                ...playlist,
                musics: updatedMusics
            };

            const response = await fetch(`${playlistURL}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPlaylist)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const updatedPlaylistData = await response.json();
            setPlaylist(updatedPlaylistData);
            console.log('업데이트된 플레이리스트 데이터:', updatedPlaylistData);
        } catch (error) {
            console.error('음악 삭제 오류:', error);
        }
    };

    const moveMusic = (id, toIndex) => {
        const {music, index} = findMusic(id);
        const updatedMusics = [...playlist.musics];
        updatedMusics.splice(index, 1);
        updatedMusics.splice(toIndex, 0, music);
        setPlaylist({...playlist, musics: updatedMusics});
        saveOrderToDB(updatedMusics);
    };

    const saveOrderToDB = async (updatedMusics) => {
        try {
            const updatedPlaylist = {
                ...playlist,
                musics: updatedMusics.map((music, index) => ({...music, order: index + 1}))
            };

            const response = await fetch(`${playlistURL}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPlaylist)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const updatedPlaylistData = await response.json();
            setPlaylist(updatedPlaylistData);
            console.log('업데이트된 플레이리스트 데이터:', updatedPlaylistData);
        } catch (error) {
            console.error('순서 저장 오류:', error);
        }
    };

    const findMusic = (id) => {
        const music = playlist.musics.find((m) => m.id === id);
        return {
            music,
            index: playlist.musics.indexOf(music)
        };
    };

    const showContextMenu = (musicId, e) => {
        e.preventDefault();
        setContextMenu({show: true, x: e.clientX, y: e.clientY, musicId});
    };

    const hideContextMenu = () => {
        setContextMenu({show: false, x: 0, y: 0, musicId: null});
    };

    return (
        isOpen && playlist && (
            <DndProvider backend={HTML5Backend}>
                <div className="playlist-modal" onClick={hideContextMenu}>
                    <div className='current-playlist'>
                        <h2 title="현재 플레이리스트">{playlist.name}</h2>
                        <p>곡 목록</p>
                        <ul>
                            {playlist.musics.map((music, index) => {
                                const musicInfo = musicList.find((item) => item.id === music.id);
                                return (
                                    <MusicItem
                                        key={music.id}
                                        index={index}
                                        onContextMenu={showContextMenu}
                                        music={{...music, title: musicInfo ? musicInfo.title : '음악 이름 없음'}}
                                        moveMusic={moveMusic}
                                        findMusic={findMusic}
                                    />
                                );
                            })}
                        </ul>

                    </div>
                    <div className="music-list">
                        <h2 title="음악을 클릭하면 현재 플레이리스트에 노래를 추가할 수 있습니다.">전체 음악 목록</h2>
                        <ul>
                            {musicList.map((music) => (
                                <li key={music.id} onClick={() => handleAddMusicToPlaylist(music.id)}>
                                    {music.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {contextMenu.show && (
                        <div
                            className="context-menu"
                            style={{top: contextMenu.y, left: contextMenu.x}}
                        >
                            <div
                                onClick={() => handleRemoveMusicFromPlaylist(contextMenu.musicId)}>삭제
                            </div>
                        </div>
                    )}

                    <button
                        onClick={toggleModal}
                        title="닫기">
                        X
                    </button>
                </div>
            </DndProvider>
        )
    );
};

export default PlaylistModal;
