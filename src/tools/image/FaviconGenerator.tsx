'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

const FAVICON_SIZES = [16, 32, 48, 64, 128, 180, 192, 512];

interface GeneratedFavicon {
  size: number;
  dataUrl: string;
}

export function FaviconGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [favicons, setFavicons] = useState<GeneratedFavicon[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setFavicons([]);
    };
    reader.readAsDataURL(file);
  }, []);

  const generateFavicons = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const generated: GeneratedFavicon[] = [];

      FAVICON_SIZES.forEach((size) => {
        canvas.width = size;
        canvas.height = size;

        // 원본 비율 유지하면서 중앙 크롭
        const scale = Math.max(size / img.width, size / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (size - scaledWidth) / 2;
        const y = (size - scaledHeight) / 2;

        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

        generated.push({
          size,
          dataUrl: canvas.toDataURL('image/png'),
        });
      });

      setFavicons(generated);
    };
    img.src = image;
  };

  const downloadFavicon = (favicon: GeneratedFavicon) => {
    const link = document.createElement('a');
    link.download = `favicon-${favicon.size}x${favicon.size}.png`;
    link.href = favicon.dataUrl;
    link.click();
  };

  const downloadAll = () => {
    favicons.forEach((favicon, index) => {
      setTimeout(() => {
        downloadFavicon(favicon);
      }, index * 200);
    });
  };

  const generateHtmlCode = (): string => {
    return `<!-- 기본 파비콘 -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">

<!-- Android Chrome -->
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">

<!-- MS Tile -->
<meta name="msapplication-TileImage" content="/favicon-128x128.png">`;
  };

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        onFileSelect={handleImageUpload}
        label="이미지 업로드"
        description="정사각형 이미지 권장 (512x512 이상)"
      />

      {image && (
        <>
          <Card variant="bordered" className="p-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              원본 이미지
            </p>
            <img
              src={image}
              alt="Original"
              className="max-w-32 h-auto rounded"
            />
          </Card>

          <div className="flex gap-2">
            <Button onClick={generateFavicons}>파비콘 생성</Button>
            {favicons.length > 0 && (
              <Button variant="secondary" onClick={downloadAll}>
                모두 다운로드
              </Button>
            )}
          </div>

          {favicons.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                {favicons.map((favicon) => (
                  <Card
                    key={favicon.size}
                    variant="bordered"
                    className="p-2 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => downloadFavicon(favicon)}
                  >
                    <div className="flex justify-center mb-2">
                      <img
                        src={favicon.dataUrl}
                        alt={`${favicon.size}x${favicon.size}`}
                        style={{
                          width: Math.min(favicon.size, 64),
                          height: Math.min(favicon.size, 64),
                          imageRendering: favicon.size < 32 ? 'pixelated' : 'auto',
                        }}
                        className="rounded"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {favicon.size}x{favicon.size}
                    </p>
                  </Card>
                ))}
              </div>

              <Card variant="bordered" className="p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  HTML 코드
                </p>
                <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                  {generateHtmlCode()}
                </pre>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigator.clipboard.writeText(generateHtmlCode())}
                >
                  코드 복사
                </Button>
              </Card>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  사이즈별 용도
                </h3>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li><strong>16x16:</strong> 브라우저 탭</li>
                  <li><strong>32x32:</strong> 브라우저 탭 (고해상도)</li>
                  <li><strong>48x48:</strong> Windows 사이트 아이콘</li>
                  <li><strong>64x64:</strong> Windows 바탕화면 바로가기</li>
                  <li><strong>128x128:</strong> Chrome Web Store</li>
                  <li><strong>180x180:</strong> Apple Touch Icon (iOS)</li>
                  <li><strong>192x192:</strong> Android Chrome</li>
                  <li><strong>512x512:</strong> PWA 스플래시 화면</li>
                </ul>
              </div>
            </>
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
          ⭐ 파비콘 생성기란?
        </h2>
        <p className="text-sm leading-relaxed">
          파비콘 생성기는 웹사이트용 파비콘(favicon)을 다양한 크기로 한 번에 생성하는 온라인 도구입니다.
          하나의 원본 이미지만 업로드하면 브라우저 탭, 북마크, iOS/Android 홈 화면 아이콘, PWA 스플래시 화면 등
          각 플랫폼에서 요구하는 모든 크기의 아이콘을 자동으로 생성합니다.
          생성된 아이콘들은 개별 또는 일괄 다운로드가 가능하며, HTML 코드도 함께 제공됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 파비콘 사이즈별 용도
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">크기</th>
                <th className="text-left py-2 px-2">용도</th>
                <th className="text-left py-2 px-2">필수 여부</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">16x16</td><td>브라우저 탭 (기본)</td><td>필수</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">32x32</td><td>브라우저 탭 (고해상도)</td><td>필수</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">180x180</td><td>Apple Touch Icon (iOS)</td><td>권장</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">192x192</td><td>Android Chrome</td><td>권장</td></tr>
              <tr><td className="py-2 px-2 font-medium">512x512</td><td>PWA 스플래시 화면</td><td>PWA 필수</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 좋은 파비콘 만들기 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>정사각형 원본</strong>: 512x512 이상의 정사각형 이미지 권장</li>
          <li><strong>심플한 디자인</strong>: 작은 크기에서도 식별 가능하도록 단순하게</li>
          <li><strong>투명 배경</strong>: PNG 형식으로 투명 배경 활용 가능</li>
          <li><strong>브랜드 색상</strong>: 로고의 핵심 색상으로 인지도 높이기</li>
          <li><strong>테스트</strong>: 16x16에서도 알아볼 수 있는지 확인</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '원본 이미지는 어떤 크기가 좋나요?',
            answer: '512x512 픽셀 이상의 정사각형 이미지를 권장합니다. 큰 이미지에서 작은 크기로 축소해야 품질이 좋습니다.',
          },
          {
            question: '생성된 파비콘은 어디에 넣어야 하나요?',
            answer: '보통 웹사이트 루트 디렉토리에 저장하고, 제공되는 HTML 코드를 <head> 태그 안에 추가하면 됩니다.',
          },
          {
            question: 'ICO 파일도 필요한가요?',
            answer: '과거에는 .ico 형식이 필수였지만, 현대 브라우저는 PNG 파비콘을 잘 지원합니다. 구형 IE 호환이 필요하면 별도 ICO 변환 도구를 사용하세요.',
          },
        ]}
      />
    </div>
  );
}
