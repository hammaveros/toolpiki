'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

// 천간 (10개)
const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;
// 지지 (12개)
const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;

// 천간 오행 매핑
const CHEONGAN_OHANG: Record<string, string> = {
  갑: '목', 을: '목', 병: '화', 정: '화', 무: '토',
  기: '토', 경: '금', 신: '금', 임: '수', 계: '수',
};

// 천간 음양 매핑
const CHEONGAN_EUMYANG: Record<string, string> = {
  갑: '양', 을: '음', 병: '양', 정: '음', 무: '양',
  기: '음', 경: '양', 신: '음', 임: '양', 계: '음',
};

// 지지 오행 매핑
const JIJI_OHANG: Record<string, string> = {
  자: '수', 축: '토', 인: '목', 묘: '목', 진: '토', 사: '화',
  오: '화', 미: '토', 신: '금', 유: '금', 술: '토', 해: '수',
};

// 지지 동물 매핑
const JIJI_ANIMAL: Record<string, string> = {
  자: '쥐', 축: '소', 인: '호랑이', 묘: '토끼', 진: '용', 사: '뱀',
  오: '말', 미: '양', 신: '원숭이', 유: '닭', 술: '개', 해: '돼지',
};

// 오행 배경색
const OHANG_BG: Record<string, string> = {
  목: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  화: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
  토: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
  금: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  수: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
};

// 절기 상수
const SOLAR_TERMS = [
  { name: '입춘', monthJi: 2 },
  { name: '경칩', monthJi: 3 },
  { name: '청명', monthJi: 4 },
  { name: '입하', monthJi: 5 },
  { name: '망종', monthJi: 6 },
  { name: '소서', monthJi: 7 },
  { name: '입추', monthJi: 8 },
  { name: '백로', monthJi: 9 },
  { name: '한로', monthJi: 10 },
  { name: '입동', monthJi: 11 },
  { name: '대설', monthJi: 0 },
  { name: '소한', monthJi: 1 },
];

interface Saju {
  year: { gan: string; ji: string };
  month: { gan: string; ji: string };
  day: { gan: string; ji: string };
}

// 절기 날짜 계산
function getSolarTermDate(year: number, termIndex: number): Date {
  const baseDates2000 = [
    new Date(2000, 1, 4, 0),
    new Date(2000, 2, 5, 0),
    new Date(2000, 3, 4, 0),
    new Date(2000, 4, 5, 0),
    new Date(2000, 5, 5, 0),
    new Date(2000, 6, 7, 0),
    new Date(2000, 7, 7, 0),
    new Date(2000, 8, 7, 0),
    new Date(2000, 9, 8, 0),
    new Date(2000, 10, 7, 0),
    new Date(2000, 11, 7, 0),
    new Date(2001, 0, 5, 0),
  ];
  const baseDate = baseDates2000[termIndex];
  const yearDiff = year - 2000;
  const msPerYear = 365.2422 * 24 * 60 * 60 * 1000;
  const targetTime = baseDate.getTime() + yearDiff * msPerYear;
  const result = new Date(targetTime);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getIpchunDate(year: number): Date {
  return getSolarTermDate(year, 0);
}

// 년주 계산
function getYearPillar(year: number, month: number, day: number): { gan: string; ji: string } {
  const birthDate = new Date(year, month - 1, day);
  const ipchun = getIpchunDate(year);
  const effectiveYear = birthDate < ipchun ? year - 1 : year;
  const baseYear = 1984;
  const diff = effectiveYear - baseYear;
  const ganIndex = ((diff % 10) + 10) % 10;
  const jiIndex = ((diff % 12) + 12) % 12;
  return { gan: CHEONGAN[ganIndex], ji: JIJI[jiIndex] };
}

// 월주 계산
function getMonthPillar(year: number, month: number, day: number): { gan: string; ji: string } {
  const targetDate = new Date(year, month - 1, day);

  interface TermInfo {
    date: Date;
    monthJi: number;
  }

  const terms: TermInfo[] = [];
  terms.push({ date: getSolarTermDate(year - 1, 10), monthJi: 0 });
  terms.push({ date: getSolarTermDate(year - 1, 11), monthJi: 1 });

  for (let i = 0; i <= 10; i++) {
    terms.push({ date: getSolarTermDate(year, i), monthJi: SOLAR_TERMS[i].monthJi });
  }
  terms.push({ date: getSolarTermDate(year, 11), monthJi: 1 });

  terms.sort((a, b) => a.date.getTime() - b.date.getTime());

  let monthJiIndex = 0;
  for (let i = terms.length - 1; i >= 0; i--) {
    if (targetDate >= terms[i].date) {
      monthJiIndex = terms[i].monthJi;
      break;
    }
  }

  const yearGan = getYearPillar(year, month, day).gan;
  const yearGanIndex = (CHEONGAN as readonly string[]).indexOf(yearGan);

  const monthGanBase = [2, 4, 6, 8, 0];
  const baseGanIndex = monthGanBase[yearGanIndex % 5];
  const monthOffset = (monthJiIndex - 2 + 12) % 12;
  const ganIndex = (baseGanIndex + monthOffset) % 10;

  return { gan: CHEONGAN[ganIndex], ji: JIJI[monthJiIndex] };
}

// 일주 계산
function getJulianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function getDayPillar(year: number, month: number, day: number): { gan: string; ji: string } {
  const jdn = getJulianDayNumber(year, month, day);
  const sexagenary = ((jdn - 11) % 60 + 60) % 60;
  const ganIndex = sexagenary % 10;
  const jiIndex = sexagenary % 12;
  return { gan: CHEONGAN[ganIndex], ji: JIJI[jiIndex] };
}

// 사주 계산
function calculateSaju(year: number, month: number, day: number): Saju {
  return {
    year: getYearPillar(year, month, day),
    month: getMonthPillar(year, month, day),
    day: getDayPillar(year, month, day),
  };
}

// 십성 계산
function calculateSipsung(dayGan: string, targetGan: string): string {
  const dayOhang = CHEONGAN_OHANG[dayGan];
  const targetOhang = CHEONGAN_OHANG[targetGan];
  const dayEumyang = CHEONGAN_EUMYANG[dayGan];
  const targetEumyang = CHEONGAN_EUMYANG[targetGan];
  const isSameEumyang = dayEumyang === targetEumyang;

  const ohangOrder = ['목', '화', '토', '금', '수'];
  const dayIdx = ohangOrder.indexOf(dayOhang);
  const targetIdx = ohangOrder.indexOf(targetOhang);

  if (dayOhang === targetOhang) {
    return isSameEumyang ? '비견' : '겁재';
  }
  if ((dayIdx + 1) % 5 === targetIdx) {
    return isSameEumyang ? '식신' : '상관';
  }
  if ((dayIdx + 2) % 5 === targetIdx) {
    return isSameEumyang ? '편재' : '정재';
  }
  if ((dayIdx + 3) % 5 === targetIdx) {
    return isSameEumyang ? '편관' : '정관';
  }
  if ((dayIdx + 4) % 5 === targetIdx) {
    return isSameEumyang ? '편인' : '정인';
  }
  return '비견';
}

// 오행 분석
function analyzeOhang(saju: Saju): Record<string, number> {
  const count: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  count[CHEONGAN_OHANG[saju.year.gan]]++;
  count[CHEONGAN_OHANG[saju.month.gan]]++;
  count[CHEONGAN_OHANG[saju.day.gan]]++;
  count[JIJI_OHANG[saju.year.ji]]++;
  count[JIJI_OHANG[saju.month.ji]]++;
  count[JIJI_OHANG[saju.day.ji]]++;
  return count;
}

// 육합 (서로 합이 되는 지지)
const YUKAP: Record<string, string> = {
  자: '축', 축: '자',
  인: '해', 해: '인',
  묘: '술', 술: '묘',
  진: '유', 유: '진',
  사: '신', 신: '사',
  오: '미', 미: '오',
};

// 삼합 (세 지지가 합하여 오행을 이룸)
const SAMHAP: Record<string, string[]> = {
  자: ['자', '진', '신'], // 수국
  축: ['축', '사', '유'], // 금국
  인: ['인', '오', '술'], // 화국
  묘: ['묘', '미', '해'], // 목국
  진: ['자', '진', '신'],
  사: ['축', '사', '유'],
  오: ['인', '오', '술'],
  미: ['묘', '미', '해'],
  신: ['자', '진', '신'],
  유: ['축', '사', '유'],
  술: ['인', '오', '술'],
  해: ['묘', '미', '해'],
};

// 상충 (서로 충돌하는 지지)
const SANGCHUNG: Record<string, string> = {
  자: '오', 오: '자',
  축: '미', 미: '축',
  인: '신', 신: '인',
  묘: '유', 유: '묘',
  진: '술', 술: '진',
  사: '해', 해: '사',
};

// 형 (서로 해치는 관계)
const HYUNG: Record<string, string[]> = {
  자: ['묘'],
  묘: ['자'],
  인: ['사', '신'],
  사: ['인', '신'],
  신: ['인', '사'],
  축: ['술', '미'],
  술: ['축', '미'],
  미: ['축', '술'],
  진: ['진'],
  오: ['오'],
  유: ['유'],
  해: ['해'],
};

// 궁합 분석 결과 타입
interface CompatibilityResult {
  person1: {
    name: string;
    saju: Saju;
    dayGan: string;
    dayGanOhang: string;
    animal: string;
    ohang: Record<string, number>;
  };
  person2: {
    name: string;
    saju: Saju;
    dayGan: string;
    dayGanOhang: string;
    animal: string;
    ohang: Record<string, number>;
  };
  love: {
    score: number;
    sipsung1to2: string;
    sipsung2to1: string;
    iljiRelation: string;
    description: string;
  };
  business: {
    score: number;
    ohangComplement: boolean;
    description: string;
  };
  friendship: {
    score: number;
    ddiRelation: string;
    description: string;
  };
  total: {
    score: number;
    summary: string;
  };
}

// 띠 궁합 분석
function analyzeDdiRelation(ji1: string, ji2: string): { relation: string; score: number } {
  // 육합 체크
  if (YUKAP[ji1] === ji2) {
    return { relation: '육합 (六合)', score: 95 };
  }
  // 삼합 체크
  const samhap1 = SAMHAP[ji1];
  if (samhap1.includes(ji2)) {
    return { relation: '삼합 (三合)', score: 85 };
  }
  // 상충 체크
  if (SANGCHUNG[ji1] === ji2) {
    return { relation: '상충 (相沖)', score: 40 };
  }
  // 형 체크
  if (HYUNG[ji1]?.includes(ji2)) {
    return { relation: '형 (刑)', score: 50 };
  }
  // 일반
  return { relation: '보통', score: 65 };
}

// 일지 관계 분석
function analyzeIljiRelation(ji1: string, ji2: string): { relation: string; score: number; advice: string } {
  if (YUKAP[ji1] === ji2) {
    return { relation: '육합', score: 95, advice: '천생연분! 서로 잘 맞고 조화롭습니다.' };
  }
  const samhap1 = SAMHAP[ji1];
  if (samhap1.includes(ji2)) {
    return { relation: '삼합', score: 85, advice: '서로 돕고 시너지가 나는 관계입니다.' };
  }
  if (SANGCHUNG[ji1] === ji2) {
    return { relation: '상충', score: 40, advice: '의견 충돌이 잦을 수 있어요. 서로 존중이 필요합니다.' };
  }
  if (HYUNG[ji1]?.includes(ji2)) {
    return { relation: '형', score: 50, advice: '친해질수록 말조심! 서로 상처주기 쉽습니다.' };
  }
  return { relation: '보통', score: 65, advice: '특별히 좋거나 나쁘지 않은 관계입니다.' };
}

// 오행 상생상극 관계
function getOhangRelation(ohang1: string, ohang2: string): { relation: string; description: string } {
  const ohangOrder = ['목', '화', '토', '금', '수'];
  const idx1 = ohangOrder.indexOf(ohang1);
  const idx2 = ohangOrder.indexOf(ohang2);

  if (idx1 === idx2) {
    return { relation: '동일', description: '같은 오행으로 동질감이 있습니다.' };
  }
  if ((idx1 + 1) % 5 === idx2) {
    return { relation: '상생 (내가 생함)', description: `${ohang1}이 ${ohang2}를 생합니다. 주는 관계입니다.` };
  }
  if ((idx1 + 4) % 5 === idx2) {
    return { relation: '상생 (내가 받음)', description: `${ohang2}이 ${ohang1}를 생합니다. 받는 관계입니다.` };
  }
  if ((idx1 + 2) % 5 === idx2) {
    return { relation: '상극 (내가 극함)', description: `${ohang1}이 ${ohang2}를 극합니다. 내가 주도합니다.` };
  }
  if ((idx1 + 3) % 5 === idx2) {
    return { relation: '상극 (내가 극당함)', description: `${ohang2}이 ${ohang1}를 극합니다. 상대가 주도합니다.` };
  }
  return { relation: '무관', description: '' };
}

// 종합 궁합 분석
function analyzeCompatibility(
  name1: string,
  year1: number,
  month1: number,
  day1: number,
  gender1: string,
  name2: string,
  year2: number,
  month2: number,
  day2: number,
  gender2: string
): CompatibilityResult {
  const saju1 = calculateSaju(year1, month1, day1);
  const saju2 = calculateSaju(year2, month2, day2);

  const dayGan1 = saju1.day.gan;
  const dayGan2 = saju2.day.gan;
  const dayJi1 = saju1.day.ji;
  const dayJi2 = saju2.day.ji;
  const yearJi1 = saju1.year.ji;
  const yearJi2 = saju2.year.ji;

  const ohang1 = analyzeOhang(saju1);
  const ohang2 = analyzeOhang(saju2);

  // 일간 십성 관계
  const sipsung1to2 = calculateSipsung(dayGan1, dayGan2);
  const sipsung2to1 = calculateSipsung(dayGan2, dayGan1);

  // 일지 관계
  const iljiAnalysis = analyzeIljiRelation(dayJi1, dayJi2);

  // 띠 관계
  const ddiAnalysis = analyzeDdiRelation(yearJi1, yearJi2);

  // 오행 관계
  const ohangRelation = getOhangRelation(CHEONGAN_OHANG[dayGan1], CHEONGAN_OHANG[dayGan2]);

  // 애정 궁합 점수 계산
  let loveScore = 60;
  // 정재-정관 관계 (전통적 부부운)
  if ((sipsung1to2 === '정재' && sipsung2to1 === '정관') ||
      (sipsung1to2 === '정관' && sipsung2to1 === '정재')) {
    loveScore += 20;
  } else if ((sipsung1to2 === '편재' && sipsung2to1 === '편관') ||
             (sipsung1to2 === '편관' && sipsung2to1 === '편재')) {
    loveScore += 15;
  } else if (sipsung1to2 === '비견' || sipsung2to1 === '비견') {
    loveScore += 5; // 친구같은 관계
  }
  // 일지 관계 반영
  loveScore += (iljiAnalysis.score - 65) / 2;
  loveScore = Math.min(100, Math.max(0, loveScore));

  // 애정 궁합 설명
  let loveDesc = '';
  if (loveScore >= 80) {
    loveDesc = '천생연분! 서로 끌리고 잘 맞는 궁합입니다.';
  } else if (loveScore >= 60) {
    loveDesc = '괜찮은 궁합입니다. 노력하면 좋은 관계를 유지할 수 있어요.';
  } else {
    loveDesc = '서로 다른 점이 많아 이해와 배려가 필요합니다.';
  }

  // 사업 궁합 점수 계산
  let businessScore = 60;
  // 오행 보완 체크
  const missing1 = Object.entries(ohang1).filter(([_, v]) => v === 0).map(([k]) => k);
  const missing2 = Object.entries(ohang2).filter(([_, v]) => v === 0).map(([k]) => k);
  const complement1 = missing1.filter(o => (ohang2[o] || 0) > 0);
  const complement2 = missing2.filter(o => (ohang1[o] || 0) > 0);
  const ohangComplement = complement1.length > 0 || complement2.length > 0;
  if (ohangComplement) {
    businessScore += 15;
  }
  // 비견/겁재 관계 (경쟁 관계)
  if (sipsung1to2 === '비견' || sipsung2to1 === '비견') {
    businessScore += 10; // 동등한 파트너
  }
  if (sipsung1to2 === '겁재' || sipsung2to1 === '겁재') {
    businessScore -= 10; // 경쟁/갈등 가능
  }
  businessScore = Math.min(100, Math.max(0, businessScore));

  let businessDesc = '';
  if (businessScore >= 75) {
    businessDesc = '사업 파트너로 좋습니다. 서로 부족한 부분을 채워줍니다.';
  } else if (businessScore >= 55) {
    businessDesc = '역할 분담을 명확히 하면 함께 일할 수 있습니다.';
  } else {
    businessDesc = '의견 충돌이 잦을 수 있어요. 동업보다 각자의 영역이 좋습니다.';
  }

  // 친구 궁합 점수
  let friendshipScore = ddiAnalysis.score;
  // 같은 오행이면 동질감
  if (CHEONGAN_OHANG[dayGan1] === CHEONGAN_OHANG[dayGan2]) {
    friendshipScore += 10;
  }
  friendshipScore = Math.min(100, Math.max(0, friendshipScore));

  let friendshipDesc = '';
  if (friendshipScore >= 80) {
    friendshipDesc = '서로 잘 통하고 편안한 친구 관계입니다.';
  } else if (friendshipScore >= 60) {
    friendshipDesc = '좋은 친구가 될 수 있습니다.';
  } else {
    friendshipDesc = '서로 다른 성향이지만, 그래서 배울 점도 있습니다.';
  }

  // 종합 점수
  const totalScore = Math.round((loveScore + businessScore + friendshipScore) / 3);
  let summary = '';
  if (totalScore >= 80) {
    summary = '전체적으로 매우 좋은 궁합입니다! 어떤 관계로든 잘 맞습니다.';
  } else if (totalScore >= 65) {
    summary = '괜찮은 궁합입니다. 서로 노력하면 좋은 관계를 유지할 수 있어요.';
  } else if (totalScore >= 50) {
    summary = '보통의 궁합입니다. 서로의 차이를 이해하고 존중하세요.';
  } else {
    summary = '서로 다른 점이 많습니다. 많은 이해와 배려가 필요해요.';
  }

  return {
    person1: {
      name: name1 || '사람 1',
      saju: saju1,
      dayGan: dayGan1,
      dayGanOhang: CHEONGAN_OHANG[dayGan1],
      animal: JIJI_ANIMAL[yearJi1],
      ohang: ohang1,
    },
    person2: {
      name: name2 || '사람 2',
      saju: saju2,
      dayGan: dayGan2,
      dayGanOhang: CHEONGAN_OHANG[dayGan2],
      animal: JIJI_ANIMAL[yearJi2],
      ohang: ohang2,
    },
    love: {
      score: Math.round(loveScore),
      sipsung1to2,
      sipsung2to1,
      iljiRelation: iljiAnalysis.relation,
      description: loveDesc,
    },
    business: {
      score: Math.round(businessScore),
      ohangComplement,
      description: businessDesc,
    },
    friendship: {
      score: Math.round(friendshipScore),
      ddiRelation: ddiAnalysis.relation,
      description: friendshipDesc,
    },
    total: {
      score: totalScore,
      summary,
    },
  };
}

// 점수 색상
function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-blue-600 dark:text-blue-400';
  if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-500 dark:text-red-400';
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-400';
}

export function SajuCompatibility() {
  // 사람 1
  const [name1, setName1] = useState('');
  const [year1, setYear1] = useState('');
  const [month1, setMonth1] = useState('');
  const [day1, setDay1] = useState('');
  const [gender1, setGender1] = useState<'male' | 'female'>('male');

  // 사람 2
  const [name2, setName2] = useState('');
  const [year2, setYear2] = useState('');
  const [month2, setMonth2] = useState('');
  const [day2, setDay2] = useState('');
  const [gender2, setGender2] = useState<'male' | 'female'>('female');

  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = () => {
    setError(null);
    setResult(null);

    const y1 = parseInt(year1);
    const m1 = parseInt(month1);
    const d1 = parseInt(day1);
    const y2 = parseInt(year2);
    const m2 = parseInt(month2);
    const d2 = parseInt(day2);

    if (isNaN(y1) || isNaN(m1) || isNaN(d1) || isNaN(y2) || isNaN(m2) || isNaN(d2)) {
      setError('생년월일을 모두 입력해주세요.');
      return;
    }

    if (y1 < 1900 || y1 > 2100 || y2 < 1900 || y2 > 2100) {
      setError('년도는 1900~2100 사이로 입력해주세요.');
      return;
    }

    if (m1 < 1 || m1 > 12 || m2 < 1 || m2 > 12) {
      setError('월은 1~12 사이로 입력해주세요.');
      return;
    }

    if (d1 < 1 || d1 > 31 || d2 < 1 || d2 > 31) {
      setError('일은 1~31 사이로 입력해주세요.');
      return;
    }

    const compatibility = analyzeCompatibility(
      name1, y1, m1, d1, gender1,
      name2, y2, m2, d2, gender2
    );
    setResult(compatibility);
  };

  const handleReset = () => {
    setName1('');
    setYear1('');
    setMonth1('');
    setDay1('');
    setGender1('male');
    setName2('');
    setYear2('');
    setMonth2('');
    setDay2('');
    setGender2('female');
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* 입력 폼 */}
      <Card variant="bordered" className="p-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* 사람 1 */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-center">👤 첫 번째 사람</h3>
            <Input
              label="이름 (선택)"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="예: 홍길동"
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                label="년"
                type="number"
                value={year1}
                onChange={(e) => setYear1(e.target.value)}
                placeholder="2000"
              />
              <Input
                label="월"
                type="number"
                value={month1}
                onChange={(e) => setMonth1(e.target.value)}
                placeholder="1"
              />
              <Input
                label="일"
                type="number"
                value={day1}
                onChange={(e) => setDay1(e.target.value)}
                placeholder="1"
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender1"
                  checked={gender1 === 'male'}
                  onChange={() => setGender1('male')}
                  className="accent-blue-500"
                />
                <span>남자</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender1"
                  checked={gender1 === 'female'}
                  onChange={() => setGender1('female')}
                  className="accent-pink-500"
                />
                <span>여자</span>
              </label>
            </div>
          </div>

          {/* 사람 2 */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-center">👤 두 번째 사람</h3>
            <Input
              label="이름 (선택)"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="예: 김철수"
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                label="년"
                type="number"
                value={year2}
                onChange={(e) => setYear2(e.target.value)}
                placeholder="2000"
              />
              <Input
                label="월"
                type="number"
                value={month2}
                onChange={(e) => setMonth2(e.target.value)}
                placeholder="1"
              />
              <Input
                label="일"
                type="number"
                value={day2}
                onChange={(e) => setDay2(e.target.value)}
                placeholder="1"
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender2"
                  checked={gender2 === 'male'}
                  onChange={() => setGender2('male')}
                  className="accent-blue-500"
                />
                <span>남자</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender2"
                  checked={gender2 === 'female'}
                  onChange={() => setGender2('female')}
                  className="accent-pink-500"
                />
                <span>여자</span>
              </label>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}

        <div className="flex gap-3 mt-6 justify-center">
          <Button onClick={handleAnalyze} size="lg">
            💕 궁합 보기
          </Button>
          <Button onClick={handleReset} variant="outline">
            초기화
          </Button>
        </div>
      </Card>

      {/* 결과 */}
      {result && (
        <div className="space-y-6">
          {/* 종합 점수 */}
          <Card variant="bordered" className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">💫 종합 궁합</h2>
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.total.score)}`}>
              {result.total.score}점
            </div>
            <p className="text-gray-600 dark:text-gray-400">{result.total.summary}</p>

            {/* 두 사람 요약 */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="font-bold">{result.person1.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {result.person1.animal}띠 · {result.person1.dayGan}({result.person1.dayGanOhang})
                </div>
              </div>
              <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <div className="font-bold">{result.person2.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {result.person2.animal}띠 · {result.person2.dayGan}({result.person2.dayGanOhang})
                </div>
              </div>
            </div>
          </Card>

          {/* 상세 궁합 */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* 애정 궁합 */}
            <Card variant="bordered" className="p-4">
              <h3 className="font-bold text-lg mb-3 text-center">💕 애정 궁합</h3>
              <div className="text-center mb-4">
                <div className={`text-4xl font-bold ${getScoreColor(result.love.score)}`}>
                  {result.love.score}점
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${getScoreBg(result.love.score)}`}
                    style={{ width: `${result.love.score}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{result.person1.name} → {result.person2.name}</span>
                  <span className="font-medium">{result.love.sipsung1to2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{result.person2.name} → {result.person1.name}</span>
                  <span className="font-medium">{result.love.sipsung2to1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">일지 관계</span>
                  <span className="font-medium">{result.love.iljiRelation}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
                {result.love.description}
              </p>
              <details className="mt-3 text-xs">
                <summary className="cursor-pointer text-blue-500 hover:underline">십성이란?</summary>
                <p className="mt-2 text-gray-500 dark:text-gray-400 leading-relaxed">
                  십성(十星)은 두 사람의 일간(日干) 오행 관계를 나타냅니다.
                  정관/편관은 통제, 정재/편재는 재물, 정인/편인은 보호,
                  식신/상관은 표현, 비견/겁재는 경쟁 관계를 의미합니다.
                </p>
              </details>
            </Card>

            {/* 사업 궁합 */}
            <Card variant="bordered" className="p-4">
              <h3 className="font-bold text-lg mb-3 text-center">💼 사업 궁합</h3>
              <div className="text-center mb-4">
                <div className={`text-4xl font-bold ${getScoreColor(result.business.score)}`}>
                  {result.business.score}점
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${getScoreBg(result.business.score)}`}
                    style={{ width: `${result.business.score}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">오행 보완</span>
                  <span className="font-medium">{result.business.ohangComplement ? '✅ 서로 보완' : '➖ 보통'}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
                {result.business.description}
              </p>
              <details className="mt-3 text-xs">
                <summary className="cursor-pointer text-blue-500 hover:underline">오행 보완이란?</summary>
                <p className="mt-2 text-gray-500 dark:text-gray-400 leading-relaxed">
                  오행(五行)은 목(木), 화(火), 토(土), 금(金), 수(水)입니다.
                  서로 부족한 오행을 채워주면 시너지가 납니다.
                  예: 목이 강한 사람 + 금이 강한 사람 = 서로 보완.
                </p>
              </details>
            </Card>

            {/* 친구 궁합 */}
            <Card variant="bordered" className="p-4">
              <h3 className="font-bold text-lg mb-3 text-center">🤝 친구 궁합</h3>
              <div className="text-center mb-4">
                <div className={`text-4xl font-bold ${getScoreColor(result.friendship.score)}`}>
                  {result.friendship.score}점
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${getScoreBg(result.friendship.score)}`}
                    style={{ width: `${result.friendship.score}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">띠 관계</span>
                  <span className="font-medium">{result.friendship.ddiRelation}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
                {result.friendship.description}
              </p>
              <details className="mt-3 text-xs">
                <summary className="cursor-pointer text-blue-500 hover:underline">띠 궁합이란?</summary>
                <p className="mt-2 text-gray-500 dark:text-gray-400 leading-relaxed">
                  12지지(띠) 간의 관계입니다.
                  육합(六合): 쥐-소, 호랑이-돼지 등 최고 궁합.
                  삼합(三合): 원숭이-쥐-용 등 좋은 궁합.
                  상충(相沖): 쥐-말, 소-양 등 충돌 관계.
                </p>
              </details>
            </Card>
          </div>

          {/* 사주 비교 */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-bold text-lg mb-4 text-center">📜 사주 비교</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* 사람 1 사주 */}
              <div>
                <h4 className="font-medium text-center mb-3">{result.person1.name}</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="text-xs text-gray-500">년주</div>
                    <div className="font-bold">{result.person1.saju.year.gan}{result.person1.saju.year.ji}</div>
                    <div className="text-xs">{result.person1.animal}띠</div>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="text-xs text-gray-500">월주</div>
                    <div className="font-bold">{result.person1.saju.month.gan}{result.person1.saju.month.ji}</div>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border-2 border-blue-400">
                    <div className="text-xs text-gray-500">일주</div>
                    <div className="font-bold">{result.person1.saju.day.gan}{result.person1.saju.day.ji}</div>
                    <div className={`text-xs px-1 rounded ${OHANG_BG[result.person1.dayGanOhang]}`}>
                      {result.person1.dayGanOhang}
                    </div>
                  </div>
                </div>
              </div>

              {/* 사람 2 사주 */}
              <div>
                <h4 className="font-medium text-center mb-3">{result.person2.name}</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="text-xs text-gray-500">년주</div>
                    <div className="font-bold">{result.person2.saju.year.gan}{result.person2.saju.year.ji}</div>
                    <div className="text-xs">{result.person2.animal}띠</div>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="text-xs text-gray-500">월주</div>
                    <div className="font-bold">{result.person2.saju.month.gan}{result.person2.saju.month.ji}</div>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border-2 border-pink-400">
                    <div className="text-xs text-gray-500">일주</div>
                    <div className="font-bold">{result.person2.saju.day.gan}{result.person2.saju.day.ji}</div>
                    <div className={`text-xs px-1 rounded ${OHANG_BG[result.person2.dayGanOhang]}`}>
                      {result.person2.dayGanOhang}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-semibold mb-4">사주 궁합이란?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          사주 궁합은 두 사람의 사주팔자를 비교하여 애정, 사업, 우정 등 다양한 관계에서의 조화를 분석합니다.
          일간(日干)의 오행 관계, 띠 궁합, 일지(日支)의 합충 등을 종합적으로 고려합니다.
        </p>

        <FaqSection
          title="자주 묻는 질문"
          faqs={[
            {
              question: '궁합 점수가 낮으면 안 좋은 건가요?',
              answer: '점수는 참고용입니다. 궁합이 낮아도 서로 노력하면 좋은 관계를 유지할 수 있고, 높아도 갈등이 있을 수 있습니다.',
            },
            {
              question: '어떤 관계 궁합이 가장 중요한가요?',
              answer: '관계의 목적에 따라 다릅니다. 연인/부부는 애정 궁합, 동업자는 사업 궁합을 중점적으로 보시면 됩니다.',
            },
            {
              question: '시간까지 입력해야 정확한가요?',
              answer: '기본적인 궁합은 생년월일만으로도 충분합니다. 더 상세한 분석을 원하시면 시주까지 포함된 전문 상담을 권장합니다.',
            },
          ]}
        />
      </div>
    </div>
  );
}
