package com.binn328.ym_player.Service;

import com.binn328.ym_player.Model.Music;
import com.binn328.ym_player.Repository.MusicRepository;
import com.sapher.youtubedl.mapper.VideoInfo;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * 파일의 관리를 담당하는 서비스
 */
@Log4j2
@Service
public class StorageService {
    private final String musicDir = System.getenv("DATA_DIR") + File.separator + "music";
    private final String artDir = System.getenv("DATA_DIR") + File.separator + "art";
    private final String downloadDir = System.getenv("DATA_DIR") + File.separator + "tmp";
    private final MusicRepository musicRepository;

    /**
     * 생성자
     * @param musicRepository
     */
    public StorageService(MusicRepository musicRepository) {
        this.musicRepository = musicRepository;
    }
    /**
     * 음악파일을 받아서 저장소에 저장하는 함수
     * @param musicFile 웹으로 전송받은 파일
     * @param fileName 저장될 파일의 이름, 데이터베이스의 id이다.
     * @return 저장 성공 시 true, 아니면 false
     */
    public boolean saveMusic(MultipartFile musicFile, String fileName) {
        try {
            // 디렉터리가 존재하는지 확인하고 생성
            File dir = new File(musicDir);
            if (!dir.exists()) {
                if (!dir.mkdirs()) {
                    log.error("Failed to create directory: {}", musicDir);
                    return false;
                }
            }

            // 파일을 저장
            String filePath = musicDir + File.separator + fileName + ".mp3";
            Path path = Paths.get(filePath).toAbsolutePath();
            musicFile.transferTo(path.toFile());

            // 성공 시 true를 반환
            return true;
        } catch (IOException e) {
            // 오류 발생 시 로그를 찍고 false를 반환
            log.error("Failed to save music file: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 음악의 id를 받아 해당 id의 파일을 제거하는 함수
     * @param id 제거될 음악의 id 입니다.
     * @return 성공 시 true, 실패 시 false
     */
    public boolean deleteMusicById(String id) {
        File deleteLocation = new File(musicDir + File.separator + id + ".mp3");
        return deleteLocation.delete();
    }

    /**
     * id에 해당하는 음악파일을 반환한다.
     * @param id 가져올 파일의 id
     * @return 파일의 Resource 객체
     */
    public Resource getMusic(String id) {
        File file = new File(musicDir + File.separator + id + ".mp3");
        if (!file.exists()) {
            return null;
        }

        return new FileSystemResource(file);
    }

    /**
     * id에 해당하는 앨범 아트 사진 파일을 반환한다.
     * @param id 가져올 파일의 id
     * @return 앨범 아트의 Resource 객체
     */
    public Resource getAlbumArt(String id) {
        File file = new File(artDir + File.separator + id + ".png");
        if (!file.exists()) {
            return null;
        }
        return new FileSystemResource(file);
    }

    /**
     * 앨범 아트를 저장한다.
     * @param fileName 저장될 파일의 이름
     * @param artFile 저장될 파일
     * @return 성공적이면 true, 아니면 false
     */
    public boolean saveAlbumArt(String fileName, MultipartFile artFile) {
        try {
            // 디렉터리가 존재하는지 확인하고 생성
            File dir = new File(artDir);
            if (!dir.exists()) {
                if (!dir.mkdirs()) {
                    log.error("Failed to create directory: {}", artDir);
                    return false;
                }
            }

            // 파일을 저장
            String filePath = artDir + File.separator + fileName + ".png";
            Path path = Paths.get(filePath).toAbsolutePath();
            artFile.transferTo(path.toFile());

            // 성공 시 true를 반환
            return true;
        } catch (IOException e) {
            // 오류 발생 시 로그를 찍고 false를 반환
            log.error("Failed to save art file: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 앨범아트를 삭제한다.
     * @param id 삭제할 앨범아트의 id
     * @return 성공하면 true, 아니면 false
     */
    public boolean deleteArtById(String id) {
        File deleteLocation = new File(artDir + File.separator + id + ".png");
        return deleteLocation.delete();
    }

    /**
     * yt-dlp로 받아온 파일을 분석해 저장한다.
     * @param videoInfo 저장된 파일의 정보
     * @return 성공 시 true, 아니면 false
     */
    public boolean parseAndSave(VideoInfo videoInfo) {
        // 디렉터리가 존재하는지 확인하고 생성
        File dir = new File(musicDir);
        if (!dir.exists()) {
            if (!dir.mkdirs()) {
                log.error("Failed to create directory: {}", musicDir);
                return false;
            }
        }
        log.info("DBstage1 started");
        // 1. 파일의 존재를 확인한다.
        String filePath = downloadDir + File.separator + videoInfo.id + ".mp3";
        Path path = Paths.get(filePath).toAbsolutePath();
        if (!path.toFile().exists()) {
            log.error("Failed to download file: {}", filePath);
            return false;
        }
        // 2. db에 등록한다.
        log.info("DBstage2 started");
        Music music = new Music();
        music.setTitle(videoInfo.title);
        music.setArtist(videoInfo.uploader);
        music.setFavorite(false);
        music.setGroup("Unknown");
        Music savedMusic = musicRepository.save(music);
        if (savedMusic == null) {
            log.error("Failed to save music: {}", music);
            return false;
        }

        // 파일 경로 및 이름 변경
        try {
            Files.move(path, Paths.get(musicDir + File.separator + savedMusic.getId() + ".mp3"));
            return true;
        } catch (IOException e) {
            log.error("Failed to move music: {}", e.getMessage());
            return false;
        }
    }
}
