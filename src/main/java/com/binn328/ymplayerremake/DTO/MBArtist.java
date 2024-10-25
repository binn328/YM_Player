package com.binn328.ymplayerremake.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter @Setter
public class MBArtist {
    private UUID id;
    private String name;
    private String musicbrainz_id;
}
