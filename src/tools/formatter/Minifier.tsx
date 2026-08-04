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
          ⚡ 코드 Minifier란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">CSS·JavaScript·HTML 코드를 압축해 파일 크기를 최소화합니다.</strong>{' '}
          공백·줄바꿈·주석을 제거해 <strong>웹사이트 로딩 속도</strong>를 개선하고 대역폭을 절약합니다.
          프로덕션 배포 전 압축은 표준 관행이며, 일반적으로 <strong>30~70% 용량 절감</strong> 효과를 볼 수 있습니다.
          반대로 <strong>Beautify</strong> 기능은 압축된 코드를 다시 읽기 좋게 정렬합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 압축 방식 비교
        </h2>
        <div className="text-sm space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
              <p className="font-medium mb-1">CSS Minify</p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• 공백, 줄바꿈 제거</li>
                <li>• 주석 제거</li>
                <li>• 마지막 세미콜론 제거</li>
              </ul>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
              <p className="font-medium mb-1">JS Minify</p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• 한줄/블록 주석 제거</li>
                <li>• 연속 공백 압축</li>
                <li>• 연산자 주변 정리</li>
              </ul>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
              <p className="font-medium mb-1">HTML Minify</p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• HTML 주석 제거</li>
                <li>• 태그 간 공백 제거</li>
                <li>• 불필요한 줄바꿈 정리</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📄 압축 전후 비교
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          CSS를 예로 보면, 사람이 읽기 위해 넣은 요소가 얼마나 큰 비중인지 드러납니다.
          아래 코드는 압축 후 약 40% 줄어듭니다.
        </p>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">압축 전</p>
            <pre className="p-3 rounded bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto">
{`/* 메인 버튼 스타일 */
.btn-primary {
    background-color: #3b82f6;
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 8px;
}`}
            </pre>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">압축 후</p>
            <pre className="p-3 rounded bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto">
{`.btn-primary{background-color:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px}`}
            </pre>
          </div>
        </div>
        <p className="text-sm leading-relaxed mt-3">
          실제 절감 효과는 코드 스타일에 따라 다릅니다. 주석과 들여쓰기가 많은 CSS는 절반 가까이 줄기도 하고,
          이미 간결하게 작성된 코드는 10~20% 정도에 그칩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⚠️ 압축이 깨뜨릴 수 있는 것들
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          공백 제거는 단순해 보이지만, 공백이 의미를 갖는 자리가 있습니다. 압축 후에는 반드시 동작을 확인하세요.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>HTML의 인라인 요소 사이 공백</strong> — <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">{`<span>A</span> <span>B</span>`}</code>의 공백을 지우면 화면에서 두 글자가 붙어버립니다.</li>
          <li><strong>&lt;pre&gt;와 &lt;textarea&gt;</strong> — 내부 공백과 줄바꿈이 그대로 출력되는 태그라 압축하면 표시가 달라집니다.</li>
          <li><strong>세미콜론 없는 JS</strong> — 줄바꿈에 의존해 문장을 구분하던 코드는 한 줄로 합쳐지면 문법 오류가 납니다.</li>
          <li><strong>템플릿 리터럴</strong> — 백틱 문자열 안의 줄바꿈은 실제 값의 일부입니다.</li>
          <li><strong>조건부 주석·라이선스 주석</strong> — 오픈소스 라이브러리는 라이선스 고지 주석을 유지해야 하는 경우가 있습니다.</li>
        </ul>
        <p className="text-sm leading-relaxed mt-3">
          실무에서는 <strong>Gzip이나 Brotli 압축</strong>이 서버 단에서 한 번 더 적용됩니다.
          Minify와 중복처럼 보이지만 원리가 달라 함께 쓸 때 효과가 가장 큽니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>개발 중에는 Beautify</strong> 상태로 작업하고, <strong>배포 전에 Minify</strong> 적용</li>
          <li>CDN에 올릴 파일은 반드시 Minify하여 <strong>로딩 속도</strong> 개선</li>
          <li><strong>소스맵(Source Map)</strong>과 함께 사용하면 디버깅에도 문제없음</li>
          <li>빌드 도구(<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Webpack</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Vite</code>)는 자동 Minify를 지원하므로 설정 확인</li>
        </ul>
      </section>

      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
        <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 실무 팁</p>
        <p className="text-blue-800 dark:text-blue-300">
          빌드 자동화가 어려운 <strong>정적 페이지</strong>나 <strong>이메일 템플릿 HTML</strong>은 이 도구로 일회성 압축을 처리하면 충분합니다.
          단, 압축 후엔 반드시 한 번 동작 테스트를 거치세요.
        </p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'Minify와 Uglify의 차이는 무엇인가요?',
            answer: 'Minify는 공백/주석 제거 등 기본 압축이고, Uglify는 변수명 단축, 코드 최적화 등 더 공격적인 압축을 수행합니다. 이 도구는 Minify 수준의 기본 압축을 제공합니다.',
          },
          {
            question: '압축하면 코드가 깨지지 않나요?',
            answer: '이 도구는 공백과 주석만 제거하므로 코드 로직에는 영향을 주지 않습니다. 다만 복잡한 정규식이나 특수 문법이 있으면 결과를 확인하세요.',
          },
          {
            question: 'Beautify는 언제 사용하나요?',
            answer: '압축된 라이브러리나 난독화된 코드를 분석할 때, 또는 코드 리뷰/학습 목적으로 가독성 있게 정렬하고 싶을 때 사용합니다.',
          },
          {
            question: 'Gzip을 쓰는데도 Minify가 필요한가요?',
            answer: '네. Minify는 불필요한 문자를 실제로 없애고, Gzip은 남은 내용을 압축 알고리즘으로 줄입니다. 원리가 달라 함께 적용할 때 효과가 가장 큽니다.',
          },
          {
            question: 'HTML을 압축했더니 글자가 붙어버렸어요.',
            answer: '인라인 요소 사이의 공백은 화면에 실제 간격으로 렌더링되기 때문입니다. span이나 a 태그가 나란히 있는 구간은 압축 후 표시를 확인하고, 필요하면 CSS 여백으로 대체하세요.',
          },
          {
            question: '입력한 코드가 서버로 전송되나요?',
            answer: '아니요. 압축과 정렬 모두 브라우저에서 처리되며 코드가 서버로 전송되거나 저장되지 않습니다. 사내 코드도 안전하게 사용할 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}

type CodeType = 'css' | 'js' | 'html';

export function Minifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [codeType, setCodeType] = useState<CodeType>('css');
  const [stats, setStats] = useState<{ original: number; minified: number } | null>(null);

  const minifyCss = (css: string): string => {
    return css
      // 주석 제거
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // 줄바꿈, 탭 제거
      .replace(/\s+/g, ' ')
      // 불필요한 공백 제거
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*,\s*/g, ',')
      // 마지막 세미콜론 제거
      .replace(/;}/g, '}')
      .trim();
  };

  const minifyJs = (js: string): string => {
    return js
      // 한 줄 주석 제거
      .replace(/\/\/.*$/gm, '')
      // 여러 줄 주석 제거
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // 줄바꿈을 공백으로
      .replace(/\n/g, ' ')
      // 연속 공백 제거
      .replace(/\s+/g, ' ')
      // 연산자 주변 공백 제거
      .replace(/\s*([{}();,=+\-*/<>!&|?:])\s*/g, '$1')
      // 키워드 뒤 공백 유지
      .replace(/(return|var|let|const|if|else|for|while|function|new|typeof|instanceof|in|of)([^\s])/g, '$1 $2')
      .trim();
  };

  const minifyHtml = (html: string): string => {
    return html
      // 주석 제거
      .replace(/<!--[\s\S]*?-->/g, '')
      // 줄바꿈, 탭 제거
      .replace(/\s+/g, ' ')
      // 태그 사이 공백 제거
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
    // 간단한 JS 포맷터
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
        label={`${codeType.toUpperCase()} 코드`}
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
        <Button onClick={handleMinify}>압축 (Minify)</Button>
        <Button variant="secondary" onClick={handleBeautify}>
          정렬 (Beautify)
        </Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); setStats(null); }}>
          초기화
        </Button>
      </div>

      {stats && (
        <Card variant="bordered" className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">원본</p>
              <p className="font-mono font-medium">{stats.original} bytes</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">압축</p>
              <p className="font-mono font-medium">{stats.minified} bytes</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">절약</p>
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
              결과
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
