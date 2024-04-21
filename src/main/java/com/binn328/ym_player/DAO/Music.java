package com.binn328.ym_player.DAO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * 음악 정보를 담아올 DAO
 */
@Getter
@Setter
@AllArgsConstructor
@Document(collection = "music")
public class MusicDAO {
    @Id
    private String id;
    private String title;
    private String artist;
    private String group;
    private boolean favorite;
    // private chapter;
}
