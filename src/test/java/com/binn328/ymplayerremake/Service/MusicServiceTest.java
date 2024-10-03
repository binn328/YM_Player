package com.binn328.ymplayerremake.Service;

import com.binn328.ymplayerremake.Repository.MusicRepository;
import com.binn328.ymplayerremake.Util.EnvStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class MusicServiceTest {

    @Mock
    private FileService fileService;

    @Mock
    private MusicRepository musicRepository;

    @Mock
    private EnvStore envStore;

    @InjectMocks
    private MusicService musicService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addMusic() {
    }

    @Test
    void getMusicsInfo() {
    }

    @Test
    void getMusicInfo() {
    }

    @Test
    void getMusicFile() {
    }

    @Test
    void editMusicInfo() {
    }

    @Test
    void editMusicFile() {
    }

    @Test
    void deleteMusic() {
    }
}
