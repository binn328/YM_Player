import React, {useState, useEffect} from 'react';
import './sidebar.css';
import SidebarButton from './sidebarButton';
import {MdFavorite} from "react-icons/md";
import {FaGripfire, FaPlay} from "react-icons/fa";
import {FaSignOutAlt} from "react-icons/fa";
import {IoLibrary} from "react-icons/io5";
import {MdSpaceDashboard} from "react-icons/md";
import {FaMusic} from "react-icons/fa6";
import { AiFillFolderAdd } from "react-icons/ai";


export default function Sidebar() {


    return (
    <div className='sidebar-container'>
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdLAY3C19kL0nV2bI_plU3_YFCtra0dpsYkg&usqp=CAU"
   className="profile-img" alt="profile" />
  <div>
  <SidebarButton title="Music" to="/music" icon={<FaMusic/>} />
    <SidebarButton title="Feed" to="/feed" icon={<MdSpaceDashboard/>} />
    <SidebarButton title="Trending" to="/trending" icon={<FaGripfire />}/>
    <SidebarButton title="Player" to="/player" icon={<FaPlay/>} />
    <SidebarButton title="Favorites" to="/favorites" icon={<MdFavorite/>} />
    <SidebarButton  title="Library" to="/" icon={<IoLibrary/>} />
    <SidebarButton title="Musicupload" to="/musicupload" icon={<AiFillFolderAdd />} />
  </div>
  <SidebarButton title="Sign Out" to="" icon={<FaSignOutAlt/>} />
  </div>
    );
}
