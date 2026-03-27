'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

// 천간 (10개)
const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;
// 지지 (12개)
const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;
// 오행
const OHANG = ['목', '화', '토', '금', '수'] as const;

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

// 지지 음양 매핑 (지지 십성 계산용)
const JIJI_EUMYANG: Record<string, string> = {
  자: '양', 축: '음', 인: '양', 묘: '음', 진: '양', 사: '음',
  오: '양', 미: '음', 신: '양', 유: '음', 술: '양', 해: '음',
};

// 시간대 (2시간 단위)
const TIME_PERIODS = [
  { value: 0, label: '자시 (23:00~01:00)', ji: '자' },
  { value: 1, label: '축시 (01:00~03:00)', ji: '축' },
  { value: 3, label: '인시 (03:00~05:00)', ji: '인' },
  { value: 5, label: '묘시 (05:00~07:00)', ji: '묘' },
  { value: 7, label: '진시 (07:00~09:00)', ji: '진' },
  { value: 9, label: '사시 (09:00~11:00)', ji: '사' },
  { value: 11, label: '오시 (11:00~13:00)', ji: '오' },
  { value: 13, label: '미시 (13:00~15:00)', ji: '미' },
  { value: 15, label: '신시 (15:00~17:00)', ji: '신' },
  { value: 17, label: '유시 (17:00~19:00)', ji: '유' },
  { value: 19, label: '술시 (19:00~21:00)', ji: '술' },
  { value: 21, label: '해시 (21:00~23:00)', ji: '해' },
];

// 오행 배경색
const OHANG_BG: Record<string, string> = {
  목: 'bg-green-100 dark:bg-green-900/30',
  화: 'bg-red-100 dark:bg-red-900/30',
  토: 'bg-yellow-100 dark:bg-yellow-900/30',
  금: 'bg-gray-200 dark:bg-gray-700',
  수: 'bg-blue-100 dark:bg-blue-900/30',
};

// 십성 이름
const SIPSUNG_NAMES: Record<string, { name: string; desc: string }> = {
  비견: { name: '비견(比肩)', desc: '형제, 경쟁자, 독립심' },
  겁재: { name: '겁재(劫財)', desc: '형제, 경쟁, 승부욕' },
  식신: { name: '식신(食神)', desc: '재능, 표현력, 창의성' },
  상관: { name: '상관(傷官)', desc: '예술성, 반항심, 재치' },
  편재: { name: '편재(偏財)', desc: '투기, 사업, 돈복' },
  정재: { name: '정재(正財)', desc: '월급, 저축, 안정' },
  편관: { name: '편관(偏官)', desc: '권위, 추진력, 액운' },
  정관: { name: '정관(正官)', desc: '명예, 직장, 승진' },
  편인: { name: '편인(偏印)', desc: '학문, 종교, 예술' },
  정인: { name: '정인(正印)', desc: '학력, 자격, 어머니' },
};

interface Saju {
  year: { gan: string; ji: string };
  month: { gan: string; ji: string };
  day: { gan: string; ji: string };
  hour: { gan: string; ji: string } | null;
}

// 절기 계산을 위한 상수 (태양 황경 기준)
// 절기는 15도 간격, 입춘(315도)부터 시작
const SOLAR_TERMS = [
  { name: '입춘', longitude: 315, monthJi: 2 },  // 인월 시작
  { name: '경칩', longitude: 345, monthJi: 3 },  // 묘월 시작
  { name: '청명', longitude: 15, monthJi: 4 },   // 진월 시작
  { name: '입하', longitude: 45, monthJi: 5 },   // 사월 시작
  { name: '망종', longitude: 75, monthJi: 6 },   // 오월 시작
  { name: '소서', longitude: 105, monthJi: 7 },  // 미월 시작
  { name: '입추', longitude: 135, monthJi: 8 },  // 신월 시작
  { name: '백로', longitude: 165, monthJi: 9 },  // 유월 시작
  { name: '한로', longitude: 195, monthJi: 10 }, // 술월 시작
  { name: '입동', longitude: 225, monthJi: 11 }, // 해월 시작
  { name: '대설', longitude: 255, monthJi: 0 },  // 자월 시작
  { name: '소한', longitude: 285, monthJi: 1 },  // 축월 시작
];

// 절기 날짜 계산 (근사 공식)
// 참고: 절기는 태양 황경이 특정 각도가 되는 시점
function getSolarTermDate(year: number, termIndex: number): Date {
  // 기준점: 2000년 각 절기의 날짜 (시간은 00:00으로 통일 - 날짜 단위 비교용)
  const baseDates2000 = [
    new Date(2000, 1, 4, 0),   // 입춘 2월 4일
    new Date(2000, 2, 5, 0),   // 경칩 3월 5일
    new Date(2000, 3, 4, 0),   // 청명 4월 4일
    new Date(2000, 4, 5, 0),   // 입하 5월 5일
    new Date(2000, 5, 5, 0),   // 망종 6월 5일
    new Date(2000, 6, 7, 0),   // 소서 7월 7일
    new Date(2000, 7, 7, 0),   // 입추 8월 7일
    new Date(2000, 8, 7, 0),   // 백로 9월 7일
    new Date(2000, 9, 8, 0),   // 한로 10월 8일
    new Date(2000, 10, 7, 0),  // 입동 11월 7일
    new Date(2000, 11, 7, 0),  // 대설 12월 7일
    new Date(2001, 0, 5, 0),   // 소한 (다음해) 1월 5일
  ];

  const baseDate = baseDates2000[termIndex];
  const yearDiff = year - 2000;

  // 윤년 보정을 포함한 계산
  const baseTime = baseDate.getTime();
  const msPerYear = 365.2422 * 24 * 60 * 60 * 1000;
  const targetTime = baseTime + yearDiff * msPerYear;

  // 날짜만 사용 (시간은 00:00으로 고정)
  const result = new Date(targetTime);
  result.setHours(0, 0, 0, 0);

  return result;
}

// 특정 날짜가 어떤 월에 해당하는지 (절기 기준)
function getMonthByTerm(year: number, month: number, day: number): { monthJi: number; yearForMonth: number } {
  const targetDate = new Date(year, month - 1, day);

  // 현재 년도와 전년도의 절기를 확인
  for (let y = year; y >= year - 1; y--) {
    // 역순으로 절기 확인 (소한부터 입춘까지)
    for (let i = 11; i >= 0; i--) {
      const termDate = getSolarTermDate(i === 11 && y === year ? y : y, i);
      // 소한은 다음해 1월이므로 특별 처리
      const adjustedTermDate = i === 11 ? getSolarTermDate(y, i) : termDate;

      if (targetDate >= adjustedTermDate) {
        const monthJi = SOLAR_TERMS[i].monthJi;
        // 입춘 전(자월, 축월)이면 전년도 기준
        const yearForMonth = (i >= 10 || i === 11) && month <= 2 ? y - 1 : y;
        return { monthJi, yearForMonth: monthJi < 2 ? y - 1 : y };
      }
    }
  }

  // 기본값 (12월 대설 이후 ~ 1월 소한 이전 = 자월)
  return { monthJi: 0, yearForMonth: year - 1 };
}

// 월의 절기 시작일 구하기 (간소화된 버전)
function getMonthTermDate(year: number, monthJiIndex: number): Date {
  // monthJiIndex: 0=자, 1=축, 2=인, ... 11=해
  // 절기 인덱스로 변환
  const termIndex = (monthJiIndex + 10) % 12; // 인월(2)이 첫 번째 절기(입춘)
  return getSolarTermDate(year, termIndex);
}

// 입춘 날짜 구하기
function getIpchunDate(year: number): Date {
  return getSolarTermDate(year, 0); // 입춘은 첫 번째 절기
}

// 년주 계산 (60갑자) - 입춘 기준!
function getYearPillar(year: number, month: number, day: number): { gan: string; ji: string } {
  // 입춘 전이면 전년도로 계산
  const birthDate = new Date(year, month - 1, day);
  const ipchun = getIpchunDate(year);
  const effectiveYear = birthDate < ipchun ? year - 1 : year;

  const baseYear = 1984; // 갑자년
  const diff = effectiveYear - baseYear;
  const ganIndex = ((diff % 10) + 10) % 10;
  const jiIndex = ((diff % 12) + 12) % 12;
  return { gan: CHEONGAN[ganIndex], ji: JIJI[jiIndex] };
}

// 월주 계산 (절기 기준)
// 월지: 입춘~경칩=인(2), 경칩~청명=묘(3), ... 소한~입춘=축(1)
// 월간: 년간에 따라 결정 (갑기년=병인월 시작, 을경년=무인월 시작, ...)
function getMonthPillar(year: number, month: number, day: number): { gan: string; ji: string } {
  const targetDate = new Date(year, month - 1, day);

  // 절기 기준으로 월지 결정
  // 직전에 지난 절기를 찾아서 해당 월 결정
  // 절기 순서: 입춘(인월) → 경칩(묘월) → ... → 대설(자월) → 소한(축월) → 입춘(인월)

  // 절기 배열을 시간순으로 정렬하여 확인
  // 해당 년도 + 전년도 절기를 모두 수집
  interface TermInfo {
    date: Date;
    monthJi: number;
  }

  const terms: TermInfo[] = [];

  // 전년도 대설 (자월 시작) ~ 소한 (축월 시작)
  terms.push({ date: getSolarTermDate(year - 1, 10), monthJi: 0 }); // 전년도 대설 → 자월
  // 소한은 기준데이터가 2001년 1월이므로, year년의 소한은 (year-1)로 계산해야 함
  terms.push({ date: getSolarTermDate(year - 1, 11), monthJi: 1 }); // 소한 → 축월 (해당년도 1월)

  // 해당 년도 입춘 ~ 대설
  for (let i = 0; i <= 10; i++) {
    terms.push({ date: getSolarTermDate(year, i), monthJi: SOLAR_TERMS[i].monthJi });
  }

  // 다음 해 소한 (혹시 12월 말에 해당할 경우)
  terms.push({ date: getSolarTermDate(year + 1, 11), monthJi: 1 });

  // 날짜순 정렬
  terms.sort((a, b) => a.date.getTime() - b.date.getTime());

  // targetDate 직전의 절기 찾기
  let monthJiIndex = 0;
  for (let i = terms.length - 1; i >= 0; i--) {
    if (targetDate >= terms[i].date) {
      monthJiIndex = terms[i].monthJi;
      break;
    }
  }

  // 년간 구하기 (입춘 기준 년도)
  const yearGan = getYearPillar(year, month, day).gan;
  const yearGanIndex = (CHEONGAN as readonly string[]).indexOf(yearGan);

  // 월간 계산: 년간에 따라 인월(2)의 천간이 결정됨
  // 갑/기년: 인월=병(2), 을/경년: 인월=무(4), 병/신년: 인월=경(6), 정/임년: 인월=임(8), 무/계년: 인월=갑(0)
  const monthGanBase = [2, 4, 6, 8, 0]; // 갑기, 을경, 병신, 정임, 무계
  const baseGanIndex = monthGanBase[yearGanIndex % 5];
  // 인월(2)부터 시작해서 월지에 맞게 조정
  const monthOffset = (monthJiIndex - 2 + 12) % 12;
  const ganIndex = (baseGanIndex + monthOffset) % 10;

  return { gan: CHEONGAN[ganIndex], ji: JIJI[monthJiIndex] };
}

// Julian Day Number 계산 (그레고리력 기준)
function getJulianDayNumber(year: number, month: number, day: number): number {
  // 그레고리력 -> JDN 변환 공식
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

// 일주 계산 (Julian Day Number 기반)
// 기준: 2019년 1월 27일 = 갑자일 (JDN = 2458511)
function getDayPillar(year: number, month: number, day: number): { gan: string; ji: string } {
  const jdn = getJulianDayNumber(year, month, day);
  // 2019년 1월 27일(갑자일)의 JDN = 2458511
  // S = 1 + mod(JDN - 11, 60) 에서 11은 mod(2458511, 60) = 11
  const sexagenary = ((jdn - 11) % 60 + 60) % 60; // 0-59 범위
  const ganIndex = sexagenary % 10; // 천간 인덱스 (0-9)
  const jiIndex = sexagenary % 12; // 지지 인덱스 (0-11)
  return { gan: CHEONGAN[ganIndex], ji: JIJI[jiIndex] };
}

// 시주 계산
function getHourPillar(dayGan: string, hour: number): { gan: string; ji: string } {
  let jiIndex = 0;
  if (hour >= 23 || hour < 1) jiIndex = 0;
  else if (hour >= 1 && hour < 3) jiIndex = 1;
  else if (hour >= 3 && hour < 5) jiIndex = 2;
  else if (hour >= 5 && hour < 7) jiIndex = 3;
  else if (hour >= 7 && hour < 9) jiIndex = 4;
  else if (hour >= 9 && hour < 11) jiIndex = 5;
  else if (hour >= 11 && hour < 13) jiIndex = 6;
  else if (hour >= 13 && hour < 15) jiIndex = 7;
  else if (hour >= 15 && hour < 17) jiIndex = 8;
  else if (hour >= 17 && hour < 19) jiIndex = 9;
  else if (hour >= 19 && hour < 21) jiIndex = 10;
  else if (hour >= 21 && hour < 23) jiIndex = 11;

  const dayGanIndex = (CHEONGAN as readonly string[]).indexOf(dayGan);
  const ganIndex = (dayGanIndex * 2 + jiIndex) % 10;
  return { gan: CHEONGAN[ganIndex], ji: JIJI[jiIndex] };
}

// 사주 계산
function calculateSaju(year: number, month: number, day: number, hour: number | null): Saju {
  const yearPillar = getYearPillar(year, month, day);
  const monthPillar = getMonthPillar(year, month, day);
  const dayPillar = getDayPillar(year, month, day);
  const hourPillar = hour !== null ? getHourPillar(dayPillar.gan, hour) : null;

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };
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

  if (saju.hour) {
    count[CHEONGAN_OHANG[saju.hour.gan]]++;
    count[JIJI_OHANG[saju.hour.ji]]++;
  }

  return count;
}

// 십성 계산 (천간용)
function calculateSipsung(dayGan: string, targetGan: string): string {
  const dayOhang = CHEONGAN_OHANG[dayGan];
  const targetOhang = CHEONGAN_OHANG[targetGan];
  const dayEumyang = CHEONGAN_EUMYANG[dayGan];
  const targetEumyang = CHEONGAN_EUMYANG[targetGan];
  const isSameEumyang = dayEumyang === targetEumyang;

  const ohangOrder = ['목', '화', '토', '금', '수'];
  const dayIdx = ohangOrder.indexOf(dayOhang);
  const targetIdx = ohangOrder.indexOf(targetOhang);

  // 같은 오행
  if (dayOhang === targetOhang) {
    return isSameEumyang ? '비견' : '겁재';
  }

  // 내가 생하는 오행 (식상)
  if ((dayIdx + 1) % 5 === targetIdx) {
    return isSameEumyang ? '식신' : '상관';
  }

  // 내가 극하는 오행 (재성)
  if ((dayIdx + 2) % 5 === targetIdx) {
    return isSameEumyang ? '편재' : '정재';
  }

  // 나를 극하는 오행 (관성)
  if ((targetIdx + 2) % 5 === dayIdx) {
    return isSameEumyang ? '편관' : '정관';
  }

  // 나를 생하는 오행 (인성)
  if ((targetIdx + 1) % 5 === dayIdx) {
    return isSameEumyang ? '편인' : '정인';
  }

  return '';
}

// 십성 계산 (지지용) - 일간의 오행과 지지의 오행 비교
function calculateSipsungForJiji(dayGan: string, targetJi: string): string {
  const dayOhang = CHEONGAN_OHANG[dayGan];
  const targetOhang = JIJI_OHANG[targetJi];
  const dayEumyang = CHEONGAN_EUMYANG[dayGan];
  const targetEumyang = JIJI_EUMYANG[targetJi];
  const isSameEumyang = dayEumyang === targetEumyang;

  const ohangOrder = ['목', '화', '토', '금', '수'];
  const dayIdx = ohangOrder.indexOf(dayOhang);
  const targetIdx = ohangOrder.indexOf(targetOhang);

  // 같은 오행
  if (dayOhang === targetOhang) {
    return isSameEumyang ? '비견' : '겁재';
  }

  // 내가 생하는 오행 (식상)
  if ((dayIdx + 1) % 5 === targetIdx) {
    return isSameEumyang ? '식신' : '상관';
  }

  // 내가 극하는 오행 (재성)
  if ((dayIdx + 2) % 5 === targetIdx) {
    return isSameEumyang ? '편재' : '정재';
  }

  // 나를 극하는 오행 (관성)
  if ((targetIdx + 2) % 5 === dayIdx) {
    return isSameEumyang ? '편관' : '정관';
  }

  // 나를 생하는 오행 (인성)
  if ((targetIdx + 1) % 5 === dayIdx) {
    return isSameEumyang ? '편인' : '정인';
  }

  return '';
}

// 십성 분석 (천간 + 지지 모두 계산)
function analyzeSipsung(saju: Saju): Record<string, number> {
  const count: Record<string, number> = {
    비견: 0, 겁재: 0, 식신: 0, 상관: 0, 편재: 0,
    정재: 0, 편관: 0, 정관: 0, 편인: 0, 정인: 0,
  };

  const dayGan = saju.day.gan;

  // 천간 십성 계산 (년간, 월간, 일간)
  const gans = [saju.year.gan, saju.month.gan, saju.day.gan];
  if (saju.hour) gans.push(saju.hour.gan);

  for (const gan of gans) {
    const sipsung = calculateSipsung(dayGan, gan);
    if (sipsung) count[sipsung]++;
  }

  // 지지 십성 계산 (년지, 월지, 일지)
  const jis = [saju.year.ji, saju.month.ji, saju.day.ji];
  if (saju.hour) jis.push(saju.hour.ji);

  for (const ji of jis) {
    const sipsung = calculateSipsungForJiji(dayGan, ji);
    if (sipsung) count[sipsung]++;
  }

  return count;
}

// 성격 해석 (일간 기준)
function getPersonality(dayGan: string): { title: string; subtitle: string; positive: string; negative: string; advice: string } {
  const personalities: Record<string, { title: string; subtitle: string; positive: string; negative: string; advice: string }> = {
    갑: {
      title: '🌲 큰 나무형',
      subtitle: '일간: 갑(甲) - 양의 나무',
      positive: '리더십이 강하고 진취적입니다. 큰 뜻을 품고 도전하는 것을 좋아하며, 정의감이 강합니다. 시작하는 힘이 뛰어나고, 주변 사람들을 이끄는 카리스마가 있습니다.',
      negative: '고집이 세고 융통성이 부족할 수 있습니다. 자기 주장이 강해 때로는 독선적으로 보일 수 있으며, 타협을 어려워합니다.',
      advice: '유연함을 기르고, 다른 사람의 의견도 경청하세요. 변화에 열린 마음을 가지면 더 큰 성장이 가능합니다.',
    },
    을: {
      title: '🌿 덩굴/풀형',
      subtitle: '일간: 을(乙) - 음의 나무',
      positive: '유연하고 적응력이 뛰어납니다. 부드러운 카리스마로 사람들을 이끌며, 인내심이 강합니다. 어떤 환경에서도 살아남는 생존력이 있습니다.',
      negative: '주관이 약해 보일 수 있고, 결단력이 부족할 때가 있습니다. 눈치를 많이 보며 소극적인 모습을 보일 수 있습니다.',
      advice: '자신의 의견을 명확히 표현하는 연습을 하세요. 때로는 단호한 결단이 필요합니다.',
    },
    병: {
      title: '☀️ 태양형',
      subtitle: '일간: 병(丙) - 양의 불',
      positive: '밝고 화려한 성격입니다. 열정적이고 표현력이 뛰어나며, 강한 리더십과 추진력이 있습니다. 주변을 환하게 밝히는 긍정 에너지가 있습니다.',
      negative: '성급하고 다혈질적인 면이 있습니다. 감정 조절이 어려울 때가 있고, 지속력이 부족할 수 있습니다.',
      advice: '인내심을 기르고 감정 조절 능력을 키우세요. 장기적인 계획을 세우는 습관을 들이면 좋습니다.',
    },
    정: {
      title: '🕯️ 촛불/등불형',
      subtitle: '일간: 정(丁) - 음의 불',
      positive: '섬세하고 따뜻한 마음을 가졌습니다. 예술적 감각이 뛰어나고 배려심이 깊습니다. 내면의 열정과 집중력이 강합니다.',
      negative: '감정 기복이 있고 예민할 수 있습니다. 질투심이 강하거나 속마음을 쉽게 드러내지 않습니다.',
      advice: '자신의 감정을 건강하게 표현하는 방법을 찾으세요. 명상이나 글쓰기가 도움이 됩니다.',
    },
    무: {
      title: '⛰️ 산/대지형',
      subtitle: '일간: 무(戊) - 양의 흙',
      positive: '믿음직하고 안정적입니다. 중재자 역할을 잘하며, 넓은 포용력을 가졌습니다. 신뢰감을 주고 책임감이 강합니다.',
      negative: '고지식하고 변화에 느린 면이 있습니다. 융통성이 부족하고 답답해 보일 수 있습니다.',
      advice: '새로운 것에 도전하고 변화를 두려워하지 마세요. 유연한 사고방식을 기르세요.',
    },
    기: {
      title: '🌾 정원/전답형',
      subtitle: '일간: 기(己) - 음의 흙',
      positive: '실용적이고 현실적입니다. 꼼꼼하고 계획적이며, 주어진 일을 묵묵히 해냅니다. 세심하고 친절합니다.',
      negative: '소심하거나 걱정이 많을 수 있습니다. 우유부단하고 결정을 내리기 어려워합니다.',
      advice: '자신감을 가지고 결단력을 키우세요. 완벽을 추구하기보다 실행력을 높이세요.',
    },
    경: {
      title: '⚔️ 강철/바위형',
      subtitle: '일간: 경(庚) - 양의 쇠',
      positive: '결단력이 있고 추진력이 강합니다. 정의로우며 불의를 참지 못합니다. 단호하고 강직한 성품입니다.',
      negative: '융통성이 부족하고 완고할 수 있습니다. 직설적이라 상처를 주기도 합니다.',
      advice: '부드러운 소통 방법을 익히세요. 상대방의 입장을 이해하려는 노력이 필요합니다.',
    },
    신: {
      title: '💎 보석/바늘형',
      subtitle: '일간: 신(辛) - 음의 쇠',
      positive: '섬세하고 예리합니다. 완벽주의 성향이 있으며, 미적 감각이 뛰어납니다. 날카로운 통찰력이 있습니다.',
      negative: '까다롭고 예민한 면이 있습니다. 비판적이고 남에게 상처를 주기도 합니다.',
      advice: '긍정적인 시각을 기르고, 타인의 장점을 보려고 노력하세요. 자기 자신에게도 관대해지세요.',
    },
    임: {
      title: '🌊 바다/큰 강형',
      subtitle: '일간: 임(壬) - 양의 물',
      positive: '지혜롭고 포용력이 큽니다. 창의적이고 유연한 사고를 가졌으며, 큰 그림을 그립니다. 적응력이 뛰어납니다.',
      negative: '방향성을 잃거나 우유부단할 수 있습니다. 게으르거나 현실 도피적일 때가 있습니다.',
      advice: '구체적인 목표를 세우고 실행력을 높이세요. 집중력을 기르는 것이 중요합니다.',
    },
    계: {
      title: '💧 비/샘물형',
      subtitle: '일간: 계(癸) - 음의 물',
      positive: '섬세하고 감수성이 풍부합니다. 직관력이 뛰어나고 적응력이 좋습니다. 조용히 자기 일을 해나가는 끈기가 있습니다.',
      negative: '소심하거나 의존적인 면이 있습니다. 비관적이거나 우울해지기 쉽습니다.',
      advice: '자신감을 키우고 독립심을 기르세요. 긍정적인 마인드를 유지하는 것이 중요합니다.',
    },
  };
  return personalities[dayGan] || { title: '', subtitle: '', positive: '', negative: '', advice: '' };
}

// 오행 조화 해석
function getOhangAdvice(ohangCount: Record<string, number>): { strong: string[]; weak: string[]; advice: string } {
  const sorted = Object.entries(ohangCount).sort((a, b) => b[1] - a[1]);
  const strong = sorted.filter(([, count]) => count >= 2).map(([name]) => name);
  const weak = sorted.filter(([, count]) => count === 0).map(([name]) => name);

  let advice = '';

  if (weak.includes('목')) {
    advice += '목(木)이 부족합니다. 초록색 계열의 물건이나 식물을 가까이 두세요. 동쪽 방향이 좋고, 봄에 활력을 얻을 수 있습니다. ';
  }
  if (weak.includes('화')) {
    advice += '화(火)가 부족합니다. 붉은색 계열의 물건을 활용하세요. 남쪽 방향이 좋고, 열정적인 활동이 도움됩니다. ';
  }
  if (weak.includes('토')) {
    advice += '토(土)가 부족합니다. 노란색/갈색 계열을 활용하세요. 집의 중심이나 안정적인 환경이 좋습니다. ';
  }
  if (weak.includes('금')) {
    advice += '금(金)이 부족합니다. 흰색/금색 계열의 물건을 활용하세요. 서쪽 방향이 좋고, 결단력 있는 행동이 필요합니다. ';
  }
  if (weak.includes('수')) {
    advice += '수(水)가 부족합니다. 검은색/파란색 계열을 활용하세요. 북쪽 방향이 좋고, 지혜로운 판단이 중요합니다. ';
  }

  if (advice === '') {
    advice = '오행이 비교적 균형 잡혀 있습니다. 현재의 균형을 유지하며 생활하세요.';
  }

  return { strong, weak, advice };
}

// 띠 운세
function getAnimalFortune(ji: string): { basic: string; year2024: string; compatibility: string } {
  const fortunes: Record<string, { basic: string; year2024: string; compatibility: string }> = {
    자: {
      basic: '영리하고 적응력이 뛰어납니다. 재물운이 있으며, 사교성이 좋습니다. 기회를 잘 포착하는 능력이 있습니다.',
      year2024: '새로운 기회가 찾아오는 해입니다. 인간관계에서 좋은 인연을 만날 수 있으며, 재물운도 상승합니다.',
      compatibility: '소띠, 용띠, 원숭이띠와 궁합이 좋습니다. 말띠와는 조심하세요.',
    },
    축: {
      basic: '성실하고 인내심이 강합니다. 꾸준한 노력으로 성공을 이룹니다. 믿음직하고 책임감이 강합니다.',
      year2024: '인내의 시기입니다. 급하게 서두르지 말고 차근차근 준비하면 좋은 결과가 있습니다.',
      compatibility: '쥐띠, 뱀띠, 닭띠와 궁합이 좋습니다. 양띠와는 조심하세요.',
    },
    인: {
      basic: '용맹하고 리더십이 있습니다. 도전정신이 강하며 카리스마가 있습니다. 자신감 넘치는 성격입니다.',
      year2024: '도전하기 좋은 해입니다. 새로운 프로젝트나 사업을 시작하기에 적합합니다.',
      compatibility: '말띠, 개띠, 돼지띠와 궁합이 좋습니다. 원숭이띠와는 조심하세요.',
    },
    묘: {
      basic: '온화하고 섬세합니다. 예술적 감각이 뛰어나며 평화를 추구합니다. 사교적이고 인기가 좋습니다.',
      year2024: '안정적인 한 해입니다. 기존의 일에 충실하면 좋은 성과를 얻을 수 있습니다.',
      compatibility: '양띠, 돼지띠, 개띠와 궁합이 좋습니다. 닭띠와는 조심하세요.',
    },
    진: {
      basic: '야망이 크고 카리스마가 있습니다. 큰 일을 도모하며 명예를 중시합니다. 리더십이 뛰어납니다.',
      year2024: '비상하는 해입니다. 그동안의 노력이 결실을 맺을 수 있으며, 사회적 인정을 받을 수 있습니다.',
      compatibility: '쥐띠, 원숭이띠, 닭띠와 궁합이 좋습니다. 개띠와는 조심하세요.',
    },
    사: {
      basic: '지혜롭고 직관력이 뛰어납니다. 신중하며 깊은 통찰력을 가졌습니다. 미스터리한 매력이 있습니다.',
      year2024: '지혜가 빛나는 해입니다. 중요한 결정을 내릴 때 직관을 믿으세요.',
      compatibility: '소띠, 닭띠와 궁합이 좋습니다. 돼지띠와는 조심하세요.',
    },
    오: {
      basic: '활동적이고 열정적입니다. 자유를 사랑하며 독립심이 강합니다. 사교적이고 인기가 많습니다.',
      year2024: '활발한 한 해입니다. 새로운 인연과 기회가 많이 찾아옵니다.',
      compatibility: '호랑이띠, 양띠, 개띠와 궁합이 좋습니다. 쥐띠와는 조심하세요.',
    },
    미: {
      basic: '온순하고 예술적입니다. 섬세한 감성을 가지며 평화를 추구합니다. 가정적이고 따뜻합니다.',
      year2024: '평화로운 한 해입니다. 가족과의 시간을 소중히 하고, 내면의 성장에 집중하세요.',
      compatibility: '토끼띠, 말띠, 돼지띠와 궁합이 좋습니다. 소띠와는 조심하세요.',
    },
    신: {
      basic: '영리하고 재치 있습니다. 호기심이 많고 다재다능합니다. 유머 감각이 뛰어납니다.',
      year2024: '다재다능함이 빛나는 해입니다. 새로운 기술이나 지식을 배우기 좋습니다.',
      compatibility: '쥐띠, 용띠와 궁합이 좋습니다. 호랑이띠와는 조심하세요.',
    },
    유: {
      basic: '부지런하고 성실합니다. 꼼꼼하며 시간 관념이 철저합니다. 완벽주의 성향이 있습니다.',
      year2024: '성실함이 보상받는 해입니다. 꾸준히 노력한 일에서 성과가 나타납니다.',
      compatibility: '소띠, 뱀띠, 용띠와 궁합이 좋습니다. 토끼띠와는 조심하세요.',
    },
    술: {
      basic: '충직하고 정의롭습니다. 의리를 중시하며 신뢰받는 사람입니다. 책임감이 강합니다.',
      year2024: '신뢰가 쌓이는 해입니다. 인간관계에서 좋은 평가를 받으며, 조력자가 나타납니다.',
      compatibility: '호랑이띠, 말띠, 토끼띠와 궁합이 좋습니다. 용띠와는 조심하세요.',
    },
    해: {
      basic: '낙천적이고 정직합니다. 복을 타고났으며 인복이 있습니다. 관대하고 너그럽습니다.',
      year2024: '복이 들어오는 해입니다. 재물운과 인간관계운이 모두 좋습니다.',
      compatibility: '양띠, 토끼띠, 호랑이띠와 궁합이 좋습니다. 뱀띠와는 조심하세요.',
    },
  };
  return fortunes[ji] || { basic: '', year2024: '', compatibility: '' };
}

// 십성 종합 해석 (직업/연애/재물 적성)
function getSipsungInterpretation(sipsungCount: Record<string, number>): {
  career: string;
  love: string;
  money: string;
  dominant: string;
} {
  // 가장 많은 십성 찾기 (비견 제외, 비견은 일간 자체)
  const sorted = Object.entries(sipsungCount)
    .filter(([name]) => name !== '비견')
    .sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0]?.[0] || '정인';
  const secondary = sorted[1]?.[0] || '';

  const careerMap: Record<string, string> = {
    식신: '요리사, 작가, 예술가, 엔터테이너, 크리에이터 등 창작/표현 분야에 재능이 있습니다. 자유로운 환경에서 능력을 발휘합니다.',
    상관: '변호사, 평론가, 디자이너, 기획자 등 기존 틀을 깨는 혁신적 직업에 적합합니다. 조직보다 프리랜서가 맞을 수 있습니다.',
    편재: '사업가, 투자자, 영업직, 무역 등 돈의 흐름을 다루는 분야에 강합니다. 여러 곳에서 수입을 만드는 타입.',
    정재: '공무원, 회계사, 은행원, 관리직 등 안정적이고 체계적인 직업이 잘 맞습니다. 꾸준한 수입을 선호합니다.',
    편관: '군인, 경찰, 소방관, 스포츠 선수 등 도전적이고 권위 있는 직업에 적합합니다. 위기 상황에서 빛납니다.',
    정관: '대기업 임원, 정치인, 교수, 판사 등 사회적 명예가 따르는 직업에 어울립니다. 승진운이 좋습니다.',
    편인: '연구원, 종교인, 철학자, 점술가, IT 개발자 등 비주류이지만 깊이 있는 분야에 재능이 있습니다.',
    정인: '교사, 학자, 의사, 상담사 등 지식과 배움을 전달하는 직업에 적합합니다. 자격증/학위가 도움됩니다.',
    겁재: '스타트업, 경쟁이 치열한 분야, 스포츠 등 승부를 겨루는 직업에서 두각을 나타냅니다.',
    비견: '독립적인 업무, 자영업, 1인 기업이 적합합니다. 팀워크보다 개인 역량을 발휘하는 환경이 좋습니다.',
  };

  const loveMap: Record<string, string> = {
    식신: '따뜻하고 편안한 연애를 합니다. 상대를 잘 챙기며, 함께 맛있는 것을 먹고 즐기는 것을 좋아합니다. 안정적인 관계를 선호.',
    상관: '열정적이고 드라마틱한 연애를 합니다. 감정 표현이 강하고 질투심도 있습니다. 자극적인 관계에 끌립니다.',
    편재: '로맨틱하고 다양한 인연이 있습니다. 이성에게 인기가 많고 적극적입니다. 다만 바람기로 오해받을 수 있습니다.',
    정재: '한 사람에게 진실된 연애를 합니다. 결혼 지향적이며, 안정적인 가정을 꿈꿉니다. 신중하게 선택합니다.',
    편관: '강한 끌림과 운명적 만남이 많습니다. 밀당보다 직진하는 스타일. 다만 갈등도 강렬할 수 있습니다.',
    정관: '예의 바르고 격식 있는 연애를 합니다. 서로 존중하며 건강한 관계를 만듭니다. 결혼으로 이어질 확률이 높습니다.',
    편인: '정신적 교감을 중시합니다. 대화가 통하는 사람에게 끌리며, 혼자만의 시간도 필요합니다.',
    정인: '배려심 깊고 헌신적인 연애를 합니다. 상대를 가르치고 이끌어주려 합니다. 모성애/부성애적 사랑.',
    겁재: '경쟁적이고 소유욕이 강한 연애를 합니다. 삼각관계에 얽힐 수 있으니 주의가 필요합니다.',
    비견: '대등한 관계를 원합니다. 친구 같은 연인을 선호하며, 너무 의존적인 관계를 싫어합니다.',
  };

  const moneyMap: Record<string, string> = {
    식신: '재능으로 돈을 법니다. 부업이나 창작 활동에서 수입이 생기며, 먹고 즐기는 데 씀씀이가 큽니다.',
    상관: '아이디어로 큰 돈을 벌 수 있지만, 변동이 심합니다. 한번에 크게 벌고 크게 쓰는 타입.',
    편재: '투자/사업에서 큰 수익을 올릴 수 있습니다. 돈이 들어오는 경로가 다양하지만 나가는 것도 빠릅니다.',
    정재: '꾸준히 모으는 타입입니다. 급여/저축으로 차곡차곡 재산을 쌓습니다. 안전한 투자를 선호합니다.',
    편관: '돈보다 명예를 중시합니다. 예상치 못한 지출이 생기기 쉽고, 보험/안전장치가 필요합니다.',
    정관: '안정적인 수입이 보장됩니다. 직장에서의 급여와 부가 수입으로 여유 있는 생활이 가능합니다.',
    편인: '돈에 큰 욕심이 없지만 필요할 때 의외의 곳에서 돈이 들어옵니다. 지식/기술이 재산입니다.',
    정인: '교육/자격증을 통해 안정적 수입을 얻습니다. 부모님의 도움을 받을 수도 있습니다.',
    겁재: '돈이 손에 오래 머물지 않습니다. 충동적 지출 주의. 보증이나 동업은 신중하게 결정하세요.',
    비견: '독립적으로 돈을 벌지만, 나누기도 잘합니다. 공동 재산보다 개인 자산 관리가 중요합니다.',
  };

  let career = careerMap[dominant] || '';
  let love = loveMap[dominant] || '';
  let money = moneyMap[dominant] || '';

  // 보조 십성이 있으면 한 줄 추가
  if (secondary && sipsungCount[secondary] > 0) {
    const secondaryNames: Record<string, string> = {
      식신: '식신', 상관: '상관', 편재: '편재', 정재: '정재',
      편관: '편관', 정관: '정관', 편인: '편인', 정인: '정인',
      겁재: '겁재', 비견: '비견',
    };
    career += ` (보조: ${secondaryNames[secondary]}의 영향으로 다양한 분야에 관심이 많습니다)`;
  }

  return { career, love, money, dominant };
}

// 일주(일간+일지) 조합 해석 (60갑자 중 대표)
function getDayPillarInterpretation(dayGan: string, dayJi: string): string {
  const key = `${dayGan}${dayJi}`;
  const interpretations: Record<string, string> = {
    갑자: '큰 나무가 물 위에 있는 형상. 지혜롭고 창의적이며, 새로운 시작에 강한 에너지를 가집니다. 학문이나 예술에 재능.',
    갑인: '큰 나무가 숲 속에 있는 형상. 자기 주장이 강하고 리더십이 뛰어납니다. 독립적이고 진취적.',
    갑진: '큰 나무가 비옥한 땅에 뿌리내린 형상. 야망이 크고 추진력이 강합니다. 대기만성형.',
    갑오: '큰 나무에 햇볕이 드는 형상. 밝고 열정적이지만, 변덕이 있을 수 있습니다. 예술적 감각 우수.',
    갑신: '큰 나무를 도끼로 다듬는 형상. 자기 발전을 위한 시련이 있지만 성장합니다. 완벽주의.',
    갑술: '큰 나무가 마른 땅에 있는 형상. 끈기와 인내심이 강합니다. 늦게 피는 꽃.',
    을축: '풀이 겨울 땅에 있는 형상. 인내심이 강하고 꾸준합니다. 조용히 실력을 쌓는 타입.',
    을묘: '풀이 봄에 피어나는 형상. 온화하고 사교적이며, 인기가 많습니다. 예술적 감각 풍부.',
    을사: '풀이 뜨거운 태양 아래 있는 형상. 열정적이지만 지치기 쉽습니다. 감성이 풍부.',
    을미: '풀이 정원에 있는 형상. 섬세하고 따뜻한 마음의 소유자. 가정적이고 배려심 깊음.',
    을유: '풀이 가을에 시드는 형상. 예리하고 완벽주의적. 비판적이지만 통찰력이 뛰어남.',
    을해: '풀이 비를 맞는 형상. 적응력이 뛰어나고 생명력이 강합니다. 어디서든 성장.',
    병자: '태양이 밤에 있는 형상. 내면에 열정을 품고 있으며, 때를 기다리는 지혜가 있습니다.',
    병인: '태양이 산 위에 떠오르는 형상. 활동적이고 에너지가 넘칩니다. 리더십과 추진력.',
    병진: '태양이 구름 위에 있는 형상. 포부가 크고 야망이 있습니다. 사회적 성공 가능성.',
    병오: '한낮의 태양 형상. 가장 뜨겁고 열정적. 주목받는 존재이지만 지속력 관리 필요.',
    병신: '태양이 서쪽으로 기우는 형상. 성숙하고 원숙한 매력. 경험에서 지혜를 얻음.',
    병술: '태양이 지는 형상. 따뜻하고 포근한 성격. 마무리를 잘하며, 뒤를 돌보는 타입.',
    정축: '촛불이 겨울에 켜진 형상. 따뜻한 마음으로 주변을 밝힙니다. 헌신적이고 인내심 강함.',
    정묘: '촛불이 봄밤에 켜진 형상. 로맨틱하고 감성적. 예술과 문학에 재능.',
    정사: '촛불이 모닥불이 된 형상. 열정적이고 직관적. 강한 집중력으로 한 분야에서 성공.',
    정미: '촛불이 정원을 밝히는 형상. 섬세하고 따뜻한 성품. 교육이나 상담 분야 적합.',
    정유: '촛불이 보석을 비추는 형상. 안목이 뛰어나고 세련됨. 미적 감각이 탁월.',
    정해: '촛불이 비 오는 밤에 켜진 형상. 고독하지만 강인한 내면. 독창적인 생각의 소유자.',
    무자: '산에서 물이 흐르는 형상. 지혜와 안정감을 겸비. 중재자 역할을 잘함.',
    무인: '산에 호랑이가 있는 형상. 위엄 있고 카리스마 넘침. 큰 조직의 리더감.',
    무진: '산이 겹겹이 이어진 형상. 넓은 포용력과 큰 야망. 부동산이나 토지와 인연.',
    무오: '산에 태양이 비치는 형상. 활기차고 긍정적. 사교성이 좋고 인기가 많음.',
    무신: '산이 깎여 보석이 나온 형상. 노력 끝에 귀한 결과를 얻음. 자기 발전형.',
    무술: '높은 산봉우리 형상. 고집이 세지만 믿음직함. 한번 정한 것은 끝까지.',
    기축: '농경지에 겨울이 온 형상. 꼼꼼하고 계획적. 저축을 잘하며 실속형.',
    기묘: '봄에 밭을 가는 형상. 부지런하고 결실을 맺는 타입. 실용적이고 현실적.',
    기사: '땅에서 열기가 올라오는 형상. 열정적이면서 실용적. 사업수완이 뛰어남.',
    기미: '비옥한 정원 형상. 다재다능하고 섬세함. 여러 분야에서 재능을 발휘.',
    기유: '가을 수확의 형상. 노력한 만큼 결과를 얻음. 꼼꼼하고 정확한 성격.',
    기해: '농경지에 비가 내리는 형상. 풍요롭고 복이 많음. 인복이 좋고 관대함.',
    경자: '칼이 물에 씻기는 형상. 날카로운 두뇌와 유연함을 겸비. 분석력 뛰어남.',
    경인: '칼로 나무를 자르는 형상. 결단력과 추진력. 과감한 행동파.',
    경진: '보석 원석이 땅에 있는 형상. 숨겨진 재능이 있으며, 다듬으면 빛남.',
    경오: '쇠를 불에 달구는 형상. 열정과 강인함. 역경을 이겨내는 강한 의지.',
    경신: '단단한 철강 형상. 원칙주의자이며 정의로움. 직설적이고 솔직함.',
    경술: '쇠가 마른 땅에 있는 형상. 외강내유형. 겉은 강해 보이지만 속은 따뜻함.',
    신축: '보석이 겨울에 숨겨진 형상. 내면의 가치가 크며, 때가 되면 빛남.',
    신묘: '보석이 봄에 드러나는 형상. 세련되고 우아함. 센스가 뛰어남.',
    신사: '보석을 불로 가공하는 형상. 시련 속에서 성장. 예술적 감각 탁월.',
    신미: '보석이 전시된 형상. 아름다움을 추구하며, 안목이 높음. 패션/미술에 재능.',
    신유: '순금 보석 형상. 완벽주의의 극치. 최고를 추구하며 타협하지 않음.',
    신해: '보석이 물에 잠긴 형상. 깊이 있는 사고력. 조용하지만 존재감 있음.',
    임자: '큰 강이 흐르는 형상. 지혜롭고 포용력 큼. 어떤 상황에도 적응.',
    임인: '바다에서 파도가 치는 형상. 도전적이고 모험심 강함. 큰 꿈을 품음.',
    임진: '바다에 용이 있는 형상. 큰 인물이 될 잠재력. 비범한 재능의 소유자.',
    임오: '물과 불이 만나는 형상. 감정이 풍부하고 열정적. 극과 극의 매력.',
    임신: '물이 바위를 깎는 형상. 끈기와 인내로 불가능을 가능하게 함.',
    임술: '물이 마른 땅을 만난 형상. 역경이 있지만 극복의 힘이 있음.',
    계축: '이슬이 겨울 땅에 맺힌 형상. 조용하고 깊은 사고력. 신중하고 계획적.',
    계묘: '봄비가 내리는 형상. 생명력과 성장의 에너지. 부드럽지만 끈질긴 힘.',
    계사: '안개가 피어오르는 형상. 신비로운 매력. 직관력이 뛰어나고 영적 감각.',
    계미: '이슬이 정원에 맺힌 형상. 섬세하고 감수성 풍부. 예술/문학에 재능.',
    계유: '이슬이 보석을 적시는 형상. 고운 감성과 날카로운 지성. 독특한 매력.',
    계해: '비가 바다로 흘러가는 형상. 넓은 세계관과 포용력. 국제적 활동에 인연.',
  };
  return interpretations[key] || `${dayGan}${dayJi} 일주: ${dayGan}의 기본 성향에 ${dayJi}의 에너지가 결합된 형상입니다.`;
}

// 오행 건강 조언
function getOhangHealthAdvice(ohangCount: Record<string, number>): string[] {
  const tips: string[] = [];
  const sorted = Object.entries(ohangCount).sort((a, b) => b[1] - a[1]);
  const strong = sorted.filter(([, count]) => count >= 3).map(([name]) => name);
  const weak = sorted.filter(([, count]) => count === 0).map(([name]) => name);

  if (weak.includes('목') || strong.includes('금')) {
    tips.push('간/담 건강에 주의하세요. 눈이 피로하기 쉽고, 근육통이 올 수 있습니다. 녹색 채소와 신맛 음식이 도움됩니다.');
  }
  if (weak.includes('화') || strong.includes('수')) {
    tips.push('심장/소장 건강에 신경 쓰세요. 혈액순환이 약할 수 있습니다. 적당한 유산소 운동과 쓴맛 음식이 좋습니다.');
  }
  if (weak.includes('토') || strong.includes('목')) {
    tips.push('위장/비장 건강에 주의하세요. 소화기가 약할 수 있습니다. 규칙적인 식사와 단맛(자연 식품) 음식이 도움됩니다.');
  }
  if (weak.includes('금') || strong.includes('화')) {
    tips.push('폐/대장 건강에 신경 쓰세요. 호흡기가 약할 수 있습니다. 깊은 호흡 운동과 매운맛 음식이 도움됩니다.');
  }
  if (weak.includes('수') || strong.includes('토')) {
    tips.push('신장/방광 건강에 주의하세요. 수분 대사가 약할 수 있습니다. 충분한 수분 섭취와 짠맛 음식(적당히)이 좋습니다.');
  }

  if (tips.length === 0) {
    tips.push('오행이 균형 잡혀 전반적으로 건강한 편입니다. 계절에 맞는 음식을 골고루 섭취하고 규칙적인 운동을 유지하세요.');
  }

  return tips;
}

// 대운 계산 (간략화)
function calculateDaeun(saju: Saju, gender: 'male' | 'female', birthYear: number): { age: number; gan: string; ji: string }[] {
  const yearGanEumyang = CHEONGAN_EUMYANG[saju.year.gan];
  const isForward = (gender === 'male' && yearGanEumyang === '양') || (gender === 'female' && yearGanEumyang === '음');

  const monthGanIndex = (CHEONGAN as readonly string[]).indexOf(saju.month.gan);
  const monthJiIndex = (JIJI as readonly string[]).indexOf(saju.month.ji);

  const daeunList: { age: number; gan: string; ji: string }[] = [];

  for (let i = 1; i <= 8; i++) {
    const ganIndex = isForward
      ? (monthGanIndex + i) % 10
      : (monthGanIndex - i + 10) % 10;
    const jiIndex = isForward
      ? (monthJiIndex + i) % 12
      : (monthJiIndex - i + 12) % 12;

    daeunList.push({
      age: i * 10,
      gan: CHEONGAN[ganIndex],
      ji: JIJI[jiIndex],
    });
  }

  return daeunList;
}

// 오늘의 운세 계산
function getDailyFortune(dayGan: string): {
  overall: string;
  love: string;
  money: string;
  work: string;
  health: string;
  luckyColor: string;
  luckyNumber: number;
} {
  const today = new Date();
  const todayPillar = getDayPillar(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const todayGan = todayPillar.gan;
  const todayJi = todayPillar.ji;

  // 일간과 오늘 천간의 관계로 운세 결정
  const sipsung = calculateSipsung(dayGan, todayGan);
  const seed = today.getDate() + (CHEONGAN as readonly string[]).indexOf(dayGan);

  const fortunes: Record<string, { overall: string; love: string; money: string; work: string; health: string }> = {
    비견: {
      overall: '경쟁 속에서 자신만의 길을 찾는 날입니다. 다른 사람과 비교하지 말고 내 페이스를 유지하세요.',
      love: '비슷한 성향의 사람과 좋은 만남이 있을 수 있습니다. 친구에서 연인으로 발전할 가능성.',
      money: '공동 투자보다 개인 재테크가 유리합니다. 남의 말에 휩쓸리지 마세요.',
      work: '동료와의 협업보다 독자적인 업무에서 성과가 납니다.',
      health: '운동할 때 무리하지 않도록 주의. 워밍업을 충분히 하세요.',
    },
    겁재: {
      overall: '주변의 유혹을 조심하세요. 충동적인 결정은 후회를 부릅니다.',
      love: '질투심을 자제하세요. 상대방을 믿는 것이 중요합니다.',
      money: '도박이나 투기는 절대 금물! 지출을 줄이는 것이 좋습니다.',
      work: '경쟁 상황에서 너무 무리하지 마세요. 내일을 위해 힘을 아끼세요.',
      health: '스트레스 관리가 필요한 날. 명상이나 가벼운 산책을 추천.',
    },
    식신: {
      overall: '창의력이 빛나는 날입니다. 새로운 아이디어가 좋은 결과를 가져옵니다.',
      love: '편안하고 즐거운 데이트가 가능합니다. 맛있는 것을 함께 먹으면 더 좋아요.',
      money: '부수입이 생길 수 있습니다. 취미를 살린 수익 창출 기회.',
      work: '기획이나 아이디어 회의에서 인정받습니다.',
      health: '식욕이 좋아지는 날. 과식 주의, 적당히 드세요.',
    },
    상관: {
      overall: '말조심이 필요한 날입니다. 직설적인 표현이 오해를 부를 수 있어요.',
      love: '감정 표현에 신중하세요. 솔직함이 때로는 상처가 될 수 있습니다.',
      money: '충동구매 주의. 정말 필요한지 한번 더 생각하세요.',
      work: '상사와의 갈등 가능성. 의견 충돌 시 한발 물러서세요.',
      health: '목과 기관지에 신경 쓰세요. 따뜻한 차가 좋습니다.',
    },
    편재: {
      overall: '예상치 못한 재물운이 있습니다. 기회가 오면 과감히 잡으세요.',
      love: '새로운 만남의 기회가 있습니다. 적극적으로 다가가세요.',
      money: '투자 검토하기 좋은 날. 단, 신중한 분석 후에 결정하세요.',
      work: '새로운 프로젝트나 거래처가 연결될 수 있습니다.',
      health: '활동적인 하루. 에너지가 넘치지만 무리는 금물.',
    },
    정재: {
      overall: '꾸준한 노력이 보상받는 날입니다. 안정적인 하루가 예상됩니다.',
      love: '안정적이고 편안한 관계가 유지됩니다. 신뢰가 깊어집니다.',
      money: '정기적인 수입에 감사하는 날. 저축을 늘리기 좋습니다.',
      work: '맡은 바 업무에 충실하면 인정받습니다.',
      health: '규칙적인 생활이 건강의 비결. 일정한 시간에 식사하세요.',
    },
    편관: {
      overall: '도전적인 상황이 생길 수 있습니다. 당황하지 말고 침착하게 대응하세요.',
      love: '약간의 갈등이 있을 수 있으나 대화로 풀 수 있습니다.',
      money: '예상치 못한 지출 가능성. 여유 자금을 확보해 두세요.',
      work: '상사나 권위자와의 관계에서 긴장감. 예의를 지키세요.',
      health: '피로가 쌓일 수 있으니 충분한 휴식을 취하세요.',
    },
    정관: {
      overall: '질서와 규범을 지키면 좋은 결과가 있습니다. 정도를 걸으세요.',
      love: '진지한 만남이나 결혼 이야기가 오갈 수 있습니다.',
      money: '안정적인 재정 상태. 큰 변동 없이 평온합니다.',
      work: '승진이나 인사고과에서 좋은 평가를 받을 수 있습니다.',
      health: '규칙적인 운동이 효과적입니다. 생활 리듬을 유지하세요.',
    },
    편인: {
      overall: '직관이 예리한 날입니다. 느낌대로 행동해도 좋습니다.',
      love: '정신적인 교감이 중요한 날. 깊은 대화를 나눠보세요.',
      money: '학습이나 자기계발에 투자하면 장기적으로 이득입니다.',
      work: '연구나 기획 업무에서 좋은 성과가 납니다.',
      health: '명상이나 요가로 마음을 다스리면 좋습니다.',
    },
    정인: {
      overall: '지혜롭게 판단하는 날입니다. 배움의 기회가 있으면 놓치지 마세요.',
      love: '상대방에게 따뜻한 조언을 해줄 수 있는 날. 신뢰가 쌓입니다.',
      money: '자격증이나 학습 관련 투자가 좋은 결과를 가져옵니다.',
      work: '교육이나 멘토링 역할에서 빛납니다.',
      health: '두뇌 활동이 활발합니다. 적당한 휴식으로 균형을 맞추세요.',
    },
  };

  const luckyColors: Record<string, string> = {
    목: '초록색', 화: '빨간색', 토: '노란색', 금: '흰색', 수: '검은색/파란색',
  };
  const todayOhang = JIJI_OHANG[todayJi];
  const luckyNumber = (seed % 9) + 1;

  const fortune = fortunes[sipsung] || fortunes['정인'];

  return {
    ...fortune,
    luckyColor: luckyColors[todayOhang] || '파란색',
    luckyNumber,
  };
}

// 십성별 점수 (운세 좋고 나쁨)
const SIPSUNG_SCORE: Record<string, number> = {
  식신: 90,   // 풍요, 재능 발휘
  정재: 85,   // 안정, 성장
  정관: 85,   // 명예, 성취
  정인: 80,   // 학습, 성장
  편재: 75,   // 기회, 확장
  비견: 65,   // 성장, 경쟁
  편인: 60,   // 배움, 전환
  상관: 50,   // 변화, 주의
  겁재: 40,   // 시험, 주의
  편관: 35,   // 시련, 주의
};

// 십성별 분야 점수 (금전운, 직장운, 인간관계)
const SIPSUNG_CATEGORY_SCORE: Record<string, { money: number; career: number; relationship: number }> = {
  정재: { money: 95, career: 75, relationship: 70 },   // 정재 = 안정적 재물
  편재: { money: 85, career: 70, relationship: 80 },   // 편재 = 기회의 재물, 이성운
  식신: { money: 80, career: 70, relationship: 90 },   // 식신 = 부수입, 인기 상승
  정관: { money: 65, career: 95, relationship: 75 },   // 정관 = 명예, 승진
  편관: { money: 45, career: 50, relationship: 55 },   // 편관 = 시련, 압박
  정인: { money: 60, career: 80, relationship: 75 },   // 정인 = 자기계발, 멘토
  편인: { money: 55, career: 65, relationship: 60 },   // 편인 = 전환기
  비견: { money: 55, career: 70, relationship: 80 },   // 비견 = 경쟁, 동료
  겁재: { money: 35, career: 50, relationship: 60 },   // 겁재 = 금전 주의
  상관: { money: 65, career: 55, relationship: 65 },   // 상관 = 표현, 변화
};

// 년운 계산
function getYearlyFortune(dayGan: string, yearJi: string): {
  year: number;
  overall: string;
  career: string;
  money: string;
  relationship: string;
  advice: string;
  score: number;
  sipsung: string;
  moneyScore: number;
  careerScore: number;
  relationshipScore: number;
}[] {
  const currentYear = new Date().getFullYear();
  // 과거 5년 ~ 미래 5년 (총 11년)
  const years: number[] = [];
  for (let i = -5; i <= 5; i++) {
    years.push(currentYear + i);
  }

  return years.map((year) => {
    // 년운은 입춘 후 기준이므로 3월 1일로 계산
    const yearPillar = getYearPillar(year, 3, 1);
    const sipsung = calculateSipsung(dayGan, yearPillar.gan);

    const yearlyAnalysis: Record<string, { overall: string; career: string; money: string; relationship: string; advice: string }> = {
      비견: {
        overall: `${year}년은 자기 성장과 독립의 해입니다. 경쟁 속에서 실력을 키우는 시기입니다.`,
        career: '새로운 도전이나 창업에 유리합니다. 독자적인 프로젝트가 성공할 가능성.',
        money: '공동 투자보다 개인 자산 관리에 집중하세요.',
        relationship: '비슷한 목표를 가진 사람들과 좋은 인연이 맺어집니다.',
        advice: '너무 고집부리지 말고 유연하게 대처하세요.',
      },
      겁재: {
        overall: `${year}년은 시험과 도전의 해입니다. 유혹을 물리치고 본업에 집중하세요.`,
        career: '경쟁이 치열합니다. 실력으로 승부하되 무리하지 마세요.',
        money: '도박, 투기, 보증은 절대 금물! 안전한 재테크를 하세요.',
        relationship: '친구나 동료와의 금전 거래를 피하세요.',
        advice: '절제와 인내가 필요한 해입니다.',
      },
      식신: {
        overall: `${year}년은 풍요와 즐거움의 해입니다. 재능을 발휘해 성과를 거두세요.`,
        career: '창의적인 분야에서 인정받습니다. 부업이나 취미가 수입원이 될 수 있어요.',
        money: '부수입이나 보너스 운이 있습니다.',
        relationship: '즐거운 만남이 많고 인기가 상승합니다.',
        advice: '건강 관리에 신경 쓰고 과식을 피하세요.',
      },
      상관: {
        overall: `${year}년은 변화와 표현의 해입니다. 생각을 행동으로 옮기세요.`,
        career: '기존 틀을 벗어나는 아이디어가 주목받습니다. 단, 윗사람과 충돌 주의.',
        money: '수입은 늘지만 지출도 많아질 수 있습니다.',
        relationship: '솔직한 표현이 오해를 부를 수 있으니 말조심하세요.',
        advice: '감정 조절을 연습하고 인내심을 기르세요.',
      },
      편재: {
        overall: `${year}년은 기회와 확장의 해입니다. 적극적으로 움직이면 좋은 결과가 있습니다.`,
        career: '새로운 사업이나 투자 기회가 찾아옵니다.',
        money: '재물운이 좋습니다. 단, 욕심을 부리면 잃을 수 있어요.',
        relationship: '새로운 만남이 많고 이성 운도 좋습니다.',
        advice: '기회가 왔을 때 망설이지 마세요.',
      },
      정재: {
        overall: `${year}년은 안정과 성장의 해입니다. 꾸준히 노력하면 보상받습니다.`,
        career: '직장에서 인정받고 승진 가능성이 있습니다.',
        money: '저축이 늘고 자산이 불어납니다.',
        relationship: '안정적인 관계가 유지됩니다. 결혼운도 좋아요.',
        advice: '현재의 것에 감사하며 꾸준히 나아가세요.',
      },
      편관: {
        overall: `${year}년은 도전과 시련의 해입니다. 어려움이 있지만 성장의 기회입니다.`,
        career: '갑작스러운 변화나 어려운 상황이 생길 수 있습니다.',
        money: '예상치 못한 지출에 대비하세요.',
        relationship: '권위자나 상사와의 관계에 신경 쓰세요.',
        advice: '침착하게 대응하고 건강 관리에 힘쓰세요.',
      },
      정관: {
        overall: `${year}년은 명예와 성취의 해입니다. 사회적 인정을 받을 수 있습니다.`,
        career: '승진이나 좋은 기회가 찾아옵니다. 정도를 걸으세요.',
        money: '안정적인 수입이 유지됩니다.',
        relationship: '공식적인 관계(결혼 등)가 진전될 수 있습니다.',
        advice: '책임감을 갖고 맡은 바에 최선을 다하세요.',
      },
      편인: {
        overall: `${year}년은 배움과 전환의 해입니다. 새로운 분야에 도전해 보세요.`,
        career: '이직이나 전직을 고려할 수 있는 해입니다.',
        money: '자기계발에 투자하면 장기적으로 이득입니다.',
        relationship: '정신적 교감이 깊은 관계가 형성됩니다.',
        advice: '직관을 믿되 현실적인 판단도 병행하세요.',
      },
      정인: {
        overall: `${year}년은 학습과 성장의 해입니다. 지식과 지혜가 늘어납니다.`,
        career: '자격증 취득이나 교육 관련 성과가 있습니다.',
        money: '교육비 지출이 있지만 미래 투자로 생각하세요.',
        relationship: '멘토나 스승을 만날 수 있습니다.',
        advice: '꾸준히 배우고 성장하는 자세를 유지하세요.',
      },
    };

    const categoryScore = SIPSUNG_CATEGORY_SCORE[sipsung] || { money: 60, career: 60, relationship: 60 };
    return {
      year,
      ...(yearlyAnalysis[sipsung] || yearlyAnalysis['정인']),
      score: SIPSUNG_SCORE[sipsung] || 60,
      sipsung,
      moneyScore: categoryScore.money,
      careerScore: categoryScore.career,
      relationshipScore: categoryScore.relationship,
    };
  });
}

function SajuReadingInner() {
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthTime, setBirthTime] = useState(''); // 시간대 value (자시=0, 축시=1, ...)
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<{
    saju: Saju;
    ohangCount: Record<string, number>;
    sipsungCount: Record<string, number>;
    personality: { title: string; subtitle: string; positive: string; negative: string; advice: string };
    ohangAdvice: { strong: string[]; weak: string[]; advice: string };
    animalFortune: { basic: string; year2024: string; compatibility: string };
    animal: string;
    sipsungInterpretation: { career: string; love: string; money: string; dominant: string };
    dayPillarInterpretation: string;
    healthAdvice: string[];
    daeun: { age: number; gan: string; ji: string }[];
    dailyFortune: {
      overall: string;
      love: string;
      money: string;
      work: string;
      health: string;
      luckyColor: string;
      luckyNumber: number;
    };
    yearlyFortune: {
      year: number;
      overall: string;
      career: string;
      money: string;
      relationship: string;
      advice: string;
      score: number;
      sipsung: string;
      moneyScore: number;
      careerScore: number;
      relationshipScore: number;
    }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const searchParams = useSearchParams();

  // URL 파라미터로 자동 분석
  useEffect(() => {
    const y = searchParams.get('y');
    const m = searchParams.get('m');
    const d = searchParams.get('d');
    const t = searchParams.get('t');
    const g = searchParams.get('g');

    if (y && m && d) {
      setBirthYear(y);
      setBirthMonth(m);
      setBirthDay(d);
      if (t === 'unknown') {
        setUnknownTime(true);
      } else if (t) {
        setBirthTime(t);
      }
      if (g === 'female') {
        setGender('female');
      }
      // 자동 분석 실행 (약간의 딜레이 후)
      setTimeout(() => {
        const year = parseInt(y);
        const month = parseInt(m);
        const day = parseInt(d);
        const hour = t === 'unknown' ? null : (t ? parseInt(t) : null);

        if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          const saju = calculateSaju(year, month, day, hour);
          const ohangCount = analyzeOhang(saju);
          const sipsungCount = analyzeSipsung(saju);
          const personality = getPersonality(saju.day.gan);
          const ohangAdvice = getOhangAdvice(ohangCount);
          const animalFortune = getAnimalFortune(saju.year.ji);
          const animal = JIJI_ANIMAL[saju.year.ji];
          const sipsungInterpretation = getSipsungInterpretation(sipsungCount);
          const dayPillarInterpretation = getDayPillarInterpretation(saju.day.gan, saju.day.ji);
          const healthAdvice = getOhangHealthAdvice(ohangCount);
          const daeun = calculateDaeun(saju, g === 'female' ? 'female' : 'male', year);
          const dailyFortune = getDailyFortune(saju.day.gan);
          const yearlyFortune = getYearlyFortune(saju.day.gan, saju.year.ji);

          setResult({
            saju,
            ohangCount,
            sipsungCount,
            personality,
            ohangAdvice,
            animalFortune,
            animal,
            sipsungInterpretation,
            dayPillarInterpretation,
            healthAdvice,
            daeun,
            dailyFortune,
            yearlyFortune,
          });
        }
      }, 100);
    }
  }, [searchParams]);

  // 공유 URL 생성 및 복사
  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('y', birthYear);
    params.set('m', birthMonth);
    params.set('d', birthDay);
    if (unknownTime) {
      params.set('t', 'unknown');
    } else if (birthTime) {
      params.set('t', birthTime);
    }
    if (gender === 'female') {
      params.set('g', 'female');
    }

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleAnalyze = () => {
    const year = parseInt(birthYear);
    const month = parseInt(birthMonth);
    const day = parseInt(birthDay);
    const hour = unknownTime ? null : (birthTime !== '' ? parseInt(birthTime) : null);

    if (!year || year < 1900 || year > 2100) {
      setError('올바른 출생년도를 입력하세요 (1900-2100)');
      return;
    }
    if (!month || month < 1 || month > 12) {
      setError('올바른 월을 입력하세요 (1-12)');
      return;
    }
    if (!day || day < 1 || day > 31) {
      setError('올바른 일을 입력하세요 (1-31)');
      return;
    }

    setError(null);

    const saju = calculateSaju(year, month, day, hour);
    const ohangCount = analyzeOhang(saju);
    const sipsungCount = analyzeSipsung(saju);
    const personality = getPersonality(saju.day.gan);
    const ohangAdvice = getOhangAdvice(ohangCount);
    const animalFortune = getAnimalFortune(saju.year.ji);
    const animal = JIJI_ANIMAL[saju.year.ji];
    const sipsungInterpretation = getSipsungInterpretation(sipsungCount);
    const dayPillarInterpretation = getDayPillarInterpretation(saju.day.gan, saju.day.ji);
    const healthAdvice = getOhangHealthAdvice(ohangCount);
    const daeun = calculateDaeun(saju, gender, year);
    const dailyFortune = getDailyFortune(saju.day.gan);
    const yearlyFortune = getYearlyFortune(saju.day.gan, saju.year.ji);

    setResult({
      saju,
      ohangCount,
      sipsungCount,
      personality,
      ohangAdvice,
      animalFortune,
      animal,
      sipsungInterpretation,
      dayPillarInterpretation,
      healthAdvice,
      daeun,
      dailyFortune,
      yearlyFortune,
    });
  };

  const resetForm = () => {
    setBirthYear('');
    setBirthMonth('');
    setBirthDay('');
    setBirthTime('');
    setUnknownTime(false);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-2">
      {/* 입력 폼 */}
      <Card variant="bordered" className="p-4 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">출생년도</label>
            <Input
              type="number"
              placeholder="예: 1990"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">월</label>
            <Input
              type="number"
              placeholder="1-12"
              min={1}
              max={12}
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">일</label>
            <Input
              type="number"
              placeholder="1-31"
              min={1}
              max={31}
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">태어난 시간</label>
            <select
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              disabled={unknownTime}
              className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">선택하세요</option>
              {TIME_PERIODS.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="unknownTime"
            checked={unknownTime}
            onChange={(e) => {
              setUnknownTime(e.target.checked);
              if (e.target.checked) setBirthTime('');
            }}
            className="w-4 h-4"
          />
          <label htmlFor="unknownTime" className="text-sm text-gray-600 dark:text-gray-400">
            태어난 시간을 모릅니다 (시주 제외하고 분석)
          </label>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-2 block">성별</label>
          <div className="flex gap-3">
            <button
              onClick={() => setGender('male')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                gender === 'male'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              남성
            </button>
            <button
              onClick={() => setGender('female')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                gender === 'female'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              여성
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleAnalyze}
            className="flex-1 py-3 rounded-xl text-white font-bold text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-purple-500/25"
          >
            🔮 사주 풀이하기
          </button>
          <Button variant="ghost" onClick={resetForm}>초기화</Button>
        </div>
      </Card>

      {/* 결과 */}
      {result && (
        <div className="space-y-6">
          {/* 생년월일 요약 */}
          <Card variant="bordered" className="p-4 text-center">
            <p className="text-lg font-bold">
              {birthYear}년 {birthMonth}월 {birthDay}일생
            </p>
            <p className="text-sm text-gray-500 mt-1">
              일간: <span className="font-bold text-lg">{result.saju.day.gan}{CHEONGAN_OHANG[result.saju.day.gan]}</span> · {result.animal}띠
            </p>
            <Button
              variant="ghost"
              className="mt-3 text-sm"
              onClick={handleShare}
            >
              {copied ? '✅ 링크 복사됨!' : '🔗 결과 공유하기'}
            </Button>
          </Card>

          {/* 사주 팔자 표시 */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-bold text-lg mb-4 text-center">📜 사주팔자</h3>
            <div className={`grid ${result.saju.hour ? 'grid-cols-4' : 'grid-cols-3'} gap-2 text-center`}>
              {result.saju.hour && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">시주</p>
                  <div className={`p-3 rounded-lg ${OHANG_BG[CHEONGAN_OHANG[result.saju.hour.gan]]}`}>
                    <p className="text-xl font-bold">{result.saju.hour.gan}</p>
                    <p className="text-xs text-gray-500">{CHEONGAN_OHANG[result.saju.hour.gan]}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${OHANG_BG[JIJI_OHANG[result.saju.hour.ji]]}`}>
                    <p className="text-xl font-bold">{result.saju.hour.ji}</p>
                    <p className="text-xs text-gray-500">{JIJI_OHANG[result.saju.hour.ji]}</p>
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs text-gray-500">일주</p>
                <div className={`p-3 rounded-lg ${OHANG_BG[CHEONGAN_OHANG[result.saju.day.gan]]} ring-2 ring-yellow-400`}>
                  <p className="text-xl font-bold">{result.saju.day.gan}</p>
                  <p className="text-xs text-gray-500">{CHEONGAN_OHANG[result.saju.day.gan]} (일간)</p>
                </div>
                <div className={`p-3 rounded-lg ${OHANG_BG[JIJI_OHANG[result.saju.day.ji]]}`}>
                  <p className="text-xl font-bold">{result.saju.day.ji}</p>
                  <p className="text-xs text-gray-500">{JIJI_OHANG[result.saju.day.ji]}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">월주</p>
                <div className={`p-3 rounded-lg ${OHANG_BG[CHEONGAN_OHANG[result.saju.month.gan]]}`}>
                  <p className="text-xl font-bold">{result.saju.month.gan}</p>
                  <p className="text-xs text-gray-500">{CHEONGAN_OHANG[result.saju.month.gan]}</p>
                </div>
                <div className={`p-3 rounded-lg ${OHANG_BG[JIJI_OHANG[result.saju.month.ji]]}`}>
                  <p className="text-xl font-bold">{result.saju.month.ji}</p>
                  <p className="text-xs text-gray-500">{JIJI_OHANG[result.saju.month.ji]}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">년주</p>
                <div className={`p-3 rounded-lg ${OHANG_BG[CHEONGAN_OHANG[result.saju.year.gan]]}`}>
                  <p className="text-xl font-bold">{result.saju.year.gan}</p>
                  <p className="text-xs text-gray-500">{CHEONGAN_OHANG[result.saju.year.gan]}</p>
                </div>
                <div className={`p-3 rounded-lg ${OHANG_BG[JIJI_OHANG[result.saju.year.ji]]}`}>
                  <p className="text-xl font-bold">{result.saju.year.ji}</p>
                  <p className="text-xs text-gray-500">{JIJI_ANIMAL[result.saju.year.ji]}띠</p>
                </div>
              </div>
            </div>
            {!result.saju.hour && (
              <p className="text-xs text-center text-gray-400 mt-3">
                * 시간을 모르므로 시주 없이 분석되었습니다
              </p>
            )}
          </Card>

          {/* 성격 분석 */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-bold text-lg mb-1">{result.personality.title}</h3>
            <p className="text-xs text-gray-500 mb-4">{result.personality.subtitle}</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">💚 장점</p>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {result.personality.positive}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">🧡 단점</p>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {result.personality.negative}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">💙 조언</p>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {result.personality.advice}
                </p>
              </div>
            </div>
          </Card>

          {/* 일주 해석 */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-bold text-lg mb-3">🎴 일주 해석 ({result.saju.day.gan}{result.saju.day.ji}일주)</h3>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {result.dayPillarInterpretation}
            </p>
          </Card>

          {/* 오행 분석 */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-bold text-lg mb-4">🌿 오행 분석</h3>
            {(() => {
              const total = Object.values(result.ohangCount).reduce((a, b) => a + b, 0);
              return (
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {OHANG.map((oh) => {
                    const percent = total > 0 ? ((result.ohangCount[oh] / total) * 100).toFixed(1) : '0.0';
                    return (
                      <div key={oh} className={`p-3 rounded-lg text-center ${OHANG_BG[oh]}`}>
                        <p className="text-lg font-bold">{oh}</p>
                        <p className="text-2xl font-bold">{result.ohangCount[oh]}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{percent}%</p>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            <div className="space-y-2 text-sm">
              {result.ohangAdvice.strong.length > 0 && (
                <p>
                  <span className="font-medium">강한 오행:</span> {result.ohangAdvice.strong.join(', ')}
                </p>
              )}
              {result.ohangAdvice.weak.length > 0 && (
                <p>
                  <span className="font-medium">부족한 오행:</span> {result.ohangAdvice.weak.join(', ')}
                </p>
              )}
              <p className="text-gray-600 dark:text-gray-400 mt-3">{result.ohangAdvice.advice}</p>
            </div>
          </Card>

          {/* 십성 분석 */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-bold text-lg mb-4">⭐ 십성 분석</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
              {Object.entries(result.sipsungCount).filter(([, count]) => count > 0).map(([name, count]) => (
                <div key={name} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="font-medium">{SIPSUNG_NAMES[name]?.name || name}</p>
                  <p className="text-xs text-gray-500">{count}개</p>
                  <p className="text-xs text-gray-400 mt-1">{SIPSUNG_NAMES[name]?.desc}</p>
                </div>
              ))}
            </div>
            {Object.values(result.sipsungCount).every(v => v === 0) && (
              <p className="text-sm text-gray-500">십성 분석 결과가 없습니다.</p>
            )}
          </Card>

          {/* 직업/연애/재물 적성 */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-bold text-lg mb-4">🔮 사주로 본 적성 분석</h3>
            <p className="text-xs text-gray-500 mb-4">주도 십성: {result.sipsungInterpretation.dominant}</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">💼 직업 적성</p>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {result.sipsungInterpretation.career}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-pink-600 dark:text-pink-400 mb-1">💕 연애 스타일</p>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {result.sipsungInterpretation.love}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">💰 재물운 성향</p>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {result.sipsungInterpretation.money}
                </p>
              </div>
            </div>
          </Card>

          {/* 건강 조언 */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-bold text-lg mb-3">🏥 오행 건강 조언</h3>
            <div className="space-y-3">
              {result.healthAdvice.map((tip, idx) => (
                <p key={idx} className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {tip}
                </p>
              ))}
            </div>
          </Card>

          {/* 대운 */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-bold text-lg mb-4">🌊 대운 (10년 단위 운세)</h3>
            <div className="flex overflow-x-auto gap-2 pb-2">
              {result.daeun.map((d, i) => (
                <div key={i} className="flex-shrink-0 w-20 text-center">
                  <p className="text-xs text-gray-500 mb-1">{d.age}대</p>
                  <div className={`p-2 rounded-lg ${OHANG_BG[CHEONGAN_OHANG[d.gan]]}`}>
                    <p className="text-lg font-bold">{d.gan}{d.ji}</p>
                    <p className="text-xs">{CHEONGAN_OHANG[d.gan]}/{JIJI_OHANG[d.ji]}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              * 대운은 10년마다 바뀌며, 인생의 큰 흐름을 나타냅니다
            </p>
          </Card>

          {/* 띠 운세 */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-bold text-lg mb-3">🐾 {result.animal}띠 ({result.saju.year.ji})</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">기본 성향</p>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {result.animalFortune.basic}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">올해의 운세</p>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {result.animalFortune.year2024}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">띠 궁합</p>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {result.animalFortune.compatibility}
                </p>
              </div>
            </div>
          </Card>

          {/* 오늘의 운세 */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-bold text-lg mb-4">☀️ 오늘의 운세</h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-3 rounded-lg">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {result.dailyFortune.overall}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <p className="text-xs font-medium text-pink-600 dark:text-pink-400 mb-1">💕 연애운</p>
                  <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    {result.dailyFortune.love}
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">💰 금전운</p>
                  <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    {result.dailyFortune.money}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">💼 직장/학업운</p>
                  <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    {result.dailyFortune.work}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">🏥 건강운</p>
                  <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    {result.dailyFortune.health}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                  🎨 행운의 색: <span className="font-medium">{result.dailyFortune.luckyColor}</span>
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                  🔢 행운의 숫자: <span className="font-medium">{result.dailyFortune.luckyNumber}</span>
                </span>
              </div>
            </div>
          </Card>

          {/* 년운 그래프 */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-bold text-lg mb-4">📊 10년 운세 그래프</h3>
            <p className="text-xs text-gray-500 mb-4">과거 5년부터 미래 5년까지의 운세 흐름입니다</p>

            {/* 분야별 범례 */}
            <div className="flex flex-wrap gap-3 text-xs justify-center mb-4">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full" /> 💰 금전운</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-full" /> 💼 직장운</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 rounded-full" /> 💕 인간관계</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-400 rounded-full" /> 종합</span>
            </div>

            {/* 분야별 라인 그래프 */}
            <div className="relative h-56 mb-2">
              {/* Y축 가이드라인 + 라벨 */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[100, 75, 50, 25, 0].map((val) => (
                  <div key={val} className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400 w-6 text-right">{val}</span>
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-700 border-dashed" />
                  </div>
                ))}
              </div>

              {/* SVG 라인 그래프 */}
              <svg className="absolute inset-0 w-full h-full ml-7" viewBox="0 0 400 200" preserveAspectRatio="none">
                {/* 금전운 라인 (초록) */}
                <polyline
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                  points={result.yearlyFortune.map((yf, i) => {
                    const x = (i / (result.yearlyFortune.length - 1)) * 380 + 10;
                    const y = 200 - (yf.moneyScore / 100) * 200;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                {result.yearlyFortune.map((yf, i) => {
                  const x = (i / (result.yearlyFortune.length - 1)) * 380 + 10;
                  const y = 200 - (yf.moneyScore / 100) * 200;
                  const currentYear = new Date().getFullYear();
                  return (
                    <circle
                      key={`money-${yf.year}`}
                      cx={x}
                      cy={y}
                      r={yf.year === currentYear ? 5 : 3}
                      fill="#22c55e"
                    />
                  );
                })}

                {/* 직장운 라인 (파랑) */}
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  points={result.yearlyFortune.map((yf, i) => {
                    const x = (i / (result.yearlyFortune.length - 1)) * 380 + 10;
                    const y = 200 - (yf.careerScore / 100) * 200;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                {result.yearlyFortune.map((yf, i) => {
                  const x = (i / (result.yearlyFortune.length - 1)) * 380 + 10;
                  const y = 200 - (yf.careerScore / 100) * 200;
                  const currentYear = new Date().getFullYear();
                  return (
                    <circle
                      key={`career-${yf.year}`}
                      cx={x}
                      cy={y}
                      r={yf.year === currentYear ? 5 : 3}
                      fill="#3b82f6"
                    />
                  );
                })}

                {/* 인간관계 라인 (보라) */}
                <polyline
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2"
                  points={result.yearlyFortune.map((yf, i) => {
                    const x = (i / (result.yearlyFortune.length - 1)) * 380 + 10;
                    const y = 200 - (yf.relationshipScore / 100) * 200;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                {result.yearlyFortune.map((yf, i) => {
                  const x = (i / (result.yearlyFortune.length - 1)) * 380 + 10;
                  const y = 200 - (yf.relationshipScore / 100) * 200;
                  const currentYear = new Date().getFullYear();
                  return (
                    <circle
                      key={`rel-${yf.year}`}
                      cx={x}
                      cy={y}
                      r={yf.year === currentYear ? 5 : 3}
                      fill="#a855f7"
                    />
                  );
                })}

                {/* 종합 라인 (회색 점선) */}
                <polyline
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  points={result.yearlyFortune.map((yf, i) => {
                    const x = (i / (result.yearlyFortune.length - 1)) * 380 + 10;
                    const y = 200 - (yf.score / 100) * 200;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* 올해 세로선 표시 */}
                {(() => {
                  const currentYear = new Date().getFullYear();
                  const idx = result.yearlyFortune.findIndex((yf) => yf.year === currentYear);
                  if (idx >= 0) {
                    const x = (idx / (result.yearlyFortune.length - 1)) * 380 + 10;
                    return (
                      <line
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={200}
                        stroke="#eab308"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                    );
                  }
                  return null;
                })()}
              </svg>
            </div>

            {/* X축 연도 */}
            <div className="flex justify-between text-xs text-gray-500 mb-4 ml-7">
              {result.yearlyFortune.map((yf) => {
                const currentYear = new Date().getFullYear();
                const isCurrentYear = yf.year === currentYear;
                return (
                  <span
                    key={yf.year}
                    className={`flex-1 text-center ${isCurrentYear ? 'font-bold text-yellow-600' : ''}`}
                  >
                    {isCurrentYear ? `'${String(yf.year).slice(2)}▼` : `'${String(yf.year).slice(2)}`}
                  </span>
                );
              })}
            </div>

            {/* 올해/내년 점수 표시 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {result.yearlyFortune
                .filter((yf) => {
                  const currentYear = new Date().getFullYear();
                  return yf.year === currentYear || yf.year === currentYear + 1;
                })
                .map((yf) => {
                  const currentYear = new Date().getFullYear();
                  const isCurrentYear = yf.year === currentYear;
                  return (
                    <div key={yf.year} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm font-bold mb-2">
                        {yf.year}년 {isCurrentYear && <span className="text-yellow-600">(올해)</span>}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="text-green-600 font-bold">{yf.moneyScore}</div>
                          <div className="text-gray-500">💰 금전</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-600 font-bold">{yf.careerScore}</div>
                          <div className="text-gray-500">💼 직장</div>
                        </div>
                        <div className="text-center">
                          <div className="text-purple-600 font-bold">{yf.relationshipScore}</div>
                          <div className="text-gray-500">💕 관계</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* 올해/내년 상세 정보 */}
            <div className="space-y-4">
              {result.yearlyFortune
                .filter((yf) => {
                  const currentYear = new Date().getFullYear();
                  return yf.year === currentYear || yf.year === currentYear + 1;
                })
                .map((yf) => {
                  const currentYear = new Date().getFullYear();
                  const isCurrentYear = yf.year === currentYear;
                  const bgColor = yf.score >= 80 ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : yf.score >= 60 ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : yf.score >= 50 ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'border-red-400 bg-red-50 dark:bg-red-900/20';

                  return (
                    <div
                      key={yf.year}
                      className={`p-4 rounded-lg border ${bgColor}`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold">{yf.year}년</span>
                        <span className={`px-2 py-0.5 text-white text-xs rounded-full ${yf.score >= 80 ? 'bg-green-500' : yf.score >= 60 ? 'bg-blue-500' : yf.score >= 50 ? 'bg-yellow-500' : 'bg-red-400'}`}>
                          {yf.score}점
                        </span>
                        <span className="text-xs text-gray-500">({yf.sipsung})</span>
                        {isCurrentYear && (
                          <span className="px-2 py-0.5 bg-gray-800 text-white text-xs rounded-full">
                            올해
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-3">
                        {yf.overall}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-medium text-gray-500">💼 직업/사업:</span>
                          <p className="text-gray-600 dark:text-gray-400 mt-0.5">{yf.career}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">💰 재물:</span>
                          <p className="text-gray-600 dark:text-gray-400 mt-0.5">{yf.money}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">💕 대인관계:</span>
                          <p className="text-gray-600 dark:text-gray-400 mt-0.5">{yf.relationship}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">💡 조언:</span>
                          <p className="text-gray-600 dark:text-gray-400 mt-0.5">{yf.advice}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>
      )}

      {/* 안내 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 양력 생년월일을 입력해 주세요</p>
        <p>• 출생 시간을 모르면 체크박스를 선택하세요</p>
        <p>• 이 결과는 재미로만 참고해 주세요</p>
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
          📜 사주풀이란?
        </h2>
        <p className="text-sm leading-relaxed">
          사주(四柱)는 태어난 년, 월, 일, 시의 네 기둥을 의미합니다. 각 기둥은 천간과 지지로 이루어져
          총 여덟 글자, 즉 팔자(八字)가 됩니다. 사주풀이는 이 팔자를 분석하여 타고난 성격, 재능,
          운세 등을 해석하는 전통적인 방법입니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🌿 오행이란?
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          오행(五行)은 목(木), 화(火), 토(土), 금(金), 수(水)의 다섯 가지 기운을 말합니다.
          사주의 균형을 분석할 때 오행의 분포를 확인하며, 부족한 오행을 보완하면 운이 좋아진다고 합니다.
        </p>
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
            <p className="font-bold">목(木)</p>
            <p>봄, 동쪽, 초록</p>
          </div>
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
            <p className="font-bold">화(火)</p>
            <p>여름, 남쪽, 빨강</p>
          </div>
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">
            <p className="font-bold">토(土)</p>
            <p>환절기, 중앙, 노랑</p>
          </div>
          <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
            <p className="font-bold">금(金)</p>
            <p>가을, 서쪽, 흰색</p>
          </div>
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
            <p className="font-bold">수(水)</p>
            <p>겨울, 북쪽, 검정</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⭐ 십성이란?
        </h2>
        <p className="text-sm leading-relaxed">
          십성(十星)은 일간(나)을 기준으로 다른 천간과의 관계를 나타냅니다. 비견, 겁재, 식신, 상관,
          편재, 정재, 편관, 정관, 편인, 정인의 10가지가 있으며, 각각 다른 의미와 영향력을 가집니다.
          십성의 분포를 통해 재물운, 직업운, 대인관계 등을 분석할 수 있습니다.
        </p>
      </section>

      <FaqSection
        title="❓ 자주 묻는 질문"
        faqs={[
          {
            question: '양력과 음력 중 어떤 것을 입력해야 하나요?',
            answer: '양력 생년월일을 입력해 주세요. 전통 사주는 음력을 사용하지만, 이 도구는 양력 기준으로 근사 계산합니다.',
          },
          {
            question: '출생 시간을 모르면 어떻게 하나요?',
            answer: '"태어난 시간을 모릅니다" 체크박스를 선택하세요. 시주를 제외한 년주, 월주, 일주만으로 분석됩니다.',
          },
          {
            question: '대운은 무엇인가요?',
            answer: '대운은 10년 단위로 바뀌는 큰 운세의 흐름입니다. 인생의 시기별 특징과 주의해야 할 점을 알려줍니다.',
          },
        ]}
      />
    </div>
  );
}

export function SajuReading() {
  return (
    <Suspense fallback={<div className="p-4 text-center">로딩 중...</div>}>
      <SajuReadingInner />
    </Suspense>
  );
}
