'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { encodeShareData, decodeShareData } from '@/lib/utils/share-encoding';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

type DiagramTemplate = {
  name: string;
  code: string;
};

const TEMPLATES: DiagramTemplate[] = [
  {
    name: 'Flowchart',
    code: `graph TD
    A[Start] --> B{Check Condition}
    B -->|Yes| C[Execute Task]
    B -->|No| D[End]
    C --> E[Save Result]
    E --> D`,
  },
  {
    name: 'Sequence',
    code: `sequenceDiagram
    participant U as User
    participant S as Server
    participant DB as Database
    U->>S: Login Request
    S->>DB: Query User
    DB-->>S: User Data
    S-->>U: Login Success`,
  },
  {
    name: 'Class',
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
    name: 'State',
    code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Request Received
    Processing --> Completed: Success
    Processing --> Error: Failure
    Error --> Idle: Retry
    Completed --> [*]`,
  },
  {
    name: 'ER Diagram',
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
    name: 'Gantt Chart',
    code: `gantt
    title Project Schedule
    dateFormat YYYY-MM-DD
    section Planning
        Requirements    :a1, 2024-01-01, 7d
        UI Design       :a2, after a1, 5d
    section Development
        Frontend        :b1, after a2, 14d
        Backend         :b2, after a2, 14d
    section Testing
        QA Testing      :c1, after b1, 7d
        Bug Fixes       :c2, after c1, 5d`,
  },
  {
    name: 'Pie Chart',
    code: `pie title Browser Market Share
    "Chrome" : 65
    "Safari" : 19
    "Firefox" : 4
    "Edge" : 4
    "Other" : 8`,
  },
  {
    name: 'Mind Map',
    code: `mindmap
  root((Project))
    Planning
      Requirements
      Timeline
    Design
      UI/UX
      Prototype
    Development
      Frontend
      Backend
      Database
    Deployment
      CI/CD
      Monitoring`,
  },
  {
    name: 'Git Graph',
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
  { value: 'default', label: 'Default' },
  { value: 'dark', label: 'Dark' },
  { value: 'forest', label: 'Forest' },
  { value: 'neutral', label: 'Neutral' },
];

const STORAGE_KEY = 'mermaid-diagram-en-code';
const DEFAULT_CODE = TEMPLATES[0].code;

export function MermaidDiagramEn() {
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

  // Dark mode detection + auto theme
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

  // Restore code from localStorage or URL share
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#code=')) {
      try {
        let decoded: string;
        try {
          decoded = decodeShareData<string>(hash.slice(6));
        } catch {
          decoded = decodeURIComponent(atob(hash.slice(6)));
        }
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

  // Save code to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && code.trim()) {
      localStorage.setItem(STORAGE_KEY, code);
    }
  }, [code]);

  // Initialize Mermaid
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

  // Render diagram
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
      // mermaid inserts temp SVG elements into body on error — clean them up
      document.querySelectorAll('[id^="dmermaid-"]').forEach((el) => el.remove());
      document.querySelectorAll('.error-icon, .error-text').forEach((el) => el.remove());
    }
  }, [code, initMermaid]);

  // Debounced rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      renderDiagram();
    }, 500);
    return () => clearTimeout(timer);
  }, [renderDiagram]);

  // Clean up mermaid elements from body on unmount
  useEffect(() => {
    return () => {
      document.querySelectorAll('[id^="dmermaid-"], [id^="mermaid-"]').forEach((el) => {
        if (!el.closest('[data-mermaid-container]')) el.remove();
      });
      document.querySelectorAll('.error-icon, .error-text').forEach((el) => el.remove());
    };
  }, []);

  // Download SVG
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

  // Download PNG
  const downloadPng = () => {
    if (!svgOutput) return;
    const svgEl = containerRef.current?.querySelector('svg');
    if (!svgEl) return;

    const svgClone = svgEl.cloneNode(true) as SVGSVGElement;

    const viewBox = svgClone.viewBox.baseVal;
    let svgWidth: number = viewBox.width || 0;
    let svgHeight: number = viewBox.height || 0;

    if (!svgWidth) {
      const wAttr: string = svgEl.getAttribute('width') || '0';
      svgWidth = parseFloat(wAttr);
    }
    if (!svgHeight) {
      const hAttr: string = svgEl.getAttribute('height') || '0';
      svgHeight = parseFloat(hAttr);
    }

    if (!svgWidth || !svgHeight) {
      const bbox: DOMRect = svgEl.getBoundingClientRect();
      svgWidth = bbox.width / zoom;
      svgHeight = bbox.height / zoom;
    }

    // Canvas max size limit (Safari: 16384px, Chrome: 32768px)
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

    svgClone.setAttribute('width', String(svgWidth));
    svgClone.setAttribute('height', String(svgHeight));
    if (!viewBox.width) {
      svgClone.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    }

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
      console.error('PNG conversion failed - cannot convert SVG to image');
    };
    img.src = dataUrl;
  };

  // Zoom controls
  const zoomIn = () => setZoom((z: number) => Math.min(z + 0.25, 10));
  const zoomOut = () => setZoom((z: number) => Math.max(z - 0.25, 0.1));
  const zoomReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  // Mouse wheel zoom
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

  // Shift+mouse drag panning
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

  // Apply template
  const applyTemplate = (template: DiagramTemplate) => {
    setCode(template.code);
  };

  // Generate share URL
  const generateShareUrl = () => {
    if (!code.trim()) return;
    const encoded = encodeShareData(code);
    const url = `${window.location.origin}${window.location.pathname}#code=${encoded}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url).catch(() => {});
  };

  return (
    <div className="space-y-4">
      {/* Templates + Theme */}
      <Card variant="bordered" className="p-4 space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Templates
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
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
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
            {shareUrl ? 'Copied!' : 'Share Link'}
          </Button>
        </div>
      </Card>

      {/* Editor + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mermaid Code
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
            placeholder="Enter Mermaid code here..."
          />
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
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
                      title="Zoom out"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={zoomReset}
                      className="px-2 h-7 flex items-center justify-center rounded text-xs font-medium
                        bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                        hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-w-[3rem]"
                      title="Reset zoom"
                    >
                      {Math.round(zoom * 100)}%
                    </button>
                    <button
                      type="button"
                      onClick={zoomIn}
                      className="w-7 h-7 flex items-center justify-center rounded text-sm font-bold
                        bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                        hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title="Zoom in"
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
                <p className="text-red-500 text-sm font-medium">Syntax Error</p>
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
              <p className="text-gray-400 text-sm mt-auto mb-auto">Enter code to see the diagram</p>
            )}
          </div>
        </div>
      </div>

      {/* Syntax guide */}
      <Card variant="bordered" className="p-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quick Reference
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Flowchart</p>
            <code className="text-xs text-gray-500">graph TD / graph LR</code>
            <p className="text-xs text-gray-400 mt-1">TD=top-down, LR=left-right</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Node Shapes</p>
            <code className="text-xs text-gray-500">[rect] (round) &#123;&#123;diamond&#125;&#125;</code>
            <p className="text-xs text-gray-400 mt-1">Bracket type defines shape</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Arrows</p>
            <code className="text-xs text-gray-500">--&gt; / ---&gt; / -..-&gt;</code>
            <p className="text-xs text-gray-400 mt-1">solid / long / dotted</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Sequence</p>
            <code className="text-xs text-gray-500">A-&gt;&gt;B: message</code>
            <p className="text-xs text-gray-400 mt-1">Solid arrow with label</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Labels</p>
            <code className="text-xs text-gray-500">A --&gt;|text| B</code>
            <p className="text-xs text-gray-400 mt-1">Add text on arrow</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Subgraph</p>
            <code className="text-xs text-gray-500">subgraph title ... end</code>
            <p className="text-xs text-gray-400 mt-1">Group nodes together</p>
          </div>
        </div>
      </Card>

      {/* Info */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Diagram auto-refreshes 0.5 seconds after you stop typing</p>
        <p>• SVG is vector format (stays sharp at any zoom), PNG exports at 2x resolution</p>
        <p>• Dark mode automatically applies a dark theme to diagrams</p>
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
          What is Mermaid?
        </h2>
        <p className="text-sm leading-relaxed">
          Mermaid is a text-based diagramming tool that lets you create diagrams and charts using simple syntax.
          Without any graphic editor, you can create flowcharts, sequence diagrams, ER diagrams,
          Gantt charts, pie charts, mind maps, and more. It is natively supported by GitHub, Notion, GitLab,
          and widely used in technical documentation and engineering blogs.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Supported Diagram Types
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">Type</th>
                <th className="text-left py-2 px-3 font-semibold">Keyword</th>
                <th className="text-left py-2 px-3 font-semibold">Use Case</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Flowchart</td>
                <td className="py-2 px-3"><code>graph TD</code></td>
                <td className="py-2 px-3">Process flows, decision trees</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Sequence</td>
                <td className="py-2 px-3"><code>sequenceDiagram</code></td>
                <td className="py-2 px-3">API calls, system communication</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Class</td>
                <td className="py-2 px-3"><code>classDiagram</code></td>
                <td className="py-2 px-3">Object relationships, class hierarchy</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">ER</td>
                <td className="py-2 px-3"><code>erDiagram</code></td>
                <td className="py-2 px-3">Database table relationships</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Gantt</td>
                <td className="py-2 px-3"><code>gantt</code></td>
                <td className="py-2 px-3">Project scheduling</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Pie</td>
                <td className="py-2 px-3"><code>pie</code></td>
                <td className="py-2 px-3">Proportions, market share</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">State</td>
                <td className="py-2 px-3"><code>stateDiagram-v2</code></td>
                <td className="py-2 px-3">State machines, lifecycles</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Mind Map</td>
                <td className="py-2 px-3"><code>mindmap</code></td>
                <td className="py-2 px-3">Brainstorming, idea organization</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Git Graph</td>
                <td className="py-2 px-3"><code>gitGraph</code></td>
                <td className="py-2 px-3">Branch strategy, Git workflow</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Tips
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>GitHub automatically renders Mermaid code blocks in README files</li>
          <li>Use /mermaid blocks in Notion to embed diagrams</li>
          <li>Export as SVG for crisp display at any resolution</li>
          <li>Set direction with TD (top-down), LR (left-right), BT (bottom-top), RL (right-left)</li>
        </ul>
      </section>

      <FaqSection
        title="FAQ"
        faqs={[
          {
            question: 'I don\'t know Mermaid syntax. Can I still use this?',
            answer: 'Click any template to load example code. Modifying the examples is the quickest way to learn the syntax.',
          },
          {
            question: 'Should I download SVG or PNG?',
            answer: 'SVG is a vector format that stays sharp at any size, ideal for web and docs. PNG is better for slides and social media sharing.',
          },
          {
            question: 'Is this the same syntax used in GitHub?',
            answer: 'Yes, identical. Copy the code into a ```mermaid code block in GitHub markdown and it will render the same diagram.',
          },
          {
            question: 'My diagram is not rendering',
            answer: 'There may be a syntax error. Check the error message and refer to the templates for correct syntax.',
          },
        ]}
      />
    </div>
  );
}
