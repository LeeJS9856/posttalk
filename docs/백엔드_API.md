# 백엔드 API 명세

백엔드 팀의 Notion 문서(서비스 흐름 · ERD · API 가이드 · AI 서버 · 배포)와
운영 서버의 OpenAPI(`/api/openapi`)를 옮겨 적은 것이다. 원본이 바뀌면 이 문서도 고친다.
아직 답을 받지 못한 질문은 [백엔드_요청사항.md](./백엔드_요청사항.md)에 있다.

- 운영 API: `https://postalkbackend-production.up.railway.app`
- 프론트 환경 변수: `VITE_API_BASE_URL` (원문에는 Next.js 이름인 `NEXT_PUBLIC_API_BASE_URL` 로 적혀 있다)
  - 배포(Vercel)에서는 이 값을 백엔드 주소로 채운다.
  - 개발 서버에서는 비워 둔다. Vite 프록시가 `/api` 를 운영 백엔드로 넘겨 CORS 에 걸리지 않는다(`VITE_DEV_API_TARGET` 으로 바꿀 수 있다).
- CORS 허용: `https://posttalk.vercel.app`
- 모든 응답은 `{ success, message, data }` 또는 `{ success: false, message, error: { code, details } }` 형태다.

## 1. 서비스 흐름

로그인이나 QR 인증 없이 브라우저별 작업 공간을 열고 바로 만든다.

```
서비스 접속 → 작업 공간 생성(가게 이름 · 시장 이름) → 카드뉴스 또는 릴스 선택
→ 가게·메뉴 소개 입력 → 사진 또는 영상 업로드 → AI 생성(진행률)
→ 결과 미리보기 → 보관함(자동 저장)
```

| | 카드뉴스 | 릴스 |
| --- | --- | --- |
| `adType` | `photo` | `video` |
| 테마 · 콘셉트 | `cardNewsTheme`: `minimal`, `christmas` | `reelsConcept`: `simple`, `christmas` |
| 입력 | 사진 6장 | 영상 4개 |
| 결과 | 1080×1350 PNG 3장 | 1080×1920 MP4(약 13초) + 썸네일 JPG |
| 입력 순서 | 대표 음식 전체 → 대표 음식 확대 → 음식 사진 1 → 음식 사진 2 → 매장 외관 → 매장 내부 또는 메뉴판 | 가게 간판 → 대표 메뉴 → 대표 메뉴 상세 → 가게 입구 |

- 릴스는 원본 현장음을 지우고 콘셉트에 맞는 자막 · 전환 효과 · 배경음악을 넣는다. 자막은 백엔드가 만든다.
- 생성 상태는 `queued` → `processing` → `completed` 또는 `failed`.
- **Instagram 게시는 기본 흐름에 없다.** QR 기반 게시 기능은 서버에 남아 있지만 게스트 작업 공간에서는 노출하지 않는다(`canPublish: false`).

## 2. 데이터

```
stores (가게 · 브라우저 작업 공간: 가게 이름, 시장 이름)
 ├─ ad_creation_sessions (제작 1회: 유형, 테마·콘셉트, 소개 문구, 현재 촬영 순서, 상태)
 │   └─ ad_creation_session_assets (원본 사진 6장 · 영상 4개의 Storage 경로)
 └─ submissions (보관함 항목: 제목, 캡션, 해시태그, 대표 메뉴, 생성 상태, 생성 일시)
     └─ generation_jobs (AI 작업: 요청 정보, 상태, 실패 사유, 결과 경로, 시작·완료 시각)
         └─ submission_assets (결과 파일: PNG 3장 또는 MP4 + 썸네일)
```

DB 는 Supabase PostgreSQL, 파일은 모두 Supabase Storage(`uploads` 버킷)에 있다.
결과 파일 주소는 조회할 때마다 새로 발급하는 서명 URL 이다. **프론트는 URL 을 저장하지 않고 응답에서 받은 값을 바로 쓴다.**

## 3. API

| 기능 | API | 필수 | 선택 |
| --- | --- | --- | --- |
| 작업 공간 열기 | `POST /api/guest-session` | 헤더 `x-guest-session` | `storeName`, `marketName` |
| 파일 업로드 | `POST /api/uploads` (multipart) | `file`, `storeId`, `assetType` | |
| 제작 시작 | `POST /api/ad-sessions/start` | `storeId`, `adType`, `menuIntro`, `storeSpecialty` | `cardNewsTheme`, `cardNewsStyle`, `reelsConcept` |
| 사진 제출 | `POST /api/ad-sessions/:sessionId/photos` | `bucket`, `filePath` | `fileName`, `mimeType`, `fileSize` |
| 영상 제출 | `POST /api/ad-sessions/:sessionId/videos` | `bucket`, `filePath` | `fileName`, `mimeType`, `fileSize` |
| 생성 진행률 | `GET /api/generation-jobs/:jobId/progress` | | |
| 제작 결과 | `GET /api/ad-sessions/:sessionId` | | |
| 홈 요약 | `GET /api/home?storeId=` (OpenAPI 에는 없음) | `storeId` | |
| 보관함 | `GET /api/archive?storeId=` | `storeId` | `mediaType`(`photo`·`video`), `status`(`all`·`draft`·`published`), `limit` |
| 서버 상태 | `GET /api/health`, `GET /api/health/ready` | | |

`x-guest-session` 헤더(브라우저별 64자리 키)는 모든 요청에 붙인다.

### 작업 공간 열기 — `POST /api/guest-session`

프론트가 첫 접속 때 64자리 난수 키를 만들어 브라우저 저장소에 둔다. 같은 키로 다시 부르면 같은 작업 공간을 돌려준다.

```json
// 요청
{ "storeName": "우리 가게", "marketName": "남대문시장" }
// 응답 data
{ "storeId": "작업-공간-UUID", "canPublish": false }
```

받은 `storeId` 를 이후 모든 요청에 쓴다.

### 파일 업로드 — `POST /api/uploads`

`multipart/form-data`. `assetType` 은 카드뉴스 사진 `food_photo`, 릴스 영상 `video_clip`. 너무 크면 413.

```json
// 응답 data — 그대로 사진·영상 제출 API 에 넘긴다
{ "bucket": "uploads", "filePath": "stores/.../food_photo/파일명.jpg",
  "fileName": "menu.jpg", "mimeType": "image/jpeg", "fileSize": 123456 }
```

### 제작 시작 — `POST /api/ad-sessions/start`

- `menuIntro`: 대표 메뉴 소개. `storeSpecialty`: 가게만의 특별함.
- `cardNewsStyle`: 디자인 요청 문구, 최대 500자.

```json
// 요청 (카드뉴스)
{ "storeId": "...", "adType": "photo",
  "menuIntro": "매콤하고 쫄깃한 시장 떡볶이",
  "storeSpecialty": "현장에서 바로 만드는 따뜻한 한 접시",
  "cardNewsTheme": "christmas", "cardNewsStyle": "따뜻한 겨울 조명과 빨간 포인트" }
// 응답 data
{ "sessionId": "제작-세션-UUID", "adType": "photo", "status": "collecting",
  "currentRequest": { "shotKey": "card_bowl", "assetType": "food_photo",
                      "prompt": "그릇 전체가 보이도록 대표 음식을 찍어주세요." } }
```

프론트는 `currentRequest.prompt` 를 사용자에게 보여 준다.

### 사진 · 영상 제출 — `POST /api/ad-sessions/:sessionId/photos` · `/videos`

하나씩 순서대로 제출한다. 사진 종류는 프론트가 정하지 않고, 서버가 `currentRequest` 순서대로 연결한다.
**6번째 사진(릴스는 4번째 영상) 제출 응답에 `generationJobId` 가 들어오고 생성이 시작된다.**

```json
{ "generationJobId": "생성-작업-UUID", "status": "generating" }
```

### 생성 진행률 — `GET /api/generation-jobs/:jobId/progress`

완료될 때까지 2~3초 간격으로 조회한다.

```json
{ "jobId": "...", "contentType": "reels", "status": "processing", "percent": 50,
  "stage": "processing", "message": "콘텐츠를 만들고 있습니다.", "failureReason": null }
```

| `status` | 프론트 처리 |
| --- | --- |
| `queued` | 생성 준비 화면 |
| `processing` | `percent` 와 `message` 표시 |
| `completed` | 결과 조회(`GET /api/ad-sessions/:sessionId`) 후 결과 화면 |
| `failed` | `failureReason` 안내와 재시도 버튼 |

### 제작 결과 — `GET /api/ad-sessions/:sessionId`

제작 세션, 원본 파일, 생성 결과, 서명 URL 을 돌려준다. 응답 필드는 아직 받지 못했다.

## 4. AI 서버 (프론트는 직접 부르지 않는다)

백엔드가 Railway 내부의 AI 서비스를 내부 API 키로 부르고, 파일은 Supabase 서명 URL 로 주고받는다.

- **카드뉴스 AI** `postalk-cardnews` — `POST /cardnews/renders`. 사진 역할 `bowl`, `zoom`, `food1`, `food2`, `store1`, `store2`.
  가게 이름(`store_name`), 지역(`area`), 대표 메뉴(`menu_name`), 디자인 방향(`direction`)을 함께 받는다.
  오류: 401 키 불일치, 400 입력 오류, 502 생성·업로드 실패, 503 설정 누락.
- **릴스 AI** `postalk-reels` — `POST /reels/renders`, `GET /reels/renders/:renderId`.
  가게 정보, 메뉴, 영상 4개, 장면별 자막, 캡션, 해시태그를 받는다.
  상태 `queued` · `rendering` · `done` · `failed`, 단계 `preparing` · `composing` · `uploading`.
  오류: `INVALID_CONCEPT`, `INVALID_RENDER_INPUT`, `CAPTION_TOO_LONG`, `SCENE_MISMATCH`, `ALREADY_RENDERING`, `NO_USABLE_MEDIA`, `RENDER_FAILED`, `TIMEOUT`.

## 5. 배포

| 구분 | 서비스 | 위치 |
| --- | --- | --- |
| 백엔드 | `Postalk_backend` | Railway |
| 카드뉴스 AI | `postalk-cardnews` | Railway |
| 릴스 AI | `postalk-reels` | Railway |
| DB · 파일 | Supabase PostgreSQL · Storage | Supabase Pro |

배포 뒤 `GET /api/health`(`{ status: "ok", service: "postalk-backend" }`)와
`GET /api/health/ready`(`dependencies.database`, `storage`, `mediaProvider`)로 상태를 확인한다.

## 6. 응답 예시 (2026-11-15 OpenAPI 갱신분)

백엔드가 아래 API 의 응답 예시를 OpenAPI 에 추가했다. `GET /api/home` 도 OpenAPI 에 들어왔다.
영상 업로드는 `video/webm` 도 받는다(`POST /api/uploads`, `assetType=video_clip`).

### 사진 · 영상 제출 — 매 장마다 서버가 사진을 검사한다

- 통과: `response: "success"`, `status: "collecting"`, 다음 장 안내는 `request.prompt` · `request.helperText`.
- **다시 찍기**: `response: "fail"`, `review.recommendedAction: "retake"`, `retryMessage`(사용자에게 보여 줄 문장), `review.feedback[]`, `review.checks`(focus · brightness · framing …).
- 마지막 장: `status: "generating"`, `generationJobId`, `submissionId`.
- 영상 제출 본문에는 `durationSeconds` 또는 `durationMs` 를 함께 보낼 수 있다.

### 제작 결과 — `GET /api/ad-sessions/:sessionId`

- `status`: `collecting` → `generating` → `completed`
- `currentRequest`: 찍는 중일 때 다음 장 안내(`shotKey`, `prompt`, `helperText`). 끝나면 `null`.
- `collectedAssets[]`: 올린 원본. `shotKey` 는 카드뉴스 `card_bowl` · `card_zoom` · `card_food1` · `card_food2` · `card_store1` · `card_store2`, 릴스 `video_storefront_sign` · `video_signature_menu` · `video_signature_interaction` · `video_storefront_entry`.
- `submission`: `submissionId`, `caption`, `hashtags[]`, `status`(`draft`).
- `generation`: `jobId`, `status`, `failureReason`, `imageCount`, `resultUrl`, `generatedAssets[]`(카드뉴스 PNG 3장의 `url`), `completedAt`.
  - 카드뉴스는 `generatedAssets[].url`, 릴스는 `resultUrl`(MP4). 릴스 썸네일 주소는 예시에 없다.

### 보관함 — `GET /api/archive`

- 파라미터: `storeId`, `mediaType`(`photo` | `video`, 기본 `photo`), `status`(`all` | `draft` | `published`), `limit`(1~50, 기본 20), `submissionId`(한 건만 조회).
- `summary.counts`: `all`, `draft`, `published`.
- `items[]`: `submissionId`, `thumbnailUrl`, `title`, `status`, `statusLabel`("보관 중"), `generatedAssetUrl`, `publishCaption`, `instagramPermalink`, `previewAssets[]`(`url`), `mediaType`, `createdAt`.
- 형식을 한 번에 하나만 받는다. "전체" 탭은 `photo` 와 `video` 를 각각 불러 합친다.

### 홈 — `GET /api/home`

- `summary`: `storeName`, `ownerName`, `draftCount`, `publishedCount`, `totalCount`.
- `attentionItems[]`: 보관 중 광고(`message`: "완성된 광고를 확인하고 직접 게시할 수 있어요").
- `myAds[]`: `submissionId`, `thumbnailUrl`, `title`, `status`, `statusLabel`, `createdAt`. 형식(`mediaType`)은 없다.
