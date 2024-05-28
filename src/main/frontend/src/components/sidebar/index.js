/*
import React, { useState } from 'react';
import './sidebar.css';
import SidebarButton from './sidebarButton';
import { FaGripfire, FaPlay } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { PiQueueBold } from "react-icons/pi";
import { FaList } from "react-icons/fa";
import { AiFillFolderAdd } from "react-icons/ai";
import Modal from './modal'; // 모달 컴포넌트 import
import profile from '../../blank-profile.png';

export default function Sidebar() {
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    const [currentImage, setCurrentImage] = useState(null); // 현재 이미지 상태 관리

    const handleImageClick = () => {
        setIsModalOpen(true); // 이미지 클릭 시 모달 열기
    };

    return (
        <div className='sidebar-container'>
            
            <img
                src={currentImage ? currentImage : profile}
                className="profile-img"
                alt="profile"
                onClick={handleImageClick} 
            />
            <div>
                
                <SidebarButton title="Trending" to="/trending" icon={<FaGripfire />} />
                <SidebarButton title="Player" to="/player" icon={<FaPlay />} />
                <SidebarButton title="playlist" to="/playlist" icon={<FaList />} />
                <SidebarButton title="Library" to="/library" icon={<IoLibrary />} />
                <SidebarButton title="Album" to="/album" icon= {<PiQueueBold />} />
                <SidebarButton title="Musicupload" to="/musicupload" icon={<AiFillFolderAdd />} />
            </div>
            
            <SidebarButton title="Home" to="" icon={<FaSignOutAlt />} />
            
           
            {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} setCurrentImage={setCurrentImage} />}
        </div>
    );
}

*/

import React, { useState, useEffect } from 'react';
import './sidebar.css';
import SidebarButton from './sidebarButton';
import { FaGripfire, FaPlay } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { PiQueueBold } from "react-icons/pi";
import { FaList } from "react-icons/fa";
import { AiFillFolderAdd } from "react-icons/ai";
import Modal from './modal'; // 모달 컴포넌트 import
import profile from '../../blank-profile.png';

export default function Sidebar() {
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    const [currentImage, setCurrentImage] = useState(null); // 현재 이미지 상태 관리

    useEffect(() => {
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            setCurrentImage(savedImage);
        }
    }, []);

    const handleImageClick = () => {
        setIsModalOpen(true); // 이미지 클릭 시 모달 열기
    };

    return (
        <div className='sidebar-container'>
            <img
                src={currentImage ? currentImage : profile}
                className="profile-img"
                alt="profile"
                onClick={handleImageClick}
            />
            <div>
                <SidebarButton title="Trending" to="/trending" icon={<FaGripfire />} />
                <SidebarButton title="Player" to="/player" icon={<FaPlay />} />
                <SidebarButton title="playlist" to="/playlist" icon={<FaList />} />
                <SidebarButton title="Library" to="/library" icon={<IoLibrary />} />
                <SidebarButton title="Album" to="/album" icon={<PiQueueBold />} />
                <SidebarButton title="Musicupload" to="/musicupload" icon={<AiFillFolderAdd />} />
            </div>
            <SidebarButton title="Home" to="" icon={<FaSignOutAlt />} />
            {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} setCurrentImage={setCurrentImage} />}
        </div>
    );
}
