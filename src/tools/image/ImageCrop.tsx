'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ImageCrop() {
  const [image, setImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
        setCropArea({
          x: 0,
          y: 0,
          width: Math.min(img.width, 300),
          height: Math.min(img.height, 300),
        });
        setImage(e.target?.result as string);
        setCroppedImage(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left - cropArea.x,
      y: e.clientY - rect.top - cropArea.y,
    });
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current || !imageSize) return;

    const rect = containerRef.current.getBoundingClientRect();
    const scale = rect.width / imageSize.width;

    let newX = (e.clientX - rect.left - dragStart.x) / scale;
    let newY = (e.clientY - rect.top - dragStart.y) / scale;

    // 경계 제한
    newX = Math.max(0, Math.min(newX, imageSize.width - cropArea.width));
    newY = Math.max(0, Math.min(newY, imageSize.height - cropArea.height));

    setCropArea((prev) => ({ ...prev, x: newX, y: newY }));
  }, [isDragging, dragStart, imageSize, cropArea.width, cropArea.height]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleCrop = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;
      ctx.drawImage(
        img,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, cropArea.width, cropArea.height
      );
      setCroppedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (!croppedImage) return;

    const link = document.createElement('a');
    link.download = `cropped_${cropArea.width}x${cropArea.height}.png`;
    link.href = croppedImage;
    link.click();
  };

  const aspectRatios = [
    { label: '자유', value: null },
    { label: '1:1', value: 1 },
    { label: '4:3', value: 4/3 },
    { label: '16:9', value: 16/9 },
    { label: '3:2', value: 3/2 },
  ];

  const setAspectRatio = (ratio: number | null) => {
    if (!ratio || !imageSize) return;

    const newWidth = Math.min(cropArea.width, imageSize.width);
    const newHeight = Math.round(newWidth / ratio);

    if (newHeight <= imageSize.height) {
      setCropArea((prev) => ({
        ...prev,
        width: newWidth,
        height: newHeight,
        y: Math.min(prev.y, imageSize.height - newHeight),
      }));
    } else {
      const adjustedHeight = imageSize.height;
      const adjustedWidth = Math.round(adjustedHeight * ratio);
      setCropArea((prev) => ({
        ...prev,
        width: adjustedWidth,
        height: adjustedHeight,
        x: Math.min(prev.x, imageSize.width - adjustedWidth),
      }));
    }
  };

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        onFileSelect={handleImageUpload}
        label="이미지 업로드"
        description="JPG, PNG, GIF, WebP 파일 지원"
      />

      {image && imageSize && (
        <>
          <Card variant="bordered" className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">X</label>
                <Input
                  type="number"
                  value={Math.round(cropArea.x)}
                  onChange={(e) => setCropArea((prev) => ({ ...prev, x: Number(e.target.value) }))}
                  min={0}
                  max={imageSize.width - cropArea.width}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Y</label>
                <Input
                  type="number"
                  value={Math.round(cropArea.y)}
                  onChange={(e) => setCropArea((prev) => ({ ...prev, y: Number(e.target.value) }))}
                  min={0}
                  max={imageSize.height - cropArea.height}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">너비</label>
                <Input
                  type="number"
                  value={Math.round(cropArea.width)}
                  onChange={(e) => setCropArea((prev) => ({ ...prev, width: Number(e.target.value) }))}
                  min={1}
                  max={imageSize.width - cropArea.x}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">높이</label>
                <Input
                  type="number"
                  value={Math.round(cropArea.height)}
                  onChange={(e) => setCropArea((prev) => ({ ...prev, height: Number(e.target.value) }))}
                  min={1}
                  max={imageSize.height - cropArea.y}
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {aspectRatios.map(({ label, value }) => (
                <Button
                  key={label}
                  variant="secondary"
                  size="sm"
                  onClick={() => setAspectRatio(value)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </Card>

          <div
            ref={containerRef}
            className="relative inline-block max-w-full overflow-hidden cursor-crosshair"
            style={{ userSelect: 'none' }}
          >
            <img
              src={image}
              alt="Original"
              className="max-w-full h-auto"
              style={{ maxHeight: '400px' }}
              draggable={false}
            />
            {/* 어두운 오버레이 */}
            <div
              className="absolute inset-0 bg-black/50 pointer-events-none"
              style={{
                clipPath: `polygon(
                  0 0, 100% 0, 100% 100%, 0 100%, 0 0,
                  ${(cropArea.x / imageSize.width) * 100}% ${(cropArea.y / imageSize.height) * 100}%,
                  ${(cropArea.x / imageSize.width) * 100}% ${((cropArea.y + cropArea.height) / imageSize.height) * 100}%,
                  ${((cropArea.x + cropArea.width) / imageSize.width) * 100}% ${((cropArea.y + cropArea.height) / imageSize.height) * 100}%,
                  ${((cropArea.x + cropArea.width) / imageSize.width) * 100}% ${(cropArea.y / imageSize.height) * 100}%,
                  ${(cropArea.x / imageSize.width) * 100}% ${(cropArea.y / imageSize.height) * 100}%
                )`,
              }}
            />
            {/* 자르기 영역 */}
            <div
              className="absolute border-2 border-white shadow-lg cursor-move"
              style={{
                left: `${(cropArea.x / imageSize.width) * 100}%`,
                top: `${(cropArea.y / imageSize.height) * 100}%`,
                width: `${(cropArea.width / imageSize.width) * 100}%`,
                height: `${(cropArea.height / imageSize.height) * 100}%`,
              }}
              onMouseDown={handleMouseDown}
            >
              {/* 모서리 핸들 */}
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-gray-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-gray-400" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-gray-400" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-gray-400" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCrop}>자르기</Button>
            {croppedImage && (
              <Button variant="secondary" onClick={handleDownload}>
                다운로드
              </Button>
            )}
          </div>

          {croppedImage && (
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                결과 ({Math.round(cropArea.width)} x {Math.round(cropArea.height)}px)
              </p>
              <img
                src={croppedImage}
                alt="Cropped"
                className="max-w-full h-auto rounded"
                style={{ maxHeight: '300px' }}
              />
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
          ✂️ 이미지 자르기란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">사진에서 원하는 부분만 잘라내는 온라인 도구.</strong>{' '}
          <strong>드래그</strong>로 영역을 선택하거나 <strong>픽셀 좌표</strong>를 입력해 정밀하게 자를 수 있고,
          <strong>프로필 사진, 배경 제거, SNS 썸네일</strong> 규격 맞추기에 활용됩니다.
          설치 없이 브라우저에서 바로 처리되며, <strong>로컬 처리</strong>로 개인정보가 안전합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📐 비율 프리셋 가이드
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">비율</th>
                <th className="text-left py-2 px-2">용도</th>
                <th className="text-left py-2 px-2">권장 플랫폼</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">1:1</td><td>정사각형</td><td>인스타그램, 프로필 사진</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">4:3</td><td>전통 사진 비율</td><td>인쇄, 프레젠테이션</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">16:9</td><td>와이드스크린</td><td>유튜브 썸네일, 배너</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">3:2</td><td>DSLR 기본 비율</td><td>사진 인화, 포토북</td></tr>
              <tr><td className="py-2 px-2 font-medium">자유</td><td>임의 비율</td><td>특수 용도, 배너</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🧮 자르면 해상도는 얼마나 남을까
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          자르기는 픽셀을 버리는 작업이라, 잘라낸 영역만큼 해상도가 그대로 줄어듭니다.
          4000×3000 사진에서 각 비율로 최대 크기를 잘랐을 때 남는 해상도는 다음과 같습니다.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">비율</th>
                <th className="text-left py-2 px-2">남는 해상도</th>
                <th className="text-left py-2 px-2">원본 대비</th>
                <th className="text-left py-2 px-2">활용 가능 범위</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">1:1</td><td className="font-mono">3000×3000</td><td>75%</td><td>인스타 피드에 충분</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">4:3</td><td className="font-mono">4000×3000</td><td>100%</td><td>손실 없음 (원본 비율)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">16:9</td><td className="font-mono">4000×2250</td><td>75%</td><td>4K 썸네일까지 가능</td></tr>
              <tr><td className="py-2 px-2 font-medium">3:2</td><td className="font-mono">4000×2667</td><td>89%</td><td>A4 인화 여유</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed mt-3">
          문제는 <strong>사진 일부만 확대하듯 좁게 자를 때</strong>입니다. 예를 들어 전체의 1/4 영역만 남기면
          해상도는 2000×1500으로 떨어집니다. 유튜브 썸네일(1280×720)에는 충분하지만, 인쇄용으로는 부족해집니다.
          자르기 전에 <strong>최종 용도의 필요 해상도</strong>를 먼저 정해두면 실패를 줄일 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          👤 용도별 권장 크기
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">용도</th>
                <th className="text-left py-2 px-2">비율</th>
                <th className="text-left py-2 px-2">권장 픽셀</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">이력서 증명사진</td><td className="font-mono">3:4</td><td className="font-mono">413×531</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">SNS 프로필</td><td className="font-mono">1:1</td><td className="font-mono">400×400 이상</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">유튜브 썸네일</td><td className="font-mono">16:9</td><td className="font-mono">1280×720</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">블로그 대표 이미지</td><td className="font-mono">1.91:1</td><td className="font-mono">1200×630</td></tr>
              <tr><td className="py-2 px-2">쇼핑몰 상품 이미지</td><td className="font-mono">1:1</td><td className="font-mono">1000×1000 이상</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed mt-3">
          증명사진은 규격이 엄격한 편입니다. 얼굴이 세로 길이의 약 70~80%를 차지하고 머리 위 여백을
          조금 남기는 구도가 일반적이며, 기관마다 기준이 다르므로 제출처 안내를 확인하세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 이미지 자르기 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>중앙 배치</strong> — 인물/제품을 영역 중심에 두면 균형 잡힌 구도</li>
          <li><strong>여백 확보</strong> — 텍스트 오버레이용은 <strong>상단/하단 여백</strong> 남기기</li>
          <li><strong>플랫폼별 규격</strong> — SNS마다 비율 달라 <strong>프리셋 활용</strong> 권장</li>
          <li><strong>고해상도 유지</strong> — 너무 작게 자르면 해상도 저하</li>
          <li><strong>정밀 자르기</strong> — 픽셀 단위 입력으로 정확한 크기 지정</li>
        </ul>
        <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
          <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 비율 빠른 선택</p>
          <p className="text-blue-800 dark:text-blue-300">
            인스타 피드는 <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-xs font-mono">1:1</code>,
            유튜브 썸네일은 <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-xs font-mono">16:9</code>,
            인쇄 사진은 <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-xs font-mono">3:2</code>가 표준입니다.
          </p>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '이미지를 자르면 원본이 손상되나요?',
            answer: '아니요, 원본 이미지는 그대로 유지됩니다. 자른 결과는 새로운 파일로 다운로드되므로 원본에 영향이 없습니다.',
          },
          {
            question: '자르기 영역을 정확한 크기로 지정할 수 있나요?',
            answer: '네, X, Y 좌표와 너비, 높이를 픽셀 단위로 직접 입력하여 정밀하게 영역을 지정할 수 있습니다.',
          },
          {
            question: '인스타그램 정사각형 사진은 어떻게 만드나요?',
            answer: '1:1 비율 프리셋을 선택하면 자동으로 정사각형 영역이 설정됩니다. 드래그로 원하는 위치로 이동하여 자르세요.',
          },
          {
            question: '자르면 화질이 나빠지나요?',
            answer: '남긴 영역의 픽셀은 그대로라 화질 자체는 떨어지지 않습니다. 다만 전체 픽셀 수가 줄어들기 때문에, 좁게 자른 뒤 크게 확대해서 쓰면 흐릿해 보일 수 있습니다.',
          },
          {
            question: '자른 이미지가 서버로 전송되나요?',
            answer: '아니요. 브라우저 Canvas에서만 처리되며 이미지가 업로드되지 않습니다. 신분증·계약서 같은 민감한 이미지도 안전하게 자를 수 있습니다.',
          },
          {
            question: '여러 장을 같은 영역으로 한 번에 자를 수 있나요?',
            answer: '현재는 한 장씩 처리합니다. 여러 장을 같은 크기로 맞춰야 한다면 이미지 리사이즈 도구로 규격을 통일한 뒤 개별로 자르는 방식이 편합니다.',
          },
        ]}
      />
    </div>
  );
}
