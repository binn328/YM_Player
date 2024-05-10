package com.binn328.ym_player.Controller;

import com.binn328.ym_player.Model.Playlist;
import com.binn328.ym_player.Repository.PlaylistRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
@RequestMapping("/api/playlist")
public class PlaylistAPIController {
    private final PlaylistRepository playlistRepository;
    public PlaylistAPIController(PlaylistRepository playlistRepository) {
        this.playlistRepository = playlistRepository;
    }

    /**
     * 모든 재생 목록 반환
     * @return
     */
    @GetMapping()
    public ResponseEntity<List<Playlist>> getPlaylists() {
        return ResponseEntity.ok(playlistRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Playlist> getPlaylist(@PathVariable String id) {
        Optional<Playlist> playlist = playlistRepository.findById(id);
        if (playlist.isPresent()) {
            return ResponseEntity.ok(playlist.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping()
    public ResponseEntity<Playlist> createAlbum(Playlist playlist) {
        log.info(playlist.toString());
        Playlist savedPlaylist = playlistRepository.save(playlist);
        return ResponseEntity.ok(savedPlaylist);
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<Playlist> updatePlaylist(@PathVariable String id, @RequestBody Playlist playlist) {
        Optional<Playlist> playlistOptional = playlistRepository.findById(id);
        if (playlistOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Playlist targetPlaylist = playlistOptional.get();
        if (playlist.getName() != null) {
            targetPlaylist.setName(playlist.getName());
        }

        targetPlaylist.setFavorite(playlist.isFavorite());

        if (playlist.getMusics() != null) {
            targetPlaylist.setMusics(playlist.getMusics());
        }

        Playlist savedPlaylist = playlistRepository.save(targetPlaylist);
        return ResponseEntity.ok(savedPlaylist);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<Playlist> deletePlaylist(@PathVariable String id) {
        Optional<Playlist> playlistOptional = playlistRepository.findById(id);
        if (playlistOptional.isPresent()) {
            Playlist targetPlaylist = playlistOptional.get();
            playlistRepository.delete(targetPlaylist);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
