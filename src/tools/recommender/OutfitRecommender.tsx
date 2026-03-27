'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

interface Outfit {
  name: string;
  formality: '캐주얼' | '세미정장' | '정장';
  comfort: '높음' | '보통' | '낮음';
  weather: ('더움' | '보통' | '추움')[];
  occasion: string[];
}

const outfits: Outfit[] = [
  { name: '청바지 + 티셔츠', formality: '캐주얼', comfort: '높음', weather: ['더움', '보통'], occasion: ['일상', '데이트'] },
  { name: '슬랙스 + 셔츠', formality: '세미정장', comfort: '보통', weather: ['보통', '추움'], occasion: ['출근', '미팅', '데이트'] },
  { name: '정장 수트', formality: '정장', comfort: '낮음', weather: ['보통', '추움'], occasion: ['출근', '미팅', '면접'] },
  { name: '원피스', formality: '세미정장', comfort: '보통', weather: ['더움', '보통'], occasion: ['데이트', '모임', '출근'] },
  { name: '반바지 + 티셔츠', formality: '캐주얼', comfort: '높음', weather: ['더움'], occasion: ['일상', '운동'] },
  { name: '조거팬츠 + 맨투맨', formality: '캐주얼', comfort: '높음', weather: ['보통', '추움'], occasion: ['일상', '운동'] },
  { name: '니트 + 청바지', formality: '캐주얼', comfort: '높음', weather: ['추움'], occasion: ['일상', '데이트'] },
  { name: '가디건 + 블라우스', formality: '세미정장', comfort: '보통', weather: ['보통', '추움'], occasion: ['출근', '데이트'] },
  { name: '후드티 + 청바지', formality: '캐주얼', comfort: '높음', weather: ['보통', '추움'], occasion: ['일상'] },
  { name: '레깅스 + 오버핏탑', formality: '캐주얼', comfort: '높음', weather: ['보통'], occasion: ['운동', '일상'] },
  { name: '치노팬츠 + 폴로', formality: '세미정장', comfort: '보통', weather: ['더움', '보통'], occasion: ['출근', '골프'] },
  { name: '린넨 셔츠 + 면바지', formality: '캐주얼', comfort: '높음', weather: ['더움'], occasion: ['일상', '여행'] },
  { name: '패딩 + 기모바지', formality: '캐주얼', comfort: '보통', weather: ['추움'], occasion: ['일상'] },
  { name: '코트 + 슬랙스', formality: '세미정장', comfort: '보통', weather: ['추움'], occasion: ['출근', '데이트'] },
];

type Weather = 'hot' | 'warm' | 'cold';
type Occasion = 'daily' | 'work' | 'date' | 'meeting' | 'exercise';
type Priority = 'comfort' | 'style' | 'formal';

export function OutfitRecommender() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [showResult, setShowResult] = useState(false);

  const occasionMap: Record<Occasion, string> = {
    daily: '일상',
    work: '출근',
    date: '데이트',
    meeting: '미팅',
    exercise: '운동',
  };

  const weatherMap: Record<Weather, '더움' | '보통' | '추움'> = {
    hot: '더움',
    warm: '보통',
    cold: '추움',
  };

  const recommendations = useMemo(() => {
    const scored = outfits.map((outfit) => {
      let score = 0;
      const reasons: string[] = [];

      // 날씨 점수
      if (weather && outfit.weather.includes(weatherMap[weather])) {
        score += 3;
        reasons.push(`${weatherMap[weather]} 날씨 적합`);
      }

      // 상황 점수
      if (occasion && outfit.occasion.includes(occasionMap[occasion])) {
        score += 3;
        reasons.push(`${occasionMap[occasion]}에 어울림`);
      }

      // 우선순위 점수
      if (priority === 'comfort' && outfit.comfort === '높음') {
        score += 2;
        reasons.push('편안함');
      }
      if (priority === 'formal' && outfit.formality !== '캐주얼') {
        score += 2;
        reasons.push('격식 있음');
      }
      if (priority === 'style' && outfit.formality === '세미정장') {
        score += 2;
        reasons.push('세련됨');
      }

      return { outfit, score, reason: reasons.slice(0, 2).join(', ') || '일반 추천' };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [weather, occasion, priority]);

  const handleReset = () => {
    setWeather(null);
    setOccasion(null);
    setPriority(null);
    setShowResult(false);
  };

  const renderOption = <T extends string>(
    label: string,
    value: T | null,
    setValue: (v: T) => void,
    options: { key: T; label: string }[]
  ) => (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[60px]">{label}</span>
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
        {renderOption('오늘 날씨', weather, setWeather, [
          { key: 'hot', label: '더움 (25°C+)' },
          { key: 'warm', label: '적당함 (15~24°C)' },
          { key: 'cold', label: '추움 (15°C-)' },
        ])}

        {renderOption('오늘의 일정', occasion, setOccasion, [
          { key: 'daily', label: '일상' },
          { key: 'work', label: '출근' },
          { key: 'date', label: '데이트' },
          { key: 'meeting', label: '미팅' },
          { key: 'exercise', label: '운동' },
        ])}

        {renderOption('우선순위', priority, setPriority, [
          { key: 'comfort', label: '편안함' },
          { key: 'style', label: '스타일' },
          { key: 'formal', label: '격식' },
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
                <th className="text-left py-2 px-2">코디</th>
                <th className="text-center py-2 px-2">격식</th>
                <th className="text-center py-2 px-2">편안함</th>
                <th className="text-left py-2 px-2">추천 이유</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map(({ outfit, reason }, idx) => (
                <tr
                  key={outfit.name}
                  className={`border-b dark:border-gray-700 ${idx === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}
                >
                  <td className="py-2 px-2 font-medium">
                    {idx === 0 && '⭐ '}{outfit.name}
                  </td>
                  <td className="py-2 px-2 text-center">{outfit.formality}</td>
                  <td className="py-2 px-2 text-center">{outfit.comfort}</td>
                  <td className="py-2 px-2 text-gray-600 dark:text-gray-400">{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 날씨와 상황에 맞는 코디를 비교해보세요</p>
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
          👔 옷차림 추천이란?
        </h2>
        <p className="text-sm leading-relaxed">
          오늘 뭘 입을지 고민될 때, 날씨와 상황에 맞는 옷차림을 추천해주는 도구입니다.
          기온, 날씨, 외출 목적, 선호 스타일 등을 고려하여 적절한 코디를 제안합니다.
          출근, 데이트, 운동, 여행 등 다양한 상황에 맞는 옷차림을 비교해볼 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🌡️ 기온별 옷차림 가이드
        </h2>
        <div className="text-sm leading-relaxed space-y-2">
          <p><strong>28°C 이상:</strong> 민소매, 반바지, 린넨 소재</p>
          <p><strong>23~27°C:</strong> 반팔, 얇은 긴바지, 원피스</p>
          <p><strong>17~22°C:</strong> 얇은 가디건, 긴팔, 면바지</p>
          <p><strong>12~16°C:</strong> 자켓, 니트, 청바지</p>
          <p><strong>6~11°C:</strong> 코트, 두꺼운 니트, 히트텍</p>
          <p><strong>5°C 이하:</strong> 패딩, 목도리, 장갑, 기모 안감</p>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '추천 기준은 무엇인가요?',
            answer: '기온, 날씨(맑음/흐림/비/눈), 외출 목적(출근/캐주얼/운동 등), 선호 스타일을 종합적으로 고려하여 적합한 옷차림을 추천합니다.',
          },
          {
            question: '모든 조건을 선택해야 하나요?',
            answer: '아닙니다. 원하는 조건만 선택하면 됩니다. 기온만 선택해도 기본적인 옷차림 추천을 받을 수 있습니다.',
          },
          {
            question: '추천 결과가 마음에 안 들면 어떻게 하나요?',
            answer: '조건을 조금 바꿔서 다시 추천받거나, 같은 조건으로 다시 클릭하면 다른 조합을 볼 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}
