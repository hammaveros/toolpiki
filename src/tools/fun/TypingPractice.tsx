'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
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

interface RoundResult {
  wpm: number;
  accuracy: number;
  length: number;
}

export function TypingPractice() {
  const [practiceText, setPracticeText] = useState('');
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceStartTime, setPracticeStartTime] = useState<number | null>(null);
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [usedIndexes, setUsedIndexes] = useState<Set<number>>(new Set());

  const practiceInputRef = useRef<HTMLTextAreaElement>(null);

  // 다음 문장 (중복 방지)
  const getNextText = () => {
    let available = PRACTICE_TEXTS.map((_, i) => i).filter((i) => !usedIndexes.has(i));
    if (available.length === 0) {
      setUsedIndexes(new Set());
      available = PRACTICE_TEXTS.map((_, i) => i);
    }
    const idx = available[Math.floor(Math.random() * available.length)];
    setUsedIndexes((prev) => new Set(prev).add(idx));
    return PRACTICE_TEXTS[idx];
  };

  // 연습 시작
  const startPractice = () => {
    setPracticeText(getNextText());
    setPracticeInput('');
    setPracticeStartTime(null);
    setPracticeComplete(false);
    setIsPlaying(true);
    setTimeout(() => practiceInputRef.current?.focus(), 100);
  };

  // 다음 문장으로
  const nextSentence = () => {
    setPracticeText(getNextText());
    setPracticeInput('');
    setPracticeStartTime(null);
    setPracticeComplete(false);
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
    const minutes = (Date.now() - practiceStartTime) / 60000;
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

  // 완료 시 기록 저장 + 즉시 다음 문장
  useEffect(() => {
    if (!practiceComplete) return;
    setHistory((prev) => [...prev, {
      wpm: practiceTypingSpeed,
      accuracy: practiceAccuracy,
      length: practiceText.length,
    }]);
    nextSentence();
  }, [practiceComplete]);

  // 누적 통계
  const totalStats = useMemo(() => {
    if (history.length === 0) return null;
    const totalChars = history.reduce((s, r) => s + r.length, 0);
    const avgWpm = Math.round(history.reduce((s, r) => s + r.wpm, 0) / history.length);
    const avgAcc = Math.round(history.reduce((s, r) => s + r.accuracy, 0) / history.length);
    return { rounds: history.length, totalChars, avgWpm, avgAcc };
  }, [history]);

  // 글자별 색상 표시
  const renderPracticeText = () => {
    return practiceText.split('').map((char, i) => {
      let className = 'text-gray-400';
      if (i < practiceInput.length) {
        className = practiceInput[i] === char
          ? 'text-green-600 dark:text-green-400'
          : 'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      }
      return <span key={i} className={className}>{char}</span>;
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
              <p>완료하면 자동으로 다음 문장이 나옵니다</p>
              <p>문장별 타수와 누적 통계가 표시됩니다</p>
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
          {/* 누적 통계 */}
          {totalStats && (
            <div className="flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
              <span>📝 {totalStats.rounds}문장</span>
              <span>⌨️ 평균 {totalStats.avgWpm}타/분</span>
              <span>🎯 평균 {totalStats.avgAcc}%</span>
              <span>📊 총 {totalStats.totalChars}자</span>
            </div>
          )}

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

          {false && practiceComplete && (
            <Card variant="bordered" className="p-4 text-center bg-green-50 dark:bg-green-900/20">
              <p className="text-xl font-bold text-green-600 mb-2">완료!</p>
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
          <p>• 완료하면 3초 후 자동으로 다음 문장이 나옵니다</p>
          <p>• 문장별 타수와 누적 평균이 표시됩니다</p>
          <p>• 틀린 글자는 빨간색으로 표시됩니다</p>
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

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '평균 타수가 어느 정도면 빠른 건가요?', answer: '일반적으로 분당 300타 이상이면 빠른 편이고, 400타 이상이면 매우 빠른 수준입니다.' },
          { question: '정확도와 속도 중 뭐가 더 중요한가요?', answer: '처음에는 정확도를 먼저 높이세요. 정확하게 칠 수 있게 되면 속도는 자연스럽게 따라옵니다.' },
          { question: '매일 얼마나 연습하면 좋나요?', answer: '하루 10~20분이면 충분합니다. 짧더라도 매일 꾸준히 하는 것이 효과적입니다.' },
        ]}
      />
    </div>
  );
}
