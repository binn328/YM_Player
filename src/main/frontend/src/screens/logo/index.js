import React from 'react';
import {Link} from 'react-router-dom';
import {BiLogoRedux} from "react-icons/bi";
import './logo.css';

export default function App() {
    return (
        <div className="app-container">
            <div className="ym-player">
                <h1><BiLogoRedux/> ym-player</h1>

                <Link to="/library">
                    <button className="start-button">Start</button>
                </Link>
            </div>
        </div>
    );
}
