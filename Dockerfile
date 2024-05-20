FROM eclipse-temurin:21-alpine
LABEL authors="binn328"
ENV DATA_DIR="/data"
COPY build/libs/*.jar app.jar
RUN mkdir -p /data/music || doas apk -U add yt-dlp
ENTRYPOINT ["java","-jar","/app.jar"]