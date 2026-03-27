'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export function RandomStringGenerator() {
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(1);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
  });
  const [results, setResults] = useState<string[]>([]);

  const generateString = useCallback(
    (len: number): string => {
      let chars = '';
      if (options.lowercase) chars += CHAR_SETS.lowercase;
      if (options.uppercase) chars += CHAR_SETS.uppercase;
      if (options.numbers) chars += CHAR_SETS.numbers;
      if (options.symbols) chars += CHAR_SETS.symbols;

      if (!chars) return '';

      let result = '';
      const array = new Uint32Array(len);
      crypto.getRandomValues(array);
      for (let i = 0; i < len; i++) {
        result += chars[array[i] % chars.length];
      }
      return result;
    },
    [options]
  );

  const handleGenerate = () => {
    const newResults: string[] = [];
    for (let i = 0; i < count; i++) {
      newResults.push(generateString(length));
    }
    setResults(newResults);
  };

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-2">
      {/* 설정 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="문자열 길이"
          type="number"
          min={1}
          max={256}
          value={length}
          onChange={(e) => setLength(Math.min(256, Math.max(1, Number(e.target.value))))}
        />
        <Input
          label="생성 개수"
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
        />
      </div>

      {/* 문자 종류 옵션 */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          포함할 문자
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'lowercase' as const, label: '소문자 (a-z)' },
            { key: 'uppercase' as const, label: '대문자 (A-Z)' },
            { key: 'numbers' as const, label: '숫자 (0-9)' },
            { key: 'symbols' as const, label: '특수문자' },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options[item.key]}
                onChange={() => toggleOption(item.key)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 생성 버튼 */}
      <Button variant="primary" onClick={handleGenerate} className="w-full sm:w-auto">
        생성하기
      </Button>

      {/* 결과 */}
      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            생성된 문자열
          </p>
          {results.map((result, index) => (
            <Card key={index} variant="bordered" className="p-3">
              <div className="flex items-center justify-between gap-3">
                <code className="text-sm break-all font-mono text-gray-900 dark:text-white flex-1">
                  {result}
                </code>
                <CopyButton text={result} size="sm" />
              </div>
            </Card>
          ))}
        </div>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">랜덤 문자열 생성기란?</h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            랜덤 문자열 생성기는 소문자, 대문자, 숫자, 특수문자를 조합하여 예측할 수 없는 무작위 문자열을 만들어주는 도구입니다.
            이 도구는 브라우저의 Web Crypto API(<code>crypto.getRandomValues</code>)를 사용하여 암호학적으로 안전한(CSPRNG) 난수를 생성합니다.
            일반적인 <code>Math.random()</code>과 달리 시드 추측이 불가능하기 때문에, 비밀번호나 토큰처럼 보안이 중요한 용도에도 안심하고 사용할 수 있습니다.
            문자열 길이는 1자부터 256자까지, 한 번에 최대 100개까지 동시에 생성할 수 있어 대량 작업에도 편리합니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">활용 사례</h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            <strong>임시 비밀번호 생성</strong> — 회원가입 시 초기 비밀번호나 비밀번호 재설정용 임시 비밀번호를 빠르게 만들 수 있습니다.
            대소문자+숫자+특수문자를 포함한 12자 이상의 문자열을 권장합니다.
            <br /><br />
            <strong>API 키 및 토큰</strong> — 서버 간 통신에 사용되는 API 키, 세션 토큰, CSRF 토큰 등을 생성할 때 유용합니다.
            보안을 위해 32자 이상의 영숫자 조합을 사용하는 것이 일반적입니다.
            <br /><br />
            <strong>테스트 데이터</strong> — 개발 환경에서 더미 데이터를 채울 때, 다양한 길이와 문자 구성의 랜덤 문자열이 필요합니다.
            여러 개를 한꺼번에 생성하면 시간을 크게 절약할 수 있습니다.
            <br /><br />
            <strong>고유 식별자</strong> — UUID 외에도 짧고 읽기 쉬운 고유 코드(초대 코드, 쿠폰 코드, 주문 번호 등)를 만들 때 활용됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">보안 관련 팁</h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            이 도구는 <code>crypto.getRandomValues</code>를 사용하므로 브라우저에서 제공하는 암호학적 난수 생성기(CSPRNG)를 활용합니다.
            이는 <code>Math.random()</code> 같은 의사난수(PRNG)와는 근본적으로 다릅니다.
            의사난수는 내부 상태(시드)를 알면 다음 값을 예측할 수 있지만, CSPRNG는 운영체제 수준의 엔트로피 소스를 사용하여 예측이 사실상 불가능합니다.
            단, 생성된 문자열을 안전하게 전달하고 저장하는 것은 사용자의 책임입니다.
            비밀번호는 반드시 해시(bcrypt, Argon2 등)하여 저장하고, API 키는 환경 변수로 관리하며, 민감한 문자열을 평문으로 공유하지 마세요.
          </p>
        </div>

        <FaqSection
          title="자주 묻는 질문"
          faqs={[
            { question: '생성된 문자열은 안전한가요?', answer: '네, Web Crypto API의 crypto.getRandomValues를 사용하여 암호학적으로 안전한 난수를 기반으로 생성됩니다. 비밀번호, 토큰 등 보안이 중요한 용도에도 적합합니다.' },
            { question: '비밀번호 길이는 몇 자가 적당한가요?', answer: '최소 12자 이상, 대소문자+숫자+특수문자 조합을 권장합니다. 보안이 특히 중요한 경우 16자 이상을 사용하세요.' },
            { question: '생성된 문자열이 서버로 전송되나요?', answer: '아닙니다. 모든 생성 과정은 브라우저 내에서 처리되며, 생성된 문자열은 서버로 전송되지 않습니다. 인터넷 연결 없이도 사용 가능합니다.' },
            { question: 'Math.random()과 무엇이 다른가요?', answer: 'Math.random()은 예측 가능한 의사난수(PRNG)를 사용하지만, 이 도구는 운영체제의 엔트로피 소스를 활용하는 암호학적 난수 생성기(CSPRNG)를 사용하여 보안성이 훨씬 높습니다.' },
          ]}
        />

        <div className="flex gap-4 text-sm">
          <a href="/" className="text-blue-600 hover:underline">← 홈으로</a>
          <a href="/tools/uuid-generator" className="text-blue-600 hover:underline">UUID 생성 →</a>
        </div>
      </div>
    </section>
  );
}
