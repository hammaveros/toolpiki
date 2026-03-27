'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

type ImageFormat = 'png' | 'jpeg' | 'webp';

interface ConvertedImage {
  id: string;
  originalFile: File;
  originalPreview: string;
  converted: string | null;
  convertedSize: number;
}

const FORMAT_INFO: Record<ImageFormat, { mime: string; ext: string; label: string }> = {
  png: { mime: 'image/png', ext: 'png', label: 'PNG (무손실)' },
  jpeg: { mime: 'image/jpeg', ext: 'jpg', label: 'JPEG (손실)' },
  webp: { mime: 'image/webp', ext: 'webp', label: 'WebP (차세대)' },
};

export function ImageConvert() {
  const [images, setImages] = useState<ConvertedImage[]>([]);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState(90);
  const [isConverting, setIsConverting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImagesUpload = useCallback((files: File[]) => {
    const newImages: ConvertedImage[] = [];
    let loaded = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push({
          id: `${Date.now()}-${Math.random()}`,
          originalFile: file,
          originalPreview: e.target?.result as string,
          converted: null,
          convertedSize: 0,
        });
        loaded++;
        if (loaded === files.length) {
          setImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const convertSingle = (imageData: ConvertedImage): Promise<ConvertedImage> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        resolve(imageData);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageData);
        return;
      }

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const formatInfo = FORMAT_INFO[targetFormat];
        const qualityValue = targetFormat === 'png' ? 1 : quality / 100;
        const converted = canvas.toDataURL(formatInfo.mime, qualityValue);

        const base64Length = converted.split(',')[1].length;
        const convertedSize = Math.round((base64Length * 3) / 4);

        resolve({
          ...imageData,
          converted,
          convertedSize,
        });
      };
      img.src = imageData.originalPreview;
    });
  };

  const handleConvertAll = async () => {
    if (images.length === 0) return;

    setIsConverting(true);

    const convertedImages: ConvertedImage[] = [];
    for (const image of images) {
      const converted = await convertSingle(image);
      convertedImages.push(converted);
    }

    setImages(convertedImages);
    setIsConverting(false);
  };

  const handleDownloadAll = async () => {
    const convertedImages = images.filter((img) => img.converted);
    if (convertedImages.length === 0) return;

    const formatInfo = FORMAT_INFO[targetFormat];

    // 단일 파일이면 그냥 다운로드
    if (convertedImages.length === 1) {
      const img = convertedImages[0];
      const originalName = img.originalFile.name.replace(/\.[^/.]+$/, '');
      const link = document.createElement('a');
      link.download = `${originalName}.${formatInfo.ext}`;
      link.href = img.converted!;
      link.click();
      return;
    }

    // 여러 파일이면 ZIP으로 다운로드
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    convertedImages.forEach((img) => {
      const originalName = img.originalFile.name.replace(/\.[^/.]+$/, '');
      const base64Data = img.converted!.split(',')[1];
      zip.file(`${originalName}.${formatInfo.ext}`, base64Data, { base64: true });
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.download = `converted_images.zip`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleDownloadSingle = (img: ConvertedImage) => {
    if (!img.converted) return;
    const formatInfo = FORMAT_INFO[targetFormat];
    const originalName = img.originalFile.name.replace(/\.[^/.]+$/, '');
    const link = document.createElement('a');
    link.download = `${originalName}.${formatInfo.ext}`;
    link.href = img.converted;
    link.click();
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleClear = () => {
    setImages([]);
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getOriginalFormat = (file: File): string => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const formatMap: Record<string, string> = {
      jpg: 'JPEG', jpeg: 'JPEG', png: 'PNG', gif: 'GIF', webp: 'WebP', bmp: 'BMP',
    };
    return formatMap[ext] || ext.toUpperCase();
  };

  const allConverted = images.length > 0 && images.every((img) => img.converted);

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        multiple
        onUpload={handleImagesUpload}
        label="이미지 업로드 (여러 개 선택 가능)"
        description="JPG, PNG, GIF, WebP, BMP 파일 지원"
      />

      {images.length > 0 && (
        <>
          {/* 설정 */}
          <Card variant="bordered" className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium">
                {images.length}개 이미지 선택됨
              </p>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                전체 삭제
              </Button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                변환 형식
              </label>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(FORMAT_INFO) as ImageFormat[]).map((format) => (
                  <Button
                    key={format}
                    variant={targetFormat === format ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setTargetFormat(format)}
                  >
                    {FORMAT_INFO[format].label}
                  </Button>
                ))}
              </div>
            </div>

            {targetFormat !== 'png' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  품질: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </Card>

          {/* 버튼 */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleConvertAll} disabled={isConverting}>
              {isConverting ? '변환 중...' : `전체 변환 (${images.length}개)`}
            </Button>
            {allConverted && (
              <Button variant="secondary" onClick={handleDownloadAll}>
                전체 다운로드 (.{FORMAT_INFO[targetFormat].ext})
              </Button>
            )}
          </div>

          {/* 이미지 목록 */}
          <div className="space-y-3">
            {images.map((img) => (
              <Card key={img.id} variant="bordered" className="p-3">
                <div className="flex items-center gap-4">
                  {/* 썸네일 */}
                  <img
                    src={img.originalPreview}
                    alt={img.originalFile.name}
                    className="w-16 h-16 object-cover rounded"
                  />

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{img.originalFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {getOriginalFormat(img.originalFile)} • {formatSize(img.originalFile.size)}
                      {img.converted && (
                        <span className="text-green-600 dark:text-green-400">
                          {' → '}{FORMAT_INFO[targetFormat].ext.toUpperCase()} • {formatSize(img.convertedSize)}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* 액션 */}
                  <div className="flex gap-2">
                    {img.converted && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownloadSingle(img)}
                      >
                        다운로드
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(img.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          형식별 특징
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li><strong>PNG:</strong> 무손실 압축, 투명 배경 지원, 파일 크기 큼</li>
          <li><strong>JPEG:</strong> 손실 압축, 사진에 적합, 투명 배경 미지원</li>
          <li><strong>WebP:</strong> PNG/JPEG보다 작은 크기, 최신 브라우저 지원</li>
        </ul>
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
          🔄 이미지 포맷 변환기란?
        </h2>
        <p className="text-sm leading-relaxed">
          이미지 포맷 변환기는 JPG, PNG, WebP 등 다양한 이미지 형식 간에 상호 변환할 수 있는 온라인 도구입니다.
          웹사이트 최적화를 위해 WebP로 변환하거나, 투명 배경이 필요할 때 PNG로, 파일 크기를 줄이고 싶을 때 JPEG로 변환합니다.
          여러 이미지를 한 번에 선택하여 일괄 변환하고, ZIP 파일로 한꺼번에 다운로드할 수 있습니다.
          모든 처리는 브라우저에서 이루어지므로 서버로 이미지가 전송되지 않아 안전합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 이미지 형식 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">형식</th>
                <th className="text-left py-2 px-2">압축 방식</th>
                <th className="text-left py-2 px-2">투명 배경</th>
                <th className="text-left py-2 px-2">추천 용도</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">PNG</td><td>무손실</td><td>지원</td><td>로고, 아이콘, 스크린샷</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">JPEG</td><td>손실</td><td>미지원</td><td>사진, 복잡한 이미지</td></tr>
              <tr><td className="py-2 px-2 font-medium">WebP</td><td>손실/무손실</td><td>지원</td><td>웹 최적화 (모든 용도)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 이미지 포맷 선택 가이드
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>웹 성능 최적화</strong>: WebP 사용 시 JPEG/PNG 대비 25~35% 파일 크기 감소</li>
          <li><strong>투명 배경 필요</strong>: PNG 또는 WebP 선택 (JPEG는 투명 미지원)</li>
          <li><strong>최고 품질</strong>: PNG(무손실) 또는 JPEG 100% 품질</li>
          <li><strong>파일 크기 중요</strong>: JPEG 70~80% 품질 또는 WebP 권장</li>
          <li><strong>호환성 우선</strong>: 오래된 브라우저 지원 필요 시 JPEG/PNG 선택</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '여러 이미지를 한 번에 변환할 수 있나요?',
            answer: '네, 파일 선택 시 여러 이미지를 한꺼번에 선택할 수 있습니다. 변환 후 ZIP 파일로 일괄 다운로드됩니다.',
          },
          {
            question: 'JPEG 품질 설정은 어떻게 하나요?',
            answer: 'JPEG나 WebP 선택 시 품질 슬라이더가 나타납니다. 80~90%가 품질과 파일 크기의 균형점으로 권장됩니다.',
          },
          {
            question: 'PNG는 왜 품질 설정이 없나요?',
            answer: 'PNG는 무손실 압축 방식이라 품질 손실이 없습니다. 따라서 품질 설정 없이 항상 원본 품질을 유지합니다.',
          },
        ]}
      />
    </div>
  );
}
