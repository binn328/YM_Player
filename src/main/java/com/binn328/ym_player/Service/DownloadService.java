package com.binn328.ym_player.Service;

import com.binn328.ym_player.Model.DownloadRequest;
import com.binn328.ym_player.Model.DownloadStatus;
import com.binn328.ym_player.Util.Status;
import com.sapher.youtubedl.YoutubeDL;
import com.sapher.youtubedl.YoutubeDLException;
import com.sapher.youtubedl.YoutubeDLRequest;
import com.sapher.youtubedl.YoutubeDLResponse;
import com.sapher.youtubedl.mapper.VideoInfo;
import jakarta.annotation.PreDestroy;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
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
    @Autowired
    private final StorageService storageService;
    private final BlockingQueue<DownloadRequest> downloadQueue;
    private final ExecutorService executorService;
    private final String downloadDir = System.getenv("DATA_DIR") + File.separator + "tmp";
    private final List<DownloadStatus> downloadStatuses;
    /**
     * 생성자, downloadQueue.take()는 작업이 오기를 기다린다.
     * 만약 작업이 들어오면 즉시 동작을 실행한다.
     */
    public DownloadService(StorageService storageService) {
        this.storageService = storageService;
        this.downloadStatuses = new ArrayList<>();
        this.downloadQueue = new LinkedBlockingQueue<>();
        this.executorService = Executors.newSingleThreadExecutor();
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
        /*
        --extract-audio --audio-format mp3 --audio-quality 0 --output dir/%(title)s.mp3
         */
        // 디렉터리가 존재하는지 확인하고 생성
        File dir = new File(downloadDir);
        if (!dir.exists()) {
            if (!dir.mkdirs()) {
                log.error("Failed to create directory: {}", downloadDir);
            }
        }

        VideoInfo videoInfo = null;
        downloadStatuses.addLast(new DownloadStatus(request.getUrl(), 0, Status.NOT_STARTED));
        // 1. 우선 해당 url이 올바른지, 정보부터 요청해서 확인
        log.info("YTstage1 started");
        try {
            // 정보를 요청
            videoInfo = YoutubeDL.getVideoInfo(request.getUrl());
            // 정보를 대기열의 요청 정보에 추가
            downloadStatuses.getLast().setName(videoInfo.title);
            downloadStatuses.getLast().setStatus(Status.IN_PROGRESS);
        } catch (YoutubeDLException e) {
            // 정보를 받는데 실패했다면 요청의 상태를 실패로 설정하고 함수를 종료
            log.error(e.getMessage());
            downloadStatuses.getLast().setStatus(Status.FAILED);
            return;
        }
        log.info("YTstage2 started");
        // 2. 다운로드를 수행
        // 다운로드 전 옵션 수정
        YoutubeDLRequest youtubeDLRequest = new YoutubeDLRequest(request.getUrl(), downloadDir);
        youtubeDLRequest.setOption("extract-audio");
        youtubeDLRequest.setOption("audio-format", "mp3");
        youtubeDLRequest.setOption("audio-quality", 0);
        youtubeDLRequest.setOption("output", "%(id)s.mp3");
        youtubeDLRequest.setOption("no-playlist");
        // 다운로드 수행
        YoutubeDLResponse response;
        try {
            log.info("Download started by yt-dlp: " + request.getUrl());
            response = YoutubeDL.execute(youtubeDLRequest);
            log.info(response.getOut());
            log.error(response.getErr());
        } catch (YoutubeDLException e) {
            log.error(e.getMessage());
            downloadStatuses.getLast().setStatus(Status.FAILED);
            return;
        }

        log.info("YTstage3 started");
        // 3. 다운로드된 파일을 DB에 저장
        if (storageService.parseAndSave(videoInfo)) {
            downloadStatuses.getLast().setStatus(Status.COMPLETED);
            downloadStatuses.getLast().setElapsedTime(response.getElapsedTime());
            log.info("YTstage3 completed");
        } else {
            log.error("YTstage3 Failed");
            downloadStatuses.getLast().setStatus(Status.FAILED);
        }
    }
}
