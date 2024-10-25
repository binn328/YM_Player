package com.binn328.ymplayerremake.Controller;

import com.binn328.ymplayerremake.DTO.MBAlbum;
import com.binn328.ymplayerremake.DTO.MBArtist;
import com.binn328.ymplayerremake.DTO.MBMusic;
import com.binn328.ymplayerremake.Service.MusicbrainzService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController  // REST API를 제공하는 컨트롤러
@RequestMapping("/api/mb")  // API 경로 설정
public class MusicbrainzServiceController {

    @Autowired
    private MusicbrainzService musicService;  // 서비스 주입

    // 트랙 정보를 반환하는 엔드포인트
    @GetMapping("/music")
    public MBMusic getMusicInfo(@RequestParam String title, @RequestParam String artist) {
        return musicService.getMusicInfo(title, artist);  // MBMusic 객체 반환
    }

    // 앨범 정보를 반환하는 엔드포인트
    @GetMapping("/album")
    public MBAlbum getAlbumInfo(@RequestParam String title, @RequestParam String artist) {
        return musicService.getAlbumInfo(title, artist);  // MBAlbum 객체 반환
    }

    // 아티스트 정보를 반환하는 엔드포인트
    @GetMapping("/artist")
    public MBArtist getArtistInfo(@RequestParam String title, @RequestParam String artist) {
        return musicService.getArtistInfo(title, artist);  // MBArtist 객체 반환
    }
}

