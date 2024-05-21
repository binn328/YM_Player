package com.binn328.ym_player.Service;

import com.binn328.ym_player.Model.DownloadRequest;
import com.sapher.youtubedl.YoutubeDL;
import com.sapher.youtubedl.YoutubeDLException;
import com.sapher.youtubedl.YoutubeDLRequest;
import com.sapher.youtubedl.YoutubeDLResponse;
import jakarta.annotation.PreDestroy;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * yt-dlp를 통한 다운로드를 담당하는 서비스
 */
@Log4j2
@Service
public class DownloadService {
    private final BlockingQueue<DownloadRequest> downloadQueue;
    private final ExecutorService executorService;
    private final String downloadDir = System.getenv("DATA_DIR") + File.separator + "tmp";
    /**
     * 생성자, downloadQueue.take()는 작업이 오기를 기다린다.
     * 만약 작업이 들어오면 즉시 동작을 실행한다.
     */
    public DownloadService() {
        downloadQueue = new LinkedBlockingQueue<>();
        executorService = Executors.newSingleThreadExecutor();
        YoutubeDL.setExecutablePath("yt-dlp");
        executorService.submit(() -> {
            while (true) {
                try {
                    DownloadRequest request = downloadQueue.take();
                    download(request);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        });
    }

    /**
     * 프로그램 종료 시 스레드를 정리한다.
     */
    @PreDestroy
    public void shutdown() {
        executorService.shutdown();
    }

    /**
     * 다운로드 요청을 큐에 추가한다.
     * @param request 링크와 옵션이 담긴 요청
     * @return 큐에 추가 성공 시 true, 아니면 false
     */
    public boolean addQueue(DownloadRequest request) {
        return downloadQueue.offer(request);
    }

    /**
     *
     * @param request
     */
    private void download(DownloadRequest request) {
        // TODO 다운로드 로직 구현
        /*
        --extract-audio --audio-format mp3 --audio-quality 0 --output dir/%(title)s.mp3
         */
        YoutubeDLRequest youtubeDLRequest = new YoutubeDLRequest(request.getUrl(), downloadDir);
        youtubeDLRequest.setOption("extract-audio");
        youtubeDLRequest.setOption("audio-format", "mp3");
        youtubeDLRequest.setOption("audio-quality", 0);
        youtubeDLRequest.setOption("output", "%(title)s.mp3");

        try {
            YoutubeDLResponse response = YoutubeDL.execute(youtubeDLRequest);
            log.info("Download started by yt-dlp");
            String stdOut = response.getOut();
            log.info(stdOut);
        } catch (YoutubeDLException e) {
            log.error(e.getMessage());
        }

    }
}
