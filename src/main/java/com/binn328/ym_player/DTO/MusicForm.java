package com.binn328.ym_player.DTO;

import com.binn328.ym_player.Model.Chapter;
import com.binn328.ym_player.Model.Music;
import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class MusicForm {
    private String id;
    private String title;
    private String artist;
    private String group;
    private boolean favorite;
    private List<Chapter> chapters;

    public Music toEntity() {
        return new Music(id, title, artist, group, favorite, chapters);
    }
}
