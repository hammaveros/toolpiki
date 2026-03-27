'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

export function LineBreakRemover() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const removeLineBreaks = () => {
    setOutput(input.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim());
  };

  const removeAllWhitespace = () => {
    setOutput(input.replace(/\s+/g, ''));
  };

  const normalizeWhitespace = () => {
    setOutput(input.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim());
  };

  const removeEmptyLines = () => {
    setOutput(
      input
        .split('\n')
        .filter((line) => line.trim())
        .join('\n')
    );
  };

  return (
    <div className="space-y-2">
      {/* 입력 */}
      <div>
        <Textarea
          label="텍스트 입력"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="줄바꿈을 제거할 텍스트를 입력하세요..."
          rows={6}
        />
      </div>

      {/* 버튼들 */}
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={removeLineBreaks}>
          줄바꿈 → 공백
        </Button>
        <Button variant="secondary" onClick={removeAllWhitespace}>
          모든 공백 제거
        </Button>
        <Button variant="secondary" onClick={normalizeWhitespace}>
          공백 정리
        </Button>
        <Button variant="secondary" onClick={removeEmptyLines}>
          빈 줄 제거
        </Button>
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
          placeholder="결과가 여기에 표시됩니다."
          rows={6}
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔧 줄바꿈 제거란?</h2>
        <p className="text-sm leading-relaxed">
          줄바꿈 제거는 텍스트에 포함된 개행 문자(Line Break)를 제거하거나 공백으로 변환하는 작업입니다.
          PDF에서 복사한 텍스트, 이메일에서 가져온 내용, 웹페이지에서 긁어온 텍스트 등에는 의도하지 않은 줄바꿈이 포함되는 경우가 많습니다.
          이러한 불필요한 줄바꿈은 문서 편집, 데이터 처리, 코드 작성 시 방해가 될 수 있어 깔끔하게 정리해야 합니다.
          이 도구는 줄바꿈을 공백으로 치환, 모든 공백 제거, 공백 정규화, 빈 줄 제거 등 4가지 모드를 제공하여 다양한 상황에 맞게 텍스트를 정리할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💡 활용 사례</h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>PDF 복사 텍스트 정리</strong> — PDF에서 텍스트를 복사하면 줄마다 강제 줄바꿈이 삽입됩니다. 이를 제거하면 자연스러운 문단으로 만들 수 있습니다.</li>
          <li><strong>이메일 포맷팅</strong> — 수신된 이메일의 텍스트를 다른 문서에 붙여넣을 때 불필요한 줄바꿈을 정리하여 깔끔한 형태로 만듭니다.</li>
          <li><strong>코드 한줄화</strong> — 여러 줄에 걸친 SQL 쿼리, JSON 데이터, CSV 행 등을 한 줄로 합쳐 명령줄이나 API 호출에 바로 사용할 수 있습니다.</li>
          <li><strong>SNS 게시글 작성</strong> — 메모장에서 작성한 긴 텍스트의 줄바꿈을 정리하여 SNS에 적합한 형태로 변환합니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 줄바꿈 문자 종류</h2>
        <p className="text-sm leading-relaxed mb-2">
          운영체제마다 줄바꿈을 표현하는 문자가 다릅니다. 이 도구는 모든 형식을 자동으로 인식하여 처리합니다.
        </p>
        <ul className="text-sm leading-relaxed space-y-1 list-disc list-inside">
          <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">\n</code> (LF) — Unix, Linux, macOS에서 사용하는 줄바꿈 문자</li>
          <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">\r\n</code> (CRLF) — Windows에서 사용하는 줄바꿈 문자</li>
          <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">\r</code> (CR) — 구형 Mac OS에서 사용하던 줄바꿈 문자</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '줄바꿈을 제거하면 단어가 붙지 않나요?', answer: '"줄바꿈 → 공백" 모드를 사용하면 줄바꿈 위치에 공백이 삽입되어 단어가 자연스럽게 이어집니다. 공백 없이 완전히 붙이고 싶다면 "모든 공백 제거" 모드를 사용하세요.' },
          { question: 'PDF에서 복사한 텍스트도 정리할 수 있나요?', answer: '네, PDF에서 복사한 텍스트는 줄마다 강제 줄바꿈이 포함됩니다. "줄바꿈 → 공백" 모드로 한 번에 깔끔하게 정리할 수 있습니다.' },
          { question: '"공백 정리"와 "줄바꿈 → 공백"의 차이가 뭔가요?', answer: '"줄바꿈 → 공백"은 모든 줄바꿈을 공백으로 바꿔 한 줄로 만듭니다. "공백 정리"는 연속 공백을 하나로 줄이고 빈 줄을 정리하되, 문단 구분(빈 줄 1개)은 유지합니다.' },
        ]}
      />
    </div>
  );
}
