package com.binn328.ym_player.DTO;

import com.binn328.ym_player.Model.Music;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class MusicForm {
    private String id;
    private String title;
    private String artist;
    private String group;
    private boolean favorite;

    public Music toEntity() {
        return new Music(id, title, artist, group, favorite);
    }
}
