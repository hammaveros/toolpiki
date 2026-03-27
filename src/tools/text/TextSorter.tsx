'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

type SortType = 'asc' | 'desc' | 'length-asc' | 'length-desc' | 'random' | 'reverse';

export function TextSorter() {
  const [input, setInput] = useState('');
  const [sortType, setSortType] = useState<SortType>('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const output = useMemo(() => {
    if (!input) return '';

    let lines = input.split('\n');

    switch (sortType) {
      case 'asc':
        lines.sort((a, b) => {
          const compareA = caseSensitive ? a : a.toLowerCase();
          const compareB = caseSensitive ? b : b.toLowerCase();
          return compareA.localeCompare(compareB, 'ko');
        });
        break;
      case 'desc':
        lines.sort((a, b) => {
          const compareA = caseSensitive ? a : a.toLowerCase();
          const compareB = caseSensitive ? b : b.toLowerCase();
          return compareB.localeCompare(compareA, 'ko');
        });
        break;
      case 'length-asc':
        lines.sort((a, b) => a.length - b.length);
        break;
      case 'length-desc':
        lines.sort((a, b) => b.length - a.length);
        break;
      case 'random':
        lines = lines.sort(() => Math.random() - 0.5);
        break;
      case 'reverse':
        lines = lines.reverse();
        break;
    }

    return lines.join('\n');
  }, [input, sortType, caseSensitive]);

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'asc', label: '오름차순 (가→힣, A→Z)' },
    { value: 'desc', label: '내림차순 (힣→가, Z→A)' },
    { value: 'length-asc', label: '길이순 (짧은→긴)' },
    { value: 'length-desc', label: '길이순 (긴→짧은)' },
    { value: 'random', label: '무작위' },
    { value: 'reverse', label: '역순' },
  ];

  return (
    <div className="space-y-3">
      {/* 입력 */}
      <div>
        <Textarea
          label="텍스트 입력 (줄 단위로 정렬)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="정렬할 텍스트를 한 줄씩 입력하세요..."
          rows={8}
        />
      </div>

      {/* 정렬 옵션 */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={sortType === option.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSortType(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

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
          placeholder="정렬된 텍스트가 여기에 표시됩니다."
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 텍스트 정렬이란?</h2>
        <p className="text-sm leading-relaxed">
          텍스트 정렬은 여러 줄의 텍스트를 특정 기준에 따라 순서를 재배치하는 작업입니다. 이름 목록을 가나다순으로 정리하거나, 영어 단어를 알파벳순으로 나열하거나, 데이터를 길이순으로 분류하는 등 다양한 상황에서 활용됩니다. 수동으로 하나씩 옮기는 것은 시간이 오래 걸리고 실수가 발생하기 쉽지만, 이 도구를 사용하면 클릭 한 번으로 원하는 정렬 결과를 즉시 얻을 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔄 지원하는 정렬 방식</h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>오름차순 (가→힣, A→Z)</strong> — 한글은 가나다순, 영어는 알파벳순으로 정렬합니다. 이름 목록, 용어 사전, 참고문헌 정리에 적합합니다.</li>
          <li><strong>내림차순 (힣→가, Z→A)</strong> — 오름차순의 반대 순서로 정렬합니다. 역순 색인이나 특수한 정렬이 필요할 때 사용합니다.</li>
          <li><strong>길이순 (짧은→긴 / 긴→짧은)</strong> — 텍스트의 길이(글자수)를 기준으로 정렬합니다. 데이터 분석이나 UI 레이아웃 검토에 유용합니다.</li>
          <li><strong>무작위</strong> — 줄의 순서를 랜덤으로 섞습니다. 발표 순서 정하기, 퀴즈 문항 섞기, 추첨 등에 활용할 수 있습니다.</li>
          <li><strong>역순</strong> — 현재 순서를 그대로 뒤집습니다. 마지막 항목을 맨 위로 올리고 싶을 때 간편합니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💡 활용 사례</h2>
        <ul className="text-sm leading-relaxed space-y-1 list-disc list-inside">
          <li>학생 명단, 출석부, 회원 목록을 가나다순으로 정리</li>
          <li>엑셀이나 CSV에서 복사한 데이터를 빠르게 정렬</li>
          <li>블로그 태그, 키워드 목록을 알파벳순으로 배치</li>
          <li>프로그래밍 시 import 문이나 변수 목록 정렬</li>
          <li>랜덤 섞기로 팀 배정, 발표 순서, 당첨자 추첨</li>
          <li>대소문자 구분 옵션으로 정밀한 정렬 제어</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '한글과 영어가 섞여 있으면 어떻게 정렬되나요?', answer: '한글 로케일 기준으로 정렬되며, 일반적으로 영어가 먼저, 한글이 뒤에 배치됩니다. 대소문자 구분 옵션을 켜면 대문자와 소문자가 별도로 분리되어 정렬됩니다.' },
          { question: '빈 줄도 정렬에 포함되나요?', answer: '네, 빈 줄도 하나의 줄로 취급되어 정렬에 포함됩니다. 빈 줄은 길이가 0이므로 길이순 정렬 시 맨 앞에 위치하게 됩니다.' },
          { question: '정렬할 수 있는 줄 수에 제한이 있나요?', answer: '브라우저에서 처리하므로 특별한 제한은 없지만, 수만 줄 이상의 대량 텍스트는 처리 시간이 다소 걸릴 수 있습니다. 일반적인 사용에서는 문제 없이 빠르게 정렬됩니다.' },
        ]}
      />
    </div>
  );
}
