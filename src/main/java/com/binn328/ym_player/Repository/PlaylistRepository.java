package com.binn328.ym_player.Repository;

import com.binn328.ym_player.Model.Playlist;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PlaylistRepository extends MongoRepository<Playlist, String> {
}
