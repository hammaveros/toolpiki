'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

interface Content {
  title: string;
  genre: string;
  platform: ('넷플릭스' | '티빙' | '왓챠' | '웨이브' | '쿠팡플레이' | '디즈니+' | '유튜브')[];
  type: '영화' | '드라마' | '예능' | '다큐' | '애니';
  year?: string;
  episodes?: string;
  duration: '짧음' | '보통' | '김';
  mood: ('가벼운' | '진지한' | '감동적' | '무서운' | '웃긴' | '스릴')[];
  focus: '낮음' | '보통' | '높음';
}

// 실제 OTT 인기작 기반 (장르/특성으로 추천)
const contents: Content[] = [
  // 넷플릭스 인기작
  { title: '오징어 게임', genre: '서바이벌 스릴러', platform: ['넷플릭스'], type: '드라마', year: '2021', episodes: '9부작', duration: '보통', mood: ['스릴', '진지한'], focus: '높음' },
  { title: '더 글로리', genre: '복수 드라마', platform: ['넷플릭스'], type: '드라마', year: '2022', episodes: '16부작', duration: '김', mood: ['진지한', '스릴'], focus: '높음' },
  { title: '지금 우리 학교는', genre: '좀비 스릴러', platform: ['넷플릭스'], type: '드라마', year: '2022', episodes: '12부작', duration: '보통', mood: ['무서운', '스릴'], focus: '높음' },
  { title: '이상한 변호사 우영우', genre: '법정/힐링', platform: ['넷플릭스'], type: '드라마', year: '2022', episodes: '16부작', duration: '김', mood: ['감동적', '가벼운'], focus: '보통' },
  { title: '스위트홈', genre: '괴물 스릴러', platform: ['넷플릭스'], type: '드라마', year: '2020', episodes: '시즌3', duration: '김', mood: ['무서운', '스릴'], focus: '높음' },
  { title: '킹덤', genre: '좀비 사극', platform: ['넷플릭스'], type: '드라마', year: '2019', episodes: '시즌2', duration: '보통', mood: ['무서운', '진지한'], focus: '높음' },
  { title: '마이 네임', genre: '느와르 액션', platform: ['넷플릭스'], type: '드라마', year: '2021', episodes: '8부작', duration: '짧음', mood: ['스릴', '진지한'], focus: '높음' },
  { title: '지옥', genre: '오컬트 스릴러', platform: ['넷플릭스'], type: '드라마', year: '2021', episodes: '6부작', duration: '짧음', mood: ['무서운', '진지한'], focus: '높음' },
  { title: '소년심판', genre: '법정 드라마', platform: ['넷플릭스'], type: '드라마', year: '2022', episodes: '10부작', duration: '보통', mood: ['진지한', '감동적'], focus: '높음' },
  { title: '살인자ㅇ난감', genre: '다크코미디', platform: ['넷플릭스'], type: '드라마', year: '2024', episodes: '8부작', duration: '짧음', mood: ['웃긴', '스릴'], focus: '보통' },

  // 티빙 인기작
  { title: '재벌집 막내아들', genre: '회귀 판타지', platform: ['티빙'], type: '드라마', year: '2022', episodes: '16부작', duration: '김', mood: ['가벼운', '웃긴'], focus: '보통' },
  { title: '술꾼도시여자들', genre: '로맨스 코미디', platform: ['티빙'], type: '드라마', year: '2021', episodes: '시즌2', duration: '보통', mood: ['웃긴', '가벼운'], focus: '낮음' },
  { title: '환승연애', genre: '연애 리얼리티', platform: ['티빙'], type: '예능', year: '2021', episodes: '시즌3', duration: '보통', mood: ['가벼운', '감동적'], focus: '낮음' },
  { title: '서진이네', genre: '힐링 예능', platform: ['티빙'], type: '예능', year: '2023', episodes: '시즌2', duration: '보통', mood: ['가벼운'], focus: '낮음' },
  { title: '피라미드 게임', genre: '학원 스릴러', platform: ['티빙'], type: '드라마', year: '2024', episodes: '10부작', duration: '보통', mood: ['스릴', '진지한'], focus: '높음' },
  { title: '신서유기', genre: '게임 예능', platform: ['티빙'], type: '예능', year: '2015', episodes: '시즌9', duration: '보통', mood: ['웃긴', '가벼운'], focus: '낮음' },

  // 쿠팡플레이 인기작
  { title: 'SNL 코리아', genre: '코미디 예능', platform: ['쿠팡플레이'], type: '예능', year: '2021', episodes: '시즌5', duration: '짧음', mood: ['웃긴', '가벼운'], focus: '낮음' },
  { title: '안나', genre: '스릴러', platform: ['쿠팡플레이'], type: '드라마', year: '2022', episodes: '6부작', duration: '짧음', mood: ['스릴', '진지한'], focus: '높음' },
  { title: '소년시대', genre: '청춘 드라마', platform: ['쿠팡플레이'], type: '드라마', year: '2023', episodes: '14부작', duration: '김', mood: ['감동적', '웃긴'], focus: '보통' },

  // 디즈니+ 인기작
  { title: '무빙', genre: '히어로 액션', platform: ['디즈니+'], type: '드라마', year: '2023', episodes: '20부작', duration: '김', mood: ['감동적', '스릴'], focus: '높음' },
  { title: '카지노', genre: '느와르', platform: ['디즈니+'], type: '드라마', year: '2022', episodes: '시즌2', duration: '김', mood: ['스릴', '진지한'], focus: '높음' },
  { title: '빅마우스', genre: '법정 스릴러', platform: ['디즈니+'], type: '드라마', year: '2022', episodes: '16부작', duration: '김', mood: ['스릴', '진지한'], focus: '높음' },

  // 왓챠 인기작
  { title: '시그널', genre: '판타지 수사', platform: ['왓챠', '넷플릭스'], type: '드라마', year: '2016', episodes: '16부작', duration: '김', mood: ['스릴', '감동적'], focus: '높음' },
  { title: '비밀의 숲', genre: '수사 드라마', platform: ['왓챠'], type: '드라마', year: '2017', episodes: '시즌2', duration: '김', mood: ['진지한', '스릴'], focus: '높음' },
  { title: '나의 아저씨', genre: '힐링 드라마', platform: ['왓챠'], type: '드라마', year: '2018', episodes: '16부작', duration: '김', mood: ['감동적', '진지한'], focus: '높음' },

  // 웨이브 인기작
  { title: '모범택시', genre: '복수 액션', platform: ['웨이브'], type: '드라마', year: '2021', episodes: '시즌2', duration: '김', mood: ['스릴', '감동적'], focus: '보통' },
  { title: '펜트하우스', genre: '막장 드라마', platform: ['웨이브'], type: '드라마', year: '2020', episodes: '시즌3', duration: '김', mood: ['스릴', '진지한'], focus: '보통' },
  { title: '놀면 뭐하니', genre: '예능', platform: ['웨이브'], type: '예능', year: '2019', episodes: '방영중', duration: '보통', mood: ['웃긴', '가벼운'], focus: '낮음' },
  { title: '나 혼자 산다', genre: '관찰 예능', platform: ['웨이브'], type: '예능', year: '2013', episodes: '방영중', duration: '보통', mood: ['가벼운', '웃긴'], focus: '낮음' },

  // 공통/복수 플랫폼
  { title: '사랑의 불시착', genre: '로맨스', platform: ['넷플릭스', '티빙'], type: '드라마', year: '2019', episodes: '16부작', duration: '김', mood: ['감동적', '웃긴'], focus: '보통' },
  { title: '도깨비', genre: '판타지 로맨스', platform: ['넷플릭스', '웨이브'], type: '드라마', year: '2016', episodes: '16부작', duration: '김', mood: ['감동적', '웃긴'], focus: '보통' },
  { title: '응답하라 1988', genre: '가족/청춘', platform: ['넷플릭스', '왓챠'], type: '드라마', year: '2015', episodes: '20부작', duration: '김', mood: ['감동적', '웃긴'], focus: '보통' },
  { title: '슬기로운 의사생활', genre: '의학/힐링', platform: ['넷플릭스'], type: '드라마', year: '2020', episodes: '시즌2', duration: '김', mood: ['감동적', '웃긴'], focus: '보통' },
  { title: '이태원 클라쓰', genre: '성장 드라마', platform: ['넷플릭스'], type: '드라마', year: '2020', episodes: '16부작', duration: '김', mood: ['감동적', '가벼운'], focus: '보통' },

  // 영화
  { title: '범죄도시 시리즈', genre: '액션', platform: ['넷플릭스', '티빙', '왓챠'], type: '영화', year: '2017~', duration: '보통', mood: ['스릴', '웃긴'], focus: '보통' },
  { title: '파묘', genre: '오컬트', platform: ['티빙', '왓챠'], type: '영화', year: '2024', duration: '보통', mood: ['무서운', '스릴'], focus: '높음' },
  { title: '서울의 봄', genre: '역사/정치', platform: ['티빙', '쿠팡플레이'], type: '영화', year: '2023', duration: '보통', mood: ['진지한', '스릴'], focus: '높음' },
  { title: '밀수', genre: '범죄 액션', platform: ['티빙', '쿠팡플레이'], type: '영화', year: '2023', duration: '보통', mood: ['스릴', '웃긴'], focus: '보통' },
  { title: '기생충', genre: '스릴러', platform: ['넷플릭스', '왓챠'], type: '영화', year: '2019', duration: '보통', mood: ['스릴', '진지한'], focus: '높음' },
  { title: '극한직업', genre: '코미디', platform: ['넷플릭스', '왓챠'], type: '영화', year: '2019', duration: '보통', mood: ['웃긴', '가벼운'], focus: '낮음' },
  { title: '부산행', genre: '좀비 액션', platform: ['넷플릭스', '왓챠'], type: '영화', year: '2016', duration: '보통', mood: ['무서운', '스릴'], focus: '높음' },
  { title: '공조 시리즈', genre: '액션 코미디', platform: ['넷플릭스', '티빙'], type: '영화', year: '2017~', duration: '보통', mood: ['웃긴', '스릴'], focus: '보통' },
  { title: '탈출: 프로젝트 사일런스', genre: '재난 액션', platform: ['티빙'], type: '영화', year: '2024', duration: '보통', mood: ['스릴', '무서운'], focus: '높음' },

  // 애니메이션
  { title: '귀멸의 칼날', genre: '액션 애니', platform: ['넷플릭스', '왓챠'], type: '애니', year: '2019', episodes: '시즌4', duration: '보통', mood: ['감동적', '스릴'], focus: '보통' },
  { title: '주술회전', genre: '액션 애니', platform: ['넷플릭스', '왓챠'], type: '애니', year: '2020', episodes: '시즌2', duration: '보통', mood: ['스릴'], focus: '보통' },
  { title: '최애의 아이', genre: '아이돌 드라마', platform: ['넷플릭스'], type: '애니', year: '2023', episodes: '시즌2', duration: '보통', mood: ['스릴', '감동적'], focus: '높음' },
  { title: '스파이x패밀리', genre: '코미디 액션', platform: ['넷플릭스', '왓챠'], type: '애니', year: '2022', episodes: '시즌2', duration: '보통', mood: ['웃긴', '가벼운'], focus: '낮음' },

  // 다큐/예능
  { title: '흑백요리사', genre: '요리 서바이벌', platform: ['넷플릭스'], type: '예능', year: '2024', episodes: '12부작', duration: '보통', mood: ['스릴', '가벼운'], focus: '보통' },
  { title: '더 인플루언서', genre: '서바이벌', platform: ['넷플릭스'], type: '예능', year: '2024', episodes: '12부작', duration: '보통', mood: ['스릴', '가벼운'], focus: '보통' },
  { title: '솔로지옥', genre: '연애 리얼리티', platform: ['넷플릭스'], type: '예능', year: '2021', episodes: '시즌4', duration: '보통', mood: ['가벼운'], focus: '낮음' },
  { title: '피지컬: 100', genre: '서바이벌', platform: ['넷플릭스'], type: '예능', year: '2023', episodes: '시즌2', duration: '보통', mood: ['스릴', '가벼운'], focus: '보통' },
];

type Time = 'short' | 'medium' | 'long';
type Mood = 'light' | 'serious' | 'touching' | 'funny' | 'scary' | 'thrill';
type Focus = 'low' | 'medium' | 'high';
type Platform = '전체' | '넷플릭스' | '티빙' | '쿠팡플레이' | '디즈니+' | '왓챠' | '웨이브';
type ContentType = '전체' | '영화' | '드라마' | '예능' | '애니';

export function ContentRecommender() {
  const [time, setTime] = useState<Time | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [focus, setFocus] = useState<Focus | null>(null);
  const [platform, setPlatform] = useState<Platform>('전체');
  const [contentType, setContentType] = useState<ContentType>('전체');
  const [showResult, setShowResult] = useState(false);

  const moodMap: Record<Mood, string> = {
    light: '가벼운',
    serious: '진지한',
    touching: '감동적',
    funny: '웃긴',
    scary: '무서운',
    thrill: '스릴',
  };

  const focusMap: Record<Focus, string> = {
    low: '낮음',
    medium: '보통',
    high: '높음',
  };

  const platformColors: Record<string, string> = {
    '넷플릭스': 'bg-red-500',
    '티빙': 'bg-pink-500',
    '쿠팡플레이': 'bg-yellow-500',
    '디즈니+': 'bg-blue-500',
    '왓챠': 'bg-orange-500',
    '웨이브': 'bg-indigo-500',
  };

  const recommendations = useMemo(() => {
    let filtered = contents;

    // 플랫폼 필터
    if (platform !== '전체') {
      filtered = filtered.filter(c => c.platform.includes(platform as any));
    }

    // 콘텐츠 타입 필터
    if (contentType !== '전체') {
      filtered = filtered.filter(c => c.type === contentType);
    }

    const scored = filtered.map((content) => {
      let score = 0;
      const reasons: string[] = [];

      // 시간
      if (time === 'short' && content.duration === '짧음') {
        score += 3; reasons.push('🕐 짧게 완결');
      } else if (time === 'short' && content.duration === '보통') {
        score += 1;
      }
      if (time === 'long' && content.duration === '김') {
        score += 3; reasons.push('📺 정주행 가능');
      }
      if (time === 'medium' && content.duration === '보통') {
        score += 2;
      }

      // 분위기
      if (mood && content.mood.includes(moodMap[mood] as any)) {
        score += 4;
        reasons.push(`🎭 ${moodMap[mood]}`);
      }

      // 집중도
      if (focus === 'low' && content.focus === '낮음') {
        score += 2; reasons.push('😌 가볍게');
      }
      if (focus === 'high' && content.focus === '높음') {
        score += 2; reasons.push('🔥 몰입');
      }
      if (focus === 'medium' && content.focus === '보통') {
        score += 1;
      }

      // 랜덤 요소 추가 (같은 점수일 때 다양성)
      score += Math.random() * 0.5;

      return { content, score, reasons: reasons.slice(0, 2) };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [time, mood, focus, platform, contentType]);

  const handleReset = () => {
    setTime(null);
    setMood(null);
    setFocus(null);
    setPlatform('전체');
    setContentType('전체');
    setShowResult(false);
  };

  const renderOption = <T extends string>(
    label: string,
    value: T | null,
    setValue: (v: T) => void,
    options: { key: T; label: string }[]
  ) => (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setValue(opt.key)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              value === opt.key
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
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
      <Card variant="bordered" className="p-4 space-y-4">
        {/* 플랫폼 & 타입 선택 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderOption('OTT 플랫폼', platform, setPlatform as any, [
            { key: '전체', label: '전체' },
            { key: '넷플릭스', label: '넷플릭스' },
            { key: '티빙', label: '티빙' },
            { key: '쿠팡플레이', label: '쿠팡' },
            { key: '디즈니+', label: '디즈니+' },
            { key: '왓챠', label: '왓챠' },
            { key: '웨이브', label: '웨이브' },
          ])}

          {renderOption('콘텐츠 유형', contentType, setContentType as any, [
            { key: '전체', label: '전체' },
            { key: '드라마', label: '드라마' },
            { key: '영화', label: '영화' },
            { key: '예능', label: '예능' },
            { key: '애니', label: '애니' },
          ])}
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* 선호 조건 */}
        {renderOption('⏱️ 시청 시간', time, setTime, [
          { key: 'short', label: '짧게 (1~2시간)' },
          { key: 'medium', label: '보통 (하루)' },
          { key: 'long', label: '길게 (정주행)' },
        ])}

        {renderOption('🎭 원하는 분위기', mood, setMood, [
          { key: 'light', label: '가볍게' },
          { key: 'funny', label: '웃기게' },
          { key: 'touching', label: '감동적' },
          { key: 'serious', label: '진지하게' },
          { key: 'thrill', label: '스릴/긴장감' },
          { key: 'scary', label: '무섭게' },
        ])}

        {renderOption('🎯 집중도', focus, setFocus, [
          { key: 'low', label: '틀어놓고 딴짓' },
          { key: 'medium', label: '적당히' },
          { key: 'high', label: '완전 몰입' },
        ])}
      </Card>

      <div className="flex gap-3 justify-center">
        <Button onClick={() => setShowResult(true)}>
          🎬 추천받기
        </Button>
        <Button variant="secondary" onClick={handleReset}>
          다시 선택
        </Button>
      </div>

      {showResult && (
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">추천 콘텐츠</h3>
            <span className="text-xs text-gray-500">* 실제 스트리밍 여부는 각 플랫폼에서 확인하세요</span>
          </div>

          <div className="grid gap-3">
            {recommendations.map(({ content, reasons }, idx) => (
              <div
                key={content.title}
                className={`p-3 rounded-lg border ${
                  idx === 0
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {idx === 0 && <span className="text-yellow-500">⭐</span>}
                      <span className="font-semibold text-gray-900 dark:text-white">{content.title}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{content.genre}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      {content.platform.map(p => (
                        <span
                          key={p}
                          className={`text-[10px] px-1.5 py-0.5 rounded text-white ${platformColors[p] || 'bg-gray-500'}`}
                        >
                          {p}
                        </span>
                      ))}
                      <span className="text-xs text-gray-500">
                        {content.type} · {content.episodes || content.duration}
                        {content.year && ` · ${content.year}`}
                      </span>
                    </div>
                  </div>
                  {reasons.length > 0 && (
                    <div className="flex flex-col items-end gap-0.5 text-xs text-gray-600 dark:text-gray-400">
                      {reasons.map((r, i) => (
                        <span key={i}>{r}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 넷플릭스, 티빙, 쿠팡플레이, 디즈니+, 왓챠, 웨이브 인기 콘텐츠 기준</p>
        <p>• 스트리밍 가능 여부는 시기에 따라 변동될 수 있습니다</p>
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
          🎬 콘텐츠 추천이란?
        </h2>
        <p className="text-sm leading-relaxed">
          오늘 뭘 볼지 고민될 때, 기분과 취향에 맞는 콘텐츠를 추천해주는 도구입니다.
          넷플릭스, 티빙, 쿠팡플레이, 디즈니+, 왓챠, 웨이브 등 주요 OTT 플랫폼의 인기 콘텐츠를 기반으로
          장르, 분위기, 시청 시간 등 조건에 맞는 최적의 콘텐츠를 찾아줍니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📺 이런 상황에서 활용하세요
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>퇴근 후 가볍게 볼 드라마나 영화를 찾을 때</li>
          <li>주말에 몰아볼 시리즈를 고를 때</li>
          <li>연인이나 가족과 함께 볼 콘텐츠를 정할 때</li>
          <li>새로운 장르에 도전하고 싶을 때</li>
          <li>특정 기분에 맞는 콘텐츠가 필요할 때</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 콘텐츠 선택 팁
        </h2>
        <p className="text-sm leading-relaxed">
          장르나 분위기를 정하기 어렵다면, 시청 가능 시간만 설정해보세요.
          짧은 시간이면 영화나 단편 시리즈를, 넉넉한 시간이면 몰아보기 좋은 시리즈를 추천받을 수 있습니다.
          조건을 적게 선택할수록 다양한 추천을 받을 수 있고, 조건을 많이 선택할수록 취향에 맞는 정확한 추천을 받을 수 있습니다.
        </p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '추천 콘텐츠는 어떤 기준으로 선정되나요?',
            answer: '주요 OTT 플랫폼의 인기 콘텐츠를 기반으로, 선택한 장르·분위기·시청 시간 조건에 맞는 콘텐츠를 필터링하여 추천합니다.',
          },
          {
            question: '모든 OTT 플랫폼에서 볼 수 있나요?',
            answer: '콘텐츠별로 제공 플랫폼이 표시됩니다. 스트리밍 가능 여부는 시기에 따라 변동될 수 있으므로 해당 플랫폼에서 직접 확인해주세요.',
          },
          {
            question: '조건을 선택하지 않으면 어떻게 되나요?',
            answer: '조건을 선택하지 않으면 전체 콘텐츠 중에서 랜덤으로 추천됩니다. 원하는 조건만 골라서 선택할 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}
