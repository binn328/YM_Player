package com.binn328.ymplayerremake.Entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Getter
public class AlbumMusic {
    @EmbeddedId
    private AlbumMusicId id;

    @ManyToOne
    @MapsId("albumId")
    @JoinColumn(name = "album_id")
    private Album album;

    @ManyToOne
    @MapsId("musicId")
    @JoinColumn(name = "music_id")
    private Music music;

    private int trackNumber;
}

@Embeddable
class AlbumMusicId implements Serializable {
    private UUID albumId;
    private UUID musicId;
}