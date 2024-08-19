package com.binn328.ymplayerremake.Repository;

import com.binn328.ymplayerremake.Entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ArtistRepository extends JpaRepository<Artist, UUID> {
}
