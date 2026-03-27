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
          유니코드(Unicode)는 전 세계 모든 문자를 하나의 문자 집합으로 표현하는 국제 표준입니다.
          각 문자에 고유 코드 포인트(U+XXXX)가 할당되어 있으며, 현재 15만 자 이상을 지원합니다.
          이 도구는 텍스트를 유니코드 이스케이프(\uXXXX) 형식이나 UTF-8 바이트(HEX)로 변환합니다.
          JSON, JavaScript 소스 코드에서 한글 등 비ASCII 문자를 안전하게 표현할 때 유용합니다.
        </p>
      </section>

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
          { question: '유니코드와 UTF-8의 차이는 무엇인가요?', answer: '유니코드는 문자 집합(어떤 문자에 어떤 번호를 부여할지)이고, UTF-8은 인코딩 방식(그 번호를 바이트로 어떻게 저장할지)입니다. UTF-8은 유니코드를 저장하는 가장 널리 쓰이는 방법입니다.' },
          { question: '\\uXXXX 형식은 어디서 사용하나요?', answer: 'JavaScript 문자열, JSON 파일에서 비ASCII 문자를 표현할 때 사용합니다. \\u로 시작하는 4자리 16진수 코드로 모든 BMP(기본 다국어 평면) 문자를 표현할 수 있습니다.' },
          { question: '한글은 유니코드에서 몇 바이트인가요?', answer: 'UTF-8로 인코딩 시 한글 한 글자는 3바이트입니다. UTF-16에서는 2바이트, 유니코드 코드 포인트는 U+AC00~U+D7A3 범위입니다.' },
        ]}
      />
    </div>
  );
}
