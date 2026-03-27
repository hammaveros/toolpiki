'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

interface PickedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  position: { x: number; y: number };
}

export function ImageColorPicker() {
  const [image, setImage] = useState<string | null>(null);
  const [pickedColors, setPickedColors] = useState<PickedColor[]>([]);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setPickedColors([]);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageLoad = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
  };

  const getColorAtPosition = (e: React.MouseEvent<HTMLImageElement>): PickedColor | null => {
    if (!canvasRef.current || !imageRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return null;

    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    const hex = '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('').toUpperCase();

    return {
      hex,
      rgb: { r, g, b },
      position: { x, y },
    };
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const color = getColorAtPosition(e);
    if (color) {
      setPickedColors((prev) => [color, ...prev.slice(0, 9)]);
    }
  };

  const handleImageHover = (e: React.MouseEvent<HTMLImageElement>) => {
    const color = getColorAtPosition(e);
    setHoveredColor(color?.hex || null);
  };

  const clearColors = () => {
    setPickedColors([]);
  };

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        onFileSelect={handleImageUpload}
        label="이미지 업로드"
        description="이미지를 클릭하여 색상을 추출하세요"
      />

      {image && (
        <>
          <Card variant="bordered" className="p-4">
            <div className="relative inline-block">
              <img
                ref={imageRef}
                src={image}
                alt="Color picker"
                className="max-w-full h-auto rounded cursor-crosshair"
                style={{ maxHeight: '400px' }}
                onClick={handleImageClick}
                onMouseMove={handleImageHover}
                onMouseLeave={() => setHoveredColor(null)}
                onLoad={handleImageLoad}
              />
              {hoveredColor && (
                <div className="absolute top-2 right-2 flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded shadow">
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: hoveredColor }}
                  />
                  <span className="font-mono text-sm">{hoveredColor}</span>
                </div>
              )}
            </div>
          </Card>

          <canvas ref={canvasRef} className="hidden" />

          {pickedColors.length > 0 && (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  추출된 색상 ({pickedColors.length})
                </h3>
                <Button variant="secondary" size="sm" onClick={clearColors}>
                  초기화
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {pickedColors.map((color, index) => (
                  <Card key={index} variant="bordered" className="p-3">
                    <div
                      className="w-full h-16 rounded mb-2"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono text-sm font-medium">{color.hex}</p>
                        <p className="text-xs text-gray-500">
                          rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                        </p>
                      </div>
                      <CopyButton text={color.hex} size="sm" />
                    </div>
                  </Card>
                ))}
              </div>

              <Card variant="bordered" className="p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  추출된 팔레트
                </h3>
                <div className="flex rounded overflow-hidden h-12">
                  {pickedColors.map((color, index) => (
                    <div
                      key={index}
                      className="flex-1"
                      style={{ backgroundColor: color.hex }}
                      title={color.hex}
                    />
                  ))}
                </div>
                <div className="mt-2">
                  <CopyButton
                    text={pickedColors.map((c) => c.hex).join(', ')}
                    label="팔레트 복사"
                  />
                </div>
              </Card>
            </>
          )}
        </>
      )}

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
        <p>이미지 위에서 클릭하면 해당 위치의 색상이 추출됩니다.</p>
        <p>최대 10개의 색상을 저장할 수 있습니다.</p>
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
          🖼️ 이미지 색상 추출이란?
        </h2>
        <p className="text-sm leading-relaxed">
          이미지 색상 추출 도구는 업로드한 이미지에서 원하는 위치의 정확한 색상 코드를 추출하는 도구입니다.
          마우스를 올리면 실시간으로 색상을 미리 보고, 클릭하면 해당 색상이 저장됩니다.
          최대 10개의 색상을 저장하여 팔레트로 활용할 수 있으며, HEX와 RGB 코드를 제공합니다.
          디자인 레퍼런스 분석, 브랜드 컬러 추출, 사진 색감 연구 등에 유용합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 색상 추출 활용 분야
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">분야</th>
                <th className="text-left py-2 px-2">활용 방법</th>
                <th className="text-left py-2 px-2">예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">웹 디자인</td><td>참고 이미지에서 색상 추출</td><td>영감받은 사이트의 색상 분석</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">브랜딩</td><td>로고/제품 이미지에서 컬러 추출</td><td>브랜드 가이드라인 문서화</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">사진 편집</td><td>원본 사진의 색조 분석</td><td>색보정 참고값 확보</td></tr>
              <tr><td className="py-2 px-2 font-medium">일러스트</td><td>참고 작품의 팔레트 추출</td><td>색감 연구 및 학습</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 색상 추출 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>대표색 선택</strong>: 이미지의 주요 영역에서 여러 색상을 추출</li>
          <li><strong>그림자/하이라이트</strong>: 같은 물체의 밝은 부분과 어두운 부분 함께 추출</li>
          <li><strong>고해상도 이미지</strong>: 더 정확한 색상을 위해 고품질 이미지 사용</li>
          <li><strong>압축 주의</strong>: JPEG 압축은 색상을 왜곡할 수 있음, PNG 권장</li>
          <li><strong>색공간 고려</strong>: 웹용 sRGB와 인쇄용 CMYK 차이 인지</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '추출한 색상이 원본과 다르게 보여요',
            answer: '모니터의 색상 프로필, 이미지 압축, 색공간 차이로 인해 발생할 수 있습니다. 캘리브레이션된 모니터와 무손실 이미지(PNG)를 사용하면 더 정확한 결과를 얻을 수 있습니다.',
          },
          {
            question: '이미지가 서버로 업로드되나요?',
            answer: '아니요, 모든 처리는 브라우저에서 로컬로 이루어집니다. 이미지는 서버로 전송되지 않으며, 페이지를 닫으면 데이터가 삭제됩니다.',
          },
          {
            question: '최대 10개 이상 추출할 수 있나요?',
            answer: '새로운 색상을 추출하면 가장 오래된 색상이 자동으로 삭제됩니다. 필요한 색상은 복사 버튼으로 미리 저장해두세요.',
          },
        ]}
      />
    </div>
  );
}
