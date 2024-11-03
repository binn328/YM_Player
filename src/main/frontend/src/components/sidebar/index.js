import React, { useEffect, useState } from 'react';
import './sidebar.css';
import SidebarButton from './sidebarButton';
import { FaGripfire, FaList, FaPlay, FaSignOutAlt } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { PiQueueBold } from "react-icons/pi";
import { AiFillFolderAdd } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi"; // 햄버거 메뉴 아이콘 import
import Modal from './modal'; // 모달 컴포넌트 import
import profile from '../../blank-profile.png';

export default function Sidebar() {
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    const [currentImage, setCurrentImage] = useState(null); // 현재 이미지 상태 관리
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 열림/닫힘 상태

    useEffect(() => {
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            setCurrentImage(savedImage);
        }
    }, []);

    const handleImageClick = () => {
        setIsModalOpen(true); // 이미지 클릭 시 모달 열기
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // 아이콘 클릭 시 사이드바 열기/닫기
    };

    return (
        <div className="sidebar-wrapper">
            {/* 햄버거 메뉴 아이콘 */}
            <GiHamburgerMenu className="hamburger-icon" onClick={toggleSidebar} />
            {/* 사이드바 */}
            <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
                <img
                    src={currentImage ? currentImage : profile}
                    className="profile-img"
                    alt="profile"
                    onClick={handleImageClick}
                />
                <div className="sidebar-content">
                    <SidebarButton title="Trending" to="/trending" icon={<FaGripfire />} />
                    <SidebarButton title="Player" to="/player" icon={<FaPlay />} />
                    <SidebarButton title="Playlist" to="/playlist" icon={<FaList />} />
                    <SidebarButton title="Library" to="/library" icon={<IoLibrary />} />
                    <SidebarButton title="Album" to="/album" icon={<PiQueueBold />} />
                    <SidebarButton title="Music Upload" to="/musicupload" icon={<AiFillFolderAdd />} />
                </div>
                <SidebarButton title="Home" to="/" icon={<FaSignOutAlt />} />
                {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} setCurrentImage={setCurrentImage} />}
            </div>
        </div>
    );
}
