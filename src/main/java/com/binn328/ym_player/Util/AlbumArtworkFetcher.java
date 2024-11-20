package com.binn328.ym_player.Util;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class AlbumArtworkFetcher {

    private static final String COVER_ART_ARCHIVE_API = "https://coverartarchive.org/release/";
    private static final String MUSICBRAINZ_API = "https://musicbrainz.org/ws/2/recording/";
    private static final String USER_AGENT = "ym-player/0.1 ( binn328@gmail.com )";

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public AlbumArtworkFetcher() {
        this.httpClient = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.NORMAL) // 리다이렉트 따라가기 설정
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Recording ID를 사용하여 앨범 커버 이미지를 바이트 배열로 가져옵니다.
     *
     * @param recordingMBID MusicBrainz Recording MBID
     * @return 앨범 커버 이미지의 바이트 배열
     * @throws IOException          입출력 예외
     * @throws InterruptedException 요청 중단 예외
     */
    public byte[] fetchAlbumArtworkBytes(String recordingMBID) throws IOException, InterruptedException {
        // 1. Recording ID로부터 Release ID를 얻는다.
        String recordingApiUrl = MUSICBRAINZ_API + recordingMBID + "?inc=releases&fmt=json";

        HttpRequest recordingRequest = HttpRequest.newBuilder()
                .uri(URI.create(recordingApiUrl))
                .header("User-Agent", USER_AGENT)
                .GET()
                .build();

        HttpResponse<String> recordingResponse = httpClient.send(recordingRequest, HttpResponse.BodyHandlers.ofString());

        if (recordingResponse.statusCode() == 200) {
            String responseBody = recordingResponse.body();
            RecordingResponse recordingData = objectMapper.readValue(responseBody, RecordingResponse.class);

            // Releases가 있는지 확인
            if (recordingData.getReleases() != null && !recordingData.getReleases().isEmpty()) {
                // 첫 번째 Release ID를 사용 (필요에 따라 더 나은 선택 로직을 구현할 수 있음)
                String releaseMBID = recordingData.getReleases().get(0).getId();

                // 2. Release ID로 앨범 아트워크를 가져온다.
                log.info("mbid = " + releaseMBID);
                return fetchArtworkByReleaseId(releaseMBID);
            } else {
                throw new IOException("Recording에 연결된 Release가 없습니다.");
            }
        } else {
            throw new IOException("Recording 정보를 가져오는 데 실패했습니다. HTTP 상태 코드: " + recordingResponse.statusCode());
        }
    }

    private byte[] fetchArtworkByReleaseId(String releaseMBID) throws IOException, InterruptedException {
        String coverArtApiUrl = COVER_ART_ARCHIVE_API + releaseMBID;

        HttpRequest apiRequest = HttpRequest.newBuilder()
                .uri(URI.create(coverArtApiUrl))
                .header("User-Agent", USER_AGENT)
                .GET()
                .build();

        HttpResponse<String> apiResponse = httpClient.send(apiRequest, HttpResponse.BodyHandlers.ofString());

        if (apiResponse.statusCode() == 200) {
            // 응답 파싱하여 이미지 URL 추출
            String responseBody = apiResponse.body();
            CoverArtResponse coverArtResponse = objectMapper.readValue(responseBody, CoverArtResponse.class);

            // 앞면 커버 이미지 찾기
            Artwork frontArtwork = coverArtResponse.getImages().stream()
                    .filter(Artwork::isFront)
                    .findFirst()
                    .orElse(null);

            if (frontArtwork != null) {
                String imageUrl = frontArtwork.getImage();

                // 이미지 데이터 가져오기
                HttpRequest imageRequest = HttpRequest.newBuilder()
                        .uri(URI.create(imageUrl))
                        .header("User-Agent", USER_AGENT)
                        .GET()
                        .build();

                HttpResponse<byte[]> imageResponse = httpClient.send(imageRequest, HttpResponse.BodyHandlers.ofByteArray());

                if (imageResponse.statusCode() == 200) {
                    return imageResponse.body();
                } else {
                    throw new IOException("이미지 다운로드 실패. HTTP 상태 코드: " + imageResponse.statusCode());
                }
            } else {
                // 앞면 커버 이미지가 없을 경우 null 반환
                return null;
            }
        } else if (apiResponse.statusCode() == 404) {
            // 커버 아트가 없는 경우 null 반환
            return null;
        } else {
            throw new IOException("커버 아트 정보를 가져오는 데 실패했습니다. HTTP 상태 코드: " + apiResponse.statusCode());
        }
    }
}


/**
 * Cover Art Archive API의 응답을 나타냅니다.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
class CoverArtResponse {
    private List<Artwork> images;

    public List<Artwork> getImages() {
        return images;
    }

    public void setImages(List<Artwork> images) {
        this.images = images;
    }
}

/**
 * 개별 아트워크 정보를 나타냅니다.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
class Artwork {
    private String image;
    private boolean front;
    private boolean back;
    private String comment;
    private String approved;
    private Thumbnails thumbnails;

    // 게터와 세터

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public boolean isFront() {
        return front;
    }

    public void setFront(boolean front) {
        this.front = front;
    }

    public boolean isBack() {
        return back;
    }

    public void setBack(boolean back) {
        this.back = back;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getApproved() {
        return approved;
    }

    public void setApproved(String approved) {
        this.approved = approved;
    }

    public Thumbnails getThumbnails() {
        return thumbnails;
    }

    public void setThumbnails(Thumbnails thumbnails) {
        this.thumbnails = thumbnails;
    }
}

/**
 * 아트워크의 썸네일 URL을 나타냅니다.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
class Thumbnails {
    private String small;
    private String large;

    // 게터와 세터

    public String getSmall() {
        return small;
    }

    public void setSmall(String small) {
        this.small = small;
    }

    public String getLarge() {
        return large;
    }

    public void setLarge(String large) {
        this.large = large;
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
class RecordingResponse {
    private List<Release> releases;

    public List<Release> getReleases() {
        return releases;
    }

    public void setReleases(List<Release> releases) {
        this.releases = releases;
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
class Release {
    private String id;
    private String title;
    private String date;
    private String country;

    // 게터와 세터

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDate() {
        return date;
    }

    public String getCountry() {
        return country;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
