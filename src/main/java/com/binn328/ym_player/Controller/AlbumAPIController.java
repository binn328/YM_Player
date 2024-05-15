package com.binn328.ym_player.Controller;

import com.binn328.ym_player.Model.Album;
import com.binn328.ym_player.Repository.AlbumRepository;
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
@RequestMapping("/api/album")
public class AlbumAPIController {
    private final AlbumRepository albumRepository;
    private final StorageService storageService;
    public AlbumAPIController(AlbumRepository albumRepository, StorageService storageService) {
        this.albumRepository = albumRepository;
        this.storageService = storageService;
    }

    /**
     * 모든 앨범 목록 반환
     * @return DB에서 발견한 모든 앨범의 정보
     */
    @GetMapping()
    public ResponseEntity<List<Album>> getAllAlbums() {
        return ResponseEntity.ok(albumRepository.findAll());
    }

    /**
     * 특정 id 앨범 반환
     * @param id 검색할 앨범의 id
     * @return 해당 앨범의 정보를 반환
     */
    @GetMapping("/{id}")
    public ResponseEntity<Album> getAlbumById(@PathVariable String id) {
        Optional<Album> album = albumRepository.findById(id);
        if (album.isPresent()) {
            return ResponseEntity.ok(album.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 앨범 아트를 반환
     * @param id 검색할 앨범의 id
     * @return
     */
    @GetMapping(value = "/art/{id}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<Resource> getAlbumImage(@PathVariable String id) {
        Resource file = storageService.getAlbumArt(id);
        if (file == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(file);
        }
    }

    /**
     * 앨범을 생성
     * @param album form으로 입력된 앨범의 정보
     * @return DB에 입력된 앨범의 정보
     */
    @PostMapping()
    public ResponseEntity<Album> createAlbum(Album album) {
        log.info(album.toString());
        if(album.getName() != null) {
            Album savedAlbum = albumRepository.save(album);
            return ResponseEntity.ok(savedAlbum);
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * 앨범 아트를 업로드
     * @param id 업로드할 앨범의 id
     * @param file 업로드할 앨범 아트 파일
     * @return id가 DB에 없으면 404, 업로드 실패 시 502, 성공시 200
     */
    @PostMapping("art/{id}")
    public ResponseEntity<Resource> createAlbumArt(@PathVariable String id, MultipartFile file) {
        Optional<Album> album = albumRepository.findById(id);
        if (album.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if(storageService.saveAlbumArt(id, file)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 앨범 정보 수정
     * @param album json 형식의 수정될 앨범의 정보
     * @return 수정된 앨범의 정보
     */
    @PostMapping("/update")
    public ResponseEntity<Album> updateAlbum(@RequestBody Album album) {
        Optional<Album> targetAlbumOptional = albumRepository.findById(album.getId());
        if (targetAlbumOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Album targetAlbum = targetAlbumOptional.get();
        if (album.getName() != null) {
            targetAlbum.setName(album.getName());
        }

        targetAlbum.setFavorite(album.isFavorite());

        if (album.getMusics() != null) {
            targetAlbum.setMusics(album.getMusics());
        }

        Album savedAlbum = albumRepository.save(targetAlbum);
        return new ResponseEntity<>(savedAlbum, HttpStatus.OK);
    }

    /**
     * 앨범 삭제
     * @param id 삭제할 앨범의 id
     * @return 해당 id의 앨범이 없으면 404, 잘 되면 no content
     */
    @PostMapping("/delete/{id}")
    public ResponseEntity<Album> deleteAlbum(@PathVariable String id) {
        Optional<Album> targetAlbumOptional = albumRepository.findById(id);
        if (targetAlbumOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Album targetAlbum = targetAlbumOptional.get();
        albumRepository.delete(targetAlbum);

        log.info(storageService.deleteArtById(id));

        return ResponseEntity.noContent().build();
    }
}
