package com.binn328.ym_player.DAO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * 재생목록 정보를 담을 DAO
 */
@Getter
@Setter
@AllArgsConstructor
@Document(collation = "playlist")
public class PlaylistDAO {
    @Id
    private String id;
    private String name;
    private boolean favorite;
}
