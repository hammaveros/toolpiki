'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';
import { encodeShareData, decodeShareData } from '@/lib/utils/share-encoding';

// 간단한 획수 기반 계산 (재미용)
function getStrokeCount(char: string): number {
  const code = char.charCodeAt(0);
  if (code >= 0xAC00 && code <= 0xD7A3) {
    // 한글 음절
    return ((code - 0xAC00) % 28) + Math.floor(((code - 0xAC00) / 28) % 21) + Math.floor((code - 0xAC00) / 28 / 21) + 2;
  }
  // 영문/숫자
  return code % 10 + 1;
}

function calculateCompatibility(name1: string, name2: string): number {
  const combined = name1 + name2;
  let total = 0;
  for (const char of combined) {
    total += getStrokeCount(char);
  }
  // 0-100 범위로 정규화 (seed로 사용)
  const hash = (total * 17 + name1.length * 13 + name2.length * 7) % 100;
  // 최소 25%, 최대 99%
  return Math.max(25, Math.min(99, hash + 25));
}

function getCompatibilityType(score: number): { type: string; description: string; emoji: string; color: string } {
  if (score >= 90) {
    return { type: '천생연분', description: '운명적인 만남! 완벽한 케미스트리를 가졌어요.', emoji: '💕', color: 'text-pink-500' };
  } else if (score >= 80) {
    return { type: '환상의 짝꿍', description: '서로에게 최고의 파트너가 될 수 있어요.', emoji: '💑', color: 'text-rose-500' };
  } else if (score >= 70) {
    return { type: '좋은 인연', description: '함께하면 좋은 일이 많을 거예요!', emoji: '💝', color: 'text-red-400' };
  } else if (score >= 60) {
    return { type: '괜찮은 사이', description: '노력하면 좋은 관계로 발전할 수 있어요.', emoji: '💗', color: 'text-orange-400' };
  } else if (score >= 50) {
    return { type: '보통', description: '서로를 알아가는 시간이 필요해요.', emoji: '💓', color: 'text-yellow-500' };
  } else if (score >= 40) {
    return { type: '노력 필요', description: '서로 이해하려는 노력이 필요해요.', emoji: '💔', color: 'text-amber-500' };
  } else {
    return { type: '미스터리', description: '예측불가! 의외의 조합일 수도...?', emoji: '🔮', color: 'text-purple-500' };
  }
}

function getRandomComment(score: number, name1: string, name2: string): string {
  const highComments = [
    `${name1}님과 ${name2}님은 전생에 연인이었을지도 몰라요! 💫`,
    `두 분이 만난 건 우연이 아닌 운명이에요!`,
    `이름만 봐도 찰떡궁합이 느껴져요!`,
    `두 분의 케미가 온 우주에 퍼지고 있어요 ✨`,
  ];
  const midComments = [
    `${name1}님이 조금만 더 노력하면 완벽해질 수 있어요!`,
    `서로의 다른 점을 인정하면 좋은 관계가 될 거예요.`,
    `함께 맛집 탐방을 해보세요! 궁합이 올라갈지도?`,
    `대화를 많이 나눠보세요. 생각보다 잘 맞을 수 있어요.`,
  ];
  const lowComments = [
    `정반대의 매력! 오히려 끌릴 수도 있어요.`,
    `${name2}님이 먼저 다가가 보는 건 어떨까요?`,
    `궁합은 참고만! 진짜 인연은 노력으로 만들어가는 거예요.`,
    `숫자에 연연하지 마세요. 사랑은 예측불가니까요! 💪`,
  ];

  const seed = (name1.length + name2.length + score) % 4;
  if (score >= 70) return highComments[seed];
  if (score >= 50) return midComments[seed];
  return lowComments[seed];
}

interface Result {
  name1: string;
  name2: string;
  score: number;
  type: string;
  description: string;
  emoji: string;
  color: string;
  comment: string;
}

export function NameCompatibility() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
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
        if (parsed.n1 && parsed.n2) {
          setName1(parsed.n1);
          setName2(parsed.n2);
          // 자동 계산
          const score = calculateCompatibility(parsed.n1, parsed.n2);
          const typeInfo = getCompatibilityType(score);
          setResult({
            name1: parsed.n1,
            name2: parsed.n2,
            score,
            ...typeInfo,
            comment: getRandomComment(score, parsed.n1, parsed.n2),
          });
        }
      } catch {
        // 파싱 실패 시 무시
      }
    }
  }, []);

  const getShareUrl = () => {
    if (typeof window === 'undefined' || !result) return '';
    try {
      const data = { n1: result.name1, n2: result.name2 };
      const encoded = encodeShareData(data);
      const baseUrl = window.location.href.split('#')[0];
      return `${baseUrl}#share=${encoded}`;
    } catch {
      return '';
    }
  };

  const handleCalculate = useCallback(() => {
    if (!name1.trim() || !name2.trim()) return;

    setIsAnimating(true);
    setResult(null);

    // 애니메이션 효과
    setTimeout(() => {
      const score = calculateCompatibility(name1.trim(), name2.trim());
      const typeInfo = getCompatibilityType(score);
      setResult({
        name1: name1.trim(),
        name2: name2.trim(),
        score,
        ...typeInfo,
        comment: getRandomComment(score, name1.trim(), name2.trim()),
      });
      setIsAnimating(false);
    }, 1500);
  }, [name1, name2]);

  const handleReset = () => {
    setName1('');
    setName2('');
    setResult(null);
  };

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
          이름 입력
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              첫 번째 이름
            </label>
            <input
              type="text"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              maxLength={20}
            />
          </div>

          <div className="flex justify-center">
            <span className="text-2xl">💕</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              두 번째 이름
            </label>
            <input
              type="text"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              maxLength={20}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleCalculate}
            disabled={!name1.trim() || !name2.trim() || isAnimating}
            className="flex-1"
          >
            {isAnimating ? '궁합 계산 중...' : '궁합 보기 💘'}
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
            <div className="text-4xl animate-pulse">💕</div>
            <p className="text-gray-600 dark:text-gray-400">
              {name1}님과 {name2}님의 궁합을 분석하고 있어요...
            </p>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-pink-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {result && !isAnimating && (
        <Card variant="bordered" className="p-6 overflow-hidden">
          <div className="text-center">
            <div className="text-6xl mb-4">{result.emoji}</div>

            <div className="mb-4">
              <span className="text-lg text-gray-600 dark:text-gray-400">
                {result.name1} ❤️ {result.name2}
              </span>
            </div>

            <div className="relative mb-6">
              <div className="text-7xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                {result.score}%
              </div>
            </div>

            <div className={cn('text-2xl font-bold mb-2', result.color)}>
              {result.type}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {result.description}
            </p>

            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4 mb-4">
              <p className="text-pink-700 dark:text-pink-300 text-sm">
                ✨ {result.comment}
              </p>
            </div>

            {/* 궁합 바 */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-1000"
                style={{ width: `${result.score}%` }}
              />
            </div>

            <ResultShareButtons
              url={getShareUrl()}
              title={`${result.name1} ❤️ ${result.name2} 이름 궁합`}
              description={`궁합 ${result.score}%! ${result.type} - ${result.description}`}
              visible={true}
            />
          </div>
        </Card>
      )}

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        ⚠️ 이 결과는 재미로만 봐주세요! 실제 성명학과는 관련이 없습니다.
      </div>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💕 이름 궁합이란?
        </h2>
        <p className="text-sm leading-relaxed">
          두 사람의 이름 획수를 분석하여 궁합 점수를 계산하는 재미 도구입니다.
          한글과 영문 이름 모두 지원하며, 같은 이름 조합은 항상 동일한 결과가 나와서 친구와 공유하기 좋습니다.
          친구, 연인, 가족, 동료 이름으로 재미삼아 테스트해보세요.
          천생연분부터 미스터리 궁합까지 다양한 결과가 나옵니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💗 궁합 등급 안내
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">점수</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">유형</th>
                <th className="text-left py-2 font-semibold text-gray-900 dark:text-white">의미</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">90-99%</td>
                <td className="py-2 pr-4">💕 천생연분</td>
                <td className="py-2">운명적인 만남!</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">80-89%</td>
                <td className="py-2 pr-4">💑 환상의 짝꿍</td>
                <td className="py-2">최고의 파트너</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">70-79%</td>
                <td className="py-2 pr-4">💝 좋은 인연</td>
                <td className="py-2">함께하면 좋은 일이 많음</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">50-69%</td>
                <td className="py-2 pr-4">💓 보통~괜찮음</td>
                <td className="py-2">노력하면 좋아질 수 있음</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">25-49%</td>
                <td className="py-2 pr-4">🔮 미스터리</td>
                <td className="py-2">의외의 조합일 수도!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 활용 팁
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>이름 순서:</strong> 순서를 바꾸면 다른 결과가 나올 수 있어요</li>
          <li><strong>별명 사용:</strong> 실명 대신 별명이나 닉네임도 가능해요</li>
          <li><strong>결과 공유:</strong> 친구에게 링크로 결과를 공유해 보세요</li>
          <li><strong>여러 번 시도:</strong> 다양한 조합으로 재미있게 테스트해 보세요</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '궁합 점수는 어떻게 계산되나요?', answer: '이름의 획수를 기반으로 해시 함수를 사용해 점수를 계산합니다. 같은 이름 조합은 항상 같은 점수가 나옵니다.' },
          { question: '실제 궁합과 관련이 있나요?', answer: '아니요, 이 도구는 순수하게 재미를 위한 것입니다. 실제 성명학이나 관계 궁합과는 관련이 없습니다.' },
          { question: '이름 순서를 바꾸면 결과가 달라지나요?', answer: '네, 순서에 따라 다른 결과가 나올 수 있습니다. 두 가지 순서로 다 해보세요!' },
        ]}
      />
    </div>
  );
}
