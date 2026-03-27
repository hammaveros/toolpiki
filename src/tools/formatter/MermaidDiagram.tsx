'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

type DiagramTemplate = {
  name: string;
  code: string;
};

const TEMPLATES: DiagramTemplate[] = [
  {
    name: '플로우차트',
    code: `graph TD
    A[시작] --> B{조건 확인}
    B -->|Yes| C[작업 실행]
    B -->|No| D[종료]
    C --> E[결과 저장]
    E --> D`,
  },
  {
    name: '시퀀스 다이어그램',
    code: `sequenceDiagram
    participant U as 사용자
    participant S as 서버
    participant DB as 데이터베이스
    U->>S: 로그인 요청
    S->>DB: 사용자 조회
    DB-->>S: 사용자 정보
    S-->>U: 로그인 성공`,
  },
  {
    name: '클래스 다이어그램',
    code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +fetch()
    }
    class Cat {
        +String color
        +purr()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
  },
  {
    name: '상태 다이어그램',
    code: `stateDiagram-v2
    [*] --> 대기
    대기 --> 처리중: 요청 수신
    처리중 --> 완료: 성공
    처리중 --> 오류: 실패
    오류 --> 대기: 재시도
    완료 --> [*]`,
  },
  {
    name: 'ER 다이어그램',
    code: `erDiagram
    USER ||--o{ ORDER : places
    USER {
        int id PK
        string name
        string email
    }
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER {
        int id PK
        date created_at
        string status
    }
    ORDER_ITEM {
        int id PK
        int quantity
        float price
    }
    PRODUCT ||--o{ ORDER_ITEM : "included in"
    PRODUCT {
        int id PK
        string name
        float price
    }`,
  },
  {
    name: '간트 차트',
    code: `gantt
    title 프로젝트 일정
    dateFormat YYYY-MM-DD
    section 기획
        요구사항 분석    :a1, 2024-01-01, 7d
        UI 설계          :a2, after a1, 5d
    section 개발
        프론트엔드       :b1, after a2, 14d
        백엔드           :b2, after a2, 14d
    section 테스트
        QA 테스트        :c1, after b1, 7d
        버그 수정        :c2, after c1, 5d`,
  },
  {
    name: '파이 차트',
    code: `pie title 브라우저 점유율
    "Chrome" : 65
    "Safari" : 19
    "Firefox" : 4
    "Edge" : 4
    "기타" : 8`,
  },
  {
    name: '마인드맵',
    code: `mindmap
  root((프로젝트))
    기획
      요구사항 분석
      일정 수립
    디자인
      UI/UX
      프로토타입
    개발
      프론트엔드
      백엔드
      데이터베이스
    배포
      CI/CD
      모니터링`,
  },
  {
    name: 'Git 그래프',
    code: `gitGraph
    commit
    commit
    branch feature
    checkout feature
    commit
    commit
    checkout main
    merge feature
    commit
    branch hotfix
    checkout hotfix
    commit
    checkout main
    merge hotfix`,
  },
];

type MermaidTheme = 'default' | 'dark' | 'forest' | 'neutral';

const THEME_OPTIONS: { value: MermaidTheme; label: string }[] = [
  { value: 'default', label: '기본' },
  { value: 'dark', label: '다크' },
  { value: 'forest', label: '포레스트' },
  { value: 'neutral', label: '뉴트럴' },
];

const STORAGE_KEY = 'mermaid-diagram-code';
const DEFAULT_CODE = TEMPLATES[0].code;

export function MermaidDiagram() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [error, setError] = useState<string | null>(null);
  const [svgOutput, setSvgOutput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState<MermaidTheme>('default');
  const [shareUrl, setShareUrl] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const panOriginRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const mermaidRef = useRef<typeof import('mermaid') | null>(null);
  const renderIdRef = useRef(0);

  // 다크모드 감지 + 테마 자동 연동
  useEffect(() => {
    const checkDark = () => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDarkMode(dark);
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // localStorage에서 코드 복원 / URL 공유 데이터 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#code=')) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(6)));
        setCode(decoded);
        window.history.replaceState(null, '', window.location.pathname);
        return;
      } catch {
        // ignore
      }
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCode(saved);
    }
  }, []);

  // localStorage에 코드 저장
  useEffect(() => {
    if (typeof window !== 'undefined' && code.trim()) {
      localStorage.setItem(STORAGE_KEY, code);
    }
  }, [code]);

  // Mermaid 초기화
  const initMermaid = useCallback(async () => {
    if (!mermaidRef.current) {
      const mermaid = await import('mermaid');
      mermaidRef.current = mermaid;
    }
    const resolvedTheme: MermaidTheme = theme === 'default' && isDarkMode ? 'dark' : theme;
    mermaidRef.current.default.initialize({
      startOnLoad: false,
      theme: resolvedTheme,
      securityLevel: 'loose',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    });
  }, [isDarkMode, theme]);

  // 렌더링
  const renderDiagram = useCallback(async () => {
    if (!code.trim()) {
      setSvgOutput('');
      setError(null);
      return;
    }

    try {
      await initMermaid();
      const mermaid = mermaidRef.current;
      if (!mermaid) return;

      renderIdRef.current += 1;
      const id = `mermaid-${renderIdRef.current}`;

      const { svg } = await mermaid.default.render(id, code.trim());
      setSvgOutput(svg);
      setError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg.replace(/\n/g, ' ').slice(0, 200));
      setSvgOutput('');
      // mermaid가 에러 시 body에 삽입하는 임시 SVG 요소 정리
      document.querySelectorAll('[id^="dmermaid-"]').forEach((el) => el.remove());
      document.querySelectorAll('.error-icon, .error-text').forEach((el) => el.remove());
    }
  }, [code, initMermaid]);

  // 디바운스 렌더링
  useEffect(() => {
    const timer = setTimeout(() => {
      renderDiagram();
    }, 500);
    return () => clearTimeout(timer);
  }, [renderDiagram]);

  // 언마운트 시 mermaid가 body에 남긴 잔여 요소 정리
  useEffect(() => {
    return () => {
      document.querySelectorAll('[id^="dmermaid-"], [id^="mermaid-"]').forEach((el) => {
        if (!el.closest('[data-mermaid-container]')) el.remove();
      });
      document.querySelectorAll('.error-icon, .error-text').forEach((el) => el.remove());
    };
  }, []);

  // SVG 다운로드
  const downloadSvg = () => {
    if (!svgOutput) return;
    const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mermaid-diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  // PNG 다운로드
  const downloadPng = () => {
    if (!svgOutput) return;
    const svgEl = containerRef.current?.querySelector('svg');
    if (!svgEl) return;

    const svgClone = svgEl.cloneNode(true) as SVGSVGElement;

    // viewBox에서 크기 추출
    const viewBox = svgClone.viewBox.baseVal;
    let svgWidth: number = viewBox.width || 0;
    let svgHeight: number = viewBox.height || 0;

    // viewBox가 없으면 attribute에서 추출
    if (!svgWidth) {
      const wAttr: string = svgEl.getAttribute('width') || '0';
      svgWidth = parseFloat(wAttr);
    }
    if (!svgHeight) {
      const hAttr: string = svgEl.getAttribute('height') || '0';
      svgHeight = parseFloat(hAttr);
    }

    // fallback: 렌더된 크기에서 추출
    if (!svgWidth || !svgHeight) {
      const bbox: DOMRect = svgEl.getBoundingClientRect();
      svgWidth = bbox.width / zoom;
      svgHeight = bbox.height / zoom;
    }

    // canvas 최대 크기 제한 (Safari: 16384px, Chrome: 32768px)
    const MAX_CANVAS_SIZE = 16000;
    let scale = 4;
    while (svgWidth * scale > MAX_CANVAS_SIZE || svgHeight * scale > MAX_CANVAS_SIZE) {
      scale -= 0.5;
      if (scale < 1) { scale = 1; break; }
    }
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = Math.ceil(svgWidth * scale);
    canvas.height = Math.ceil(svgHeight * scale);
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;

    // SVG에 명시적 크기 + viewBox 설정
    svgClone.setAttribute('width', String(svgWidth));
    svgClone.setAttribute('height', String(svgHeight));
    if (!viewBox.width) {
      svgClone.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    }

    // 외부 폰트를 인라인으로 (브라우저 보안 제한 대응)
    const styleEl: SVGStyleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleEl.textContent = `* { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }`;
    svgClone.insertBefore(styleEl, svgClone.firstChild);

    const svgData: string = new XMLSerializer().serializeToString(svgClone);
    const dataUrl: string = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);

    const img: HTMLImageElement = new Image();
    img.onload = () => {
      ctx.fillStyle = isDarkMode ? '#1a1a2e' : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl: string = canvas.toDataURL('image/png');
      const a: HTMLAnchorElement = document.createElement('a');
      a.href = pngUrl;
      a.download = 'mermaid-diagram.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.onerror = () => {
      console.error('PNG 변환 실패 - SVG를 이미지로 변환할 수 없습니다');
    };
    img.src = dataUrl;
  };

  // 줌 컨트롤
  const zoomIn = () => setZoom((z: number) => Math.min(z + 0.25, 10));
  const zoomOut = () => setZoom((z: number) => Math.max(z - 0.25, 0.1));
  const zoomReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  // 마우스 휠 줌
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom((z: number) => {
          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          return Math.min(Math.max(z + delta, 0.1), 10);
        });
      }
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Shift+마우스 드래그 패닝
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (e.shiftKey) {
        e.preventDefault();
        isPanningRef.current = true;
        panStartRef.current = { x: e.clientX, y: e.clientY };
        panOriginRef.current = { ...pan };
        container.style.cursor = 'grabbing';
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanningRef.current) return;
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPan({ x: panOriginRef.current.x + dx, y: panOriginRef.current.y + dy });
    };
    const handleMouseUp = () => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
        container.style.cursor = '';
      }
    };
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [pan]);

  // 템플릿 적용
  const applyTemplate = (template: DiagramTemplate) => {
    setCode(template.code);
  };

  // 공유 URL 생성
  const generateShareUrl = () => {
    if (!code.trim()) return;
    const encoded = btoa(encodeURIComponent(code));
    const url = `${window.location.origin}${window.location.pathname}#code=${encoded}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url).catch(() => {});
  };

  return (
    <div className="space-y-4">
      {/* 템플릿 + 테마 선택 */}
      <Card variant="bordered" className="p-4 space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            템플릿
          </p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => applyTemplate(t)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                  bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                  hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">테마</span>
            <div className="flex gap-1">
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTheme(t.value)}
                  className={`px-2.5 py-1 text-xs rounded transition-colors
                    ${theme === t.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={generateShareUrl}>
            {shareUrl ? '복사됨!' : '공유 링크'}
          </Button>
        </div>
      </Card>

      {/* 에디터 + 미리보기 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 코드 입력 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mermaid 코드
            </label>
            <CopyButton text={code} />
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-[700px] px-4 py-3 font-mono text-sm rounded-lg border resize-none
              bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
            placeholder="여기에 Mermaid 코드를 입력하세요..."
          />
        </div>

        {/* 미리보기 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              미리보기
            </label>
            <div className="flex items-center gap-2">
              {svgOutput && (
                <>
                  <div className="flex items-center gap-1 mr-2">
                    <button
                      type="button"
                      onClick={zoomOut}
                      className="w-7 h-7 flex items-center justify-center rounded text-sm font-bold
                        bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                        hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title="축소"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={zoomReset}
                      className="px-2 h-7 flex items-center justify-center rounded text-xs font-medium
                        bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                        hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-w-[3rem]"
                      title="초기화"
                    >
                      {Math.round(zoom * 100)}%
                    </button>
                    <button
                      type="button"
                      onClick={zoomIn}
                      className="w-7 h-7 flex items-center justify-center rounded text-sm font-bold
                        bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                        hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title="확대"
                    >
                      +
                    </button>
                  </div>
                  <Button variant="secondary" size="sm" onClick={downloadSvg}>
                    SVG
                  </Button>
                  <Button variant="secondary" size="sm" onClick={downloadPng}>
                    PNG
                  </Button>
                </>
              )}
            </div>
          </div>
          <div
            ref={containerRef}
            data-mermaid-container
            className="w-full h-[700px] rounded-lg border overflow-auto
              bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600
              flex items-start p-4"
            style={{ justifyContent: zoom > 1 ? 'flex-start' : 'center' }}
          >
            {error ? (
              <div className="text-center space-y-2 max-w-md mt-auto mb-auto">
                <p className="text-red-500 text-sm font-medium">구문 오류</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 break-words">{error}</p>
              </div>
            ) : svgOutput ? (
              <div
                className="mermaid-output [&>svg]:max-w-none [&>svg]:h-auto [&>svg]:block"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'top left',
                  minWidth: zoom > 1 ? `${zoom * 100}%` : undefined,
                  minHeight: zoom > 1 ? `${zoom * 100}%` : undefined,
                }}
                dangerouslySetInnerHTML={{ __html: svgOutput }}
              />
            ) : (
              <p className="text-gray-400 text-sm mt-auto mb-auto">코드를 입력하면 다이어그램이 표시됩니다</p>
            )}
          </div>
        </div>
      </div>

      {/* 문법 가이드 */}
      <Card variant="bordered" className="p-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          자주 쓰는 문법
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">플로우차트</p>
            <code className="text-xs text-gray-500">graph TD / graph LR</code>
            <p className="text-xs text-gray-400 mt-1">TD=위→아래, LR=왼→오른</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">노드 모양</p>
            <code className="text-xs text-gray-500">[사각] (둥근) &#123;&#123;마름모&#125;&#125;</code>
            <p className="text-xs text-gray-400 mt-1">괄호 종류로 모양 결정</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">화살표</p>
            <code className="text-xs text-gray-500">--&gt; / ---&gt; / -..-&gt;</code>
            <p className="text-xs text-gray-400 mt-1">실선 / 긴선 / 점선</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">시퀀스</p>
            <code className="text-xs text-gray-500">A-&gt;&gt;B: 메시지</code>
            <p className="text-xs text-gray-400 mt-1">실선 화살표 메시지</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">라벨</p>
            <code className="text-xs text-gray-500">A --&gt;|텍스트| B</code>
            <p className="text-xs text-gray-400 mt-1">화살표에 텍스트 추가</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">서브그래프</p>
            <code className="text-xs text-gray-500">subgraph 제목 ... end</code>
            <p className="text-xs text-gray-400 mt-1">노드 그룹 묶기</p>
          </div>
        </div>
      </Card>

      {/* 안내 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 코드 입력 시 0.5초 후 자동으로 미리보기가 갱신됩니다</p>
        <p>• SVG는 벡터 형식(확대해도 선명), PNG는 2배 해상도로 내보냅니다</p>
        <p>• 다크모드에서는 다이어그램도 어두운 테마로 표시됩니다</p>
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
          📊 머메이드 다이어그램이란?
        </h2>
        <p className="text-sm leading-relaxed">
          머메이드(Mermaid)는 텍스트 기반으로 다이어그램과 차트를 만드는 오픈소스 도구입니다.
          복잡한 그래픽 편집기 없이도 간단한 문법만으로 플로우차트, 시퀀스 다이어그램, ER 다이어그램,
          간트 차트, 파이 차트, 마인드맵 등 다양한 다이어그램을 만들 수 있습니다.
          GitHub, Notion, GitLab 등에서 기본 지원하며, 개발 문서와 기술 블로그에서 널리 사용됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          지원하는 다이어그램 종류
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">종류</th>
                <th className="text-left py-2 px-3 font-semibold">키워드</th>
                <th className="text-left py-2 px-3 font-semibold">용도</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">플로우차트</td>
                <td className="py-2 px-3"><code>graph TD</code></td>
                <td className="py-2 px-3">프로세스 흐름, 의사결정 트리</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">시퀀스</td>
                <td className="py-2 px-3"><code>sequenceDiagram</code></td>
                <td className="py-2 px-3">API 호출 흐름, 시스템 간 통신</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">클래스</td>
                <td className="py-2 px-3"><code>classDiagram</code></td>
                <td className="py-2 px-3">객체 관계, 클래스 구조</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">ER</td>
                <td className="py-2 px-3"><code>erDiagram</code></td>
                <td className="py-2 px-3">데이터베이스 테이블 관계</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">간트</td>
                <td className="py-2 px-3"><code>gantt</code></td>
                <td className="py-2 px-3">프로젝트 일정 관리</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">파이 차트</td>
                <td className="py-2 px-3"><code>pie</code></td>
                <td className="py-2 px-3">비율, 점유율 시각화</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">상태</td>
                <td className="py-2 px-3"><code>stateDiagram-v2</code></td>
                <td className="py-2 px-3">상태 머신, 생명주기</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">마인드맵</td>
                <td className="py-2 px-3"><code>mindmap</code></td>
                <td className="py-2 px-3">아이디어 정리, 브레인스토밍</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Git 그래프</td>
                <td className="py-2 px-3"><code>gitGraph</code></td>
                <td className="py-2 px-3">브랜치 전략, Git 흐름</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          활용 팁
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>GitHub README에 Mermaid 코드 블록을 넣으면 자동으로 다이어그램이 렌더링됩니다</li>
          <li>Notion에서도 /mermaid 블록으로 다이어그램을 삽입할 수 있습니다</li>
          <li>SVG로 내보내면 어떤 해상도에서도 선명하게 표시됩니다</li>
          <li>다이어그램 방향은 TD(위→아래), LR(왼→오른), BT(아래→위), RL(오른→왼)로 설정</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '머메이드 문법을 모르는데 사용할 수 있나요?',
            answer: '템플릿을 클릭하면 예제 코드가 자동으로 입력됩니다. 예제를 수정하면서 익히는 것이 가장 빠른 방법입니다.',
          },
          {
            question: 'SVG와 PNG 중 어떤 형식으로 다운로드해야 하나요?',
            answer: 'SVG는 벡터 형식으로 확대해도 선명하며, 웹이나 문서에 적합합니다. PNG는 슬라이드나 SNS 공유에 적합합니다.',
          },
          {
            question: 'GitHub README에서 사용하는 문법과 동일한가요?',
            answer: '네, 동일합니다. 여기서 작성한 코드를 GitHub 마크다운의 ```mermaid 코드 블록에 그대로 복사하면 됩니다.',
          },
          {
            question: '다이어그램이 렌더링되지 않아요',
            answer: '구문에 오류가 있을 수 있습니다. 오류 메시지를 확인하고, 템플릿을 참고하여 문법을 수정해 보세요.',
          },
        ]}
      />
    </div>
  );
}
