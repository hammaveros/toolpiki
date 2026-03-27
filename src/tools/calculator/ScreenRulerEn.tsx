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

export function ScreenRulerEn() {
  const [isActive, setIsActive] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [currentMeasurement, setCurrentMeasurement] = useState<Partial<Measurement> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dpi, setDpi] = useState(96);
  const containerRef = useRef<HTMLDivElement>(null);

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
      {/* Controls */}
      <Card variant="bordered" className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Button onClick={() => setIsActive(!isActive)} variant={isActive ? 'primary' : 'secondary'}>
            {isActive ? 'Stop Measuring' : 'Start Measuring'}
          </Button>
          <Button variant="secondary" onClick={clearAll} disabled={measurements.length === 0}>
            Clear All
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

      {/* Measurement Area */}
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
          {/* Top Ruler */}
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

          {/* Left Ruler */}
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

          {/* Existing Measurements */}
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

          {/* Current Measurement */}
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

          {/* Guide Text */}
          {isActive && measurements.length === 0 && !currentMeasurement && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-gray-400 text-sm">Drag to measure an area</p>
            </div>
          )}
        </div>
      </Card>

      {/* Current Measurement Info */}
      {currentMeasurement && isDragging && (
        <Card variant="bordered" className="p-4 bg-green-50 dark:bg-green-900/20">
          <h3 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">Measuring</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Width:</span>{' '}
              <strong>{getCurrentWidth().toFixed(0)}px</strong>
              <span className="text-xs text-gray-400 ml-1">({pxToMm(getCurrentWidth()).toFixed(1)}mm)</span>
            </div>
            <div>
              <span className="text-gray-500">Height:</span>{' '}
              <strong>{getCurrentHeight().toFixed(0)}px</strong>
              <span className="text-xs text-gray-400 ml-1">({pxToMm(getCurrentHeight()).toFixed(1)}mm)</span>
            </div>
            <div>
              <span className="text-gray-500">Diagonal:</span>{' '}
              <strong>{getCurrentDiagonal().toFixed(0)}px</strong>
            </div>
          </div>
        </Card>
      )}

      {/* Measurement History */}
      {measurements.length > 0 && (
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Measurements</h3>
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
                  Remove
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Info */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Click Start and drag to measure areas</p>
        <p>• mm values depend on DPI setting (default 96)</p>
        <p>• For accurate mm measurements, verify your monitor DPI</p>
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
          📏 What is Screen Ruler?
        </h2>
        <p className="text-sm leading-relaxed">
          Screen Ruler measures on-screen areas by dragging to get pixel dimensions.
          It also converts to mm and inches based on your DPI (dots per inch) settings.
          Essential for UI/UX design, web development, and checking image sizes.
          Measure multiple areas simultaneously and keep a record of measurements.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Common Display DPI Values
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Display</th>
                <th className="text-left py-2 px-2">Typical DPI</th>
                <th className="text-left py-2 px-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Standard Monitor</td><td className="font-mono">96 DPI</td><td>Windows default</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">MacBook Pro</td><td className="font-mono">110-220 DPI</td><td>Retina display</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">4K 27-inch</td><td className="font-mono">163 DPI</td><td>High resolution</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Smartphone</td><td className="font-mono">300-500+ DPI</td><td>Ultra high density</td></tr>
              <tr><td className="py-2 px-2 font-medium">Print</td><td className="font-mono">300+ DPI</td><td>Print quality standard</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Screen Measurement Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Check DPI</strong>: Find your monitor DPI in specs for accurate mm measurements</li>
          <li><strong>Watch scaling</strong>: Windows/Mac display scaling affects pixel calculations</li>
          <li><strong>Design review</strong>: Verify margins and button sizes match design specs</li>
          <li><strong>Responsive testing</strong>: Measure element sizes across different resolutions</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'How do I find my monitor DPI?',
            answer: 'Check your monitor specifications, or divide horizontal resolution by screen width in inches. Example: 1920px / 23.8 inches ≈ 81 DPI. The default 96 DPI is a rough approximation.',
          },
          {
            question: 'Is it accurate when browser is zoomed?',
            answer: 'No. Browser zoom (Ctrl+scroll) affects pixel calculations. Use 100% zoom level for accurate measurements.',
          },
          {
            question: 'Can I measure elements in other apps?',
            answer: 'This tool only works within the browser measurement area. For full-screen measurements, use your OS screenshot tools or dedicated screen measurement applications.',
          },
        ]}
      />
    </div>
  );
}
