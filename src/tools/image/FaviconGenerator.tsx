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
          <strong className="text-gray-900 dark:text-white">웹사이트 파비콘을 다양한 크기로 한 번에 생성하는 도구.</strong>{' '}
          원본 이미지 한 장만 올리면 <strong>브라우저 탭, 북마크, iOS/Android 홈 아이콘, PWA 스플래시</strong>까지
          각 플랫폼이 요구하는 모든 크기를 자동 생성하고, <strong>HTML 코드</strong>까지 함께 제공합니다.
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
          🧩 HTML에 넣는 방법
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          생성된 파일을 사이트 루트에 올린 뒤, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">{`<head>`}</code> 안에 아래 태그를 넣으면 됩니다.
          브라우저는 상황에 맞는 크기를 알아서 골라 씁니다.
        </p>
        <pre className="p-3 rounded bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto">
{`<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`}
        </pre>
        <p className="text-sm leading-relaxed mt-3">
          PWA로 설치되게 하려면 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">site.webmanifest</code>에
          192×192, 512×512 아이콘을 등록해야 합니다.
        </p>
        <pre className="p-3 rounded bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto mt-3">
{`{
  "icons": [
    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}`}
        </pre>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔁 파비콘이 안 바뀔 때
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          파비콘은 브라우저가 유독 오래 캐시하는 리소스입니다. 파일을 교체했는데 예전 아이콘이 계속 보인다면
          대부분 코드 문제가 아니라 캐시 문제입니다. 아래 순서대로 확인해 보세요.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>강력 새로고침</strong> — <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Ctrl+Shift+R</code>(맥은 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Cmd+Shift+R</code>)로 캐시를 무시하고 다시 받습니다.</li>
          <li><strong>파비콘 URL 직접 열기</strong> — 주소창에 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">/favicon.ico</code>를 직접 입력해 새 파일이 올라갔는지 확인합니다.</li>
          <li><strong>쿼리스트링 붙이기</strong> — <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">favicon.png?v=2</code>처럼 버전을 붙이면 새 파일로 인식됩니다.</li>
          <li><strong>시크릿 창에서 확인</strong> — 캐시가 없는 상태라 실제 배포 결과를 정확히 볼 수 있습니다.</li>
          <li><strong>CDN 캐시 무효화</strong> — CDN을 쓴다면 배포 후에도 엣지에 옛 파일이 남아 있을 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 좋은 파비콘 만들기 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>정사각형 원본</strong> — <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">512x512</code> 이상 권장</li>
          <li><strong>심플한 디자인</strong> — 작은 크기에서도 식별 가능하게</li>
          <li><strong>투명 배경</strong> — <strong>PNG</strong> 형식으로 활용 가능</li>
          <li><strong>브랜드 색상</strong> — 로고 핵심 색상으로 인지도 강화</li>
          <li><strong>테스트</strong> — <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">16x16</code>에서도 식별되는지 확인</li>
        </ul>
        <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 p-4 text-sm">
          <p className="font-semibold text-emerald-900 dark:text-emerald-200 mb-1">💡 디자인 팁</p>
          <p className="text-emerald-800 dark:text-emerald-300">
            <strong>글자 대신 심볼</strong>이 좋습니다. <code className="px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-xs font-mono">16x16</code>에서 글자는 거의 안 보이지만,
            단순한 도형/이니셜 한 글자는 또렷이 보입니다.
          </p>
        </div>
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
          {
            question: '파비콘을 바꿨는데 예전 아이콘이 계속 보여요.',
            answer: '브라우저가 파비콘을 오래 캐시하기 때문입니다. 강력 새로고침(Ctrl+Shift+R)을 하거나 favicon.png?v=2처럼 쿼리스트링을 붙여 새 파일로 인식시키세요. 시크릿 창에서 확인하면 실제 배포 상태를 볼 수 있습니다.',
          },
          {
            question: '다크 모드에서 아이콘이 안 보이는데 어떻게 하나요?',
            answer: '검은 배경에 어두운 로고를 쓰면 묻힙니다. 투명 배경 대신 브랜드 색 배경을 깔거나, 밝은 테두리를 넣어 두 테마 모두에서 식별되도록 만드는 것이 안전합니다.',
          },
          {
            question: '업로드한 이미지가 서버로 전송되나요?',
            answer: '아니요. 크기 변환은 브라우저 Canvas에서만 처리되며 이미지가 서버로 올라가지 않습니다. 미공개 로고도 안심하고 사용할 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}
