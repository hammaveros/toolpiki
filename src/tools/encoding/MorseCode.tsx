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
          모스부호(Morse Code)는 1837년 사무엘 모스가 발명한 전신 통신 코드입니다.
          짧은 신호(점, dit)와 긴 신호(대시, dah)의 조합으로 알파벳, 숫자, 특수문자를 표현합니다.
          ITU(국제전기통신연합) 표준에 따라 전 세계적으로 동일한 코드를 사용하며,
          해상 조난 신호(SOS: ··· --- ···) 등 긴급 통신에서 여전히 사용됩니다.
          이 도구는 텍스트-모스부호 양방향 변환과 소리 재생 기능을 제공합니다.
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

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: 'SOS 신호는 어떻게 보내나요?', answer: 'SOS는 ··· --- ··· 입니다. 세계 공통 조난 신호로, 1906년부터 국제 표준으로 채택되었습니다. 문자 사이 간격 없이 연속으로 전송합니다.' },
          { question: '한글도 모스부호로 변환할 수 있나요?', answer: '표준 모스부호는 영문 알파벳, 숫자, 일부 특수문자만 지원합니다. 한글은 영문으로 변환(로마자 표기) 후 모스부호로 변환해야 합니다.' },
          { question: '소리 재생은 어떤 원리인가요?', answer: 'Web Audio API의 오실레이터를 사용하여 600Hz 사인파를 생성합니다. 점은 짧게, 대시는 길게 재생하며 ITU 타이밍 규칙을 따릅니다.' },
        ]}
      />
    </div>
  );
}
