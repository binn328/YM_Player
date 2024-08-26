FROM eclipse-temurin:21-alpine
LABEL authors="binn328"

COPY build/libs/*.jar app.jar
RUN echo "https://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories
RUN echo "https://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories
RUN echo "https://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories
RUN apk update && apk upgrade && apk -U add yt-dlp

ENTRYPOINT ["java","-jar","/app.jar"]