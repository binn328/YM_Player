package com.binn328.ymplayerremake.Util;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.nio.file.Paths;

@Log4j2
@Getter
@Component
@ConfigurationProperties(prefix = "env")
public class EnvStore {
    @Setter
    private String rootDir;

    private Path rootPath;
    private Path musicPath;
    private Path downloadPath;
    private Path tempPath;

    public EnvStore() {

    }

    @PostConstruct
    public void init() {
        // 환경 변수가 잘 지정되었는지 확인
        if (rootDir == null || rootDir.isEmpty()) {
            throw new IllegalArgumentException("Property 'env.rootDir' must be set");
        }

        rootPath = Paths.get(rootDir);
        musicPath = rootPath.resolve("musics");
        downloadPath = rootPath.resolve("downloads");
        tempPath = rootPath.resolve("temp");
    }
}
