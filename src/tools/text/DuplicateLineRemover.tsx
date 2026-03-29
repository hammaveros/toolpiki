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
          중복 줄 제거 도구는 텍스트에서 동일한 내용의 줄이 여러 번 반복될 때, 첫 번째 등장만 남기고 나머지를 자동으로 제거해주는 유틸리티입니다.
          수작업으로 하나하나 비교하며 지울 필요 없이, 텍스트를 붙여넣기만 하면 즉시 중복이 제거된 결과를 확인할 수 있습니다.
          서버 로그 정리, 데이터 정제, 이메일 목록 중복 제거, 코드 정리 등 다양한 상황에서 빠르고 정확하게 활용할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          활용 사례
        </h2>
        <div className="text-sm leading-relaxed space-y-2">
          <p><strong>서버 로그 정리:</strong> 동일한 에러 메시지나 요청 로그가 반복될 때 중복을 제거하면 핵심 이슈를 빠르게 파악할 수 있습니다.</p>
          <p><strong>이메일/연락처 목록:</strong> 여러 출처에서 수집한 이메일 주소나 연락처를 합칠 때 중복 항목을 한 번에 정리할 수 있습니다.</p>
          <p><strong>데이터 정제:</strong> CSV나 텍스트 데이터에서 동일한 행이 반복되는 경우 고유한 값만 추출하여 깔끔한 데이터셋을 만들 수 있습니다.</p>
          <p><strong>코드 정리:</strong> import문, 설정 값, 리스트 항목 등에서 실수로 중복된 줄을 빠르게 찾아 제거할 수 있습니다.</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          옵션 설명
        </h2>
        <div className="text-sm leading-relaxed space-y-2">
          <p><strong>대소문자 구분:</strong> 활성화하면 &quot;Hello&quot;와 &quot;hello&quot;를 서로 다른 줄로 취급합니다. 비활성화하면 대소문자 관계없이 같은 내용으로 판단하여 중복을 제거합니다.</p>
          <p><strong>앞뒤 공백 제거:</strong> 활성화하면 각 줄의 앞뒤 공백(스페이스, 탭)을 제거한 후 비교합니다. 들여쓰기 차이만 있는 줄도 동일하게 처리됩니다.</p>
        </div>
      </section>

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
        ]}
      />
    </div>
  );
}
