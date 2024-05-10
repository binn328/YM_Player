package com.binn328.ym_player.Model;

import com.binn328.ym_player.Service.SequenceGeneratorService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Transient;

@Getter
@Setter
@AllArgsConstructor
public class MusicId {
    @Transient
    public static final String SEQUENCE_NAME = "music_id_sequence";
    private String id;
    private long order;

}
