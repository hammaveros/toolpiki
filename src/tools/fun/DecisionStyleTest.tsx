'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { cn } from '@/lib/utils/cn';
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

type ResultType = 'analyzer' | 'intuitive' | 'collaborative' | 'decisive';

interface ResultInfo {
  type: ResultType;
  name: string;
  summary: string;
  traits: string[];
  behavior: string;
  strengths: string;
  caution: string;
  shareText: string;
}

type TestState = 'intro' | 'testing' | 'calculating' | 'result';

// ========================================
// 테스트 데이터
// ========================================

const questions: Question[] = [
  {
    id: 1,
    situation: '중요한 프로젝트의 마감이 일주일 남았습니다. 팀원 중 한 명이 다른 방향의 아이디어를 강하게 제안합니다.',
    question: '이 상황에서 당신의 첫 반응은?',
    choices: [
      { text: '두 방향의 장단점을 문서로 정리해 비교해본다', scores: { analyzer: 3, intuitive: 0, collaborative: 1, decisive: 0 } },
      { text: '직감적으로 더 나아 보이는 쪽을 빠르게 판단한다', scores: { analyzer: 0, intuitive: 3, collaborative: 0, decisive: 1 } },
      { text: '팀원들의 의견을 들어본 뒤 다수의 의견을 따른다', scores: { analyzer: 0, intuitive: 0, collaborative: 3, decisive: 0 } },
      { text: '일정을 고려해 현재 방향을 유지하기로 결정한다', scores: { analyzer: 1, intuitive: 0, collaborative: 0, decisive: 3 } },
    ],
  },
  {
    id: 2,
    situation: '새로운 업무 도구를 도입해야 합니다. 후보군이 5개로 좁혀졌습니다.',
    question: '최종 선택을 위해 가장 먼저 하는 행동은?',
    choices: [
      { text: '각 도구의 기능, 가격, 리뷰를 표로 정리한다', scores: { analyzer: 3, intuitive: 0, collaborative: 1, decisive: 0 } },
      { text: '가장 마음에 드는 두세 개만 골라 직접 써본다', scores: { analyzer: 0, intuitive: 3, collaborative: 0, decisive: 1 } },
      { text: '이미 사용해본 동료의 추천을 물어본다', scores: { analyzer: 0, intuitive: 1, collaborative: 3, decisive: 0 } },
      { text: '가장 많이 쓰이는 것으로 바로 결정한다', scores: { analyzer: 0, intuitive: 0, collaborative: 1, decisive: 3 } },
    ],
  },
  {
    id: 3,
    situation: '처음 가보는 여행지에서 저녁 식사 장소를 정해야 합니다.',
    question: '당신은 주로 어떻게 결정하나요?',
    choices: [
      { text: '리뷰 평점과 메뉴, 가격대를 꼼꼼히 비교한다', scores: { analyzer: 3, intuitive: 0, collaborative: 0, decisive: 0 } },
      { text: '걸으면서 분위기 좋아 보이는 곳에 들어간다', scores: { analyzer: 0, intuitive: 3, collaborative: 0, decisive: 1 } },
      { text: '일행에게 어떤 음식이 먹고 싶은지 물어본다', scores: { analyzer: 0, intuitive: 0, collaborative: 3, decisive: 0 } },
      { text: '눈에 보이는 가장 가까운 괜찮은 곳으로 간다', scores: { analyzer: 0, intuitive: 1, collaborative: 0, decisive: 3 } },
    ],
  },
  {
    id: 4,
    situation: '팀 내 갈등이 발생했습니다. 두 동료가 서로 다른 주장을 하며 분위기가 불편합니다.',
    question: '당신이 가장 먼저 생각하는 것은?',
    choices: [
      { text: '어느 쪽 의견이 객관적으로 타당한지 분석한다', scores: { analyzer: 3, intuitive: 0, collaborative: 1, decisive: 0 } },
      { text: '갈등의 핵심이 무엇인지 감을 잡으려 한다', scores: { analyzer: 1, intuitive: 3, collaborative: 0, decisive: 0 } },
      { text: '양쪽의 이야기를 모두 경청하며 중재한다', scores: { analyzer: 0, intuitive: 0, collaborative: 3, decisive: 1 } },
      { text: '업무 진행을 위해 빠르게 방향을 정해준다', scores: { analyzer: 0, intuitive: 0, collaborative: 0, decisive: 3 } },
    ],
  },
  {
    id: 5,
    situation: '새로운 취미를 시작하려 합니다. 주변에서 다양한 활동을 추천해줍니다.',
    question: '당신의 선택 방식은?',
    choices: [
      { text: '각 취미의 비용, 시간, 효과를 따져본다', scores: { analyzer: 3, intuitive: 0, collaborative: 0, decisive: 1 } },
      { text: '끌리는 게 있으면 일단 체험해본다', scores: { analyzer: 0, intuitive: 3, collaborative: 0, decisive: 1 } },
      { text: '함께 할 사람이 있는 활동을 우선으로 고른다', scores: { analyzer: 0, intuitive: 0, collaborative: 3, decisive: 0 } },
      { text: '너무 고민하지 않고 하나를 바로 시작한다', scores: { analyzer: 0, intuitive: 1, collaborative: 0, decisive: 3 } },
    ],
  },
  {
    id: 6,
    situation: '이직 제안을 받았습니다. 현재 직장도 나쁘지 않지만, 새 회사도 매력적입니다.',
    question: '결정을 내리기 위해 당신은 무엇을 하나요?',
    choices: [
      { text: '연봉, 복지, 성장 가능성을 수치화해 비교한다', scores: { analyzer: 3, intuitive: 0, collaborative: 0, decisive: 0 } },
      { text: '어느 쪽에서 일할 때 더 설레는지 느껴본다', scores: { analyzer: 0, intuitive: 3, collaborative: 0, decisive: 0 } },
      { text: '가족이나 친한 지인에게 조언을 구한다', scores: { analyzer: 0, intuitive: 0, collaborative: 3, decisive: 0 } },
      { text: '고민이 길어지면 오히려 손해라 생각하고 정한다', scores: { analyzer: 0, intuitive: 1, collaborative: 0, decisive: 3 } },
    ],
  },
  {
    id: 7,
    situation: '새로운 기술을 배워야 할 상황입니다. 선택지가 여러 개 있습니다.',
    question: '학습 대상을 어떻게 정하나요?',
    choices: [
      { text: '시장 수요와 활용도를 조사해 결정한다', scores: { analyzer: 3, intuitive: 0, collaborative: 1, decisive: 0 } },
      { text: '해보고 싶은 것부터 시작한다', scores: { analyzer: 0, intuitive: 3, collaborative: 0, decisive: 1 } },
      { text: '현업 종사자에게 뭘 배우면 좋을지 물어본다', scores: { analyzer: 1, intuitive: 0, collaborative: 3, decisive: 0 } },
      { text: '가장 빨리 시작할 수 있는 것을 고른다', scores: { analyzer: 0, intuitive: 0, collaborative: 0, decisive: 3 } },
    ],
  },
  {
    id: 8,
    situation: '친구와 약속 시간이 겹쳐 하나를 취소해야 합니다.',
    question: '당신의 결정 기준은?',
    choices: [
      { text: '어느 쪽이 변경이 어려운지, 중요도를 비교한다', scores: { analyzer: 3, intuitive: 0, collaborative: 1, decisive: 0 } },
      { text: '더 끌리는 쪽을 선택한다', scores: { analyzer: 0, intuitive: 3, collaborative: 0, decisive: 0 } },
      { text: '두 친구 모두에게 상황을 설명하고 양해를 구한다', scores: { analyzer: 0, intuitive: 0, collaborative: 3, decisive: 0 } },
      { text: '먼저 잡힌 약속을 유지한다', scores: { analyzer: 1, intuitive: 0, collaborative: 0, decisive: 3 } },
    ],
  },
  {
    id: 9,
    situation: '쇼핑 중 마음에 드는 제품이 두 개 있습니다. 가격은 비슷합니다.',
    question: '당신은 어떻게 하나를 고르나요?',
    choices: [
      { text: '스펙과 후기를 더 검색해본다', scores: { analyzer: 3, intuitive: 0, collaborative: 0, decisive: 0 } },
      { text: '첫인상이 좋았던 것을 선택한다', scores: { analyzer: 0, intuitive: 3, collaborative: 0, decisive: 1 } },
      { text: '함께 온 사람의 의견을 묻는다', scores: { analyzer: 0, intuitive: 0, collaborative: 3, decisive: 0 } },
      { text: '오래 고민하지 않고 하나를 집는다', scores: { analyzer: 0, intuitive: 0, collaborative: 0, decisive: 3 } },
    ],
  },
  {
    id: 10,
    situation: '회의에서 본인의 의견과 다른 제안이 채택되려 합니다.',
    question: '당신의 반응은?',
    choices: [
      { text: '데이터나 근거를 들어 다시 한번 설명한다', scores: { analyzer: 3, intuitive: 0, collaborative: 0, decisive: 1 } },
      { text: '직감적으로 왜 다른지 느낌을 전달한다', scores: { analyzer: 0, intuitive: 3, collaborative: 0, decisive: 0 } },
      { text: '다수의 의견을 존중하고 따른다', scores: { analyzer: 0, intuitive: 0, collaborative: 3, decisive: 0 } },
      { text: '결정된 방향에 맞춰 빠르게 실행에 집중한다', scores: { analyzer: 0, intuitive: 0, collaborative: 1, decisive: 3 } },
    ],
  },
  {
    id: 11,
    situation: '예상치 못한 문제가 발생해 계획을 수정해야 합니다.',
    question: '당신의 대응 방식은?',
    choices: [
      { text: '원인을 파악하고 대안을 체계적으로 검토한다', scores: { analyzer: 3, intuitive: 0, collaborative: 0, decisive: 0 } },
      { text: '그 순간 떠오르는 해결책을 시도해본다', scores: { analyzer: 0, intuitive: 3, collaborative: 0, decisive: 1 } },
      { text: '주변에 도움을 요청하며 함께 해결한다', scores: { analyzer: 0, intuitive: 0, collaborative: 3, decisive: 0 } },
      { text: '가장 빠른 해결책을 선택해 실행한다', scores: { analyzer: 0, intuitive: 0, collaborative: 0, decisive: 3 } },
    ],
  },
  {
    id: 12,
    situation: '새로운 사람을 만나는 자리에서 대화 주제를 정해야 합니다.',
    question: '당신은 주로 어떻게 하나요?',
    choices: [
      { text: '상대의 관심사나 배경을 미리 파악해둔다', scores: { analyzer: 3, intuitive: 0, collaborative: 1, decisive: 0 } },
      { text: '상황 흐름에 따라 자연스럽게 이야기한다', scores: { analyzer: 0, intuitive: 3, collaborative: 1, decisive: 0 } },
      { text: '상대가 편하게 말할 수 있도록 질문한다', scores: { analyzer: 0, intuitive: 0, collaborative: 3, decisive: 0 } },
      { text: '먼저 말을 꺼내 분위기를 이끈다', scores: { analyzer: 0, intuitive: 1, collaborative: 0, decisive: 3 } },
    ],
  },
];

const results: Record<ResultType, ResultInfo> = {
  analyzer: {
    type: 'analyzer',
    name: '분석형',
    summary: '논리와 데이터를 기반으로 판단하는 경향이 있습니다.',
    traits: [
      '결정 전에 충분한 정보를 수집하려 합니다',
      '장단점을 비교하는 과정을 중요시합니다',
      '감정보다 객관적 기준을 우선시하는 편입니다',
    ],
    behavior: '중요한 결정 앞에서 자료를 수집하고, 표나 리스트로 정리하며, 여러 시나리오를 검토하는 모습이 자주 관찰됩니다. 결정을 내리기까지 시간이 걸리더라도 근거가 충분해야 편안함을 느끼는 경향이 있습니다.',
    strengths: '신중한 판단으로 실수를 줄이고, 복잡한 상황에서도 체계적인 접근이 가능합니다. 타인에게 결정의 근거를 명확하게 설명할 수 있습니다.',
    caution: '정보 수집에 과도한 시간을 쓰거나, 완벽한 답을 찾으려다 결정 시점을 놓치는 경향이 나타날 수 있습니다. 때로는 적당한 선에서 결정을 내리는 연습이 도움이 됩니다.',
    shareText: '분석형 - 논리와 데이터를 기반으로 신중하게 결정하는 스타일',
  },
  intuitive: {
    type: 'intuitive',
    name: '직관형',
    summary: '경험과 감각을 바탕으로 빠르게 판단하는 경향이 있습니다.',
    traits: [
      '첫인상이나 직감을 중요하게 여깁니다',
      '복잡한 분석보다 전체적인 느낌으로 결정합니다',
      '새로운 시도에 대한 거부감이 적은 편입니다',
    ],
    behavior: '상황을 접했을 때 즉각적으로 방향을 잡는 경우가 많습니다. 설명하기 어려운 감이나 경험에서 오는 확신을 신뢰하며, 일단 시도해보고 조정하는 방식을 선호합니다.',
    strengths: '빠른 의사결정이 가능하고, 복잡한 상황에서도 핵심을 포착하는 능력이 있습니다. 변화에 유연하게 대응할 수 있습니다.',
    caution: '직감에 의존하다 보면 중요한 세부사항을 놓치거나, 결정의 근거를 타인에게 설명하기 어려울 수 있습니다. 중요한 결정에서는 간단한 검증 과정을 거치는 것이 도움이 됩니다.',
    shareText: '직관형 - 경험과 감각으로 빠르게 방향을 잡는 스타일',
  },
  collaborative: {
    type: 'collaborative',
    name: '협력형',
    summary: '타인의 의견을 존중하며 함께 결정하려는 경향이 있습니다.',
    traits: [
      '결정 전에 주변의 의견을 듣는 것을 선호합니다',
      '합의와 조화를 중요하게 생각합니다',
      '혼자보다 함께 결정할 때 편안함을 느낍니다',
    ],
    behavior: '중요한 결정 앞에서 신뢰하는 사람들의 조언을 구하고, 다양한 관점을 수렴하려 합니다. 모두가 납득할 수 있는 방향을 찾으려 노력하며, 갈등 상황에서는 중재 역할을 하는 경우가 많습니다.',
    strengths: '팀 내 다양한 의견을 조율하고, 구성원들의 참여감을 높일 수 있습니다. 관계를 유지하면서 결정을 이끌어내는 능력이 있습니다.',
    caution: '타인의 의견에 지나치게 의존하거나, 모든 사람을 만족시키려다 결정이 지연될 수 있습니다. 때로는 자신의 판단을 믿고 주도적으로 결정하는 연습이 필요할 수 있습니다.',
    shareText: '협력형 - 타인의 의견을 존중하며 함께 방향을 찾는 스타일',
  },
  decisive: {
    type: 'decisive',
    name: '실행형',
    summary: '빠른 결정과 실행을 중시하는 경향이 있습니다.',
    traits: [
      '결정을 미루는 것을 불편하게 느낍니다',
      '완벽보다 속도를 우선시하는 편입니다',
      '결정 후 바로 행동으로 옮기려 합니다',
    ],
    behavior: '선택의 순간에서 오래 머무르지 않고 빠르게 방향을 정합니다. 결정이 틀릴 수 있다는 점을 받아들이면서도, 일단 실행하고 조정하는 것이 낫다고 생각하는 경향이 있습니다.',
    strengths: '추진력이 있어 프로젝트를 앞으로 밀고 나갈 수 있습니다. 불확실한 상황에서도 주저하지 않고 행동에 옮길 수 있습니다.',
    caution: '너무 빠른 결정으로 중요한 요소를 간과하거나, 타인의 의견을 충분히 반영하지 못할 수 있습니다. 중요한 사안에서는 잠시 멈추고 검토하는 습관이 도움이 됩니다.',
    shareText: '실행형 - 빠른 결정과 행동으로 추진력을 보여주는 스타일',
  },
};

// ========================================
// 컴포넌트
// ========================================

export function DecisionStyleTest() {
  const [state, setState] = useState<TestState>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<Record<ResultType, number>>({
    analyzer: 0,
    intuitive: 0,
    collaborative: 0,
    decisive: 0,
  });

  const progress = useMemo(() => {
    return Math.round((currentQuestion / questions.length) * 100);
  }, [currentQuestion]);

  const resultType = useMemo((): ResultType => {
    const entries = Object.entries(scores) as [ResultType, number][];
    return entries.reduce((max, curr) => (curr[1] > max[1] ? curr : max))[0];
  }, [scores]);

  const handleStart = useCallback(() => {
    setState('testing');
    setCurrentQuestion(0);
    setAnswers([]);
    setScores({ analyzer: 0, intuitive: 0, collaborative: 0, decisive: 0 });
  }, []);

  const handleAnswer = useCallback((choiceIndex: number) => {
    const question = questions[currentQuestion];
    const choice = question.choices[choiceIndex];

    const newScores = { ...scores };
    (Object.entries(choice.scores) as [ResultType, number][]).forEach(([type, score]) => {
      newScores[type] += score;
    });

    setScores(newScores);
    setAnswers([...answers, choiceIndex]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setState('calculating');
      setTimeout(() => {
        setState('result');
      }, 1500);
    }
  }, [currentQuestion, scores, answers]);

  const handlePrev = useCallback(() => {
    if (currentQuestion > 0) {
      const prevAnswer = answers[currentQuestion - 1];
      const prevQuestion = questions[currentQuestion - 1];
      const prevChoice = prevQuestion.choices[prevAnswer];

      const newScores = { ...scores };
      (Object.entries(prevChoice.scores) as [ResultType, number][]).forEach(([type, score]) => {
        newScores[type] -= score;
      });

      setScores(newScores);
      setAnswers(answers.slice(0, -1));
      setCurrentQuestion(currentQuestion - 1);
    }
  }, [currentQuestion, scores, answers]);

  const handleReset = useCallback(() => {
    setState('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setScores({ analyzer: 0, intuitive: 0, collaborative: 0, decisive: 0 });
  }, []);

  const getShareText = useCallback(() => {
    const result = results[resultType];
    return `의사결정 스타일 테스트 결과\n\n${result.name}\n${result.summary}\n\n주요 특징:\n${result.traits.map(t => `• ${t}`).join('\n')}\n\nJSSpace에서 테스트 해보기`;
  }, [resultType]);

  const getShareUrl = useCallback(() => {
    const data = { type: resultType, name: results[resultType].name };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/tools/decision-style-test#share=${encoded}`;
  }, [resultType]);

  // URL hash에서 공유 데이터 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(7)));
        const parsed = JSON.parse(decoded);
        if (parsed.type && results[parsed.type as ResultType]) {
          setState('result');
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <div className="space-y-2">
      {state === 'intro' && <IntroScreen onStart={handleStart} />}

      {state === 'testing' && (
        <QuestionScreen
          question={questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={questions.length}
          progress={progress}
          onAnswer={handleAnswer}
          onPrev={handlePrev}
          canGoPrev={currentQuestion > 0}
        />
      )}

      {state === 'calculating' && <CalculatingScreen />}

      {state === 'result' && (
        <ResultScreen
          result={results[resultType]}
          scores={scores}
          shareText={getShareText()}
          shareUrl={getShareUrl()}
          onReset={handleReset}
        />
      )}

      {state === 'intro' && <SeoContent />}
    </div>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <Card variant="bordered" className="p-4 md:p-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          의사결정 스타일 테스트
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          일상과 업무에서 마주하는 다양한 상황에서 당신은 어떻게 결정을 내리나요?
          12개의 상황별 질문을 통해 본인의 의사결정 패턴을 확인해 보세요.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            <span>약 3분 소요</span>
          </div>
          <div className="flex items-center gap-2">
            <ListIcon className="w-4 h-4" />
            <span>12개 문항</span>
          </div>
          <div className="flex items-center gap-2">
            <ChartIcon className="w-4 h-4" />
            <span>4가지 유형</span>
          </div>
        </div>

        <Button size="lg" onClick={onStart}>
          테스트 시작하기
        </Button>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
          이 테스트는 참고용이며, 결과가 고정된 성격을 나타내지 않습니다.
        </p>
      </div>
    </Card>
  );
}

function QuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  progress,
  onAnswer,
  onPrev,
  canGoPrev,
}: {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  progress: number;
  onAnswer: (index: number) => void;
  onPrev: () => void;
  canGoPrev: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* 프로그레스 바 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{questionNumber} / {totalQuestions}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 질문 카드 */}
      <Card variant="bordered" className="p-6 md:p-8">
        <div className="space-y-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {question.situation}
          </div>

          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => onAnswer(index)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border-2 transition-all duration-150',
                  'border-gray-200 dark:border-gray-700',
                  'hover:border-blue-400 dark:hover:border-blue-500',
                  'hover:bg-blue-50 dark:hover:bg-blue-900/20',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                )}
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {choice.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* 네비게이션 */}
      {canGoPrev && (
        <div className="flex justify-start">
          <Button variant="ghost" size="sm" onClick={onPrev}>
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            이전 질문
          </Button>
        </div>
      )}
    </div>
  );
}

function CalculatingScreen() {
  return (
    <Card variant="bordered" className="p-12">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <div>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            결과 분석 중
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            응답을 바탕으로 의사결정 패턴을 분석하고 있습니다
          </p>
        </div>
      </div>
    </Card>
  );
}

function ResultScreen({
  result,
  scores,
  shareText,
  shareUrl,
  onReset,
}: {
  result: ResultInfo;
  scores: Record<ResultType, number>;
  shareText: string;
  shareUrl: string;
  onReset: () => void;
}) {
  const maxScore = Math.max(...Object.values(scores));

  return (
    <div className="space-y-6">
      {/* 메인 결과 카드 */}
      <Card variant="bordered" className="p-6 md:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
            <ResultIcon type={result.type} className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {result.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {result.summary}
          </p>
        </div>

        {/* 점수 시각화 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {(Object.entries(scores) as [ResultType, number][]).map(([type, score]) => (
            <div key={type} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {results[type].name}
                </span>
                <span className={cn(
                  'font-medium',
                  type === result.type
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-500'
                )}>
                  {Math.round((score / maxScore) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-500 rounded-full',
                    type === result.type
                      ? 'bg-blue-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  )}
                  style={{ width: `${(score / maxScore) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 주요 특징 */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              주요 특징
            </h3>
            <ul className="space-y-2">
              {result.traits.map((trait, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  {trait}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              이런 모습이 자주 나타납니다
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {result.behavior}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                강점
              </h4>
              <p className="text-sm text-green-700 dark:text-green-400 leading-relaxed">
                {result.strengths}
              </p>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">
                주의할 점
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                {result.caution}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 결과 공유 */}
      <div className="flex justify-center">
        <ResultShareButtons
          url={shareUrl}
          title={`의사결정 스타일 테스트: ${result.name}`}
          description={result.summary}
        />
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <CopyButton text={shareText} label="결과 복사" className="flex-1 sm:flex-initial" />
        <Button variant="outline" onClick={onReset} className="flex-1 sm:flex-initial">
          다시 테스트하기
        </Button>
      </div>

      {/* 안내 문구 */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-500">
        이 테스트는 참고용이며, 사람은 상황에 따라 다양한 방식으로 결정을 내릴 수 있습니다.
      </p>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🧠 의사결정 스타일 테스트란?
        </h2>
        <p className="text-sm leading-relaxed">
          12개의 상황별 질문을 통해 본인의 의사결정 패턴을 파악하는 테스트입니다.
          분석형, 직관형, 협력형, 실행형 4가지 유형 중 어디에 가까운지 확인할 수 있습니다.
          약 3분 정도 소요되며, 자기 이해와 성장을 위한 참고 자료로 활용해보세요.
          결과에는 강점, 주의점, 업무 팁이 포함됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎯 4가지 의사결정 유형
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">유형</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">특징</th>
                <th className="text-left py-2 font-semibold text-gray-900 dark:text-white">강점</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">📊 분석형</td>
                <td className="py-2 pr-4">데이터와 논리 기반</td>
                <td className="py-2">신중함, 체계적 접근</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">💡 직관형</td>
                <td className="py-2 pr-4">감각과 경험 기반</td>
                <td className="py-2">빠른 판단, 창의성</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">🤝 협력형</td>
                <td className="py-2 pr-4">타인 의견 중시</td>
                <td className="py-2">합의 도출, 관계 유지</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">⚡ 실행형</td>
                <td className="py-2 pr-4">빠른 결정과 실행</td>
                <td className="py-2">추진력, 효율성</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 테스트 활용 팁
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>솔직하게:</strong> 평소 행동을 떠올리며 답변하세요</li>
          <li><strong>팀워크:</strong> 팀원들과 결과를 공유하면 협업에 도움</li>
          <li><strong>자기계발:</strong> 강점은 살리고 주의점은 보완하세요</li>
          <li><strong>유연하게:</strong> 상황에 따라 다른 스타일을 활용할 수 있어요</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '테스트 결과가 고정된 성격인가요?', answer: '아니요, 이 테스트는 현재의 경향성을 보여줄 뿐입니다. 사람은 상황에 따라 다양한 방식으로 결정을 내릴 수 있습니다.' },
          { question: '좋은 유형과 나쁜 유형이 있나요?', answer: '모든 유형은 각자의 강점이 있습니다. 어떤 유형도 절대적으로 좋거나 나쁘지 않으며, 상황에 따라 적합한 방식이 다릅니다.' },
          { question: '결과를 어떻게 활용하면 좋을까요?', answer: '자신의 경향성을 이해하고, 강점은 살리면서 주의점은 의식적으로 보완하는 데 활용하세요. 팀원들과 공유하면 소통에도 도움됩니다.' },
        ]}
      />
    </div>
  );
}

// ========================================
// 아이콘 컴포넌트
// ========================================

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v5l3 3" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 16v-4m4 4v-8m4 8v-6m4 6v-10" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ResultIcon({ type, className }: { type: ResultType; className?: string }) {
  switch (type) {
    case 'analyzer':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'intuitive':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    case 'collaborative':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'decisive':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
}
