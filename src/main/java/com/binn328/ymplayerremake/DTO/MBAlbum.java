package com.binn328.ymplayerremake.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter @Setter
public class MBAlbum {
    private UUID id;
    private String title;
    private LocalDate releaseDate;
    private String country;
    private String musicbrainz_id;
}
