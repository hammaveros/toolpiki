'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

interface Measurement {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number;
  height: number;
  diagonal: number;
}

export function ScreenRuler() {
  const [isActive, setIsActive] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [currentMeasurement, setCurrentMeasurement] = useState<Partial<Measurement> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dpi, setDpi] = useState(96);
  const containerRef = useRef<HTMLDivElement>(null);

  // DPI 자동 감지 시도
  useEffect(() => {
    const testDiv = document.createElement('div');
    testDiv.style.width = '1in';
    testDiv.style.height = '1in';
    testDiv.style.position = 'absolute';
    testDiv.style.left = '-100%';
    document.body.appendChild(testDiv);
    const detectedDpi = testDiv.offsetWidth;
    document.body.removeChild(testDiv);
    if (detectedDpi > 0) setDpi(detectedDpi);
  }, []);

  const pxToMm = useCallback((px: number) => (px / dpi) * 25.4, [dpi]);
  const pxToInch = useCallback((px: number) => px / dpi, [dpi]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setCurrentMeasurement({
      id: Date.now().toString(),
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !currentMeasurement) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentMeasurement((prev) => ({
      ...prev,
      endX: x,
      endY: y,
    }));
  };

  const handleMouseUp = () => {
    if (!isDragging || !currentMeasurement) return;

    const width = Math.abs((currentMeasurement.endX || 0) - (currentMeasurement.startX || 0));
    const height = Math.abs((currentMeasurement.endY || 0) - (currentMeasurement.startY || 0));
    const diagonal = Math.sqrt(width * width + height * height);

    if (width > 5 || height > 5) {
      setMeasurements((prev) => [
        ...prev,
        {
          ...(currentMeasurement as Measurement),
          width,
          height,
          diagonal,
        },
      ]);
    }

    setIsDragging(false);
    setCurrentMeasurement(null);
  };

  const removeMeasurement = (id: string) => {
    setMeasurements((prev) => prev.filter((m) => m.id !== id));
  };

  const clearAll = () => {
    setMeasurements([]);
  };

  const getCurrentWidth = () => Math.abs((currentMeasurement?.endX || 0) - (currentMeasurement?.startX || 0));
  const getCurrentHeight = () => Math.abs((currentMeasurement?.endY || 0) - (currentMeasurement?.startY || 0));
  const getCurrentDiagonal = () => Math.sqrt(getCurrentWidth() ** 2 + getCurrentHeight() ** 2);

  return (
    <div className="space-y-4">
      {/* 컨트롤 */}
      <Card variant="bordered" className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Button onClick={() => setIsActive(!isActive)} variant={isActive ? 'primary' : 'secondary'}>
            {isActive ? '측정 중지' : '측정 시작'}
          </Button>
          <Button variant="secondary" onClick={clearAll} disabled={measurements.length === 0}>
            전체 삭제
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-500">DPI:</span>
            <input
              type="number"
              value={dpi}
              onChange={(e) => setDpi(parseInt(e.target.value) || 96)}
              className="w-20 px-2 py-1 text-sm border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>
      </Card>

      {/* 측정 영역 */}
      <Card variant="bordered" className="p-0 overflow-hidden">
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative h-80 bg-gray-50 dark:bg-gray-900 ${
            isActive ? 'cursor-crosshair' : 'cursor-default'
          }`}
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '10px 10px',
          }}
        >
          {/* 눈금자 (상단) */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex">
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} className="relative flex-shrink-0" style={{ width: 10 }}>
                {i % 10 === 0 && (
                  <>
                    <div className="absolute bottom-0 left-0 w-px h-4 bg-gray-400" />
                    <span className="absolute top-0 left-0.5 text-[8px] text-gray-400">{i * 10}</span>
                  </>
                )}
                {i % 5 === 0 && i % 10 !== 0 && <div className="absolute bottom-0 left-0 w-px h-2 bg-gray-300" />}
              </div>
            ))}
          </div>

          {/* 눈금자 (좌측) */}
          <div className="absolute top-6 left-0 bottom-0 w-6 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="relative flex-shrink-0" style={{ height: 10 }}>
                {i % 10 === 0 && (
                  <>
                    <div className="absolute right-0 top-0 h-px w-4 bg-gray-400" />
                    <span className="absolute left-0.5 -top-1 text-[8px] text-gray-400">{i * 10}</span>
                  </>
                )}
                {i % 5 === 0 && i % 10 !== 0 && <div className="absolute right-0 top-0 h-px w-2 bg-gray-300" />}
              </div>
            ))}
          </div>

          {/* 기존 측정 표시 */}
          {measurements.map((m) => {
            const left = Math.min(m.startX, m.endX) + 24;
            const top = Math.min(m.startY, m.endY) + 24;
            return (
              <div
                key={m.id}
                className="absolute border-2 border-blue-500 bg-blue-500/10"
                style={{ left, top, width: m.width, height: m.height }}
              >
                <button
                  onClick={() => removeMeasurement(m.id)}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
                <div className="absolute -bottom-6 left-0 text-xs bg-blue-600 text-white px-1 rounded whitespace-nowrap">
                  {m.width.toFixed(0)}×{m.height.toFixed(0)}px
                </div>
              </div>
            );
          })}

          {/* 현재 측정 중인 영역 */}
          {currentMeasurement && isDragging && (
            <div
              className="absolute border-2 border-dashed border-green-500 bg-green-500/10"
              style={{
                left: Math.min(currentMeasurement.startX || 0, currentMeasurement.endX || 0) + 24,
                top: Math.min(currentMeasurement.startY || 0, currentMeasurement.endY || 0) + 24,
                width: getCurrentWidth(),
                height: getCurrentHeight(),
              }}
            >
              <div className="absolute -bottom-6 left-0 text-xs bg-green-600 text-white px-1 rounded whitespace-nowrap">
                {getCurrentWidth().toFixed(0)}×{getCurrentHeight().toFixed(0)}px
              </div>
            </div>
          )}

          {/* 안내 문구 */}
          {isActive && measurements.length === 0 && !currentMeasurement && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-gray-400 text-sm">드래그하여 영역을 측정하세요</p>
            </div>
          )}
        </div>
      </Card>

      {/* 현재 측정값 */}
      {currentMeasurement && isDragging && (
        <Card variant="bordered" className="p-4 bg-green-50 dark:bg-green-900/20">
          <h3 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">측정 중</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">너비:</span>{' '}
              <strong>{getCurrentWidth().toFixed(0)}px</strong>
              <span className="text-xs text-gray-400 ml-1">({pxToMm(getCurrentWidth()).toFixed(1)}mm)</span>
            </div>
            <div>
              <span className="text-gray-500">높이:</span>{' '}
              <strong>{getCurrentHeight().toFixed(0)}px</strong>
              <span className="text-xs text-gray-400 ml-1">({pxToMm(getCurrentHeight()).toFixed(1)}mm)</span>
            </div>
            <div>
              <span className="text-gray-500">대각선:</span>{' '}
              <strong>{getCurrentDiagonal().toFixed(0)}px</strong>
            </div>
          </div>
        </Card>
      )}

      {/* 측정 기록 */}
      {measurements.length > 0 && (
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">측정 기록</h3>
          <div className="space-y-2">
            {measurements.map((m, i) => (
              <div key={m.id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <span className="text-gray-500">#{i + 1}</span>
                <span>
                  <strong>{m.width.toFixed(0)}</strong> × <strong>{m.height.toFixed(0)}</strong> px
                </span>
                <span className="text-gray-400">
                  ({pxToMm(m.width).toFixed(1)} × {pxToMm(m.height).toFixed(1)} mm)
                </span>
                <button onClick={() => removeMeasurement(m.id)} className="text-red-500 hover:text-red-700">
                  삭제
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 설명 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 측정 시작 버튼을 누르고 영역을 드래그하세요</p>
        <p>• mm 단위는 DPI 설정에 따라 달라집니다 (기본 96)</p>
        <p>• 정확한 mm 측정을 위해 모니터 DPI를 확인하세요</p>
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
          📏 화면 자란?
        </h2>
        <p className="text-sm leading-relaxed">
          화면 자는 모니터에서 영역을 드래그하여 픽셀 단위로 크기를 측정하는 도구입니다.
          DPI(인치당 픽셀 수) 설정을 기준으로 mm, 인치 단위로도 환산합니다.
          UI/UX 디자인, 웹 개발, 이미지 크기 확인 등에 필수적인 도구입니다.
          여러 영역을 동시에 측정하고 기록으로 남길 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 주요 해상도별 DPI
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">디스플레이</th>
                <th className="text-left py-2 px-2">일반 DPI</th>
                <th className="text-left py-2 px-2">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">일반 모니터</td><td className="font-mono">96 DPI</td><td>Windows 기본값</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">MacBook Pro</td><td className="font-mono">110-220 DPI</td><td>Retina 디스플레이</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">4K 27인치</td><td className="font-mono">163 DPI</td><td>고해상도</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">스마트폰</td><td className="font-mono">300-500+ DPI</td><td>초고밀도</td></tr>
              <tr><td className="py-2 px-2 font-medium">인쇄물</td><td className="font-mono">300+ DPI</td><td>출력 품질 기준</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 화면 측정 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>DPI 확인</strong>: 정확한 mm 측정을 위해 모니터 사양에서 DPI 확인</li>
          <li><strong>배율 주의</strong>: Windows/Mac 화면 배율이 100%가 아니면 픽셀 계산이 달라짐</li>
          <li><strong>디자인 검수</strong>: 시안의 여백, 버튼 크기가 디자인 스펙과 일치하는지 확인</li>
          <li><strong>반응형 테스트</strong>: 다양한 해상도에서 요소 크기 변화 측정</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'DPI를 어떻게 확인하나요?',
            answer: '모니터 사양서에서 확인하거나, 해상도(가로 픽셀)를 화면 가로 크기(인치)로 나눕니다. 예: 1920px / 23.8인치 ≈ 81 DPI. 기본값 96 DPI는 대략적인 참고용입니다.',
          },
          {
            question: '브라우저 확대/축소 시에도 정확한가요?',
            answer: '아닙니다. 브라우저 확대/축소(Ctrl+휠)는 픽셀 계산에 영향을 줍니다. 정확한 측정을 위해 100% 배율에서 사용하세요.',
          },
          {
            question: '다른 앱의 요소도 측정할 수 있나요?',
            answer: '이 도구는 웹 브라우저 내 측정 영역에서만 작동합니다. 전체 화면을 측정하려면 OS의 스크린 캡처 도구나 전용 화면 측정 앱을 사용하세요.',
          },
        ]}
      />
    </div>
  );
}
