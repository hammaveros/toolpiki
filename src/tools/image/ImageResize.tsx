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
          <strong className="text-gray-900 dark:text-white">사진/그래픽의 해상도(가로×세로 픽셀)를 변경하는 작업.</strong>{' '}
          원본 <strong>비율 유지</strong>로 크기를 조절하거나 <strong>SNS 규격</strong>에 맞춰 자유 변경할 수 있고,
          <strong>웹 로딩 최적화, 썸네일 제작, 이메일 첨부 용량 절감</strong>에 활용됩니다.
          모든 처리는 브라우저에서 이뤄지며 서버로 전송되지 않습니다.
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
          📐 크기와 용량의 관계
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          이미지 용량은 <strong>가로 × 세로 픽셀 수</strong>에 비례합니다. 가로세로를 각각 절반으로 줄이면
          픽셀 수는 1/4이 되므로 용량도 대략 1/4 수준으로 떨어집니다. 아래는 4000×3000(약 12MP) 사진을
          JPEG 품질 80으로 저장했을 때의 대략적인 기준입니다.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">리사이즈 후</th>
                <th className="text-left py-2 px-2">픽셀 수</th>
                <th className="text-left py-2 px-2">예상 용량</th>
                <th className="text-left py-2 px-2">적합한 용도</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">4000×3000</td><td>12.0 MP</td><td>약 4~6 MB</td><td>원본 보관, 인쇄</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">1920×1440</td><td>2.8 MP</td><td>약 900 KB</td><td>웹 본문, 블로그</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">1280×960</td><td>1.2 MP</td><td>약 400 KB</td><td>모바일, 메신저</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">800×600</td><td>0.5 MP</td><td>약 150 KB</td><td>목록 이미지</td></tr>
              <tr><td className="py-2 px-2 font-mono">320×240</td><td>0.08 MP</td><td>약 30 KB</td><td>썸네일</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed mt-3">
          실제 용량은 사진의 복잡도에 따라 달라집니다. 하늘이나 단색 배경처럼 단순한 이미지는 표보다 훨씬
          작게 나오고, 나뭇잎·군중처럼 디테일이 많은 사진은 더 커집니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔍 리사이즈 vs 크롭 vs 압축
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          셋 다 &quot;용량을 줄인다&quot;는 결과는 비슷하지만 바꾸는 대상이 다릅니다. 목적에 맞는 걸 골라야 합니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">리사이즈</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              전체 화면을 그대로 두고 픽셀 수만 줄임. 구도는 유지되고 크기만 작아집니다.
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">크롭(자르기)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              필요 없는 영역을 잘라냄. 구도가 바뀌고, 남긴 부분의 화질은 그대로입니다.
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">압축</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              픽셀 수는 그대로 두고 품질을 낮춤. 크기는 같지만 디테일이 뭉개집니다.
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed mt-3">
          용량을 크게 줄여야 한다면 <strong>리사이즈를 먼저</strong> 적용하고 그다음 압축하는 순서가 효율적입니다.
          압축부터 걸면 이미 손실된 이미지를 다시 줄이게 되어 결과물이 더 지저분해집니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 리사이즈 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>비율 유지</strong> — 이미지 왜곡 방지를 위해 가로세로 비율 잠금 권장</li>
          <li><strong>확대 주의</strong> — 원본보다 크게 확대하면 <strong>화질 저하</strong></li>
          <li><strong>용량 절감</strong> — 크기 <strong>50% 축소</strong> 시 용량 <strong>약 75% 감소</strong></li>
          <li><strong>배치 처리</strong> — 여러 이미지를 같은 규격으로 맞출 때 유용</li>
        </ul>
        <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
          <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 권장 크기</p>
          <p className="text-blue-800 dark:text-blue-300">
            웹 본문 이미지는 <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-xs font-mono">1920px</code> 이하,
            인스타 피드는 <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-xs font-mono">1080×1080</code>,
            유튜브 썸네일은 <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-xs font-mono">1280×720</code>이 표준입니다.
          </p>
        </div>
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
          {
            question: '용량을 줄이려면 리사이즈와 압축 중 뭐가 먼저인가요?',
            answer: '리사이즈를 먼저 하는 것이 좋습니다. 픽셀 수를 줄인 뒤 압축하면 같은 용량에서 더 깨끗한 결과가 나옵니다. 압축부터 하면 이미 뭉개진 이미지를 다시 줄이게 되어 화질 손해가 큽니다.',
          },
          {
            question: '리사이즈해도 EXIF(촬영 정보)가 남나요?',
            answer: 'Canvas로 다시 그리는 방식이라 촬영 위치·기기 정보 등 EXIF 메타데이터는 결과 파일에 포함되지 않습니다. 사진을 외부에 공유하기 전 개인정보를 지우는 용도로도 활용할 수 있습니다.',
          },
          {
            question: '투명 배경 PNG를 리사이즈하면 배경이 유지되나요?',
            answer: 'PNG로 저장하면 투명도가 그대로 유지됩니다. 다만 JPEG로 변환하면 투명 영역이 흰색이나 검은색으로 채워지므로, 투명 배경이 필요하면 PNG나 WebP를 선택하세요.',
          },
        ]}
      />
    </div>
  );
}
