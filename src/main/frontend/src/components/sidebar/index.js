/*import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isSidebarOpen && !event.target.closest('.sidebar-container') && !event.target.closest('.hamburger-icon')) {
                setIsSidebarOpen(false); // 사이드바가 열려 있고, 사이드바 외부 클릭 시 닫기
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick); // 컴포넌트 언마운트 시 이벤트 리스너 제거
        };
    }, [isSidebarOpen]);

    return (
        <div className="sidebar-wrapper">
           
            <GiHamburgerMenu className="hamburger-icon" onClick={toggleSidebar} />
           
            <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
                <img
                    src={currentImage ? currentImage : profile}
                    className="profile-img"
                    alt="profile"
                    onClick={handleImageClick}
                />
                <div className="sidebar-content">
                    <SidebarButton title="Trending" to="/trending" icon={<FaGripfire />}  />
                    <SidebarButton title="Player" to="/player" icon={<FaPlay />}  />
                    <SidebarButton title="Playlist" to="/playlist" icon={<FaList />}  />
                    <SidebarButton title="Library" to="/library" icon={<IoLibrary />}  />
                    <SidebarButton title="Album" to="/album" icon={<PiQueueBold />}  />
                    <SidebarButton title="Music Upload" to="/musicupload" icon={<AiFillFolderAdd />}  />
                </div>
                <SidebarButton title="Home" to="/" icon={<FaSignOutAlt />} />
                {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} setCurrentImage={setCurrentImage} />}
            </div>
        </div>
    );
}
*/


import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './sidebar.css';
import SidebarButton from './sidebarButton';
import { FaGripfire, FaList, FaPlay, FaSignOutAlt } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { PiQueueBold } from "react-icons/pi";
import { AiFillFolderAdd } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import Modal from './modal';
import profile from '../../blank-profile.png';

export default function Sidebar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const location = useLocation();

    useEffect(() => {
        // 페이지 경로가 바뀔 때마다 사이드바를 닫음
        setIsSidebarOpen(false);
    }, [location]);

    useEffect(() => {
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            setCurrentImage(savedImage);
        }
    }, []);

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (event) => {
        // 사이드바 외부를 클릭했는지 확인
        if (isSidebarOpen && !event.target.closest('.sidebar-container') && !event.target.closest('.hamburger-icon')) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        // 사이드바 외부 클릭 감지 리스너 추가
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // 컴포넌트 언마운트 시 리스너 제거
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarOpen]);

    return (
        <div className="sidebar-wrapper">
            <GiHamburgerMenu className="hamburger-icon" onClick={toggleSidebar} />
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
