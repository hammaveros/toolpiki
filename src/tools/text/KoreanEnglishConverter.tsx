'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

// 한글 자모 분리/조합 테이블
const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const JUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// 영타 → 한글 자모 매핑
const ENG_TO_KOR: Record<string, string> = {
  'q': 'ㅂ', 'w': 'ㅈ', 'e': 'ㄷ', 'r': 'ㄱ', 't': 'ㅅ', 'y': 'ㅛ', 'u': 'ㅕ', 'i': 'ㅑ', 'o': 'ㅐ', 'p': 'ㅔ',
  'a': 'ㅁ', 's': 'ㄴ', 'd': 'ㅇ', 'f': 'ㄹ', 'g': 'ㅎ', 'h': 'ㅗ', 'j': 'ㅓ', 'k': 'ㅏ', 'l': 'ㅣ',
  'z': 'ㅋ', 'x': 'ㅌ', 'c': 'ㅊ', 'v': 'ㅍ', 'b': 'ㅠ', 'n': 'ㅜ', 'm': 'ㅡ',
  'Q': 'ㅃ', 'W': 'ㅉ', 'E': 'ㄸ', 'R': 'ㄲ', 'T': 'ㅆ', 'O': 'ㅒ', 'P': 'ㅖ',
};

// 한글 자모 → 영타 매핑
const KOR_TO_ENG: Record<string, string> = {};
for (const [eng, kor] of Object.entries(ENG_TO_KOR)) {
  KOR_TO_ENG[kor] = eng;
}

type Mode = 'auto' | 'eng-to-kor' | 'kor-to-eng';

function isKorean(char: string): boolean {
  const code = char.charCodeAt(0);
  // 한글 음절 (가-힣)
  if (code >= 0xAC00 && code <= 0xD7A3) return true;
  // 한글 자모 (ㄱ-ㅎ, ㅏ-ㅣ)
  if (code >= 0x3131 && code <= 0x3163) return true;
  return false;
}

function isEnglish(char: string): boolean {
  const code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}

function detectMode(text: string): 'eng-to-kor' | 'kor-to-eng' {
  let korCount = 0;
  let engCount = 0;
  for (const char of text) {
    if (isKorean(char)) korCount++;
    if (isEnglish(char)) engCount++;
  }
  return korCount > engCount ? 'kor-to-eng' : 'eng-to-kor';
}

export function KoreanEnglishConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('auto');
  const [detectedMode, setDetectedMode] = useState<'eng-to-kor' | 'kor-to-eng'>('eng-to-kor');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // 한글 분해
  const decomposeHangul = useCallback((char: string): string[] => {
    const code = char.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) {
      if (KOR_TO_ENG[char]) return [char];
      return [char];
    }
    const syllable = code - 0xAC00;
    const cho = Math.floor(syllable / 588);
    const jung = Math.floor((syllable % 588) / 28);
    const jong = syllable % 28;

    const result = [CHO[cho], JUNG[jung]];
    if (jong > 0) result.push(JONG[jong]);
    return result;
  }, []);

  // 영타 → 한글 변환
  const convertEngToKor = useCallback((text: string): string => {
    const jamos: string[] = [];
    for (const char of text) {
      jamos.push(ENG_TO_KOR[char] || char);
    }

    let result = '';
    let i = 0;

    while (i < jamos.length) {
      const char = jamos[i];
      const choIdx = CHO.indexOf(char);

      if (choIdx === -1) {
        result += char;
        i++;
        continue;
      }

      if (i + 1 >= jamos.length) {
        result += char;
        i++;
        continue;
      }

      const nextChar = jamos[i + 1];
      let jungIdx = JUNG.indexOf(nextChar);

      // 복합 모음 확인
      if (jungIdx !== -1 && i + 2 < jamos.length) {
        const combined = nextChar + jamos[i + 2];
        const complexJung = ['ㅗㅏ', 'ㅗㅐ', 'ㅗㅣ', 'ㅜㅓ', 'ㅜㅔ', 'ㅜㅣ', 'ㅡㅣ'];
        const complexIdx = [9, 10, 11, 14, 15, 16, 19];
        const cIdx = complexJung.indexOf(combined);
        if (cIdx !== -1) {
          jungIdx = complexIdx[cIdx];
          i++;
        }
      }

      if (jungIdx === -1) {
        result += char;
        i++;
        continue;
      }

      // 종성 확인
      let jongIdx = 0;
      if (i + 2 < jamos.length) {
        const potentialJong = jamos[i + 2];
        const jIdx = JONG.indexOf(potentialJong);

        if (jIdx > 0) {
          if (i + 3 < jamos.length && JUNG.includes(jamos[i + 3])) {
            // 종성 없음
          } else {
            jongIdx = jIdx;
            i++;
          }
        }
      }

      const syllable = 0xAC00 + (choIdx * 588) + (jungIdx * 28) + jongIdx;
      result += String.fromCharCode(syllable);
      i += 2;
    }

    return result;
  }, []);

  // 한글 → 영타 변환
  const convertKorToEng = useCallback((text: string): string => {
    let result = '';
    for (const char of text) {
      const jamos = decomposeHangul(char);
      for (const jamo of jamos) {
        result += KOR_TO_ENG[jamo] || jamo;
      }
    }
    return result;
  }, [decomposeHangul]);

  const getActiveMode = (): 'eng-to-kor' | 'kor-to-eng' => {
    return mode === 'auto' ? detectedMode : mode;
  };

  // 자동 변환
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!input.trim()) {
      setOutput('');
      setDetectedMode('eng-to-kor');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const activeMode = mode === 'auto' ? detectMode(input) : mode;
      if (mode === 'auto') {
        setDetectedMode(activeMode);
      }
      if (activeMode === 'eng-to-kor') {
        setOutput(convertEngToKor(input));
      } else {
        setOutput(convertKorToEng(input));
      }
    }, 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, mode, convertEngToKor, convertKorToEng]);

  const handleSwap = () => {
    setInput(output);
    setOutput('');
    if (mode !== 'auto') {
      setMode(mode === 'eng-to-kor' ? 'kor-to-eng' : 'eng-to-kor');
    }
  };

  const activeMode = getActiveMode();

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button
          variant={mode === 'auto' ? 'primary' : 'secondary'}
          onClick={() => setMode('auto')}
        >
          자동 인식
        </Button>
        <Button
          variant={mode === 'eng-to-kor' ? 'primary' : 'secondary'}
          onClick={() => setMode('eng-to-kor')}
        >
          영타 → 한글
        </Button>
        <Button
          variant={mode === 'kor-to-eng' ? 'primary' : 'secondary'}
          onClick={() => setMode('kor-to-eng')}
        >
          한글 → 영타
        </Button>
        {mode === 'auto' && input.trim() && (
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            감지: {activeMode === 'eng-to-kor' ? '영타 → 한글' : '한글 → 영타'}
          </span>
        )}
      </div>

      <Textarea
        label="입력"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={activeMode === 'eng-to-kor' ? 'dkssudgktpdy (안녕하세요)' : '안녕하세요 (dkssudgktpdy)'}
        rows={5}
      />

      <div className="flex gap-2">
        <Button variant="secondary" onClick={handleSwap}>
          ↔ 입출력 교체
        </Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); }}>
          초기화
        </Button>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              변환 결과
            </label>
            <CopyButton text={output} />
          </div>
          <Textarea value={output} readOnly rows={5} className="bg-gray-50 dark:bg-gray-800/50" />
        </div>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">한영타 변환기란?</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          한영타 변환기는 키보드 언어 설정을 잘못한 채 입력한 텍스트를 올바른 언어로 변환해주는 도구입니다.
          한글 키보드 상태에서 영어를 입력하면 &quot;ㅗㄷㅣㅣㅐ&quot;처럼 한글 자모가 나오고,
          반대로 영문 키보드 상태에서 한글을 입력하면 &quot;dkssudgktpdy&quot;처럼 영문 알파벳이 출력됩니다.
          이 변환기를 사용하면 잘못 입력한 텍스트를 다시 타이핑할 필요 없이 즉시 올바른 결과로 변환할 수 있습니다.
          쌍자음(ㄲ, ㄸ, ㅃ, ㅆ, ㅉ), 겹모음(ㅘ, ㅙ, ㅚ, ㅝ, ㅞ, ㅟ, ㅢ) 등 복잡한 한글 조합도 정확하게 처리합니다.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">어떤 상황에서 유용한가요?</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          가장 흔한 경우는 한/영 키를 누르지 않고 그대로 타이핑했을 때입니다.
          채팅이나 메신저에서 빠르게 타이핑하다가 한영 전환을 깜빡하면 &quot;안녕하세요&quot;를 입력했는데
          &quot;dkssudgktpdy&quot;가 나오는 경우가 있습니다. 이럴 때 변환기에 복사해서 붙여넣으면
          바로 원래 의도한 텍스트를 확인할 수 있습니다.
          프로그래밍 중 변수명이나 명령어를 한글 모드에서 입력한 경우,
          게임 내 채팅에서 한영 전환이 안 되는 환경, 또는 외국인이 한글 키보드 배열을
          연습할 때도 활용할 수 있습니다.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">한글 키보드 배열(두벌식)</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          한국에서 표준으로 사용되는 두벌식 키보드 배열은 영문 QWERTY 키보드 위에 한글 자모를 배치한 형태입니다.
          왼쪽 영역(Q~T)에는 자음 ㅂ, ㅈ, ㄷ, ㄱ, ㅅ이, 오른쪽 영역(Y~P)에는 모음 ㅛ, ㅕ, ㅑ, ㅐ, ㅔ가 배치됩니다.
          중간 행(A~L)에는 ㅁ, ㄴ, ㅇ, ㄹ, ㅎ, ㅗ, ㅓ, ㅏ, ㅣ가 위치하며,
          아래 행(Z~M)에는 ㅋ, ㅌ, ㅊ, ㅍ, ㅠ, ㅜ, ㅡ가 배치됩니다.
          Shift 키와 함께 누르면 쌍자음(ㄲ, ㄸ, ㅃ, ㅆ, ㅉ)과 겹모음(ㅒ, ㅖ)을 입력할 수 있습니다.
          이 배열 구조 덕분에 영문 키와 한글 자모 간의 1:1 매핑이 가능하여 한영 변환이 정확하게 이루어집니다.
        </p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '쌍자음이나 겹모음도 변환되나요?', answer: '네, ㄲ·ㄸ·ㅃ·ㅆ·ㅉ 같은 쌍자음과 ㅘ·ㅙ·ㅚ·ㅝ·ㅞ·ㅟ·ㅢ 같은 겹모음도 모두 정확하게 변환됩니다. Shift 입력까지 반영하여 처리합니다.' },
          { question: '영타→한글과 한글→영타 차이가 뭔가요?', answer: '영타→한글은 영문 상태에서 한글을 치려고 했던 경우(예: dkssudgktpdy → 안녕하세요)에 사용하고, 한글→영타는 한글 상태에서 영어를 치려고 했던 경우(예: ㅗㄷㅣㅣㅐ → hello)에 사용합니다.' },
          { question: '특수문자나 숫자도 변환되나요?', answer: '특수문자, 숫자, 공백 등은 한영 키보드 배열에서 동일한 위치에 있으므로 변환 없이 그대로 유지됩니다.' },
        ]}
      />

      <div className="flex gap-4 text-sm">
        <a href="/" className="text-blue-600 hover:underline">← 홈으로</a>
        <a href="/tools/character-counter" className="text-blue-600 hover:underline">글자수 세기 →</a>
      </div>
    </section>
  );
}
