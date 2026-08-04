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
          <strong className="text-gray-900 dark:text-white">색맹 시뮬레이터는 색각이상을 가진 사람이 이미지를 어떻게 보는지 재현하는 <strong>접근성 도구</strong>입니다.</strong>{' '}
          <strong>적색맹</strong>(Protanopia), <strong>녹색맹</strong>(Deuteranopia), <strong>청색맹</strong>(Tritanopia), 전색맹(Achromatopsia) 등 주요 유형을 지원합니다.
          업로드한 이미지뿐 아니라 색상 팔레트도 실시간으로 비교할 수 있어 디자인 검토에 유용합니다.
          전 세계 <strong>남성의 약 8%</strong>, 여성의 약 0.5%가 색각이상을 가지고 있어 접근성 고려는 필수입니다.
        </p>

        <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 p-4 text-sm">
          <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">⚠️ 접근성 체크</p>
          <p className="text-amber-800 dark:text-amber-300">
            색각이상자의 <strong>99% 이상</strong>이 <strong>적녹색맹</strong>입니다. 색상만으로 정보 전달하지 말고 <strong>아이콘·텍스트 라벨</strong>을 함께 제공하세요.
          </p>
        </div>
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
          🎨 색각이상에 안전한 팔레트 선택
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          같은 &quot;구분되는 두 색&quot;이라도 조합에 따라 결과가 크게 갈립니다.
          적록 색각이상에서 특히 취약한 조합과 안전한 대안입니다.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">피해야 할 조합</th>
                <th className="text-left py-2 px-2">문제</th>
                <th className="text-left py-2 px-2">대안</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">빨강 · 초록</td><td>거의 같은 색으로 보임</td><td>파랑 · 주황</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">초록 · 갈색</td><td>구분 거의 불가</td><td>파랑 · 노랑</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">연두 · 노랑</td><td>명도까지 비슷해 겹침</td><td>진한 파랑 · 밝은 노랑</td></tr>
              <tr><td className="py-1.5 px-2">분홍 · 회색</td><td>채도가 낮아지면 동일</td><td>명도 차이를 크게</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed mt-3">
          핵심은 <strong>색상(Hue)이 아니라 명도(Lightness) 차이</strong>를 두는 것입니다.
          색상만 다르고 밝기가 비슷하면 색각이상에서 하나로 뭉쳐 보이지만,
          명도가 충분히 다르면 색을 구분하지 못해도 &quot;진한 쪽과 연한 쪽&quot;으로 인식됩니다.
          <strong>파랑 계열은 대부분의 색각이상에서 비교적 안정적</strong>으로 보이므로 기준 색으로 삼기 좋습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📈 데이터 시각화에서의 대응
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          차트는 색에 의존하기 쉬운 대표적인 영역입니다. 색 외의 단서를 하나만 더해도 크게 개선됩니다.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>계열 수를 줄이기</strong> — 한 차트에 5개 이상의 색을 쓰면 누구에게나 구분이 어렵습니다.</li>
          <li><strong>직접 라벨링</strong> — 범례 대신 선 끝에 이름을 붙이면 색과 계열을 대조할 필요가 없어집니다.</li>
          <li><strong>선 모양과 마커</strong> — 실선·점선, 원·삼각형·사각형 마커로 색 없이도 구분됩니다.</li>
          <li><strong>막대는 패턴</strong> — 빗금이나 도트 패턴을 넣으면 흑백 인쇄에서도 읽힙니다.</li>
          <li><strong>순차형 데이터는 단색 그라데이션</strong> — 하나의 색상에서 밝기만 변화시키면 색각이상에서도 순서가 유지됩니다.</li>
        </ul>
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
          {
            question: '빨강-초록 대신 어떤 색 조합을 써야 하나요?',
            answer: '파랑-주황 조합이 가장 안전합니다. 파랑 계열은 대부분의 색각이상에서 비교적 안정적으로 보이기 때문에 기준 색으로 삼기 좋습니다.',
          },
          {
            question: '색상만 다르면 구분되는 것 아닌가요?',
            answer: '아닙니다. 색상이 달라도 밝기가 비슷하면 색각이상에서 하나로 뭉쳐 보입니다. 명도 차이를 충분히 두면 색을 구분하지 못해도 진한 쪽과 연한 쪽으로 인식됩니다.',
          },
          {
            question: '차트에서 계열을 구분하려면 어떻게 하나요?',
            answer: '색 외의 단서를 추가하세요. 실선·점선, 마커 모양, 막대 패턴이 효과적이고, 범례 대신 선 끝에 직접 이름을 붙이면 색을 대조할 필요 자체가 없어집니다.',
          },
        ]}
      />
    </div>
  );
}
