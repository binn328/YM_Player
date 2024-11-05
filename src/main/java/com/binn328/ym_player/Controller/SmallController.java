package com.binn328.ym_player.Controller;

import com.binn328.ym_player.Util.Acoustid.AcoustID;
import com.binn328.ym_player.Util.Acoustid.ChromaPrint;
import com.binn328.ym_player.Util.Musicbrainz.MusicBrainz;
import com.binn328.ym_player.Util.TrackInformation;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Log4j2
@RestController
@RequestMapping("/api/test")
public class SmallController {

    @GetMapping()
    public ResponseEntity<String> apiTest() {
        return ResponseEntity.ok("wellcome to test!!!!");
    }

    @GetMapping("/{musicId}")
    public ResponseEntity<String> chromaPrintTest(@PathVariable String musicId) throws IOException {
        Path path = Paths.get(System.getenv("DATA_DIR") + File.separator + "music");
        File file = path.resolve(musicId + ".mp3").toFile();
        log.info("filename: " + file.getAbsolutePath());
        log.info("isfile?: " + file.exists());

        ChromaPrint chromaPrint = AcoustID.chromaprint(file, "fpcalc");
        log.info("지문: " + chromaPrint.getChromaprint());
        String mbId;
        try {
            mbId = AcoustID.lookup(chromaPrint);
        } catch (Exception e) {
            log.error(new StringBuilder().append("검색 중 오류 발생: "));
            e.printStackTrace();
            mbId = "error";
        }

        log.info(mbId);

        TrackInformation trackInformation;
        try {
            trackInformation = MusicBrainz.lookup(mbId);
        } catch (Exception e) {
            log.error("mbID 처리중 문제 발생");
            e.printStackTrace();
            return ResponseEntity.ok("실패!");
        }



        return ResponseEntity.ok(trackInformation.toString());
    }
}
