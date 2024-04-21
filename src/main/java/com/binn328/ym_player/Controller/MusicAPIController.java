package com.binn328.ym_player.Controller;

import com.binn328.ym_player.DAO.Music;
import com.binn328.ym_player.DTO.MusicForm;
import com.binn328.ym_player.Service.MusicService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MusicAPIController {
    private final MusicService musicService;

    public MusicAPIController(MusicService musicService) {
        this.musicService = musicService;
    }

    @GetMapping("/api/music")
    public List<Music> getAllMusic() {
        List<Music> musicList = musicService.getAllMusics();
        return musicList;
    }

    @PostMapping("/api/music/add")
    public Music addMusic(MusicForm form) {
        Music music = form.toEntity();
        return musicService.createMusic(music);
    }

    @DeleteMapping("api/music/delete")
    public void deleteMusic(String id) {
        musicService.deleteMusicById(id);
    }
}
