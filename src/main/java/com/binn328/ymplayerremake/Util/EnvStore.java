package com.binn328.ymplayerremake.Util;

import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@Log4j2
@Getter
@Component
public class EnvStore {
    private final Path rootDir;
    private final Path musicDir;
    private final Path downloadDir;
    private final Path tempDir;

    public EnvStore() {
        rootDir = Paths.get("/data");
        musicDir = rootDir.resolve("musics");
        downloadDir = rootDir.resolve("downloads");
        tempDir = rootDir.resolve("temp");
    }
}
