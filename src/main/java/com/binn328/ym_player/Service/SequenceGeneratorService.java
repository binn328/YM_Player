package com.binn328.ym_player.Service;

import com.binn328.ym_player.Model.DatabaseSequence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.Objects;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
/**
 * AutoIncreament를 구현하는 서비스
 */
public class SequenceGeneratorService {
    private final MongoOperations mongoOperations;
    public SequenceGeneratorService(MongoOperations mongoOperations) {
        this.mongoOperations = mongoOperations;
    }

    public long generateSequence(String sequenceName) {
        DatabaseSequence counter =
                mongoOperations.findAndModify(
                        Query.query(where("_id").is(sequenceName)),
                        new Update().inc("seq", 1),
                        FindAndModifyOptions.options().returnNew(true).upsert(true),
                        DatabaseSequence.class);
        return !Objects.isNull(counter) ? counter.getSeq() : 1;
    }
}
