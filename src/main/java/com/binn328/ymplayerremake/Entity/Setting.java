package com.binn328.ymplayerremake.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.UUID;

@Entity
public class Setting {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // 실험적
    private Boolean autoMetadata;
}
