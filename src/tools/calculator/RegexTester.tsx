'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

export function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [replaceWith, setReplaceWith] = useState('');

  const flagOptions = [
    { flag: 'g', label: 'global', desc: '모든 일치 항목' },
    { flag: 'i', label: 'ignoreCase', desc: '대소문자 무시' },
    { flag: 'm', label: 'multiline', desc: '여러 줄 모드' },
    { flag: 's', label: 'dotAll', desc: '. 이 줄바꿈 포함' },
  ];

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  const { regex, error, matches, highlighted, replaced } = useMemo(() => {
    if (!pattern) {
      return { regex: null, error: null, matches: [], highlighted: testString, replaced: '' };
    }

    try {
      const re = new RegExp(pattern, flags);
      const matchResults: MatchResult[] = [];
      let match;

      if (flags.includes('g')) {
        while ((match = re.exec(testString)) !== null) {
          matchResults.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match[0].length === 0) re.lastIndex++;
        }
      } else {
        match = re.exec(testString);
        if (match) {
          matchResults.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      // 하이라이트 처리
      let hl = testString;
      if (matchResults.length > 0) {
        const parts: { text: string; isMatch: boolean }[] = [];
        let lastIndex = 0;

        matchResults.forEach((m) => {
          if (m.index > lastIndex) {
            parts.push({ text: testString.slice(lastIndex, m.index), isMatch: false });
          }
          parts.push({ text: m.match, isMatch: true });
          lastIndex = m.index + m.match.length;
        });

        if (lastIndex < testString.length) {
          parts.push({ text: testString.slice(lastIndex), isMatch: false });
        }

        hl = parts
          .map((p) => (p.isMatch ? `<mark class="bg-yellow-300 dark:bg-yellow-700">${escapeHtml(p.text)}</mark>` : escapeHtml(p.text)))
          .join('');
      }

      // 치환 결과
      const rep = replaceWith ? testString.replace(re, replaceWith) : '';

      return { regex: re, error: null, matches: matchResults, highlighted: hl, replaced: rep };
    } catch (e) {
      return { regex: null, error: (e as Error).message, matches: [], highlighted: testString, replaced: '' };
    }
  }, [pattern, flags, testString, replaceWith]);

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  const commonPatterns = [
    { label: '이메일', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { label: 'URL', pattern: 'https?:\\/\\/[^\\s]+' },
    { label: '전화번호', pattern: '0\\d{1,2}-\\d{3,4}-\\d{4}' },
    { label: '숫자만', pattern: '\\d+' },
    { label: '한글만', pattern: '[가-힣]+' },
    { label: 'HTML 태그', pattern: '<[^>]+>' },
  ];

  return (
    <div className="space-y-4">
      <Card variant="bordered" className="p-4">
        <div className="flex gap-2 items-start flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              정규식 패턴
            </label>
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="[a-z]+"
              className="font-mono"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-end">
            {flagOptions.map(({ flag, label, desc }) => (
              <Button
                key={flag}
                variant={flags.includes(flag) ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => toggleFlag(flag)}
                title={desc}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {error && (
          <p className="mt-2 text-red-500 text-sm">{error}</p>
        )}

        <div className="flex gap-2 flex-wrap mt-3">
          {commonPatterns.map(({ label, pattern: p }) => (
            <Button
              key={label}
              variant="secondary"
              size="sm"
              onClick={() => setPattern(p)}
            >
              {label}
            </Button>
          ))}
        </div>
      </Card>

      <Textarea
        label="테스트 문자열"
        value={testString}
        onChange={(e) => setTestString(e.target.value)}
        placeholder="정규식을 테스트할 문자열을 입력하세요..."
        rows={5}
      />

      {testString && pattern && !error && (
        <>
          <Card variant="bordered" className="p-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                일치 결과 ({matches.length}개)
              </label>
            </div>
            <div
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded font-mono text-sm whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </Card>

          {matches.length > 0 && (
            <Card variant="bordered" className="p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                일치 항목
              </label>
              <div className="max-h-48 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b dark:border-gray-700">
                      <th className="pb-2">#</th>
                      <th className="pb-2">일치</th>
                      <th className="pb-2">위치</th>
                      {matches[0]?.groups.length > 0 && <th className="pb-2">그룹</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((m, i) => (
                      <tr key={i} className="border-b dark:border-gray-700">
                        <td className="py-2 text-gray-500">{i + 1}</td>
                        <td className="py-2 font-mono">{m.match}</td>
                        <td className="py-2 text-gray-500">{m.index}</td>
                        {m.groups.length > 0 && (
                          <td className="py-2 font-mono text-xs">
                            {m.groups.map((g, gi) => (
                              <span key={gi} className="mr-2 px-1 bg-gray-200 dark:bg-gray-700 rounded">
                                ${gi + 1}: {g}
                              </span>
                            ))}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <Card variant="bordered" className="p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              치환 (Replace)
            </label>
            <Input
              value={replaceWith}
              onChange={(e) => setReplaceWith(e.target.value)}
              placeholder="치환할 문자열 ($1, $2 등 캡처 그룹 사용 가능)"
              className="font-mono mb-3"
            />
            {replaced && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">치환 결과</span>
                  <CopyButton text={replaced} size="sm" />
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded font-mono text-sm whitespace-pre-wrap">
                  {replaced}
                </div>
              </div>
            )}
          </Card>
        </>
      )}

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-1">자주 사용하는 패턴</p>
        <ul className="space-y-1">
          <li><code>\d</code> - 숫자, <code>\w</code> - 단어 문자, <code>\s</code> - 공백</li>
          <li><code>+</code> - 1개 이상, <code>*</code> - 0개 이상, <code>?</code> - 0 또는 1개</li>
          <li><code>^</code> - 시작, <code>$</code> - 끝</li>
          <li><code>()</code> - 캡처 그룹, <code>(?:)</code> - 비캡처 그룹</li>
        </ul>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔍 정규식 테스터란?
        </h2>
        <p className="text-sm leading-relaxed">
          정규표현식(Regular Expression)은 문자열에서 특정 패턴을 찾고 조작하는 강력한 도구입니다.
          이 테스터는 정규식을 실시간으로 테스트하며, 매칭 결과를 하이라이트로 시각화합니다.
          캡처 그룹, 플래그 설정, 문자열 치환까지 한 곳에서 확인할 수 있습니다.
          이메일, URL, 전화번호 등 자주 쓰는 패턴 프리셋으로 빠르게 시작할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 자주 사용하는 정규식 패턴
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">목적</th>
                <th className="text-left py-2 px-2">패턴</th>
                <th className="text-left py-2 px-2">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">이메일</td><td className="font-mono text-xs">{'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'}</td><td>기본 이메일 형식</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">URL</td><td className="font-mono text-xs">{'https?://[^\\s]+'}</td><td>http/https URL</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">숫자</td><td className="font-mono">{'\\d+'}</td><td>1개 이상 숫자</td></tr>
              <tr><td className="py-2 px-2 font-medium">공백 제거</td><td className="font-mono">{'^\\s+|\\s+$'}</td><td>앞뒤 공백</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 정규식 작성 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>g 플래그</strong>: 전역 검색, 모든 일치 항목 찾기</li>
          <li><strong>i 플래그</strong>: 대소문자 구분 없이 검색</li>
          <li><strong>캡처 그룹 ()</strong>: 일치 부분 추출, $1, $2로 참조</li>
          <li><strong>비탐욕적 *?</strong>: 가능한 적은 문자 매칭</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '정규식에서 특수문자를 어떻게 찾나요?',
            answer: '\\로 이스케이프합니다. 예: \\. (마침표), \\? (물음표), \\[ (대괄호). \\는 두 번 (\\\\)으로 이스케이프합니다.',
          },
          {
            question: '캡처 그룹과 비캡처 그룹의 차이는?',
            answer: '캡처 그룹 ()은 매칭된 부분을 저장해 $1, $2로 참조합니다. 비캡처 그룹 (?:)은 그룹화만 하고 저장하지 않습니다.',
          },
          {
            question: '왜 패턴이 작동하지 않나요?',
            answer: '플래그를 확인하세요. g가 없으면 첫 번째만 매칭됩니다. 또한 JavaScript 정규식과 다른 언어의 정규식은 약간 다를 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}
