'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

type OutputFormat = 'decimal' | 'hex' | 'binary';

export function AsciiConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'text-to-ascii' | 'ascii-to-text'>('text-to-ascii');
  const [format, setFormat] = useState<OutputFormat>('decimal');

  const textToAscii = (text: string, fmt: OutputFormat): string => {
    return text
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0);
        switch (fmt) {
          case 'decimal':
            return code.toString();
          case 'hex':
            return '0x' + code.toString(16).toUpperCase();
          case 'binary':
            return code.toString(2).padStart(8, '0');
        }
      })
      .join(' ');
  };

  const asciiToText = (ascii: string, fmt: OutputFormat): string => {
    try {
      const codes = ascii.trim().split(/\s+/);
      return codes
        .map((code) => {
          let num: number;
          switch (fmt) {
            case 'decimal':
              num = parseInt(code, 10);
              break;
            case 'hex':
              num = parseInt(code.replace('0x', ''), 16);
              break;
            case 'binary':
              num = parseInt(code, 2);
              break;
          }
          return String.fromCharCode(num);
        })
        .join('');
    } catch {
      return '변환 오류: 올바른 형식이 아닙니다.';
    }
  };

  const handleConvert = () => {
    if (mode === 'text-to-ascii') {
      setOutput(textToAscii(input, format));
    } else {
      setOutput(asciiToText(input, format));
    }
  };

  const handleSwap = () => {
    setMode(mode === 'text-to-ascii' ? 'ascii-to-text' : 'text-to-ascii');
    setInput(output);
    setOutput('');
  };

  const placeholders: Record<string, Record<OutputFormat, string>> = {
    'text-to-ascii': {
      decimal: 'Hello',
      hex: 'Hello',
      binary: 'Hello',
    },
    'ascii-to-text': {
      decimal: '72 101 108 108 111',
      hex: '0x48 0x65 0x6C 0x6C 0x6F',
      binary: '01001000 01100101 01101100 01101100 01101111',
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={mode === 'text-to-ascii' ? 'primary' : 'secondary'}
          onClick={() => setMode('text-to-ascii')}
        >
          텍스트 → ASCII
        </Button>
        <Button
          variant={mode === 'ascii-to-text' ? 'primary' : 'secondary'}
          onClick={() => setMode('ascii-to-text')}
        >
          ASCII → 텍스트
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <label className="text-sm text-gray-600 dark:text-gray-400 self-center">출력 형식:</label>
        <Button
          variant={format === 'decimal' ? 'primary' : 'secondary'}
          onClick={() => setFormat('decimal')}
          size="sm"
        >
          10진수
        </Button>
        <Button
          variant={format === 'hex' ? 'primary' : 'secondary'}
          onClick={() => setFormat('hex')}
          size="sm"
        >
          16진수
        </Button>
        <Button
          variant={format === 'binary' ? 'primary' : 'secondary'}
          onClick={() => setFormat('binary')}
          size="sm"
        >
          2진수
        </Button>
      </div>

      <Textarea
        label={mode === 'text-to-ascii' ? '텍스트' : 'ASCII 코드'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholders[mode][format]}
        rows={5}
      />

      <div className="flex gap-2">
        <Button onClick={handleConvert}>변환</Button>
        <Button variant="secondary" onClick={handleSwap}>
          ↔ 모드 전환
        </Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); }}>
          초기화
        </Button>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              결과
            </label>
            <CopyButton text={output} />
          </div>
          <Textarea value={output} readOnly rows={5} className="font-mono" />
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          주요 ASCII 코드
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div>A = 65</div>
          <div>Z = 90</div>
          <div>a = 97</div>
          <div>z = 122</div>
          <div>0 = 48</div>
          <div>9 = 57</div>
          <div>Space = 32</div>
          <div>Enter = 13</div>
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💻 ASCII 변환기란?</h2>
        <p className="text-sm leading-relaxed">
          ASCII(American Standard Code for Information Interchange)는 영문 알파벳, 숫자, 특수문자를
          7비트(0~127) 숫자 코드로 표현하는 문자 인코딩 표준입니다. 1963년에 제정되어
          컴퓨터 통신의 기반이 되었으며, 현재도 UTF-8 등 현대 인코딩의 기본 호환 영역입니다.
          이 도구는 텍스트와 ASCII 코드를 10진수, 16진수, 2진수 형식으로 상호 변환합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📊 ASCII 코드 구조</h2>
        <div className="text-sm space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>0-31</strong>: 제어 문자 (줄바꿈, 탭 등)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>32-47</strong>: 특수문자 (공백, !, ", # 등)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>48-57</strong>: 숫자 (0-9)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>65-90</strong>: 대문자 (A-Z)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>97-122</strong>: 소문자 (a-z)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>127</strong>: DEL (삭제 제어문자)</div>
          </div>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: 'ASCII와 유니코드의 차이는 무엇인가요?', answer: 'ASCII는 128개 문자(영문, 숫자, 특수문자)만 표현합니다. 유니코드는 전 세계 모든 문자를 포함하며, ASCII의 0-127 범위를 그대로 포함합니다.' },
          { question: '한글도 ASCII로 변환할 수 있나요?', answer: '한글은 ASCII 범위에 포함되지 않습니다. 한글 변환은 유니코드 변환기나 UTF-8 변환기를 사용하세요.' },
          { question: '10진수, 16진수, 2진수 중 어떤 형식을 사용해야 하나요?', answer: '일반적으로 10진수가 가장 읽기 쉽습니다. 16진수는 메모리 주소나 색상 코드에, 2진수는 비트 연산이나 네트워크 프로토콜 분석에 주로 사용됩니다.' },
        ]}
      />
    </div>
  );
}
