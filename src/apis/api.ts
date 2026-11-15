/**
 * 백엔드 호출의 공통 부분. 주소, 게스트 작업 공간 키, 응답 껍데기 풀기를 맡는다.
 *
 * 요청은 항상 같은 주소의 /api 로 보낸다. 개발 서버는 Vite 프록시가, 배포는 vercel.json 이 백엔드로 넘긴다.
 * 백엔드 CORS 가 배포 주소만 열려 있어 브라우저가 백엔드를 직접 부르면 미리보기·실기기에서 막힌다.
 * 백엔드 주소를 환경 변수로 받지 않는다. Vercel 에 예전 주소가 남아 있어 엉뚱한 서버를 부른 적이 있다.
 * 백엔드가 바뀌면 vite.config.ts 와 vercel.json 을 고친다.
 */
const API_BASE_URL = '';

/**
 * 모든 기기가 함께 쓰는 64자리 작업 공간 키.
 * 고정 계정(1234)으로 로그인한 기기는 어디서든 같은 작업 공간(같은 storeId, 같은 보관함)을 연다.
 * 백엔드가 storeId 를 숫자로 받지 않아, "storeId = 1" 을 이 고정 키로 대신한다.
 * 다른 작업 공간을 쓰고 싶으면 VITE_GUEST_KEY 로 바꾼다.
 */
const SHARED_GUEST_KEY =
  import.meta.env.VITE_GUEST_KEY ??
  'bb3883e3a1329827d2887aa939bbf85d7a0359a3e6f885a9cc33053467f3bfa2';

export const getGuestKey = (): string => SHARED_GUEST_KEY;

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type Envelope<T> =
  | { success: true; message?: string; data: T }
  | { success: false; message?: string; error?: { code?: string; details?: unknown } };

type RequestOptions = {
  method?: 'GET' | 'POST';
  /** 객체는 JSON 으로, FormData 는 그대로 보낸다. */
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
  /** 이 시간 안에 응답이 없으면 포기한다. 업로드처럼 오래 걸리는 요청만 늘려 잡는다. */
  timeoutMs?: number;
};

const NETWORK_ERROR_MESSAGE = '서버에 연결하지 못했어요. 인터넷 연결을 확인해 주세요.';
const TIMEOUT_MESSAGE = '응답이 너무 늦어요. 인터넷 연결을 확인하고 다시 시도해 주세요.';
const TOO_LARGE_MESSAGE = '파일이 너무 커요. 다른 사진이나 더 짧은 영상으로 올려주세요.';

/**
 * 기본 응답 대기 시간. 전시장 와이파이가 끊기면 요청이 끝나지 않고 매달린다.
 * 시간 제한이 없으면 화면이 "확인하고 있어요"에서 영영 멈춘다.
 */
export const DEFAULT_TIMEOUT_MS = 20_000;
/** 사진·영상 업로드는 파일이 커서 더 기다린다. */
export const UPLOAD_TIMEOUT_MS = 60_000;

const isTimeoutError = (cause: unknown): boolean =>
  cause instanceof DOMException && cause.name === 'TimeoutError';

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', body, query, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  // 화면이 끊는 신호와 시간 제한 중 먼저 오는 쪽으로 끊는다.
  const timeout = AbortSignal.timeout(timeoutMs);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

  const search = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value));
  });
  const url = `${API_BASE_URL}${path}${search.size > 0 ? `?${search.toString()}` : ''}`;

  const headers: Record<string, string> = { 'x-guest-session': getGuestKey() };
  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let response: Response;
  let json: Envelope<T> | null;
  try {
    response = await fetch(url, { method, headers, body: payload, signal: combined });
    json = (await response.json().catch((cause: unknown) => {
      // 본문을 받는 도중에 끊긴 것은 그대로 올려 보낸다. 본문이 JSON 이 아닌 것만 null 로 둔다.
      if (cause instanceof DOMException) throw cause;
      return null;
    })) as Envelope<T> | null;
  } catch (cause) {
    if (isTimeoutError(cause)) throw new ApiError(TIMEOUT_MESSAGE, 0, 'timeout');
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause;
    throw new ApiError(NETWORK_ERROR_MESSAGE, 0);
  }

  // 413 은 서버 앞단(프록시)이 HTML 로 돌려줘 메시지가 없다. 이유를 직접 알려준다.
  if (response.status === 413) throw new ApiError(TOO_LARGE_MESSAGE, 413, 'too_large');

  if (!response.ok || !json || json.success === false) {
    const message =
      json && 'message' in json && json.message ? json.message : '요청을 처리하지 못했어요.';
    const error = json && json.success === false ? json.error : undefined;
    throw new ApiError(message, response.status, error?.code, error?.details);
  }

  return json.data;
};

export const isAbortError = (cause: unknown): boolean =>
  cause instanceof DOMException && cause.name === 'AbortError';
