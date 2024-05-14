package com.binn328.ym_player.Model;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "database_sequences")
@Getter
public class DatabaseSequence {
    @Id
    private String id;

    private long seq;
}
