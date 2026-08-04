'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

export function DuplicateLineRemover() {
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);

  const result = useMemo(() => {
    if (!input) return { output: '', originalCount: 0, uniqueCount: 0, removedCount: 0 };

    let lines = input.split('\n');
    const originalCount = lines.length;

    if (trimLines) {
      lines = lines.map((line) => line.trim());
    }

    const seen = new Set<string>();
    const uniqueLines: string[] = [];

    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueLines.push(line);
      }
    }

    return {
      output: uniqueLines.join('\n'),
      originalCount,
      uniqueCount: uniqueLines.length,
      removedCount: originalCount - uniqueLines.length,
    };
  }, [input, caseSensitive, trimLines]);

  return (
    <div className="space-y-3">
      {/* 입력 */}
      <div>
        <Textarea
          label="텍스트 입력"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="중복된 줄을 제거할 텍스트를 입력하세요..."
          rows={8}
        />
      </div>

      {/* 옵션 */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            대소문자 구분
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => setTrimLines(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            앞뒤 공백 제거
          </span>
        </label>
      </div>

      {/* 통계 */}
      {input && (
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>원본: {result.originalCount}줄</span>
          <span>결과: {result.uniqueCount}줄</span>
          <span className="text-red-500">제거: {result.removedCount}줄</span>
        </div>
      )}

      {/* 출력 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            결과
          </label>
          {result.output && <CopyButton text={result.output} />}
        </div>
        <Textarea
          value={result.output}
          readOnly
          placeholder="중복이 제거된 텍스트가 여기에 표시됩니다."
          rows={8}
          className="bg-gray-50 dark:bg-gray-800/50"
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          중복 줄 제거란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">중복 줄 제거 도구는 동일한 줄이 반복될 때 첫 번째 등장만 남기고 나머지를 자동으로 제거</strong>해주는 유틸리티입니다.
          수작업으로 하나하나 비교할 필요 없이, 텍스트를 <strong>붙여넣기만 하면 즉시</strong> 결과를 확인할 수 있습니다.
          <strong>서버 로그 정리</strong>, 데이터 정제, 이메일 목록 중복 제거, 코드 정리 등 다양한 상황에서 활용됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          활용 사례
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>서버 로그 정리:</strong> 동일한 에러 메시지나 요청 로그가 반복될 때 중복을 제거하면 핵심 이슈를 빠르게 파악할 수 있습니다.</li>
          <li><strong>이메일/연락처 목록:</strong> 여러 출처에서 수집한 이메일 주소나 연락처를 합칠 때 중복 항목을 한 번에 정리할 수 있습니다.</li>
          <li><strong>데이터 정제:</strong> CSV나 텍스트 데이터에서 동일한 행이 반복되는 경우 <strong>고유한 값만 추출</strong>하여 깔끔한 데이터셋을 만들 수 있습니다.</li>
          <li><strong>코드 정리:</strong> import문, 설정 값, 리스트 항목 등에서 실수로 중복된 줄을 빠르게 찾아 제거할 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          옵션 설명
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>대소문자 구분:</strong> 활성화하면 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Hello</code>와 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">hello</code>를 서로 다른 줄로 취급합니다. 비활성화하면 대소문자 관계없이 같은 내용으로 판단합니다.</li>
          <li><strong>앞뒤 공백 제거:</strong> 활성화하면 각 줄의 앞뒤 공백(스페이스, 탭)을 제거한 후 비교합니다. <strong>들여쓰기 차이만 있는 줄</strong>도 동일하게 처리됩니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔎 옵션에 따라 결과가 이렇게 달라집니다
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          같은 입력이라도 대소문자 구분과 공백 처리 설정에 따라 남는 줄이 달라집니다.
          아래 5줄을 예로 들어 보겠습니다.
        </p>
        <pre className="p-3 rounded bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto">
{`hong@example.com
HONG@example.com
  hong@example.com
kim@example.com
kim@example.com`}
        </pre>
        <div className="overflow-x-auto text-sm mt-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">대소문자 구분</th>
                <th className="text-left py-2 px-2">앞뒤 공백 제거</th>
                <th className="text-left py-2 px-2">남는 줄 수</th>
                <th className="text-left py-2 px-2">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">켬</td><td>끔</td><td className="font-mono">4줄</td><td>대문자·들여쓰기 모두 다른 줄로 취급</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">켬</td><td>켬</td><td className="font-mono">3줄</td><td>들여쓰기 차이만 병합</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">끔</td><td>끔</td><td className="font-mono">3줄</td><td>대소문자 차이만 병합</td></tr>
              <tr><td className="py-2 px-2">끔</td><td>켬</td><td className="font-mono">2줄</td><td>가장 공격적으로 병합</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed mt-3">
          이메일 주소는 대소문자를 구분하지 않는 것이 일반적이므로, 목록 정리에는 <strong>둘 다 끄고 공백 제거만 켠 설정</strong>이 잘 맞습니다.
          반대로 코드나 ID처럼 대소문자가 의미를 갖는 데이터는 구분을 켜야 안전합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⚠️ 중복 제거 전 확인할 것
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>보이지 않는 문자</strong> — 줄 끝의 공백이나 윈도우 줄바꿈(CRLF)이 섞이면 눈에 같아 보여도 다른 줄로 처리됩니다. 공백 제거 옵션을 켜면 대부분 해결됩니다.</li>
          <li><strong>중복이 정보인 경우</strong> — 로그에서 같은 에러가 몇 번 발생했는지가 중요한 상황이라면, 중복을 지우기 전에 횟수를 먼저 세어 두세요.</li>
          <li><strong>CSV 헤더</strong> — 여러 파일을 합친 데이터에는 헤더 행이 중간중간 섞여 있을 수 있습니다. 중복 제거로 하나만 남지만, 그 위치가 맨 위가 아닐 수 있습니다.</li>
          <li><strong>순서가 중요한 데이터</strong> — 이 도구는 처음 등장 순서를 유지하지만, 정렬이 필요하다면 별도로 정렬해야 합니다.</li>
        </ul>
      </section>

      <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 p-4 text-sm">
        <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">💡 활용 팁</p>
        <p className="text-indigo-800 dark:text-indigo-300">
          이메일 목록처럼 <strong>대소문자 차이가 의미 없는 데이터</strong>는 옵션을 끄고, 코드처럼 <strong>대소문자가 의미를 갖는 데이터</strong>는 옵션을 켜는 것이 안전합니다.
        </p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '빈 줄도 중복으로 제거되나요?',
            answer: '네, 빈 줄이 여러 개 있으면 첫 번째 빈 줄만 남기고 나머지는 제거됩니다. 빈 줄을 모두 유지하고 싶다면 내용이 있는 줄만 따로 처리해야 합니다.',
          },
          {
            question: '원본 줄의 순서가 유지되나요?',
            answer: '네, 중복 줄 제거 후에도 원본에서 처음 등장한 순서가 그대로 유지됩니다. 첫 번째로 나온 줄을 기준으로 남기고, 이후에 반복되는 줄만 제거합니다.',
          },
          {
            question: '탭이나 공백만 다른 줄도 중복으로 처리되나요?',
            answer: '"앞뒤 공백 제거" 옵션을 활성화하면 줄 앞뒤의 공백과 탭을 제거한 후 비교하므로, 들여쓰기만 다른 줄도 중복으로 처리됩니다. 비활성화하면 공백 차이도 구분합니다.',
          },
          {
            question: '눈으로 보기엔 같은 줄인데 중복 제거가 안 돼요.',
            answer: '줄 끝 공백이나 윈도우 줄바꿈(CRLF)이 섞인 경우가 많습니다. "앞뒤 공백 제거" 옵션을 켜면 대부분 해결됩니다. 대소문자만 다른 경우라면 "대소문자 구분"을 끄세요.',
          },
          {
            question: '몇 줄이 제거됐는지 알 수 있나요?',
            answer: '결과 영역에서 원본과 처리 후의 줄 수를 비교하면 제거된 개수를 확인할 수 있습니다. 중복 발생 횟수 자체가 중요한 로그 분석에는 단어 빈도 도구가 더 적합합니다.',
          },
          {
            question: '입력한 텍스트가 서버로 전송되나요?',
            answer: '아니요. 모든 처리는 브라우저 안에서 이루어지며 입력한 내용이 서버로 전송되거나 저장되지 않습니다. 고객 이메일 목록 같은 민감한 데이터도 안전하게 정리할 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}
