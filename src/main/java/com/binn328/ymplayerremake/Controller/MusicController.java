package com.binn328.ymplayerremake.Controller;

import com.binn328.ymplayerremake.DTO.CustomResponse;
import com.binn328.ymplayerremake.Entity.Music;
import com.binn328.ymplayerremake.Service.MusicService;
import com.binn328.ymplayerremake.Util.ResponseBuilder;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class MusicController {
    private final MusicService musicService;
    private final ResponseBuilder responseBuilder;

    /**
     * 음악 파일과 정보를 받아 서버에 저장합니다.
     * @param music 음악 정보
     * @param file 음악 파일
     * @return 업로드 성공 시 HTTP 상태코드 201(CREATED)와 성공 메시지를 담은 응답을 반환합니다.
     *         유효성 검사 실패 시 HTTP 상태코드 400(BAD_REQUEST)와 오류 메시지를 담은 응답을 반환합니다.
     *         파일 처리 오류 발생 시 HTTP 상태코드 500(INTERNAL_SERVER_ERROR)와 오류 메시지를 담은 응답을 반환합니다.
     */
    @PostMapping(value="/api/music", consumes = "multipart/form-data")
    public ResponseEntity<CustomResponse> postMusic(
            @ModelAttribute Music music,
            @RequestParam MultipartFile file
    ) {
        try {
            musicService.addMusic(music, file);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(responseBuilder.success("Music uploaded successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(responseBuilder.error(e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseBuilder.error("File processing error: " + e.getMessage()));
        }
    }

    /* READ */
    /**
     * 모든 음악을 반환합니다.
     * @return 요청에 성공하면 HTTP 상태코드 200(OK)와 음악 목록이 담긴 리스트를 담아 반환합니다.
     *         데이터베이스를 읽는 중 문제가 발생하면 HTTP 상태코드 500(INTERNAL_SERVER_ERROR)를 반환합니다.
     */
    @GetMapping("/api/music")
    public ResponseEntity<CustomResponse> getMusics() {
        try {
            List<Music> musics = musicService.getMusicsInfo();
            Map<String, Object> result = new HashMap<>();
            result.put("musics", musics);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(responseBuilder.success("", result));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseBuilder.error("DB read error: " + e.getMessage()));
        }
    }

    /**
     * id에 해당하는 음악 정보를 반환합니다.
     * @param id 찾아올 음악의 UUID
     * @return 요청에 성공하면 HTTP 상태코드 200(OK)와 음악을 담아 반환합니다.
     *         데이터베이스를 읽는 중 문제가 발생하면 HTTP 상태코드 500(INTERNAL_SERVER_ERROR)를 반환합니다.
     */
    @GetMapping("/api/music/{id}/info")
    public ResponseEntity<CustomResponse> getMusicInfo(@PathVariable UUID id) {
        try {
            Music result = musicService.getMusicInfo(id);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(responseBuilder.success("success", result));
        } catch(EntityNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(responseBuilder.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseBuilder.error(e.getMessage()));
        }

    }

    /**
     * id에 해당하는 음악 파일을 반환합니다.
     * @param id 찾아올 음악의 UUID
     * @return
     */
//    @GetMapping("/api/music/{id}/file")
//    public ResponseEntity<CustomResponse> getMusicFile(@PathVariable String id) {
//        try {
//            musicService.getMusicFile(id);
//        } catch () {
//
//        }
//    }


    /* UPDATE */

    /**
     * 음악의 메타데이터를 수정합니다.
     * @param id 수정할 음악의 UUID
     * @param music 수정될 음악의 메타데이터
     * @return
     */
//    @PutMapping("/api/music/{id}/info")
//    public ResponseEntity<CustomResponse> updateMusicInfo(
//            @PathVariable UUID id,
//            @RequestBody Music music
//    ) {
//        musicService.editMusicInfo(id, music);
//        return null;
//    }

    /**
     * 음악 파일을 교체합니다.
     * @param id 교체할 음악의 UUID
     * @param file 교체할 음악 파일
     * @return
     */
//    @PutMapping("/api/music/{id}/file")
//    public ResponseEntity<CustomResponse> updateMusicFile(
//            @PathVariable UUID id,
//            @RequestParam MultipartFile file
//    ) {
//        musicService.editMusicFile(id, file);
//        return null;
//    }

    /* DELETE */

    /**
     * 음악을 제거합니다.
     * @param id 제거할 음악의 UUID
     * @return
     */
    @DeleteMapping("/api/music/{id}")
    public ResponseEntity<CustomResponse> deleteMusic(@PathVariable UUID id) {
        try {
            musicService.deleteMusic(id);
            return ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .body(responseBuilder.success("Music deleted successfully"));
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseBuilder.error("File processing error: " + e.getMessage()));
        } catch (EntityNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(responseBuilder.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseBuilder.error(e.getMessage()));
        }
    }
}
