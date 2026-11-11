/**
 * 전시용 고정 계정. 토큰 인증이 없고 프론트가 직접 맞춰본다.
 * 백엔드에는 사용자 하나만 두고 모든 요청에 이 번호를 보낸다.
 */
export const FIXED_ACCOUNT = {
  username: '1234',
  password: '1234',
} as const;

export const FIXED_USER_ID = 1;

/**
 * 로그인 상태를 담는 키.
 * 전시 내내 같은 탭이 떠 있지만 새로고침과 재부팅이 있을 수 있어 localStorage 를 쓴다.
 * sessionStorage 면 그때마다 운영자를 다시 불러야 한다.
 */
export const AUTH_STORAGE_KEY = 'posttalk.signedIn';
