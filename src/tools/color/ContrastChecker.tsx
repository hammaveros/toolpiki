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
          <strong className="text-gray-900 dark:text-white">색상 대비 검사기는 텍스트와 배경의 <strong>명도 대비율</strong>을 측정하는 웹 접근성 도구입니다.</strong>{' '}
          <strong>WCAG 2.1</strong> 기준에 따라 <strong>AA/AAA 등급</strong> 충족 여부를 실시간으로 확인할 수 있습니다.
          시각 장애가 있는 사용자도 콘텐츠를 읽을 수 있도록 보장하는 것은 <strong>법적 요구사항</strong>이기도 합니다.
          디자인 단계에서 대비율을 검사하면 접근성 문제를 사전에 예방할 수 있습니다.
        </p>

        <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 p-4 text-sm">
          <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">⚠️ WCAG 기준</p>
          <p className="text-amber-800 dark:text-amber-300">
            일반 텍스트는 <strong>4.5:1</strong>(AA), 큰 텍스트는 <strong>3:1</strong>이 최소이며, <strong>버튼 테두리·아이콘</strong>도 인접 배경과 3:1 이상 대비가 필요합니다(SC 1.4.11).
          </p>
        </div>
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
          <li><strong>본문 텍스트</strong>: 최소 AA(4.5:1) 충족, 가능하면 AAA(7:1) 권장. 흰 배경에 #767676이 정확히 4.54:1로 경계선 케이스입니다.</li>
          <li><strong>플레이스홀더</strong>: 힌트 텍스트도 3:1 이상을 유지하세요. 흔히 보이는 옅은 회색(#CCC)은 1.61:1로 기준 미달입니다.</li>
          <li><strong>에러 메시지</strong>: 빨간색만 쓰면 적록색약 사용자(전체 남성의 약 8%)가 인지하지 못합니다. 아이콘, 텍스트 라벨을 함께 표시하세요.</li>
          <li><strong>링크 텍스트</strong>: 주변 본문과의 대비뿐 아니라 본문 색과 링크 색의 대비도 3:1 이상이어야 색맹 사용자가 구분할 수 있습니다.</li>
          <li><strong>다크 모드</strong>: 검은 배경에 순백(#FFF)을 쓰면 대비가 너무 강해 잔상이 생깁니다. #E5E5E5 ~ #F0F0F0 사이가 가독성이 좋습니다.</li>
          <li><strong>UI 컴포넌트</strong>: 버튼 테두리, 폼 인풋 보더, 아이콘 같은 비텍스트 요소도 인접 배경과 3:1 이상 대비가 필요합니다(WCAG 2.1 SC 1.4.11).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📐 대비율 계산 원리
        </h2>
        <p className="text-sm leading-relaxed">
          대비율은 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">(L1 + 0.05) / (L2 + 0.05)</code> 공식으로 계산되며, L1은 밝은 색, L2는 어두운 색의 <strong>상대 휘도</strong>입니다.
          상대 휘도는 sRGB의 R/G/B 값을 감마 보정한 뒤 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">0.2126·R + 0.7152·G + 0.0722·B</code>로 가중 평균합니다.
          <strong>녹색 가중치</strong>가 가장 큰 이유는 사람 눈이 녹색 영역에 가장 민감하기 때문이며,
          그래서 채도 높은 노랑(<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">#FFFF00</code>)은 흰 배경에서 <strong>1.07:1</strong>로 거의 보이지 않고, 채도 낮은 파랑은 같은 RGB 합산값이라도 대비가 더 높게 측정됩니다.
        </p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'AA와 AAA 등급의 차이는 무엇인가요?',
            answer: 'AA는 최소 접근성 기준으로 한국 KWCAG, 미국 ADA, EU EAA 등에서 법적 요구사항으로 채택됩니다. AAA는 더 높은 대비율을 요구하며, 저시력 사용자에게 더 나은 경험을 제공합니다. 대부분의 웹사이트는 AA를 목표로 하고, 정부·금융·의료 사이트는 AAA를 권장합니다.',
          },
          {
            question: '왜 큰 텍스트는 기준이 낮은가요?',
            answer: '큰 텍스트는 획이 두껍고 면적이 넓어 저시력 사용자도 인식하기 쉽습니다. 18pt(24px) 이상 또는 14pt(18.67px) Bold 이상이 "큰 텍스트"로 분류되며, 동일한 가독성을 위해 더 낮은 대비율(3:1)이 허용됩니다.',
          },
          {
            question: '색상 대비만 맞추면 접근성이 보장되나요?',
            answer: '아니요, 대비율은 접근성의 일부입니다. 키보드 네비게이션, 스크린리더 호환성, 포커스 표시, 의미 있는 대체 텍스트, 폼 라벨 연결, 동영상 자막 등 다양한 요소를 함께 고려해야 WCAG 전체 기준을 충족합니다.',
          },
          {
            question: '브랜드 색이 기준 미달이면 어떻게 하나요?',
            answer: '브랜드 색은 강조 요소(헤더, 버튼)에만 사용하고 본문은 별도의 텍스트 색을 정의하는 것이 안전합니다. 예를 들어 brand-500이 본문에 부적합하면 brand-700 또는 brand-900을 텍스트 전용 토큰으로 추가하세요.',
          },
        ]}
      />
    </div>
  );
}
