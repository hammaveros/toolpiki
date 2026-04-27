'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

type ColorBlindType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

const colorBlindTypes: { type: ColorBlindType; name: string; description: string }[] = [
  { type: 'protanopia', name: '적색맹 (Protanopia)', description: '빨간색을 인식하지 못함' },
  { type: 'deuteranopia', name: '녹색맹 (Deuteranopia)', description: '녹색을 인식하지 못함' },
  { type: 'tritanopia', name: '청색맹 (Tritanopia)', description: '파란색을 인식하지 못함' },
  { type: 'achromatopsia', name: '전색맹 (Achromatopsia)', description: '색을 전혀 인식하지 못함' },
];

// 색맹 시뮬레이션 매트릭스
const matrices: Record<ColorBlindType, number[][]> = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
};

function applyColorBlindness(imageData: ImageData, type: ColorBlindType): ImageData {
  const data = imageData.data;
  const matrix = matrices[type];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    data[i] = Math.min(255, matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b);
    data[i + 1] = Math.min(255, matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b);
    data[i + 2] = Math.min(255, matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b);
  }

  return imageData;
}

export function ColorBlindness() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ColorBlindType>('deuteranopia');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = useCallback((imageSrc: string, type: ColorBlindType) => {
    setIsProcessing(true);

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

      setProcessedImage(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    };
    img.src = imageSrc;
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setOriginalImage(result);
      processImage(result, selectedType);
    };
    reader.readAsDataURL(file);
  };

  const handleTypeChange = (type: ColorBlindType) => {
    setSelectedType(type);
    if (originalImage) {
      processImage(originalImage, type);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.download = `colorblind-${selectedType}.png`;
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* 이미지 업로드 */}
      <Card variant="bordered" className="p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          {originalImage ? (
            <p className="text-sm text-gray-500">클릭하여 다른 이미지 선택</p>
          ) : (
            <>
              <p className="text-gray-500 mb-2">이미지를 클릭하거나 드래그하여 업로드</p>
              <p className="text-xs text-gray-400">PNG, JPG, WebP 지원</p>
            </>
          )}
        </div>
      </Card>

      {/* 색맹 타입 선택 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">색맹 유형 선택</h3>
        <div className="grid grid-cols-2 gap-2">
          {colorBlindTypes.map((item) => (
            <button
              key={item.type}
              onClick={() => handleTypeChange(item.type)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedType === item.type
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium text-gray-800 dark:text-white">{item.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* 이미지 비교 */}
      {originalImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="bordered" className="p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">원본</h3>
            <img src={originalImage} alt="Original" className="w-full rounded-lg" />
          </Card>

          <Card variant="bordered" className="p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {colorBlindTypes.find((t) => t.type === selectedType)?.name} 시뮬레이션
            </h3>
            {isProcessing ? (
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">처리 중...</span>
              </div>
            ) : processedImage ? (
              <img src={processedImage} alt="Simulated" className="w-full rounded-lg" />
            ) : null}
          </Card>
        </div>
      )}

      {/* 다운로드 버튼 */}
      {processedImage && (
        <Button onClick={handleDownload} className="w-full">
          시뮬레이션 이미지 다운로드
        </Button>
      )}

      {/* 숨김 캔버스 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 설명 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 색맹이 있는 사람들이 이미지를 어떻게 보는지 시뮬레이션합니다</p>
        <p>• 웹/앱 디자인 시 접근성 검토에 활용하세요</p>
        <p>• 이미지는 서버로 전송되지 않습니다</p>
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
          👁️ 색맹 시뮬레이터란?
        </h2>
        <p className="text-sm leading-relaxed">
          색맹 시뮬레이터는 색각 이상이 있는 사람들이 이미지나 디자인을 어떻게 보는지 시뮬레이션해주는 도구입니다.
          웹사이트, 앱, 인포그래픽 등을 디자인할 때 색맹 사용자도 정보를 정확히 인식할 수 있는지 확인하는 접근성(Accessibility) 검토에 필수적입니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔬 색맹의 종류
        </h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <div>
            <p className="font-medium">적록 색맹 (가장 흔함)</p>
            <p>전체 남성의 약 8%, 여성의 약 0.5%에게 나타납니다. 빨간색과 초록색을 구별하기 어렵습니다. 적색맹(Protanopia)과 녹색맹(Deuteranopia)으로 나뉩니다.</p>
          </div>
          <div>
            <p className="font-medium">청황 색맹</p>
            <p>파란색과 노란색을 구별하기 어려운 유형입니다. 청색맹(Tritanopia)이라고 하며, 적록 색맹보다 드문 편입니다.</p>
          </div>
          <div>
            <p className="font-medium">전색맹</p>
            <p>색을 전혀 구별할 수 없는 상태로 매우 드물게 나타납니다. 모든 것이 회색 톤으로 보입니다.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎨 접근성 디자인 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>색상만으로 정보를 전달하지 마세요. 패턴, 아이콘, 텍스트를 함께 사용하세요</li>
          <li>빨강-초록 조합 대신 파랑-주황 조합이 더 구별하기 쉽습니다</li>
          <li>그래프에서는 색상과 함께 다른 시각적 구분(점선, 마커 등)을 추가하세요</li>
          <li>충분한 명도 대비(Contrast ratio)를 확보하세요 (WCAG 기준 4.5:1 이상)</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '색맹은 얼마나 흔한가요?',
            answer: '전 세계 남성의 약 8%(12명 중 1명), 여성의 약 0.5%(200명 중 1명)가 색각 이상을 가지고 있습니다. 적록 색맹이 가장 흔합니다.',
          },
          {
            question: '이 시뮬레이터로 색맹 여부를 진단할 수 있나요?',
            answer: '아닙니다. 이 도구는 색맹인 사람이 어떻게 보는지 시뮬레이션하는 용도입니다. 색맹 진단은 안과에서 이시하라 검사 등을 통해 확인할 수 있습니다.',
          },
          {
            question: '업로드한 이미지는 안전한가요?',
            answer: '네, 모든 이미지 처리는 브라우저에서 로컬로 수행되며 서버로 전송되지 않습니다. 개인 정보가 유출될 걱정이 없습니다.',
          },
        ]}
      />
    </div>
  );
}
