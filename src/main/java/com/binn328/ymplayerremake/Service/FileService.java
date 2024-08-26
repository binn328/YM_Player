package com.binn328.ymplayerremake.Service;

import com.binn328.ymplayerremake.Util.EnvStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class FileService {
    private final EnvStore envStore;

    /**
     * 임시 파일을 생성하고 MIME 타입을 반환합니다.
     * @param file 검사할 파일
     * @return MIME 타입
     * @throws IOException 파일 입출력 중 문제가 생기면 에러를 일으킵니다.
     */
    public String getMimeType(MultipartFile file) throws IOException {
        // file type 검사
        Path tempFile = Files.createTempFile(
                "upload-",
                file.getOriginalFilename()
                        .replaceAll(
                                "[^a-zA-Z0-9.\\-]",
                                "_"
                        )
        );
        try {
            file.transferTo(tempFile.toFile());
            return Files.probeContentType(tempFile);
        } finally {
            Files.deleteIfExists(tempFile);
        }
    }

    /**
     * 파일을 저장합니다.
     * @param file 저장할 파일
     * @param filename 저장될 파일의 이름
     * @return 저장된 파일 경로
     * @throws IOException 파일 저장 중 문제가 생기면 에러를 일으킵니다.
     */
    public Path saveFile(MultipartFile file, String filename) throws IOException {
        Path filePath = envStore.getMusicDir().resolve(filename);
        file.transferTo(filePath.toFile());
        return filePath;
    }

    /**
     * 파일을 삭제합니다.
     * @param path 삭제할 파일의 경로
     * @throws IOException 파일 삭제 중 문제가 발생하면 에러를 일으킵니다.
     */
    public void deleteFile(Path path) throws IOException {
        Files.deleteIfExists(path);
    }

    /**
     * 파일을 삭제합니다.
     * @param path 삭제할 파일의 경로
     * @throws IOException 파일 삭제 중 문제가 발생하면 에러를 일으킵니다.
     */
    public void deleteFile(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        Files.deleteIfExists(path);
    }
}
