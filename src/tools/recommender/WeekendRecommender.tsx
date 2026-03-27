'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

interface Activity {
  name: string;
  emoji: string;
  effort: '낮음' | '보통' | '높음';
  cost: '무료' | '저렴' | '보통' | '비쌈';
  indoor: boolean;
  solo: boolean;
  social: boolean;
  duration: '짧음' | '반나절' | '하루';
  season?: ('봄' | '여름' | '가을' | '겨울')[];
  weather?: ('맑음' | '흐림' | '비')[];
}

const activities: Activity[] = [
  // 실내 활동 - 날씨 무관
  { name: '넷플릭스 정주행', emoji: '📺', effort: '낮음', cost: '무료', indoor: true, solo: true, social: false, duration: '하루' },
  { name: '카페에서 독서', emoji: '📚', effort: '낮음', cost: '저렴', indoor: true, solo: true, social: false, duration: '반나절' },
  { name: '집에서 요리하기', emoji: '🍳', effort: '보통', cost: '저렴', indoor: true, solo: true, social: true, duration: '반나절' },
  { name: '영화 보기', emoji: '🎬', effort: '낮음', cost: '보통', indoor: true, solo: true, social: true, duration: '짧음' },
  { name: '친구 만나기', emoji: '👫', effort: '보통', cost: '보통', indoor: true, solo: false, social: true, duration: '반나절' },
  { name: '쇼핑', emoji: '🛍️', effort: '보통', cost: '비쌈', indoor: true, solo: true, social: true, duration: '반나절' },
  { name: '게임하기', emoji: '🎮', effort: '낮음', cost: '무료', indoor: true, solo: true, social: false, duration: '하루' },
  { name: '전시회 가기', emoji: '🖼️', effort: '보통', cost: '보통', indoor: true, solo: true, social: true, duration: '반나절' },
  { name: '운동/헬스', emoji: '💪', effort: '높음', cost: '저렴', indoor: true, solo: true, social: false, duration: '짧음' },
  { name: '수영', emoji: '🏊', effort: '보통', cost: '저렴', indoor: true, solo: true, social: false, duration: '짧음' },
  { name: '볼링/당구', emoji: '🎳', effort: '보통', cost: '보통', indoor: true, solo: false, social: true, duration: '반나절' },
  { name: '블로그/일기 쓰기', emoji: '✍️', effort: '낮음', cost: '무료', indoor: true, solo: true, social: false, duration: '짧음' },
  { name: '악기 연습', emoji: '🎸', effort: '보통', cost: '무료', indoor: true, solo: true, social: false, duration: '짧음' },
  { name: '보드게임 카페', emoji: '🎲', effort: '낮음', cost: '보통', indoor: true, solo: false, social: true, duration: '반나절' },
  { name: '방탈출 카페', emoji: '🔐', effort: '보통', cost: '보통', indoor: true, solo: false, social: true, duration: '짧음' },
  { name: '찜질방/사우나', emoji: '♨️', effort: '낮음', cost: '저렴', indoor: true, solo: true, social: true, duration: '반나절' },
  { name: '노래방', emoji: '🎤', effort: '보통', cost: '저렴', indoor: true, solo: true, social: true, duration: '짧음' },
  { name: 'VR 체험', emoji: '🥽', effort: '보통', cost: '보통', indoor: true, solo: true, social: true, duration: '짧음' },
  { name: '베이킹', emoji: '🧁', effort: '보통', cost: '저렴', indoor: true, solo: true, social: true, duration: '반나절' },
  { name: '퍼즐 맞추기', emoji: '🧩', effort: '낮음', cost: '저렴', indoor: true, solo: true, social: false, duration: '하루' },
  { name: '홈트레이닝', emoji: '🏠', effort: '보통', cost: '무료', indoor: true, solo: true, social: false, duration: '짧음' },
  { name: '유튜브 정주행', emoji: '📱', effort: '낮음', cost: '무료', indoor: true, solo: true, social: false, duration: '하루' },
  { name: '온라인 강의 듣기', emoji: '💻', effort: '보통', cost: '무료', indoor: true, solo: true, social: false, duration: '반나절' },
  { name: '집 정리/청소', emoji: '🧹', effort: '보통', cost: '무료', indoor: true, solo: true, social: false, duration: '반나절' },

  // 야외 활동 - 날씨/계절 영향
  { name: '동네 산책', emoji: '🚶', effort: '낮음', cost: '무료', indoor: false, solo: true, social: true, duration: '짧음', weather: ['맑음', '흐림'] },
  { name: '등산', emoji: '⛰️', effort: '높음', cost: '무료', indoor: false, solo: true, social: true, duration: '하루', weather: ['맑음'], season: ['봄', '가을'] },
  { name: '자전거 타기', emoji: '🚴', effort: '보통', cost: '무료', indoor: false, solo: true, social: true, duration: '반나절', weather: ['맑음'] },
  { name: '캠핑', emoji: '🏕️', effort: '높음', cost: '보통', indoor: false, solo: false, social: true, duration: '하루', weather: ['맑음'], season: ['봄', '여름', '가을'] },
  { name: '드라이브', emoji: '🚗', effort: '낮음', cost: '저렴', indoor: false, solo: true, social: true, duration: '반나절' },
  { name: '피크닉', emoji: '🧺', effort: '낮음', cost: '저렴', indoor: false, solo: true, social: true, duration: '반나절', weather: ['맑음'], season: ['봄', '가을'] },
  { name: '런닝/조깅', emoji: '🏃', effort: '높음', cost: '무료', indoor: false, solo: true, social: true, duration: '짧음', weather: ['맑음', '흐림'] },
  { name: '공원에서 독서', emoji: '📖', effort: '낮음', cost: '무료', indoor: false, solo: true, social: false, duration: '반나절', weather: ['맑음'], season: ['봄', '가을'] },
  { name: '낚시', emoji: '🎣', effort: '낮음', cost: '보통', indoor: false, solo: true, social: true, duration: '하루', weather: ['맑음', '흐림'] },
  { name: '테니스/배드민턴', emoji: '🎾', effort: '높음', cost: '저렴', indoor: false, solo: false, social: true, duration: '짧음', weather: ['맑음'] },
  { name: '골프 연습장', emoji: '⛳', effort: '보통', cost: '보통', indoor: false, solo: true, social: true, duration: '짧음' },
  { name: '바다/계곡 가기', emoji: '🏖️', effort: '보통', cost: '보통', indoor: false, solo: true, social: true, duration: '하루', weather: ['맑음'], season: ['여름'] },
  { name: '플리마켓 구경', emoji: '🛒', effort: '낮음', cost: '저렴', indoor: false, solo: true, social: true, duration: '반나절', weather: ['맑음', '흐림'] },
  { name: '야시장 가기', emoji: '🌙', effort: '낮음', cost: '보통', indoor: false, solo: true, social: true, duration: '반나절' },
  { name: '맛집 탐방', emoji: '🍽️', effort: '낮음', cost: '보통', indoor: false, solo: true, social: true, duration: '반나절' },
  { name: '카페 투어', emoji: '☕', effort: '낮음', cost: '보통', indoor: false, solo: true, social: true, duration: '반나절' },
  { name: '사진 촬영', emoji: '📷', effort: '보통', cost: '무료', indoor: false, solo: true, social: true, duration: '반나절', weather: ['맑음'] },
  { name: '스케이트보드', emoji: '🛹', effort: '높음', cost: '무료', indoor: false, solo: true, social: true, duration: '짧음', weather: ['맑음'] },
  { name: '별 보기', emoji: '⭐', effort: '낮음', cost: '무료', indoor: false, solo: true, social: true, duration: '짧음', weather: ['맑음'] },
  { name: '스키/보드', emoji: '🎿', effort: '높음', cost: '비쌈', indoor: false, solo: true, social: true, duration: '하루', season: ['겨울'] },
  { name: '눈사람 만들기', emoji: '☃️', effort: '보통', cost: '무료', indoor: false, solo: true, social: true, duration: '짧음', season: ['겨울'] },
  { name: '꽃구경', emoji: '🌸', effort: '낮음', cost: '무료', indoor: false, solo: true, social: true, duration: '반나절', weather: ['맑음'], season: ['봄'] },
  { name: '단풍 구경', emoji: '🍂', effort: '낮음', cost: '무료', indoor: false, solo: true, social: true, duration: '반나절', weather: ['맑음'], season: ['가을'] },
];

type Energy = 'low' | 'medium' | 'high';
type Budget = 'free' | 'cheap' | 'any';
type Companion = 'solo' | 'together' | 'any';
type Location = 'indoor' | 'outdoor' | 'any';
type Weather = 'sunny' | 'cloudy' | 'rainy' | 'any';
type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'any';

const weatherMap: Record<Exclude<Weather, 'any'>, '맑음' | '흐림' | '비'> = {
  sunny: '맑음', cloudy: '흐림', rainy: '비'
};
const seasonMap: Record<Exclude<Season, 'any'>, '봄' | '여름' | '가을' | '겨울'> = {
  spring: '봄', summer: '여름', fall: '가을', winter: '겨울'
};

export function WeekendRecommender() {
  const [energy, setEnergy] = useState<Energy | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<Weather>('any');
  const [season, setSeason] = useState<Season>('any');
  const [showResult, setShowResult] = useState(false);
  const [randomPick, setRandomPick] = useState<Activity | null>(null);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // 날씨 필터
      if (weather !== 'any' && activity.weather && !activity.weather.includes(weatherMap[weather])) {
        return false;
      }
      // 비 오면 야외 활동 제외 (weather 속성 없어도)
      if (weather === 'rainy' && !activity.indoor) {
        return false;
      }
      // 계절 필터
      if (season !== 'any' && activity.season && !activity.season.includes(seasonMap[season])) {
        return false;
      }
      // 장소 필터
      if (location === 'indoor' && !activity.indoor) return false;
      if (location === 'outdoor' && activity.indoor) return false;
      // 동반자 필터
      if (companion === 'solo' && !activity.solo) return false;
      if (companion === 'together' && !activity.social) return false;

      return true;
    });
  }, [weather, season, location, companion]);

  const recommendations = useMemo(() => {
    const scored = filteredActivities.map((activity) => {
      let score = Math.random() * 2; // 랜덤성 추가
      const reasons: string[] = [];

      // 에너지 레벨
      if (energy === 'low' && activity.effort === '낮음') {
        score += 3; reasons.push('편하게');
      }
      if (energy === 'high' && activity.effort === '높음') {
        score += 3; reasons.push('활동적');
      }
      if (energy === 'medium' && activity.effort === '보통') {
        score += 2; reasons.push('적당히');
      }

      // 예산
      if (budget === 'free' && activity.cost === '무료') {
        score += 3; reasons.push('무료');
      }
      if (budget === 'cheap' && (activity.cost === '무료' || activity.cost === '저렴')) {
        score += 2; reasons.push('저렴');
      }

      // 동반자
      if (companion === 'solo' && activity.solo) {
        score += 2; reasons.push('혼자 가능');
      }
      if (companion === 'together' && activity.social) {
        score += 2; reasons.push('함께 즐기기');
      }

      // 장소
      if (location === 'indoor' && activity.indoor) {
        score += 2; reasons.push('실내');
      }
      if (location === 'outdoor' && !activity.indoor) {
        score += 2; reasons.push('야외');
      }

      return { activity, score, reason: reasons.slice(0, 2).join(', ') || '추천' };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [filteredActivities, energy, budget, companion, location]);

  const handleRandomPick = () => {
    if (filteredActivities.length === 0) return;
    const picked = filteredActivities[Math.floor(Math.random() * filteredActivities.length)];
    setRandomPick(picked);
    setShowResult(false);
  };

  const handleReset = () => {
    setEnergy(null);
    setBudget(null);
    setCompanion(null);
    setLocation(null);
    setWeather('any');
    setSeason('any');
    setShowResult(false);
    setRandomPick(null);
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
          { key: 'any', label: '상관없음' },
          { key: 'sunny', label: '☀️ 맑음' },
          { key: 'cloudy', label: '☁️ 흐림' },
          { key: 'rainy', label: '🌧️ 비' },
        ])}

        {renderOption('계절', season, setSeason, [
          { key: 'any', label: '상관없음' },
          { key: 'spring', label: '🌸 봄' },
          { key: 'summer', label: '☀️ 여름' },
          { key: 'fall', label: '🍂 가을' },
          { key: 'winter', label: '❄️ 겨울' },
        ])}

        {renderOption('에너지 레벨', energy, setEnergy, [
          { key: 'low', label: '쉬고 싶음' },
          { key: 'medium', label: '적당히' },
          { key: 'high', label: '움직이고 싶음' },
        ])}

        {renderOption('예산', budget, setBudget, [
          { key: 'free', label: '돈 안 쓰기' },
          { key: 'cheap', label: '조금만' },
          { key: 'any', label: '상관없음' },
        ])}

        {renderOption('함께 할 사람', companion, setCompanion, [
          { key: 'solo', label: '혼자' },
          { key: 'together', label: '함께' },
          { key: 'any', label: '상관없음' },
        ])}

        {renderOption('선호 장소', location, setLocation, [
          { key: 'indoor', label: '실내' },
          { key: 'outdoor', label: '야외' },
          { key: 'any', label: '상관없음' },
        ])}

        <p className="text-xs text-gray-500 mt-2">
          조건에 맞는 활동: <span className="font-bold text-blue-600">{filteredActivities.length}개</span>
        </p>
      </Card>

      <div className="flex gap-3 justify-center">
        <Button onClick={handleRandomPick} disabled={filteredActivities.length === 0}>
          🎲 랜덤 선택
        </Button>
        <Button onClick={() => { setShowResult(true); setRandomPick(null); }} variant="secondary" disabled={filteredActivities.length === 0}>
          📋 추천 목록
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          초기화
        </Button>
      </div>

      {/* 랜덤 결과 */}
      {randomPick && (
        <Card variant="bordered" className="p-6 text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="text-5xl mb-3">{randomPick.emoji}</div>
          <p className="text-3xl font-bold mb-2">{randomPick.name}</p>
          <div className="flex justify-center gap-3 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
              부담도: {randomPick.effort}
            </span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
              비용: {randomPick.cost}
            </span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
              소요: {randomPick.duration}
            </span>
          </div>
          <Button onClick={handleRandomPick} variant="secondary" className="mt-4">
            다시 뽑기
          </Button>
        </Card>
      )}

      {/* 추천 목록 */}
      {showResult && !randomPick && (
        <Card variant="bordered" className="p-4 overflow-x-auto">
          <p className="text-sm text-gray-500 mb-3">※ 조건에 맞는 추천 활동</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">활동</th>
                <th className="text-center py-2 px-2">부담도</th>
                <th className="text-center py-2 px-2">비용</th>
                <th className="text-center py-2 px-2">소요시간</th>
                <th className="text-left py-2 px-2">이유</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map(({ activity, reason }, idx) => (
                <tr
                  key={activity.name}
                  className={`border-b dark:border-gray-700 ${idx === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}
                >
                  <td className="py-2 px-2 font-medium">
                    {activity.emoji} {idx === 0 && '⭐ '}{activity.name}
                  </td>
                  <td className="py-2 px-2 text-center">{activity.effort}</td>
                  <td className="py-2 px-2 text-center">{activity.cost}</td>
                  <td className="py-2 px-2 text-center">{activity.duration}</td>
                  <td className="py-2 px-2 text-gray-600 dark:text-gray-400">{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 날씨/계절에 따라 적합한 활동이 필터링됩니다</p>
        <p>• 랜덤 선택으로 고민 없이 결정할 수 있습니다</p>
        <p>• 총 {activities.length}개의 활동이 준비되어 있습니다</p>
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
          🏖️ 주말 활동 추천이란?
        </h2>
        <p className="text-sm leading-relaxed">
          주말에 뭘 할지 고민될 때, 날씨·계절·예산·인원 등 조건에 맞는 활동을 추천해주는 도구입니다.
          실내외 활동, 혼자 또는 여럿이 할 수 있는 활동, 무료부터 유료까지 다양한 선택지를 제공합니다.
          고민 없이 랜덤으로 골라볼 수도 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🌤️ 날씨별 추천 활동
        </h2>
        <div className="text-sm leading-relaxed space-y-2">
          <p><strong>맑은 날:</strong> 등산, 자전거, 피크닉, 캠핑, 사진 촬영, 공원 산책</p>
          <p><strong>흐린 날:</strong> 미술관/전시회, 카페 투어, 쇼핑, 드라이브</p>
          <p><strong>비/눈 오는 날:</strong> 영화 감상, 보드게임, 요리, 독서, 실내 클라이밍</p>
          <p><strong>추운 날:</strong> 온천/찜질방, 실내 스포츠, 홈카페, 베이킹</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 알찬 주말 보내기 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>금요일 저녁에 미리 계획을 세우면 주말을 더 알차게 보낼 수 있습니다</li>
          <li>활동과 휴식의 균형을 맞추세요. 하루는 활동, 하루는 충전</li>
          <li>새로운 활동에 도전해보세요. 익숙한 것만 반복하면 금방 지루해집니다</li>
          <li>혼자만의 시간도 소중합니다. 꼭 누군가와 함께할 필요는 없습니다</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '어떤 조건으로 추천하나요?',
            answer: '날씨, 계절, 예산, 인원 수, 활동 강도, 실내/실외 선호 등을 종합적으로 고려하여 적합한 주말 활동을 추천합니다.',
          },
          {
            question: '혼자서도 할 수 있는 활동이 있나요?',
            answer: '네, 혼자 즐길 수 있는 활동도 많이 포함되어 있습니다. 독서, 카페 투어, 영화 감상, 산책, 요리 등 혼자서도 충분히 즐길 수 있습니다.',
          },
          {
            question: '무료 활동도 추천해주나요?',
            answer: '물론입니다. 공원 산책, 집에서 요리, 독서, 운동 등 무료로 즐길 수 있는 활동도 다양하게 포함되어 있습니다.',
          },
        ]}
      />
    </div>
  );
}
