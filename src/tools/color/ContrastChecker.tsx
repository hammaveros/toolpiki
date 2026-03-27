'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';

export function ContrastChecker() {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const contrastRatio = useMemo(() => {
    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);

    if (!fg || !bg) return 0;

    const l1 = getLuminance(fg.r, fg.g, fg.b);
    const l2 = getLuminance(bg.r, bg.g, bg.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }, [foreground, background]);

  const wcagResults = useMemo(() => {
    return {
      aaLarge: contrastRatio >= 3,
      aaSmall: contrastRatio >= 4.5,
      aaaLarge: contrastRatio >= 4.5,
      aaaSmall: contrastRatio >= 7,
    };
  }, [contrastRatio]);

  const swapColors = () => {
    const temp = foreground;
    setForeground(background);
    setBackground(temp);
  };

  const presets = [
    { name: '기본', fg: '#000000', bg: '#ffffff' },
    { name: '다크모드', fg: '#e5e7eb', bg: '#1f2937' },
    { name: '링크', fg: '#2563eb', bg: '#ffffff' },
    { name: '경고', fg: '#ffffff', bg: '#dc2626' },
    { name: '성공', fg: '#ffffff', bg: '#16a34a' },
    { name: '저대비', fg: '#9ca3af', bg: '#f3f4f6' },
  ];

  const getGradeColor = (ratio: number): string => {
    if (ratio >= 7) return 'text-green-600 dark:text-green-400';
    if (ratio >= 4.5) return 'text-blue-600 dark:text-blue-400';
    if (ratio >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getGrade = (ratio: number): string => {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    if (ratio >= 3) return 'AA Large';
    return 'Fail';
  };

  return (
    <div className="space-y-2">
      {/* 미리보기 */}
      <Card variant="bordered" className="p-6 text-center" style={{ backgroundColor: background }}>
        <p style={{ color: foreground }} className="text-4xl font-bold mb-2">
          가나다 ABC 123
        </p>
        <p style={{ color: foreground }} className="text-lg mb-2">
          일반 텍스트 예시입니다.
        </p>
        <p style={{ color: foreground }} className="text-sm">
          작은 텍스트 예시입니다. The quick brown fox jumps over the lazy dog.
        </p>
      </Card>

      {/* 대비율 표시 */}
      <Card variant="bordered" className="p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">대비율</p>
        <p className={`text-5xl font-bold ${getGradeColor(contrastRatio)}`}>
          {contrastRatio.toFixed(2)}:1
        </p>
        <p className={`text-xl font-medium mt-2 ${getGradeColor(contrastRatio)}`}>
          {getGrade(contrastRatio)}
        </p>
      </Card>

      {/* 프리셋 */}
      <div className="flex gap-1 flex-wrap">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant="secondary"
            size="sm"
            onClick={() => {
              setForeground(preset.fg);
              setBackground(preset.bg);
            }}
          >
            {preset.name}
          </Button>
        ))}
      </div>

      {/* 색상 선택 */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
        <Card variant="bordered" className="p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            전경색 (텍스트)
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <Input
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="font-mono"
            />
          </div>
        </Card>

        <Button variant="secondary" onClick={swapColors} className="hidden sm:flex h-10 mb-4">
          ↔
        </Button>

        <Card variant="bordered" className="p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            배경색
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <Input
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="font-mono"
            />
          </div>
        </Card>
      </div>

      <Button variant="secondary" onClick={swapColors} className="sm:hidden w-full">
        ↔ 색상 교체
      </Button>

      {/* WCAG 결과 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          WCAG 2.1 접근성 기준
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded ${wcagResults.aaSmall ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className="text-sm font-medium">AA 일반 텍스트</p>
            <p className="text-xs text-gray-500">4.5:1 이상 필요</p>
            <p className={`font-bold ${wcagResults.aaSmall ? 'text-green-600' : 'text-red-600'}`}>
              {wcagResults.aaSmall ? '✓ 통과' : '✕ 실패'}
            </p>
          </div>
          <div className={`p-3 rounded ${wcagResults.aaLarge ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className="text-sm font-medium">AA 큰 텍스트</p>
            <p className="text-xs text-gray-500">3:1 이상 필요</p>
            <p className={`font-bold ${wcagResults.aaLarge ? 'text-green-600' : 'text-red-600'}`}>
              {wcagResults.aaLarge ? '✓ 통과' : '✕ 실패'}
            </p>
          </div>
          <div className={`p-3 rounded ${wcagResults.aaaSmall ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className="text-sm font-medium">AAA 일반 텍스트</p>
            <p className="text-xs text-gray-500">7:1 이상 필요</p>
            <p className={`font-bold ${wcagResults.aaaSmall ? 'text-green-600' : 'text-red-600'}`}>
              {wcagResults.aaaSmall ? '✓ 통과' : '✕ 실패'}
            </p>
          </div>
          <div className={`p-3 rounded ${wcagResults.aaaLarge ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className="text-sm font-medium">AAA 큰 텍스트</p>
            <p className="text-xs text-gray-500">4.5:1 이상 필요</p>
            <p className={`font-bold ${wcagResults.aaaLarge ? 'text-green-600' : 'text-red-600'}`}>
              {wcagResults.aaaLarge ? '✓ 통과' : '✕ 실패'}
            </p>
          </div>
        </div>
      </Card>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
        <p><strong>큰 텍스트:</strong> 18pt (24px) 이상 또는 14pt (18.67px) 볼드 이상</p>
        <p><strong>일반 텍스트:</strong> 그 외 모든 텍스트</p>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ♿ 색상 대비 검사기란?
        </h2>
        <p className="text-sm leading-relaxed">
          색상 대비 검사기는 텍스트와 배경 사이의 명도 대비율을 측정하는 웹 접근성 도구입니다.
          WCAG(Web Content Accessibility Guidelines) 2.1 기준에 따라 AA/AAA 등급 충족 여부를 실시간으로 확인할 수 있습니다.
          시각 장애가 있는 사용자도 콘텐츠를 읽을 수 있도록 보장하는 것은 법적 요구사항이기도 합니다.
          디자인 단계에서 대비율을 검사하면 접근성 문제를 사전에 예방할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 WCAG 대비율 기준표
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">등급</th>
                <th className="text-left py-2 px-2">일반 텍스트</th>
                <th className="text-left py-2 px-2">큰 텍스트</th>
                <th className="text-left py-2 px-2">적용 범위</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium text-yellow-600">AA</td><td>4.5:1 이상</td><td>3:1 이상</td><td>최소 기준 (법적 요구사항)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium text-green-600">AAA</td><td>7:1 이상</td><td>4.5:1 이상</td><td>향상된 접근성</td></tr>
              <tr><td className="py-2 px-2 font-medium text-gray-500">참고</td><td colSpan={3}>큰 텍스트 = 18pt(24px) 이상 또는 14pt(18.67px) Bold 이상</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 접근성 디자인 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>본문 텍스트</strong>: 최소 AA(4.5:1) 충족, 가능하면 AAA(7:1) 권장</li>
          <li><strong>플레이스홀더</strong>: 힌트 텍스트도 3:1 이상 유지</li>
          <li><strong>에러 메시지</strong>: 빨간색 + 아이콘으로 색상에만 의존하지 않기</li>
          <li><strong>링크 텍스트</strong>: 주변 텍스트와 구별되도록 밑줄 또는 굵기 추가</li>
          <li><strong>다크 모드</strong>: 밝은 모드와 동일한 대비율 기준 적용</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'AA와 AAA 등급의 차이는 무엇인가요?',
            answer: 'AA는 최소 접근성 기준으로 법적 요구사항입니다. AAA는 더 높은 대비율을 요구하며, 저시력 사용자에게 더 나은 경험을 제공합니다. 대부분의 웹사이트는 AA를 목표로 하고, 중요한 콘텐츠는 AAA를 권장합니다.',
          },
          {
            question: '왜 큰 텍스트는 기준이 낮은가요?',
            answer: '큰 텍스트는 획이 두껍고 면적이 넓어 저시력 사용자도 인식하기 쉽습니다. 따라서 동일한 가독성을 위해 더 낮은 대비율이 허용됩니다.',
          },
          {
            question: '색상 대비만 맞추면 접근성이 보장되나요?',
            answer: '아니요, 대비율은 접근성의 일부입니다. 키보드 네비게이션, 스크린리더 호환성, 포커스 표시, 의미 있는 대체 텍스트 등 다양한 요소를 함께 고려해야 합니다.',
          },
        ]}
      />
    </div>
  );
}
