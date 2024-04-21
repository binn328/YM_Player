package com.binn328.ym_player.DTO;

import com.binn328.ym_player.DAO.Music;
import lombok.AllArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
public class MusicForm {
    private String title;
    private String artist;
    private String group;

    public Music toEntity() {
        return new Music(null, title, artist, group);
    }
}
