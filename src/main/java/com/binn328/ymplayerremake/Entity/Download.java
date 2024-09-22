package com.binn328.ymplayerremake.Entity;

import com.binn328.ymplayerremake.Util.DownloadState;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
public class Download {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;
    private DownloadState state;
    private String title;

    @CreationTimestamp
    private LocalDateTime created;
}
