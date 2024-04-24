package com.binn328.ym_player.Controller;

import com.binn328.ym_player.DAO.Music;
import com.binn328.ym_player.DTO.MusicForm;
import com.binn328.ym_player.Repository.MusicRepository;
import com.binn328.ym_player.Service.MusicService;
import com.binn328.ym_player.Service.StorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/music")
public class MusicAPIController {
    private final MusicRepository musicRepository;
    private final StorageService storageService;
    public MusicAPIController(MusicRepository musicRepository, StorageService storageService) {
        this.musicRepository= musicRepository;
        this.storageService = storageService;
    }

    /**
     * 모든 음악의 목록을 반환합니다.
     * @return 200 OK, 발견한 모든 음악을 반환합니다.
     */
    @GetMapping()
    public ResponseEntity<List<Music>> getAllMusic() {
        return ResponseEntity.ok(musicRepository.findAll());
    }

    /**
     * 특정 id의 음악을 반환합니다.
     * @param id 음악의 id입니다.
     * @return 있다면 200 OK, 아니면 404 를 반환합니다.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Music> getMusicById(@PathVariable String id) {
        Optional<Music> music = musicRepository.findById(id);
        if (music.isPresent()) {
            return ResponseEntity.ok(music.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 음악을 추가합니다.
     * @param form 추가될 음악의 정보입니다.
     * @return
     */
    // https://youtu.be/mi5eKp7noRw?list=PLfu_Bpi_zcDPtiIMdKbQ33OnqzAf9lRjg&t=997
    // api 만들고, @RequestPart form 을 사용하도록 리팩토링하기
    @PostMapping(consumes = "")
    public ResponseEntity<Music> addMusic(MusicForm form, @RequestPart("file") MultipartFile file) {
        // TODO 저장기능 추가
        Music music = form.toEntity();
        musicRepository.save(music);
        return null;
    }

    @DeleteMapping("api/music")
    public void deleteMusic(String id) {
        musicRepository.deleteById(id);
    }
}
