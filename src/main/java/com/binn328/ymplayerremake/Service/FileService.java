package com.binn328.ymplayerremake.Service;

import com.binn328.ymplayerremake.Util.EnvStore;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Log4j2
@Service
@RequiredArgsConstructor
public class FileService {
    private final EnvStore envStore;

    /**
     * 프로그램이 실행될 때 디렉터리가 존재하지 않으면 만듭니다.
     */
    @PostConstruct
    public void init() {
        createDirectory(envStore.getRootPath());
        createDirectory(envStore.getDownloadPath());
        createDirectory(envStore.getTempPath());
        createDirectory(envStore.getMusicPath());
    }

    /**
     * 주어진 경로에 디렉터리를 생성합니다.
     * @param path 디렉터리 경로
     */
    private void createDirectory(Path path) {
        try {
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                log.info("Create directory: " + path);
            }
        } catch (IOException e) {
            log.error(e);
        }
    }

    /**
     * 임시 파일을 생성하고 MIME 타입을 반환합니다.
     * @param file 검사할 파일
     * @return MIME 타입
     * @throws IOException 파일 입출력 중 문제가 생기면 에러를 일으킵니다.
     */
    public String getMimeType(MultipartFile file) {
        // file type 검사
        // TODO 이 로직을 사용하면 파일 저장에 문제가 생김, 아마도 임시파일과 관련된 문제로 보임
//        Path tempFile = Files.createTempFile(
//                "upload-",
//                file.getOriginalFilename()
//                        .replaceAll(
//                                "[^a-zA-Z0-9.\\-]",
//                                "_"
//                        )
//        );
//        try {
//            file.transferTo(tempFile.toFile());
//            return Files.probeContentType(tempFile);
//        } catch (IOException e) {
//            log.error("mimeType check error: " + e.getMessage());
//            Files.deleteIfExists(tempFile);
//            return "";
//        }
        return file.getContentType();
    }

    /**
     * 파일을 저장합니다.
     * @param file 저장할 파일
     * @param filename 저장될 파일의 이름
     * @return 저장된 파일 경로
     * @throws IOException 파일 저장 중 문제가 생기면 에러를 일으킵니다.
     */
    public Path saveFile(MultipartFile file, String filename) throws IOException {
        Path filePath = envStore.getMusicPath().resolve(filename);
        log.info("Save file: " + filePath);

        if (file.isEmpty()) {
            log.info("File is empty");
            throw new IllegalArgumentException("The provided file is empty.");
        }

        try {
            file.transferTo(filePath.toFile());
        } catch (IOException e) {
            log.error("Error saving file: " + filename, e);
            throw new IOException("There was a problem saving the file: " + filename, e);
        }

        return filePath;
    }

    /**
     * 파일을 저장합니다.
     * @param file 저장할 파일
     * @param filename 저장될 파일의 이름
     * @return 저장된 파일 경로
     * @throws IOException 파일 저장 중 문제가 생기면 에러를 일으킵니다.
     */
    public Path saveFile(MultipartFile file, Path filePath) throws IOException {
        log.info("Save file: " + filePath);
        file.transferTo(filePath.toFile());
        return filePath;
    }



    /**
     * 파일을 삭제합니다.
     * @param path Path 타입의 삭제할 파일의 경로
     * @throws IOException 파일 삭제 중 문제가 발생하면 에러를 일으킵니다.
     */
    public void deleteFile(Path path) throws IOException {
        Files.deleteIfExists(path);
    }

    /**
     * 파일을 삭제합니다.
     * @param path String 타입의 삭제할 파일의 경로
     * @throws IOException 파일 삭제 중 문제가 발생하면 에러를 일으킵니다.
     */
    public void deleteFile(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        Files.deleteIfExists(path);
    }
}
