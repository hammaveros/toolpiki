'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

interface RestMethod {
  name: string;
  effort: '낮음' | '보통' | '높음';
  duration: '짧음' | '보통' | '김';
  social: boolean;
  active: boolean;
  indoor: boolean;
  effect: string;
}

const restMethods: RestMethod[] = [
  { name: '낮잠 자기', effort: '낮음', duration: '짧음', social: false, active: false, indoor: true, effect: '체력 회복' },
  { name: '명상/호흡', effort: '낮음', duration: '짧음', social: false, active: false, indoor: true, effect: '마음 정리' },
  { name: '따뜻한 목욕', effort: '낮음', duration: '보통', social: false, active: false, indoor: true, effect: '근육 이완' },
  { name: '음악 듣기', effort: '낮음', duration: '짧음', social: false, active: false, indoor: true, effect: '기분 전환' },
  { name: '차/커피 마시기', effort: '낮음', duration: '짧음', social: false, active: false, indoor: true, effect: '여유 느끼기' },
  { name: '가벼운 스트레칭', effort: '보통', duration: '짧음', social: false, active: true, indoor: true, effect: '몸 풀기' },
  { name: '산책하기', effort: '보통', duration: '보통', social: true, active: true, indoor: false, effect: '환기' },
  { name: '친구와 수다', effort: '보통', duration: '보통', social: true, active: false, indoor: true, effect: '스트레스 해소' },
  { name: '영화/드라마 보기', effort: '낮음', duration: '김', social: false, active: false, indoor: true, effect: '몰입' },
  { name: '게임하기', effort: '보통', duration: '보통', social: false, active: false, indoor: true, effect: '집중 전환' },
  { name: '요가', effort: '보통', duration: '보통', social: false, active: true, indoor: true, effect: '심신 안정' },
  { name: '독서', effort: '낮음', duration: '보통', social: false, active: false, indoor: true, effect: '정신적 휴식' },
  { name: '취미 활동', effort: '보통', duration: '김', social: false, active: true, indoor: true, effect: '성취감' },
  { name: '아무것도 안 하기', effort: '낮음', duration: '보통', social: false, active: false, indoor: true, effect: '완전한 휴식' },
  { name: '맛있는 거 먹기', effort: '낮음', duration: '짧음', social: true, active: false, indoor: true, effect: '보상감' },
  { name: '반려동물과 놀기', effort: '보통', duration: '보통', social: false, active: true, indoor: true, effect: '힐링' },
];

type Tiredness = 'physical' | 'mental' | 'both';
type Time = 'short' | 'medium' | 'long';
type Style = 'active' | 'passive';
type Social = 'alone' | 'together' | 'any';

export function RestRecommender() {
  const [tiredness, setTiredness] = useState<Tiredness | null>(null);
  const [time, setTime] = useState<Time | null>(null);
  const [style, setStyle] = useState<Style | null>(null);
  const [social, setSocial] = useState<Social | null>(null);
  const [showResult, setShowResult] = useState(false);

  const recommendations = useMemo(() => {
    const scored = restMethods.map((method) => {
      let score = 0;
      const reasons: string[] = [];

      // 피로 유형
      if (tiredness === 'physical' && !method.active && method.effort === '낮음') {
        score += 3; reasons.push('몸 쉬기');
      }
      if (tiredness === 'mental' && method.effect.includes('마음') || method.effect.includes('정신')) {
        score += 2; reasons.push('정신 휴식');
      }
      if (tiredness === 'both' && method.effort === '낮음') {
        score += 2; reasons.push('완전 휴식');
      }

      // 시간
      if (time === 'short' && method.duration === '짧음') {
        score += 3; reasons.push('짧게');
      }
      if (time === 'long' && method.duration === '김') {
        score += 2; reasons.push('충분히');
      }

      // 스타일
      if (style === 'active' && method.active) {
        score += 2; reasons.push('활동적');
      }
      if (style === 'passive' && !method.active) {
        score += 2; reasons.push('편하게');
      }

      // 소셜
      if (social === 'alone' && !method.social) {
        score += 2; reasons.push('혼자서');
      }
      if (social === 'together' && method.social) {
        score += 2; reasons.push('함께');
      }

      return { method, score, reason: reasons.slice(0, 2).join(', ') || method.effect };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [tiredness, time, style, social]);

  const handleReset = () => {
    setTiredness(null);
    setTime(null);
    setStyle(null);
    setSocial(null);
    setShowResult(false);
  };

  const renderOption = <T extends string>(
    label: string,
    value: T | null,
    setValue: (v: T) => void,
    options: { key: T; label: string }[]
  ) => (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[70px]">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setValue(opt.key)}
            className={`px-2 py-1 rounded text-xs transition-all ${
              value === opt.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Card variant="bordered" className="p-3 space-y-2">
        {renderOption('피로 유형', tiredness, setTiredness, [
          { key: 'physical', label: '몸이 피곤' },
          { key: 'mental', label: '정신적 피로' },
          { key: 'both', label: '둘 다' },
        ])}

        {renderOption('쉴 수 있는 시간', time, setTime, [
          { key: 'short', label: '잠깐 (15분)' },
          { key: 'medium', label: '조금 (1시간)' },
          { key: 'long', label: '충분히 (반나절+)' },
        ])}

        {renderOption('휴식 스타일', style, setStyle, [
          { key: 'passive', label: '가만히 쉬기' },
          { key: 'active', label: '움직이면서' },
        ])}

        {renderOption('함께 할 사람', social, setSocial, [
          { key: 'alone', label: '혼자' },
          { key: 'together', label: '누군가와' },
          { key: 'any', label: '상관없음' },
        ])}
      </Card>

      <div className="flex gap-3 justify-center">
        <Button onClick={() => setShowResult(true)}>
          추천 보기
        </Button>
        <Button variant="secondary" onClick={handleReset}>
          다시 선택
        </Button>
      </div>

      {showResult && (
        <Card variant="bordered" className="p-4 overflow-x-auto">
          <p className="text-sm text-gray-500 mb-3">※ 참고용 추천입니다</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">휴식 방법</th>
                <th className="text-center py-2 px-2">부담도</th>
                <th className="text-center py-2 px-2">소요시간</th>
                <th className="text-left py-2 px-2">기대 효과</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map(({ method, reason }, idx) => (
                <tr
                  key={method.name}
                  className={`border-b dark:border-gray-700 ${idx === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}
                >
                  <td className="py-2 px-2 font-medium">
                    {idx === 0 && '⭐ '}{method.name}
                  </td>
                  <td className="py-2 px-2 text-center">{method.effort}</td>
                  <td className="py-2 px-2 text-center">{method.duration}</td>
                  <td className="py-2 px-2 text-gray-600 dark:text-gray-400">{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 지금 상황에 맞는 휴식 방법을 비교해보세요</p>
        <p>• 모든 조건을 선택할 필요는 없습니다</p>
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
          🧘 휴식 추천이란?
        </h2>
        <p className="text-sm leading-relaxed">
          지금 상태에 맞는 최적의 휴식 방법을 추천해주는 도구입니다.
          피로도, 가용 시간, 실내/실외 선호, 에너지 수준 등을 고려하여
          효과적으로 회복할 수 있는 휴식 방법을 제안합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💆 효과적인 휴식의 종류
        </h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <div>
            <p className="font-medium">신체적 휴식</p>
            <p>수면, 낮잠, 스트레칭, 가벼운 산책 등 몸의 피로를 풀어주는 활동입니다. 장시간 앉아 일하는 사람에게 특히 중요합니다.</p>
          </div>
          <div>
            <p className="font-medium">정신적 휴식</p>
            <p>명상, 음악 감상, 자연 감상 등 머리를 비우고 마음을 정리하는 활동입니다. 업무 스트레스가 높을 때 효과적입니다.</p>
          </div>
          <div>
            <p className="font-medium">사회적 휴식</p>
            <p>혼자만의 시간을 갖거나, 반대로 친한 사람과 대화하는 것도 휴식이 됩니다. 자신에게 맞는 방식을 선택하세요.</p>
          </div>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '어떤 기준으로 휴식을 추천하나요?',
            answer: '현재 피로도, 가용 시간, 선호하는 활동 유형(실내/실외, 활동적/비활동적) 등을 종합하여 가장 효과적인 휴식 방법을 추천합니다.',
          },
          {
            question: '짧은 시간에도 효과적으로 쉴 수 있나요?',
            answer: '네, 5분 심호흡, 10분 스트레칭, 15분 파워 낮잠 등 짧은 시간에도 충분히 효과적인 휴식 방법이 있습니다.',
          },
          {
            question: '휴식과 게으름의 차이는 무엇인가요?',
            answer: '의도적으로 회복을 위해 시간을 쓰는 것이 휴식이고, 목적 없이 시간을 흘려보내는 것이 게으름입니다. 계획된 휴식은 생산성을 높여줍니다.',
          },
        ]}
      />
    </div>
  );
}
