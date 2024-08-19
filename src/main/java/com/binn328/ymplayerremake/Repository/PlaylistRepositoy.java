package com.binn328.ymplayerremake.Repository;

import com.binn328.ymplayerremake.Entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PlaylistRepositoy extends JpaRepository<Playlist, UUID> {
}
