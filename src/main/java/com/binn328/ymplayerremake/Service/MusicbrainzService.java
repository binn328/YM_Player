package com.binn328.ymplayerremake.Service;
import com.binn328.ymplayerremake.DTO.MBMusic;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.YearMonth;
import java.io.UnsupportedEncodingException;

@Service
public class MusicbrainzService {

//    /**
//     * 음악 정보를 가져옵니다.
//     *
//     * @param title  음악 제목
//     * @param artist 아티스트 이름
//     * @return MBMusic 객체 또는 null (음악 정보를 찾지 못한 경우)
//     */
//    public MBMusic getMusicInfo(String title, String artist) {
//        RestTemplate restTemplate = new RestTemplate();
//
//        try {
//            String url = createUrl(title, artist);  // 제목과 아티스트를 인코딩하여 API URL 생성
//            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
//            JsonNode recordings = response.path("recordings");  // 응답에서 'recordings' 배열 추출
//
//            // recordings 배열이 비어있지 않으면 첫 번째 결과를 사용
//            if (recordings.isArray() && recordings.size() > 0) {
//                JsonNode bestMatch = recordings.get(0);  // 첫 번째 검색 정보를 가져옴
//
//                MBMusic music = new MBMusic();
//                music.setId(UUID.randomUUID());  // UUID 생성 또는 MusicBrainz ID 사용
//                music.setTitle(bestMatch.path("title").asText());
//                music.setLength(bestMatch.path("length").asInt(0));  // 트랙 길이 설정
//                music.setMusicbrainz_id(bestMatch.path("id").asText());  // MusicBrainz ID 설정
//
//                return music;
//            } else {
//                System.out.println("No recordings found.");  // 검색 결과가 없을 때 메시지 출력
//            }
//
//        } catch (UnsupportedEncodingException e) {
//            e.printStackTrace();  // URL 인코딩 오류 처리
//        } catch (Exception e) {
//            e.printStackTrace();  // 일반적인 예외 처리
//        }
//
//        return null;  // 결과가 없을 때 null 반환
//    }
//    /**
//     * 앨범 정보를 가져옵니다.
//     *
//     * @param title  앨범 제목
//     * @param artist 아티스트 이름
//     * @return MBAlbum 객체 또는 null (앨범 정보를 찾지 못한 경우)
//     */
//    public MBAlbum getAlbumInfo(String title, String artist) {
//        RestTemplate restTemplate = new RestTemplate();  // REST API 호출을 위한 객체
//
//        try {
//            String url = createUrl(title, artist);  // 제목과 아티스트를 인코딩하여 API URL 생성
//            JsonNode response = restTemplate.getForObject(url, JsonNode.class);  // API 호출 및 응답 받기
//            JsonNode recordings = response.path("recordings");  // 응답에서 'recordings' 배열 추출
//
//            // recordings 배열이 비어있지 않으면 첫 번째 결과를 사용
//            if (recordings.isArray() && recordings.size() > 0) {
//                JsonNode bestMatch = recordings.get(0);  // 첫 번째 검색 정보를 가져옴
//
//                JsonNode artistCredit = bestMatch.path("artist-credit");
//                JsonNode firstRelease = bestMatch.path("releases").get(0);  // 첫 번째 릴리즈 정보 가져오기
//
//                if (artistCredit.isArray() && artistCredit.size() > 0) {
//                    MBAlbum album = new MBAlbum();
//                    album.setId(UUID.randomUUID());  // 고유 ID 생성
//                    album.setTitle(firstRelease.path("title").asText());  // 앨범 제목 설정
//
//                    // 릴리즈 날짜를 다양한 형식으로 처리
//                    String dateString = firstRelease.path("date").asText();
//                    LocalDate releaseDate = null;
//
//                    // 날짜 형식에 따라 처리
//                    if (dateString != null && !dateString.isEmpty()) {
//                        if (dateString.length() == 4) {
//                            releaseDate = LocalDate.of(Integer.parseInt(dateString), 1, 1);  // 연도만 있을 경우
//                        } else if (dateString.length() == 7) {
//                            YearMonth yearMonth = YearMonth.parse(dateString);  // '1997-12' 형식 처리
//                            releaseDate = yearMonth.atDay(1);  // 해당 월의 첫 번째 날 설정
//                        } else {
//                            releaseDate = LocalDate.parse(dateString);  // 전체 날짜가 있을 경우
//                        }
//                    } else {
//                        System.out.println("Release date is empty or null.");  // 날짜가 없을 때 처리
//                    }
//
//                    album.setReleaseDate(releaseDate);  // 릴리즈 날짜 설정
//                    album.setCountry(firstRelease.path("country").asText(""));  // 국가 정보 설정
//                    album.setMusicbrainz_id(firstRelease.path("id").asText());  // MusicBrainz ID 설정
//
//                    return album;
//                }
//            } else {
//                System.out.println("No recordings found.");  // 검색 결과가 없을 때 메시지 출력
//            }
//
//        } catch (Exception e) {
//            e.printStackTrace();  // 일반적인 예외 처리
//        }
//        return null;  // 결과가 없을 때 null 반환
//    }
//
//    /**
//     * 아티스트 정보를 가져옵니다.
//     *
//     * @param title  아티스트의 트랙 제목
//     * @param artist 아티스트 이름
//     * @return MBArtist 객체 또는 null (아티스트 정보를 찾지 못한 경우)
//     */
//    public MBArtist getArtistInfo(String title, String artist) {
//        RestTemplate restTemplate = new RestTemplate();  // REST API 호출을 위한 객체
//
//        try {
//            String url = createUrl(title, artist);  // 제목과 아티스트를 인코딩하여 API URL 생성
//            JsonNode response = restTemplate.getForObject(url, JsonNode.class);  // API 호출 및 응답 받기
//            JsonNode recordings = response.path("recordings");  // 응답에서 'recordings' 배열 추출
//
//            // recordings 배열이 비어있지 않으면 첫 번째 결과를 사용
//            if (recordings.isArray() && recordings.size() > 0) {
//                JsonNode bestMatch = recordings.get(0);  // 첫 번째 검색 정보를 가져옴
//                JsonNode artistCredit = bestMatch.path("artist-credit");  // 아티스트 크레딧 추출
//
//                // artist-credit 배열이 비어있지 않으면 첫 번째 아티스트 정보를 사용
//                if (artistCredit.isArray() && artistCredit.size() > 0) {
//                    JsonNode artistNode = artistCredit.get(0).path("artist");  // 첫 번째 아티스트 정보 가져오기
//
//                    MBArtist artistObj = new MBArtist();
//                    artistObj.setId(UUID.randomUUID());  // 고유 ID 생성
//                    artistObj.setName(artistNode.path("name").asText());  // 아티스트 이름 설정
//                    artistObj.setMusicbrainz_id(artistNode.path("id").asText());  // MusicBrainz ID 설정
//
//                    return artistObj;
//                } else {
//                    System.out.println("No artist-credit found.");  // artist-credit이 없을 때 메시지 출력
//                }
//            } else {
//                System.out.println("No recordings found.");  // 검색 결과가 없을 때 메시지 출력
//            }
//
//        } catch (Exception e) {
//            e.printStackTrace();  // 일반적인 예외 처리
//        }
//        return null;  // 결과가 없을 때 null 반환
//    }
//
//    /**
//     * 제목과 아티스트 이름을 기반으로 MusicBrainz API에 대한 URL을 생성합니다.
//     *
//     * @param title  음악 제목
//     * @param artist 아티스트 이름
//     * @return 생성된 URL
//     * @throws UnsupportedEncodingException 인코딩 오류가 발생할 경우
//     */
//    private String createUrl(String title, String artist) throws UnsupportedEncodingException {
//        // 제목과 아티스트 이름을 URL에 사용할 수 있도록 인코딩 (띄어쓰기 처리)
//        String encodedTitle = URLEncoder.encode(title, "UTF-8");
//        String encodedArtist = URLEncoder.encode(artist, "UTF-8");
//
//        // 인코딩된 값으로 API URL 생성
//        return "https://musicbrainz.org/ws/2/recording?query=recording:\"" + encodedTitle + "\" AND artist:\"" + encodedArtist + "\"&fmt=json";
//    }

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 음악, 앨범 및 아티스트 정보를 포함한 MBMusic 객체를 반환합니다.
     */
    public MBMusic getMusicInfo(String title, String artist) {
        MBMusic music = new MBMusic();

        try {
            // 'artist' 문자열에서 '- TOPIC'을 제거
            if (artist.toUpperCase().endsWith("- TOPIC")) {
                artist = artist.substring(0, artist.length() - 7).trim();
            }
            // 제목과 아티스트 이름을 URL에 사용할 수 있도록 인코딩
            String encodedTitle = URLEncoder.encode(title.toLowerCase(), "UTF-8");
            String encodedArtist = URLEncoder.encode(artist.toLowerCase(), "UTF-8");

            // 인코딩된 값으로 API URL 생성
            String url = "https://musicbrainz.org/ws/2/recording?query=recording:\"" + encodedTitle + "\" AND artist:\"" + encodedArtist + "\"&fmt=json";

            // API 호출 및 응답 받기
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            JsonNode recordings = response.path("recordings");

            // recordings 배열이 비어 있으면 getMusicInfoByTitle 메서드 실행
            if (recordings.isArray() && recordings.size() == 0) {
                System.out.println("No recordings found for title and artist. Attempting search by title only.");
                return getMusicInfoByTitle(title);
            }

            // recordings 배열에서 "Live"가 포함되지 않은 앨범을 가진 첫 번째 recording을 선택
            JsonNode bestMatch = null;
            JsonNode selectedRelease = null;

            if (recordings.isArray()) {
                for (JsonNode recording : recordings) {
                    JsonNode releases = recording.path("releases");

                    // releases 배열을 순회하여 "Live"가 포함되지 않은 앨범을 찾고, date 값이 있는 경우에만 선택
                    for (JsonNode release : releases) {
                        String albumTitle = release.path("title").asText("");
                        String releaseDate = release.path("date").asText(null);

                        // "Live"가 포함되지 않은 앨범이면서 date 필드가 있는 경우 선택
                        if (!albumTitle.toLowerCase().contains("live") && releaseDate != null && !releaseDate.isEmpty()) {
                            System.out.println("Selected recording with album title without 'Live' and has a date: " + albumTitle);
                            bestMatch = recording;
                            selectedRelease = release;
                            //System.out.println(selectedRelease);
                            break;
                        }
                    }

                    // 조건에 맞는 recording을 찾은 경우 루프 탈출
                    if (bestMatch != null) {
                        break;
                    }
                }
            }

            // 조건에 맞는 recording이 없으면 getMusicInfoByTitle 메서드를 실행
            if (bestMatch == null || selectedRelease == null) {
                System.out.println("No suitable recording found with an album title without 'Live' and a date. Attempting search by title only.");
                return getMusicInfoByTitle(title);
            }

            // 선택된 recording이 있을 경우 처리
            if (bestMatch != null && selectedRelease != null) {
                // 음악 정보 설정
                music.setMusicTitle(bestMatch.path("title").asText(null));
                Integer musicLength = bestMatch.has("length") ? bestMatch.path("length").asInt() : null;
                music.setMusicLength(musicLength != null ? musicLength : 0);  // null 체크 후 기본값 사용
                music.setMusicMusicbrainz_id(bestMatch.path("id").asText(null));

                // 앨범 정보 설정
                music.setAlbumTitle(selectedRelease.path("title").asText(null));
                String releaseId = selectedRelease.path("id").asText(null);

                // 발매 날짜 설정
                String dateString = selectedRelease.path("date").asText(null);
                if (dateString != null && !dateString.isEmpty()) {
                    try {
                        if (dateString.length() == 4) {
                            music.setAlbumReleaseDate(LocalDate.of(Integer.parseInt(dateString), 1, 1));
                        } else if (dateString.length() == 7) {
                            YearMonth yearMonth = YearMonth.parse(dateString);
                            music.setAlbumReleaseDate(yearMonth.atDay(1));
                        } else {
                            music.setAlbumReleaseDate(LocalDate.parse(dateString));
                        }
                    } catch (Exception e) {
                        System.out.println("Error parsing release date: " + e.getMessage());
                        music.setAlbumReleaseDate(null);
                    }
                }

                // 국가 정보 설정
                String country = selectedRelease.path("country").asText(null);
                music.setAlbumCountry(country);

                music.setAlbumMusicbrainz_id(releaseId);

                // 아티스트 정보 설정
                JsonNode artistNode = bestMatch.path("artist-credit").get(0).path("artist");
                music.setArtistName(artistNode.path("name").asText(null));
                music.setArtistMusicbrainz_id(artistNode.path("id").asText(null));

                // 트랙 위치 설정 (앨범 내 몇 번째 트랙인지 확인)
                JsonNode mediaArray = selectedRelease.path("media");
                if (mediaArray.isArray() && mediaArray.size() > 0) {
                    for (JsonNode media : mediaArray) {
                        JsonNode tracks = media.path("track");  // `track` 배열로 접근
                        if (tracks.isArray()) {
                            for (JsonNode track : tracks) {
                                // 트랙 제목이 일치하면 해당 트랙의 `number`를 사용하여 트랙 번호 설정
                                String trackTitle = track.path("title").asText("");
                                if (trackTitle.equalsIgnoreCase(music.getMusicTitle())) {
                                    Integer trackNumber = track.has("number") ? Integer.parseInt(track.path("number").asText("0")) : null;
                                    music.setTrackNumber(trackNumber != null ? trackNumber : -1);  // null 체크 후 기본값 사용
                                    break;
                                }
                            }
                        }
                    }
                }

                // 앨범 아트 URL 설정 (Cover Art Archive 사용)
                if (releaseId != null) {
                    String coverArtUrl = "https://coverartarchive.org/release/" + releaseId + "/front";
                    music.setAlbumCoverArtUrl(coverArtUrl);
                }
            } else {
                System.out.println("No suitable recording found with an album title without 'Live' and a date.");
            }

        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return music;
    }

    /**
     * 제목만으로 음악 정보를 검색합니다.
     *
     * @param title 음악 제목
     * @return MBMusic 객체 또는 null (음악 정보를 찾지 못한 경우)
     */
    public MBMusic getMusicInfoByTitle(String title) {
        MBMusic music = new MBMusic();

        try {
            // 제목을 URL에 사용할 수 있도록 인코딩
            String encodedTitle = URLEncoder.encode(title.toLowerCase(), "UTF-8");

            // 인코딩된 값으로 API URL 생성
            String url = "https://musicbrainz.org/ws/2/recording?query=recording:\"" + encodedTitle + "\"&fmt=json";

            // API 호출 및 응답 받기
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            JsonNode recordings = response.path("recordings");

            // recordings 배열이 비어 있으면 null 반환
            if (recordings.isArray() && recordings.size() == 0) {
                System.out.println("No recordings found for title and artist. Attempting search by title only.");
                return null;
            }

            // recordings 배열에서 "Live"가 포함되지 않은 앨범을 가진 첫 번째 recording을 선택
            JsonNode bestMatch = null;
            JsonNode selectedRelease = null;

            if (recordings.isArray()) {
                for (JsonNode recording : recordings) {
                    JsonNode releases = recording.path("releases");

                    // releases 배열을 순회하여 "Live"가 포함되지 않은 앨범을 찾고, date 값이 있는 경우에만 선택
                    for (JsonNode release : releases) {
                        String albumTitle = release.path("title").asText("");
                        String releaseDate = release.path("date").asText(null);

                        // "Live"가 포함되지 않은 앨범이면서 date 필드가 있는 경우 선택
                        if (!albumTitle.toLowerCase().contains("live") && releaseDate != null && !releaseDate.isEmpty()) {
                            //System.out.println("Selected recording with album title without 'Live' and has a date: " + albumTitle);
                            bestMatch = recording;
                            selectedRelease = release;
                            break;
                        }
                    }

                    if (bestMatch != null) {
                        break;
                    }
                }
            }

            // 선택된 recording이 있을 경우 처리
            if (bestMatch != null && selectedRelease != null) {
                // 음악 정보 설정
                music.setMusicTitle(bestMatch.path("title").asText(null));
                Integer musicLength = bestMatch.has("length") ? bestMatch.path("length").asInt() : null;
                music.setMusicLength(musicLength != null ? musicLength : 0);  // null 체크 후 기본값 사용
                music.setMusicMusicbrainz_id(bestMatch.path("id").asText(null));

                // 앨범 정보 설정
                music.setAlbumTitle(selectedRelease.path("title").asText(null));
                String releaseId = selectedRelease.path("id").asText(null);

                // 발매 날짜 설정
                String dateString = selectedRelease.path("date").asText(null);
                if (dateString != null && !dateString.isEmpty()) {
                    try {
                        if (dateString.length() == 4) {
                            music.setAlbumReleaseDate(LocalDate.of(Integer.parseInt(dateString), 1, 1));
                        } else if (dateString.length() == 7) {
                            YearMonth yearMonth = YearMonth.parse(dateString);
                            music.setAlbumReleaseDate(yearMonth.atDay(1));
                        } else {
                            music.setAlbumReleaseDate(LocalDate.parse(dateString));
                        }
                    } catch (Exception e) {
                        System.out.println("Error parsing release date: " + e.getMessage());
                        music.setAlbumReleaseDate(null);
                    }
                }

                // 국가 정보 설정
                String country = selectedRelease.path("country").asText(null);
                music.setAlbumCountry(country);
                music.setAlbumMusicbrainz_id(releaseId);

                // 아티스트 정보 설정
                JsonNode artistNode = bestMatch.path("artist-credit").get(0).path("artist");
                music.setArtistName(artistNode.path("name").asText(null));
                music.setArtistMusicbrainz_id(artistNode.path("id").asText(null));

                // 트랙 위치 설정 (앨범 내 몇 번째 트랙인지 확인)
                JsonNode mediaArray = selectedRelease.path("media");
                if (mediaArray.isArray() && mediaArray.size() > 0) {
                    for (JsonNode media : mediaArray) {
                        JsonNode tracks = media.path("track");  // `track` 배열로 접근
                        if (tracks.isArray()) {
                            for (JsonNode track : tracks) {
                                // 트랙 제목이 일치하면 해당 트랙의 `number`를 사용하여 트랙 번호 설정
                                String trackTitle = track.path("title").asText("");
                                if (trackTitle.equalsIgnoreCase(music.getMusicTitle())) {
                                    Integer trackNumber = track.has("number") ? Integer.parseInt(track.path("number").asText("0")) : null;
                                    music.setTrackNumber(trackNumber != null ? trackNumber : -1);  // null 체크 후 기본값 사용
                                    break;
                                }
                            }
                        }
                    }
                }

                // 앨범 아트 URL 설정 (Cover Art Archive 사용)
                if (releaseId != null) {
                    String coverArtUrl = "https://coverartarchive.org/release/" + releaseId + "/front";
                    music.setAlbumCoverArtUrl(coverArtUrl);
                }
            } else {
                System.out.println("No suitable recording found with an album title without 'Live' and a date.");
            }

        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return music;
    }

}
