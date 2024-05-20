package com.binn328.ym_player.Service;

import org.springframework.stereotype.Service;

/**
 * yt-dlp를 통한 다운로드를 담당하는 서비스
 * process builder
 * https://kim-oriental.tistory.com/58
 * 
 */
@Service
public class DownloadService {
    private final String ytdlpPath = "";
    private final StorageService storageService;

    public DownloadService(StorageService storageService) {
        this.storageService = storageService;
    }

    /**
     * 해당 링크를 작업 큐에 추가하는 함수
     * @param url 작업에 추가될 url
     * @return
     */
    public boolean addQueue(String url) {

        return true;
    }
}
