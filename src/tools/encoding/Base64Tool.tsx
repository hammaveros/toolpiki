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
          Base64는 1987년 RFC 1421 초안에 처음 등장한 이후 PEM, MIME(RFC 2045)을 거쳐 지금까지 표준으로 자리잡은 인코딩 방식입니다.
          0~255의 바이너리 값을 6비트씩 끊어 A-Z, a-z, 0-9, +, / 의 64개 문자로 매핑하고, 4의 배수로 맞추기 위해 부족한 자리에 =(패딩)을 채웁니다.
          쉽게 말하면 &quot;텍스트만 통과되는 통로에 바이너리를 끼워 보낼 때&quot; 쓰는 변환입니다.
          크기는 약 4/3배(33%↑)로 늘지만, 라우터나 메일 게이트웨이가 데이터를 임의로 깨뜨리지 않도록 보호해 줍니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💡 실무에서 자주 마주치는 상황</h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc pl-5">
          <li><strong>이미지를 HTML에 임베드</strong>: 5KB 이하 아이콘은 <code>data:image/png;base64,iVBOR...</code> 형식으로 박아 넣어 HTTP 요청 1건을 줄이는 경우가 많습니다. CSS 스프라이트의 대체재로도 쓰입니다.</li>
          <li><strong>API 응답에 PDF/이미지 포함</strong>: JSON에 바이너리를 그대로 넣을 수 없어 Base64 문자열로 감싸 보냅니다. AWS S3 pre-signed URL이 부담스러운 작은 미리보기에 적합합니다.</li>
          <li><strong>Basic 인증 헤더</strong>: <code>Authorization: Basic dXNlcjpwYXNz</code> 형식. user:pass 를 Base64로 묶을 뿐 암호화가 아니므로 반드시 HTTPS와 함께 써야 합니다.</li>
          <li><strong>JWT 토큰</strong>: Header와 Payload가 점(.)으로 구분되며 Base64url(패딩 없음, +→-, /→_) 변형을 사용합니다. 일반 Base64를 그대로 URL에 넣으면 +가 공백으로 해석되는 문제가 있습니다.</li>
          <li><strong>QR 코드용 페이로드 압축</strong>: 짧은 바이너리를 한 줄로 직렬화할 때 사용합니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⚠️ 인코딩 시 주의할 점</h2>
        <p className="text-sm leading-relaxed">
          첫째, <strong>한글이나 이모지처럼 UTF-8 멀티바이트 문자</strong>는 <code>btoa()</code>에 바로 넣으면 InvalidCharacterError가 납니다. 이 도구는 내부적으로 UTF-8 바이트로 변환한 뒤 Base64를 적용하므로 안전합니다.
          둘째, <strong>줄바꿈(76자마다 \r\n)</strong>이 들어간 Base64는 MIME 표준에서 허용되지만 JSON이나 헤더에서는 빼야 합니다.
          셋째, Base64 결과만 보고 원문을 추측하는 것은 매우 쉽기 때문에 비밀번호나 토큰을 &quot;가리는 용도&quot;로 쓰면 안 됩니다.
        </p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: 'Base64로 비밀번호를 가리면 안전한가요?', answer: '아닙니다. Base64는 누구나 1초 만에 풀 수 있는 인코딩일 뿐 암호화가 아닙니다. 비밀번호는 bcrypt, Argon2 같은 해시 함수로, 통신 보호는 HTTPS/TLS로 해야 합니다.' },
          { question: '= 패딩 문자가 왜 붙나요? 빼도 되나요?', answer: '원본 길이가 3바이트 단위로 떨어지지 않을 때 4문자 블록을 채우려고 추가됩니다. RFC 4648의 Base64url 규격은 패딩을 생략해도 되며, JWT가 대표적인 예입니다. 일반 Base64는 보통 패딩을 유지합니다.' },
          { question: '큰 이미지를 Data URL로 박는 게 항상 좋은가요?', answer: '아닙니다. 5KB 이하의 작은 아이콘에만 유리합니다. 큰 이미지는 base64로 임베드하면 HTML 파일이 커져 초기 렌더링과 캐시 효율이 모두 떨어집니다. 보통 10KB 이상은 별도 파일로 두는 편이 빠릅니다.' },
          { question: 'Base64와 Base64url의 차이는?', answer: 'URL과 파일명에서 충돌하는 +와 /를 각각 -와 _로 바꾸고 패딩(=)을 생략한 변형이 Base64url(RFC 4648 §5)입니다. JWT, OAuth state 파라미터 등 URL 친화적 위치에서 사용됩니다.' },
        ]}
      />
    </div>
  );
}
