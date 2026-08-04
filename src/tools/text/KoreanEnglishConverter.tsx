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
          <strong className="text-gray-900 dark:text-white">한영타 변환기는 키보드 언어를 잘못 설정한 채 입력한 텍스트를 올바른 언어로 변환해주는 도구</strong>입니다.
          한글 상태에서 영어를 치면 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">ㅗㄷㅣㅣㅐ</code>처럼 한글 자모가 나오고,
          영문 상태에서 한글을 치면 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">dkssudgktpdy</code>처럼 영문 알파벳이 출력됩니다.
          <strong>다시 타이핑할 필요 없이 즉시 올바른 결과로 변환</strong>할 수 있으며,
          <strong>쌍자음·겹모음</strong> 등 복잡한 한글 조합도 정확하게 처리합니다.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">어떤 상황에서 유용한가요?</h2>
        <ul className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
          <li><strong>채팅·메신저</strong>에서 한/영 전환을 깜빡하여 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">dkssudgktpdy</code>처럼 출력된 경우</li>
          <li><strong>프로그래밍</strong> 중 변수명이나 명령어를 한글 모드에서 잘못 입력한 경우</li>
          <li><strong>게임 내 채팅</strong>에서 한영 전환이 막혀 있는 환경</li>
          <li><strong>외국인 사용자</strong>가 한글 키보드 배열을 연습할 때</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          이럴 때 변환기에 복사해서 붙여넣으면 <strong>바로 원래 의도한 텍스트를 확인</strong>할 수 있어 다시 타이핑하는 수고를 덜 수 있습니다.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">한글 키보드 배열(두벌식)</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          한국 표준 <strong>두벌식 키보드</strong>는 영문 <strong>QWERTY 위에 한글 자모를 배치</strong>한 형태입니다.
          왼쪽(<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Q~T</code>)에는 자음 ㅂ·ㅈ·ㄷ·ㄱ·ㅅ, 오른쪽(<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Y~P</code>)에는 모음 ㅛ·ㅕ·ㅑ·ㅐ·ㅔ가 배치됩니다.
          중간 행(<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">A~L</code>)에는 ㅁ·ㄴ·ㅇ·ㄹ·ㅎ·ㅗ·ㅓ·ㅏ·ㅣ, 아래 행(<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Z~M</code>)에는 ㅋ·ㅌ·ㅊ·ㅍ·ㅠ·ㅜ·ㅡ가 위치합니다.
          <strong>Shift와 함께 누르면 쌍자음·겹모음</strong>(ㄲ·ㄸ·ㅃ·ㅆ·ㅉ·ㅒ·ㅖ)을 입력할 수 있어, 영문 키와 한글 자모 간 <strong>1:1 매핑</strong>이 가능합니다.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">자주 나오는 변환 예시</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-3">
          아래처럼 보인다면 변환기에 그대로 붙여넣으면 됩니다. 익숙해지면 형태만 보고도 원래 문구가 짐작됩니다.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">잘못 입력된 형태</th>
                <th className="text-left py-2 px-2">원래 문구</th>
                <th className="text-left py-2 px-2">변환 방향</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2 font-mono">dkssudgktpdy</td><td>안녕하세요</td><td>영타 → 한글</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2 font-mono">rkatkgkqslek</td><td>감사합니다</td><td>영타 → 한글</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2 font-mono">tnrhgotjdy</td><td>수고하셨어요</td><td>영타 → 한글</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2 font-mono">ㅗ디ㅣㅐ</td><td>hello</td><td>한글 → 영타</td></tr>
              <tr><td className="py-1.5 px-2 font-mono">ㅔ소서ㅐㄱㅁ</td><td>password</td><td>한글 → 영타</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">왜 이런 일이 생길까</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          두벌식 자판은 영문 QWERTY 위에 한글 자모를 겹쳐 올린 구조라, 같은 키를 눌러도 입력 모드에 따라 전혀 다른 글자가 나옵니다.
          키보드는 &quot;어떤 키를 눌렀는지&quot;만 전달하고, 그 키를 무엇으로 해석할지는 입력기(IME)가 결정하기 때문입니다.
          그래서 <strong>모드만 바뀌었을 뿐 눌린 키 자체는 동일</strong>하고, 덕분에 이렇게 되돌리는 변환이 가능합니다.
        </p>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mt-3">
          특히 로그인 화면에서 자주 겪습니다. 비밀번호 입력란은 글자가 가려져 있어 한/영 상태를 알아채기 어렵고,
          <strong>Caps Lock이 켜진 경우</strong>와 증상이 비슷해 헷갈리기 쉽습니다.
          로그인이 반복해서 실패한다면 한/영 상태와 Caps Lock을 함께 확인해 보세요.
        </p>
      </div>

      <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 p-4 text-sm">
        <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">💡 변환 방향 팁</p>
        <p className="text-indigo-800 dark:text-indigo-300">
          한글이 영문 알파벳으로 보인다면 <strong>영타→한글</strong>, 영문이 한글 자모로 보인다면 <strong>한글→영타</strong>를 선택하세요.
        </p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '쌍자음이나 겹모음도 변환되나요?', answer: '네, ㄲ·ㄸ·ㅃ·ㅆ·ㅉ 같은 쌍자음과 ㅘ·ㅙ·ㅚ·ㅝ·ㅞ·ㅟ·ㅢ 같은 겹모음도 모두 정확하게 변환됩니다. Shift 입력까지 반영하여 처리합니다.' },
          { question: '영타→한글과 한글→영타 차이가 뭔가요?', answer: '영타→한글은 영문 상태에서 한글을 치려고 했던 경우(예: dkssudgktpdy → 안녕하세요)에 사용하고, 한글→영타는 한글 상태에서 영어를 치려고 했던 경우(예: ㅗㄷㅣㅣㅐ → hello)에 사용합니다.' },
          { question: '특수문자나 숫자도 변환되나요?', answer: '특수문자, 숫자, 공백 등은 한영 키보드 배열에서 동일한 위치에 있으므로 변환 없이 그대로 유지됩니다.' },
          { question: '왜 한/영 전환을 깜빡하면 이런 글자가 나오나요?', answer: '두벌식 자판은 영문 QWERTY 위에 한글 자모를 겹쳐 놓은 구조입니다. 키보드는 눌린 키 위치만 전달하고 해석은 입력기가 하기 때문에, 모드가 다르면 같은 키가 전혀 다른 글자로 표시됩니다. 눌린 키는 같으므로 되돌릴 수 있습니다.' },
          { question: '비밀번호 입력이 자꾸 틀리는데 이것 때문일까요?', answer: '가능성이 큽니다. 비밀번호 칸은 글자가 가려져 한/영 상태를 알기 어렵습니다. Caps Lock이 켜진 경우와 증상이 비슷하니 두 가지를 함께 확인해 보세요.' },
          { question: '입력한 텍스트가 서버로 전송되나요?', answer: '아니요. 변환은 브라우저 안에서만 처리되며 입력 내용이 서버로 전송되거나 저장되지 않습니다. 다만 실제 사용 중인 비밀번호는 어떤 사이트에도 입력하지 않는 것이 안전합니다.' },
        ]}
      />

      <div className="flex gap-4 text-sm">
        <a href="/" className="text-blue-600 hover:underline">← 홈으로</a>
        <a href="/tools/character-counter" className="text-blue-600 hover:underline">글자수 세기 →</a>
      </div>
    </section>
  );
}
