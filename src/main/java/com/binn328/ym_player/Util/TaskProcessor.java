package com.binn328.ym_player.Util;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Component
public class TaskProcessor {
    @Autowired
    private DownloadQueue downloadQueue;

    private ExecutorService executor;


    @PostConstruct
    public void init() {
        executor = Executors.newSingleThreadExecutor();
        executor.submit(this::processTasks);
    }

    @PreDestroy
    public void shutdown() {
        if (executor != null) {
            executor.shutdown();
        }
    }

    /**
     * https://github.com/Mister-Ritom/youtube-downloader
     * https://github.com/sapher/youtubedl-java
     */
    public void processTasks() {
        while (true) {
            try {
                String url = downloadQueue.getTask();
                ProcessBuilder processBuilder = new ProcessBuilder();
                processBuilder.command(
                        "yt-dlp",
                        "--extract-audio",
                        "--audio-format", "mp3",
                        "--audio-quality", "0",
                        "--output", "",
                        url
                );
            } catch
        }
    }
}
