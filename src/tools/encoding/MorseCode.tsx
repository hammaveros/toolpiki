'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
  ' ': '/',
};

const REVERSE_MORSE: Record<string, string> = {};
for (const [char, morse] of Object.entries(MORSE_CODE)) {
  REVERSE_MORSE[morse] = char;
}

export function MorseCode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [isPlaying, setIsPlaying] = useState(false);

  const textToMorse = (text: string): string => {
    return text
      .toUpperCase()
      .split('')
      .map((char) => MORSE_CODE[char] || char)
      .join(' ');
  };

  const morseToText = (morse: string): string => {
    return morse
      .split(' ')
      .map((code) => {
        if (code === '/') return ' ';
        return REVERSE_MORSE[code] || code;
      })
      .join('');
  };

  const handleConvert = () => {
    if (mode === 'encode') {
      setOutput(textToMorse(input));
    } else {
      setOutput(morseToText(input));
    }
  };

  const handleSwap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
  };

  const playMorse = () => {
    if (isPlaying) return; // 이미 재생 중이면 무시

    const morseOutput = mode === 'encode' ? textToMorse(input) : input;
    if (!morseOutput.trim()) return;

    setIsPlaying(true);
    const audioContext = new AudioContext();
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5; // 볼륨 50%로 감소
    gainNode.connect(audioContext.destination);

    const dotDuration = 0.1;
    let currentTime = audioContext.currentTime;

    for (const symbol of morseOutput) {
      if (symbol === '.') {
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.value = 600;
        oscillator.connect(gainNode);
        oscillator.start(currentTime);
        oscillator.stop(currentTime + dotDuration);
        currentTime += dotDuration + 0.05;
      } else if (symbol === '-') {
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.value = 600;
        oscillator.connect(gainNode);
        oscillator.start(currentTime);
        oscillator.stop(currentTime + dotDuration * 3);
        currentTime += dotDuration * 3 + 0.05;
      } else if (symbol === ' ') {
        currentTime += dotDuration * 2;
      } else if (symbol === '/') {
        currentTime += dotDuration * 4;
      }
    }

    // 재생 완료 후 상태 초기화
    const totalDuration = (currentTime - audioContext.currentTime) * 1000;
    setTimeout(() => {
      setIsPlaying(false);
      audioContext.close();
    }, totalDuration + 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={mode === 'encode' ? 'primary' : 'secondary'}
          onClick={() => setMode('encode')}
        >
          텍스트 → 모스부호
        </Button>
        <Button
          variant={mode === 'decode' ? 'primary' : 'secondary'}
          onClick={() => setMode('decode')}
        >
          모스부호 → 텍스트
        </Button>
      </div>

      <Textarea
        label={mode === 'encode' ? '텍스트' : '모스부호'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'HELLO WORLD' : '.... . .-.. .-.. --- / .-- --- .-. .-.. -..'}
        rows={5}
      />

      <div className="flex gap-2 flex-wrap">
        <Button onClick={handleConvert}>변환</Button>
        <Button variant="secondary" onClick={handleSwap}>
          ↔ 모드 전환
        </Button>
        <Button variant="secondary" onClick={playMorse} disabled={isPlaying}>
          {isPlaying ? '재생 중...' : '▶ 소리 재생'}
        </Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); }}>
          초기화
        </Button>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              결과
            </label>
            <CopyButton text={output} />
          </div>
          <Textarea value={output} readOnly rows={5} className="font-mono" />
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          모스부호 규칙
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• 점(.) = 짧은 신호 (dit)</li>
          <li>• 대시(-) = 긴 신호 (dah), 점의 3배 길이</li>
          <li>• 문자 사이 = 공백 1개</li>
          <li>• 단어 사이 = 슬래시(/) 또는 공백 7개</li>
        </ul>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📡 모스부호 변환기란?</h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">모스부호는 짧은 신호(dit)와 긴 신호(dah)만으로 모든 문자를 표현하는 전신 부호입니다.</strong>{' '}
          <strong>1837년 사무엘 모스와 알프레드 베일</strong>이 미국 특허로 정리한 가장 오래된 디지털 통신 중 하나입니다.
          1851년 국제 모스부호로 재정비된 뒤 <strong>ITU 표준</strong>으로 굳어졌고, 1999년 GMDSS에 자리를 내준 지금도 <strong>아마추어 무선과 항공 항법 신호</strong>에서 매일 사용됩니다.
          이 도구는 입력한 텍스트를 점·대시로 바꾸고, <strong>Web Audio API로 600Hz 사인파</strong>를 합성해 실제 톤으로 들려줍니다.
          <strong>SOS(<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">··· --- ···</code>)</strong>는 1906년 베를린 국제무선전신회의에서 채택된 이후 지금까지 동일한 신호입니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🎵 모스부호 타이밍 규칙</h2>
        <div className="text-sm space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>점(.)</strong>: 1단위 길이 신호</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>대시(-)</strong>: 3단위 길이 신호</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>기호 간격</strong>: 1단위 무음</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>문자 간격</strong>: 3단위 무음</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>단어 간격</strong>: 7단위 무음 (/로 표시)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>주파수</strong>: 600Hz (표준 톤)</div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🧠 외우는 요령 – 음절로 익히기</h2>
        <p className="text-sm leading-relaxed mb-3">
          <strong className="text-gray-900 dark:text-white">점·대시를 노트에 적어 외우면 금세 잊어버립니다.</strong>{' '}
          햄 무선 동호회에서 권장하는 학습법을 정리하면:
        </p>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong className="text-gray-900 dark:text-white">코흐 방식(Koch Method)</strong> — 음절·운율로 익힙니다. 예: A는 &quot;아아빵&quot;(짧고-길게), B는 &quot;빵아아아&quot;.</li>
          <li><strong className="text-gray-900 dark:text-white">빈도 상위 글자부터</strong> — E, T, A, N, I, M 순서. ITU 표에서 <strong>짧은 글자가 자주 쓰는 글자</strong>에 배치되어 빠른 송수신에 유리합니다.</li>
          <li><strong className="text-gray-900 dark:text-white">속도 기준</strong> — 숙련된 햄 무선사는 <strong>분당 30단어(WPM 30) 이상</strong>, 군사 통신용은 40 WPM이 표준이었습니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🎓 자주 등장하는 모스부호 모음</h2>
        <div className="text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-2">표현</th>
                <th className="text-left py-2 px-2">모스부호</th>
                <th className="text-left py-2 px-2">메모</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">SOS</td><td className="py-1 px-2 font-mono">··· --- ···</td><td className="py-1 px-2">조난 신호, 문자 간격 없이 연속</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">CQ</td><td className="py-1 px-2 font-mono">-·-· --·-</td><td className="py-1 px-2">아마추어 무선의 &quot;수신 가능자 응답 요청&quot;</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">73</td><td className="py-1 px-2 font-mono">--··· ···--</td><td className="py-1 px-2">햄 무선 인사 &quot;좋은 운을 빈다&quot;</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">HELLO</td><td className="py-1 px-2 font-mono">···· · ·-·· ·-·· ---</td><td className="py-1 px-2">단어 사이 슬래시(/) 필요</td></tr>
              <tr><td className="py-1 px-2">QRT</td><td className="py-1 px-2 font-mono">--·- ·-· -</td><td className="py-1 px-2">Q부호 &quot;교신 중단&quot;</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
        <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 알아두면 좋은 점</p>
        <p className="text-blue-800 dark:text-blue-300"><strong>SOS는 &quot;Save Our Souls&quot;의 약어가 아닙니다.</strong> 단순히 알아듣기 쉬운 패턴을 고른 것입니다. 정석은 S와 O 사이에 문자 간격 없이 <strong>한 덩어리로 송신</strong>하는 것입니다.</p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: 'SOS 신호는 어떻게 보내나요?', answer: 'SOS는 ··· --- ··· 입니다. 1906년 베를린 국제무선전신회의에서 표준화되었고, S와 O 사이에 문자 간격을 두지 않고 한 덩어리로 송신하는 것이 정석입니다. 그래서 &quot;Save Our Souls&quot;의 약어가 아니라 단순히 알아듣기 쉬운 패턴을 고른 것이라는 일화가 자주 인용됩니다.' },
          { question: '한글도 모스부호로 변환할 수 있나요?', answer: 'KS C 5601 한글 모스부호(자음 14, 모음 10)가 1947년 군 통신용으로 제정된 적은 있지만 일반에는 거의 보급되지 않았습니다. 실용적으로는 입력을 로마자(예: 안녕 → ANYEONG)로 옮긴 뒤 변환하는 방식이 가장 호환성이 좋습니다.' },
          { question: '소리 재생은 어떤 원리인가요?', answer: 'Web Audio API의 OscillatorNode가 600Hz 사인파를 생성하고, GainNode로 50% 볼륨을 적용합니다. dit 길이를 100ms로 잡고 dah는 그 3배인 300ms, 문자 간격 200ms, 단어 간격 400ms로 ITU 권고 비율(1:3:3:7)을 따릅니다.' },
        ]}
      />
    </div>
  );
}
