package com.binn328.ym_player.Listener;

import com.binn328.ym_player.Model.MusicId;
import com.binn328.ym_player.Service.SequenceGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
/**
 * MusicId를 생성할 때 order를 AutoIncreament 해주는 리스너
 * TODO 하나의 Document가 아니라 여러개의 Document가 있으므로 id를 생성해서 따로 만들어주어야할까?
 */
public class MusicIdModelListener extends AbstractMongoEventListener<MusicId> {
    private final SequenceGeneratorService sequenceGeneratorService;


    @Override
    public void onBeforeConvert(BeforeConvertEvent<MusicId> event) {
        if (event.getSource().getOrder() < 1) {
            event.getSource().setOrder(sequenceGeneratorService.generateSequence(MusicId.SEQUENCE_NAME));
        }
    }
}
