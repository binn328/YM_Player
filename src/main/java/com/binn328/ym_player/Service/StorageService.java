package com.binn328.ym_player.Service;

import com.binn328.ym_player.Model.Music;
import com.binn328.ym_player.Repository.MusicRepository;
import com.binn328.ym_player.Util.Acoustid.AcoustID;
import com.binn328.ym_player.Util.Acoustid.ChromaPrint;
import com.binn328.ym_player.Util.Musicbrainz.MusicBrainz;
import com.binn328.ym_player.Util.TrackInformation;
import com.mpatric.mp3agic.ID3v2;
import com.mpatric.mp3agic.ID3v24Tag;
import com.mpatric.mp3agic.Mp3File;
import com.wonkglorg.ytdlp.mapper.json.VideoInfo;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

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

            Path path = Paths.get(downloadDir).resolve(UUID.randomUUID().toString() + ".mp3");


            log.info("Chromaprint statge started");
            try {
                musicFile.transferTo(path);
                
            } catch (Exception e) {

            }

            // 음악의 지문을 얻어온다.
            TrackInformation trackInformation = null;
            try {
                ChromaPrint chromaPrint = AcoustID.chromaprint(, "fpcalc");
                log.info("chromaprint: " + chromaPrint.toString());
                // 지문을 토대로 검색을 실시한다.
                String musicbrainzId = AcoustID.lookup(chromaPrint);
                // 검색에 성공하면
                if (musicbrainzId != null) {
                    // 해당 id로 정보를 얻어옴
                    trackInformation = MusicBrainz.lookup(musicbrainzId);
                } else {
                    // 검색에 실패하면
                }
            } catch (IOException e) {
                log.error("Failed to process chromaprint");
                e.printStackTrace();
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
        String filePath = downloadDir + File.separator + videoInfo.getId() + ".mp3";
        Path path = Paths.get(filePath).toAbsolutePath();
        if (!path.toFile().exists()) {
            log.error("Failed to download file: {}", filePath);
            return false;
        }


        log.info("Chromaprint statge started");
        // 음악의 지문을 얻어온다.
        TrackInformation trackInformation = null;
        try {
            ChromaPrint chromaPrint = AcoustID.chromaprint(path.toFile(), "fpcalc");
            log.info("chromaprint: " + chromaPrint.toString());
            // 지문을 토대로 검색을 실시한다.
            String musicbrainzId = AcoustID.lookup(chromaPrint);
            // 검색에 성공하면
            if (musicbrainzId != null) {
                // 해당 id로 정보를 얻어옴
                trackInformation = MusicBrainz.lookup(musicbrainzId);
            } else {
                // 검색에 실패하면
            }
        } catch (IOException e) {
            log.error("Failed to process chromaprint");
            e.printStackTrace();
        }


        // 2. db에 등록한다.
        log.info("DBstage2 started");
        Music music = new Music();

        // 검색된 정보가 있다면
        if (trackInformation != null) {
            music.setTitle(trackInformation.getTitle());
            music.setArtist(trackInformation.getArtist());
            music.setGroup(trackInformation.getRelease());
            music.setFavorite(false);
        } else {
            music.setTitle(videoInfo.getTitle());
            music.setArtist(videoInfo.getUploader());
            music.setGroup("Unknown");
            music.setFavorite(false);
        }

        Music savedMusic;
        try {
            savedMusic = musicRepository.save(music);
        } catch (Exception e) {
            log.error("error in saving music");
            return false;
        }

        // TODO: mp3에 메타데이터를 입힌다.
        try {
            Mp3File mp3File = new Mp3File(path);

            ID3v2 id3v2Tag;
            if (mp3File.hasId3v2Tag()) {
                id3v2Tag = mp3File.getId3v2Tag();
            } else {
                id3v2Tag = new ID3v24Tag();
                mp3File.setId3v2Tag(id3v2Tag);
            }

            if (trackInformation != null) {
                id3v2Tag.setTitle(trackInformation.getTitle());
                id3v2Tag.setArtist(trackInformation.getArtist());
                id3v2Tag.setAlbum(trackInformation.getRelease());

                if (trackInformation.getArtwork() != null) {
                    id3v2Tag.setAlbumImage(trackInformation.getArtwork(), "image/png");
                }
            } else {
                id3v2Tag.setTitle(videoInfo.getTitle());
                id3v2Tag.setArtist(videoInfo.getUploader());
            }
            mp3File.save(Paths.get(musicDir + File.separator + savedMusic.getId() + ".mp3").toString());
            Files.deleteIfExists(path);

            return true;
        } catch (Exception e) {
            log.error("Failed to process mp3 metadata");
            e.printStackTrace();
            return false;
        }
    }
}
