package com.binn328.ymplayerremake.Repository;

import com.binn328.ymplayerremake.Entity.Music;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MusicRepository extends JpaRepository<Music, UUID> {
}
