# PostTalk

가게·메뉴 정보와 촬영한 사진·영상으로 광고용 카드뉴스와 릴스를 자동 생성하고 인스타그램에 게시하는 모바일 웹.
2026 CO-SHOW 전시 부스에 거치된 공용 기기에서 관람객이 직접 체험한다.

## 명령어

```bash
npm run dev        # 개발 서버 (0.0.0.0, 외부 기기 접속 허용)
npm run build      # tsc -b && vite build
npm run lint       # oxlint
npm run preview    # 빌드 결과 미리보기
```

## 스택

React 19 · TypeScript · Vite · React Router 7 · styled-components · PWA · Vercel

- 상태 관리 라이브러리를 쓰지 않는다. 제작 흐름의 중간 산출물은 Context 한 곳에서 관리한다.
- 경로 별칭은 `@/` → `src/`.

## 구조

```
src/
  apis/        서버 통신
  components/  공용 UI
  constants/   디자인 토큰, 화면 상수
  hooks/       Context 프로바이더
  pages/       화면
  styles/      전역 스타일
```

## 화면

제작 흐름 9개와 조회 1개, 총 10개.

| 단계 | 화면 | 경로 |
| --- | --- | --- |
| 0 | 로그인 | `/login` |
| 1 | 홈 | `/` |
| 2 | 콘셉트 선택 | `/create` |
| 3 | 정보 입력 | `/create/info` |
| 4 | 재료 확보 | `/create/capture/:sceneIndex` |
| 5 | 재료 확인 | `/create/capture/review` |
| 6 | 자막 확인 | `/create/script` |
| 7 | 생성 대기 | `/create/generating` |
| 8 | 광고 상세 | `/ads/:adId` |
| — | 보관함 | `/archive` |

자막 확인은 자막을 쓰는 릴스 템플릿에서만 거친다. 광고 상세는 제작 직후와 보관함 양쪽에서 쓰는 공용 화면이다.

## 전시 전제

이 프로젝트의 판단 기준은 대부분 여기서 나온다.

- **공용 기기** — 관람객이 번갈아 쓴다. 로그인은 운영자가 미리 해두고, 체험이 끝나면 입력값을 비운다.
- **고정 계정** — 프론트가 `1234` / `1234`를 검증하고 모든 요청에 `userId = 1`을 보낸다. 토큰 인증이 없다.
- **촬영과 녹화가 동시에 돈다** — 같은 기기에서 카메라 프리뷰와 `MediaRecorder`가 함께 돌아간다. 성능을 깎는 선택은 촬영을 깨뜨린다.
- **짧은 체류 시간** — 관람객이 몇 분 안에 완주해야 한다. 단계와 탭을 늘리는 결정은 비용이 크다.

## 문서

- 기능명세서 · API 명세 — Notion
- 전시 기획안 — 바탕화면 `1_프론트개발.md`
