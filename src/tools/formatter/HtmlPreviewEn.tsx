'use client';

import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

type ViewMode = 'split' | 'preview' | 'code';
type DeviceSize = 'mobile' | 'tablet' | 'desktop' | 'full';

const DEVICE_SIZES: Record<DeviceSize, { width: string; label: string }> = {
  mobile: { width: '375px', label: 'Mobile' },
  tablet: { width: '768px', label: 'Tablet' },
  desktop: { width: '1024px', label: 'Desktop' },
  full: { width: '100%', label: 'Full' },
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
  <h1>HTML Preview</h1>
  <p>Write HTML, CSS, and JavaScript to see the results in real-time!</p>

  <div class="card">
    <h2>Styled Card</h2>
    <p>A card with CSS gradient and shadow effects.</p>
  </div>

  <button onclick="alert('Clicked!')">Click Me</button>

  <script>
    console.log('HTML Preview loaded!');
  </script>
</body>
</html>`;

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🌐 What is HTML Preview?
        </h2>
        <p className="text-sm leading-relaxed">
          HTML Preview is a tool that renders HTML, CSS, and JavaScript code in real-time as you type.
          Without saving files or refreshing your browser, you can instantly see your code changes,
          making it ideal for web prototyping, educational purposes, and testing code snippets.
          Test responsive designs with mobile (375px), tablet (768px), and desktop (1024px) viewport presets.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Supported Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Real-time Rendering</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Preview updates instantly as you type</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Responsive Testing</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Switch between mobile/tablet/desktop sizes</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Split View</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">View code and preview side by side</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">JS Execution</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Run JavaScript code in the preview</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Usage Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>Write HTML, CSS, and JS in a single file to quickly test ideas</li>
          <li>Check layout across different screen sizes before applying media queries</li>
          <li>Preview code snippets before embedding in blogs or documentation</li>
          <li>Debug CSS animations and transitions in real-time</li>
          <li>Load external CDN libraries via &lt;script&gt; tags for testing</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Is my code saved anywhere?',
            answer: 'Code is only kept in browser memory and is not saved. Copy important code manually to preserve it.',
          },
          {
            question: 'How do I check JavaScript errors?',
            answer: 'Open your browser developer tools (F12) and check the Console tab for error messages. You can also use alert() for simple debugging.',
          },
          {
            question: 'Can I use external images or fonts?',
            answer: 'Yes, any external resource with a URL can be used. However, some resources may be restricted due to CORS policies.',
          },
        ]}
      />
    </div>
  );
}

export function HtmlPreviewEn() {
  const [code, setCode] = useState(DEFAULT_HTML);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('full');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Update iframe
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
      {/* Top Controls */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        {/* View Mode */}
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
              {mode === 'split' ? 'Split' : mode === 'code' ? 'Code' : 'Preview'}
            </button>
          ))}
        </div>

        {/* Device Size (only in preview mode) */}
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

        {/* Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleReset} variant="secondary" size="sm">
            Load Example
          </Button>
          <Button onClick={handleClear} variant="secondary" size="sm">
            Clear
          </Button>
        </div>
      </div>

      {/* Main Area */}
      <div className={cn(
        'grid gap-4',
        viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
      )}>
        {/* Code Editor */}
        {viewMode !== 'preview' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              HTML Code
            </label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={viewMode === 'split' ? 20 : 25}
              className="font-mono text-sm"
              placeholder="<!DOCTYPE html>&#10;<html>&#10;<head>&#10;  <style>/* CSS */</style>&#10;</head>&#10;<body>&#10;  <!-- HTML -->&#10;  <script>// JavaScript</script>&#10;</body>&#10;</html>"
            />
          </div>
        )}

        {/* Preview */}
        {viewMode !== 'code' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview {deviceSize !== 'full' && `(${DEVICE_SIZES[deviceSize].width})`}
            </label>
            <div
              className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white overflow-auto"
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
                  height: viewMode === 'split' ? '470px' : '500px',
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
