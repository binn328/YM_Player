

//import React, {useState, useEffect} from "react";

import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Library from '../library';
import Trending from "../trending";
import Player from "../player";
import Favorites from "../favorites";
import Music from "../queue";
import './home.css'
import Sidebar from "../../components/sidebar";
import Musicupload from "../musicupload";

//import { setClientToken } from "../../spotify";
//import axios from "axios";

export default function Home(){
 /* const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("/api/check-login-status");
        setIsLoggedIn(response.data.loggedIn);
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }*/



  return ( 
<div>
 {/* <Login />*/}
    
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


}
