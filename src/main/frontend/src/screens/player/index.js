
/*

import React, { useEffect, useState } from "react";
import "./player.css";
import AudioPlayer from "../../screens/audioPlayer"; 
import Widgets from "../../screens/widgets";
import { useLocation } from 'react-router-dom';
import axios from 'axios'; 
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Player() {
  const location = useLocation();
  const { playlistMusicDetails } = location.state || {};
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localPlaylistMusicDetails, setLocalPlaylistMusicDetails] = useState([]);

  useEffect(() => {
    if (location.state) {
      axios.get("http://localhost:8080/api/music")
        .then((res) => {
          setTracks(res.data);
          setCurrentTrack(res.data[0]); // 처음 음악을 현재 트랙으로 설정
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
    setLocalPlaylistMusicDetails(playlistMusicDetails);
  }, [playlistMusicDetails]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newPlaylist = Array.from(localPlaylistMusicDetails);
    const [reorderedItem] = newPlaylist.splice(result.source.index, 1);
    newPlaylist.splice(result.destination.index, 0, reorderedItem);
    setLocalPlaylistMusicDetails(newPlaylist);
  };

  return (
    <div className="screen-container flex">
      <div className="left-player-body">
        <AudioPlayer
          currentTrack={currentTrack}
          total={tracks}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          playlistMusicDetails={localPlaylistMusicDetails} 
        />
        <Widgets artistID={currentTrack?.artist?.id} /> 
      </div>

      <div className="right-player-body">
        <h1 className="player-h1">재생 목록</h1>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="playlist">
            {(provided) => (
              <ul className="current-playlist" ref={provided.innerRef} {...provided.droppableProps}>
                {localPlaylistMusicDetails && localPlaylistMusicDetails.map((music, index) => (
                  <Draggable key={music.id} draggableId={music.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <p>{music.title}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
*/



/*
import React, { useEffect, useState } from "react";
import "./player.css";
import AudioPlayer from "../../screens/audioPlayer"; 
import Widgets from "../../screens/widgets";
import { useLocation } from 'react-router-dom';
import axios from 'axios'; 
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Player() {
  const location = useLocation();
  const { playlistMusicDetails } = location.state || {};
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localPlaylistMusicDetails, setLocalPlaylistMusicDetails] = useState([]);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, index: null });

  useEffect(() => {
    if (location.state) {
      axios.get("http://localhost:8080/api/music")
        .then((res) => {
          setTracks(res.data);
          setCurrentTrack(res.data[0]); // 처음 음악을 현재 트랙으로 설정
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
    setLocalPlaylistMusicDetails(playlistMusicDetails);
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
    setContextMenu({ show: true, x: e.clientX, y: e.clientY, index });
  };

  const hideContextMenu = () => {
    setContextMenu({ ...contextMenu, show: false });
  };


  const deleteSong = (index) => {
    const newPlaylist = localPlaylistMusicDetails.filter((_, i) => i !== index);
    setLocalPlaylistMusicDetails(newPlaylist);
    
  };

  return (
    <div className="screen-container flex" onClick={hideContextMenu}>
      <div className="left-player-body">
        <AudioPlayer
          currentTrack={currentTrack}
          total={tracks}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          playlistMusicDetails={localPlaylistMusicDetails} 
        />
        <Widgets artistID={currentTrack?.artist?.id} /> 
      </div>

      <div className="right-player-body">
        <h1 className="player-h1">재생 목록</h1>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="playlist">
            {(provided) => (
              <ul className="current-playlist" ref={provided.innerRef} {...provided.droppableProps}>
                {localPlaylistMusicDetails && localPlaylistMusicDetails.map((music, index) => (
                  <Draggable key={music.id} draggableId={music.id} index={index}>
                    {(provided) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                        {...provided.dragHandleProps}
                        onContextMenu={(e) => showContextMenu(index, e)}
                      >
                        <p>{music.title}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        
        {contextMenu.show && (
            <div
                className="context-menu"
                style={{ top: contextMenu.y, left: contextMenu.x }}
            >

              <div>우선 재생</div>
              
              <div onClick={() => deleteSong(contextMenu.index)}>삭제</div>

            </div>
        )}

      </div>
    </div>
  );
}
*/




/*

import React, { useEffect, useState } from "react";
import "./player.css";
import AudioPlayer from "../../screens/audioPlayer";
import Widgets from "../../screens/widgets";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Player() {
  const location = useLocation();
  const { playlistMusicDetails } = location.state || {};
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localPlaylistMusicDetails, setLocalPlaylistMusicDetails] = useState([]);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, index: null });

  useEffect(() => {
    if (location.state) {
      axios.get("http://localhost:8080/api/music")
        .then((res) => {
          setTracks(res.data);
          setCurrentTrack(res.data[0]); // 처음 음악을 현재 트랙으로 설정
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
    setLocalPlaylistMusicDetails(playlistMusicDetails);
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
    setContextMenu({ show: true, x: e.clientX, y: e.clientY, index });
  };


  const handleContainerClick = () => {
    if (contextMenu.show) {
      setContextMenu({ ...contextMenu, show: false });
    }
  };

  const deleteSong = (index) => {
    const newPlaylist = localPlaylistMusicDetails.filter((_, i) => i !== index);
     // 현재 재생 중인 노래를 삭제한 경우
     if (index === currentIndex) {
      
      if (index === localPlaylistMusicDetails.length) {
        setCurrentIndex(0); 
      } else {
        setCurrentIndex(currentIndex); 
      }
    } else if (index < currentIndex) {  
      setCurrentIndex(currentIndex - 1); 
    }
    
    setLocalPlaylistMusicDetails(newPlaylist);

    
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
        />
        <Widgets artistID={currentTrack?.artist?.id} /> 
      </div>

      <div className="right-player-body">
        <h1 className="player-h1">재생 목록</h1>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="playlist">
            {(provided) => (
              <ul className="current-playlist" ref={provided.innerRef} {...provided.droppableProps}>
                {localPlaylistMusicDetails && localPlaylistMusicDetails.map((music, index) => (
                  <Draggable key={music.id} draggableId={music.id} index={index}>
                    {(provided) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                        {...provided.dragHandleProps}
                        onContextMenu={(e) => showContextMenu(index, e)}
                      >
                        <p>{music.title}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        
        {contextMenu.show && (
            <div
                className="context-menu"
                style={{ top: contextMenu.y }}
            >
              <div >우선 재생</div>
              <div onClick={() => deleteSong(contextMenu.index)}>삭제</div>
            </div>
        )}
      </div>
    </div>
  );
}
*/

import React, { useEffect, useState, useRef } from "react"; // Import useRef
import "./player.css";
import AudioPlayer from "../../screens/audioPlayer";
import Widgets from "../../screens/widgets";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Player() {
  const location = useLocation();
  const { playlistMusicDetails } = location.state || {};
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localPlaylistMusicDetails, setLocalPlaylistMusicDetails] = useState([]);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, index: null });

  const audioRef = useRef(null); // Define audioRef

  useEffect(() => {
    if (location.state) {
      axios.get("http://localhost:8080/api/music")
        .then((res) => {
          setTracks(res.data);
          setCurrentTrack(res.data[0]); // 처음 음악을 현재 트랙으로 설정
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
    setLocalPlaylistMusicDetails(playlistMusicDetails);
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
    setContextMenu({ show: true, x: e.clientX, y: e.clientY, index });
  };

  const handleContainerClick = () => {
    if (contextMenu.show) {
      setContextMenu({ ...contextMenu, show: false });
    }
  };

  const deleteSong = (index) => {
    const newPlaylist = localPlaylistMusicDetails.filter((_, i) => i !== index);

    if (index === currentIndex) {
      if (index === localPlaylistMusicDetails.length) {
        setCurrentIndex(0); 
      } else {
        setCurrentIndex(currentIndex); 
      }
    } else if (index < currentIndex) {  
      setCurrentIndex(currentIndex - 1); 
    }
    
    setLocalPlaylistMusicDetails(newPlaylist);
  };

  const prioritizeSong = (index) => {
    const prioritizedSong = localPlaylistMusicDetails[index];
    const newPlaylist = [...localPlaylistMusicDetails];
    
    // 해당 음악이 현재 플레이 중인 음악이 아닌 경우에만 업데이트
    if (index !== currentIndex) {
      newPlaylist.splice(index, 1); // 우선 재생된 음악을 재생 목록에서 삭제
      newPlaylist.unshift(prioritizedSong); // 우선 재생된 음악을 재생 목록의 첫 번째로 추가
      setCurrentIndex(0); // 현재 트랙을 첫 번째로 설정
      setLocalPlaylistMusicDetails(newPlaylist); // 재생 목록 업데이트
      setCurrentTrack(prioritizedSong); // 현재 트랙 업데이트
    }
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
        <Widgets artistID={currentTrack?.artist?.id} /> 
      </div>

      <div className="right-player-body">
        <h1 className="player-h1">재생 목록</h1>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="playlist">
            {(provided) => (
              <ul  ref={provided.innerRef} {...provided.droppableProps}>
                {localPlaylistMusicDetails && localPlaylistMusicDetails.map((music, index) => (
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
        
        {contextMenu.show && (
            <div
                className="context-menu"
                style={{ top: contextMenu.y }}
            >
              <div onClick={() => prioritizeSong(contextMenu.index)}>우선 재생</div>
              <div onClick={() => deleteSong(contextMenu.index)}>삭제</div>
            </div>
        )}
      </div>
    </div>
  );
}
