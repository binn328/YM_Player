
import React, { useState } from 'react';
import './sidebar.css';
import SidebarButton from './sidebarButton';
import { MdFavorite } from "react-icons/md";
import { FaGripfire, FaPlay } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { PiQueueBold } from "react-icons/pi";
import { FaList } from "react-icons/fa";

import { FaMusic } from "react-icons/fa6";
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
            {/* 프로필 이미지 */}
            <img
                src={currentImage ? currentImage : profile}
                className="profile-img"
                alt="profile"
                onClick={handleImageClick} // 이미지 클릭 시 모달 열기
            />
            <div>
                {/* 사이드바 버튼들 */}
                <SidebarButton title="Music" to="/music" icon={<FaMusic />} />
                <SidebarButton title="Trending" to="/trending" icon={<FaGripfire />} />
                <SidebarButton title="Player" to="/player" icon={<FaPlay />} />
                <SidebarButton title="playlist" to="/playlist" icon={<FaList />} />
                <SidebarButton title="Favorites" to="/favorites" icon={<MdFavorite />} />
                <SidebarButton title="Library" to="/library" icon={<IoLibrary />} />
                <SidebarButton title="Queue" to="/queue" icon= {<PiQueueBold />} />
                <SidebarButton title="Musicupload" to="/musicupload" icon={<AiFillFolderAdd />} />
            </div>
            {/* 로그아웃 버튼 */}
            <SidebarButton title="Home" to="" icon={<FaSignOutAlt />} />
            
            {/* 모달 */}
            {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} setCurrentImage={setCurrentImage} />}
        </div>
    );
}

