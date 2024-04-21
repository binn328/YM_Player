package com.binn328.ym_player.Repository;

import com.binn328.ym_player.DAO.Music;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * 음악 파일에 관련된 DB을 조작하는 레포지토리
 */
@Repository
public interface MusicRepository extends MongoRepository<Music, String> {

}
