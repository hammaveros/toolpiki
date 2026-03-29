'use client';

import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

type ViewMode = 'split' | 'preview' | 'code';
type DeviceSize = 'mobile' | 'tablet' | 'desktop' | 'full';

const DEVICE_SIZES: Record<DeviceSize, { width: string; label: string }> = {
  mobile: { width: '375px', label: '모바일' },
  tablet: { width: '768px', label: '태블릿' },
  desktop: { width: '1024px', label: '데스크탑' },
  full: { width: '100%', label: '전체' },
};

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      color: #333;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 10px;
    }
    .card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    button:hover {
      transform: scale(1.05);
    }
  </style>
</head>
<body>
  <h1>HTML 미리보기</h1>
  <p>HTML, CSS, JavaScript를 작성하고 실시간으로 결과를 확인하세요!</p>

  <div class="card">
    <h2>스타일 카드</h2>
    <p>CSS 그라디언트와 그림자 효과가 적용된 카드입니다.</p>
  </div>

  <button onclick="alert('클릭!')">버튼 클릭</button>

  <script>
    console.log('HTML 미리보기가 로드되었습니다!');
  </script>
</body>
</html>`;

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🌐 HTML 미리보기란?
        </h2>
        <p className="text-sm leading-relaxed">
          HTML 미리보기는 HTML, CSS, JavaScript 코드를 작성하면 실시간으로 렌더링 결과를 보여주는 도구입니다.
          별도의 파일 저장이나 브라우저 새로고침 없이 코드 변경 사항을 즉시 확인할 수 있어
          웹 프로토타이핑, 교육 목적, 코드 스니펫 테스트에 매우 유용합니다.
          모바일(375px), 태블릿(768px), 데스크탑(1024px) 크기로 반응형 디자인도 미리 테스트할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 지원 기능
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">실시간 렌더링</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">코드 입력 즉시 미리보기 업데이트</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">반응형 테스트</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">모바일/태블릿/데스크탑 사이즈 전환</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">분할 뷰</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">코드와 미리보기 동시 확인</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">JS 실행 지원</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">JavaScript 코드도 실행 가능</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>HTML, CSS, JS를 하나의 파일에 작성하여 빠르게 아이디어 테스트</li>
          <li>반응형 미디어 쿼리 적용 전 다양한 화면 크기에서 레이아웃 확인</li>
          <li>블로그나 문서에 삽입할 코드 스니펫 미리 확인</li>
          <li>CSS 애니메이션, 트랜지션 효과 실시간 디버깅</li>
          <li>외부 CDN 라이브러리도 &lt;script&gt; 태그로 불러와서 테스트 가능</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '작성한 코드가 저장되나요?',
            answer: '코드는 브라우저 메모리에만 유지되며 별도로 저장되지 않습니다. 중요한 코드는 직접 복사하여 보관하세요.',
          },
          {
            question: 'JavaScript 에러가 발생하면 어떻게 확인하나요?',
            answer: '브라우저 개발자 도구(F12)의 Console 탭에서 에러 메시지를 확인할 수 있습니다. alert()로 간단한 디버깅도 가능합니다.',
          },
          {
            question: '외부 이미지나 폰트를 사용할 수 있나요?',
            answer: '네, URL로 참조 가능한 외부 리소스는 모두 사용할 수 있습니다. 다만 CORS 정책에 따라 일부 리소스는 제한될 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}

export function HtmlPreview() {
  const [code, setCode] = useState(DEFAULT_HTML);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('full');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // iframe 업데이트
  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(code);
        doc.close();
      }
    }
  }, [code]);

  const handleReset = () => {
    setCode(DEFAULT_HTML);
  };

  const handleClear = () => {
    setCode('');
  };

  return (
    <div className="space-y-4">
      {/* 상단 컨트롤 */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        {/* 뷰 모드 */}
        <div className="flex gap-1">
          {(['split', 'code', 'preview'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg transition-colors',
                viewMode === mode
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {mode === 'split' ? '분할' : mode === 'code' ? '코드' : '미리보기'}
            </button>
          ))}
        </div>

        {/* 디바이스 크기 (미리보기 모드에서만) */}
        {viewMode !== 'code' && (
          <div className="flex gap-1">
            {(Object.keys(DEVICE_SIZES) as DeviceSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setDeviceSize(size)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-lg transition-colors',
                  deviceSize === size
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                {DEVICE_SIZES[size].label}
              </button>
            ))}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-2">
          <Button onClick={handleReset} variant="secondary" size="sm">
            예제 로드
          </Button>
          <Button onClick={handleClear} variant="secondary" size="sm">
            초기화
          </Button>
        </div>
      </div>

      {/* 메인 영역 */}
      <div className={cn(
        'grid gap-4 items-stretch',
        viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
      )}>
        {/* 코드 에디터 */}
        {viewMode !== 'preview' && (
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              HTML 코드
            </label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={viewMode === 'split' ? 20 : 25}
              className="font-mono text-sm flex-1"
              placeholder="<!DOCTYPE html>&#10;<html>&#10;<head>&#10;  <style>/* CSS */</style>&#10;</head>&#10;<body>&#10;  <!-- HTML -->&#10;  <script>// JavaScript</script>&#10;</body>&#10;</html>"
            />
          </div>
        )}

        {/* 미리보기 */}
        {viewMode !== 'code' && (
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              미리보기 {deviceSize !== 'full' && `(${DEVICE_SIZES[deviceSize].width})`}
            </label>
            <div
              className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white overflow-auto flex-1"
              style={{
                minHeight: viewMode === 'split' ? '470px' : '500px',
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
              }}
            >
              <iframe
                ref={iframeRef}
                title="HTML Preview"
                sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
                style={{
                  width: DEVICE_SIZES[deviceSize].width,
                  height: '100%',
                  border: deviceSize !== 'full' ? '1px solid #ddd' : 'none',
                  backgroundColor: 'white',
                  boxShadow: deviceSize !== 'full' ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
                }}
              />
            </div>
          </div>
        )}
      </div>

      <SeoContent />
    </div>
  );
}
