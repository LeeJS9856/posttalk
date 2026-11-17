---
paths:
  - "src/apis/**/*.ts"
---

# API 규칙

## 공통 응답

모든 응답은 래퍼로 감싸여 온다. `GET /api/health`만 예외다.

```ts
{ success: true,  message: string, data: T }
{ success: false, message: string, error?: { code?: string; details?: unknown[] } }
```

`fetch`를 화면에서 직접 부르지 않는다. `src/apis/api.ts`의 단일 래퍼를 거친다.
실패는 `ApiError`로 던지고 `status` / `code` / `details`를 담는다.

## 인증

토큰이 없다. 모든 기기가 같은 64자리 게스트 키(`src/apis/api.ts`, `VITE_GUEST_KEY`로 바꿀 수 있음)를 `x-guest-session` 헤더로 싣는다.
`POST /api/guest-session`이 돌려준 `storeId`를 제작·조회 요청에 쓴다. 어느 기기에서든 같은 작업 공간이 열린다.

## 비동기 생성

광고 생성은 요청과 결과 조회가 분리되어 있다. 마지막 장(몇 장인지는 서버가 정한다)을 제출한 응답에 `generationJobId`가 오고,
`GET /api/generation-jobs/{jobId}/progress`를 2~3초 간격으로 조회한다. 끝나면 `GET /api/ad-sessions/{sessionId}`로 결과를 받는다.

진행률 응답의 `percent` · `stage` · `message`는 없을 수 있다. 있다고 가정하고 접근하지 않는다.
자세한 명세는 `docs/백엔드_API.md`.

## 취소

`AbortSignal`을 받을 수 있게 만든다. 화면이 언마운트되면 요청을 끊는다.
`AbortError`는 사용자에게 오류로 보여주지 않는다.

모든 요청에 시간 제한이 있다(기본 20초, 업로드 60초 — `api.ts`). 전시장 와이파이가 끊기면 요청이 끝나지 않고 매달리기 때문이다.
넘기면 `ApiError(code: 'timeout')`로 던지고 화면은 다시 시도하게 한다. 413은 서버 앞단이 HTML로 돌려주므로 래퍼가 직접 문구를 만든다.

## 하지 말 것

- 응답을 그대로 신뢰하고 구조분해하지 않는다. 선택 필드는 선택으로 다룬다.
- 재시도를 자동으로 돌리지 않는다. 생성과 게시는 비용이 크고 중복 결과를 만든다.
  예외는 게시의 "처리 중" 확인 하나다. 서버가 200 `processing`이나 409 `INSTAGRAM_PROCESSING`을 주면
  같은 주소를 다시 불러 확인하라고 명세에 적혀 있고, 이미 올라간 광고는 중복 게시하지 않는다(`publishUntilDone`).
  실패·시간 초과·409 `INSTAGRAM_VERIFICATION_REQUIRED`는 다시 부르지 않는다.
- 관리자 API를 만들지 않는다. 이 프로젝트에 관리자 역할이 없다.
