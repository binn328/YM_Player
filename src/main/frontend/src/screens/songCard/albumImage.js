// albumInfo.js
import React from "react";
import "./albumImage.css";
import "./albumInfo.css";

export default function AlbumImage({url}) {
    return (
        <div className="albumImage flex">
            <img src={url} alt="album art" className="albumImage-art"/>
            <div className="albumImage-shadow">
                <img src={url} alt="shadow" className="albumImage-shadow"/>
            </div>
        </div>
    );
}

export default function AlbumInfo({album}) {
    const artists = [];
    album?.artists?.forEach((element) => {
        artists.push(element.name);
    });

    return (
        <div className="albumInfo-card">
            <div className="albumName-container">
                <div className="marquee">
                    <p>{album?.name + " - " + artists?.join(", ")}</p>
                </div>
            </div>
            <div className="album-info">
                <p>{`${album?.name} is an ${album?.album_type} by ${artists?.join(
                    ", "
                )} with ${album?.total_tracks} track(s)`}</p>
            </div>
            <div className="album-release">
                <p>Release Date: {album?.release_date}</p>
            </div>
        </div>
    );
}