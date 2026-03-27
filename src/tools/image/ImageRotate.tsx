'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

export function ImageRotate() {
  const [image, setImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const processImage = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // 90도 회전시 너비/높이 교환
      const isRotated = rotation === 90 || rotation === 270;
      canvas.width = isRotated ? img.height : img.width;
      canvas.height = isRotated ? img.width : img.height;

      ctx.save();

      // 중심으로 이동
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // 회전
      ctx.rotate((rotation * Math.PI) / 180);

      // 뒤집기
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      // 이미지 그리기
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      ctx.restore();

      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  }, [image, rotation, flipH, flipV]);

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.download = `rotated_${rotation}deg.png`;
    link.href = processedImage;
    link.click();
  };

  const handleReset = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setProcessedImage(null);
  };

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        onFileSelect={handleImageUpload}
        label="이미지 업로드"
        description="JPG, PNG, GIF, WebP 파일 지원"
      />

      {image && (
        <>
          <Card variant="bordered" className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  회전
                </label>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="secondary" onClick={handleRotateLeft}>
                    ↺ 90° 왼쪽
                  </Button>
                  <Button variant="secondary" onClick={handleRotateRight}>
                    ↻ 90° 오른쪽
                  </Button>
                  <Button
                    variant={rotation === 180 ? 'primary' : 'secondary'}
                    onClick={() => setRotation(180)}
                  >
                    180°
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">현재 회전: {rotation}°</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  뒤집기
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={flipH ? 'primary' : 'secondary'}
                    onClick={() => setFlipH(!flipH)}
                  >
                    ↔ 좌우 뒤집기
                  </Button>
                  <Button
                    variant={flipV ? 'primary' : 'secondary'}
                    onClick={() => setFlipV(!flipV)}
                  >
                    ↕ 상하 뒤집기
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-2">
            <Button onClick={processImage}>적용</Button>
            <Button variant="secondary" onClick={handleReset}>
              초기화
            </Button>
            {processedImage && (
              <Button variant="secondary" onClick={handleDownload}>
                다운로드
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">원본</p>
              <div className="flex justify-center">
                <img
                  src={image}
                  alt="Original"
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </div>
            </Card>

            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">미리보기</p>
              <div className="flex justify-center">
                <img
                  src={image}
                  alt="Preview"
                  className="max-w-full h-auto rounded transition-transform duration-200"
                  style={{
                    maxHeight: '300px',
                    objectFit: 'contain',
                    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                  }}
                />
              </div>
            </Card>
          </div>

          {processedImage && (
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                결과 (회전: {rotation}°, 좌우: {flipH ? '뒤집음' : '원본'}, 상하: {flipV ? '뒤집음' : '원본'})
              </p>
              <div className="flex justify-center">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </div>
            </Card>
          )}
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
          🔄 이미지 회전/뒤집기란?
        </h2>
        <p className="text-sm leading-relaxed">
          이미지 회전/뒤집기 도구는 사진의 방향을 수정하거나 거울 효과를 적용할 수 있는 온라인 도구입니다.
          스마트폰으로 촬영한 사진이 회전되어 있거나, 스캔한 문서의 방향이 맞지 않을 때 간편하게 수정할 수 있습니다.
          별도 프로그램 설치 없이 브라우저에서 바로 작업하며, 모든 처리는 로컬에서 이루어져 개인정보가 안전합니다.
          실시간 미리보기로 결과를 확인하며 원하는 각도로 정확하게 조절할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📐 회전 옵션 안내
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">옵션</th>
                <th className="text-left py-2 px-2">설명</th>
                <th className="text-left py-2 px-2">활용 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">90° 왼쪽</td><td>반시계 방향 90도</td><td>세로 사진을 가로로</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">90° 오른쪽</td><td>시계 방향 90도</td><td>가로 사진을 세로로</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">180°</td><td>위아래 뒤집기</td><td>거꾸로 촬영된 사진</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">좌우 뒤집기</td><td>수평 거울 효과</td><td>셀카 반전, 거울 효과</td></tr>
              <tr><td className="py-2 px-2 font-medium">상하 뒤집기</td><td>수직 거울 효과</td><td>반사 효과 제작</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 이미지 회전 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>EXIF 방향 문제</strong>: 카메라 방향 정보가 잘못 기록된 사진도 직접 회전하여 수정</li>
          <li><strong>스캔 문서</strong>: 스캐너로 잘못 스캔된 문서 방향 교정</li>
          <li><strong>셀카 반전</strong>: 좌우 뒤집기로 원래 방향 복원</li>
          <li><strong>조합 사용</strong>: 회전과 뒤집기를 함께 적용하여 다양한 효과 가능</li>
          <li><strong>원본 보존</strong>: 적용 전 미리보기로 확인, 다운로드 시 새 파일로 저장</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '회전 후 이미지 품질이 저하되나요?',
            answer: '90°, 180°, 270° 같은 직각 회전은 품질 손실 없이 처리됩니다. PNG 형식으로 저장되어 고품질을 유지합니다.',
          },
          {
            question: '회전과 뒤집기를 동시에 적용할 수 있나요?',
            answer: '네, 회전 각도와 좌우/상하 뒤집기를 자유롭게 조합할 수 있습니다. 미리보기에서 즉시 결과를 확인할 수 있습니다.',
          },
          {
            question: '지원하는 이미지 형식은 무엇인가요?',
            answer: 'JPG, PNG, GIF, WebP 등 브라우저에서 지원하는 대부분의 이미지 형식을 사용할 수 있습니다. 결과는 PNG로 저장됩니다.',
          },
        ]}
      />
    </div>
  );
}
