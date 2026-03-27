'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type MenuCategory = 'korean' | 'chinese' | 'japanese' | 'western' | 'snack' | 'fastfood';
type Category = MenuCategory | 'all';

interface Menu {
  name: string;
  category: MenuCategory;
  fullness: '낮음' | '보통' | '높음';
  time: '짧음' | '보통' | '김';
  spicy: boolean;
  solo: boolean;
  light: boolean;
  hasStew: boolean;
  price: '저렴' | '보통' | '비쌈';
}

const categoryInfo: Record<MenuCategory, { label: string; emoji: string; bg: string; border: string }> = {
  korean: { label: '한식', emoji: '🍚', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
  chinese: { label: '중식', emoji: '🥡', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' },
  japanese: { label: '일식', emoji: '🍣', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-200 dark:border-pink-800' },
  western: { label: '양식', emoji: '🍝', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' },
  snack: { label: '분식', emoji: '🍢', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' },
  fastfood: { label: '패스트푸드', emoji: '🍔', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
};

const menus: Menu[] = [
  // 한식 (25개)
  { name: '김치찌개', category: 'korean', fullness: '높음', time: '보통', spicy: true, solo: true, light: false, hasStew: true, price: '저렴' },
  { name: '된장찌개', category: 'korean', fullness: '보통', time: '보통', spicy: false, solo: true, light: false, hasStew: true, price: '저렴' },
  { name: '순두부찌개', category: 'korean', fullness: '보통', time: '보통', spicy: true, solo: true, light: false, hasStew: true, price: '저렴' },
  { name: '부대찌개', category: 'korean', fullness: '높음', time: '보통', spicy: true, solo: false, light: false, hasStew: true, price: '보통' },
  { name: '제육볶음', category: 'korean', fullness: '높음', time: '보통', spicy: true, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '불고기', category: 'korean', fullness: '보통', time: '보통', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '삼겹살', category: 'korean', fullness: '높음', time: '김', spicy: false, solo: false, light: false, hasStew: false, price: '비쌈' },
  { name: '비빔밥', category: 'korean', fullness: '보통', time: '짧음', spicy: true, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '국밥', category: 'korean', fullness: '높음', time: '짧음', spicy: false, solo: true, light: false, hasStew: true, price: '저렴' },
  { name: '순대국', category: 'korean', fullness: '높음', time: '짧음', spicy: false, solo: true, light: false, hasStew: true, price: '저렴' },
  { name: '설렁탕', category: 'korean', fullness: '높음', time: '짧음', spicy: false, solo: true, light: false, hasStew: true, price: '보통' },
  { name: '삼계탕', category: 'korean', fullness: '높음', time: '보통', spicy: false, solo: true, light: false, hasStew: true, price: '비쌈' },
  { name: '보쌈', category: 'korean', fullness: '높음', time: '보통', spicy: false, solo: false, light: false, hasStew: false, price: '비쌈' },
  { name: '족발', category: 'korean', fullness: '높음', time: '보통', spicy: false, solo: false, light: false, hasStew: false, price: '비쌈' },
  { name: '칼국수', category: 'korean', fullness: '보통', time: '보통', spicy: false, solo: true, light: false, hasStew: true, price: '저렴' },
  { name: '감자탕', category: 'korean', fullness: '높음', time: '보통', spicy: true, solo: false, light: false, hasStew: true, price: '보통' },
  { name: '닭갈비', category: 'korean', fullness: '높음', time: '보통', spicy: true, solo: false, light: false, hasStew: false, price: '보통' },
  { name: '찜닭', category: 'korean', fullness: '높음', time: '보통', spicy: true, solo: false, light: false, hasStew: false, price: '보통' },
  { name: '해물탕', category: 'korean', fullness: '높음', time: '보통', spicy: true, solo: false, light: false, hasStew: true, price: '비쌈' },
  { name: '갈비탕', category: 'korean', fullness: '높음', time: '보통', spicy: false, solo: true, light: false, hasStew: true, price: '비쌈' },
  { name: '육개장', category: 'korean', fullness: '높음', time: '짧음', spicy: true, solo: true, light: false, hasStew: true, price: '저렴' },
  { name: '떡갈비', category: 'korean', fullness: '보통', time: '보통', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '낙지볶음', category: 'korean', fullness: '보통', time: '보통', spicy: true, solo: true, light: false, hasStew: false, price: '비쌈' },
  { name: '곱창', category: 'korean', fullness: '보통', time: '김', spicy: true, solo: false, light: false, hasStew: false, price: '비쌈' },
  { name: '청국장', category: 'korean', fullness: '보통', time: '보통', spicy: false, solo: true, light: false, hasStew: true, price: '저렴' },

  // 중식 (18개)
  { name: '짜장면', category: 'chinese', fullness: '높음', time: '짧음', spicy: false, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '짬뽕', category: 'chinese', fullness: '높음', time: '짧음', spicy: true, solo: true, light: false, hasStew: true, price: '저렴' },
  { name: '볶음밥', category: 'chinese', fullness: '보통', time: '짧음', spicy: false, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '탕수육', category: 'chinese', fullness: '보통', time: '보통', spicy: false, solo: false, light: false, hasStew: false, price: '보통' },
  { name: '마파두부', category: 'chinese', fullness: '보통', time: '보통', spicy: true, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '깐풍기', category: 'chinese', fullness: '보통', time: '보통', spicy: true, solo: false, light: false, hasStew: false, price: '보통' },
  { name: '유린기', category: 'chinese', fullness: '보통', time: '보통', spicy: false, solo: false, light: false, hasStew: false, price: '보통' },
  { name: '양장피', category: 'chinese', fullness: '낮음', time: '보통', spicy: false, solo: false, light: true, hasStew: false, price: '비쌈' },
  { name: '고추잡채', category: 'chinese', fullness: '보통', time: '보통', spicy: true, solo: false, light: false, hasStew: false, price: '보통' },
  { name: '군만두', category: 'chinese', fullness: '낮음', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '저렴' },
  { name: '짜장밥', category: 'chinese', fullness: '높음', time: '짧음', spicy: false, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '잡채밥', category: 'chinese', fullness: '보통', time: '짧음', spicy: false, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '라조기', category: 'chinese', fullness: '보통', time: '보통', spicy: true, solo: false, light: false, hasStew: false, price: '보통' },
  { name: '팔보채', category: 'chinese', fullness: '보통', time: '보통', spicy: false, solo: false, light: false, hasStew: false, price: '비쌈' },
  { name: '울면', category: 'chinese', fullness: '높음', time: '짧음', spicy: false, solo: true, light: false, hasStew: true, price: '저렴' },
  { name: '물만두', category: 'chinese', fullness: '보통', time: '짧음', spicy: false, solo: true, light: true, hasStew: true, price: '저렴' },
  { name: '칠리새우', category: 'chinese', fullness: '보통', time: '보통', spicy: true, solo: false, light: false, hasStew: false, price: '비쌈' },
  { name: '동파육', category: 'chinese', fullness: '높음', time: '보통', spicy: false, solo: false, light: false, hasStew: false, price: '비쌈' },

  // 일식 (18개)
  { name: '초밥', category: 'japanese', fullness: '보통', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '비쌈' },
  { name: '라멘', category: 'japanese', fullness: '높음', time: '보통', spicy: false, solo: true, light: false, hasStew: true, price: '보통' },
  { name: '우동', category: 'japanese', fullness: '보통', time: '짧음', spicy: false, solo: true, light: true, hasStew: true, price: '저렴' },
  { name: '돈카츠', category: 'japanese', fullness: '높음', time: '보통', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '규동', category: 'japanese', fullness: '높음', time: '짧음', spicy: false, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '카레라이스', category: 'japanese', fullness: '높음', time: '짧음', spicy: true, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '연어덮밥', category: 'japanese', fullness: '보통', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '보통' },
  { name: '오코노미야끼', category: 'japanese', fullness: '보통', time: '보통', spicy: false, solo: false, light: false, hasStew: false, price: '보통' },
  { name: '타코야끼', category: 'japanese', fullness: '낮음', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '저렴' },
  { name: '소바', category: 'japanese', fullness: '보통', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '보통' },
  { name: '가츠동', category: 'japanese', fullness: '높음', time: '짧음', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '텐동', category: 'japanese', fullness: '높음', time: '짧음', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '오야코동', category: 'japanese', fullness: '보통', time: '짧음', spicy: false, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '사시미', category: 'japanese', fullness: '낮음', time: '짧음', spicy: false, solo: false, light: true, hasStew: false, price: '비쌈' },
  { name: '야키토리', category: 'japanese', fullness: '낮음', time: '보통', spicy: false, solo: false, light: true, hasStew: false, price: '보통' },
  { name: '스키야키', category: 'japanese', fullness: '높음', time: '김', spicy: false, solo: false, light: false, hasStew: true, price: '비쌈' },
  { name: '나베', category: 'japanese', fullness: '높음', time: '보통', spicy: false, solo: false, light: false, hasStew: true, price: '보통' },
  { name: '장어덮밥', category: 'japanese', fullness: '보통', time: '보통', spicy: false, solo: true, light: false, hasStew: false, price: '비쌈' },

  // 양식 (18개)
  { name: '파스타', category: 'western', fullness: '보통', time: '보통', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '피자', category: 'western', fullness: '높음', time: '보통', spicy: false, solo: false, light: false, hasStew: false, price: '보통' },
  { name: '스테이크', category: 'western', fullness: '높음', time: '김', spicy: false, solo: true, light: false, hasStew: false, price: '비쌈' },
  { name: '리조또', category: 'western', fullness: '보통', time: '보통', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '샐러드', category: 'western', fullness: '낮음', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '보통' },
  { name: '오믈렛', category: 'western', fullness: '보통', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '보통' },
  { name: '수프', category: 'western', fullness: '낮음', time: '짧음', spicy: false, solo: true, light: true, hasStew: true, price: '보통' },
  { name: '브런치', category: 'western', fullness: '보통', time: '보통', spicy: false, solo: true, light: true, hasStew: false, price: '비쌈' },
  { name: '샌드위치', category: 'western', fullness: '낮음', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '저렴' },
  { name: '감바스', category: 'western', fullness: '낮음', time: '보통', spicy: true, solo: false, light: false, hasStew: false, price: '비쌈' },
  { name: '봉골레', category: 'western', fullness: '보통', time: '보통', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '까르보나라', category: 'western', fullness: '높음', time: '보통', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '알리오올리오', category: 'western', fullness: '보통', time: '짧음', spicy: true, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '햄버거스테이크', category: 'western', fullness: '높음', time: '보통', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '그라탕', category: 'western', fullness: '보통', time: '보통', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '뇨끼', category: 'western', fullness: '보통', time: '보통', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '라자냐', category: 'western', fullness: '높음', time: '보통', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '포케', category: 'western', fullness: '보통', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '보통' },

  // 분식 (15개)
  { name: '떡볶이', category: 'snack', fullness: '보통', time: '짧음', spicy: true, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '라면', category: 'snack', fullness: '보통', time: '짧음', spicy: true, solo: true, light: false, hasStew: true, price: '저렴' },
  { name: '김밥', category: 'snack', fullness: '보통', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '저렴' },
  { name: '순대', category: 'snack', fullness: '보통', time: '짧음', spicy: false, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '튀김', category: 'snack', fullness: '낮음', time: '짧음', spicy: false, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '어묵탕', category: 'snack', fullness: '낮음', time: '짧음', spicy: false, solo: true, light: true, hasStew: true, price: '저렴' },
  { name: '쫄면', category: 'snack', fullness: '보통', time: '짧음', spicy: true, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '냉면', category: 'snack', fullness: '보통', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '저렴' },
  { name: '비빔냉면', category: 'snack', fullness: '보통', time: '짧음', spicy: true, solo: true, light: true, hasStew: false, price: '저렴' },
  { name: '라볶이', category: 'snack', fullness: '높음', time: '짧음', spicy: true, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '잔치국수', category: 'snack', fullness: '보통', time: '짧음', spicy: false, solo: true, light: true, hasStew: true, price: '저렴' },
  { name: '비빔국수', category: 'snack', fullness: '보통', time: '짧음', spicy: true, solo: true, light: true, hasStew: false, price: '저렴' },
  { name: '만두', category: 'snack', fullness: '보통', time: '짧음', spicy: false, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '닭꼬치', category: 'snack', fullness: '낮음', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '저렴' },
  { name: '컵밥', category: 'snack', fullness: '보통', time: '짧음', spicy: false, solo: true, light: false, hasStew: false, price: '저렴' },

  // 패스트푸드 (15개)
  { name: '햄버거', category: 'fastfood', fullness: '보통', time: '짧음', spicy: false, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '치킨', category: 'fastfood', fullness: '높음', time: '보통', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '핫도그', category: 'fastfood', fullness: '낮음', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '저렴' },
  { name: '감자튀김', category: 'fastfood', fullness: '낮음', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '저렴' },
  { name: '타코', category: 'fastfood', fullness: '보통', time: '짧음', spicy: true, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '부리또', category: 'fastfood', fullness: '높음', time: '짧음', spicy: true, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '서브웨이', category: 'fastfood', fullness: '보통', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '저렴' },
  { name: '양념치킨', category: 'fastfood', fullness: '높음', time: '보통', spicy: true, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '후라이드치킨', category: 'fastfood', fullness: '높음', time: '보통', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '치킨너겟', category: 'fastfood', fullness: '낮음', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '저렴' },
  { name: '케밥', category: 'fastfood', fullness: '보통', time: '짧음', spicy: true, solo: true, light: false, hasStew: false, price: '저렴' },
  { name: '피쉬앤칩스', category: 'fastfood', fullness: '보통', time: '짧음', spicy: false, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '나초', category: 'fastfood', fullness: '낮음', time: '짧음', spicy: true, solo: false, light: true, hasStew: false, price: '저렴' },
  { name: '윙', category: 'fastfood', fullness: '보통', time: '짧음', spicy: true, solo: true, light: false, hasStew: false, price: '보통' },
  { name: '랩', category: 'fastfood', fullness: '보통', time: '짧음', spicy: false, solo: true, light: true, hasStew: false, price: '저렴' },
];

type Situation = 'solo' | 'group' | 'light' | 'heavy' | 'any';
type Taste = 'spicy' | 'mild' | 'stew' | 'any';
type Budget = 'cheap' | 'medium' | 'expensive' | 'any';
type Time = 'fast' | 'normal' | 'slow' | 'any';

export function MenuRecommender() {
  const [category, setCategory] = useState<Category>('all');
  const [situation, setSituation] = useState<Situation>('any');
  const [taste, setTaste] = useState<Taste>('any');
  const [budget, setBudget] = useState<Budget>('any');
  const [time, setTime] = useState<Time>('any');
  const [randomPick, setRandomPick] = useState<Menu | null>(null);

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      if (category !== 'all' && menu.category !== category) return false;
      if (situation === 'solo' && !menu.solo) return false;
      if (situation === 'group' && menu.solo) return false;
      if (situation === 'light' && !menu.light) return false;
      if (situation === 'heavy' && menu.fullness !== '높음') return false;
      if (taste === 'spicy' && !menu.spicy) return false;
      if (taste === 'mild' && menu.spicy) return false;
      if (taste === 'stew' && !menu.hasStew) return false;
      if (budget === 'cheap' && menu.price !== '저렴') return false;
      if (budget === 'medium' && menu.price === '비쌈') return false;
      if (budget === 'expensive' && menu.price === '저렴') return false;
      if (time === 'fast' && menu.time !== '짧음') return false;
      if (time === 'slow' && menu.time === '짧음') return false;
      return true;
    });
  }, [category, situation, taste, budget, time]);

  const handleRandomPick = () => {
    if (filteredMenus.length === 0) return;
    const picked = filteredMenus[Math.floor(Math.random() * filteredMenus.length)];
    setRandomPick(picked);
  };

  const handleReset = () => {
    setCategory('all');
    setSituation('any');
    setTaste('any');
    setBudget('any');
    setTime('any');
    setRandomPick(null);
  };

  const renderCategoryButtons = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => setCategory('all')}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          category === 'all'
            ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900'
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        🍽️ 전체
      </button>
      {(Object.keys(categoryInfo) as MenuCategory[]).map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            category === cat
              ? `${categoryInfo[cat].bg} ${categoryInfo[cat].border} border-2`
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {categoryInfo[cat].emoji} {categoryInfo[cat].label}
        </button>
      ))}
    </div>
  );

  const renderOption = <T extends string>(
    label: string,
    value: T,
    setValue: (v: T) => void,
    options: { key: T; label: string }[]
  ) => (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[50px]">{label}</span>
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

  const currentCatInfo = category !== 'all' ? categoryInfo[category] : null;

  return (
    <div className="space-y-4">
      {/* 카테고리 선택 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">음식 종류</h3>
        {renderCategoryButtons()}

        <h3 className="text-sm font-semibold mb-3 mt-4 text-gray-700 dark:text-gray-300">세부 조건</h3>
        <div className="space-y-2">
          {renderOption('상황', situation, setSituation, [
            { key: 'any', label: '상관없음' },
            { key: 'solo', label: '혼밥' },
            { key: 'group', label: '여럿이서' },
            { key: 'light', label: '가볍게' },
            { key: 'heavy', label: '든든하게' },
          ])}
          {renderOption('맛', taste, setTaste, [
            { key: 'any', label: '상관없음' },
            { key: 'spicy', label: '매운거' },
            { key: 'mild', label: '안매운거' },
            { key: 'stew', label: '국물있는' },
          ])}
          {renderOption('가격', budget, setBudget, [
            { key: 'any', label: '상관없음' },
            { key: 'cheap', label: '저렴하게' },
            { key: 'medium', label: '적당히' },
            { key: 'expensive', label: '좀 써도됨' },
          ])}
          {renderOption('시간', time, setTime, [
            { key: 'any', label: '상관없음' },
            { key: 'fast', label: '빨리' },
            { key: 'normal', label: '보통' },
            { key: 'slow', label: '여유있게' },
          ])}
        </div>

        <p className="text-xs text-gray-500 mt-3">
          조건에 맞는 메뉴: <span className="font-bold text-blue-600">{filteredMenus.length}개</span>
        </p>
      </Card>

      {/* 오늘의 강력 추천 */}
      <Card variant="bordered" className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🔥</span>
          <h3 className="font-bold text-amber-800 dark:text-amber-300">오늘의 강력 추천</h3>
        </div>
        {filteredMenus.length > 0 ? (
          <TodayPick menus={filteredMenus} />
        ) : (
          <p className="text-sm text-gray-500">조건에 맞는 메뉴가 없습니다</p>
        )}
      </Card>

      {/* 버튼 */}
      <div className="flex gap-3 justify-center">
        <Button onClick={handleRandomPick} disabled={filteredMenus.length === 0}>
          🎲 랜덤 뽑기
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          초기화
        </Button>
      </div>

      {/* 랜덤 결과 */}
      {randomPick && (
        <Card
          variant="bordered"
          className={`p-6 text-center ${
            currentCatInfo ? `${currentCatInfo.bg} ${currentCatInfo.border} border-2` : 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20'
          }`}
        >
          <div className="text-5xl mb-3">
            {categoryInfo[randomPick.category].emoji}
          </div>
          <p className="text-3xl font-bold mb-2">{randomPick.name}</p>
          <div className="flex justify-center gap-3 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
            <span className={`px-2 py-1 rounded ${categoryInfo[randomPick.category].bg}`}>
              {categoryInfo[randomPick.category].label}
            </span>
            <span>포만감: {randomPick.fullness}</span>
            <span>가격: {randomPick.price}</span>
          </div>
          <Button onClick={handleRandomPick} variant="secondary" className="mt-4">
            다시 뽑기
          </Button>
        </Card>
      )}

      {/* 전체 메뉴 목록 - 카테고리별 */}
      <MenuList menus={filteredMenus} randomPick={randomPick} />

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 조건을 선택하면 맞는 메뉴가 필터링됩니다</p>
        <p>• 랜덤 선택으로 고민 없이 결정할 수 있습니다</p>
      </div>

      <SeoContent />
    </div>
  );
}

// 오늘의 강력 추천 - 날짜 기반 + 약간의 랜덤성
function TodayPick({ menus }: { menus: Menu[] }) {
  const todayPick = useMemo(() => {
    if (menus.length === 0) return null;

    // 날짜 기반 시드 (매일 바뀜)
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // 시드 기반 의사 랜덤
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // 각 메뉴에 점수 부여 (날짜 기반)
    const scored = menus.map((menu, idx) => {
      let score = seededRandom(dateSeed + idx) * 10;

      // 포만감 높은 메뉴 가산점
      if (menu.fullness === '높음') score += 2;
      // 가성비 좋은 메뉴 가산점
      if (menu.price === '저렴') score += 1;

      return { menu, score };
    });

    // 상위 3개 중 랜덤 선택 (새로고침 시 약간 변화)
    const top3 = scored.sort((a, b) => b.score - a.score).slice(0, 3);
    const finalIdx = Math.floor(seededRandom(dateSeed * 7) * top3.length);
    return top3[finalIdx].menu;
  }, [menus]);

  if (!todayPick) return null;

  const catInfo = categoryInfo[todayPick.category];

  // 추천 이유 생성
  const reasons: string[] = [];
  if (todayPick.fullness === '높음') reasons.push('든든함');
  if (todayPick.price === '저렴') reasons.push('가성비 굿');
  if (todayPick.time === '짧음') reasons.push('빠른 식사');
  if (todayPick.spicy) reasons.push('매콤한 맛');
  if (todayPick.hasStew) reasons.push('따뜻한 국물');
  if (todayPick.light) reasons.push('가벼움');

  return (
    <div className="flex items-center gap-4">
      <div className="text-4xl">{catInfo.emoji}</div>
      <div className="flex-1">
        <p className="text-xl font-bold text-gray-900 dark:text-white">{todayPick.name}</p>
        <div className="flex gap-2 mt-1 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded ${catInfo.bg}`}>
            {catInfo.label}
          </span>
          {reasons.slice(0, 2).map((r) => (
            <span key={r} className="text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// 전체 메뉴 목록 컴포넌트
function MenuList({ menus, randomPick }: { menus: Menu[]; randomPick: Menu | null }) {
  // 카테고리별로 그룹화
  const grouped = useMemo(() => {
    const groups: Record<MenuCategory, Menu[]> = {
      korean: [],
      chinese: [],
      japanese: [],
      western: [],
      snack: [],
      fastfood: [],
    };
    menus.forEach((menu) => {
      groups[menu.category].push(menu);
    });
    return groups;
  }, [menus]);

  const nonEmptyCategories = (Object.keys(grouped) as MenuCategory[]).filter(
    (cat) => grouped[cat].length > 0
  );

  if (menus.length === 0) {
    return (
      <Card variant="bordered" className="p-6 text-center">
        <p className="text-gray-500">조건에 맞는 메뉴가 없습니다 😅</p>
        <p className="text-sm text-gray-400 mt-1">조건을 조금 완화해보세요</p>
      </Card>
    );
  }

  return (
    <Card variant="bordered" className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📋</span>
        <h3 className="font-bold text-gray-800 dark:text-gray-200">
          전체 메뉴 목록 ({menus.length}개)
        </h3>
      </div>

      <div className="space-y-4">
        {nonEmptyCategories.map((cat) => (
          <div key={cat}>
            <div className={`flex items-center gap-2 mb-2 px-2 py-1 rounded ${categoryInfo[cat].bg}`}>
              <span>{categoryInfo[cat].emoji}</span>
              <span className="font-semibold text-sm">{categoryInfo[cat].label}</span>
              <span className="text-xs text-gray-500">({grouped[cat].length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {grouped[cat].map((menu) => {
                const isSelected = randomPick?.name === menu.name;
                return (
                  <div
                    key={menu.name}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      isSelected
                        ? 'bg-blue-500 text-white border-blue-500 font-bold'
                        : `${categoryInfo[cat].bg} ${categoryInfo[cat].border} hover:opacity-80`
                    }`}
                  >
                    <span>{menu.name}</span>
                    <span className="ml-1 text-xs opacity-70">
                      {menu.price === '저렴' && '💰'}
                      {menu.spicy && '🌶️'}
                      {menu.hasStew && '🍲'}
                      {menu.fullness === '높음' && '🍖'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-400 flex flex-wrap gap-3">
          <span>💰 저렴</span>
          <span>🌶️ 매움</span>
          <span>🍲 국물</span>
          <span>🍖 든든</span>
        </p>
      </div>
    </Card>
  );
}

function SeoContent() {
  return (
    <section className="mt-12 prose prose-gray dark:prose-invert max-w-none">
      <h2 className="text-xl font-semibold mb-4">오늘 뭐 먹지? 메뉴 추천기</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        매일 반복되는 "오늘 뭐 먹지?" 고민을 해결해드립니다.
        한식, 중식, 일식, 양식, 분식, 패스트푸드 등 109개의 다양한 메뉴 중에서
        상황, 입맛, 예산, 시간에 맞는 메뉴를 추천받거나 랜덤으로 선택할 수 있습니다.
      </p>

      <h2 className="text-xl font-semibold mb-4">기능 소개</h2>
      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-6">
        <li><strong>카테고리 필터</strong> - 한식/중식/일식/양식/분식/패스트푸드</li>
        <li><strong>상황별 추천</strong> - 혼밥, 여럿이서, 가볍게, 든든하게</li>
        <li><strong>맛 선택</strong> - 매운거, 안매운거, 국물있는 음식</li>
        <li><strong>예산 필터</strong> - 저렴하게, 적당히, 좀 써도 됨</li>
        <li><strong>랜덤 선택</strong> - 고민 없이 바로 결정!</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">자주 묻는 질문</h2>
      <div className="space-y-4">
        <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">메뉴는 몇 개나 있나요?<span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span></summary>
          <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
            109개의 메뉴가 등록되어 있습니다. 한식 25개, 중식 18개, 일식 18개,
            양식 18개, 분식 15개, 패스트푸드 15개로 구성되어 있습니다.
          </p>
        </details>
        <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">조건을 여러 개 선택하면 어떻게 되나요?<span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span></summary>
          <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
            선택한 모든 조건을 만족하는 메뉴만 필터링됩니다.
            조건이 많을수록 결과가 줄어들 수 있으니 "상관없음"을 적절히 활용하세요.
          </p>
        </details>
      </div>
    </section>
  );
}
