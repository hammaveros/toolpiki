'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

type ColorBlindType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

interface ColorBlindInfo {
  name: string;
  description: string;
  matrix: number[][];
}

const COLOR_BLIND_TYPES: Record<ColorBlindType, ColorBlindInfo> = {
  normal: {
    name: '정상',
    description: '정상 색각',
    matrix: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
  },
  protanopia: {
    name: '적색맹',
    description: '빨간색을 인식하지 못함 (L-cone 결핍)',
    matrix: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758],
    ],
  },
  deuteranopia: {
    name: '녹색맹',
    description: '녹색을 인식하지 못함 (M-cone 결핍)',
    matrix: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7],
    ],
  },
  tritanopia: {
    name: '청색맹',
    description: '파란색을 인식하지 못함 (S-cone 결핍)',
    matrix: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525],
    ],
  },
  achromatopsia: {
    name: '전색맹',
    description: '색을 전혀 인식하지 못함 (흑백)',
    matrix: [
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
    ],
  },
};

function applyColorBlindness(imageData: ImageData, type: ColorBlindType): ImageData {
  const matrix = COLOR_BLIND_TYPES[type].matrix;
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    data[i] = Math.min(255, Math.max(0, r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2]));
    data[i + 1] = Math.min(255, Math.max(0, r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2]));
    data[i + 2] = Math.min(255, Math.max(0, r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2]));
  }

  return imageData;
}

// HEX to RGB 변환
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

// 색맹 시뮬레이션 색상 계산 (단일 색상)
function simulateColorBlindness(hex: string, type: ColorBlindType): string {
  const { r, g, b } = hexToRgb(hex);
  const matrix = COLOR_BLIND_TYPES[type].matrix;

  const newR = Math.min(255, Math.max(0, Math.round(r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2])));
  const newG = Math.min(255, Math.max(0, Math.round(r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2])));
  const newB = Math.min(255, Math.max(0, Math.round(r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2])));

  return `rgb(${newR}, ${newG}, ${newB})`;
}

const PALETTE_COLORS = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FF8000', '#80FF00', '#0080FF', '#FF0080', '#8000FF', '#00FF80'
];

export function ColorBlindSimulator() {
  const [selectedType, setSelectedType] = useState<ColorBlindType>('protanopia');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback((imageSrc: string, type: ColorBlindType) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const processed = applyColorBlindness(imageData, type);
      ctx.putImageData(processed, 0, 0);

      setProcessedImage(canvas.toDataURL());
    };
    img.src = imageSrc;
  }, []);

  useEffect(() => {
    if (originalImage) {
      processImage(originalImage, selectedType);
    }
  }, [originalImage, selectedType, processImage]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setOriginalImage(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-2">
      {/* 색맹 유형 선택 */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(COLOR_BLIND_TYPES) as [ColorBlindType, ColorBlindInfo][]).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setSelectedType(key)}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedType === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {info.name}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        {COLOR_BLIND_TYPES[selectedType].description}
      </p>

      {/* 이미지 업로드 */}
      {!originalImage ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors',
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          )}
        >
          <div className="text-4xl mb-4">🖼️</div>
          <p className="text-gray-600 dark:text-gray-400">
            이미지를 드래그하거나 클릭하여 업로드
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            PNG, JPG, GIF 지원
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="bordered" className="p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                원본
              </h3>
              <img
                src={originalImage}
                alt="원본 이미지"
                className="w-full rounded-lg"
              />
            </Card>
            <Card variant="bordered" className="p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {COLOR_BLIND_TYPES[selectedType].name} 시뮬레이션
              </h3>
              {processedImage && (
                <img
                  src={processedImage}
                  alt="시뮬레이션 이미지"
                  className="w-full rounded-lg"
                />
              )}
            </Card>
          </div>

          <Button
            onClick={() => { setOriginalImage(null); setProcessedImage(null); }}
            variant="secondary"
            className="w-full"
          >
            다른 이미지 선택
          </Button>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {/* 색상 팔레트 테스트 */}
      <Card variant="bordered" className="p-5">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          색상 팔레트 비교
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {PALETTE_COLORS.map((color) => {
            const simColor = simulateColorBlindness(color, selectedType);

            return (
              <div key={color} className="space-y-1">
                <div
                  className="aspect-square rounded-lg"
                  style={{ backgroundColor: color }}
                  title={`원본: ${color}`}
                />
                <div
                  className="aspect-square rounded-lg"
                  style={{ backgroundColor: simColor }}
                  title={`시뮬레이션: ${simColor}`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>원본</span>
          <span>시뮬레이션</span>
        </div>
      </Card>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          👁️ 색맹 시뮬레이터란?
        </h2>
        <p className="text-sm leading-relaxed">
          색맹 시뮬레이터는 색각이상(색맹/색약)을 가진 사람이 이미지를 어떻게 인식하는지 시뮬레이션하는 접근성 도구입니다.
          적색맹(Protanopia), 녹색맹(Deuteranopia), 청색맹(Tritanopia), 전색맹(Achromatopsia) 등 주요 유형을 지원합니다.
          업로드한 이미지뿐 아니라 색상 팔레트도 실시간으로 비교할 수 있어 디자인 검토에 유용합니다.
          전 세계 남성의 약 8%, 여성의 약 0.5%가 색각이상을 가지고 있어 접근성 고려는 필수입니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 색각이상 유형 가이드
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">유형</th>
                <th className="text-left py-2 px-2">영향받는 색상</th>
                <th className="text-left py-2 px-2">유병률</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">적색맹 (Protanopia)</td><td>빨강-녹색 구분 어려움</td><td>남성 1%, 여성 0.01%</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">녹색맹 (Deuteranopia)</td><td>빨강-녹색 구분 어려움</td><td>남성 5%, 여성 0.4%</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">청색맹 (Tritanopia)</td><td>파랑-노랑 구분 어려움</td><td>매우 드묾 (0.01%)</td></tr>
              <tr><td className="py-2 px-2 font-medium">전색맹 (Achromatopsia)</td><td>모든 색상 (흑백만)</td><td>극히 드묾 (0.003%)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 접근성 디자인 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>색상만에 의존하지 않기</strong>: 아이콘, 패턴, 텍스트 레이블 함께 사용</li>
          <li><strong>충분한 대비</strong>: 배경과 전경 색상의 명도 차이 확보</li>
          <li><strong>안전한 색상 조합</strong>: 빨강-녹색 대신 파랑-주황 조합 권장</li>
          <li><strong>그래프/차트</strong>: 색상 외에 패턴이나 마커 사용</li>
          <li><strong>에러 표시</strong>: 빨간색 + 아이콘 + 텍스트로 다중 단서 제공</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '시뮬레이션이 실제 색맹과 동일한가요?',
            answer: '시뮬레이션은 과학적 모델에 기반하지만 개인마다 색각이상의 정도가 다릅니다. 대략적인 경향을 파악하는 용도로 사용하고, 실제 사용자 테스트를 권장합니다.',
          },
          {
            question: '어떤 유형을 먼저 확인해야 하나요?',
            answer: '적녹색맹(Deuteranopia + Protanopia)이 가장 흔하므로 이 두 유형을 우선 확인하세요. 전체 색각이상자의 99% 이상이 적녹색맹입니다.',
          },
          {
            question: '이미지가 서버로 전송되나요?',
            answer: '아니요, 모든 이미지 처리는 브라우저에서 로컬로 이루어집니다. 개인정보 보호를 위해 이미지는 어디에도 업로드되지 않습니다.',
          },
        ]}
      />
    </div>
  );
}
