package com.binn328.ymplayerremake.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class MBMusic {
    private String musicTitle;
    private int musicLength;
    private int trackNumber;
    private String musicMusicbrainz_id;
    private String albumTitle;
    private LocalDate albumReleaseDate;
    private String albumCountry;
    private String albumMusicbrainz_id;
    private String artistName;
    private String artistMusicbrainz_id;
    private String albumCoverArtUrl;
}

