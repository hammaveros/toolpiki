'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/Textarea';
import { FaqSection } from '@/components/ui/FaqItem';

interface Options {
  doctype: 'html5' | 'html4' | 'xhtml';
  lang: 'ko' | 'en' | 'ja' | 'zh';
  charset: 'utf-8' | 'euc-kr';
  viewport: boolean;
  favicon: boolean;
  openGraph: boolean;
  twitter: boolean;
  css: 'none' | 'tailwind' | 'bootstrap' | 'reset';
  js: 'none' | 'jquery' | 'alpine';
  analytics: boolean;
}

export function HtmlBoilerplate() {
  const [options, setOptions] = useState<Options>({
    doctype: 'html5',
    lang: 'ko',
    charset: 'utf-8',
    viewport: true,
    favicon: true,
    openGraph: false,
    twitter: false,
    css: 'none',
    js: 'none',
    analytics: false,
  });

  const [title, setTitle] = useState('My Website');
  const [description, setDescription] = useState('웹사이트 설명');

  const generatedHtml = useMemo(() => {
    const lines: string[] = [];

    // DOCTYPE
    if (options.doctype === 'html5') {
      lines.push('<!DOCTYPE html>');
    } else if (options.doctype === 'html4') {
      lines.push('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">');
    } else {
      lines.push('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">');
    }

    // HTML tag
    lines.push(`<html lang="${options.lang}">`);
    lines.push('<head>');

    // Charset
    lines.push(`  <meta charset="${options.charset}">`) ;

    // Viewport
    if (options.viewport) {
      lines.push('  <meta name="viewport" content="width=device-width, initial-scale=1.0">');
    }

    // Title and meta
    lines.push(`  <title>${title}</title>`);
    lines.push(`  <meta name="description" content="${description}">`);

    // Favicon
    if (options.favicon) {
      lines.push('  <link rel="icon" type="image/x-icon" href="/favicon.ico">');
      lines.push('  <link rel="apple-touch-icon" href="/apple-touch-icon.png">');
    }

    // Open Graph
    if (options.openGraph) {
      lines.push('');
      lines.push('  <!-- Open Graph / Facebook -->');
      lines.push('  <meta property="og:type" content="website">');
      lines.push('  <meta property="og:url" content="https://example.com/">');
      lines.push(`  <meta property="og:title" content="${title}">`);
      lines.push(`  <meta property="og:description" content="${description}">`);
      lines.push('  <meta property="og:image" content="https://example.com/og-image.jpg">');
    }

    // Twitter
    if (options.twitter) {
      lines.push('');
      lines.push('  <!-- Twitter -->');
      lines.push('  <meta name="twitter:card" content="summary_large_image">');
      lines.push('  <meta name="twitter:url" content="https://example.com/">');
      lines.push(`  <meta name="twitter:title" content="${title}">`);
      lines.push(`  <meta name="twitter:description" content="${description}">`);
      lines.push('  <meta name="twitter:image" content="https://example.com/twitter-image.jpg">');
    }

    // CSS
    if (options.css !== 'none') {
      lines.push('');
      if (options.css === 'tailwind') {
        lines.push('  <!-- Tailwind CSS -->');
        lines.push('  <script src="https://cdn.tailwindcss.com"></script>');
      } else if (options.css === 'bootstrap') {
        lines.push('  <!-- Bootstrap CSS -->');
        lines.push('  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">');
      } else if (options.css === 'reset') {
        lines.push('  <!-- CSS Reset -->');
        lines.push('  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/modern-normalize@2.0.0/modern-normalize.min.css">');
      }
    }

    lines.push('</head>');
    lines.push('<body>');
    lines.push('');
    lines.push('  <h1>Hello World</h1>');
    lines.push('');

    // JS Libraries
    if (options.js !== 'none') {
      if (options.js === 'jquery') {
        lines.push('  <!-- jQuery -->');
        lines.push('  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>');
      } else if (options.js === 'alpine') {
        lines.push('  <!-- Alpine.js -->');
        lines.push('  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>');
      }
    }

    // Bootstrap JS
    if (options.css === 'bootstrap') {
      lines.push('  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>');
    }

    // Google Analytics
    if (options.analytics) {
      lines.push('');
      lines.push('  <!-- Google Analytics -->');
      lines.push('  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>');
      lines.push('  <script>');
      lines.push('    window.dataLayer = window.dataLayer || [];');
      lines.push('    function gtag(){dataLayer.push(arguments);}');
      lines.push("    gtag('js', new Date());");
      lines.push("    gtag('config', 'G-XXXXXXXXXX');");
      lines.push('  </script>');
    }

    lines.push('</body>');
    lines.push('</html>');

    return lines.join('\n');
  }, [options, title, description]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card variant="bordered" className="p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">기본 설정</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">설명</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">언어</label>
                  <select
                    value={options.lang}
                    onChange={(e) => setOptions({ ...options, lang: e.target.value as Options['lang'] })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="ko">한국어</option>
                    <option value="en">영어</option>
                    <option value="ja">일본어</option>
                    <option value="zh">중국어</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">문자셋</label>
                  <select
                    value={options.charset}
                    onChange={(e) => setOptions({ ...options, charset: e.target.value as Options['charset'] })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="utf-8">UTF-8</option>
                    <option value="euc-kr">EUC-KR</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="bordered" className="p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">옵션</h3>
            <div className="space-y-2">
              {[
                { key: 'viewport', label: 'Viewport 메타태그' },
                { key: 'favicon', label: 'Favicon 링크' },
                { key: 'openGraph', label: 'Open Graph (SNS 공유)' },
                { key: 'twitter', label: 'Twitter Card' },
                { key: 'analytics', label: 'Google Analytics' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options[key as keyof Options] as boolean}
                    onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </Card>

          <Card variant="bordered" className="p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">라이브러리</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">CSS</label>
                <select
                  value={options.css}
                  onChange={(e) => setOptions({ ...options, css: e.target.value as Options['css'] })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="none">없음</option>
                  <option value="tailwind">Tailwind CSS</option>
                  <option value="bootstrap">Bootstrap 5</option>
                  <option value="reset">CSS Reset</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">JavaScript</label>
                <select
                  value={options.js}
                  onChange={(e) => setOptions({ ...options, js: e.target.value as Options['js'] })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="none">없음</option>
                  <option value="jquery">jQuery</option>
                  <option value="alpine">Alpine.js</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              생성된 HTML
            </label>
            <CopyButton text={generatedHtml} />
          </div>
          <Textarea
            value={generatedHtml}
            readOnly
            rows={30}
            className="font-mono text-sm bg-gray-50 dark:bg-gray-800/50"
          />
        </div>
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
          🏗️ HTML 보일러플레이트란?
        </h2>
        <p className="text-sm leading-relaxed">
          HTML 보일러플레이트(Boilerplate)는 새 웹페이지를 시작할 때 필요한 기본 HTML 구조를 말합니다.
          DOCTYPE, 메타태그, 문자셋, 뷰포트 설정 등 매번 작성해야 하는 반복적인 코드를 자동으로 생성해주며,
          Open Graph 태그, Twitter Card, CSS/JS 라이브러리 CDN 링크까지 옵션으로 추가할 수 있습니다.
          새 프로젝트를 시작할 때 몇 번의 클릭으로 표준을 준수하는 HTML 시작점을 얻을 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 포함 가능한 요소
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">기본 메타태그</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">charset, viewport, description</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">소셜 미디어</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Open Graph, Twitter Card</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">CSS 프레임워크</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tailwind, Bootstrap, CSS Reset</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">JS 라이브러리</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">jQuery, Alpine.js</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 HTML 템플릿 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>viewport</strong>: 모바일 반응형 디자인에 필수, 항상 포함 권장</li>
          <li><strong>description</strong>: 검색 엔진에 표시되는 설명, SEO에 중요</li>
          <li><strong>Open Graph</strong>: 카카오톡, 페이스북 등에서 링크 공유 시 미리보기 표시</li>
          <li><strong>Tailwind CDN</strong>: 빠른 프로토타이핑에 유용, 프로덕션은 빌드 버전 사용</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'HTML5와 XHTML의 차이점은 무엇인가요?',
            answer: 'HTML5는 현대 웹 표준으로 더 유연한 문법을 허용합니다. XHTML은 XML 기반으로 더 엄격한 문법을 요구하며, 태그 닫기와 속성 따옴표가 필수입니다. 새 프로젝트는 HTML5 사용을 권장합니다.',
          },
          {
            question: 'CDN 대신 로컬 파일을 사용해야 하나요?',
            answer: '프로토타이핑에는 CDN이 편리하지만, 프로덕션에서는 빌드 도구를 통해 로컬 번들링하는 것이 성능과 안정성 면에서 유리합니다.',
          },
          {
            question: 'Google Analytics 코드는 어디에 넣어야 하나요?',
            answer: '보통 </body> 직전에 넣지만, Google은 <head> 내부 삽입을 권장합니다. 이 도구는 body 하단에 생성하며, 필요시 위치를 수동 조정하세요.',
          },
        ]}
      />
    </div>
  );
}
