package com.binn328.ymplayerremake.Repository;

import com.binn328.ymplayerremake.Entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SettingRepository extends JpaRepository<Setting, UUID> {
}
