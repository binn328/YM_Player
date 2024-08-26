package com.binn328.ymplayerremake.Handler;

import com.binn328.ymplayerremake.Util.ResponseBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RequiredArgsConstructor
@Log4j2
@RestControllerAdvice
public class GlobalExceptionHandler {
    private final ResponseBuilder jsonBuilder;

//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<String> handleException(Exception e) {
//        log.error("An error occured: " + e);
//
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(jsonBuilder.error(e.getMessage()).toString());
//    }
}
