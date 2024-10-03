package com.binn328.ymplayerremake.Controller;

import com.binn328.ymplayerremake.Service.MusicbrainzService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MetadataController {
    private final MusicbrainzService metadataService;

    @GetMapping("/test/get/{title}")
    public String getMetadata(@PathVariable String title) {
        metadataService.find(title);
        return "";
    }
}
