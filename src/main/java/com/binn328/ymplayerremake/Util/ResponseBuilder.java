package com.binn328.ymplayerremake.Util;

import com.binn328.ymplayerremake.DTO.CustomResponse;
import org.springframework.stereotype.Component;

@Component
public class ResponseBuilder {
    /**
     * 성공 응답을 생성합니다.
     * @param message
     * @return
     */
    public CustomResponse success(String message) {
        return new CustomResponse("success", message, null);
    }

    /**
     * 데이터가 담긴 성공 응답을 생성합니다.
     * @param message
     * @param data
     * @return
     */
    public CustomResponse success(String message, Object data) {
        return new CustomResponse("success", message, data);
    }

    /**
     * 에러 응답을 생성합니다.
     * @param message
     * @return
     */
    public CustomResponse error(String message) {
        return new CustomResponse("error", message, null);
    }
}
