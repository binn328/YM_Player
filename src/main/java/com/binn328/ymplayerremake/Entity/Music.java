package com.binn328.ymplayerremake.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
public class Music {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;
    private int length;
    private String filePath;
    private String musicbrainzId;

    @ManyToMany(mappedBy = "musics")
    private Set<Artist> artists = new HashSet<>();

    @ManyToMany(mappedBy = "musics")
    private Set<Album> albums = new HashSet<>();

    @ManyToMany(mappedBy = "musics")
    private Set<Playlist> playlists = new HashSet<>();
}
