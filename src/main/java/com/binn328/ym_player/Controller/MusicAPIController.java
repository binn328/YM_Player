package com.binn328.ym_player.Controller;

import com.binn328.ym_player.Model.Music;
import com.binn328.ym_player.DTO.MusicForm;
import com.binn328.ym_player.Repository.MusicRepository;
import com.binn328.ym_player.Service.StorageService;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
@RequestMapping("/api/music")
/**
 * /api/music 아래에서 동작하는 API 컨트롤러
 */
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
    public ResponseEntity<List<Music>> getMusics() {
        return ResponseEntity.ok(musicRepository.findAll());
    }

    /**
     * 특정 id의 음악을 반환합니다.
     * @param id 음악의 id입니다.
     * @return 있다면 200 OK, 아니면 404 를 반환합니다.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Music> getMusic(@PathVariable String id) {
        Optional<Music> music = musicRepository.findById(id);
        if (music.isPresent()) {
            return ResponseEntity.ok(music.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "/item/{id}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<Resource> getMusicItem(@PathVariable String id) {
        Resource file = storageService.getMusic(id);
        if (file == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(file);
        }
    }

    /**
     * 음악을 추가합니다.
     * 우선 데이터베이스에 저장하여 id를 가져온 후, 해당 id를 이름으로 파일을 저장합니다.
     * @param form 추가될 음악의 정보입니다.
     * @return 실패시 502, 성공 시 202
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Music> createMusic(MusicForm form, @RequestPart("file") MultipartFile file) {
        // 받아온 음악을 엔티티화
        Music music = form.toEntity();
        log.info(music.toString());
        // DB에 저장
        Music savedMusic = musicRepository.save(music);
        // 음악파일을 저장, 실패하면 작업을 되돌리고 서버 오류를 반환
        if (!storageService.saveMusic(file, savedMusic.getId())) {
            musicRepository.deleteById(savedMusic.getId());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return new ResponseEntity<>(savedMusic, HttpStatus.CREATED);
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<Music> updateMusic(MusicForm form, @PathVariable String id) {
        // TODO JSON 을 받게 수정하거나, musicForm 대신 그냥 Music을 넣어도 되지 않을까?
        Music musicUpdateData = form.toEntity();
        Optional<Music> musicOptional = musicRepository.findById(id);
        if (musicOptional.isPresent()) {
            Music musicToUpdate = musicOptional.get();
            // 노래 제목 업데이트
            if (musicUpdateData.getTitle() != null) {
                musicToUpdate.setTitle(musicUpdateData.getTitle());
            }
            // 가수 업데이트
            if (musicUpdateData.getArtist() != null) {
                musicToUpdate.setArtist(musicUpdateData.getArtist());
            }
            // 그룹 업데이트
            if (musicUpdateData.getGroup() != null) {
                musicToUpdate.setGroup(musicUpdateData.getGroup());
            }
            // 좋아요 여부 업데이트
            musicToUpdate.setFavorite(musicUpdateData.isFavorite());

            log.info(musicToUpdate.toString());
            // db에 저장
            Music savedMusic = musicRepository.save(musicToUpdate);

            return new ResponseEntity<>(savedMusic, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    /**
     * 음악을 제거합니다.
     * @param id 제거될 음악의 id 입니다.
     */
    @PostMapping("/delete/{id}")
    public ResponseEntity<Music> deleteMusic(@PathVariable String id) {

        // DB에 해당 음악이 없으면 notFound()
        if (!musicRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // 저장소에서 삭제에 실패했다면 Internal Server Error
        if (!storageService.deleteMusicById(id)) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        // DB에서 음악을 제거
        musicRepository.deleteById(id);

        // 모두 통과했다면 noContent
        return ResponseEntity.noContent().build();
    }
}
