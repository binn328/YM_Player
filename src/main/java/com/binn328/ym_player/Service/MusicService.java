package com.binn328.ym_player.Service;

import com.binn328.ym_player.DAO.Music;
import com.binn328.ym_player.Repository.MusicRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;

@Log4j2
@Service
public class MusicService {
    private final MusicRepository musicRepository;

    public MusicService(MusicRepository musicRepository) {
        this.musicRepository = musicRepository;
    }
    /**
     * 음악을 추가한다.
     * @param music 생성할 음악의 정보
     * @return 생성된 음악의 DB 정보
     */
    public Music createMusic(Music music) {
        Music savedMusic = musicRepository.save(music);
        log.info(savedMusic.toString());
        return savedMusic;
    }

    /**
     * 모든 음악의 정보를 리스트로 반환한다.
     * @return 음악 리스트
     */
    public List<Music> getAllMusics() {
        List<Music> musicList = musicRepository.findAll();
        log.info(musicList.toString());
        return musicList;
    }

    /**
     * id에 맞는 음악을 반환한다.
     * @param id 음악의 UUID
     * @return 발견된 음악, 없으면 null
     */
    public Music getMusicById(String id) {
        Music music = musicRepository.findById(id).orElse(null);
        if (music == null) {
            log.info("music not found");
        } else {
            log.info(music.toString());
        }
        return music;
    }

    /**
     * 음악의 정보를 업데이트한다.
     * @param music 업데이트된 음악
     * @return 업데이트된 음악
     */
    public Music updateMusic(Music music) {
        Music prevMusic = musicRepository.findById(music.getId()).orElse(null);
        if (prevMusic != null) {
            Music newMusic = musicRepository.save(prevMusic);
            log.info(newMusic.toString());
            return newMusic;
        } else {
            log.info("update target music not found");
            return null;
        }
    }

    /**
     * id에 맞는 음악을 제거한다.
     * @param id 삭제할 음악의 id
     */
    public void deleteMusicById(String id) {
        //TODO 파일도 찾아서 삭제한다.
        log.info(id);
        musicRepository.deleteById(id);
    }
}
