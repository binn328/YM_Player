package com.binn328.ymplayerremake.Handler;

import com.binn328.ymplayerremake.DTO.CustomResponse;
import com.binn328.ymplayerremake.Util.ResponseBuilder;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.hibernate.boot.model.naming.IllegalIdentifierException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;

@RequiredArgsConstructor
@Log4j2
@RestControllerAdvice
public class GlobalExceptionHandler {
    private final ResponseBuilder responseBuilder;

    /**
     * IOException 을 다루는 전역 에러 처리 함수입니다.
     * @param e IOException
     * @return 파일 처리 오류 발생으로 HTTP 상태코드 500(INTERNAL_SERVER_ERROR)와 오류 메시지를 담은 응답을 반환합니다.
     */
    @ExceptionHandler(IOException.class)
    public ResponseEntity<CustomResponse> handleIOException(IOException e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(responseBuilder.error("File processing error: " + e.getMessage()));
    }

    /**
     * EntityNotFoundException 을 다루는 전역 에러 처리 함수입니다.
     * @param e EntityNotFoundException
     * @return id에 해당하는 엔티티가 데이터베이스에 없어 HTTP 상태코드 404(NOT_FOUND)를 반환합니다.
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<CustomResponse> handleEntityNotFoundException(EntityNotFoundException e) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(responseBuilder.error(e.getMessage()));
    }

    /**
     * IllegalArgumentException 을 다루는 전역 에러 처리 함수입니다.
     * @param e IllegalArgumentException
     * @return 유효성 검사에 실패하여 HTTP 상태코드 400(BAD_REQUEST)와 오류 메시지를 담은 응답을 반환합니다.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<CustomResponse> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(responseBuilder.error(e.getMessage()));
    }
}
