package com.binn328.ym_player.Controller;

import jakarta.websocket.OnError;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 요청을 받으면 페이지를 반환해주는 컨트롤러
 */
@Controller
public class WebController {
    @GetMapping({"/", "/error"})
    public String homePage() {
        return "index.html";
    }

}
