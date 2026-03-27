'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';

// 메이저 아르카나 22장
const TAROT_CARDS = [
  {
    id: 0,
    name: '바보',
    nameEn: 'The Fool',
    emoji: '🃏',
    upright: '새로운 시작, 순수함, 자유로운 정신, 모험',
    reversed: '무모함, 두려움, 방향 상실',
    advice: {
      upright: '두려워하지 말고 새로운 시작을 받아들이세요. 오늘은 순수한 마음으로 도전할 때입니다.',
      reversed: '결정하기 전에 한 번 더 생각해보세요. 준비 없는 행동은 위험할 수 있습니다.',
    },
  },
  {
    id: 1,
    name: '마법사',
    nameEn: 'The Magician',
    emoji: '🎩',
    upright: '창조력, 의지력, 기술, 자원 활용',
    reversed: '조작, 속임, 재능 낭비',
    advice: {
      upright: '당신은 원하는 것을 이룰 수 있는 모든 도구를 가지고 있습니다. 자신감을 가지세요.',
      reversed: '겉으로 보이는 것에 현혹되지 마세요. 본질을 파악하는 것이 중요합니다.',
    },
  },
  {
    id: 2,
    name: '여사제',
    nameEn: 'The High Priestess',
    emoji: '🌙',
    upright: '직관, 신비, 내면의 지혜, 잠재의식',
    reversed: '비밀, 숨겨진 동기, 직관 무시',
    advice: {
      upright: '내면의 목소리에 귀 기울이세요. 직관이 당신을 올바른 길로 인도할 것입니다.',
      reversed: '숨기고 있는 것이 있다면 정직하게 마주할 때입니다.',
    },
  },
  {
    id: 3,
    name: '여황제',
    nameEn: 'The Empress',
    emoji: '👑',
    upright: '풍요, 자연, 모성, 창조',
    reversed: '의존성, 창조력 고갈, 소홀함',
    advice: {
      upright: '주변 사람들에게 따뜻함을 나누세요. 사랑이 풍요를 가져옵니다.',
      reversed: '자기 자신을 먼저 돌보세요. 지치면 나눌 것도 없습니다.',
    },
  },
  {
    id: 4,
    name: '황제',
    nameEn: 'The Emperor',
    emoji: '🦁',
    upright: '권위, 구조, 리더십, 안정',
    reversed: '독재, 경직, 통제욕',
    advice: {
      upright: '체계적으로 계획하고 실행하세요. 질서가 성공의 기반입니다.',
      reversed: '유연함이 필요합니다. 모든 것을 통제하려 하지 마세요.',
    },
  },
  {
    id: 5,
    name: '교황',
    nameEn: 'The Hierophant',
    emoji: '📿',
    upright: '전통, 가르침, 신념, 순응',
    reversed: '반항, 파격, 새로운 접근',
    advice: {
      upright: '경험 많은 사람의 조언을 구하세요. 검증된 방법이 도움이 됩니다.',
      reversed: '때로는 관습을 벗어나는 것이 필요합니다. 자신만의 길을 찾으세요.',
    },
  },
  {
    id: 6,
    name: '연인',
    nameEn: 'The Lovers',
    emoji: '💑',
    upright: '사랑, 조화, 선택, 가치관',
    reversed: '불균형, 갈등, 잘못된 선택',
    advice: {
      upright: '마음이 이끄는 대로 선택하세요. 진정한 연결이 기다리고 있습니다.',
      reversed: '관계에서 솔직한 대화가 필요합니다. 회피하지 마세요.',
    },
  },
  {
    id: 7,
    name: '전차',
    nameEn: 'The Chariot',
    emoji: '🏎️',
    upright: '승리, 의지, 결단력, 전진',
    reversed: '방향 상실, 공격성, 좌절',
    advice: {
      upright: '목표를 향해 강하게 나아가세요. 승리가 가까이 있습니다.',
      reversed: '잠시 멈추고 방향을 점검하세요. 올바른 길인지 확인이 필요합니다.',
    },
  },
  {
    id: 8,
    name: '힘',
    nameEn: 'Strength',
    emoji: '🦋',
    upright: '용기, 인내, 내면의 힘, 연민',
    reversed: '자기 의심, 약함, 통제 부족',
    advice: {
      upright: '부드러운 힘이 진정한 강함입니다. 인내심을 가지고 대하세요.',
      reversed: '자신을 믿으세요. 당신은 생각보다 강합니다.',
    },
  },
  {
    id: 9,
    name: '은둔자',
    nameEn: 'The Hermit',
    emoji: '🏔️',
    upright: '성찰, 내면 탐구, 고독, 지혜',
    reversed: '고립, 외로움, 현실 도피',
    advice: {
      upright: '혼자만의 시간이 필요합니다. 내면의 답을 찾아보세요.',
      reversed: '너무 오래 혼자 있지 마세요. 다른 사람들과의 연결도 중요합니다.',
    },
  },
  {
    id: 10,
    name: '운명의 수레바퀴',
    nameEn: 'Wheel of Fortune',
    emoji: '🎡',
    upright: '행운, 변화, 순환, 운명',
    reversed: '불운, 저항, 통제 불능',
    advice: {
      upright: '변화를 받아들이세요. 운명의 흐름에 올라타면 좋은 일이 생깁니다.',
      reversed: '지금은 힘든 시기지만 이것도 지나갑니다. 인내하세요.',
    },
  },
  {
    id: 11,
    name: '정의',
    nameEn: 'Justice',
    emoji: '⚖️',
    upright: '공정, 진실, 인과응보, 균형',
    reversed: '불공정, 부정직, 책임 회피',
    advice: {
      upright: '정직하게 행동하세요. 진실은 반드시 드러납니다.',
      reversed: '책임을 회피하지 마세요. 결과는 행동에서 비롯됩니다.',
    },
  },
  {
    id: 12,
    name: '매달린 사람',
    nameEn: 'The Hanged Man',
    emoji: '🙃',
    upright: '희생, 새로운 관점, 휴식, 기다림',
    reversed: '지연, 저항, 무의미한 희생',
    advice: {
      upright: '다른 시각에서 상황을 바라보세요. 멈춤이 때로는 해답입니다.',
      reversed: '더 이상 기다리지 마세요. 행동할 때입니다.',
    },
  },
  {
    id: 13,
    name: '죽음',
    nameEn: 'Death',
    emoji: '🦋',
    upright: '끝과 시작, 변화, 변신, 전환',
    reversed: '변화 저항, 정체, 집착',
    advice: {
      upright: '오래된 것을 놓아주세요. 끝은 새로운 시작을 의미합니다.',
      reversed: '변화를 두려워하지 마세요. 집착이 성장을 막고 있습니다.',
    },
  },
  {
    id: 14,
    name: '절제',
    nameEn: 'Temperance',
    emoji: '🌈',
    upright: '균형, 절제, 인내, 조화',
    reversed: '극단, 불균형, 과잉',
    advice: {
      upright: '균형을 유지하세요. 중용이 가장 좋은 길입니다.',
      reversed: '극단적인 선택을 피하세요. 균형점을 찾아야 합니다.',
    },
  },
  {
    id: 15,
    name: '악마',
    nameEn: 'The Devil',
    emoji: '⛓️',
    upright: '속박, 중독, 물질주의, 그림자',
    reversed: '해방, 깨달음, 속박 벗기',
    advice: {
      upright: '당신을 묶고 있는 것이 무엇인지 인식하세요. 알아야 벗어날 수 있습니다.',
      reversed: '드디어 자유로워질 준비가 되었습니다. 용기를 내세요.',
    },
  },
  {
    id: 16,
    name: '탑',
    nameEn: 'The Tower',
    emoji: '🗼',
    upright: '급격한 변화, 붕괴, 깨달음, 해방',
    reversed: '변화 회피, 재난 모면, 두려움',
    advice: {
      upright: '충격적인 변화가 와도 괜찮습니다. 이것은 더 나은 것을 위한 것입니다.',
      reversed: '피할 수 없는 변화가 있습니다. 준비하세요.',
    },
  },
  {
    id: 17,
    name: '별',
    nameEn: 'The Star',
    emoji: '⭐',
    upright: '희망, 영감, 치유, 평화',
    reversed: '절망, 불신, 희망 상실',
    advice: {
      upright: '희망을 잃지 마세요. 밤이 깊을수록 별이 빛납니다.',
      reversed: '작은 것에서 희망을 찾으세요. 빛은 분명히 있습니다.',
    },
  },
  {
    id: 18,
    name: '달',
    nameEn: 'The Moon',
    emoji: '🌕',
    upright: '환상, 무의식, 직관, 두려움',
    reversed: '혼란 해소, 진실 발견, 불안 극복',
    advice: {
      upright: '보이는 것이 전부가 아닙니다. 직관을 믿고 천천히 나아가세요.',
      reversed: '안개가 걷히고 있습니다. 진실이 드러날 것입니다.',
    },
  },
  {
    id: 19,
    name: '태양',
    nameEn: 'The Sun',
    emoji: '☀️',
    upright: '성공, 기쁨, 활력, 긍정',
    reversed: '우울, 비관, 자신감 부족',
    advice: {
      upright: '축하합니다! 밝은 에너지가 당신과 함께합니다. 즐기세요.',
      reversed: '내면의 태양을 찾으세요. 당신 안에 빛이 있습니다.',
    },
  },
  {
    id: 20,
    name: '심판',
    nameEn: 'Judgement',
    emoji: '📯',
    upright: '부활, 판단, 성찰, 소명',
    reversed: '자기 의심, 판단 거부, 후회',
    advice: {
      upright: '과거를 돌아보고 배우세요. 새로운 부름에 응답할 때입니다.',
      reversed: '자신을 너무 가혹하게 판단하지 마세요. 용서가 필요합니다.',
    },
  },
  {
    id: 21,
    name: '세계',
    nameEn: 'The World',
    emoji: '🌍',
    upright: '완성, 성취, 통합, 축하',
    reversed: '미완성, 목표 미달, 지연',
    advice: {
      upright: '한 사이클이 완성됩니다. 성취를 축하하고 다음 여정을 준비하세요.',
      reversed: '조금만 더 노력하면 완성입니다. 포기하지 마세요.',
    },
  },
];

const STORAGE_KEY = 'daily-tarot-result';

interface TarotResult {
  cardId: number;
  isReversed: boolean;
  date: string;
}

export function DailyTarot() {
  const [result, setResult] = useState<TarotResult | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showCard, setShowCard] = useState(false);

  // 오늘 날짜 문자열
  const getTodayString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  // localStorage에서 결과 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TarotResult;
        if (parsed.date === getTodayString()) {
          setResult(parsed);
          setShowCard(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const drawCard = () => {
    setIsFlipping(true);
    setShowCard(false);

    setTimeout(() => {
      const cardId = Math.floor(Math.random() * TAROT_CARDS.length);
      const isReversed = Math.random() < 0.3; // 30% 확률로 역방향
      const newResult: TarotResult = {
        cardId,
        isReversed,
        date: getTodayString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newResult));
      setResult(newResult);
      setIsFlipping(false);
      setShowCard(true);
    }, 1500);
  };

  const card = result ? TAROT_CARDS[result.cardId] : null;

  const getShareUrl = () => {
    if (!result || !card) return '';
    const data = { card: card.name, reversed: result.isReversed };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/tools/daily-tarot#share=${encoded}`;
  };

  const canDraw = !result || result.date !== getTodayString();

  return (
    <div className="space-y-2">
      {/* 카드 영역 */}
      <Card variant="bordered" className="p-6 text-center">
        {!showCard && !isFlipping && canDraw && (
          <div className="py-8">
            <div className="text-6xl mb-4">🔮</div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              오늘의 타로 카드를 뽑아보세요
            </p>
            <Button onClick={drawCard} size="lg" className="px-8">
              카드 뽑기
            </Button>
          </div>
        )}

        {isFlipping && (
          <div className="py-8">
            <div className="relative h-24 flex items-center justify-center mb-4">
              {/* 타로카드 뒷면 스타일 */}
              <div className="absolute w-12 h-18 animate-[shuffle1_1.5s_ease-in-out_infinite]">
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-lg border-2 border-yellow-400 shadow-lg flex items-center justify-center">
                  <div className="text-yellow-300 text-xl">✦</div>
                </div>
              </div>
              <div className="absolute w-12 h-18 animate-[shuffle2_1.5s_ease-in-out_infinite]">
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-lg border-2 border-yellow-400 shadow-lg flex items-center justify-center">
                  <div className="text-yellow-300 text-xl">✦</div>
                </div>
              </div>
              <div className="absolute w-12 h-18 animate-[shuffle3_1.5s_ease-in-out_infinite]">
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-lg border-2 border-yellow-400 shadow-lg flex items-center justify-center">
                  <div className="text-yellow-300 text-xl">✦</div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              카드를 섞는 중...
            </p>
            <style jsx>{`
              @keyframes shuffle1 {
                0%, 100% { transform: translateX(-30px) rotate(-5deg); }
                50% { transform: translateX(30px) rotate(5deg); }
              }
              @keyframes shuffle2 {
                0%, 100% { transform: translateX(0) rotate(0deg) scale(1.1); }
                25% { transform: translateX(-20px) rotate(-3deg) scale(1); }
                75% { transform: translateX(20px) rotate(3deg) scale(1); }
              }
              @keyframes shuffle3 {
                0%, 100% { transform: translateX(30px) rotate(5deg); }
                50% { transform: translateX(-30px) rotate(-5deg); }
              }
            `}</style>
          </div>
        )}

        {showCard && card && (
          <div className="py-4 space-y-4">
            {/* 카드 */}
            <div
              className={`inline-block p-6 rounded-xl bg-gradient-to-b from-purple-500 to-indigo-600 text-white ${
                result?.isReversed ? 'rotate-180' : ''
              }`}
              style={{ minWidth: '150px' }}
            >
              <div className={`text-5xl mb-2 ${result?.isReversed ? 'rotate-180' : ''}`}>
                {card.emoji}
              </div>
              <div className={`text-lg font-bold ${result?.isReversed ? 'rotate-180' : ''}`}>
                {card.name}
              </div>
              <div className={`text-sm opacity-80 ${result?.isReversed ? 'rotate-180' : ''}`}>
                {card.nameEn}
              </div>
            </div>

            {/* 방향 표시 */}
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              result?.isReversed
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
            }`}>
              {result?.isReversed ? '🔄 역방향' : '✨ 정방향'}
            </div>

            {/* 키워드 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                키워드
              </p>
              <p className="text-gray-900 dark:text-white">
                {result?.isReversed ? card.reversed : card.upright}
              </p>
            </div>

            {/* 오늘의 조언 */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                💫 오늘의 조언
              </p>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {result?.isReversed ? card.advice.reversed : card.advice.upright}
              </p>
            </div>

            {/* 공유 */}
            <div className="pt-4">
              <ResultShareButtons
                url={getShareUrl()}
                title={`오늘의 타로: ${card.name} (${result?.isReversed ? '역방향' : '정방향'})`}
                description={result?.isReversed ? card.reversed : card.upright}
                visible={true}
              />
            </div>
          </div>
        )}

        {!canDraw && showCard && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              ⏰ 오늘은 이미 카드를 뽑았어요! 내일 자정에 다시 뽑을 수 있습니다.
            </p>
          </div>
        )}
      </Card>

      {/* 안내 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 하루에 한 번만 카드를 뽑을 수 있습니다</p>
        <p>• 자정(00:00)에 리셋됩니다</p>
        <p>• 재미로만 봐주세요, 실제 운세와는 관련 없습니다</p>
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
          🃏 오늘의 타로란?
        </h2>
        <p className="text-sm leading-relaxed">
          타로의 메이저 아르카나 22장 중 1장을 무작위로 뽑아 오늘의 운세와 조언을 확인하는 도구입니다.
          정방향과 역방향에 따라 다른 키워드와 조언을 제공합니다.
          하루 1회만 뽑을 수 있어서 매일 아침 오늘의 방향성을 잡아보는 용도로 활용해 보세요.
          자정에 리셋되니 내일 다시 새 카드를 만나보세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔮 메이저 아르카나 대표 카드
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">카드</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">정방향</th>
                <th className="text-left py-2 font-semibold text-gray-900 dark:text-white">역방향</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">🌟 바보</td>
                <td className="py-2 pr-4">새 시작, 순수함</td>
                <td className="py-2">무모함, 주의 필요</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">✨ 마법사</td>
                <td className="py-2 pr-4">창조력, 실행력</td>
                <td className="py-2">미숙함, 속임</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">🌙 고위 여사제</td>
                <td className="py-2 pr-4">직관, 내면의 지혜</td>
                <td className="py-2">비밀, 혼란</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">☀️ 태양</td>
                <td className="py-2 pr-4">성공, 기쁨, 활력</td>
                <td className="py-2">낙관 과다, 지연</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">🌍 세계</td>
                <td className="py-2 pr-4">완성, 성취</td>
                <td className="py-2">미완성, 지체</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          * 전체 22장의 메이저 아르카나 카드가 포함되어 있습니다
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 활용 팁
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>아침 루틴:</strong> 하루 시작 전 오늘의 방향성 체크</li>
          <li><strong>조언 활용:</strong> 카드의 조언을 오늘 마음에 새기기</li>
          <li><strong>공유하기:</strong> 재미있는 결과는 친구와 공유</li>
          <li><strong>기록하기:</strong> 어떤 카드가 나왔는지 스크린샷 저장</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '왜 하루에 한 번만 뽑을 수 있나요?', answer: '전통 타로에서는 하루 한 번 뽑는 것이 일반적입니다. 같은 질문을 반복하면 의미가 흐려지기 때문에 하루 1회로 제한했습니다.' },
          { question: '정방향/역방향은 어떻게 결정되나요?', answer: '완전히 랜덤으로 결정됩니다. 각 50%의 확률로 정방향 또는 역방향이 나옵니다.' },
          { question: '타로 결과를 진지하게 받아들여야 하나요?', answer: '재미로만 봐주세요! 이 도구는 오락 목적이며, 실제 운세나 미래를 예측하는 것이 아닙니다.' },
        ]}
      />
    </div>
  );
}
