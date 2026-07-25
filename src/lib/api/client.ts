import type { ApiResponse } from './response';

/**
 * 클라이언트 컴포넌트가 BFF(`/api/*`)를 호출할 때 쓰는 유일한 진입점.
 * Supabase URL 을 직접 호출하지 않도록 상대 경로만 허용한다.
 */
export class ApiClientError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!path.startsWith('/api/')) {
    throw new Error(`BFF 경로(/api/*)만 호출할 수 있습니다: ${path}`);
  }

  // FormData 는 boundary 가 포함된 Content-Type 을 브라우저가 직접 붙여야 한다.
  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData;

  const response = await fetch(path, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...init?.headers,
    },
  });

  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!body) {
    throw new ApiClientError('INVALID_RESPONSE', '서버 응답을 해석하지 못했습니다.', response.status);
  }
  if (!body.ok) {
    throw new ApiClientError(body.error.code, body.error.message, response.status);
  }

  return body.data;
}
