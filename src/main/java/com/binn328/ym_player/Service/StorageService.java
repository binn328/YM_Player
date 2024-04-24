package com.binn328.ym_player.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * 파일의 관리를 담당하는 서비스
 */
@Service
public class StorageService {
    /**
     * 음악파일을 받아서 저장소에 저장하는 함수
     * @param musicFile 웹으로 전송받은 파일
     * @param fileName 저장될 파일의 이름, 데이터베이스의 id이다.
     */
    public void saveMusic(MultipartFile musicFile, String fileName) {

    }
}
