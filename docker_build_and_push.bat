@echo off
set /p version=Enter version:
docker build -t binn328/ym-player .
docker image tag binn328/ym-player binn328/ym-player:%version%
docker image push binn328/ym-player:%version%