/**
 * 백엔드 호출의 공통 부분. 주소, 게스트 작업 공간 키, 응답 껍데기 풀기를 맡는다.
 *
 * 개발 서버에서는 VITE_API_BASE_URL 을 비워 두고 Vite 프록시(/api)로 보낸다.
 * 백엔드 CORS 는 배포 주소만 열려 있어서, 이렇게 해야 로컬과 실기기에서도 호출된다.
 */
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

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
};

const NETWORK_ERROR_MESSAGE = '서버에 연결하지 못했어요. 인터넷 연결을 확인해 주세요.';

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', body, query, signal } = options;

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
  try {
    response = await fetch(url, { method, headers, body: payload, signal });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause;
    throw new ApiError(NETWORK_ERROR_MESSAGE, 0);
  }

  const json = (await response.json().catch(() => null)) as Envelope<T> | null;

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
