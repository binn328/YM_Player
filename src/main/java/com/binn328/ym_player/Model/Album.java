package com.binn328.ym_player.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * 앨범 정보를 담을 DAO
 */
@Getter
@Setter
@AllArgsConstructor
@Document(collation = "album")
public class Album {
    @Id
    private String id;
    private String name;
    private boolean favorite;
    private List<MusicId> musics;
}
