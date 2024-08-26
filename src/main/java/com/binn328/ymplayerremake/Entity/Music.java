package com.binn328.ymplayerremake.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.nio.file.Path;
import java.util.UUID;

@Entity
@Getter
@Setter
public class Music {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;
    private String year;
    private String genre;
    private String trackNumber;
    private String comment;
    private String filePath;
    private String musicbrainzId;

    // 추후에 해당 타입과 연결
    private String artist;
    private String album;

}
