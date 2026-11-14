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

토큰이 없다. 모든 요청에 `userId = 1`을 싣는다. 헤더가 아니라 쿼리 또는 본문이다.

## 비동기 생성

대본 생성과 광고 생성은 요청과 결과 조회가 분리되어 있다. 요청은 `202`와 작업 ID를 돌려주고, 상태는 따로 조회한다.

| 요청 | 조회 |
| --- | --- |
| `POST /api/scripts` | `GET /api/scripts/{jobId}` |
| `POST /api/ads` | `GET /api/generations/{jobId}` |

생성 상태 응답의 `progress`는 없을 수 있다. 있으면 단계를 표시하고, 없으면 진행 표시만 한다. 있다고 가정하고 접근하지 않는다.

## 취소

`AbortSignal`을 받을 수 있게 만든다. 화면이 언마운트되면 요청을 끊는다.
`AbortError`는 사용자에게 오류로 보여주지 않는다.

## 하지 말 것

- 응답을 그대로 신뢰하고 구조분해하지 않는다. 선택 필드는 선택으로 다룬다.
- 재시도를 자동으로 돌리지 않는다. 생성과 게시는 비용이 크고 중복 결과를 만든다.
- 관리자 API를 만들지 않는다. 이 프로젝트에 관리자 역할이 없다.
