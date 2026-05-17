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
          <strong className="text-gray-900 dark:text-white">ASCII는 0~127 사이 정수에 영문 알파벳·숫자·기호를 매핑한 7비트 문자 코드입니다.</strong>{' '}
          <strong>1963년 ANSI X3.4 위원회가 표준화</strong>한 가장 오래된 텍스트 인코딩 중 하나로, 전신용 텔레타이프에서 출발한 만큼 0~31에 제어 코드가 들어 있어 지금도 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">\n</code>(LF, 10), <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">\r</code>(CR, 13), <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">\t</code>(TAB, 9) 같은 형태로 그 흔적이 남아 있습니다.
          이 도구는 문자열을 <strong>10진수, 16진수, 2진수 세 가지 표기</strong>로 보여주거나, 반대로 코드 시퀀스를 다시 텍스트로 복원합니다.
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

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🧠 외워두면 편한 ASCII 트릭</h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc pl-5">
          <li><strong>대소문자 변환은 32 차이</strong>: &apos;A&apos;(65)와 &apos;a&apos;(97)의 거리는 32. 비트 단위로는 6번째 비트만 다르므로 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">code ^ 0x20</code> 한 줄로 대소문자를 뒤집을 수 있습니다.</li>
          <li><strong>숫자 문자를 정수로</strong>: <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">&apos;9&apos; - &apos;0&apos; = 9</code>처럼 ASCII 코드 차이로 자릿수를 뽑아냅니다. <strong>atoi 구현의 핵심 트릭</strong>입니다.</li>
          <li><strong>알파벳인지 검사</strong>: 65~90 또는 97~122 범위 검사로 한 줄에 끝납니다. <strong>정규식보다 훨씬 빠르고</strong>, 임베디드 환경에서 자주 보입니다.</li>
          <li><strong>HTTP 헤더 파싱</strong>: <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">:</code>(58), 공백(32), <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">\r\n</code>(13, 10) 같은 구분자가 모두 ASCII이므로 <strong>바이트 단위 파서</strong>가 가능합니다.</li>
        </ul>
      </section>

      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
        <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 알아두면 좋은 점</p>
        <p className="text-blue-800 dark:text-blue-300"><strong>유니코드의 첫 128자는 ASCII와 그대로 같습니다.</strong> 영문만 다룬다면 두 표 차이를 거의 느끼지 않습니다. 한글·이모지처럼 그 너머의 문자가 등장할 때만 <strong>UTF-8 같은 별도 인코딩</strong>이 필요합니다.</p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: 'ASCII와 유니코드의 차이는?', answer: 'ASCII는 128개의 문자만 다루는 7비트 표인 반면, 유니코드는 15만 자 이상을 포괄하는 거대한 카탈로그입니다. 다만 유니코드의 첫 128자는 ASCII와 그대로 같아서 영문만 다룬다면 두 표 차이를 거의 느끼지 않습니다. 한글, 이모지처럼 그 너머의 문자가 등장할 때만 UTF-8 같은 별도 인코딩이 필요합니다.' },
          { question: '한글도 ASCII로 변환할 수 있나요?', answer: '엄밀히 말해 불가능합니다. ASCII 범위(0~127) 안에 한글이 없기 때문이며, 이 도구로 한글을 입력하면 자바스크립트 내부의 UTF-16 코드 유닛 값(예: &quot;가&quot; → 44032)이 출력됩니다. 한글에 맞는 표현이 필요하면 사이드바의 유니코드 변환기를 사용하세요.' },
          { question: '10진수·16진수·2진수, 어느 걸 써야 하나요?', answer: '사람이 읽기엔 10진수가 가장 자연스럽고, 메모리 덤프나 네트워크 패킷 분석에는 16진수가 표준입니다. 2진수는 비트 마스크나 권한 플래그(예: 755의 8진수 표기)처럼 비트 단위 의미를 강조해야 할 때 가독성이 좋습니다.' },
        ]}
      />
    </div>
  );
}
