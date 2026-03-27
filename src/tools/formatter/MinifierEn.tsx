'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⚡ What is Code Minifier?
        </h2>
        <p className="text-sm leading-relaxed">
          Code Minifier is a tool that removes unnecessary whitespace, line breaks, and comments from CSS, JavaScript, and HTML
          to minimize file size. It is essential for improving website loading speed and saving bandwidth.
          Minification before deployment is standard practice, typically achieving 30-70% size reduction.
          The Beautify feature does the opposite, reformatting compressed code for readability.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Minification by Language
        </h2>
        <div className="text-sm space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
              <p className="font-medium mb-1">CSS Minify</p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Whitespace removal</li>
                <li>• Comment stripping</li>
                <li>• Trailing semicolon removal</li>
              </ul>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
              <p className="font-medium mb-1">JS Minify</p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Single/block comments</li>
                <li>• Consecutive space collapse</li>
                <li>• Operator space cleanup</li>
              </ul>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
              <p className="font-medium mb-1">HTML Minify</p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• HTML comment removal</li>
                <li>• Inter-tag space cleanup</li>
                <li>• Line break removal</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Best Practices
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>Use Beautify during development, apply Minify before deployment</li>
          <li>Always minify files before uploading to CDN for faster loading</li>
          <li>Use Source Maps alongside minified code for debugging capability</li>
          <li>Build tools like Webpack/Vite have built-in minification settings</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What is the difference between Minify and Uglify?',
            answer: 'Minify performs basic compression like removing whitespace and comments. Uglify goes further with variable name shortening and code optimization. This tool provides Minify-level basic compression.',
          },
          {
            question: 'Will minification break my code?',
            answer: 'This tool only removes whitespace and comments, so it does not affect code logic. However, always verify results for complex regex or special syntax.',
          },
          {
            question: 'When should I use Beautify?',
            answer: 'Use Beautify when analyzing minified libraries or obfuscated code, or when you need readable formatting for code review or learning purposes.',
          },
        ]}
      />
    </div>
  );
}

type CodeType = 'css' | 'js' | 'html';

export function MinifierEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [codeType, setCodeType] = useState<CodeType>('css');
  const [stats, setStats] = useState<{ original: number; minified: number } | null>(null);

  const minifyCss = (css: string): string => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*,\s*/g, ',')
      .replace(/;}/g, '}')
      .trim();
  };

  const minifyJs = (js: string): string => {
    return js
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}();,=+\-*/<>!&|?:])\s*/g, '$1')
      .replace(/(return|var|let|const|if|else|for|while|function|new|typeof|instanceof|in|of)([^\s])/g, '$1 $2')
      .trim();
  };

  const minifyHtml = (html: string): string => {
    return html
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  };

  const beautifyCss = (css: string): string => {
    const minified = minifyCss(css);
    return minified
      .replace(/{/g, ' {\n  ')
      .replace(/}/g, '\n}\n')
      .replace(/;/g, ';\n  ')
      .replace(/\n  }/g, '\n}')
      .trim();
  };

  const beautifyJs = (js: string): string => {
    let result = minifyJs(js);
    let indent = 0;
    let formatted = '';

    for (let i = 0; i < result.length; i++) {
      const char = result[i];

      if (char === '{' || char === '[') {
        indent++;
        formatted += char + '\n' + '  '.repeat(indent);
      } else if (char === '}' || char === ']') {
        indent--;
        formatted += '\n' + '  '.repeat(indent) + char;
      } else if (char === ';') {
        formatted += char + '\n' + '  '.repeat(indent);
      } else if (char === ',') {
        formatted += char + '\n' + '  '.repeat(indent);
      } else {
        formatted += char;
      }
    }

    return formatted.replace(/\n\s*\n/g, '\n').trim();
  };

  const beautifyHtml = (html: string): string => {
    const minified = minifyHtml(html);
    let indent = 0;
    let formatted = '';
    const tags = minified.match(/<[^>]+>|[^<]+/g) || [];

    tags.forEach((tag) => {
      if (tag.startsWith('</')) {
        indent--;
        formatted += '  '.repeat(indent) + tag + '\n';
      } else if (tag.startsWith('<') && !tag.endsWith('/>') && !tag.startsWith('<!')) {
        formatted += '  '.repeat(indent) + tag + '\n';
        if (!tag.match(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i)) {
          indent++;
        }
      } else if (tag.startsWith('<')) {
        formatted += '  '.repeat(indent) + tag + '\n';
      } else if (tag.trim()) {
        formatted += '  '.repeat(indent) + tag.trim() + '\n';
      }
    });

    return formatted.trim();
  };

  const handleMinify = () => {
    let result = '';
    switch (codeType) {
      case 'css':
        result = minifyCss(input);
        break;
      case 'js':
        result = minifyJs(input);
        break;
      case 'html':
        result = minifyHtml(input);
        break;
    }
    setOutput(result);
    setStats({
      original: new Blob([input]).size,
      minified: new Blob([result]).size,
    });
  };

  const handleBeautify = () => {
    let result = '';
    switch (codeType) {
      case 'css':
        result = beautifyCss(input);
        break;
      case 'js':
        result = beautifyJs(input);
        break;
      case 'html':
        result = beautifyHtml(input);
        break;
    }
    setOutput(result);
    setStats(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={codeType === 'css' ? 'primary' : 'secondary'}
          onClick={() => setCodeType('css')}
        >
          CSS
        </Button>
        <Button
          variant={codeType === 'js' ? 'primary' : 'secondary'}
          onClick={() => setCodeType('js')}
        >
          JavaScript
        </Button>
        <Button
          variant={codeType === 'html' ? 'primary' : 'secondary'}
          onClick={() => setCodeType('html')}
        >
          HTML
        </Button>
      </div>

      <Textarea
        label={`${codeType.toUpperCase()} Code`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          codeType === 'css'
            ? '.container {\n  display: flex;\n  padding: 20px;\n}'
            : codeType === 'js'
            ? 'function hello() {\n  console.log("Hello World");\n}'
            : '<div class="container">\n  <p>Hello World</p>\n</div>'
        }
        rows={10}
        className="font-mono text-sm"
      />

      <div className="flex gap-2">
        <Button onClick={handleMinify}>Minify</Button>
        <Button variant="secondary" onClick={handleBeautify}>
          Beautify
        </Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); setStats(null); }}>
          Clear
        </Button>
      </div>

      {stats && (
        <Card variant="bordered" className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Original</p>
              <p className="font-mono font-medium">{stats.original} bytes</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Minified</p>
              <p className="font-mono font-medium">{stats.minified} bytes</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Saved</p>
              <p className="font-mono font-medium text-green-600 dark:text-green-400">
                {Math.round((1 - stats.minified / stats.original) * 100)}%
              </p>
            </div>
          </div>
        </Card>
      )}

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Result
            </label>
            <CopyButton text={output} />
          </div>
          <Textarea value={output} readOnly rows={10} className="font-mono text-sm" />
        </div>
      )}

      <SeoContent />
    </div>
  );
}
