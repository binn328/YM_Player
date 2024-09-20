package com.binn328.ymplayerremake.Entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
public class ArtistMusic {
    @EmbeddedId
    private ArtistMusicId id;

    @ManyToOne
    @MapsId("artistId")
    @JoinColumn(name = "artist_id")
    private Artist artist;

    @ManyToOne
    @MapsId("musicId")
    @JoinColumn(name = "music_id")
    private Music music;
}

@Embeddable
class ArtistMusicId implements Serializable {
    private UUID artistId;
    private UUID musicId;
}