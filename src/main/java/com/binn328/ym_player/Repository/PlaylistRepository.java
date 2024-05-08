package com.binn328.ym_player.Repository;

import com.binn328.ym_player.Model.Playlist;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistRepository extends MongoRepository<Playlist, String> {
}
