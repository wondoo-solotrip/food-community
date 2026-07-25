import { NextResponse } from 'next/server';

/**
 * BFF 응답 정규화 레이어.
 * Supabase 원본 에러는 절대 그대로 클라이언트로 내보내지 않는다.
 */
export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; error: { code: string; message: string } };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

/** Route Handler 안에서 의도적으로 던지는 에러. 클라이언트에 그대로 노출되는 메시지다. */
export class ApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number = 400,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const unauthorized = (message = '로그인이 필요합니다.') =>
  new ApiError('UNAUTHORIZED', message, 401);

export const notFound = (message = '요청한 리소스를 찾을 수 없습니다.') =>
  new ApiError('NOT_FOUND', message, 404);

export const badRequest = (message = '요청 값이 올바르지 않습니다.') =>
  new ApiError('BAD_REQUEST', message, 400);

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, data }, { status });
}

export function jsonError(error: ApiError) {
  return NextResponse.json<ApiFailure>(
    { ok: false, error: { code: error.code, message: error.message } },
    { status: error.status },
  );
}

/**
 * Route Handler 공통 래퍼. 검증/도메인 호출에서 던진 에러를 정규화한다.
 * 예상하지 못한 에러는 서버 로그에만 남기고 클라이언트에는 일반 메시지를 준다.
 */
export async function handleRoute<T>(fn: () => Promise<NextResponse<ApiResponse<T>>>) {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiError) {
      return jsonError(error);
    }
    console.error('[api] unhandled error', error);
    return jsonError(new ApiError('INTERNAL_ERROR', '요청을 처리하지 못했습니다.', 500));
  }
}
