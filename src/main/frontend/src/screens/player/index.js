import React, {useEffect, useRef, useState} from "react";
import "./player.css";
import AudioPlayer from "../../screens/audioPlayer";
import Widgets from "../../screens/widgets";
import {useLocation} from 'react-router-dom';
import axios from 'axios';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {FaPlus} from "react-icons/fa";
import Addsong from "./addsong";

export default function Player() {
    const location = useLocation();
    const {playlistMusicDetails} = location.state || {};
    const [tracks, setTracks] = useState([]);
    const [currentTrack, setCurrentTrack] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [localPlaylistMusicDetails, setLocalPlaylistMusicDetails] = useState([]);
    const [contextMenu, setContextMenu] = useState({show: false, x: 0, y: 0, index: null});
    const [showAddSong, setShowAddSong] = useState(false);

    const audioRef = useRef(null);

    useEffect(() => {
        if (location.state) {
            axios.get("/api/music")
                .then((res) => {
                    setTracks(res.data);
                    setCurrentTrack(res.data[0]);
                })
                .catch((err) => {
                    console.error("Failed to fetch music:", err);
                });
        }
    }, [location.state]);

    useEffect(() => {
        setCurrentTrack(tracks[currentIndex]);
    }, [currentIndex, tracks]);

    useEffect(() => {
        const savedPlaylist = localStorage.getItem('playlistMusicDetails');
        if (savedPlaylist) {
            setLocalPlaylistMusicDetails(JSON.parse(savedPlaylist));
        } else if (playlistMusicDetails) {
            setLocalPlaylistMusicDetails(playlistMusicDetails);
        }
    }, [playlistMusicDetails]);

    useEffect(() => {
        localStorage.setItem('playlistMusicDetails', JSON.stringify(localPlaylistMusicDetails));
    }, [localPlaylistMusicDetails]);

    useEffect(() => {
        if (playlistMusicDetails) {
            setLocalPlaylistMusicDetails(playlistMusicDetails);
        }
    }, [playlistMusicDetails]);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const newPlaylist = Array.from(localPlaylistMusicDetails);
        const [reorderedItem] = newPlaylist.splice(result.source.index, 1);
        newPlaylist.splice(result.destination.index, 0, reorderedItem);
        setLocalPlaylistMusicDetails(newPlaylist);
    };

    const showContextMenu = (index, e) => {
        e.preventDefault();
        setContextMenu({show: true, x: e.clientX, y: e.clientY, index});
    };

    const handleContainerClick = () => {
        if (contextMenu.show) {
            setContextMenu({...contextMenu, show: false});
        }
    };

    const deleteSong = (index) => {
        const newPlaylist = localPlaylistMusicDetails.filter((_, i) => i !== index);

        if (index === currentIndex) {
            if (index === localPlaylistMusicDetails.length - 1) {
                setCurrentIndex(0);
            } else {
                setCurrentIndex(currentIndex);
            }
        } else if (index < currentIndex) {
            setCurrentIndex(currentIndex - 1);
        }

        setLocalPlaylistMusicDetails(newPlaylist);

        if (index === currentIndex) {
            if (newPlaylist.length === 0) {
                setCurrentTrack({});
                audioRef.current.pause();
            } else {
                const nextIndex = index === localPlaylistMusicDetails.length - 1 ? 0 : currentIndex;
                setCurrentIndex(nextIndex);
                setCurrentTrack(newPlaylist[nextIndex]);
            }
        }
    };

    const prioritizeSong = (index) => {
        const prioritizedSong = localPlaylistMusicDetails[index];
        const newPlaylist = [...localPlaylistMusicDetails];

        if (index !== currentIndex) {
            newPlaylist.splice(index, 1);
            newPlaylist.unshift(prioritizedSong);
            setCurrentIndex(0);
            setLocalPlaylistMusicDetails(newPlaylist);
            setCurrentTrack(prioritizedSong);
        }
    };

    const addToPlaylist = (selectedSong) => {
        setLocalPlaylistMusicDetails(prevPlaylist => [...prevPlaylist, selectedSong]);
    };

    const handleCloseAddSong = () => {
        setShowAddSong(false);
    };

    const handleOpenAddSong = () => {
        setShowAddSong(true);
    };

    return (
        <div className="screen-container flex" onClick={handleContainerClick}>
            <div className="left-player-body">
                <AudioPlayer
                    currentTrack={currentTrack}
                    total={tracks}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    playlistMusicDetails={localPlaylistMusicDetails}
                    audioRef={audioRef}
                    setPlaylistMusicDetails={setLocalPlaylistMusicDetails}
                />
                <Widgets artistID={currentTrack?.artist?.id}/>
            </div>

            <div className="right-player-body">
                <h1 className="player-h1">재생 목록</h1>
                {localPlaylistMusicDetails ? (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="playlist">
                            {(provided) => (
                                <ul ref={provided.innerRef} {...provided.droppableProps}>
                                    {localPlaylistMusicDetails.map((music, index) => (
                                        <Draggable key={music.id} draggableId={music.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    onContextMenu={(e) => showContextMenu(index, e)}
                                                >
                                                    <p className="current-playlist">{music.title}</p>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                ) : (
                    <p className="no-playlist-message">플레이리스트가 없습니다.</p>
                )}

                <div className="current-playlist-add-btn" onClick={handleOpenAddSong}>
                    <FaPlus/>
                </div>

                {contextMenu.show && (
                    <div
                        className="context-menu"
                        style={{top: contextMenu.y}}
                    >
                        <div onClick={() => prioritizeSong(contextMenu.index)}>우선 재생</div>
                        <div onClick={() => deleteSong(contextMenu.index)}>삭제</div>
                    </div>
                )}

                {showAddSong && (
                    <Addsong
                        addToPlaylist={addToPlaylist}
                        onClose={handleCloseAddSong}
                        currentPlaylist={localPlaylistMusicDetails}
                    />
                )}
            </div>
        </div>
    );
}
