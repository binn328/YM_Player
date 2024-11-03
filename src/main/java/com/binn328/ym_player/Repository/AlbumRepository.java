package com.binn328.ym_player.Repository;

import com.binn328.ym_player.Model.Album;
import com.binn328.ym_player.Model.Music;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumRepository extends MongoRepository<Album, String> {
}
