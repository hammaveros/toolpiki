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
          <strong className="text-gray-900 dark:text-white">HTML 엔티티는 특수문자를 안전한 문자 참조로 바꾸는 표준 표기법입니다.</strong>{' '}
          브라우저의 파서가 &quot;태그 시작&quot;이나 &quot;속성 경계&quot;로 해석하는 문자를 보호합니다.
          예를 들어 사용자가 댓글에 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">&lt;script&gt;alert(1)&lt;/script&gt;</code>를 적었을 때 그대로 페이지에 출력하면 <strong>그 코드가 실행됩니다</strong>.
          이 도구는 <strong>&amp;, &lt;, &gt;, &quot;, &apos;, /, ` 8개를 한 번에 처리</strong>하므로 가장 흔한 <strong>XSS 벡터</strong>를 차단합니다.
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

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🚨 XSS 방어, 위치별로 다르다</h2>
        <p className="text-sm leading-relaxed mb-3">
          <strong className="text-gray-900 dark:text-white">OWASP Cheat Sheet에 따르면 같은 문자열이라도 출력 위치에 따라 필요한 인코딩이 다릅니다.</strong>
        </p>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong className="text-gray-900 dark:text-white">본문 텍스트</strong> — 본 도구의 6~8자 엔티티 변환이면 충분합니다.</li>
          <li><strong className="text-gray-900 dark:text-white">속성 값</strong> — 작은따옴표/큰따옴표까지 모두 변환해야 합니다.</li>
          <li><strong className="text-gray-900 dark:text-white">&lt;script&gt; 블록 내부</strong> / <strong>스타일 속성</strong> — HTML 엔티티만으로 막을 수 없고 <strong>JavaScript/CSS 이스케이프</strong>가 별도로 필요합니다.</li>
          <li><strong className="text-gray-900 dark:text-white">href, src 같은 URL 속성</strong> — <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">javascript:</code> 스킴 차단이 추가로 들어가야 합니다.</li>
        </ul>
      </section>

      <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 p-4 text-sm">
        <p className="font-semibold text-red-900 dark:text-red-200 mb-1">🔒 보안 주의</p>
        <p className="text-red-800 dark:text-red-300">React의 <code className="px-1 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-xs font-mono">dangerouslySetInnerHTML</code>, Vue의 <code className="px-1 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-xs font-mono">v-html</code>은 <strong>자동 이스케이프를 우회</strong>합니다. 사용 시 반드시 직접 변환하거나 DOMPurify로 sanitize하세요.</p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: 'HTML 엔티티를 사용하지 않으면 어떻게 되나요?', answer: '사용자 입력에 <script>나 <img onerror> 같은 코드가 들어가면 그대로 실행되어 세션 쿠키 탈취, 화면 변조, CSRF 우회 같은 공격이 가능합니다. 매년 OWASP Top 10 상위에 XSS가 꾸준히 들어가는 이유이기도 합니다.' },
          { question: '이름 엔티티와 숫자 엔티티의 차이는?', answer: '결과는 같지만 명명 엔티티(&amp;lt;)는 사람이 읽기 좋고, 숫자 엔티티(&amp;#60;)는 매우 오래된 브라우저나 일부 XML 파서에서 더 안정적입니다. 호환성 위주라면 숫자 엔티티가 무난합니다.' },
          { question: 'React, Vue에서도 변환이 필요한가요?', answer: 'React의 JSX, Vue의 mustache 보간은 기본적으로 자동 이스케이프되어 안전합니다. 다만 React의 dangerouslySetInnerHTML, Vue의 v-html을 쓸 때는 반드시 직접 변환해야 하며, 마크다운 라이브러리가 만든 HTML도 sanitize 단계를 거쳐야 합니다.' },
        ]}
      />
    </div>
  );
}
