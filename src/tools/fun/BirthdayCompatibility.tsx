'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';
import { encodeShareData, decodeShareData } from '@/lib/utils/share-encoding';

// 12지신 (띠)
const ZODIAC_ANIMALS = [
  { name: '쥐', emoji: '🐀' },
  { name: '소', emoji: '🐂' },
  { name: '호랑이', emoji: '🐅' },
  { name: '토끼', emoji: '🐇' },
  { name: '용', emoji: '🐉' },
  { name: '뱀', emoji: '🐍' },
  { name: '말', emoji: '🐎' },
  { name: '양', emoji: '🐑' },
  { name: '원숭이', emoji: '🐒' },
  { name: '닭', emoji: '🐓' },
  { name: '개', emoji: '🐕' },
  { name: '돼지', emoji: '🐖' },
];

// 별자리
const ZODIAC_SIGNS = [
  { name: '물병자리', emoji: '♒', start: [1, 20], end: [2, 18] },
  { name: '물고기자리', emoji: '♓', start: [2, 19], end: [3, 20] },
  { name: '양자리', emoji: '♈', start: [3, 21], end: [4, 19] },
  { name: '황소자리', emoji: '♉', start: [4, 20], end: [5, 20] },
  { name: '쌍둥이자리', emoji: '♊', start: [5, 21], end: [6, 21] },
  { name: '게자리', emoji: '♋', start: [6, 22], end: [7, 22] },
  { name: '사자자리', emoji: '♌', start: [7, 23], end: [8, 22] },
  { name: '처녀자리', emoji: '♍', start: [8, 23], end: [9, 22] },
  { name: '천칭자리', emoji: '♎', start: [9, 23], end: [10, 22] },
  { name: '전갈자리', emoji: '♏', start: [10, 23], end: [11, 21] },
  { name: '사수자리', emoji: '♐', start: [11, 22], end: [12, 21] },
  { name: '염소자리', emoji: '♑', start: [12, 22], end: [1, 19] },
];

function getZodiacAnimal(year: number) {
  const index = (year - 4) % 12;
  return ZODIAC_ANIMALS[index];
}

function getZodiacSign(month: number, day: number) {
  for (const sign of ZODIAC_SIGNS) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) return sign;
    } else if (startMonth < endMonth) {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) return sign;
    } else {
      // 염소자리 (12월 ~ 1월)
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) return sign;
    }
  }
  return ZODIAC_SIGNS[0]; // 기본값
}

// 띠 궁합 계산
function getAnimalCompatibility(animal1: string, animal2: string): number {
  const goodPairs: Record<string, string[]> = {
    '쥐': ['용', '원숭이', '소'],
    '소': ['뱀', '닭', '쥐'],
    '호랑이': ['말', '개', '돼지'],
    '토끼': ['양', '돼지', '개'],
    '용': ['쥐', '원숭이', '닭'],
    '뱀': ['소', '닭', '원숭이'],
    '말': ['호랑이', '양', '개'],
    '양': ['토끼', '말', '돼지'],
    '원숭이': ['쥐', '용', '뱀'],
    '닭': ['소', '뱀', '용'],
    '개': ['호랑이', '토끼', '말'],
    '돼지': ['토끼', '양', '호랑이'],
  };

  if (animal1 === animal2) return 80;
  if (goodPairs[animal1]?.includes(animal2)) return 95;
  return 60;
}

// 별자리 궁합 계산
function getSignCompatibility(sign1: string, sign2: string): number {
  const elements: Record<string, string> = {
    '양자리': '불', '사자자리': '불', '사수자리': '불',
    '황소자리': '땅', '처녀자리': '땅', '염소자리': '땅',
    '쌍둥이자리': '공기', '천칭자리': '공기', '물병자리': '공기',
    '게자리': '물', '전갈자리': '물', '물고기자리': '물',
  };

  const e1 = elements[sign1];
  const e2 = elements[sign2];

  if (sign1 === sign2) return 85;
  if (e1 === e2) return 90;
  if ((e1 === '불' && e2 === '공기') || (e1 === '공기' && e2 === '불')) return 88;
  if ((e1 === '땅' && e2 === '물') || (e1 === '물' && e2 === '땅')) return 88;
  return 65;
}

interface Person {
  birthdate: string;
  animal: typeof ZODIAC_ANIMALS[0];
  sign: typeof ZODIAC_SIGNS[0];
}

interface Result {
  person1: Person;
  person2: Person;
  animalScore: number;
  signScore: number;
  totalScore: number;
  comment: string;
}

export function BirthdayCompatibility() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // URL hash에서 공유 데이터 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const encoded = hash.slice(7);
        const parsed = decodeShareData(encoded);
        if (parsed.d1 && parsed.d2) {
          setDate1(parsed.d1);
          setDate2(parsed.d2);
        }
      } catch {
        // 파싱 실패 시 무시
      }
    }
  }, []);

  const getShareUrl = () => {
    if (typeof window === 'undefined' || !result) return '';
    try {
      const data = { d1: date1, d2: date2 };
      const encoded = encodeShareData(data);
      const baseUrl = window.location.href.split('#')[0];
      return `${baseUrl}#share=${encoded}`;
    } catch {
      return '';
    }
  };

  const handleCalculate = useCallback(() => {
    if (!date1 || !date2) return;

    setIsAnimating(true);
    setResult(null);

    setTimeout(() => {
      const d1 = new Date(date1);
      const d2 = new Date(date2);

      const person1: Person = {
        birthdate: date1,
        animal: getZodiacAnimal(d1.getFullYear()),
        sign: getZodiacSign(d1.getMonth() + 1, d1.getDate()),
      };

      const person2: Person = {
        birthdate: date2,
        animal: getZodiacAnimal(d2.getFullYear()),
        sign: getZodiacSign(d2.getMonth() + 1, d2.getDate()),
      };

      const animalScore = getAnimalCompatibility(person1.animal.name, person2.animal.name);
      const signScore = getSignCompatibility(person1.sign.name, person2.sign.name);
      const totalScore = Math.round((animalScore * 0.4 + signScore * 0.6));

      const comments = totalScore >= 85
        ? ['천생연분이에요! 운명적인 만남 💕', '별자리와 띠가 모두 잘 맞아요!', '우주가 맺어준 인연이에요 ✨']
        : totalScore >= 70
        ? ['좋은 궁합이에요! 함께하면 행복할 거예요.', '서로 보완해주는 관계예요.', '노력하면 더 좋아질 수 있어요!']
        : ['다른 매력이 끌릴 수 있어요!', '서로 다르기에 오히려 신선할 수 있어요.', '궁합은 참고만! 사랑은 노력이에요 💪'];

      const commentIndex = (d1.getDate() + d2.getDate()) % 3;

      setResult({
        person1,
        person2,
        animalScore,
        signScore,
        totalScore,
        comment: comments[commentIndex],
      });
      setIsAnimating(false);
    }, 1500);
  }, [date1, date2]);

  const handleReset = () => {
    setDate1('');
    setDate2('');
    setResult(null);
  };

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
          생년월일 입력
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              첫 번째 생년월일
            </label>
            <input
              type="date"
              value={date1}
              onChange={(e) => setDate1(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex justify-center">
            <span className="text-2xl">💑</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              두 번째 생년월일
            </label>
            <input
              type="date"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleCalculate}
            disabled={!date1 || !date2 || isAnimating}
            className="flex-1"
          >
            {isAnimating ? '궁합 분석 중...' : '궁합 보기 🔮'}
          </Button>
          {result && (
            <Button variant="outline" onClick={handleReset}>
              다시하기
            </Button>
          )}
        </div>
      </Card>

      {isAnimating && (
        <Card variant="bordered" className="p-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-4xl animate-pulse">🔮</div>
            <p className="text-gray-600 dark:text-gray-400">
              띠와 별자리 궁합을 분석하고 있어요...
            </p>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-purple-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {result && !isAnimating && (
        <Card variant="bordered" className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2">
              {result.totalScore}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">{result.comment}</p>
          </div>

          {/* 궁합 바 */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-1000"
              style={{ width: `${result.totalScore}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Person 1 */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">{result.person1.animal.emoji}</div>
              <div className="font-semibold text-purple-700 dark:text-purple-300">
                {result.person1.animal.name}띠
              </div>
              <div className="text-2xl mt-2">{result.person1.sign.emoji}</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                {result.person1.sign.name}
              </div>
            </div>

            {/* Person 2 */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">{result.person2.animal.emoji}</div>
              <div className="font-semibold text-indigo-700 dark:text-indigo-300">
                {result.person2.animal.name}띠
              </div>
              <div className="text-2xl mt-2">{result.person2.sign.emoji}</div>
              <div className="text-sm text-indigo-600 dark:text-indigo-400">
                {result.person2.sign.name}
              </div>
            </div>
          </div>

          {/* 세부 궁합 */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">띠 궁합</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{result.animalScore}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">별자리 궁합</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{result.signScore}%</span>
            </div>
          </div>

          <ResultShareButtons
            url={getShareUrl()}
            title="생년월일 궁합 결과"
            description={`종합 궁합 ${result.totalScore}%! ${result.person1.animal.name}띠 ${result.person1.sign.name} & ${result.person2.animal.name}띠 ${result.person2.sign.name}`}
            visible={true}
          />
        </Card>
      )}

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        ⚠️ 이 결과는 재미로만 봐주세요! 실제 운세와는 관련이 없습니다.
      </div>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔮 생년월일 궁합이란?
        </h2>
        <p className="text-sm leading-relaxed">
          두 사람의 생년월일을 기반으로 띠 궁합(12지신)과 별자리 궁합을 종합 분석하는 도구입니다.
          띠 40%와 별자리 60%를 가중 평균하여 종합 점수를 산출합니다.
          연인, 친구, 가족, 동료와의 궁합을 재미로 확인해보세요.
          각 띠와 별자리의 특성을 바탕으로 조언도 제공합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🐲 12지신(띠) 삼합 관계
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">그룹</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">띠</th>
                <th className="text-left py-2 font-semibold text-gray-900 dark:text-white">특징</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">수 삼합</td>
                <td className="py-2 pr-4">🐀쥐, 🐉용, 🐒원숭이</td>
                <td className="py-2">지혜와 창의력</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">금 삼합</td>
                <td className="py-2 pr-4">🐂소, 🐍뱀, 🐓닭</td>
                <td className="py-2">성실과 책임감</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">화 삼합</td>
                <td className="py-2 pr-4">🐅호랑이, 🐎말, 🐕개</td>
                <td className="py-2">열정과 용기</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">목 삼합</td>
                <td className="py-2 pr-4">🐇토끼, 🐑양, 🐖돼지</td>
                <td className="py-2">온화와 화합</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 궁합 해석 팁
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>높은 점수:</strong> 비슷한 성향으로 자연스럽게 통함</li>
          <li><strong>보통 점수:</strong> 서로 다른 매력으로 보완 가능</li>
          <li><strong>낮은 점수:</strong> 다름이 오히려 신선할 수 있음</li>
          <li><strong>참고만:</strong> 실제 관계는 노력과 이해로 만들어가는 것!</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '띠 궁합과 별자리 궁합 중 뭐가 더 중요한가요?', answer: '이 도구에서는 별자리 60%, 띠 40%로 계산하지만, 재미로만 참고하세요. 실제 관계에서 중요한 건 서로의 노력입니다.' },
          { question: '같은 띠끼리는 궁합이 좋은가요?', answer: '같은 띠는 80% 점수를 받습니다. 비슷한 성향이지만, 삼합 관계의 띠들이 더 높은 점수(95%)를 받습니다.' },
          { question: '이 결과를 믿어도 되나요?', answer: '이 도구는 순수하게 재미를 위한 것입니다. 실제 운세나 관계 예측과는 관련이 없으니 가볍게 즐겨주세요.' },
        ]}
      />
    </div>
  );
}
