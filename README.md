# 📺 YM_Player: YouTube Media Streaming & Download Server

**유튜브 콘텐츠를 효율적으로 처리하여 스트리밍하고 다운로드할 수 있는 풀스택 미디어 서버 프로젝트입니다.**

## 🚀 Key Features
- **Media Extraction**: `yt-dlp` 라이브러리를 서버 사이드에 통합하여 유튜브 영상 및 오디오 데이터를 정밀하게 추출합니다.
- **Dynamic Streaming**: 추출된 미디어 데이터를 클라이언트에 실시간으로 전달하는 스트리밍 API를 구현하였습니다.
- **Full-Stack Architecture**: 
  - **Backend**: Java / Spring Boot 3 기반의 안정적인 서버 아키텍처.
  - **Frontend**: React를 활용한 사용자 친화적인 미디어 플레이어 인터페이스.
- **Containerized Deployment**: Docker 및 Docker Compose를 통해 복잡한 의존성(`yt-dlp` 포함)을 자동화하고 어디서든 동일한 환경으로 배포 가능하도록 최적화하였습니다.

## 🛠 Tech Stack
- **Backend**: `Java 21`, `Spring Boot 3.2.4`, `Gradle`
- **Frontend**: `React`, `JavaScript`
- **Infrastructure**: `Docker`, `Docker Compose`, `Alpine Linux`
- **Core Library**: `yt-dlp` (YouTube metadata & media extraction)

## 🏗 Architecture & Implementation Detail
- **SSL/CORS Resolution**: 서버 배포 과정에서 발생하는 CORS 에러를 분석하고 해결하여 프론트엔드-백엔드 간의 안정적인 통신을 확보했습니다.
- **Custom Docker Image**: 기본 Java 이미지에 `yt-dlp` 설치 과정을 포함한 커스텀 Dockerfile을 작성하여 서버 환경 구축 시간을 단축했습니다.
- **API Design**: 유튜브 URL을 입력받아 최적의 스트리밍 경로를 반환하는 REST API를 설계하고 구현하였습니다.

## 📂 Project Structure
```text
YM_Player/
├── docker/                # Docker Compose 및 배포 설정
├── src/
│   └── main/
│       ├── java/          # Spring Boot 백엔드 로직 (yt-dlp API 등)
│       └── frontend/      # React 기반 플레이어 UI
├── Dockerfile             # yt-dlp 및 Java 환경 구축 정의
└── build.gradle           # 프로젝트 의존성 및 빌드 설정
```

## ⚙️ Getting Started

### Prerequisites
- Docker & Docker Compose
- Java 21 (for local development)

### Installation & Run
1. Clone the repository:
```bash
   git clone https://github.com/binn328/YM_Player.git
   cd YM_Player
```
2. Build and run using Docker:
```bash
   docker-compose up --build
```