package com.binn328.ym_player.Controller;

import com.binn328.ym_player.DTO.MusicForm;
import com.binn328.ym_player.Model.Music;
import com.binn328.ym_player.Repository.MusicRepository;
import com.binn328.ym_player.Service.DownloadService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Log4j2
@RequestMapping("/api/dl")
public class DownloadAPIController {
    private final DownloadService downloadService;
    private final MusicRepository musicRepository;
    public DownloadAPIController(MusicRepository musicRepository, DownloadService downloadService) {
        this.downloadService = downloadService;
        this.musicRepository = musicRepository;
    }

    /**
     * 해당 url의 음악을 다운로드한다.
     * TODO 옵션을 받도록 수정
     * @param url
     * @return
     */
    @PostMapping("/{url}")
    public ResponseEntity<Music> download(MusicForm form, @PathVariable String url) {
        Music musicToDownload = form.toEntity();
        Music savedMusic = musicRepository.save(musicToDownload);

        if(downloadService.download(url, savedMusic.getId())) {
            return ResponseEntity.ok(savedMusic);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}