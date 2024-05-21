package com.binn328.ym_player.Model;

import com.binn328.ym_player.Util.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DownloadStatus {
    private String name;
    private int elapsedTime;
    private Status status;
}
