package com.binn328.ymplayerremake.Util;

import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.io.File;

@Log4j2
@Getter
@Component
public class EnvStore {
    private final String rootDir;
    private final String musicDir;
    private final String downloadDir;

    public EnvStore() {
        rootDir = File.separator + "data";
        musicDir = rootDir + File.separator + "musics";
        downloadDir = rootDir + File.separator + "downloads";
    }
}
