'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

export function HtmlEntity() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const encode = useCallback((text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\//g, '&#x2F;')
      .replace(/`/g, '&#x60;')
      .replace(/=/g, '&#x3D;');
  }, []);

  const decode = useCallback((text: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }, []);

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
      if (mode === 'encode') {
        setOutput(encode(input));
      } else {
        setOutput(decode(input));
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, mode, encode, decode]);

  const handleConvert = () => {
    if (mode === 'encode') {
      setOutput(encode(input));
    } else {
      setOutput(decode(input));
    }
  };

  const handleSwap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={mode === 'encode' ? 'primary' : 'secondary'}
          onClick={() => setMode('encode')}
        >
          인코딩
        </Button>
        <Button
          variant={mode === 'decode' ? 'primary' : 'secondary'}
          onClick={() => setMode('decode')}
        >
          디코딩
        </Button>
      </div>

      <Textarea
        label={mode === 'encode' ? '일반 텍스트' : 'HTML 엔티티'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? '<div class="test">' : '&lt;div class=&quot;test&quot;&gt;'}
        rows={6}
      />

      <div className="flex gap-2">
        <Button onClick={handleConvert}>
          {mode === 'encode' ? '인코딩' : '디코딩'}
        </Button>
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
          <Textarea value={output} readOnly rows={6} />
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          주요 HTML 엔티티
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div>&lt; → &amp;lt;</div>
          <div>&gt; → &amp;gt;</div>
          <div>&amp; → &amp;amp;</div>
          <div>&quot; → &amp;quot;</div>
          <div>&apos; → &amp;#39;</div>
          <div>&nbsp; → &amp;nbsp;</div>
          <div>&copy; → &amp;copy;</div>
          <div>&reg; → &amp;reg;</div>
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🏷️ HTML 엔티티 변환이란?</h2>
        <p className="text-sm leading-relaxed">
          HTML 엔티티는 HTML에서 특수한 의미를 가진 문자를 안전하게 표현하기 위한 문자 참조 방식입니다.
          &lt;, &gt;, &amp; 같은 문자는 HTML 태그로 해석될 수 있기 때문에 엔티티로 변환해야 합니다.
          웹 보안에서 XSS(Cross-Site Scripting) 공격을 방지하는 가장 기본적인 방법이며,
          사용자 입력을 HTML에 표시할 때 반드시 적용해야 하는 필수 처리입니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📌 주요 HTML 엔티티 목록</h2>
        <div className="text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-2">문자</th>
                <th className="text-left py-2 px-2">이름 엔티티</th>
                <th className="text-left py-2 px-2">숫자 엔티티</th>
                <th className="text-left py-2 px-2">설명</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">&lt;</td><td className="py-1 px-2">&amp;lt;</td><td className="py-1 px-2">&amp;#60;</td><td className="py-1 px-2 font-sans">태그 시작</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">&gt;</td><td className="py-1 px-2">&amp;gt;</td><td className="py-1 px-2">&amp;#62;</td><td className="py-1 px-2 font-sans">태그 끝</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">&amp;</td><td className="py-1 px-2">&amp;amp;</td><td className="py-1 px-2">&amp;#38;</td><td className="py-1 px-2 font-sans">앰퍼샌드</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">&quot;</td><td className="py-1 px-2">&amp;quot;</td><td className="py-1 px-2">&amp;#34;</td><td className="py-1 px-2 font-sans">큰따옴표</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">&apos;</td><td className="py-1 px-2">&amp;#39;</td><td className="py-1 px-2">&amp;#39;</td><td className="py-1 px-2 font-sans">작은따옴표</td></tr>
              <tr><td className="py-1 px-2">&nbsp;</td><td className="py-1 px-2">&amp;nbsp;</td><td className="py-1 px-2">&amp;#160;</td><td className="py-1 px-2 font-sans">공백(줄바꿈 방지)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: 'HTML 엔티티를 사용하지 않으면 어떻게 되나요?', answer: '사용자 입력에 <script> 같은 태그가 포함되면 XSS 공격이 발생할 수 있습니다. 엔티티 변환은 웹 보안의 기본입니다.' },
          { question: '이름 엔티티와 숫자 엔티티의 차이는?', answer: '이름 엔티티(&amp;lt;)는 읽기 쉽고, 숫자 엔티티(&amp;#60;)는 모든 브라우저에서 지원됩니다. 기능은 동일합니다.' },
          { question: 'React에서도 HTML 엔티티 변환이 필요한가요?', answer: 'React의 JSX는 기본적으로 문자열을 이스케이프하므로 XSS가 방지됩니다. 단, dangerouslySetInnerHTML 사용 시에는 수동 변환이 필요합니다.' },
        ]}
      />
    </div>
  );
}
