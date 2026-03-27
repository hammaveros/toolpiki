'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';

// ========================================
// 타입 정의
// ========================================

interface Choice {
  text: string;
  scores: Record<ResultType, number>;
}

interface Question {
  id: number;
  situation: string;
  question: string;
  choices: Choice[];
}

type ResultType = 'deep' | 'burst' | 'multi' | 'rhythm';

interface ResultInfo {
  type: ResultType;
  name: string;
  emoji: string;
  summary: string;
  traits: string[];
  workStyle: string;
  tips: string[];
  relatedTool: { name: string; slug: string };
}

type TestState = 'intro' | 'testing' | 'result';

// ========================================
// 테스트 데이터
// ========================================

const questions: Question[] = [
  {
    id: 1,
    situation: '중요한 보고서를 작성해야 합니다.',
    question: '당신의 작업 방식은?',
    choices: [
      { text: '조용한 곳에서 몇 시간 동안 집중해서 한 번에 끝낸다', scores: { deep: 3, burst: 0, multi: 0, rhythm: 1 } },
      { text: '30분~1시간씩 나눠서 여러 번에 걸쳐 완성한다', scores: { deep: 0, burst: 3, multi: 0, rhythm: 1 } },
      { text: '다른 업무와 번갈아가며 조금씩 진행한다', scores: { deep: 0, burst: 0, multi: 3, rhythm: 0 } },
      { text: '정해진 시간(예: 오전 9-11시)에만 집중해서 한다', scores: { deep: 1, burst: 1, multi: 0, rhythm: 3 } },
    ],
  },
  {
    id: 2,
    situation: '업무 중 알림이 계속 옵니다.',
    question: '당신의 반응은?',
    choices: [
      { text: '알림을 끄고 현재 작업에만 몰두한다', scores: { deep: 3, burst: 1, multi: 0, rhythm: 0 } },
      { text: '잠깐 확인하고 나중에 한꺼번에 처리한다', scores: { deep: 1, burst: 3, multi: 0, rhythm: 1 } },
      { text: '바로바로 확인하고 빠르게 대응한다', scores: { deep: 0, burst: 0, multi: 3, rhythm: 0 } },
      { text: '미리 정해둔 시간에만 확인한다', scores: { deep: 0, burst: 0, multi: 0, rhythm: 3 } },
    ],
  },
  {
    id: 3,
    situation: '오후에 갑자기 피곤해졌습니다.',
    question: '어떻게 대처하나요?',
    choices: [
      { text: '잠깐 쉬고 다시 깊게 몰입할 수 있을 때 재개한다', scores: { deep: 3, burst: 0, multi: 0, rhythm: 1 } },
      { text: '쉬운 업무로 바꿔서 짧게 처리한다', scores: { deep: 0, burst: 3, multi: 1, rhythm: 0 } },
      { text: '여러 가지를 왔다 갔다 하며 기분 전환한다', scores: { deep: 0, burst: 0, multi: 3, rhythm: 0 } },
      { text: '낮잠이나 산책 후 정해진 루틴을 다시 시작한다', scores: { deep: 0, burst: 1, multi: 0, rhythm: 3 } },
    ],
  },
  {
    id: 4,
    situation: '새로운 기술/개념을 공부해야 합니다.',
    question: '학습 방식은?',
    choices: [
      { text: '하루 종일 그것만 파고들어 마스터한다', scores: { deep: 3, burst: 0, multi: 0, rhythm: 0 } },
      { text: '매일 30분~1시간씩 조금씩 배워나간다', scores: { deep: 0, burst: 3, multi: 0, rhythm: 2 } },
      { text: '관련 자료를 이것저것 훑어보며 감을 잡는다', scores: { deep: 0, burst: 0, multi: 3, rhythm: 0 } },
      { text: '매일 같은 시간에 정해진 분량만큼 학습한다', scores: { deep: 0, burst: 1, multi: 0, rhythm: 3 } },
    ],
  },
  {
    id: 5,
    situation: '오늘 처리해야 할 업무가 5개입니다.',
    question: '어떤 순서로 진행하나요?',
    choices: [
      { text: '가장 복잡한 걸 먼저 끝까지 완료한다', scores: { deep: 3, burst: 0, multi: 0, rhythm: 1 } },
      { text: '쉬운 것부터 빠르게 처리하고 어려운 건 나중에', scores: { deep: 0, burst: 3, multi: 1, rhythm: 0 } },
      { text: '여러 개를 동시에 조금씩 진행한다', scores: { deep: 0, burst: 0, multi: 3, rhythm: 0 } },
      { text: '시간대별로 업무를 배치해서 순서대로', scores: { deep: 0, burst: 0, multi: 0, rhythm: 3 } },
    ],
  },
  {
    id: 6,
    situation: '회의가 연속으로 3개 잡혔습니다.',
    question: '이상적인 대응은?',
    choices: [
      { text: '가능하면 회의를 합치거나 줄여달라고 요청한다', scores: { deep: 3, burst: 1, multi: 0, rhythm: 0 } },
      { text: '회의 사이사이에 짧게 할 수 있는 업무를 처리한다', scores: { deep: 0, burst: 3, multi: 1, rhythm: 0 } },
      { text: '회의 중에도 관련 업무를 동시에 처리한다', scores: { deep: 0, burst: 0, multi: 3, rhythm: 0 } },
      { text: '회의 전후로 일정을 재조정해서 루틴을 유지한다', scores: { deep: 0, burst: 0, multi: 0, rhythm: 3 } },
    ],
  },
  {
    id: 7,
    situation: '집에서 재택근무를 합니다.',
    question: '가장 잘 맞는 업무 환경은?',
    choices: [
      { text: '방해 없이 혼자서 오래 집중할 수 있어서 좋다', scores: { deep: 3, burst: 0, multi: 0, rhythm: 1 } },
      { text: '시간 블록을 정해서 쉬엄쉬엄 일할 수 있어서 좋다', scores: { deep: 0, burst: 3, multi: 0, rhythm: 1 } },
      { text: '업무와 개인적인 일을 자유롭게 오갈 수 있어서 좋다', scores: { deep: 0, burst: 0, multi: 3, rhythm: 0 } },
      { text: '출퇴근 시간처럼 정해진 루틴이 있으면 더 좋겠다', scores: { deep: 0, burst: 0, multi: 0, rhythm: 3 } },
    ],
  },
  {
    id: 8,
    situation: '마감이 이틀 남았습니다.',
    question: '당신의 작업 패턴은?',
    choices: [
      { text: '오늘 하루 몰입해서 대부분 끝내놓는다', scores: { deep: 3, burst: 0, multi: 0, rhythm: 0 } },
      { text: '오늘/내일 나눠서 집중 세션을 여러 번 진행한다', scores: { deep: 0, burst: 3, multi: 0, rhythm: 1 } },
      { text: '다른 일과 병행하면서 틈틈이 진행한다', scores: { deep: 0, burst: 0, multi: 3, rhythm: 0 } },
      { text: '평소대로 루틴을 유지하면서 꾸준히 한다', scores: { deep: 0, burst: 0, multi: 0, rhythm: 3 } },
    ],
  },
];

const results: Record<ResultType, ResultInfo> = {
  deep: {
    type: 'deep',
    name: '장시간 몰입형',
    emoji: '🎯',
    summary: '한 번 집중하면 몇 시간이고 깊게 몰입하는 타입입니다.',
    traits: [
      '방해 없이 깊게 집중할 때 최고 효율',
      '컨텍스트 스위칭 비용이 큼',
      '복잡한 문제 해결에 강점',
      '한 가지에 오래 집중하는 것을 선호',
    ],
    workStyle: '2~4시간 단위의 긴 집중 블록을 확보하세요. 알림을 끄고 방해 없는 환경을 만드는 것이 중요합니다.',
    tips: [
      '오전 중 가장 집중이 잘 되는 시간에 중요한 업무 배치',
      '회의는 하루의 시작/끝에 몰아서',
      '"방해 금지" 시간을 팀에 공유',
    ],
    relatedTool: { name: '타이머/스톱워치', slug: 'timer' },
  },
  burst: {
    type: 'burst',
    name: '단기 집중형',
    emoji: '⚡',
    summary: '짧은 시간 동안 폭발적으로 집중하고, 휴식 후 다시 반복하는 타입입니다.',
    traits: [
      '25~50분 단위 집중이 효율적',
      '짧은 휴식으로 빠르게 재충전',
      '빠른 업무 전환 가능',
      '마감 압박에서 에너지를 얻음',
    ],
    workStyle: '뽀모도로 기법(25분 집중 + 5분 휴식)이 잘 맞습니다. 업무를 작은 단위로 쪼개서 처리하세요.',
    tips: [
      '타이머를 적극 활용',
      '할 일을 30분 이내로 쪼개기',
      '휴식 시간에는 완전히 쉬기',
    ],
    relatedTool: { name: '타이머/스톱워치', slug: 'timer' },
  },
  multi: {
    type: 'multi',
    name: '멀티태스킹형',
    emoji: '🔀',
    summary: '여러 작업을 동시에 진행하며 지루함을 피하는 타입입니다.',
    traits: [
      '다양한 업무를 번갈아 하면서 흥미 유지',
      '빠른 상황 판단과 전환',
      '급한 요청에 유연하게 대응',
      '동시에 여러 프로젝트 관리 가능',
    ],
    workStyle: '2~3개의 진행 중인 업무를 두고 전환하면서 일하세요. 단, 중요한 업무는 별도 시간을 확보하는 것이 좋습니다.',
    tips: [
      '업무별 진행 상황을 기록해두기',
      '중요한 업무는 "깊은 집중" 시간 확보',
      '너무 많은 업무 동시 진행은 피하기',
    ],
    relatedTool: { name: '날짜/시간 계산기', slug: 'date-calculator' },
  },
  rhythm: {
    type: 'rhythm',
    name: '루틴 기반형',
    emoji: '🔄',
    summary: '정해진 시간과 패턴을 따라 꾸준히 일하는 타입입니다.',
    traits: [
      '규칙적인 일정에서 안정감을 느낌',
      '예측 가능한 업무 흐름 선호',
      '꾸준함으로 장기 목표 달성',
      '습관 형성에 강점',
    ],
    workStyle: '매일 같은 시간에 같은 종류의 업무를 배치하세요. 루틴이 깨지면 회복하는 데 시간이 걸릴 수 있습니다.',
    tips: [
      '주간 시간표 만들어서 활용',
      '업무 시작/종료 루틴 만들기',
      '갑작스러운 일정 변경 최소화',
    ],
    relatedTool: { name: '집중 타이밍 계산기', slug: 'focus-time-calculator' },
  },
};

// ========================================
// 컴포넌트
// ========================================

export function FocusPatternTest() {
  const [state, setState] = useState<TestState>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const result = useMemo(() => {
    if (state !== 'result' || answers.length !== questions.length) return null;

    const scores: Record<ResultType, number> = {
      deep: 0,
      burst: 0,
      multi: 0,
      rhythm: 0,
    };

    answers.forEach((answerIdx, qIdx) => {
      const choice = questions[qIdx].choices[answerIdx];
      (Object.keys(choice.scores) as ResultType[]).forEach((type) => {
        scores[type] += choice.scores[type];
      });
    });

    const maxScore = Math.max(...Object.values(scores));
    const resultType = (Object.keys(scores) as ResultType[]).find(
      (type) => scores[type] === maxScore
    )!;

    return {
      ...results[resultType],
      scores,
      maxScore,
    };
  }, [state, answers]);

  const handleStart = () => {
    setState('testing');
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (choiceIdx: number) => {
    const newAnswers = [...answers, choiceIdx];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setState('result');
    }
  };

  const handleReset = () => {
    setState('intro');
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const getShareUrl = () => {
    if (!result) return '';
    const data = { type: result.type, name: result.name };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/tools/focus-pattern-test#share=${encoded}`;
  };

  // URL hash에서 공유 데이터 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(7)));
        const parsed = JSON.parse(decoded);
        if (parsed.type && results[parsed.type as ResultType]) {
          // 공유된 결과 타입으로 직접 결과 표시
          const fakeAnswers = Array(questions.length).fill(0);
          setAnswers(fakeAnswers);
          setState('result');
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {
        // 잘못된 hash는 무시
      }
    }
  }, []);

  // 인트로
  if (state === 'intro') {
    return (
      <div className="space-y-2">
        <Card variant="bordered" className="p-6 text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-xl font-bold mb-2">집중력 패턴 테스트</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            8개의 상황 질문을 통해 당신의 집중 스타일을 분석합니다.
          </p>
          <Button onClick={handleStart} size="lg">
            테스트 시작
          </Button>
        </Card>
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ※ 참고용 테스트입니다. 결과는 개인차가 있습니다.
        </p>
      </div>
    );
  }

  // 테스트 진행
  if (state === 'testing') {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="space-y-6">
        {/* 프로그레스 바 */}
        <div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>질문 {currentQuestion + 1} / {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 질문 */}
        <Card variant="bordered" className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {question.situation}
          </p>
          <p className="text-lg font-medium mb-6">{question.question}</p>

          <div className="space-y-3">
            {question.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                {choice.text}
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // 결과
  if (state === 'result' && result) {
    const shareText = `나의 집중력 패턴은 "${result.name}" ${result.emoji}\n${result.summary}`;

    return (
      <div className="space-y-6">
        {/* 결과 카드 */}
        <Card variant="bordered" className="p-6 text-center">
          <div className="text-5xl mb-4">{result.emoji}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            당신의 집중력 패턴은
          </p>
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            {result.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {result.summary}
          </p>
        </Card>

        {/* 특성 */}
        <Card variant="bordered" className="p-6">
          <h3 className="font-medium mb-3">특성</h3>
          <ul className="space-y-2">
            {result.traits.map((trait, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-blue-500">•</span>
                {trait}
              </li>
            ))}
          </ul>
        </Card>

        {/* 업무 스타일 */}
        <Card variant="bordered" className="p-6">
          <h3 className="font-medium mb-3">추천 업무 방식</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {result.workStyle}
          </p>
          <h4 className="text-sm font-medium mb-2">팁</h4>
          <ul className="space-y-1">
            {result.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-green-500">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </Card>

        {/* 연계 도구 */}
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">연계 도구</p>
              <p className="font-medium">{result.relatedTool.name}</p>
            </div>
            <a
              href={`/tools/${result.relatedTool.slug}`}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              사용하기
            </a>
          </div>
        </Card>

        {/* 결과 공유 */}
        <div className="mb-4">
          <ResultShareButtons
            url={getShareUrl()}
            title={`집중력 패턴 테스트 결과: ${result.name} ${result.emoji}`}
            description={result.summary}
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleReset} className="flex-1">
            다시 하기
          </Button>
          <CopyButton text={shareText} label="결과 복사" className="flex-1" />
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ※ 참고용 테스트입니다. 결과는 개인차가 있습니다.
        </p>
      </div>
    );
  }

  return null;
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎯 집중력 패턴 테스트란?
        </h2>
        <p className="text-sm leading-relaxed">
          8개의 상황 기반 질문으로 당신의 집중 스타일을 분석하는 테스트입니다.
          장시간 몰입형, 단기 집중형, 멀티태스킹형, 루틴 기반형 중 어떤 패턴에 가까운지 확인하세요.
          자신에게 맞는 업무 방식과 집중력 향상 팁을 제공합니다.
          뽀모도로, 딥워크, 타임블로킹 등 자신에게 맞는 방법을 찾아보세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⚡ 4가지 집중 패턴
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">유형</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">특징</th>
                <th className="text-left py-2 font-semibold text-gray-900 dark:text-white">추천 기법</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">🎯 장시간 몰입형</td>
                <td className="py-2 pr-4">2~4시간 깊은 집중</td>
                <td className="py-2">딥워크, 방해 차단</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">⚡ 단기 집중형</td>
                <td className="py-2 pr-4">짧고 강렬한 집중</td>
                <td className="py-2">뽀모도로 기법</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">🔀 멀티태스킹형</td>
                <td className="py-2 pr-4">여러 작업 동시 진행</td>
                <td className="py-2">작업 전환, 다양성 유지</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">🔄 루틴 기반형</td>
                <td className="py-2 pr-4">규칙적인 패턴 선호</td>
                <td className="py-2">타임블로킹, 일정 고정</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 집중력 향상 팁
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>환경 최적화:</strong> 자신에게 맞는 작업 환경 조성</li>
          <li><strong>알림 관리:</strong> 집중 시간에는 불필요한 알림 차단</li>
          <li><strong>휴식 포함:</strong> 적절한 휴식으로 지속 가능한 집중</li>
          <li><strong>에너지 파악:</strong> 하루 중 집중이 잘 되는 시간대 활용</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '패턴은 바꿀 수 있나요?', answer: '네, 집중 패턴은 연습과 습관으로 변화할 수 있습니다. 다만 자신에게 자연스러운 패턴을 활용하는 것이 더 효율적일 수 있습니다.' },
          { question: '어떤 유형이 가장 좋은가요?', answer: '모든 유형은 각자의 장단점이 있습니다. 중요한 것은 자신의 패턴을 이해하고 상황에 맞게 활용하는 것입니다.' },
          { question: '테스트 결과가 맞지 않는 것 같아요', answer: '이 테스트는 일반적인 경향성을 보여줍니다. 실제로는 상황, 기분, 업무 종류에 따라 다르게 집중할 수 있습니다.' },
        ]}
      />
    </div>
  );
}
