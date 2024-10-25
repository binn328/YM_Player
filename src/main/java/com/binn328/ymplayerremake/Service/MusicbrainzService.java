package com.binn328.ymplayerremake.Service;
import com.binn328.ymplayerremake.DTO.MBAlbum;
import com.binn328.ymplayerremake.DTO.MBArtist;
import com.binn328.ymplayerremake.DTO.MBMusic;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.UUID;
import java.io.UnsupportedEncodingException;

@Service
public class MusicbrainzService {

    /**
     * 음악 정보를 가져옵니다.
     *
     * @param title  음악 제목
     * @param artist 아티스트 이름
     * @return MBMusic 객체 또는 null (음악 정보를 찾지 못한 경우)
     */
    public MBMusic getMusicInfo(String title, String artist) {
        RestTemplate restTemplate = new RestTemplate();

        try {
            String url = createUrl(title, artist);  // 제목과 아티스트를 인코딩하여 API URL 생성
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            JsonNode recordings = response.path("recordings");  // 응답에서 'recordings' 배열 추출

            // recordings 배열이 비어있지 않으면 첫 번째 결과를 사용
            if (recordings.isArray() && recordings.size() > 0) {
                JsonNode bestMatch = recordings.get(0);  // 첫 번째 검색 정보를 가져옴

                MBMusic music = new MBMusic();
                music.setId(UUID.randomUUID());  // UUID 생성 또는 MusicBrainz ID 사용
                music.setTitle(bestMatch.path("title").asText());
                music.setLength(bestMatch.path("length").asInt(0));  // 트랙 길이 설정
                music.setMusicbrainz_id(bestMatch.path("id").asText());  // MusicBrainz ID 설정

                return music;
            } else {
                System.out.println("No recordings found.");  // 검색 결과가 없을 때 메시지 출력
            }

        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();  // URL 인코딩 오류 처리
        } catch (Exception e) {
            e.printStackTrace();  // 일반적인 예외 처리
        }

        return null;  // 결과가 없을 때 null 반환
    }
    /**
     * 앨범 정보를 가져옵니다.
     *
     * @param title  앨범 제목
     * @param artist 아티스트 이름
     * @return MBAlbum 객체 또는 null (앨범 정보를 찾지 못한 경우)
     */
    public MBAlbum getAlbumInfo(String title, String artist) {
        RestTemplate restTemplate = new RestTemplate();  // REST API 호출을 위한 객체

        try {
            String url = createUrl(title, artist);  // 제목과 아티스트를 인코딩하여 API URL 생성
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);  // API 호출 및 응답 받기
            JsonNode recordings = response.path("recordings");  // 응답에서 'recordings' 배열 추출

            // recordings 배열이 비어있지 않으면 첫 번째 결과를 사용
            if (recordings.isArray() && recordings.size() > 0) {
                JsonNode bestMatch = recordings.get(0);  // 첫 번째 검색 정보를 가져옴

                JsonNode artistCredit = bestMatch.path("artist-credit");
                JsonNode firstRelease = bestMatch.path("releases").get(0);  // 첫 번째 릴리즈 정보 가져오기

                if (artistCredit.isArray() && artistCredit.size() > 0) {
                    MBAlbum album = new MBAlbum();
                    album.setId(UUID.randomUUID());  // 고유 ID 생성
                    album.setTitle(firstRelease.path("title").asText());  // 앨범 제목 설정

                    // 릴리즈 날짜를 다양한 형식으로 처리
                    String dateString = firstRelease.path("date").asText();
                    LocalDate releaseDate = null;

                    // 날짜 형식에 따라 처리
                    if (dateString != null && !dateString.isEmpty()) {
                        if (dateString.length() == 4) {
                            releaseDate = LocalDate.of(Integer.parseInt(dateString), 1, 1);  // 연도만 있을 경우
                        } else if (dateString.length() == 7) {
                            YearMonth yearMonth = YearMonth.parse(dateString);  // '1997-12' 형식 처리
                            releaseDate = yearMonth.atDay(1);  // 해당 월의 첫 번째 날 설정
                        } else {
                            releaseDate = LocalDate.parse(dateString);  // 전체 날짜가 있을 경우
                        }
                    } else {
                        System.out.println("Release date is empty or null.");  // 날짜가 없을 때 처리
                    }

                    album.setReleaseDate(releaseDate);  // 릴리즈 날짜 설정
                    album.setCountry(firstRelease.path("country").asText(""));  // 국가 정보 설정
                    album.setMusicbrainz_id(firstRelease.path("id").asText());  // MusicBrainz ID 설정

                    return album;
                }
            } else {
                System.out.println("No recordings found.");  // 검색 결과가 없을 때 메시지 출력
            }

        } catch (Exception e) {
            e.printStackTrace();  // 일반적인 예외 처리
        }
        return null;  // 결과가 없을 때 null 반환
    }

    /**
     * 아티스트 정보를 가져옵니다.
     *
     * @param title  아티스트의 트랙 제목
     * @param artist 아티스트 이름
     * @return MBArtist 객체 또는 null (아티스트 정보를 찾지 못한 경우)
     */
    public MBArtist getArtistInfo(String title, String artist) {
        RestTemplate restTemplate = new RestTemplate();  // REST API 호출을 위한 객체

        try {
            String url = createUrl(title, artist);  // 제목과 아티스트를 인코딩하여 API URL 생성
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);  // API 호출 및 응답 받기
            JsonNode recordings = response.path("recordings");  // 응답에서 'recordings' 배열 추출

            // recordings 배열이 비어있지 않으면 첫 번째 결과를 사용
            if (recordings.isArray() && recordings.size() > 0) {
                JsonNode bestMatch = recordings.get(0);  // 첫 번째 검색 정보를 가져옴
                JsonNode artistCredit = bestMatch.path("artist-credit");  // 아티스트 크레딧 추출

                // artist-credit 배열이 비어있지 않으면 첫 번째 아티스트 정보를 사용
                if (artistCredit.isArray() && artistCredit.size() > 0) {
                    JsonNode artistNode = artistCredit.get(0).path("artist");  // 첫 번째 아티스트 정보 가져오기

                    MBArtist artistObj = new MBArtist();
                    artistObj.setId(UUID.randomUUID());  // 고유 ID 생성
                    artistObj.setName(artistNode.path("name").asText());  // 아티스트 이름 설정
                    artistObj.setMusicbrainz_id(artistNode.path("id").asText());  // MusicBrainz ID 설정

                    return artistObj;
                } else {
                    System.out.println("No artist-credit found.");  // artist-credit이 없을 때 메시지 출력
                }
            } else {
                System.out.println("No recordings found.");  // 검색 결과가 없을 때 메시지 출력
            }

        } catch (Exception e) {
            e.printStackTrace();  // 일반적인 예외 처리
        }
        return null;  // 결과가 없을 때 null 반환
    }

    /**
     * 제목과 아티스트 이름을 기반으로 MusicBrainz API에 대한 URL을 생성합니다.
     *
     * @param title  음악 제목
     * @param artist 아티스트 이름
     * @return 생성된 URL
     * @throws UnsupportedEncodingException 인코딩 오류가 발생할 경우
     */
    private String createUrl(String title, String artist) throws UnsupportedEncodingException {
        // 제목과 아티스트 이름을 URL에 사용할 수 있도록 인코딩 (띄어쓰기 처리)
        String encodedTitle = URLEncoder.encode(title, "UTF-8");
        String encodedArtist = URLEncoder.encode(artist, "UTF-8");

        // 인코딩된 값으로 API URL 생성
        return "https://musicbrainz.org/ws/2/recording?query=recording:\"" + encodedTitle + "\" AND artist:\"" + encodedArtist + "\"&fmt=json";
    }

}
