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
     * @return
     */
    @GetMapping()
    public ResponseEntity<List<Album>> getAllAlbums() {
        return ResponseEntity.ok(albumRepository.findAll());
    }

    /**
     * 특정 id 앨범 반환
     * @param id
     * @return
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
     * @param id
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
     * @param album
     * @return
     */
    @PostMapping()
    public ResponseEntity<Album> createAlbum(Album album) {
        log.info(album.toString());
        Album savedAlbum = albumRepository.save(album);
        return ResponseEntity.ok(savedAlbum);
    }

    /**
     * 앨범 아트를 업로드
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
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 앨범 정보 수정
     * @param id
     * @param album
     * @return
     */
    @PostMapping("/update/{id}")
    public ResponseEntity<Album> updateAlbum(@PathVariable String id, Album album) {
        Optional<Album> targetAlbumOptional = albumRepository.findById(id);
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
     * @param id
     * @return
     */
    @PostMapping("/delete/{id}")
    public ResponseEntity<Album> deleteAlbum(@PathVariable String id) {
        Optional<Album> targetAlbumOptional = albumRepository.findById(id);
        if (targetAlbumOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Album targetAlbum = targetAlbumOptional.get();
        albumRepository.delete(targetAlbum);

        storageService.deleteArtById(id);

        return ResponseEntity.noContent().build();
    }
}
