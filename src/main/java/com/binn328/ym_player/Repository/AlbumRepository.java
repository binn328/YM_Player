package com.binn328.ym_player.Repository;

import com.binn328.ym_player.Model.Album;
import com.binn328.ym_player.Model.Music;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AlbumRepository extends MongoRepository<Album, String> {
}
