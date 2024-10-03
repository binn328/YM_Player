package com.binn328.ymplayerremake.Service;

import com.binn328.ymplayerremake.Entity.Music;
import com.binn328.ymplayerremake.Repository.MusicRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MusicService {
    private final MusicRepository musicRepository;
    private final FileService fileService;

    /* CREATE */

    /**
     * 음악을 추가합니다.
     *
     * @param music 추가할 음악의 정보
     * @param file  추가할 음악 파일
     * @throws IOException 파일 입출력 중 문제가 생기면 에러를 일으킵니다.
     */
    @Transactional
    public void addMusic(Music music, MultipartFile file) throws IOException {
        /* 유효성 검사하기 */
        // music null 여부 검사
        if (music == null || music.getTitle() == null || music.getTitle().equals("")) {
            throw new IllegalArgumentException("Music must not be null");
        }

        // file null 여부 검사
        if (file == null || file.getSize() == 0) {
            throw new IllegalArgumentException("Music file must not be null");
        }

        //파일 타입 검사
        String mimeType = fileService.getMimeType(file);

        if (!mimeType.equals("audio/mpeg")) {
            throw new IllegalArgumentException("Music file must have audio extension");
        }

        /* 파일 저장하기 */
        UUID uuid = UUID.randomUUID();
        String filename = uuid.toString() + ".mp3";
        Path filePath = fileService.saveFile(file, filename);

        /* DB 저장하기 */
        music.setFilePath(filePath.toString());

        try {
            musicRepository.save(music);
        } catch (Exception e) {
            // DB 저장에 실패하면 저장된 파일을 삭제
            fileService.deleteFile(filePath);
            throw e;
        }
    }

    /* READ */

    /**
     * 전체 음악 목록을 반환합니다.
     *
     * @return 성공 시 음악 목록을 반환합니다.
     */
    public List<Music> getMusicsInfo() {
        List<Music> musics = musicRepository.findAll();
        return musics;
    }

    /**
     * id에 해당하는 음악 정보를 반환합니다.
     *
     * @param id 찾을 음악의 ID
     * @return 성공 시 해당 음악의 정보를 반환합니다.
     * 실패 시 에러를 발생시킵니다.
     * @throws EntityNotFoundException 해당하는 음악이 없을 경우 에러를 일으킵니다.
     */
    public Music getMusicInfo(UUID id) {
        return musicRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Muisc not found with id: " + id));
    }

    /**
     * 음악 파일을 반환합니다.
     *
     * @param id 찾을 음악의 id
     * @return 해당하는 음악이 있으면 파일로 반환합니다.
     * @throws IOException             음악을 찾는 중 문제가 있으면 에러를 일으킵니다.
     * @throws EntityNotFoundException 해당하는 음악이 없을 경우 에러를 일으킵니다.
     */
    public Resource getMusicFile(UUID id) throws IOException {
        Music music = getMusicInfo(id);
        File file = Path.of(music.getFilePath()).toFile();
        if (!file.exists()) {
            throw new IOException("Can't find music file with id: " + id);
        }
        return new FileSystemResource(file);
    }

    /* UPDATE */

    /**
     * 음악의 정보를 수정합니다.
     *
     * @param id          수정할 음악의 id
     * @param editedMusic 수정된 음악의 정보
     * @return 수정된 음악의 정보를 반환합니다.
     * @throws EntityNotFoundException 해당하는 음악이 없을 경우 에러를 일으킵니다.
     */
    @Transactional
    public Music editMusicInfo(UUID id, Music editedMusic) {
        // 유효성 검사
        if (editedMusic == null || editedMusic.getTitle() == null || editedMusic.getTitle().equals("")) {
            throw new IllegalArgumentException("Music must not be null");
        }

        // 해당하는 음악이 있는지 검사
        Music music = getMusicInfo(id);

        // 업데이트
        music.setTitle(editedMusic.getTitle());

        music.setMusicbrainzId(editedMusic.getMusicbrainzId());
        // TODO musicbrainzID가 제공되면 다른 로직을 적용하자

        // 저장
        return musicRepository.save(music);
    }

    /**
     * 음악 파일을 교체합니다.
     *
     * @param id   교체할 음악의 id
     * @param file 교체할 음악 파일
     * @throws IOException              파일 처리 중 문제가 발생하면 에러를 일으킵니다.
     * @throws IllegalArgumentException 주어진 매개변수가 올바르지 않으면 에러를 일으킵니다.
     */
    public void editMusicFile(UUID id, MultipartFile file) throws IOException {
        // 파일 유효성 검사
        if (file == null || file.getSize() == 0) {
            throw new IllegalArgumentException("Music file must not be null");
        }

        //파일 타입 검사
        String mimeType = fileService.getMimeType(file);

        if (!mimeType.equals("audio/mpeg")) {
            throw new IllegalArgumentException("Music file must have audio extension");
        }

        // id 유효성 검사
        Music music;
        try {
            music = getMusicInfo(id);
        } catch (EntityNotFoundException e) {
            throw new IllegalArgumentException("Music not found with id: " + id);
        }

        // TODO 파일에 메타데이터 설정하기

        // 파일 교체
        Path originalFilePath = Path.of(music.getFilePath());
        fileService.saveFile(file, originalFilePath);
    }



    /* DELETE */

    /**
     * 특정 음악을 제거합니다.
     *
     * @param id 제거할 음악의 ID
     * @throws IOException 파일 삭제 중 문제가 발생하면 에러를 일으킵니다.
     */
    @Transactional
    public void deleteMusic(UUID id) throws IOException {
        Music music = getMusicInfo(id);
        fileService.deleteFile(music.getFilePath());
        musicRepository.delete(music);
    }


}
