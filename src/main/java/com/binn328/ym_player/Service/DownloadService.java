package com.binn328.ym_player.Service;

import org.springframework.stereotype.Service;

/**
 * yt-dlp를 통한 다운로드를 담당하는 서비스
 * process builder
 * https://kim-oriental.tistory.com/58
 */
@Service
public class DownloadService {
    private static final String ytdlpPath = "";
    private final StorageService storageService;

    public DownloadService(StorageService storageService) {
        this.storageService = storageService;
    }

    public boolean download(String url, String id) {

        return true;
    }
}
