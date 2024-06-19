package com.binn328.ym_player.Controller;

import com.binn328.ym_player.DTO.MusicForm;
import com.binn328.ym_player.Model.DownloadRequest;
import com.binn328.ym_player.Model.DownloadStatus;
import com.binn328.ym_player.Model.Music;
import com.binn328.ym_player.Repository.MusicRepository;
import com.binn328.ym_player.Service.DownloadService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log4j2
@RequestMapping("/api/dl")
@CrossOrigin(origins = "*")
public class DownloadAPIController {
    private final DownloadService downloadService;
    private final MusicRepository musicRepository;
    public DownloadAPIController(MusicRepository musicRepository, DownloadService downloadService) {
        this.downloadService = downloadService;
        this.musicRepository = musicRepository;
    }

    /**
     * 해당 url의 음악을 다운로드 큐에 추가한다.
     * @param request 링크와 옵션이 담긴 요청
     * @return 올바른 요청이 아니면 badRequest를 반환
     */
    @PostMapping()
    public ResponseEntity<String> download(@RequestBody DownloadRequest request) {
        // https://blog.groupdocs.com/metadata/read-mp3-tags-in-java/
        // https://www.google.com/search?q=yt%20dlp%20mp3%20tag
        if (downloadService.addQueue(request)) {
            return ResponseEntity.ok("Download Started");
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 현재 다운로드가 어떻게 되어가고 있는지를 반환해주는 함수
     * @return 현재 다운로드 현황
     */
    @GetMapping()
    public ResponseEntity<List<DownloadStatus>> progress() {
        List<DownloadStatus> downloadProgress = downloadService.getDownloadProgress();
        return ResponseEntity.ok(downloadProgress);
    }
}
