package com.binn328.ym_player.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TestController {

    @GetMapping("/")
    public String hello() {
        return "hello.html";
    }
}
