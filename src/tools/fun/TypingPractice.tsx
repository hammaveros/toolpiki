'use client';

import { useState, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

// 저작권 없는 긴 문장들 (연습용)
const PRACTICE_TEXTS = [
  '오늘 하루도 열심히 살아가는 모든 분들을 응원합니다. 작은 노력이 모여 큰 변화를 만들어냅니다.',
  '프로그래밍은 문제를 해결하는 과정입니다. 복잡한 문제를 작은 단위로 나누어 하나씩 해결해 나가면 됩니다.',
  '꾸준함이 가장 중요합니다. 매일 조금씩 연습하면 어느새 실력이 늘어 있을 것입니다.',
  '타자 연습은 처음에는 느리더라도 정확하게 치는 것이 중요합니다. 속도는 자연스럽게 따라옵니다.',
  '좋은 코드는 읽기 쉬운 코드입니다. 다른 사람이 이해할 수 있도록 명확하게 작성하는 습관을 기르세요.',
  '실패를 두려워하지 마세요. 실패는 성공으로 가는 과정의 일부입니다. 포기하지 않는 것이 중요합니다.',
  '건강한 몸에 건강한 정신이 깃든다고 합니다. 규칙적인 운동과 충분한 수면을 취하세요.',
  '새로운 것을 배우는 데는 시간이 필요합니다. 조급해하지 말고 차근차근 익혀 나가세요.',
  '협업은 현대 사회에서 필수적인 능력입니다. 다른 사람의 의견을 존중하고 소통하는 법을 배우세요.',
  '자신의 한계를 정하지 마세요. 도전하지 않으면 무엇이 가능한지 알 수 없습니다.',
  '작은 성공들이 모여 큰 성취가 됩니다. 오늘 할 수 있는 작은 일부터 시작해보세요.',
  '배움에는 끝이 없습니다. 항상 호기심을 가지고 새로운 것을 탐구하는 자세가 중요합니다.',
  '시간은 누구에게나 공평하게 주어집니다. 어떻게 사용하느냐가 결과를 결정합니다.',
  '긍정적인 마음가짐은 어려움을 극복하는 힘이 됩니다. 할 수 있다고 믿으면 할 수 있습니다.',
  '완벽함을 추구하기보다 꾸준히 발전하는 것이 더 중요합니다. 오늘의 나보다 내일의 내가 더 나아지면 됩니다.',
];

export function TypingPractice() {
  const [practiceText, setPracticeText] = useState('');
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceStartTime, setPracticeStartTime] = useState<number | null>(null);
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const practiceInputRef = useRef<HTMLTextAreaElement>(null);

  // 연습 시작
  const startPractice = () => {
    const randomText = PRACTICE_TEXTS[Math.floor(Math.random() * PRACTICE_TEXTS.length)];
    setPracticeText(randomText);
    setPracticeInput('');
    setPracticeStartTime(null);
    setPracticeComplete(false);
    setIsPlaying(true);
    setTimeout(() => practiceInputRef.current?.focus(), 100);
  };

  // 입력 처리
  const handlePracticeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (!practiceStartTime && value.length > 0) {
      setPracticeStartTime(Date.now());
    }
    setPracticeInput(value);

    // 완료 체크
    if (value === practiceText) {
      setPracticeComplete(true);
    }
  };

  // 타수 계산
  const practiceTypingSpeed = useMemo(() => {
    if (!practiceStartTime || practiceInput.length === 0) return 0;
    const endTime = practiceComplete ? Date.now() : Date.now();
    const minutes = (endTime - practiceStartTime) / 60000;
    if (minutes < 0.05) return 0;
    return Math.round(practiceInput.length / minutes);
  }, [practiceStartTime, practiceInput, practiceComplete]);

  // 정확도
  const practiceAccuracy = useMemo(() => {
    if (practiceInput.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < practiceInput.length; i++) {
      if (practiceInput[i] === practiceText[i]) correct++;
    }
    return Math.round((correct / practiceInput.length) * 100);
  }, [practiceInput, practiceText]);

  // 글자별 색상 표시
  const renderPracticeText = () => {
    return practiceText.split('').map((char, i) => {
      let className = 'text-gray-400'; // 아직 입력 안 됨
      if (i < practiceInput.length) {
        className = practiceInput[i] === char
          ? 'text-green-600 dark:text-green-400'
          : 'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      }
      return (
        <span key={i} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* 시작 화면 */}
      {!isPlaying && (
        <Card variant="bordered" className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">긴 글 타자 연습</h2>
            <div className="text-sm text-gray-500 mb-6 space-y-1">
              <p>랜덤 문장이 제시됩니다</p>
              <p>정확하게 따라 입력하세요</p>
              <p>실시간으로 타수와 정확도가 표시됩니다</p>
            </div>
            <Button onClick={startPractice} className="text-lg px-8 py-3">
              연습 시작
            </Button>
          </div>
        </Card>
      )}

      {/* 연습 진행 중 */}
      {isPlaying && (
        <>
          <div className="flex justify-between items-center text-sm mb-2">
            <span>타수: <strong className="text-green-600">{practiceTypingSpeed}</strong>/분</span>
            <span>정확도: <strong className="text-blue-600">{practiceAccuracy}%</strong></span>
            <span>진행: <strong>{practiceInput.length}</strong>/{practiceText.length}</span>
          </div>

          {/* 원문 표시 */}
          <Card variant="bordered" className="p-4 font-mono text-lg leading-relaxed">
            {renderPracticeText()}
          </Card>

          {/* 입력 영역 */}
          <textarea
            ref={practiceInputRef}
            value={practiceInput}
            onChange={handlePracticeInput}
            placeholder="위 문장을 따라 입력하세요..."
            className="w-full px-4 py-3 text-lg border-2 border-blue-300 dark:border-blue-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white font-mono resize-none"
            rows={4}
            spellCheck={false}
            disabled={practiceComplete}
          />

          {practiceComplete && (
            <Card variant="bordered" className="p-4 text-center bg-green-50 dark:bg-green-900/20">
              <p className="text-xl font-bold text-green-600 mb-2">완료!</p>
              <div className="flex justify-center gap-6 text-sm">
                <span>최종 타수: <strong>{practiceTypingSpeed}</strong>/분</span>
                <span>정확도: <strong>{practiceAccuracy}%</strong></span>
              </div>
              <div className="flex justify-center gap-3 mt-4">
                <Button onClick={startPractice}>다른 문장</Button>
                <Button variant="secondary" onClick={() => setIsPlaying(false)}>처음으로</Button>
              </div>
            </Card>
          )}

          {!practiceComplete && (
            <Button variant="secondary" onClick={() => setIsPlaying(false)}>
              그만하기
            </Button>
          )}
        </>
      )}

      {/* 설명 */}
      {!isPlaying && (
        <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
          <p>• 제시된 문장을 정확하게 따라 입력하세요</p>
          <p>• 실시간으로 타수(분당 글자 수)가 측정됩니다</p>
          <p>• 틀린 글자는 빨간색으로 표시됩니다</p>
          <p>• 정확도와 속도를 함께 향상시켜보세요</p>
        </div>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⌨️ 타이핑 연습이란?
        </h2>
        <p className="text-sm leading-relaxed">
          타이핑 연습은 실제 문장을 따라 입력하면서 키보드 타이핑 실력을 향상시키는 도구입니다.
          게임과 달리 실전에 가까운 문장을 사용하여, 실무나 일상에서 바로 활용할 수 있는 타이핑 능력을 길러줍니다.
          실시간으로 타수와 정확도가 측정되어 자신의 실력을 객관적으로 파악할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 타수 기준 안내
        </h2>
        <div className="text-sm leading-relaxed">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">초급</p>
              <p className="text-xs text-gray-500">100~200타/분</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">중급</p>
              <p className="text-xs text-gray-500">200~350타/분</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">고급</p>
              <p className="text-xs text-gray-500">350~500타/분</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">전문가</p>
              <p className="text-xs text-gray-500">500타/분 이상</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 효과적인 연습 방법
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>처음에는 정확도 95% 이상을 유지하며 천천히 연습하세요</li>
          <li>틀린 글자가 나오면 해당 키 위치를 의식적으로 확인하세요</li>
          <li>하루 10분이라도 매일 꾸준히 하는 것이 집중적으로 하는 것보다 효과적입니다</li>
          <li>다양한 문장을 연습하면 특정 글자 조합에 익숙해집니다</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '타이핑 연습과 타이핑 게임의 차이는 무엇인가요?',
            answer: '타이핑 연습은 실제 문장을 따라 치며 실력을 측정하는 데 초점을 맞추고, 타이핑 게임은 서바이벌, 타임어택 등 재미 요소를 통해 연습하는 방식입니다.',
          },
          {
            question: '한글 타수는 어떻게 계산되나요?',
            answer: '한글은 자음과 모음의 조합으로 이루어지므로, 분당 입력한 총 글자 수(타)를 기준으로 측정됩니다.',
          },
          {
            question: '정확도가 낮으면 어떻게 해야 하나요?',
            answer: '속도를 낮추고 정확도를 먼저 높이세요. 정확도 95% 이상을 유지하면서 점차 속도를 올리는 것이 가장 효과적인 방법입니다.',
          },
        ]}
      />
    </div>
  );
}
