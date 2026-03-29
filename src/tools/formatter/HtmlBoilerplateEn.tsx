'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/Textarea';
import { FaqSection } from '@/components/ui/FaqItem';

interface Options {
  doctype: 'html5' | 'html4' | 'xhtml';
  lang: 'en' | 'ko' | 'ja' | 'zh' | 'es' | 'fr' | 'de';
  charset: 'utf-8';
  viewport: boolean;
  favicon: boolean;
  openGraph: boolean;
  twitter: boolean;
  css: 'none' | 'tailwind' | 'bootstrap' | 'reset';
  js: 'none' | 'jquery' | 'alpine';
  analytics: boolean;
}

export function HtmlBoilerplateEn() {
  const [options, setOptions] = useState<Options>({
    doctype: 'html5',
    lang: 'en',
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
  const [description, setDescription] = useState('Website description');

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
    lines.push(`  <meta charset="${options.charset}">`);

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
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Basic Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Language</label>
                <select
                  value={options.lang}
                  onChange={(e) => setOptions({ ...options, lang: e.target.value as Options['lang'] })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="en">English</option>
                  <option value="ko">Korean</option>
                  <option value="ja">Japanese</option>
                  <option value="zh">Chinese</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </Card>

          <Card variant="bordered" className="p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Options</h3>
            <div className="space-y-2">
              {[
                { key: 'viewport', label: 'Viewport Meta Tag' },
                { key: 'favicon', label: 'Favicon Links' },
                { key: 'openGraph', label: 'Open Graph (Social Sharing)' },
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
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Libraries</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">CSS</label>
                <select
                  value={options.css}
                  onChange={(e) => setOptions({ ...options, css: e.target.value as Options['css'] })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="none">None</option>
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
                  <option value="none">None</option>
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
              Generated HTML
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
          🏗️ What is HTML Boilerplate?
        </h2>
        <p className="text-sm leading-relaxed">
          An HTML boilerplate is the basic HTML structure needed for any new HTML page.
          It auto-generates repetitive code like DOCTYPE, meta tags, charset, and viewport settings,
          plus optional Open Graph tags, Twitter Cards, and CSS/JS library CDN links.
          Start new projects with a standards-compliant HTML foundation in just a few clicks.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Available Elements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Basic Meta Tags</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">charset, viewport, description</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Social Media</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Open Graph, Twitter Card</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">CSS Frameworks</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tailwind, Bootstrap, CSS Reset</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">JS Libraries</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">jQuery, Alpine.js</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 HTML Template Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>viewport</strong>: Essential for mobile responsive design, always include</li>
          <li><strong>description</strong>: Shown in search results, important for SEO</li>
          <li><strong>Open Graph</strong>: Displays link previews on social media like Facebook</li>
          <li><strong>Tailwind CDN</strong>: Great for prototyping, use build version for production</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What is the difference between HTML5 and XHTML?',
            answer: 'HTML5 is the modern web standard with more flexible syntax. XHTML is XML-based with stricter rules requiring closed tags and quoted attributes. HTML5 is recommended for new projects.',
          },
          {
            question: 'Should I use local files instead of CDN?',
            answer: 'CDN is convenient for prototyping, but for production, local bundling through build tools is better for performance and reliability.',
          },
          {
            question: 'Where should I put Google Analytics code?',
            answer: 'Traditionally placed before </body>, but Google recommends placing it in <head>. This tool generates it just before the closing body tag; adjust manually if needed.',
          },
        ]}
      />
    </div>
  );
}
