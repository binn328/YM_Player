package com.binn328.ym_player.Model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * 음악 정보를 담아올 DAO
 */
@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "music")
public class Music {
    @Id
    private String id;
    private String title;
    private String artist;
    private String group;
    private boolean favorite;
    private List<Chapter> chapters;
}
