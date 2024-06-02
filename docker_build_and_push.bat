@echo off
set /p tag=Enter tag:
docker build -t binn328/ym-player .
docker image tag binn328/ym-player binn328/ym-player:%tag%
docker image push binn328/ym-player:%tag%