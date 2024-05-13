FROM eclipse-temurin:21-alpine
LABEL authors="binn328"
ENV DATA_DIR="/data"
COPY build/libs/*.jar app.jar
RUN mkdir -p /data/music && mkdir -p /data/art
ENTRYPOINT ["java","-jar","/app.jar"]