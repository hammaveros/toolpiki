/**
 * 공유 URL 인코딩/디코딩 유틸
 * UTF-8 바이너리 직접 base64 (이중 인코딩 방지)
 * 이전 버전(encodeURIComponent→btoa) 호환
 */

/** JSON → base64 (UTF-8 safe) */
export function encodeShareData(data: unknown): string {
  const json = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(json)));
}

/** base64 → JSON (이전 버전 호환) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decodeShareData<T = any>(encoded: string): T {
  let decoded: string;
  try {
    // 새 방식: UTF-8 binary base64
    decoded = decodeURIComponent(escape(atob(encoded)));
  } catch {
    // 이전 방식: encodeURIComponent → btoa
    decoded = decodeURIComponent(atob(encoded));
  }
  return JSON.parse(decoded) as T;
}
