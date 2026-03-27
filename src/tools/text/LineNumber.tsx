'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { CopyButton } from '@/components/ui/CopyButton';

type Mode = 'add' | 'remove';

interface AddOptions {
  startNumber: number;
  separator: string;
  padding: boolean;
}

export function LineNumber() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('add');
  const [addOptions, setAddOptions] = useState<AddOptions>({
    startNumber: 1,
    separator: '. ',
    padding: true,
  });
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!input.trim()) {
        setOutput('');
        return;
      }

      const lines = input.split('\n');

      if (mode === 'add') {
        const maxLineNum = addOptions.startNumber + lines.length - 1;
        const maxWidth = String(maxLineNum).length;

        const result = lines.map((line, idx) => {
          const lineNum = addOptions.startNumber + idx;
          const numStr = addOptions.padding
            ? String(lineNum).padStart(maxWidth, ' ')
            : String(lineNum);
          return `${numStr}${addOptions.separator}${line}`;
        });

        setOutput(result.join('\n'));
      } else {
        // Remove line numbers
        const result = lines.map((line) => {
          // 다양한 줄번호 패턴 제거
          // 1. "123. text" or "123: text" or "123) text" or "123 text"
          // 2. "  123. text" (앞에 공백 있는 경우)
          return line.replace(/^\s*\d+[\.\:\)\]\s]\s*/, '');
        });

        setOutput(result.join('\n'));
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, mode, addOptions]);

  const separatorPresets = [
    { label: '. ', value: '. ' },
    { label: ': ', value: ': ' },
    { label: ') ', value: ') ' },
    { label: '] ', value: '] ' },
    { label: '| ', value: '| ' },
    { label: '탭', value: '\t' },
  ];

  return (
    <div className="space-y-4">
      <Card variant="bordered" className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <Button
              variant={mode === 'add' ? 'primary' : 'secondary'}
              onClick={() => setMode('add')}
            >
              줄번호 추가
            </Button>
            <Button
              variant={mode === 'remove' ? 'primary' : 'secondary'}
              onClick={() => setMode('remove')}
            >
              줄번호 제거
            </Button>
          </div>

          {mode === 'add' && (
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">시작 번호:</label>
                <input
                  type="number"
                  value={addOptions.startNumber}
                  onChange={(e) =>
                    setAddOptions({ ...addOptions, startNumber: parseInt(e.target.value) || 1 })
                  }
                  className="w-20 px-2 py-1 text-center border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  min={0}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">구분자:</label>
                <select
                  value={addOptions.separator}
                  onChange={(e) => setAddOptions({ ...addOptions, separator: e.target.value })}
                  className="px-2 py-1 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  {separatorPresets.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addOptions.padding}
                  onChange={(e) => setAddOptions({ ...addOptions, padding: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">자릿수 맞춤</span>
              </label>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Textarea
          label="입력 텍스트"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'add'
              ? '줄번호를 추가할 텍스트를 입력하세요...'
              : '줄번호를 제거할 텍스트를 입력하세요...'
          }
          rows={15}
          className="font-mono text-sm"
        />

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">결과</label>
            <CopyButton text={output} />
          </div>
          <Textarea
            value={output}
            readOnly
            rows={15}
            className="font-mono text-sm bg-gray-50 dark:bg-gray-800/50"
            placeholder="결과가 여기에 표시됩니다..."
          />
        </div>
      </div>

      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">통계</h3>
        <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
          <span>총 줄 수: {input ? input.split('\n').length : 0}줄</span>
          <span>총 글자 수: {input.length}자</span>
        </div>
      </Card>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📝 줄번호 추가/제거 도구란?</h2>
        <p className="text-sm leading-relaxed">
          줄번호 추가 도구는 텍스트의 각 줄 앞에 자동으로 번호를 매겨주는 온라인 유틸리티입니다.
          코드 스니펫을 공유하거나, 문서의 특정 줄을 참조해야 할 때, 또는 목록을 정리할 때 매우 유용합니다.
          반대로 이미 줄번호가 붙어 있는 텍스트에서 번호만 깔끔하게 제거하는 기능도 함께 제공합니다.
          별도의 프로그램 설치 없이 브라우저에서 바로 사용할 수 있으며, 입력과 동시에 실시간으로 결과가 반영됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💡 활용 사례</h2>
        <ul className="text-sm space-y-2 list-disc list-inside">
          <li><strong>코드 리뷰 및 공유</strong> — 코드에 줄번호를 붙여 메신저나 이메일로 공유하면, &quot;몇 번째 줄&quot;이라고 정확히 지칭할 수 있어 소통이 훨씬 수월합니다.</li>
          <li><strong>문서 교정 및 피드백</strong> — 논문, 보고서, 계약서 등의 초안에 줄번호를 추가하면 교정 의견을 줄 단위로 전달할 수 있습니다.</li>
          <li><strong>교육 및 학습 자료</strong> — 수업 자료나 예제 코드에 줄번호를 매기면 학생들이 특정 줄을 빠르게 찾을 수 있습니다.</li>
          <li><strong>목록 정리</strong> — 순서가 있는 항목 리스트를 만들 때 번호를 일괄 추가하거나, 불필요한 번호를 한 번에 제거할 수 있습니다.</li>
          <li><strong>법률/규정 문서</strong> — 조항별 줄번호가 필요한 법률 문서나 규정집 작성 시 활용할 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⚙️ 포맷 옵션 안내</h2>
        <div className="text-sm space-y-3">
          <div>
            <strong className="text-gray-900 dark:text-white">시작 번호</strong>
            <p className="mt-1 leading-relaxed">줄번호의 시작 값을 자유롭게 설정할 수 있습니다. 기본값은 1이지만, 0이나 다른 숫자로 변경 가능합니다. 기존 문서의 중간 부분만 발췌할 때 원본 줄번호를 유지하고 싶다면 시작 번호를 맞춰서 사용하면 됩니다.</p>
          </div>
          <div>
            <strong className="text-gray-900 dark:text-white">구분자</strong>
            <p className="mt-1 leading-relaxed">번호와 텍스트 사이에 들어갈 구분 기호를 선택합니다. 마침표(.), 콜론(:), 괄호()), 대괄호(]), 파이프(|), 탭 등 6가지 프리셋을 제공합니다. 용도에 따라 가장 읽기 편한 형식을 골라 쓰면 됩니다.</p>
          </div>
          <div>
            <strong className="text-gray-900 dark:text-white">자릿수 맞춤 (패딩)</strong>
            <p className="mt-1 leading-relaxed">줄 수가 많을 때 번호 앞에 공백을 추가하여 자릿수를 맞춰줍니다. 예를 들어 100줄짜리 텍스트에서 1번 줄은 &quot;  1&quot;로 표시되어 깔끔하게 정렬됩니다. 코드처럼 정렬이 중요한 경우에 유용합니다.</p>
          </div>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '줄번호 제거 시 어떤 형식의 번호를 인식하나요?', answer: '"1. 텍스트", "1: 텍스트", "1) 텍스트", "1] 텍스트" 등 일반적인 줄번호 패턴을 자동으로 인식하여 제거합니다. 번호 앞에 공백이 있는 경우도 처리됩니다.' },
          { question: '빈 줄에도 줄번호가 붙나요?', answer: '네, 빈 줄도 하나의 줄로 취급되어 번호가 부여됩니다. 이는 원본 텍스트의 구조를 유지하면서 정확한 줄 참조를 가능하게 합니다.' },
          { question: '최대 몇 줄까지 처리할 수 있나요?', answer: '브라우저에서 동작하므로 특별한 줄 수 제한은 없지만, 수만 줄 이상의 대용량 텍스트는 처리 속도가 느려질 수 있습니다. 일반적인 사용에서는 문제없이 동작합니다.' },
        ]}
      />
    </div>
  );
}
