package com.binn328.ymplayerremake.Controller;

import com.binn328.ymplayerremake.DTO.CustomResponse;
import com.binn328.ymplayerremake.DTO.PlaylistDTO;
import com.binn328.ymplayerremake.Entity.Playlist;
import com.binn328.ymplayerremake.Service.PlaylistService;
import com.binn328.ymplayerremake.Util.ResponseBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class PlaylistController {
    private final PlaylistService playlistService;
    private final ResponseBuilder responseBuilder;

    /* POST */

    /**
     * 새로운 재생목록을 생성합니다.
     *
     * @return
     */
    @PostMapping(value = "/api/playlist")
    public ResponseEntity<CustomResponse> postPlaylist(
            @RequestBody PlaylistDTO playlistDTO
    ) {
        playlistService.addPlaylist(playlistDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(responseBuilder.success("Playlist created successfully"));
    }

    /* READ */

    /**
     * 모든 재생 목록을 반환합니다.
     *
     * @return
     */
    @GetMapping("/api/playlist")
    public ResponseEntity<CustomResponse> getPlaylists() {
        List<Playlist> playlists = playlistService.getPlaylists();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responseBuilder.success("", playlists));
    }

    /**
     * id에 해당하는 재생목록의 정보를 반환합니다.
     *
     * @param id 찾아올 재생목록의 UUID
     * @return
     */
    @GetMapping("/api/playlist/{id}")
    public ResponseEntity<CustomResponse> getPlaylist(@PathVariable UUID id) {
        Playlist result = playlistService.getPlaylist(id);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responseBuilder.success("success", result));
    }

    /* UPDATE */

    /**
     * id에 해당하는 재생 목록을 수정합니다.
     *
     * @param id 수정할 재생목록의 id
     * @param playlistDTO 수정할 재생목록의 정보
     * @return
     */
    @PatchMapping("/api/playlist/{id}")
    public ResponseEntity<CustomResponse> updatePlaylist(
            @PathVariable UUID id,
            @RequestBody PlaylistDTO playlistDTO
    ) {
        Playlist editedPlaylist = playlistService.editPlaylist(id, playlistDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responseBuilder.success("success", editedPlaylist));
    }

    /* DELETE */

    /**
     * 특정 재생목록을 제거합니다.
     * @param id 제거할 재생목록의 id
     * @return
     */
    @DeleteMapping("/api/playlist/{id}")
    public ResponseEntity<CustomResponse> deletePlaylist(@PathVariable UUID id) {
        playlistService.deletePlaylist(id);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(responseBuilder.success("Playlist deleted successfully"));
    }
}
