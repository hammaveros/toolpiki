'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

export function ImageResize() {
  const [image, setImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
        setImage(e.target?.result as string);
        setResizedImage(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (keepAspectRatio && originalSize) {
      const ratio = originalSize.height / originalSize.width;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (keepAspectRatio && originalSize) {
      const ratio = originalSize.width / originalSize.height;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const handleResize = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      setResizedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (!resizedImage) return;

    const link = document.createElement('a');
    link.download = `resized_${width}x${height}.png`;
    link.href = resizedImage;
    link.click();
  };

  const presetSizes = [
    { label: '50%', factor: 0.5 },
    { label: '75%', factor: 0.75 },
    { label: '150%', factor: 1.5 },
    { label: '200%', factor: 2 },
  ];

  const commonSizes = [
    { label: 'HD (1280x720)', width: 1280, height: 720 },
    { label: 'Full HD (1920x1080)', width: 1920, height: 1080 },
    { label: 'Instagram (1080x1080)', width: 1080, height: 1080 },
    { label: 'Twitter (1200x675)', width: 1200, height: 675 },
  ];

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        onFileSelect={handleImageUpload}
        label="이미지 업로드"
        description="JPG, PNG, GIF, WebP 파일 지원"
      />

      {image && originalSize && (
        <>
          <Card variant="bordered" className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              원본 크기: {originalSize.width} x {originalSize.height}px
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  너비 (px)
                </label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  높이 (px)
                </label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  min={1}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={keepAspectRatio}
                onChange={(e) => setKeepAspectRatio(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                비율 유지
              </span>
            </label>

            <div className="flex flex-wrap gap-2 mb-4">
              {presetSizes.map(({ label, factor }) => (
                <Button
                  key={label}
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setWidth(Math.round(originalSize.width * factor));
                    setHeight(Math.round(originalSize.height * factor));
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {commonSizes.map(({ label, width: w, height: h }) => (
                <Button
                  key={label}
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setWidth(w);
                    setHeight(h);
                    setKeepAspectRatio(false);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          </Card>

          <div className="flex gap-2">
            <Button onClick={handleResize}>리사이즈</Button>
            {resizedImage && (
              <Button variant="secondary" onClick={handleDownload}>
                다운로드
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">원본</p>
              <img
                src={image}
                alt="Original"
                className="max-w-full h-auto rounded"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
              />
            </Card>

            {resizedImage && (
              <Card variant="bordered" className="p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  결과 ({width} x {height}px)
                </p>
                <img
                  src={resizedImage}
                  alt="Resized"
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </Card>
            )}
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🖼️ 이미지 리사이즈란?
        </h2>
        <p className="text-sm leading-relaxed">
          이미지 리사이즈는 사진이나 그래픽의 해상도(가로×세로 픽셀)를 변경하는 작업입니다.
          원본 비율을 유지하면서 크기를 줄이거나 키울 수 있고, 특정 크기(예: SNS 규격)에 맞게 조절할 수도 있습니다.
          웹사이트 로딩 속도 최적화, SNS 업로드 규격 맞추기, 썸네일 제작, 이메일 첨부 용량 줄이기 등에 활용됩니다.
          모든 처리는 브라우저에서 이루어지며 이미지가 서버로 전송되지 않습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 플랫폼별 권장 이미지 크기
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">플랫폼</th>
                <th className="text-left py-2 px-2">용도</th>
                <th className="text-left py-2 px-2">권장 크기</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Instagram</td><td>피드 정사각형</td><td className="font-mono">1080×1080</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Instagram</td><td>스토리</td><td className="font-mono">1080×1920</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Twitter/X</td><td>포스트 이미지</td><td className="font-mono">1200×675</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Facebook</td><td>공유 이미지</td><td className="font-mono">1200×630</td></tr>
              <tr><td className="py-2 px-2">YouTube</td><td>썸네일</td><td className="font-mono">1280×720</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 리사이즈 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>비율 유지</strong>: 이미지 왜곡 방지를 위해 가로세로 비율 유지 권장</li>
          <li><strong>확대 주의</strong>: 원본보다 크게 확대하면 화질이 저하됨</li>
          <li><strong>용량 절감</strong>: 크기를 50% 줄이면 용량은 약 75% 감소</li>
          <li><strong>배치 처리</strong>: 여러 이미지를 같은 규격으로 맞출 때 유용</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '리사이즈하면 화질이 떨어지나요?',
            answer: '크기를 줄일 때는 화질 손실이 거의 없습니다. 하지만 원본보다 크게 확대하면 픽셀이 보간되어 화질이 저하됩니다. 가능하면 원본 크기 이하로만 조절하세요.',
          },
          {
            question: '비율 유지와 자유 조절의 차이는 무엇인가요?',
            answer: '비율 유지는 가로를 바꾸면 세로도 자동 조절되어 이미지가 찌그러지지 않습니다. 자유 조절은 원하는 크기로 설정할 수 있지만 이미지가 늘어나거나 압축될 수 있습니다.',
          },
          {
            question: '이미지가 서버로 업로드되나요?',
            answer: '아니요, 모든 처리는 브라우저의 Canvas API를 사용해 로컬에서 이루어집니다. 이미지 데이터가 외부 서버로 전송되지 않아 개인정보 걱정 없이 사용할 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}
