@echo off
set /p tag=Enter tag:
docker build --no-cache -t binn328/ym-player .
docker image tag binn328/ym-player binn328/ym-player:%tag%