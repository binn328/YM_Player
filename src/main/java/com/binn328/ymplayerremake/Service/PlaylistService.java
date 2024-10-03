package com.binn328.ymplayerremake.Service;

import com.binn328.ymplayerremake.DTO.PlaylistDTO;
import com.binn328.ymplayerremake.Entity.Music;
import com.binn328.ymplayerremake.Entity.Playlist;
import com.binn328.ymplayerremake.Repository.MusicRepository;
import com.binn328.ymplayerremake.Repository.PlaylistRepositoy;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlaylistService {
    private final PlaylistRepositoy playlistRepositoy;
    private final MusicRepository musicRepository;

    /* CREATE */

    /**
     * 재생목록을 추가합니다.
     *
     * @param playlistDTO 추가할 재생목록 정보
     * @throws IllegalArgumentException 제공된 정보가 올바르지 않으면 에러를 일으킵니다.
     */
    @Transactional
    public void addPlaylist(PlaylistDTO playlistDTO) {
        if (playlistDTO == null || playlistDTO.getName() == null || playlistDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Playlist name must not be null");
        }

        Playlist playlist = new Playlist();
        playlist.setName(playlistDTO.getName());


        playlistRepositoy.save(playlist);
    }

    /* READ */

    /**
     * 전체 재생목록 목록을 반환합니다.
     *
     * @return 성공 시 재생목록 목록을 반환합니다.
     */
    public List<Playlist> getPlaylists() {
        List<Playlist> playlists = playlistRepositoy.findAll();
        return playlists;
    }

    /**
     * id에 해당하는 재생목록 정보를 반환합니다.
     *
     * @param id 찾을 재생목록의 id
     * @return 성공 시 해당 재생목록의 정보를 반환합니다.
     * 실패 시 에러를 일으킵니다.
     * @throws EntityNotFoundException 해당하는 재생목록이 없으면 에러를 일으킵니다.
     */
    public Playlist getPlaylist(UUID id) {
        return playlistRepositoy.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Playlist not found with id: " + id));
    }

    /* UPDATE */
    @Transactional
    public Playlist editPlaylist(UUID id, PlaylistDTO playlistDTO) {
        // id에 해당하는 playlist를 가져온다. 없으면 에러를 발생시킨다.
        Playlist originalPlaylist = playlistRepositoy.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Playlist not found with id: " + id));

        // 재생목록의 이름을 설정한다.
        if (playlistDTO.getName() != null || !playlistDTO.getName().trim().isEmpty()) {
            originalPlaylist.setName(playlistDTO.getName());
        }

        // 재생목록에 포함되는 음악 목록을 갱신한다.
        if (playlistDTO.getMusics() != null) {
            Set<Music> musics = new HashSet<>();
            for (UUID uuid: playlistDTO.getMusics()) {
                Music music = musicRepository.findById(uuid)
                        .orElseThrow(() -> new EntityNotFoundException("Music not found with id: " + uuid));
                musics.add(music);
            }
            // manyToMany라서 음악 목록을 제공해야한다.
            // 재생목록은 많아봐야 수백개이므로 성능 문제는 적을 것이다.
            originalPlaylist.setMusics(musics);
        }

        // DB에 적용한다.
        return playlistRepositoy.save(originalPlaylist);
    }

    /**
     * 특정 재생 목록을 제거합니다.
     * @param id 제거할 재생목록의 id
     */
    @Transactional
    public void deletePlaylist(UUID id) {
        Playlist playlist = playlistRepositoy.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Playlist not found with id: " + id));
        playlistRepositoy.delete(playlist);
    }

    /* DELETE */

}
