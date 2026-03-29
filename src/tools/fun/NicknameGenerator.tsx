'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

// ========================================
// 타입 정의
// ========================================

type NicknameStyle = 'emotional' | 'strong' | 'cute' | 'neutral' | 'gaming' | 'funny';
type LengthMode = 'exact' | 'max';

interface StyleConfig {
  name: string;
  description: string;
  // 1글자
  singles: string[];
  // 2글자
  doubles: string[];
  // 접두어 (1-2글자)
  prefixes: string[];
  // 어근 (1-2글자)
  roots: string[];
  // 접미어 (1글자)
  suffixes: string[];
}

// ========================================
// 확장된 단어 데이터셋
// ========================================

const STYLE_CONFIGS: Record<NicknameStyle, StyleConfig> = {
  emotional: {
    name: '감성',
    description: '잔잔하고 따뜻한 느낌',
    singles: ['빛', '별', '달', '숲', '꿈', '눈', '비', '강', '봄', '밤', '길', '솔', '온', '율', '샘', '린', '단', '찬', '윤', '하'],
    doubles: ['달빛', '안개', '노을', '새벽', '물결', '바람', '햇살', '그늘', '여운', '하늘', '별님', '꿈길', '숲속', '강물', '봄날', '밤빛', '눈꽃', '비올', '초원', '호수', '구름', '황혼', '여명', '석양', '은하', '미풍', '청풍', '이슬', '서리', '연못'],
    prefixes: ['고요', '잔잔', '포근', '나른', '차분', '맑은', '은은', '희미', '고운', '부드', '평온', '고즈', '담담', '깊은', '넓은', '푸른', '흰', '검은', '붉은', '노란', '하얀', '맑고', '고요히', '잔잔히'],
    roots: ['달빛', '안개', '노을', '새벽', '물결', '바람', '햇살', '그늘', '여운', '하늘', '별', '꿈', '숲', '길', '빛', '밤', '봄', '눈', '비', '강', '솔', '온', '율', '단', '샘', '린', '찬', '윤', '하', '서', '구름', '호수', '풀', '잎', '나무', '꽃', '산', '들', '벌', '새'],
    suffixes: ['이', '아', '님', '별', '빛', '꽃', '새', '잎', '솔', '린', '온', '율', '단', '샘', '강', '하', '서', '윤', '찬', '우', '나', '다', '라', '마', '루', '리', '로'],
  },
  strong: {
    name: '강함',
    description: '단단하고 힘있는 느낌',
    singles: ['검', '창', '철', '강', '암', '호', '룡', '웅', '걸', '진', '천', '각', '인', '술', '왕', '군', '장', '령', '석', '뿔'],
    doubles: ['바위', '불꽃', '천둥', '파도', '폭풍', '송곳', '칼날', '대지', '벼락', '용암', '강철', '철벽', '대산', '흑염', '백호', '청룡', '현무', '주작', '금강', '번개', '태풍', '지진', '화산', '빙하', '뇌전', '혈풍', '광풍', '열화', '동토', '심연'],
    prefixes: ['검은', '붉은', '거친', '날카', '단단', '굳은', '깊은', '무거', '강한', '큰', '광', '혈', '극', '초', '무', '절', '천', '만', '백', '흑', '적', '청', '금', '은', '동', '철', '강', '맹', '광', '폭'],
    roots: ['바위', '철', '불꽃', '천둥', '파도', '폭풍', '송곳', '칼날', '뿔', '갑', '대지', '산', '벼락', '용암', '강철', '검', '창', '활', '도끼', '낫', '권', '각', '인', '술', '진', '령', '혼', '마', '천', '귀', '호', '룡', '웅', '걸', '왕', '군', '장', '벽', '성', '탑'],
    suffixes: ['왕', '군', '장', '검', '령', '석', '암', '호', '룡', '단', '웅', '걸', '각', '진', '천', '인', '술', '마', '귀', '혼', '제', '황', '성', '광', '위', '력', '강', '무'],
  },
  cute: {
    name: '귀여움',
    description: '둥글고 사랑스러운 느낌',
    singles: ['콩', '달', '솜', '빵', '복', '꿀', '별', '곰', '냥', '멍', '뭉', '봉', '롱', '퐁', '핑', '밍', '딩', '룽', '붕', '퐁'],
    doubles: ['콩알', '솜사', '빵빵', '꿀벌', '별님', '곰돌', '토끼', '고양', '햄찌', '뭉치', '덩이', '방울', '구슬', '솜털', '꿀단', '복실', '몽실', '뽀송', '말랑', '촉촉', '도톰', '동글', '통통', '볼록', '포동', '보들', '몽글', '동동', '볼랑', '뽀롱'],
    prefixes: ['동글', '포동', '말랑', '몽글', '보들', '도톰', '촉촉', '동동', '통통', '볼록', '둥글', '오동', '뽀송', '폭신', '쫀득', '달달', '달콤', '상큼', '새콤', '톡톡', '졸졸', '반짝', '깜찍', '앙증', '아기', '미니', '쪼꼬', '쬬꼬', '꼬마', '아담'],
    roots: ['콩', '달', '솜', '빵', '복', '꿀', '별', '곰', '토끼', '고양', '햄찌', '뭉치', '덩이', '방울', '알', '냥', '멍', '짹', '꾹', '삐', '뿅', '띵', '짱', '뿡', '뿌', '쪼', '또', '모', '보', '포', '호', '코', '도', '노', '로', '소', '오', '우', '주', '투'],
    suffixes: ['이', '콩', '떡', '순', '롱', '봉', '뭉', '총', '핑', '밍', '링', '딩', '퐁', '룽', '붕', '냥', '멍', '야', '오', '우', '주', '쭈', '뿡', '뽀', '뿌', '쪼', '또', '모', '보'],
  },
  neutral: {
    name: '무난',
    description: '범용적이고 깔끔한 느낌',
    singles: ['빛', '별', '산', '강', '달', '해', '봄', '숲', '길', '들', '솔', '온', '율', '찬', '민', '준', '진', '현', '호', '서', '우', '윤', '린', '단', '샘'],
    doubles: ['하늘', '바다', '산들', '강물', '달빛', '햇빛', '봄날', '숲길', '들판', '초원', '별빛', '은빛', '금빛', '맑음', '고요', '평화', '자유', '희망', '행복', '사랑', '믿음', '소망', '꿈길', '빛나', '반짝', '눈빛', '마음', '바람', '구름', '이슬'],
    prefixes: ['하', '나', '다', '라', '마', '사', '아', '자', '가', '바', '파', '타', '카', '새', '참', '한', '큰', '작', '맑', '밝', '높', '깊', '넓', '좋', '푸', '흰', '검', '붉', '노', '청'],
    roots: ['늘', '빛', '솔', '별', '산', '강', '달', '숲', '봄', '들', '길', '빈', '온', '찬', '단', '린', '준', '진', '민', '현', '호', '서', '우', '윤', '하', '나', '다', '라', '마', '사', '아', '자', '가', '바', '파', '타', '카', '샘', '율', '담'],
    suffixes: ['이', '우', '오', '아', '은', '율', '온', '별', '찬', '민', '준', '진', '현', '호', '서', '하', '나', '다', '라', '마', '사', '자', '가', '바', '윤', '린', '단', '샘'],
  },
  gaming: {
    name: '게임용',
    description: '임팩트와 존재감 있는 닉네임',
    singles: ['검', '창', '활', '권', '각', '인', '술', '진', '령', '혼', '마', '천', '귀', '왕', '신', '제', '황', '성', '광', '암'],
    doubles: ['쾌속', '질풍', '섬광', '암흑', '혈풍', '극한', '초월', '광속', '폭주', '무한', '절대', '최강', '불멸', '전설', '신화', '영웅', '마왕', '용사', '암살', '저격', '난무', '폭풍', '번개', '화염', '냉기', '독안', '혈안', '광염', '암영', '흑염', '백염', '뇌신', '풍신', '염마', '빙마'],
    prefixes: ['쾌속', '질풍', '섬광', '암흑', '혈풍', '극한', '초월', '광속', '폭주', '무한', '절대', '최강', '불멸', '전설', '신화', '광', '혈', '극', '초', '무', '절', '천', '만', '백', '흑', '적', '청', '금', '은', '암', '명', '진', '성', '신', '마', '귀', '용', '호', '봉', '학'],
    roots: ['검', '창', '활', '도끼', '낫', '권', '각', '인', '술', '진', '령', '혼', '마', '천', '귀', '왕', '신', '제', '황', '성', '광', '암', '염', '빙', '뇌', '풍', '독', '혈', '사', '궁', '도', '검', '창', '총', '폭', '참', '베', '찌', '격', '쇄'],
    suffixes: ['왕', '신', '마', '귀', '령', '혼', '제', '황', '성', '천', '광', '각', '인', '술', '진', '검', '창', '도', '사', '궁', '총', '참', '격', '쇄', '무', '련', '단', '파'],
  },
  funny: {
    name: '웃긴',
    description: '진지하게 웃긴 닉네임',
    singles: ['떡', '콩', '굴', '쥐', '빵', '밥', '귤', '뻥', '훅', '팍', '꿀', '쑥', '삽', '곰', '닭', '꽝', '흡', '쿵', '탁', '펑'],
    doubles: ['참치', '고등어', '던져', '굴러', '삽질', '빵꾸', '뚝배', '두부', '양파', '감자', '호박', '오이', '콩나', '숯불', '떡볶', '짜장', '짬뽕', '탕수', '잡채', '냉면', '볶음', '튀김', '족발', '보쌈', '치킨', '피자', '햄버', '멸치', '새우', '꼬막', '조개', '미역', '다시', '우동', '라면', '만두', '김밥', '순대', '어묵', '호떡', '붕어', '옥수', '당근', '브로', '파프', '무우', '배추', '시금', '부추', '마늘', '생강', '와사', '겨자'],
    prefixes: ['던져라', '굴러라', '날아라', '뛰어라', '먹어라', '잡아라', '피해라', '막아라', '깨워라', '불러라', '참치', '두부', '양파', '감자', '호박', '광란', '폭주', '돌진', '허겁', '대충', '야생', '방금', '갑자기', '슬쩍', '몰래', '은근', '살짝', '후다닥', '느닷', '어쩌다', '실수로', '우연히', '졸린', '배고픈', '심심한', '당황한', '억울한', '분노의', '고독한', '외로운', '슬픈', '기쁜', '신난', '취한', '만취', '비몽', '몽유', '잠든', '깨어난'],
    roots: ['참치', '고등어', '삽질', '두부', '양파', '감자', '호박', '콩', '떡', '빵', '밥', '굴', '닭', '오리', '거북', '달팽', '청소', '빨래', '설거', '낮잠', '간식', '야식', '회전', '돌격', '난입', '개굴', '꿀꺽', '냠냠', '쩝쩝', '꽥꽥', '멍멍', '야옹', '삐약', '꿀벌', '무당', '멸치', '새우', '꼬막', '미역', '라면', '만두', '김밥', '순대', '어묵', '호떡', '붕어', '옥수', '당근', '배추', '마늘', '생강', '젓갈', '된장', '고추', '깍두', '총각', '열무', '비빔', '잔반', '국물', '국밥', '수육', '곱창', '대패', '항정', '갈비', '등심'],
    suffixes: ['맨', '킹', '왕', '님', '신', '짱', '떡', '빵', '꾼', '충', '러', '봇', '단', '즈', '군', '양', '장', '쟁이', '돌이', '순이', '대장', '총통', '사령', '헌터', '마스터', '슬레이어', '파괴자', '수호자', '사냥꾼', '용사'],
  },
};

// ========================================
// 유틸리티 함수
// ========================================

function getSecureRandom(max: number): number {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandom(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getKoreanLength(str: string): number {
  return str.length;
}

// 심한 욕설만 필터 (가벼운 표현은 허용)
const BAD_WORDS = [
  '시발', '씨발', '시bal', '씨bal', '개새', '병신', '지랄', '좆', '씹', '닥쳐',
  '꺼져', '죽어', '자살', '살인', '강간', '성폭', '매춘', '마약', '니미', '느금',
  '엠창', '패드', '보지', '자지', '섹스', '야동', '변태', '호구', '찐따', '장애',
];

function containsBadWord(str: string): boolean {
  const lower = str.toLowerCase();
  return BAD_WORDS.some((word) => lower.includes(word));
}

// ========================================
// 닉네임 생성 로직 (개선)
// ========================================

function generateNicknameForLength(
  style: NicknameStyle,
  targetLength: number
): string[] {
  const config = STYLE_CONFIGS[style];
  const suffixes = config.suffixes;
  const results: string[] = [];

  // 1글자
  if (targetLength === 1) {
    for (const s of config.singles) {
      results.push(s);
    }
    return shuffleArray(results).filter((n) => !containsBadWord(n));
  }

  // 2글자
  if (targetLength === 2) {
    // 단일 2글자 단어
    for (const d of config.doubles) {
      if (getKoreanLength(d) === 2) {
        results.push(d);
      }
    }
    // 1글자 + 접미어
    for (const s of config.singles) {
      for (const suf of suffixes) {
        if (getKoreanLength(suf) !== 1) continue;
        const nick = s + suf;
        results.push(nick);
      }
    }
    // 접두어(1) + 어근(1)
    for (const p of config.prefixes) {
      if (getKoreanLength(p) !== 1) continue;
      for (const r of config.roots) {
        if (getKoreanLength(r) !== 1) continue;
        const nick = p + r;
        results.push(nick);
      }
    }
    return shuffleArray([...new Set(results)]).filter((n) => !containsBadWord(n));
  }

  // 3글자
  if (targetLength === 3) {
    // 2글자 + 접미어(1)
    for (const d of config.doubles) {
      if (getKoreanLength(d) !== 2) continue;
      for (const suf of suffixes) {
        if (getKoreanLength(suf) !== 1) continue;
        const nick = d + suf;
        results.push(nick);
      }
    }
    // 접두어(1) + 2글자
    for (const p of config.prefixes) {
      if (getKoreanLength(p) !== 1) continue;
      for (const d of config.doubles) {
        if (getKoreanLength(d) !== 2) continue;
        const nick = p + d;
        results.push(nick);
      }
    }
    // 접두어(2) + 어근(1)
    for (const p of config.prefixes) {
      if (getKoreanLength(p) !== 2) continue;
      for (const r of config.roots) {
        if (getKoreanLength(r) !== 1) continue;
        const nick = p + r;
        results.push(nick);
      }
    }
    // 접두어(1) + 어근(1) + 접미어(1)
    for (const p of config.prefixes) {
      if (getKoreanLength(p) !== 1) continue;
      for (const r of config.roots) {
        if (getKoreanLength(r) !== 1) continue;
        for (const suf of suffixes) {
          if (getKoreanLength(suf) !== 1) continue;
          const nick = p + r + suf;
          results.push(nick);
        }
      }
    }
    return shuffleArray([...new Set(results)]).filter((n) => !containsBadWord(n));
  }

  // 4글자
  if (targetLength === 4) {
    // 접두어(2) + 2글자
    for (const p of config.prefixes) {
      if (getKoreanLength(p) !== 2) continue;
      for (const d of config.doubles) {
        if (getKoreanLength(d) !== 2) continue;
        const nick = p + d;
        results.push(nick);
      }
    }
    // 2글자 + 2글자
    for (const d1 of config.doubles) {
      if (getKoreanLength(d1) !== 2) continue;
      for (const d2 of config.doubles) {
        if (getKoreanLength(d2) !== 2) continue;
        if (d1 === d2) continue;
        const nick = d1 + d2;
        results.push(nick);
      }
    }
    // 접두어(2) + 어근(1) + 접미어(1)
    for (const p of config.prefixes) {
      if (getKoreanLength(p) !== 2) continue;
      for (const r of config.roots) {
        if (getKoreanLength(r) !== 1) continue;
        for (const suf of suffixes) {
          if (getKoreanLength(suf) !== 1) continue;
          const nick = p + r + suf;
          results.push(nick);
        }
      }
    }
    // 접두어(1) + 어근(2) + 접미어(1)
    for (const p of config.prefixes) {
      if (getKoreanLength(p) !== 1) continue;
      for (const r of config.roots) {
        if (getKoreanLength(r) !== 2) continue;
        for (const suf of suffixes) {
          if (getKoreanLength(suf) !== 1) continue;
          const nick = p + r + suf;
          results.push(nick);
        }
      }
    }
    return shuffleArray([...new Set(results)]).filter((n) => !containsBadWord(n));
  }

  // 5글자 이상
  if (targetLength >= 5) {
    // 접두어(2) + 2글자 + 접미어(1)
    for (const p of config.prefixes) {
      if (getKoreanLength(p) !== 2) continue;
      for (const d of config.doubles) {
        if (getKoreanLength(d) !== 2) continue;
        for (const suf of suffixes) {
          if (getKoreanLength(suf) !== 1) continue;
          const nick = p + d + suf;
          if (getKoreanLength(nick) !== targetLength) continue;
          results.push(nick);
        }
      }
    }
    // 2글자 + 2글자 + 접미어(1)
    for (const d1 of config.doubles) {
      if (getKoreanLength(d1) !== 2) continue;
      for (const d2 of config.doubles) {
        if (getKoreanLength(d2) !== 2) continue;
        if (d1 === d2) continue;
        for (const suf of suffixes) {
          if (getKoreanLength(suf) !== 1) continue;
          const nick = d1 + d2 + suf;
          if (getKoreanLength(nick) !== targetLength) continue;
          results.push(nick);
        }
      }
    }
    // 접두어(2) + 2글자 + 2글자
    if (targetLength === 6) {
      for (const p of config.prefixes) {
        if (getKoreanLength(p) !== 2) continue;
        for (const d1 of config.doubles) {
          if (getKoreanLength(d1) !== 2) continue;
          for (const d2 of config.doubles) {
            if (getKoreanLength(d2) !== 2) continue;
            if (d1 === d2) continue;
            const nick = p + d1 + d2;
            results.push(nick);
          }
        }
      }
    }
    return shuffleArray([...new Set(results)]).filter((n) => !containsBadWord(n));
  }

  return shuffleArray([...new Set(results)]).filter((n) => !containsBadWord(n));
}

// 접두어 뒤에 자연스럽게 붙는 조사
const PARTICLES = ['의'];

function generateCustomNicknames(
  style: NicknameStyle,
  count: number,
  customWord: string
): string[] {
  const config = STYLE_CONFIGS[style];
  const results: string[] = [];
  const wordLen = getKoreanLength(customWord);

  // 접두어 + 커스텀단어
  for (const p of config.prefixes) {
    results.push(p + customWord);
    // 접두어 + 조사 + 커스텀단어 (예: 광란의참치, 폭주의두부)
    for (const particle of PARTICLES) {
      results.push(p + particle + customWord);
    }
  }
  // 커스텀단어 + 접미어
  for (const suf of config.suffixes) {
    results.push(customWord + suf);
  }
  // 커스텀단어 + 2글자
  for (const d of config.doubles) {
    if (getKoreanLength(d) === 2) {
      results.push(customWord + d);
    }
  }
  // 2글자 + 커스텀단어
  for (const d of config.doubles) {
    if (getKoreanLength(d) === 2) {
      results.push(d + customWord);
    }
  }
  // 접두어 + 커스텀단어 + 접미어
  if (wordLen <= 3) {
    for (const p of config.prefixes) {
      if (getKoreanLength(p) <= 2) {
        for (const suf of config.suffixes) {
          if (getKoreanLength(suf) === 1) {
            results.push(p + customWord + suf);
          }
        }
      }
    }
  }
  // 커스텀단어 + 조사 + 어근 (예: 망고의참치)
  for (const particle of PARTICLES) {
    for (const d of config.doubles) {
      if (getKoreanLength(d) === 2) {
        results.push(customWord + particle + d);
      }
    }
  }
  // 커스텀단어 단독
  results.push(customWord);

  return shuffleArray([...new Set(results)]).filter((n) => !containsBadWord(n)).slice(0, count);
}

function generateNicknames(
  style: NicknameStyle,
  count: number,
  length: number,
  lengthMode: LengthMode,
  customWord?: string
): string[] {
  if (customWord && customWord.trim()) {
    return generateCustomNicknames(style, count, customWord.trim());
  }
  if (lengthMode === 'exact') {
    const candidates = generateNicknameForLength(style, length);
    return candidates.slice(0, count);
  } else {
    // max 모드: 2부터 length까지 모두 수집
    const allCandidates: string[] = [];
    for (let l = 2; l <= length; l++) {
      allCandidates.push(...generateNicknameForLength(style, l));
    }
    return shuffleArray([...new Set(allCandidates)]).slice(0, count);
  }
}

// ========================================
// 컴포넌트
// ========================================

export function NicknameGenerator() {
  const [style, setStyle] = useState<NicknameStyle>('gaming');
  const [count, setCount] = useState<number>(10);
  const [nicknames, setNicknames] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [customWord, setCustomWord] = useState<string>('');
  const [sharedNickname, setSharedNickname] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  // URL 해시에서 공유된 닉네임 파싱
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.includes('share=')) {
      try {
        const encoded = hash.split('share=')[1];
        const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
        if (decoded.n) {
          setSharedNickname(decoded.n);
        }
      } catch {}
    }
  }, []);

  const getShareUrl = useCallback((nickname: string) => {
    const data = { n: nickname };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
  }, []);

  const handleShareNickname = useCallback((nickname: string) => {
    navigator.clipboard.writeText(getShareUrl(nickname)).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }).catch(() => {});
  }, [getShareUrl]);

  const handleGenerate = useCallback(() => {
    const maxLen = style === 'funny' ? 6 : 4;
    const results = generateNicknames(style, count, maxLen, 'max', customWord);
    setNicknames(results);
    setSelectedIndex(null);
  }, [style, count, customWord]);

  const filteredNicknames = useMemo(() => {
    if (!filter.trim()) return nicknames;
    return nicknames.filter((n) => n.includes(filter.trim()));
  }, [nicknames, filter]);

  const allNicknamesText = useMemo(() => {
    return filteredNicknames.join('\n');
  }, [filteredNicknames]);

  return (
    <div className="space-y-2">
      {/* 공유된 닉네임 표시 */}
      {sharedNickname && (
        <Card variant="bordered" className="p-5 text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">공유받은 닉네임</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-3">🎯 {sharedNickname}</p>
          <div className="flex gap-2 justify-center">
            <CopyButton text={sharedNickname} label="복사" />
            <Button variant="secondary" size="sm" onClick={() => { setSharedNickname(null); window.history.replaceState(null, '', window.location.pathname); }}>
              직접 만들기
            </Button>
          </div>
        </Card>
      )}

      {/* 설정 패널 */}
      <Card variant="bordered" className="p-5">
        <div className="space-y-5">
          {/* 스타일 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              스타일
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(STYLE_CONFIGS) as [NicknameStyle, StyleConfig][]).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => { setStyle(key); if (key !== 'funny') setCustomWord(''); }}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                    style === key
                      ? key === 'funny'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  )}
                >
                  {config.name}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {STYLE_CONFIGS[style].description}
            </p>
          </div>

          {/* 옵션 */}
          <div className={cn('grid gap-4', style === 'funny' ? 'grid-cols-2' : 'grid-cols-1')}>
            {/* 생성 개수 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                생성 개수
              </label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              >
                <option value={10}>10개</option>
                <option value={20}>20개</option>
                <option value={50}>50개</option>
                <option value={100}>100개</option>
                <option value={200}>200개</option>
              </select>
            </div>

            {/* 내 단어 넣기 - 웃긴 테마에서만 */}
            {style === 'funny' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  내 단어 <span className="text-xs text-gray-400 font-normal">(선택)</span>
                </label>
                <input
                  type="text"
                  value={customWord}
                  onChange={(e) => setCustomWord(e.target.value)}
                  placeholder="예: 참치, 망고"
                  maxLength={6}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm placeholder-gray-400"
                />
              </div>
            )}
          </div>

          {/* 생성 버튼 */}
          <Button onClick={handleGenerate} className="w-full">
            닉네임 생성
          </Button>
        </div>
      </Card>

      {/* 결과 영역 */}
      {nicknames.length > 0 && (
        <Card variant="bordered" className="p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              생성 결과 ({filteredNicknames.length}개{filter.trim() && ` / ${nicknames.length}개 중`})
            </h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="필터 (예: 참치)"
                  className="w-full sm:w-40 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 placeholder-gray-400"
                />
                {filter && (
                  <button
                    onClick={() => setFilter('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
              <CopyButton text={allNicknamesText} label="전체 복사" />
            </div>
          </div>

          {filteredNicknames.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {filteredNicknames.map((nickname, index) => (
                <NicknameCard
                  key={`${nickname}-${index}`}
                  nickname={nickname}
                  isSelected={selectedIndex === index}
                  onClick={() => setSelectedIndex(index)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-400 py-8">
              &apos;{filter}&apos; 포함된 닉네임이 없어요. 다시 생성해 보세요!
            </p>
          )}

          {/* 선택된 닉네임 공유 */}
          {selectedIndex !== null && filteredNicknames[selectedIndex] && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                선택: <strong className="text-gray-900 dark:text-white">{filteredNicknames[selectedIndex]}</strong>
              </span>
              <button
                onClick={() => handleShareNickname(filteredNicknames[selectedIndex])}
                className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {shareCopied ? '✅ 링크 복사됨!' : '🔗 결과 공유하기'}
              </button>
            </div>
          )}
        </Card>
      )}

      {/* SEO 콘텐츠 */}
      <SeoContent />
    </div>
  );
}

function NicknameCard({
  nickname,
  isSelected,
  onClick,
}: {
  nickname: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(nickname);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 복사 실패 시 무시
    }
  }, [nickname]);

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all',
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      )}
    >
      <span className="font-medium text-gray-900 dark:text-white truncate pr-2">
        {nickname}
      </span>
      <button
        onClick={handleCopy}
        className={cn(
          'flex-shrink-0 p-1 rounded transition-colors',
          copied
            ? 'text-green-600 dark:text-green-400'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        )}
        title="복사"
      >
        {copied ? (
          <CheckIcon className="w-4 h-4" />
        ) : (
          <CopyIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎲 랜덤 닉네임 생성기란?
        </h2>
        <p className="text-sm leading-relaxed">
          게임, SNS, 커뮤니티 등에서 사용할 한글 닉네임을 자동 생성하는 도구입니다.
          게임용, 감성, 강함, 귀여움, 무난, 웃긴 6가지 스타일과 2~5글자 길이를 선택할 수 있습니다.
          의미 있는 단어 조합 알고리즘으로 실제 사람이 지은 듯한 자연스러운 닉네임을 만들어줍니다.
          필터 기능으로 특정 글자가 포함된 닉네임만 골라볼 수도 있어요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎯 스타일별 특징
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">스타일</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">느낌</th>
                <th className="text-left py-2 font-semibold text-gray-900 dark:text-white">예시</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">🎮 게임용</td>
                <td className="py-2 pr-4">임팩트 있는</td>
                <td className="py-2">흑염룡, 폭주맨</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">✨ 감성</td>
                <td className="py-2 pr-4">예쁘고 서정적</td>
                <td className="py-2">별빛소녀, 달빛이슬</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">💪 강함</td>
                <td className="py-2 pr-4">강인하고 멋진</td>
                <td className="py-2">철벽수비, 불사신</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">🐰 귀여움</td>
                <td className="py-2 pr-4">귀엽고 사랑스러운</td>
                <td className="py-2">복숭아냥, 솜사탕</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">😊 무난</td>
                <td className="py-2 pr-4">자연스럽고 평범한</td>
                <td className="py-2">파란하늘, 초록잎</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">😂 웃긴</td>
                <td className="py-2 pr-4">진지하게 웃긴</td>
                <td className="py-2">던져라참치, 졸린두부</td>
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
          <li><strong>게임별 제한:</strong> 대부분의 게임은 2~6글자 닉네임을 허용함</li>
          <li><strong>중복 체크:</strong> 생성된 닉네임은 게임 내에서 사용 가능 여부 확인 필요</li>
          <li><strong>변형 사용:</strong> 마음에 드는 닉네임에 숫자나 특수문자 추가 가능</li>
          <li><strong>복사 기능:</strong> 원클릭으로 닉네임 복사해서 바로 사용</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '내 단어 조합은 어떻게 사용하나요?', answer: '원하는 단어(이름, 별명 등)를 입력하면 그 단어를 포함한 닉네임을 접두어+단어, 단어+접미어 등 다양한 패턴으로 자동 조합합니다.' },
          { question: '필터는 어떻게 쓰나요?', answer: '생성 결과에서 특정 글자가 포함된 닉네임만 보고 싶을 때 사용합니다. 예를 들어 "참치"를 입력하면 참치가 들어간 닉네임만 표시됩니다.' },
          { question: '영어 닉네임도 생성할 수 있나요?', answer: '현재는 한글 닉네임 생성만 지원합니다. 영문은 다른 도구를 이용해 주세요.' },
        ]}
      />
    </div>
  );
}

// ========================================
// 아이콘 컴포넌트
// ========================================

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
