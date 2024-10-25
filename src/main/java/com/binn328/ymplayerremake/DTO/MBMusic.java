package com.binn328.ymplayerremake.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter @Setter
public class MBMusic {
    private UUID id;
    private String title;
    private int length;
    private String filePath;
    private String musicbrainz_id;
}

