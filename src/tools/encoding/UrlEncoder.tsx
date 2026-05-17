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
          URL 인코딩(Percent-encoding)은 1994년 RFC 1738에서 처음 규정되고 2005년 RFC 3986으로 정비된 표준으로, URL이 허용하는 안전한 ASCII 문자 외의 모든 문자를 <code>%XX</code> 형식으로 바꿉니다.
          내부적으로는 입력을 UTF-8 바이트로 만들고, 각 바이트를 2자리 16진수로 표현하기 때문에 한글 한 글자(3바이트)는 <code>%XX%XX%XX</code>처럼 9문자로 늘어납니다.
          공백을 비롯해 <code>?</code>, <code>#</code>, <code>&amp;</code>, <code>=</code>처럼 URL 구조에 의미가 있는 글자가 파라미터 값 안에 들어가야 할 때 반드시 거쳐야 하는 변환입니다.
          잘못 처리하면 GET 요청이 의도와 다른 키-값 쌍으로 파싱되어 버그를 일으키므로, 쿼리스트링을 직접 조립할 때는 거의 항상 인코딩이 필요합니다.
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

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⚡ 실수하기 쉬운 포인트 3가지</h2>
        <p className="text-sm leading-relaxed">
          첫째, <strong>&amp;를 인코딩하지 않은 경우</strong>입니다. 검색어에 &amp;가 들어가면 그 뒤가 다른 파라미터로 잘려나가서 검색이 이상하게 동작합니다. 파라미터 값에는 항상 <code>encodeURIComponent</code>를 쓰세요.
          둘째, <strong>이미 인코딩된 값을 또 인코딩</strong>하는 경우입니다. <code>%20</code>이 <code>%2520</code>이 되어 서버는 공백 대신 &quot;%20&quot; 문자열을 받게 됩니다. <code>fetch</code>나 <code>URL</code> 객체로 만든 URL을 다시 인코딩하지 마세요.
          셋째, <strong>+ 기호 처리</strong>입니다. 쿼리스트링에서 +는 RFC 3986엔 없지만 폼 인코딩 관습으로 공백을 의미합니다. <code>encodeURIComponent</code>는 +를 그대로 두므로, 사용자가 입력한 진짜 +를 보존하려면 추가로 <code>%2B</code>로 치환해야 합니다.
        </p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: 'URL 인코딩은 왜 필요한가요?', answer: 'URL은 RFC 3986이 정의한 안전한 ASCII 문자만 그대로 받습니다. 한글, 공백, &amp;, =, # 같은 문자는 별도 의미를 가지거나 허용되지 않아 %XX 형식으로 바꿔야 브라우저와 서버가 같은 값으로 해석합니다.' },
          { question: '공백은 +인가요, %20인가요?', answer: '둘 다 통할 때가 많지만 의미가 다릅니다. URL 경로와 쿼리에서는 %20이 정식이며 encodeURIComponent도 %20을 사용합니다. +는 application/x-www-form-urlencoded(HTML 폼 전송)에서만 공백을 뜻하므로 둘을 섞어 쓰면 디코딩이 어긋날 수 있습니다.' },
          { question: '한글 URL이 깨져 보이는 이유는?', answer: '한글은 UTF-8로 한 글자당 3바이트라 인코딩하면 %XX%XX%XX 9문자로 늘어납니다. 예: &quot;가&quot;는 %EA%B0%80. 표시는 길어도 표준이며, 카카오톡이나 슬랙처럼 URL 미리보기를 만드는 서비스는 보통 자동으로 다시 디코딩해 사람이 읽을 수 있게 보여줍니다.' },
        ]}
      />
    </div>
  );
}
