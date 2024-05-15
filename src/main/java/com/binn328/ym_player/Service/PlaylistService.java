package com.binn328.ym_player.Service;

import com.binn328.ym_player.Model.MusicIdOrder;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
@NoArgsConstructor
/**
 * playlist를 관리하는 서비스
 */
public class PlaylistService {
    /**
     * musics의 순서, order를 검사하고 유효하지 않으면 유효하게 변경해주는 함수
     * @param musics 검사할 음악들이 담긴 리스트
     * @return 검사와 변경이 끝난 리스트
     */
    public List<MusicIdOrder> orderCheck(List<MusicIdOrder> musics) {
        for (MusicIdOrder music : musics) {
            // order가 null(0) 이거나 음수면 올바른 값으로 변환
            if (music.getOrder() <= 0) {
                music.setOrder(getValidOrder(musics));
            }
        }

        // order를 기준으로 정렬한다.
        musics.sort(Comparator.comparingInt(MusicIdOrder::getOrder));

        // order를 순서대로 조정한다.
        int order = 1;
        for (MusicIdOrder music : musics) {
            music.setOrder(order++);
        }

        return musics;
    }

    private int getValidOrder(List<MusicIdOrder> musics) {
        int maxOrder = 0;
        for (MusicIdOrder music : musics) {
            if (music.getOrder() > maxOrder) {
                maxOrder = music.getOrder();
            }
        }
        return maxOrder + 1;
    }
}
