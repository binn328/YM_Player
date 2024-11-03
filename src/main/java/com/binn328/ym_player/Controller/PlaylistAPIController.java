package com.binn328.ym_player.Controller;

import com.binn328.ym_player.Model.Music;
import com.binn328.ym_player.Model.MusicIdOrder;
import com.binn328.ym_player.Model.Playlist;
import com.binn328.ym_player.Repository.PlaylistRepository;
import com.binn328.ym_player.Service.PlaylistService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
@RequestMapping("/api/playlist")
@CrossOrigin(origins = "*")
public class PlaylistAPIController {
    private final PlaylistRepository playlistRepository;
    private final PlaylistService playlistService;
    public PlaylistAPIController(PlaylistRepository playlistRepository, PlaylistService playlistService) {
        this.playlistRepository = playlistRepository;
        this.playlistService = playlistService;
    }

    /**
     * 모든 재생 목록 반환
     * @return DB에서 발견한 모든 재생목록의 정보
     */
    @GetMapping()
    public ResponseEntity<List<Playlist>> getPlaylists() {
        return ResponseEntity.ok(playlistRepository.findAll());
    }

    /**
     * 특정 id 재생목록 반환
     * @param id 검색할 재생목록의 id
     * @return 해당 재생목록의 정보를 반환, 없으면 404
     */
    @GetMapping("/{id}")
    public ResponseEntity<Playlist> getPlaylist(@PathVariable String id) {
        Optional<Playlist> playlist = playlistRepository.findById(id);
        if (playlist.isPresent()) {
            return ResponseEntity.ok(playlist.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 재생목록을 생성
     * @param playlist form으로 입력된 재생목록의 정보
     * @return DB에 입력된 재생목록의 정보
     */
    @PostMapping()
    public ResponseEntity<Playlist> createPlaylist(@RequestBody Playlist playlist) {
        log.info(playlist.toString());
        if (playlist.getName() != null) {
            Playlist savedPlaylist = playlistRepository.save(playlist);
            return ResponseEntity.ok(savedPlaylist);
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * 재생목록 정보 수정
     * @param playlist json 형식의 수정될 재생목록의 정보
     * @return 수정된 재생목록의 정보
     */
    @PostMapping("/update")
    public ResponseEntity<Playlist> updatePlaylist(@RequestBody Playlist playlist) {
        Optional<Playlist> playlistOptional = playlistRepository.findById(playlist.getId());
        // 해당 재생목록이 없으면 404 반환
        if (playlistOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // 이름 설정
        Playlist targetPlaylist = playlistOptional.get();
        if (playlist.getName() != null) {
            targetPlaylist.setName(playlist.getName());
        }

        // 좋아요 여부 설정
        targetPlaylist.setFavorite(playlist.isFavorite());

        // 음악 목록 설정
        if (playlist.getMusics() != null) {
            List<MusicIdOrder> musics = playlistService.orderCheck(playlist.getMusics());
            targetPlaylist.setMusics(musics);
        }

        // DB에 저장
        Playlist savedPlaylist = playlistRepository.save(targetPlaylist);
        return ResponseEntity.ok(savedPlaylist);
    }

    /**
     * 재생목록을 DB에서 삭제
     * @param id 삭제할 재생목록의 id
     * @return 해당 재생목록이 없으면 404, 잘 삭제되면 no content
     */
    @PostMapping("/delete/{id}")
    public ResponseEntity<Playlist> deletePlaylist(@PathVariable String id) {
        Optional<Playlist> playlistOptional = playlistRepository.findById(id);
        // DB에 없으면 404 반환
        if (playlistOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        // 삭제를 진행
        Playlist targetPlaylist = playlistOptional.get();
        playlistRepository.delete(targetPlaylist);
        return ResponseEntity.noContent().build();
    }
}
