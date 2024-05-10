/*import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Library from '../library';
import Trending from "../trending";
import Player from "../player";
import Favorites from "../favorites";
import Music from "../queue";
import './home.css'
import Sidebar from "../../components/sidebar";
import Musicupload from "../musicupload";


export default function Home(){
  return ( 
<div>
    <BrowserRouter>
      <div className="main-body">
        
        <Sidebar/>
        <Routes>
        
            <Route path="/" element={<Library />} />
            
            <Route path="/trending" element={<Trending />} />
            <Route path="/player" element={<Player />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/music" element={<Music />} />
            <Route path="musicupload" element={<Musicupload />} />
            
  </Routes>
      </div>
      
    </BrowserRouter>
    </div>
  );

}*/

import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Library from '../library';
import Trending from "../trending";
import Player from "../player";
import Playlist from "../playlist";
import Favorites from "../favorites";
import Music from "../queue";
import Queue from "../queue";
import Album from "../album";
import './home.css'
import Sidebar from "../../components/sidebar";
import Musicupload from "../musicupload";
import Logo from '../logo';


export default function Home(){
  return ( 
<div>
    <BrowserRouter>
      <div className="main-body">
        
        <Sidebar/>
        <Routes>
          <Route path="/" element={ <Logo />} />
        
            <Route path="/library" element={<Library />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/player" element={<Player />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/music" element={<Music />} />
            
            <Route path ="/album" element={<Album/>} />
            <Route path="/musicupload" element={<Musicupload />} />
            
  </Routes>
      </div>
      
    </BrowserRouter>
    </div>
  );

}

