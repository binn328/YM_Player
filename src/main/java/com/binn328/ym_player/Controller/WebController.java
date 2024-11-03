package com.binn328.ym_player.Controller;

import jakarta.websocket.OnError;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 요청을 받으면 페이지를 반환해주는 컨트롤러
 */
@Controller
@CrossOrigin(origins = "*")
public class WebController implements ErrorController {
    @GetMapping({"/", "/error"})
    public String homePage() {
        return "index.html" ;
    }


}
