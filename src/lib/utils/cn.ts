// 클래스명 병합 유틸리티 (tailwind-merge 없이 간단한 구현)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
