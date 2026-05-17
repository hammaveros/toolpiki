'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

type ConversionMode = 'text-to-unicode' | 'unicode-to-text' | 'text-to-utf8' | 'utf8-to-text';

export function UnicodeConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<ConversionMode>('text-to-unicode');

  const textToUnicode = (text: string): string => {
    return text
      .split('')
      .map((char) => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0'))
      .join('');
  };

  const unicodeToText = (unicode: string): string => {
    try {
      return unicode.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      );
    } catch {
      return '변환 오류: 올바른 유니코드 형식이 아닙니다.';
    }
  };

  const textToUtf8 = (text: string): string => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');
  };

  const utf8ToText = (hex: string): string => {
    try {
      const bytes = hex
        .trim()
        .split(/\s+/)
        .map((h) => parseInt(h, 16));
      const decoder = new TextDecoder();
      return decoder.decode(new Uint8Array(bytes));
    } catch {
      return '변환 오류: 올바른 UTF-8 형식이 아닙니다.';
    }
  };

  const handleConvert = () => {
    switch (mode) {
      case 'text-to-unicode':
        setOutput(textToUnicode(input));
        break;
      case 'unicode-to-text':
        setOutput(unicodeToText(input));
        break;
      case 'text-to-utf8':
        setOutput(textToUtf8(input));
        break;
      case 'utf8-to-text':
        setOutput(utf8ToText(input));
        break;
    }
  };

  const modeLabels: Record<ConversionMode, { input: string; output: string; placeholder: string }> = {
    'text-to-unicode': {
      input: '텍스트',
      output: 'Unicode',
      placeholder: '안녕하세요',
    },
    'unicode-to-text': {
      input: 'Unicode',
      output: '텍스트',
      placeholder: '\\uc548\\ub155\\ud558\\uc138\\uc694',
    },
    'text-to-utf8': {
      input: '텍스트',
      output: 'UTF-8 (HEX)',
      placeholder: '안녕하세요',
    },
    'utf8-to-text': {
      input: 'UTF-8 (HEX)',
      output: '텍스트',
      placeholder: 'EC 95 88 EB 85 95',
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={mode === 'text-to-unicode' ? 'primary' : 'secondary'}
          onClick={() => setMode('text-to-unicode')}
          size="sm"
        >
          텍스트 → Unicode
        </Button>
        <Button
          variant={mode === 'unicode-to-text' ? 'primary' : 'secondary'}
          onClick={() => setMode('unicode-to-text')}
          size="sm"
        >
          Unicode → 텍스트
        </Button>
        <Button
          variant={mode === 'text-to-utf8' ? 'primary' : 'secondary'}
          onClick={() => setMode('text-to-utf8')}
          size="sm"
        >
          텍스트 → UTF-8
        </Button>
        <Button
          variant={mode === 'utf8-to-text' ? 'primary' : 'secondary'}
          onClick={() => setMode('utf8-to-text')}
          size="sm"
        >
          UTF-8 → 텍스트
        </Button>
      </div>

      <Textarea
        label={modeLabels[mode].input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={modeLabels[mode].placeholder}
        rows={5}
      />

      <div className="flex gap-2">
        <Button onClick={handleConvert}>변환</Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); }}>
          초기화
        </Button>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {modeLabels[mode].output}
            </label>
            <CopyButton text={output} />
          </div>
          <Textarea value={output} readOnly rows={5} />
        </div>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🌐 유니코드 변환기란?</h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">유니코드는 모든 문자에 고유 번호(코드 포인트)를 부여하는 표준입니다.</strong>{' '}
          1991년 1.0 발표 이후 매년 확장되어 <strong>2024년 기준 15만 자 이상</strong>의 문자에 U+XXXX 형식의 번호가 매겨져 있습니다.
          이 도구는 그 번호를 두 가지 형태로 보여줍니다: JavaScript와 JSON에서 사용하는 <strong><code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">\uXXXX</code> 이스케이프 표기</strong>, 그리고 실제 파일이나 네트워크에 흘러가는 <strong>UTF-8 바이트(HEX)</strong>입니다.
          한글 &quot;가&quot;를 예로 들면 코드 포인트는 <strong>U+AC00</strong>, UTF-8 바이트로는 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">EA B0 80</code>입니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💡 자주 깨지는 상황과 해결법</h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong className="text-gray-900 dark:text-white">한글이 &quot;ê°€&quot; 비슷한 글자로 보임</strong> — UTF-8 바이트가 Latin-1로 잘못 해석되는 경우. <strong>DB 컬럼 캐릭터셋, HTTP Content-Type charset, 파일 BOM</strong> 셋 중 하나가 어긋났을 가능성이 큽니다.</li>
          <li><strong className="text-gray-900 dark:text-white">물음표(?)나 □로 보임</strong> — 폰트 문제가 아니라 <strong>인코딩 변환 중 손실</strong>됐을 가능성이 높습니다.</li>
          <li><strong className="text-gray-900 dark:text-white">이모지 처리</strong> — BMP(U+0000~U+FFFF) 밖의 문자는 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">\uXXXX</code> 한 번으로 표현할 수 없고 <strong>서러게이트 페어</strong>로 분리되거나 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">\u&#123;1F600&#125;</code> 형식(ES6+)으로 적어야 합니다.</li>
        </ul>
      </section>

      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
        <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 알아두면 좋은 점</p>
        <p className="text-blue-800 dark:text-blue-300"><strong>유니코드와 UTF-8은 다른 개념</strong>입니다. 유니코드는 &quot;번호표&quot;, UTF-8은 &quot;그 번호를 바이트로 저장하는 방법&quot;. UTF-8은 ASCII와 호환되며 영어 1바이트, 한글 3바이트, 이모지 4바이트로 가변 길이입니다.</p>
      </div>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 변환 모드 안내</h2>
        <div className="text-sm space-y-2">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">텍스트 → Unicode (\uXXXX)</h3>
            <p>각 문자를 \u + 4자리 16진수로 변환합니다. JavaScript, JSON에서 사용합니다. 예: "가" → \uac00</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">텍스트 → UTF-8 (HEX)</h3>
            <p>텍스트를 UTF-8로 인코딩한 바이트 값을 16진수로 표시합니다. 네트워크 디버깅에 유용합니다. 예: "가" → EA B0 80</p>
          </div>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '유니코드와 UTF-8의 차이는?', answer: '유니코드는 어떤 문자에 어떤 번호를 줄지 정한 문자 집합이고, UTF-8은 그 번호를 바이트로 저장하는 방법 중 하나입니다. UTF-8은 ASCII와 호환되며 영어 1바이트, 한글 3바이트, 이모지 4바이트로 가변 길이입니다. 웹 표준이 사실상 UTF-8로 통일되어 있습니다.' },
          { question: '\\uXXXX는 어디서 사용하나요?', answer: 'JavaScript 소스 코드 안의 문자열, JSON 파일에서 비ASCII 문자를 안전하게 표현할 때 사용합니다. 예전 환경에서 UTF-8 파일 인코딩이 보장되지 않을 때 특히 유용하며, 외부 시스템과 파일을 주고받을 때 깨짐 방지용으로도 쓰입니다.' },
          { question: '한글은 몇 바이트인가요?', answer: '코드 포인트는 U+AC00~U+D7A3 영역에 있는 11,172자이며 UTF-8 인코딩 시 한 글자당 3바이트, UTF-16 인코딩 시 2바이트입니다. 옛한글 자모(U+1100~)나 호환 자모(U+3130~)는 별도 영역에 있어 합성 방식에 따라 바이트 수가 달라질 수 있습니다.' },
        ]}
      />
    </div>
  );
}
