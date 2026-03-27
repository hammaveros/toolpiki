'use client';

import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { FaqSection } from '@/components/ui/FaqItem';

type OutputFormat = 'jpeg' | 'png' | 'webp';

interface ImageItem {
  id: string;
  originalFile: File;
  originalPreview: string;
  compressedBlob: Blob | null;
  compressedPreview: string | null;
  status: 'pending' | 'compressing' | 'done' | 'error';
}

export function ImageCompress() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('jpeg');
  const [maxSize, setMaxSize] = useState('4096');
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFilesUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newItem: ImageItem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          originalFile: file,
          originalPreview: ev.target?.result as string,
          compressedBlob: null,
          compressedPreview: null,
          status: 'pending',
        };
        setImages((prev) => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  }, []);

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearAll = () => {
    setImages([]);
  };

  const getMimeType = (format: OutputFormat): string => {
    switch (format) {
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'webp': return 'image/webp';
    }
  };

  const getExtension = (format: OutputFormat): string => {
    switch (format) {
      case 'jpeg': return 'jpg';
      case 'png': return 'png';
      case 'webp': return 'webp';
    }
  };

  const compressAll = async () => {
    if (images.length === 0) return;

    setIsCompressing(true);
    const maxDimension = parseInt(maxSize);

    for (const img of images) {
      if (img.status === 'done') continue;

      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, status: 'compressing' } : i))
      );

      try {
        const options = {
          maxSizeMB: 10,
          maxWidthOrHeight: maxDimension,
          useWebWorker: true,
          initialQuality: quality / 100,
          fileType: getMimeType(outputFormat) as 'image/jpeg' | 'image/png' | 'image/webp',
        };

        const compressedBlob = await imageCompression(img.originalFile, options);

        const reader = new FileReader();
        reader.onload = (ev) => {
          setImages((prev) =>
            prev.map((i) =>
              i.id === img.id
                ? {
                    ...i,
                    compressedBlob,
                    compressedPreview: ev.target?.result as string,
                    status: 'done',
                  }
                : i
            )
          );
        };
        reader.readAsDataURL(compressedBlob);
      } catch (error) {
        console.error('압축 실패:', error);
        setImages((prev) =>
          prev.map((i) => (i.id === img.id ? { ...i, status: 'error' } : i))
        );
      }
    }

    setIsCompressing(false);
  };

  const downloadOne = (img: ImageItem) => {
    if (!img.compressedBlob) return;

    const url = URL.createObjectURL(img.compressedBlob);
    const link = document.createElement('a');
    const baseName = img.originalFile.name.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}_compressed.${getExtension(outputFormat)}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    const completed = images.filter((img) => img.status === 'done' && img.compressedBlob);
    if (completed.length === 0) return;

    if (completed.length === 1) {
      downloadOne(completed[0]);
      return;
    }

    // 여러 파일 개별 다운로드 (ZIP 없이)
    completed.forEach((img, index) => {
      setTimeout(() => downloadOne(img), index * 200);
    });
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const totalOriginal = images.reduce((sum, img) => sum + img.originalFile.size, 0);
  const totalCompressed = images.reduce(
    (sum, img) => sum + (img.compressedBlob?.size || 0),
    0
  );
  const completedCount = images.filter((img) => img.status === 'done').length;

  return (
    <div className="space-y-4">
      {/* 업로드 영역 */}
      <Card variant="bordered" className="p-6">
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              클릭하거나 파일을 드래그하세요
            </p>
            <p className="text-sm text-gray-500">
              JPG, PNG, WebP, GIF 지원 • 여러 파일 선택 가능
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesUpload}
            className="hidden"
          />
        </label>
      </Card>

      {images.length > 0 && (
        <>
          {/* 설정 */}
          <Card variant="bordered" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 품질 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  압축 품질: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex gap-1 mt-2">
                  {[20, 40, 60, 80, 100].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`flex-1 py-1 text-xs rounded ${
                        quality === q
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {q}%
                    </button>
                  ))}
                </div>
              </div>

              {/* 출력 형식 */}
              <Select
                label="출력 형식"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                options={[
                  { value: 'jpeg', label: 'JPEG (사진 권장)' },
                  { value: 'png', label: 'PNG (투명 배경)' },
                  { value: 'webp', label: 'WebP (웹 최적화)' },
                ]}
              />

              {/* 최대 해상도 */}
              <Select
                label="최대 해상도"
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
                options={[
                  { value: '800', label: '800px (SNS용)' },
                  { value: '1200', label: '1200px (웹용)' },
                  { value: '1920', label: '1920px (Full HD)' },
                  { value: '2560', label: '2560px (QHD)' },
                  { value: '4096', label: '4096px (원본 유지)' },
                ]}
              />
            </div>
          </Card>

          {/* 액션 버튼 */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={compressAll} disabled={isCompressing}>
              {isCompressing ? '압축 중...' : `전체 압축 (${images.length}개)`}
            </Button>
            {completedCount > 0 && (
              <Button variant="secondary" onClick={downloadAll}>
                {completedCount === 1 ? '다운로드' : `전체 다운로드 (${completedCount}개)`}
              </Button>
            )}
            <Button variant="ghost" onClick={clearAll}>
              전체 삭제
            </Button>
          </div>

          {/* 통계 */}
          {completedCount > 0 && (
            <Card variant="bordered" className="p-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">이미지</p>
                  <p className="font-mono font-medium">{completedCount}개</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">원본 총합</p>
                  <p className="font-mono font-medium">{formatSize(totalOriginal)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">압축 후</p>
                  <p className="font-mono font-medium">{formatSize(totalCompressed)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">절약</p>
                  <p className="font-mono font-medium text-green-600 dark:text-green-400">
                    {totalOriginal > 0
                      ? `${Math.round((1 - totalCompressed / totalOriginal) * 100)}%`
                      : '-'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* 이미지 리스트 */}
          <div className="space-y-3">
            {images.map((img) => (
              <Card key={img.id} variant="bordered" className="p-4">
                <div className="flex gap-4">
                  {/* 원본 썸네일 */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={img.originalPreview}
                      alt="원본"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">
                      {img.originalFile.name}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>원본: {formatSize(img.originalFile.size)}</span>
                      {img.compressedBlob && (
                        <>
                          <span>→</span>
                          <span className="text-green-600 dark:text-green-400">
                            {formatSize(img.compressedBlob.size)}
                          </span>
                          <span className="text-green-600 dark:text-green-400">
                            (-{Math.round((1 - img.compressedBlob.size / img.originalFile.size) * 100)}%)
                          </span>
                        </>
                      )}
                    </div>
                    <div className="mt-2">
                      {img.status === 'pending' && (
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                          대기 중
                        </span>
                      )}
                      {img.status === 'compressing' && (
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded">
                          압축 중...
                        </span>
                      )}
                      {img.status === 'done' && (
                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded">
                          완료
                        </span>
                      )}
                      {img.status === 'error' && (
                        <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded">
                          실패
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 액션 */}
                  <div className="flex gap-2 items-start">
                    {img.status === 'done' && (
                      <Button size="sm" variant="secondary" onClick={() => downloadOne(img)}>
                        다운로드
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => removeImage(img.id)}>
                      삭제
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📦 이미지 압축기란?
        </h2>
        <p className="text-sm leading-relaxed">
          이미지 압축은 사진의 파일 크기를 줄이면서 눈에 보이는 화질 저하를 최소화하는 기술입니다.
          손실 압축(JPEG)과 무손실 압축(PNG) 방식이 있으며, 최신 WebP 포맷은 두 가지 장점을 모두 제공합니다.
          웹사이트 로딩 속도 개선, 클라우드 저장 공간 절약, 이메일/메신저 용량 제한 대응에 필수적입니다.
          여러 이미지를 한 번에 처리하는 배치 압축을 지원합니다.
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
                <th className="text-left py-2 px-2">특징</th>
                <th className="text-left py-2 px-2">적합한 용도</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">JPEG</td><td>손실 압축, 고압축률</td><td>사진, 복잡한 이미지</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">PNG</td><td>무손실, 투명 배경 지원</td><td>로고, 아이콘, 스크린샷</td></tr>
              <tr><td className="py-2 px-2 font-mono">WebP</td><td>고효율, 투명/애니 지원</td><td>웹 최적화 (권장)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 압축 품질 가이드
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>80~100%</strong>: 고화질 유지, 인쇄용이나 중요 사진에 적합</li>
          <li><strong>60~80%</strong>: 웹사이트 최적 (화질/용량 균형)</li>
          <li><strong>40~60%</strong>: SNS 업로드, 미리보기 이미지</li>
          <li><strong>20~40%</strong>: 최대 압축, 화질 저하 감수</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '압축하면 원본 이미지가 변경되나요?',
            answer: '아니요, 원본 파일은 그대로 유지됩니다. 압축된 새 파일을 별도로 다운로드하는 방식이며, 브라우저에서 처리되어 서버로 전송되지 않습니다.',
          },
          {
            question: 'JPEG와 WebP 중 어떤 것을 선택해야 하나요?',
            answer: 'WebP는 같은 화질에서 JPEG보다 25~35% 작은 용량을 제공합니다. 최신 브라우저에서 지원되므로 웹용이라면 WebP를 권장합니다. 호환성이 중요하면 JPEG를 선택하세요.',
          },
          {
            question: '최대 해상도 설정은 왜 필요한가요?',
            answer: '고해상도 이미지(4000px 이상)는 웹에서 불필요하게 큽니다. 1920px(Full HD)로 제한하면 화질 차이 없이 파일 크기를 크게 줄일 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}
