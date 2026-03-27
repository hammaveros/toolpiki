'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

type CssUnit = 'px' | 'rem' | 'em' | 'pt' | 'vw' | 'vh';

interface ConversionResult {
  unit: CssUnit;
  value: string;
  css: string;
}

export function CssUnitConverter() {
  const [value, setValue] = useState('16');
  const [fromUnit, setFromUnit] = useState<CssUnit>('px');
  const [baseFontSize, setBaseFontSize] = useState('16');
  const [viewportWidth, setViewportWidth] = useState('1920');
  const [viewportHeight, setViewportHeight] = useState('1080');

  const results = useMemo(() => {
    const inputValue = parseFloat(value);
    const base = parseFloat(baseFontSize);
    const vw = parseFloat(viewportWidth);
    const vh = parseFloat(viewportHeight);

    if (isNaN(inputValue) || isNaN(base) || base === 0) return [];

    // 먼저 px로 변환
    let pxValue: number;
    switch (fromUnit) {
      case 'px':
        pxValue = inputValue;
        break;
      case 'rem':
      case 'em':
        pxValue = inputValue * base;
        break;
      case 'pt':
        pxValue = inputValue * (96 / 72); // 1pt = 96/72 px
        break;
      case 'vw':
        pxValue = (inputValue / 100) * vw;
        break;
      case 'vh':
        pxValue = (inputValue / 100) * vh;
        break;
      default:
        pxValue = inputValue;
    }

    // px에서 각 단위로 변환
    const conversions: ConversionResult[] = [
      {
        unit: 'px',
        value: pxValue.toFixed(2),
        css: `${pxValue.toFixed(2)}px`,
      },
      {
        unit: 'rem',
        value: (pxValue / base).toFixed(4),
        css: `${(pxValue / base).toFixed(4)}rem`,
      },
      {
        unit: 'em',
        value: (pxValue / base).toFixed(4),
        css: `${(pxValue / base).toFixed(4)}em`,
      },
      {
        unit: 'pt',
        value: (pxValue * (72 / 96)).toFixed(2),
        css: `${(pxValue * (72 / 96)).toFixed(2)}pt`,
      },
      {
        unit: 'vw',
        value: ((pxValue / vw) * 100).toFixed(4),
        css: `${((pxValue / vw) * 100).toFixed(4)}vw`,
      },
      {
        unit: 'vh',
        value: ((pxValue / vh) * 100).toFixed(4),
        css: `${((pxValue / vh) * 100).toFixed(4)}vh`,
      },
    ];

    return conversions;
  }, [value, fromUnit, baseFontSize, viewportWidth, viewportHeight]);

  const units: CssUnit[] = ['px', 'rem', 'em', 'pt', 'vw', 'vh'];

  const presets = [
    { label: '8px', value: '8', unit: 'px' as CssUnit },
    { label: '12px', value: '12', unit: 'px' as CssUnit },
    { label: '14px', value: '14', unit: 'px' as CssUnit },
    { label: '16px', value: '16', unit: 'px' as CssUnit },
    { label: '20px', value: '20', unit: 'px' as CssUnit },
    { label: '24px', value: '24', unit: 'px' as CssUnit },
    { label: '32px', value: '32', unit: 'px' as CssUnit },
    { label: '1rem', value: '1', unit: 'rem' as CssUnit },
    { label: '1.5rem', value: '1.5', unit: 'rem' as CssUnit },
    { label: '2rem', value: '2', unit: 'rem' as CssUnit },
  ];

  return (
    <div className="space-y-2">
      {/* 입력 */}
      <div className="flex gap-2">
        <Input
          label="값"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="16"
          className="flex-1"
        />
        <div className="w-24">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            단위
          </label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as CssUnit)}
            className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 프리셋 */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="secondary"
            size="sm"
            onClick={() => {
              setValue(preset.value);
              setFromUnit(preset.unit);
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* 기준값 설정 */}
      <Card variant="bordered" className="p-4">
        <p className="text-sm font-medium mb-3">기준값 설정</p>
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="root font-size (px)"
            type="number"
            value={baseFontSize}
            onChange={(e) => setBaseFontSize(e.target.value)}
            placeholder="16"
          />
          <Input
            label="viewport width (px)"
            type="number"
            value={viewportWidth}
            onChange={(e) => setViewportWidth(e.target.value)}
            placeholder="1920"
          />
          <Input
            label="viewport height (px)"
            type="number"
            value={viewportHeight}
            onChange={(e) => setViewportHeight(e.target.value)}
            placeholder="1080"
          />
        </div>
      </Card>

      {/* 결과 */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {results.map((result) => (
            <Card
              key={result.unit}
              variant="bordered"
              className={`p-4 ${result.unit === fromUnit ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {result.unit}
                </span>
                <CopyButton text={result.css} size="sm" />
              </div>
              <p className="text-lg font-mono font-medium truncate">
                {result.value}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono truncate">
                {result.css}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* 참고 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• rem/em: root font-size 기준 (기본 16px)</p>
        <p>• vw/vh: viewport 너비/높이의 1%</p>
        <p>• pt: 인쇄용 포인트 (1pt = 1/72 inch)</p>
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
          📏 CSS 단위 변환기란?
        </h2>
        <p className="text-sm leading-relaxed">
          CSS 단위 변환기는 px, rem, em, pt, vw, vh 등 웹 개발에서 사용하는 단위를 상호 변환하는 도구입니다.
          root font-size(기본 16px)와 viewport 크기를 기준으로 정확한 변환값을 계산합니다.
          반응형 웹 디자인, 접근성 높은 폰트 크기 설정, 모바일/데스크톱 레이아웃 작업에 필수적입니다.
          변환된 CSS 값을 원클릭으로 복사하여 바로 코드에 붙여넣을 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 CSS 단위 비교표
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">단위</th>
                <th className="text-left py-2 px-2">기준</th>
                <th className="text-left py-2 px-2">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">px</td><td>고정 픽셀</td><td>절대 단위, 브라우저 확대에만 반응</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">rem</td><td>root font-size</td><td>html 기준, 일관된 크기 조절 가능</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">em</td><td>부모 font-size</td><td>중첩 시 복잡, 상대적 크기 조절</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">vw</td><td>viewport 너비</td><td>화면 너비 기준 반응형</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">vh</td><td>viewport 높이</td><td>화면 높이 기준 반응형</td></tr>
              <tr><td className="py-2 px-2 font-medium">pt</td><td>1/72 inch</td><td>인쇄 매체용, 웹에서는 비권장</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 CSS 단위 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>폰트 크기</strong>: rem 사용 권장 (접근성, 사용자 설정 존중)</li>
          <li><strong>레이아웃</strong>: vw/vh로 반응형 설계, 모바일 주소창 문제는 dvh 사용</li>
          <li><strong>여백/패딩</strong>: rem 또는 px (일관성 유지)</li>
          <li><strong>미디어쿼리</strong>: em 권장 (브라우저 확대에 더 잘 대응)</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'rem과 em의 차이점은 무엇인가요?',
            answer: 'rem은 html(root) 요소의 font-size를 기준으로 하고, em은 해당 요소의 부모 font-size를 기준으로 합니다. rem은 일관된 크기를 유지하기 쉽고, em은 중첩 시 누적되어 예측이 어려울 수 있습니다.',
          },
          {
            question: 'vw/vh 단위의 모바일 문제는 무엇인가요?',
            answer: '모바일 브라우저에서 주소창이 나타나거나 사라질 때 vh 값이 변경되어 레이아웃이 튀는 현상이 있습니다. CSS의 dvh(dynamic viewport height)나 svh(small viewport height)를 사용하면 해결됩니다.',
          },
          {
            question: '왜 16px이 기본값인가요?',
            answer: '대부분의 브라우저가 기본 font-size를 16px로 설정합니다. 따라서 1rem = 16px이 되고, 이를 기준으로 62.5% 트릭(10px 기준)을 사용하는 경우도 있습니다.',
          },
        ]}
      />
    </div>
  );
}
