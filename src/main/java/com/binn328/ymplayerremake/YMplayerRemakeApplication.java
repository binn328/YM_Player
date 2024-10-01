package com.binn328.ymplayerremake;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class YMplayerRemakeApplication {

    public static void main(String[] args) {
        SpringApplication.run(YMplayerRemakeApplication.class, args);
    }

}
