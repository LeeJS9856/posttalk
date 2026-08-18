const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

if (!apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is not configured.');
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: {
    code?: string;
    details?: unknown[];
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown[];

  constructor({
    status,
    message,
    code,
    details,
  }: {
    status: number;
    message: string;
    code?: string;
    details?: unknown[];
  }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type ApiRequestBody = BodyInit | Record<string, unknown> | undefined;

export interface ApiRequestOptions {
  baseUrl?: string;
  path: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: ApiRequestBody;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

const isBodyInit = (body: ApiRequestBody): body is BodyInit =>
  body instanceof FormData ||
  body instanceof URLSearchParams ||
  body instanceof Blob ||
  typeof body === 'string';

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return response.text();
  }

  return response.json();
};

export const api = async <T>({
  baseUrl = apiBaseUrl,
  path,
  method = 'GET',
  body,
  headers,
  signal,
}: ApiRequestOptions): Promise<T> => {
  const requestHeaders = new Headers(headers);
  requestHeaders.set('Accept', 'application/json');

  const requestBody = body === undefined || isBodyInit(body) ? body : JSON.stringify(body);

  if (body !== undefined && !isBodyInit(body) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: requestHeaders,
    body: requestBody,
    signal,
  });
  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    const errorBody = responseBody as Partial<ApiErrorResponse>;

    throw new ApiError({
      status: response.status,
      message: errorBody.message ?? response.statusText ?? 'API request failed.',
      code: errorBody.error?.code,
      details: errorBody.error?.details,
    });
  }

  return responseBody as T;
};
