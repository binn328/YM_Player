package com.binn328.ym_player.Controller;

import com.binn328.ym_player.Model.Music;
import com.binn328.ym_player.DTO.MusicForm;
import com.binn328.ym_player.Repository.MusicRepository;
import com.binn328.ym_player.Service.StorageService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Log4j2
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
     * 우선 데이터베이스에 저장하여 id를 가져온 후, 해당 id를 이름으로 파일을 저장합니다.
     * @param form 추가될 음악의 정보입니다.
     * @return
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Music> addMusic(MusicForm form, @RequestPart("file") MultipartFile file) {

        Music music = form.toEntity();
        // 가져온 음악 정보 로깅
        log.info(music.toString());
        Music savedMusic = musicRepository.save(music);
        storageService.saveMusic(file, savedMusic.getId());

        return new ResponseEntity<>(savedMusic, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
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
            musicToUpdate.setFavorite(musicToUpdate.isFavorite());

            // db에 저장
            musicRepository.save(musicToUpdate);

            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    /**
     * 음악을 제거합니다.
     * @param id 제거될 음악의 id 입니다.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Music> deleteMusic(@PathVariable String id) {
        // TODO 음악이 제대로 제거되었는지 확인하기

        if (musicRepository.existsById(id)) {
            storageService.deleteMusicById(id);
            musicRepository.deleteById(id);

            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }


    }
}
