'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';
import { cn } from '@/lib/utils/cn';
import { siteConfig } from '@/data/site';

// ========================================
// 사주 계산 로직 (기존 SajuCompatibility에서 가져옴)
// ========================================

const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;
const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;

const CHEONGAN_OHANG: Record<string, string> = {
  갑: '목', 을: '목', 병: '화', 정: '화', 무: '토',
  기: '토', 경: '금', 신: '금', 임: '수', 계: '수',
};
const CHEONGAN_EUMYANG: Record<string, string> = {
  갑: '양', 을: '음', 병: '양', 정: '음', 무: '양',
  기: '음', 경: '양', 신: '음', 임: '양', 계: '음',
};
const JIJI_OHANG: Record<string, string> = {
  자: '수', 축: '토', 인: '목', 묘: '목', 진: '토', 사: '화',
  오: '화', 미: '토', 신: '금', 유: '금', 술: '토', 해: '수',
};
const JIJI_ANIMAL: Record<string, string> = {
  자: '쥐', 축: '소', 인: '호랑이', 묘: '토끼', 진: '용', 사: '뱀',
  오: '말', 미: '양', 신: '원숭이', 유: '닭', 술: '개', 해: '돼지',
};
const OHANG_BG: Record<string, string> = {
  목: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  화: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
  토: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
  금: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  수: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
};

const SOLAR_TERMS = [
  { name: '입춘', monthJi: 2 }, { name: '경칩', monthJi: 3 },
  { name: '청명', monthJi: 4 }, { name: '입하', monthJi: 5 },
  { name: '망종', monthJi: 6 }, { name: '소서', monthJi: 7 },
  { name: '입추', monthJi: 8 }, { name: '백로', monthJi: 9 },
  { name: '한로', monthJi: 10 }, { name: '입동', monthJi: 11 },
  { name: '대설', monthJi: 0 }, { name: '소한', monthJi: 1 },
];

interface Saju {
  year: { gan: string; ji: string };
  month: { gan: string; ji: string };
  day: { gan: string; ji: string };
}

function getSolarTermDate(year: number, termIndex: number): Date {
  const baseDates2000 = [
    new Date(2000, 1, 4, 0), new Date(2000, 2, 5, 0), new Date(2000, 3, 4, 0),
    new Date(2000, 4, 5, 0), new Date(2000, 5, 5, 0), new Date(2000, 6, 7, 0),
    new Date(2000, 7, 7, 0), new Date(2000, 8, 7, 0), new Date(2000, 9, 8, 0),
    new Date(2000, 10, 7, 0), new Date(2000, 11, 7, 0), new Date(2001, 0, 5, 0),
  ];
  const baseDate = baseDates2000[termIndex];
  const yearDiff = year - 2000;
  const msPerYear = 365.2422 * 24 * 60 * 60 * 1000;
  const result = new Date(baseDate.getTime() + yearDiff * msPerYear);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getYearPillar(year: number, month: number, day: number) {
  const birthDate = new Date(year, month - 1, day);
  const ipchun = getSolarTermDate(year, 0);
  const effectiveYear = birthDate < ipchun ? year - 1 : year;
  const diff = effectiveYear - 1984;
  return { gan: CHEONGAN[((diff % 10) + 10) % 10], ji: JIJI[((diff % 12) + 12) % 12] };
}

function getMonthPillar(year: number, month: number, day: number) {
  const targetDate = new Date(year, month - 1, day);
  const terms: { date: Date; monthJi: number }[] = [];
  terms.push({ date: getSolarTermDate(year - 1, 10), monthJi: 0 });
  terms.push({ date: getSolarTermDate(year - 1, 11), monthJi: 1 });
  for (let i = 0; i <= 10; i++) terms.push({ date: getSolarTermDate(year, i), monthJi: SOLAR_TERMS[i].monthJi });
  terms.push({ date: getSolarTermDate(year, 11), monthJi: 1 });
  terms.sort((a, b) => a.date.getTime() - b.date.getTime());
  let monthJiIndex = 0;
  for (let i = terms.length - 1; i >= 0; i--) {
    if (targetDate >= terms[i].date) { monthJiIndex = terms[i].monthJi; break; }
  }
  const yearGanIndex = (CHEONGAN as readonly string[]).indexOf(getYearPillar(year, month, day).gan);
  const monthGanBase = [2, 4, 6, 8, 0];
  const ganIndex = (monthGanBase[yearGanIndex % 5] + ((monthJiIndex - 2 + 12) % 12)) % 10;
  return { gan: CHEONGAN[ganIndex], ji: JIJI[monthJiIndex] };
}

function getDayPillar(year: number, month: number, day: number) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const sexagenary = ((jdn - 11) % 60 + 60) % 60;
  return { gan: CHEONGAN[sexagenary % 10], ji: JIJI[sexagenary % 12] };
}

function calculateSaju(year: number, month: number, day: number): Saju {
  return { year: getYearPillar(year, month, day), month: getMonthPillar(year, month, day), day: getDayPillar(year, month, day) };
}

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

// 육합/삼합/상충/형
const YUKAP: Record<string, string> = { 자: '축', 축: '자', 인: '해', 해: '인', 묘: '술', 술: '묘', 진: '유', 유: '진', 사: '신', 신: '사', 오: '미', 미: '오' };
const SAMHAP: Record<string, string[]> = { 자: ['자', '진', '신'], 축: ['축', '사', '유'], 인: ['인', '오', '술'], 묘: ['묘', '미', '해'], 진: ['자', '진', '신'], 사: ['축', '사', '유'], 오: ['인', '오', '술'], 미: ['묘', '미', '해'], 신: ['자', '진', '신'], 유: ['축', '사', '유'], 술: ['인', '오', '술'], 해: ['묘', '미', '해'] };
const SANGCHUNG: Record<string, string> = { 자: '오', 오: '자', 축: '미', 미: '축', 인: '신', 신: '인', 묘: '유', 유: '묘', 진: '술', 술: '진', 사: '해', 해: '사' };

// 띠별 1:1 코멘트 생성
function getPairComment(animal1: string, animal2: string, score: number): string {
  if (score >= 85) {
    const comments: Record<string, string> = {
      '쥐소': '꼼꼼한 쥐와 묵직한 소가 만나면 서로 빈 곳을 채워주는 찰떡 조합',
      '호랑이돼지': '용감한 호랑이와 넉넉한 돼지, 서로에게 힘이 되는 든든한 사이',
      '토끼개': '센스 있는 토끼와 의리의 개, 말 안 해도 통하는 관계',
      '용닭': '큰 그림의 용과 완벽주의 닭, 함께하면 대단한 결과물이 나오는 조합',
      '뱀원숭이': '직감의 뱀과 재치의 원숭이, 함께하면 어떤 문제도 풀어내는 브레인팀',
      '말양': '열정의 말과 포근한 양, 에너지가 자연스럽게 순환하는 시너지 조합',
    };
    const key1 = `${animal1}${animal2}`;
    const key2 = `${animal2}${animal1}`;
    return comments[key1] || comments[key2] || `${animal1}와 ${animal2}의 기운이 환상적으로 맞아떨어지는 조합`;
  }
  if (score >= 70) return `${animal1}와 ${animal2}, 서로 다른 매력이 오히려 좋은 케미를 만드는 사이`;
  if (score >= 55) return `${animal1}와 ${animal2}, 특별히 충돌은 없지만 서로 더 알아가면 좋아질 관계`;
  if (score >= 40) return `${animal1}와 ${animal2}, 의견 충돌이 있을 수 있지만 그만큼 성장하는 관계`;
  return `${animal1}와 ${animal2}, 정반대 성향이라 이해하려는 노력이 필요한 사이`;
}

// 오행 기반 역할 분류
function getOhangRole(ohang: Record<string, number>): { role: string; desc: string } {
  const sorted = Object.entries(ohang).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0][0];
  const roles: Record<string, { role: string; desc: string }> = {
    목: { role: '기획자', desc: '새로운 아이디어와 시작을 이끄는 타입' },
    화: { role: '분위기 메이커', desc: '열정과 에너지로 팀에 활기를 불어넣는 타입' },
    토: { role: '조율자', desc: '팀의 균형을 잡고 갈등을 중재하는 안정형 타입' },
    금: { role: '실행가', desc: '결정하면 바로 실행하는 추진력의 타입' },
    수: { role: '참모', desc: '깊은 사고와 분석으로 전략을 세우는 타입' },
  };
  return roles[dominant] || { role: '만능', desc: '다방면에 고른 능력의 타입' };
}

// 팀 오행 코멘트
function getTeamOhangComment(ohang: Record<string, number>): string {
  const total = Object.values(ohang).reduce((s, v) => s + v, 0);
  const sorted = Object.entries(ohang).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0];
  const missing = sorted.filter(([_, v]) => v === 0).map(([k]) => k);

  const dominantComments: Record<string, string> = {
    목: '목 기운이 강해서 창의적이고 추진력 있는 팀. 새로운 시도를 잘하지만 마무리에 신경 쓸 것',
    화: '화 기운이 강해서 열정 넘치고 분위기 좋은 팀. 가끔 과열되면 쉬어가는 여유 필요',
    토: '토 기운이 강해서 안정적이고 현실 감각 좋은 팀. 변화에 소극적일 수 있으니 도전 목표 설정 추천',
    금: '금 기운이 강해서 실행력과 결단력이 뛰어난 팀. 유연성이 부족할 수 있으니 의견 수렴 중요',
    수: '수 기운이 강해서 분석력과 전략이 뛰어난 팀. 실행이 느릴 수 있으니 데드라인 설정 추천',
  };

  let comment = dominantComments[dominant[0]] || '균형 잡힌 팀';
  if (missing.length > 0) {
    const missingNames: Record<string, string> = { 목: '창의성', 화: '열정', 토: '안정감', 금: '추진력', 수: '전략적 사고' };
    comment += `. ${missing.map(m => missingNames[m] || m).join(', ')}이 부족할 수 있으니 의식적으로 보완하면 좋아요`;
  }
  return comment;
}

// 오늘의 주인공 (오늘 일간 오행과 맞는 멤버)
function getTodayHighlight(members: MemberSaju[]): { lucky: MemberSaju | null; charm: MemberSaju | null; wealth: MemberSaju | null } {
  const today = new Date();
  const todaySaju = calculateSaju(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const todayOhang = CHEONGAN_OHANG[todaySaju.day.gan];
  const ohangOrder = ['목', '화', '토', '금', '수'];
  const todayIdx = ohangOrder.indexOf(todayOhang);

  // 행운: 오늘 오행과 상생(받는) 관계
  const luckyOhang = ohangOrder[(todayIdx + 4) % 5];
  // 매력운: 오늘 오행과 동일
  const charmOhang = todayOhang;
  // 재물운: 오늘 오행이 극하는 오행
  const wealthOhang = ohangOrder[(todayIdx + 2) % 5];

  const lucky = members.find(m => m.dayGanOhang === luckyOhang) || null;
  const charm = members.find(m => m.dayGanOhang === charmOhang) || null;
  const wealth = members.find(m => m.dayGanOhang === wealthOhang) || null;

  return { lucky, charm, wealth };
}

function getPairScore(ji1: string, ji2: string): { score: number; relation: string } {
  if (YUKAP[ji1] === ji2) return { score: 95, relation: '육합' };
  if (SAMHAP[ji1]?.includes(ji2)) return { score: 85, relation: '삼합' };
  if (SANGCHUNG[ji1] === ji2) return { score: 40, relation: '상충' };
  return { score: 65, relation: '보통' };
}

function getOhangRelationLabel(o1: string, o2: string): string {
  const order = ['목', '화', '토', '금', '수'];
  const i1 = order.indexOf(o1), i2 = order.indexOf(o2);
  if (i1 === i2) return '동질';
  if ((i1 + 1) % 5 === i2) return '상생';
  if ((i1 + 4) % 5 === i2) return '상생';
  if ((i1 + 2) % 5 === i2) return '상극';
  if ((i1 + 3) % 5 === i2) return '상극';
  return '무관';
}

// ========================================
// 팀 구성원 타입
// ========================================

interface Member {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
}

interface MemberSaju extends Member {
  saju: Saju;
  dayGan: string;
  dayGanOhang: string;
  animal: string;
  ohang: Record<string, number>;
}

interface PairResult {
  member1: string;
  member2: string;
  animal1: string;
  animal2: string;
  score: number;
  relation: string;
  ohangRelation: string;
  comment: string;
}

// ========================================
// 메인 컴포넌트
// ========================================

export function TeamSajuCompatibility() {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: '', birthDate: '' },
    { id: '2', name: '', birthDate: '' },
    { id: '3', name: '', birthDate: '' },
  ]);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    members: MemberSaju[];
    pairs: PairResult[];
    teamScore: number;
    teamOhang: Record<string, number>;
    teamOhangComment: string;
    bestPair: PairResult | null;
    worstPair: PairResult | null;
    todayHighlight: { lucky: MemberSaju | null; charm: MemberSaju | null; wealth: MemberSaju | null };
    roles: { name: string; role: string; desc: string }[];
  } | null>(null);

  // URL 파라미터에서 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash.includes('share=')) return;
    try {
      const encoded = hash.split('share=')[1];
      const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
      if (decoded.team) setTeamName(decoded.team);
      if (decoded.members && Array.isArray(decoded.members)) {
        setMembers(decoded.members.map((m: { name: string; birthDate: string }, i: number) => ({
          id: String(i + 1),
          name: m.name || '',
          birthDate: m.birthDate || '',
        })));
        // 공유 링크에서 온 경우 자동 분석 (약간 딜레이 후)
        setTimeout(() => {
          const btn = document.querySelector('[data-analyze-btn]') as HTMLButtonElement;
          if (btn && !btn.disabled) btn.click();
        }, 300);
      }
    } catch { /* ignore */ }
  }, []);

  const addMember = useCallback(() => {
    if (members.length >= 20) return;
    setMembers(prev => [...prev, { id: String(Date.now()), name: '', birthDate: '' }]);
  }, [members.length]);

  const removeMember = useCallback((id: string) => {
    if (members.length <= 2) return;
    setMembers(prev => prev.filter(m => m.id !== id));
  }, [members.length]);

  const updateMember = useCallback((id: string, field: 'name' | 'birthDate', value: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  }, []);

  const validMembers = useMemo(() => members.filter(m => m.name.trim() && m.birthDate), [members]);

  const handleAnalyze = useCallback(async () => {
    if (validMembers.length < 2) return;
    setAnalyzing(true);
    setResults(null);

    // 분석 시뮬레이션 (약간의 딜레이로 UX 개선)
    await new Promise(resolve => setTimeout(resolve, 800 + validMembers.length * 200));

    // 각 멤버 사주 계산
    const memberSajus: MemberSaju[] = validMembers.map(m => {
      const [y, mo, d] = m.birthDate.split('-').map(Number);
      const saju = calculateSaju(y, mo, d);
      return {
        ...m,
        saju,
        dayGan: saju.day.gan,
        dayGanOhang: CHEONGAN_OHANG[saju.day.gan],
        animal: JIJI_ANIMAL[saju.year.ji],
        ohang: analyzeOhang(saju),
      };
    });

    // 모든 조합 궁합 계산
    const pairs: PairResult[] = [];
    for (let i = 0; i < memberSajus.length; i++) {
      for (let j = i + 1; j < memberSajus.length; j++) {
        const m1 = memberSajus[i], m2 = memberSajus[j];
        const yearResult = getPairScore(m1.saju.year.ji, m2.saju.year.ji);
        const dayResult = getPairScore(m1.saju.day.ji, m2.saju.day.ji);
        const ohangRel = getOhangRelationLabel(m1.dayGanOhang, m2.dayGanOhang);
        let score = Math.round((yearResult.score + dayResult.score) / 2);
        if (ohangRel === '상생') score = Math.min(100, score + 10);
        if (ohangRel === '상극') score = Math.max(0, score - 10);
        pairs.push({
          member1: m1.name,
          member2: m2.name,
          animal1: m1.animal,
          animal2: m2.animal,
          score,
          relation: `${yearResult.relation}/${dayResult.relation}`,
          ohangRelation: ohangRel,
          comment: getPairComment(m1.animal, m2.animal, score),
        });
      }
    }

    // 팀 오행 합산
    const teamOhang: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    memberSajus.forEach(m => {
      Object.entries(m.ohang).forEach(([k, v]) => { teamOhang[k] += v; });
    });

    const teamScore = pairs.length > 0 ? Math.round(pairs.reduce((s, p) => s + p.score, 0) / pairs.length) : 0;
    const sorted = [...pairs].sort((a, b) => b.score - a.score);
    const roles = memberSajus.map(m => {
      const r = getOhangRole(m.ohang);
      return { name: m.name, ...r };
    });

    setResults({
      members: memberSajus,
      pairs,
      teamScore,
      teamOhang,
      teamOhangComment: getTeamOhangComment(teamOhang),
      bestPair: sorted[0] || null,
      worstPair: sorted[sorted.length - 1] || null,
      todayHighlight: getTodayHighlight(memberSajus),
      roles,
    });
    setAnalyzing(false);
  }, [validMembers]);

  const getShareUrl = useCallback(() => {
    if (!validMembers.length) return '';
    const data = {
      team: teamName.trim() || undefined,
      members: validMembers.map(m => ({ name: m.name, birthDate: m.birthDate })),
      // 결과도 포함 → 공유 받은 사람이 바로 결과 확인 가능
      ...(results ? {
        r: {
          ts: results.teamScore,
          pairs: results.pairs.map(p => ({ m1: p.member1, m2: p.member2, s: p.score, rel: p.relation, oh: p.ohangRelation })),
        },
      } : {}),
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/tools/team-saju#share=${encoded}`;
  }, [validMembers, teamName, results]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 45) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-900/20';
    if (score >= 60) return 'bg-blue-50 dark:bg-blue-900/20';
    if (score >= 45) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return 'bg-orange-50 dark:bg-orange-900/20';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return '찰떡궁합';
    if (score >= 70) return '꽤 통함';
    if (score >= 55) return '무난무난';
    if (score >= 40) return '기싸움';
    return '극과극';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 85) return '🔥';
    if (score >= 70) return '✌️';
    if (score >= 55) return '🤝';
    if (score >= 40) return '😤';
    return '💀';
  };

  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* 구성원 입력 */}
      <Card variant="bordered" className="p-5">
        {/* 팀명 입력 */}
        <div className="mb-4">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="팀 이름 (선택)"
            maxLength={20}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            구성원 ({members.length}/20)
          </h3>
          <Button
            variant="secondary"
            onClick={addMember}
            disabled={members.length >= 20}
            className="text-xs px-3 py-1"
          >
            + 추가
          </Button>
        </div>

        <div className="space-y-3">
          {members.map((member, idx) => (
            <div key={member.id} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-5 flex-shrink-0">{idx + 1}</span>
              <input
                type="text"
                value={member.name}
                onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                placeholder="이름"
                maxLength={10}
                className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <input
                type="date"
                value={member.birthDate}
                onChange={(e) => updateMember(member.id, 'birthDate', e.target.value)}
                className="w-36 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={() => removeMember(member.id)}
                disabled={members.length <= 2}
                className={cn(
                  'p-1.5 rounded-lg transition-colors flex-shrink-0',
                  members.length <= 2
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                )}
                aria-label="삭제"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={validMembers.length < 2 || analyzing}
          className="w-full mt-4"
          data-analyze-btn
        >
          {analyzing ? '분석 중...' : `팀 궁합 분석 (${validMembers.length}명)`}
        </Button>
      </Card>

      {/* 분석 중 */}
      {analyzing && (
        <Card variant="bordered" className="p-8 text-center">
          <div className="animate-pulse space-y-3">
            <p className="text-2xl">☯️</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {validMembers.length}명의 사주를 분석하고 있습니다...
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {validMembers.length * (validMembers.length - 1) / 2}개 조합 계산 중
            </p>
          </div>
        </Card>
      )}

      {/* 결과 */}
      {results && !analyzing && (
        <>
          {/* 팀 종합 점수 */}
          <Card variant="bordered" className="p-5">
            <div className="text-center mb-4">
              {teamName.trim() && (
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{teamName.trim()}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">팀 궁합 점수</p>
              <p className={cn('text-5xl font-bold', getScoreColor(results.teamScore))}>
                {results.teamScore}
              </p>
              <p className={cn('text-sm font-medium mt-1', getScoreColor(results.teamScore))}>
                {results.teamScore >= 85 ? '이 팀 해체하면 안 됩니다' :
                 results.teamScore >= 75 ? '눈빛만 봐도 통하는 사이' :
                 results.teamScore >= 65 ? '꽤 괜찮은 조합이에요' :
                 results.teamScore >= 55 ? '노력하면 잘 맞을 수 있어요' :
                 results.teamScore >= 45 ? '서로 좀 더 알아가야 해요' :
                 '팀빌딩이 시급합니다...'}
              </p>
            </div>

            {/* 팀 오행 분포 */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">팀 오행 분포</p>
              <div className="flex gap-1.5 justify-center">
                {Object.entries(results.teamOhang).map(([ohang, count]) => (
                  <div key={ohang} className={cn('px-3 py-2 rounded-lg text-center text-xs font-medium', OHANG_BG[ohang])}>
                    <p className="font-bold text-sm">{ohang}</p>
                    <p>{count}</p>
                  </div>
                ))}
              </div>
              {Object.entries(results.teamOhang).some(([_, v]) => v === 0) && (
                <p className="text-xs text-amber-600 dark:text-amber-400 text-center mt-2">
                  ⚠️ 부족한 오행: {Object.entries(results.teamOhang).filter(([_, v]) => v === 0).map(([k]) => k).join(', ')}
                </p>
              )}
              {/* 팀 오행 코멘트 */}
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3 leading-relaxed">
                {results.teamOhangComment}
              </p>
            </div>
          </Card>

          {/* 오늘의 주인공 */}
          {(results.todayHighlight.lucky || results.todayHighlight.charm || results.todayHighlight.wealth) && (
            <Card variant="bordered" className="p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                오늘의 주인공 · {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {results.todayHighlight.lucky && (
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-lg mb-1">🍀</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">행운</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{results.todayHighlight.lucky.name}</p>
                  </div>
                )}
                {results.todayHighlight.charm && (
                  <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                    <p className="text-lg mb-1">💖</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">매력운</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{results.todayHighlight.charm.name}</p>
                  </div>
                )}
                {results.todayHighlight.wealth && (
                  <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <p className="text-lg mb-1">💰</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">재물운</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{results.todayHighlight.wealth.name}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* 팀원 역할 */}
          <Card variant="bordered" className="p-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">오행 기반 팀 역할</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {results.roles.map((r, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{r.name}</p>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">{r.role}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{r.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 베스트/워스트 조합 */}
          {results.bestPair && results.worstPair && results.pairs.length > 1 && (
            <div className="grid grid-cols-2 gap-3">
              <Card variant="bordered" className="p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">베스트 조합 🏆</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {results.bestPair.member1} & {results.bestPair.member2}
                </p>
                <p className={cn('text-lg font-bold', getScoreColor(results.bestPair.score))}>
                  {results.bestPair.score}점
                </p>
              </Card>
              <Card variant="bordered" className="p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">주의 조합 ⚡</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {results.worstPair.member1} & {results.worstPair.member2}
                </p>
                <p className={cn('text-lg font-bold', getScoreColor(results.worstPair.score))}>
                  {results.worstPair.score}점
                </p>
              </Card>
            </div>
          )}

          {/* 구성원 정보 — 클릭하면 상세 궁합 */}
          <Card variant="bordered" className="p-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              구성원 {selectedMember ? `— ${selectedMember}의 궁합` : '(클릭하면 상세 궁합)'}
            </h3>
            <div className="grid gap-2">
              {results.members.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMember(selectedMember === m.name ? null : m.name)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg text-sm text-left transition-all w-full',
                    selectedMember === m.name
                      ? 'bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-300 dark:ring-blue-700'
                      : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <span className="font-semibold text-gray-900 dark:text-white w-16 truncate">{m.name}</span>
                  <span className={cn('px-2 py-0.5 rounded text-xs font-medium', OHANG_BG[m.dayGanOhang])}>
                    {m.dayGan}({m.dayGanOhang})
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">{m.animal}띠</span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs ml-auto">
                    {m.saju.year.gan}{m.saju.year.ji} {m.saju.month.gan}{m.saju.month.ji} {m.saju.day.gan}{m.saju.day.ji}
                  </span>
                </button>
              ))}
            </div>

            {/* 선택된 멤버의 1:1 궁합 상세 */}
            {selectedMember && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {selectedMember} vs 다른 팀원
                </p>
                {results.pairs
                  .filter(p => p.member1 === selectedMember || p.member2 === selectedMember)
                  .sort((a, b) => b.score - a.score)
                  .map((pair, i) => {
                    const other = pair.member1 === selectedMember ? pair.member2 : pair.member1;
                    return (
                      <div key={i} className={cn('p-3 rounded-xl', getScoreBg(pair.score))}>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getScoreEmoji(pair.score)}</span>
                          <span className="font-medium text-gray-900 dark:text-white flex-1">{other}</span>
                          <span className={cn('text-sm font-bold', getScoreColor(pair.score))}>{pair.score}점</span>
                          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getScoreBg(pair.score), getScoreColor(pair.score))}>
                            {getScoreLabel(pair.score)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 ml-8">
                          {pair.comment}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </Card>

          {/* 전체 조합 표 */}
          <Card variant="bordered" className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                조합별 궁합 ({results.pairs.length}개)
              </h3>
              <CopyButton
                text={`팀 사주 궁합 결과\n팀 점수: ${results.teamScore}점\n\n${results.pairs.map(p => `${p.member1} & ${p.member2}: ${p.score}점 (${p.relation})`).join('\n')}`}
                label="복사"
              />
            </div>
            <div className="space-y-2">
              {[...results.pairs].sort((a, b) => b.score - a.score).map((pair, i) => (
                <div key={i} className={cn('flex items-center gap-2 sm:gap-3 p-3 rounded-lg text-sm', getScoreBg(pair.score))}>
                  <span className="text-base flex-shrink-0">{getScoreEmoji(pair.score)}</span>
                  <span className="font-medium text-gray-900 dark:text-white flex-1 min-w-0 truncate">
                    {pair.member1} & {pair.member2}
                  </span>
                  <span className={cn('font-bold flex-shrink-0', getScoreColor(pair.score))}>
                    {pair.score}
                  </span>
                  <span className={cn('text-xs font-medium flex-shrink-0 hidden sm:inline', getScoreColor(pair.score))}>
                    {getScoreLabel(pair.score)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* 공유 + 새로 만들기 */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <CopyButton text={getShareUrl()} label="모임 공유하기 🔗" />
            <Button
              variant="secondary"
              onClick={() => {
                setResults(null);
                setMembers([
                  { id: String(Date.now()), name: '', birthDate: '' },
                  { id: String(Date.now() + 1), name: '', birthDate: '' },
                  { id: String(Date.now() + 2), name: '', birthDate: '' },
                ]);
                setTeamName('');
                setSelectedMember(null);
                window.history.replaceState(null, '', window.location.pathname);
              }}
            >
              새로 만들기
            </Button>
          </div>
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
          팀 사주 궁합이란?
        </h2>
        <p className="text-sm leading-relaxed">
          팀 사주 궁합은 여러 명의 사주를 한번에 분석하여 팀 내 모든 조합의 궁합을 확인하는 도구입니다.
          최대 20명까지 참여할 수 있으며, 각 구성원의 일간 오행, 띠, 사주 정보를 바탕으로
          모든 1:1 조합의 궁합 점수를 계산합니다. 팀 전체의 오행 균형도 함께 확인할 수 있어
          조별 과제, 프로젝트 팀, 동아리, 회사 팀 구성 등에서 재미로 활용할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          분석 방법
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>년주 궁합</strong>: 띠(12지신) 간의 육합, 삼합, 상충 관계를 분석합니다.</li>
          <li><strong>일주 궁합</strong>: 일지(日支) 간의 합/충 관계로 실제 성격 궁합을 봅니다.</li>
          <li><strong>오행 관계</strong>: 일간의 오행이 상생인지 상극인지 판단합니다.</li>
          <li><strong>팀 오행 균형</strong>: 팀 전체의 오행 분포를 합산하여 부족한 기운을 알려줍니다.</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '최대 몇 명까지 분석할 수 있나요?', answer: '최대 20명까지 분석 가능합니다. 20명이면 190개의 1:1 조합이 계산됩니다.' },
          { question: '공유 링크로 다른 사람도 볼 수 있나요?', answer: '네, 공유 링크에 구성원 정보가 포함되어 있어 링크를 받은 사람도 같은 결과를 볼 수 있습니다.' },
          { question: '사주 궁합 결과를 실제로 믿어도 되나요?', answer: '재미와 오락 목적의 도구입니다. 실제 팀 구성은 능력, 성격, 경험 등을 종합적으로 고려하세요.' },
        ]}
      />
    </div>
  );
}
