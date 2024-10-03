package com.binn328.ymplayerremake.DTO;

import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
public class PlaylistDTO {
    List<UUID> musics;
    private String name;
}
