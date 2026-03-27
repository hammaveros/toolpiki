'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

export function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [encodeType, setEncodeType] = useState<'component' | 'full'>('component');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // URL 인코딩된 문자열인지 감지
  const isUrlEncoded = (str: string): boolean => {
    return /%[0-9A-Fa-f]{2}/.test(str);
  };

  // 자동 변환
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      try {
        if (mode === 'encode') {
          if (encodeType === 'component') {
            setOutput(encodeURIComponent(input));
          } else {
            setOutput(encodeURI(input));
          }
        } else {
          if (encodeType === 'component') {
            setOutput(decodeURIComponent(input));
          } else {
            setOutput(decodeURI(input));
          }
        }
      } catch {
        // 입력 중에는 에러 표시하지 않음
        setOutput('');
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, encodeType, mode]);

  const handleEncode = () => {
    setMode('encode');
    if (encodeType === 'component') {
      setOutput(encodeURIComponent(input));
    } else {
      setOutput(encodeURI(input));
    }
  };

  const handleDecode = () => {
    setMode('decode');
    try {
      if (encodeType === 'component') {
        setOutput(decodeURIComponent(input));
      } else {
        setOutput(decodeURI(input));
      }
    } catch {
      setOutput('❌ 유효하지 않은 URL 인코딩입니다.\n\n힌트: %XX 형식을 확인하세요. 예: %20(공백), %2F(/)');
    }
  };

  const handleExample = () => {
    setInput('안녕하세요! Hello World? param=value&name=테스트');
    setOutput('');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
  };

  return (
    <div className="space-y-3">
      {/* 입력 */}
      <div>
        <Textarea
          label="입력"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="인코딩하거나 디코딩할 텍스트를 입력하세요..."
          rows={5}
        />
      </div>

      {/* 인코딩 타입 선택 */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="encodeType"
            checked={encodeType === 'component'}
            onChange={() => setEncodeType('component')}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            encodeURIComponent (권장)
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="encodeType"
            checked={encodeType === 'full'}
            onChange={() => setEncodeType('full')}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            encodeURI (전체 URL)
          </span>
        </label>
      </div>

      {/* 버튼 */}
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={handleEncode}>
          인코딩
        </Button>
        <Button variant="secondary" onClick={handleDecode}>
          디코딩
        </Button>
        <Button variant="secondary" onClick={handleExample}>
          예시 입력
        </Button>
        {output && (
          <Button variant="ghost" onClick={handleSwap}>
            ↕ 입력/출력 교체
          </Button>
        )}
      </div>

      {/* 출력 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            결과
          </label>
          {output && <CopyButton text={output} />}
        </div>
        <Textarea
          value={output}
          readOnly
          placeholder="결과가 여기에 표시됩니다."
          rows={5}
          className="bg-gray-50 dark:bg-gray-800/50 font-mono"
        />
      </div>

      {/* 도움말 */}
      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>
          • <strong>encodeURIComponent</strong>: 쿼리 파라미터 값 인코딩에 적합
        </p>
        <p>
          • <strong>encodeURI</strong>: 전체 URL 인코딩 (:/? 등 보존)
        </p>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔗 URL 인코딩이란?</h2>
        <p className="text-sm leading-relaxed">
          URL 인코딩(Percent-encoding)은 URL에서 사용할 수 없는 문자를 %XX 형식으로 변환하는 표준 방식입니다.
          한글, 공백, 특수문자 등이 포함된 URL을 안전하게 전송하기 위해 사용됩니다.
          RFC 3986 표준에 따라 예약 문자와 비ASCII 문자를 UTF-8 바이트 시퀀스로 변환한 후
          각 바이트를 %HH 형식으로 표현합니다. 웹 개발에서 가장 기본적인 인코딩 방식 중 하나입니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⚙️ encodeURI vs encodeURIComponent</h2>
        <div className="text-sm space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">encodeURIComponent (권장)</h3>
            <p>쿼리 파라미터 값을 인코딩할 때 사용합니다. =, &amp;, ?, /, : 등 URL 구분자까지 모두 인코딩하므로 파라미터 값에 특수문자가 포함되어도 안전합니다.</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded mt-1 inline-block">?name=encodeURIComponent("홍길동&친구")</code>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">encodeURI (전체 URL)</h3>
            <p>전체 URL을 인코딩할 때 사용합니다. :, /, ?, #, & 등 URL 구조에 필요한 문자는 보존하고 나머지만 인코딩합니다.</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded mt-1 inline-block">encodeURI("https://example.com/검색?q=테스트")</code>
          </div>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: 'URL 인코딩은 왜 필요한가요?', answer: 'URL은 ASCII 문자만 허용합니다. 한글, 공백, 특수문자를 URL에 포함하려면 %XX 형식으로 변환해야 브라우저와 서버가 올바르게 해석할 수 있습니다.' },
          { question: '공백은 +로 인코딩되나요, %20으로 인코딩되나요?', answer: 'encodeURIComponent는 공백을 %20으로 인코딩합니다. +는 application/x-www-form-urlencoded 형식(HTML 폼)에서만 사용됩니다.' },
          { question: '한글 URL이 깨져 보이는 이유는?', answer: '한글은 UTF-8로 인코딩되면 한 글자당 3바이트(%XX%XX%XX)로 변환됩니다. 예를 들어 "가"는 %EA%B0%80이 됩니다.' },
        ]}
      />
    </div>
  );
}
