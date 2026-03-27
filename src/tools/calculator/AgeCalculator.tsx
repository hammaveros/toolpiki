'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

type Mode = 'age' | 'dday' | 'animal';

const ZODIAC_ANIMALS = [
  { animal: '쥐', emoji: '🐭', years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020] },
  { animal: '소', emoji: '🐮', years: [1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021] },
  { animal: '호랑이', emoji: '🐯', years: [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022] },
  { animal: '토끼', emoji: '🐰', years: [1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023] },
  { animal: '용', emoji: '🐲', years: [1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024] },
  { animal: '뱀', emoji: '🐍', years: [1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025] },
  { animal: '말', emoji: '🐴', years: [1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026] },
  { animal: '양', emoji: '🐑', years: [1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027] },
  { animal: '원숭이', emoji: '🐵', years: [1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028] },
  { animal: '닭', emoji: '🐔', years: [1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029] },
  { animal: '개', emoji: '🐶', years: [1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030] },
  { animal: '돼지', emoji: '🐷', years: [1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031] },
];

function getZodiac(year: number) {
  const index = (year - 1924) % 12;
  return ZODIAC_ANIMALS[index >= 0 ? index : index + 12];
}

function calculateAge(birthDate: Date, targetDate: Date) {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

function getDaysDiff(date1: Date, date2: Date): number {
  const diffTime = date2.getTime() - date1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function AgeCalculator() {
  const [mode, setMode] = useState<Mode>('age');
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

  const result = useMemo(() => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime())) return null;

    const currentYear = new Date().getFullYear();
    const birthYear = birth.getFullYear();

    // 만 나이
    const { years, months, days } = calculateAge(birth, target);

    // 한국 나이 (연 나이)
    const koreanAge = currentYear - birthYear + 1;

    // 다음 생일까지
    let nextBirthday = new Date(currentYear, birth.getMonth(), birth.getDate());
    if (nextBirthday < new Date()) {
      nextBirthday = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilBirthday = getDaysDiff(new Date(), nextBirthday);

    // 태어난 지 며칠
    const totalDays = getDaysDiff(birth, target);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    // 띠
    const zodiac = getZodiac(birthYear);

    return {
      years,
      months,
      days,
      koreanAge,
      daysUntilBirthday,
      totalDays,
      totalWeeks,
      totalMonths,
      zodiac,
      birthYear,
    };
  }, [birthDate, targetDate]);

  return (
    <div className="space-y-2">
      {/* 모드 선택 */}
      <div className="flex gap-2">
        {(['age', 'dday', 'animal'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg font-medium transition-colors text-sm',
              mode === m
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {m === 'age' && '나이 계산'}
            {m === 'dday' && '생존 일수'}
            {m === 'animal' && '띠 계산'}
          </button>
        ))}
      </div>

      <Card variant="bordered" className="p-5">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              생년월일
            </label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {mode === 'age' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                기준일 (기본: 오늘)
              </label>
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          )}
        </div>
      </Card>

      {result && (
        <>
          {mode === 'age' && (
            <div className="grid grid-cols-2 gap-4">
              <Card variant="bordered" className="p-4 text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">만 나이</div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {result.years}세
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {result.months}개월 {result.days}일
                </div>
              </Card>
              <Card variant="bordered" className="p-4 text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">한국 나이</div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {result.koreanAge}세
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  연 나이 기준
                </div>
              </Card>
              <Card variant="bordered" className="p-4 text-center col-span-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">다음 생일까지</div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  D-{result.daysUntilBirthday}
                </div>
              </Card>
            </div>
          )}

          {mode === 'dday' && (
            <div className="grid grid-cols-2 gap-4">
              <Card variant="bordered" className="p-4 text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">태어난 지</div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {result.totalDays.toLocaleString()}일
                </div>
              </Card>
              <Card variant="bordered" className="p-4 text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">주</div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {result.totalWeeks.toLocaleString()}주
                </div>
              </Card>
              <Card variant="bordered" className="p-4 text-center col-span-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">개월</div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {result.totalMonths.toLocaleString()}개월
                </div>
              </Card>
            </div>
          )}

          {mode === 'animal' && result.zodiac && (
            <Card variant="bordered" className="p-6 text-center">
              <div className="text-6xl mb-4">{result.zodiac.emoji}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.zodiac.animal}띠
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {result.birthYear}년생
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                같은 띠: {result.zodiac.years.join(', ')}년
              </div>
            </Card>
          )}
        </>
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
          🎂 나이 계산기란?
        </h2>
        <p className="text-sm leading-relaxed">
          나이 계산기는 생년월일을 입력하면 만 나이와 한국 나이를 동시에 계산해주는 도구입니다.
          2023년부터 한국도 공식적으로 만 나이를 사용하지만, 일상에서는 여전히 연 나이를 많이 씁니다.
          다음 생일까지 남은 일수, 태어난 지 총 며칠인지도 확인할 수 있습니다.
          12지신 띠 정보도 제공하여 같은 띠 해에 태어난 연도를 한눈에 볼 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 나이 계산 방식 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">계산 방식</th>
                <th className="text-left py-2 px-2">계산법</th>
                <th className="text-left py-2 px-2">사용 예시</th>
                <th className="text-left py-2 px-2">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">만 나이</td><td>생일 기준</td><td>공식 문서, 법적 나이</td><td>국제 표준 (2023~ 한국 공식)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">한국 나이 (연 나이)</td><td>현재연도 - 출생연도 + 1</td><td>일상 대화</td><td>태어나면 1살, 새해에 +1</td></tr>
              <tr><td className="py-2 px-2 font-medium">세는 나이</td><td>현재연도 - 출생연도</td><td>병역, 일부 행정</td><td>생일 전후 구분 없음</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🐉 12지신 띠 순서
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>쥐(子)</strong> → <strong>소(丑)</strong> → <strong>호랑이(寅)</strong> → <strong>토끼(卯)</strong></li>
          <li><strong>용(辰)</strong> → <strong>뱀(巳)</strong> → <strong>말(午)</strong> → <strong>양(未)</strong></li>
          <li><strong>원숭이(申)</strong> → <strong>닭(酉)</strong> → <strong>개(戌)</strong> → <strong>돼지(亥)</strong></li>
          <li>12년 주기로 반복되며, 같은 띠끼리 12살 차이</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '만 나이와 한국 나이가 왜 다른가요?',
            answer: '한국 나이는 태어나면 1살로 시작하고 매년 1월 1일에 한 살을 더합니다. 만 나이는 출생 후 실제 경과 시간을 기준으로 생일마다 한 살씩 더합니다. 따라서 1~2살 차이가 납니다.',
          },
          {
            question: '2023년부터 만 나이로 통일됐나요?',
            answer: '2023년 6월부터 법적·공식적으로 만 나이가 사용됩니다. 다만 일상 대화, 학교 입학 기준 등에서는 여전히 연 나이를 쓰는 경우가 많습니다.',
          },
          {
            question: '띠는 양력과 음력 중 어떤 기준인가요?',
            answer: '전통적으로 띠는 음력 설날(대개 1~2월)을 기준으로 바뀝니다. 하지만 현대에는 편의상 양력 1월 1일 기준으로 계산하는 경우도 많습니다. 이 계산기는 양력 기준입니다.',
          },
        ]}
      />
    </div>
  );
}
