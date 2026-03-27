'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

export function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Base64 문자열인지 감지
  const isBase64 = (str: string): boolean => {
    if (!str || str.length < 4) return false;
    // Base64 패턴: A-Z, a-z, 0-9, +, /, = 만 포함
    const base64Regex = /^[A-Za-z0-9+/]+=*$/;
    return base64Regex.test(str.replace(/\s/g, ''));
  };

  // 자동 변환
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      try {
        if (mode === 'encode') {
          const encoded = btoa(
            encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
              String.fromCharCode(parseInt(p1, 16))
            )
          );
          setOutput(encoded);
          setError('');
        } else {
          const decoded = decodeURIComponent(
            Array.prototype.map
              .call(atob(input.replace(/\s/g, '')), (c: string) =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
              )
              .join('')
          );
          setOutput(decoded);
          setError('');
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
  }, [input, mode]);

  const handleEncode = () => {
    setError('');
    try {
      // UTF-8 지원 인코딩
      const encoded = btoa(
        encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
      setOutput(encoded);
      setMode('encode');
    } catch {
      setError('인코딩에 실패했습니다.');
    }
  };

  const handleDecode = () => {
    setError('');
    try {
      // UTF-8 지원 디코딩
      const decoded = decodeURIComponent(
        Array.prototype.map
          .call(atob(input), (c: string) =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          )
          .join('')
      );
      setOutput(decoded);
      setMode('decode');
    } catch {
      setError('유효한 Base64 문자열이 아닙니다. A-Z, a-z, 0-9, +, /, = 문자만 사용되어야 합니다.');
    }
  };

  const handleExample = () => {
    if (mode === 'encode') {
      setInput('안녕하세요! Hello, World!');
    } else {
      setInput('7JWI64WV7ZWY7IS47JqUISBIZWxsbywgV29ybGQh');
    }
    setOutput('');
    setError('');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-2">
      {/* 입력 */}
      <div>
        <Textarea
          label={mode === 'encode' ? '인코딩할 텍스트' : '디코딩할 Base64'}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError('');
          }}
          placeholder={
            mode === 'encode'
              ? '인코딩할 텍스트를 입력하세요...'
              : 'Base64 문자열을 입력하세요...'
          }
          rows={6}
          error={error}
        />
      </div>

      {/* 버튼 */}
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={handleEncode}>
          인코딩 (텍스트 → Base64)
        </Button>
        <Button variant="secondary" onClick={handleDecode}>
          디코딩 (Base64 → 텍스트)
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
            결과 {mode === 'encode' ? '(Base64)' : '(텍스트)'}
          </label>
          {output && <CopyButton text={output} />}
        </div>
        <Textarea
          value={output}
          readOnly
          placeholder="결과가 여기에 표시됩니다."
          rows={6}
          className="bg-gray-50 dark:bg-gray-800/50 font-mono"
        />
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔐 Base64 인코딩이란?</h2>
        <p className="text-sm leading-relaxed">
          Base64는 바이너리 데이터를 64개의 ASCII 문자(A-Z, a-z, 0-9, +, /)로 변환하는 인코딩 방식입니다.
          이메일 시스템(MIME), HTML의 Data URL, REST API 통신 등 텍스트만 허용되는 환경에서
          이미지, 파일, 바이너리 데이터를 안전하게 전송할 때 사용됩니다.
          원본 데이터보다 약 33% 크기가 증가하지만, 데이터 무결성을 보장합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 Base64 활용 사례</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">이메일 첨부파일</h3>
            <p>MIME 표준에서 첨부파일을 Base64로 인코딩하여 전송합니다. 이메일 프로토콜이 7bit ASCII만 지원하기 때문입니다.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">Data URL (인라인 이미지)</h3>
            <p>CSS나 HTML에서 data:image/png;base64,... 형식으로 이미지를 직접 삽입할 수 있습니다.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">JWT 토큰</h3>
            <p>JSON Web Token의 Header와 Payload가 Base64url로 인코딩됩니다.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">API 인증</h3>
            <p>HTTP Basic Auth에서 username:password를 Base64로 인코딩하여 전송합니다.</p>
          </div>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: 'Base64는 암호화인가요?', answer: 'Base64는 암호화가 아닌 인코딩입니다. 누구나 쉽게 디코딩할 수 있으므로 비밀번호나 민감한 정보를 Base64로만 보호하면 안 됩니다.' },
          { question: 'Base64로 인코딩하면 크기가 얼마나 커지나요?', answer: '원본 데이터 대비 약 33% 증가합니다. 3바이트의 원본 데이터가 4개의 Base64 문자로 변환되기 때문입니다.' },
          { question: 'Base64와 Base64url의 차이는 무엇인가요?', answer: 'Base64url은 URL에서 안전하게 사용할 수 있도록 +를 -로, /를 _로 대체하고 패딩(=)을 생략합니다. JWT에서 주로 사용됩니다.' },
        ]}
      />
    </div>
  );
}
