package com.binn328.ymplayerremake.Entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
public class PlaylistMusic {
    @EmbeddedId
    private PlaylistMusicId id;

    @ManyToOne
    @MapsId("playlistId")
    @JoinColumn(name = "playlist_id")
    private Playlist playlist;

    @ManyToOne
    @MapsId("musicId")
    @JoinColumn(name = "music_id")
    private Music music;
}

@Embeddable
class PlaylistMusicId implements Serializable {
    private UUID playlistId;
    private UUID musicId;
}
