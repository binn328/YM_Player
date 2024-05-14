package com.binn328.ym_player.Model;

import com.binn328.ym_player.Service.SequenceGeneratorService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Transient;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MusicId {
    private String id;
}
