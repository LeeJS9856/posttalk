# PostTalk

전통시장 상인이 QR 로그인 후 음성으로 광고 제작에 필요한 내용을 입력하고, 사진·영상 광고 생성을 요청할 수 있는 웹 애플리케이션입니다. 관리자는 별도 화면에서 시장의 광고를 검토하고 보관함을 확인할 수 있습니다.

- 배포 주소: [posttalk.vercel.app](https://posttalk.vercel.app/)

## 주요 기능

### 상인

- 상인 홈에서 검토가 필요한 광고와 최근 광고 확인
- 사진 또는 영상 광고 형식 선택
- 메뉴판·음식 사진 업로드
- 음성 인식을 이용한 광고 문구 답변 입력
- 광고 생성 요청 및 생성 결과 확인
- 광고 게시 요청 및 보관함 상태별 조회

### 관리자

- 관리자 홈에서 검수 대기·최근 업로드 광고 확인
- 검토 목록 및 광고 상세 확인
- 사진 광고 캐러셀 및 영상 광고 재생 미리보기
- 관리자 보관함에서 광고 형식·상태별 조회
- 목록이 비어 있을 때 안내 문구 제공

## 기술 스택

- React 19, TypeScript, Vite
- React Router
- styled-components
- Web Speech API (음성 인식)
- Vercel (배포 및 관리자 API 프록시)

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버 실행 후 터미널에 표시되는 주소로 접속합니다. 음성 인식은 브라우저 보안 정책상 HTTPS 환경 또는 `localhost`에서 사용하는 것을 권장합니다.

### 검증 명령어

```bash
npm run lint
npm run build
```

## 환경 변수

프로젝트 루트의 `.env`에 아래 값을 설정합니다. `.env`는 저장소에 커밋하지 않습니다.

```env
# 브라우저에서 호출할 백엔드 API 주소
VITE_API_BASE_URL=https://your-api.example.com

# 로컬 개발 시 관리자 API 프록시에 사용할 키
ADMIN_API_KEY=your-admin-api-key
```

Vercel에는 아래 환경 변수를 설정합니다.

| 변수 | 용도 | 노출 범위 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | 상인 API의 백엔드 주소 | 클라이언트 빌드에 포함됨 |
| `ADMIN_API_KEY` | 관리자 API 인증 키 | 서버 환경 변수만 사용 |
| `API_BASE_URL` | 관리자 프록시가 호출할 백엔드 주소 | 서버 환경 변수만 사용 |

`ADMIN_API_KEY`는 `VITE_` 접두사를 사용하지 않습니다. 클라이언트 코드에 포함되지 않고 `api/admin` Vercel 서버리스 함수에서만 백엔드 요청 헤더로 전달됩니다.

## 화면 경로

| 구분 | 경로 | 설명 |
| --- | --- | --- |
| 상인 홈 | `/` | 상인용 홈 |
| 광고 제작 | `/create` | 광고 형식 선택 및 제작 흐름 시작 |
| 음성 질문 | `/create/questions/:questionIndex` | 음성 답변 입력 |
| 상인 보관함 | `/archive` | 제작 광고 조회 |
| 관리자 홈 | `/admin` | 검수 대기·최근 업로드 광고 |
| 관리자 검토 | `/admin/reviews` | 검토 대기 목록 |
| 관리자 상세 | `/admin/reviews/:submissionId` | 광고 상세 미리보기 |
| 관리자 보관함 | `/admin/archive` | 시장 광고 보관함 |

## API 구조

공통 요청 로직은 `src/apis/api.ts`에 두고, 도메인별 API 모듈로 분리했습니다.

```text
src/apis/
├── api.ts           # 공통 fetch, 응답·오류 처리
├── server.ts        # 서버 상태 확인
├── home.ts          # 상인 홈
├── archive.ts       # 상인 보관함
├── creation.ts      # 업로드, 광고 생성, 게시 요청
├── adminHome.ts     # 관리자 홈
├── adminArchive.ts  # 관리자 보관함
└── adminReviews.ts  # 관리자 검토 목록·상세
```

관리자 요청은 브라우저에서 백엔드를 직접 호출하지 않고 `/api/admin/*` 경로로 요청합니다. Vercel의 `api/admin/*` 서버리스 함수가 `ADMIN_API_KEY`를 포함해 백엔드로 프록시하므로 인증 키가 노출되지 않습니다.

## 프로젝트 구조

```text
src/
├── apis/        # 백엔드 통신 모듈
├── components/  # 공통·레이아웃·기능별 UI 컴포넌트
├── constants/   # 색상, 타이포그래피, 임시 QR 사용자 데이터 등
├── hooks/       # 광고 제작 흐름 상태 관리
├── pages/       # 화면 단위 컴포넌트와 스타일
└── styles/      # 전역 스타일

api/admin/       # Vercel 관리자 API 프록시
```

## 참고 사항

- QR 로그인 API 연결 전에는 `src/constants/user.ts`의 임시 QR 세션 데이터를 사용합니다.
- 브라우저와 운영체제에서 마이크 권한을 허용해야 음성 입력을 사용할 수 있습니다.
- 광고 생성·검토 처리 결과는 백엔드 API 응답을 기준으로 표시합니다.
