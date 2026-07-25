import { badRequest } from './response';

/**
 * multipart/form-data 요청 파싱 헬퍼.
 * Route Handler 는 값을 꺼내는 일만 하고, 실제 검증은 도메인 모듈이 담당한다.
 */
export function isMultipart(request: Request): boolean {
  return request.headers.get('content-type')?.includes('multipart/form-data') ?? false;
}

export async function readFormData(request: Request): Promise<FormData> {
  const form = await request.formData().catch(() => null);
  if (!form) throw badRequest('요청 형식이 올바르지 않습니다.');
  return form;
}

/** 값이 없으면 undefined(= 수정하지 않음), 파일이 오면 잘못된 요청. */
export function readString(form: FormData, key: string): string | undefined {
  const value = form.get(key);
  if (value === null) return undefined;
  if (typeof value !== 'string') throw badRequest(`${key} 값이 올바르지 않습니다.`);
  return value;
}

/**
 * 숫자 값. 값이 없으면 undefined(= 보내지 않음), 숫자로 읽을 수 없으면 NaN 을 그대로 돌려준다.
 * 범위·필수 여부 판단은 도메인 모듈이 하므로 여기서는 형 변환만 한다.
 */
export function readNumber(form: FormData, key: string): number | undefined {
  const value = readString(form, key);
  if (value === undefined) return undefined;
  return value.trim() === '' ? Number.NaN : Number(value);
}

/** 같은 키로 여러 번 담긴 문자열들. 하나도 없으면 undefined. */
export function readStrings(form: FormData, key: string): string[] | undefined {
  const values = form.getAll(key);
  if (!values.length) return undefined;
  if (values.some((value) => typeof value !== 'string')) {
    throw badRequest(`${key} 값이 올바르지 않습니다.`);
  }
  return values as string[];
}

/**
 * 같은 키로 담긴 파일들. 하나도 없으면 undefined.
 * 빈 file input 이 붙여 보내는 0바이트 더미 엔트리는 걸러낸다.
 */
export function readFiles(form: FormData, key: string): File[] | undefined {
  const values = form.getAll(key);
  if (!values.length) return undefined;
  if (values.some((value) => !(value instanceof File))) {
    throw badRequest('이미지 파일이 올바르지 않습니다.');
  }

  const files = (values as File[]).filter((file) => file.size > 0 || file.name !== '');
  return files.length ? files : undefined;
}
