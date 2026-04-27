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

export function MorseCodeEn() {
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
    if (isPlaying) return;

    const morseOutput = mode === 'encode' ? textToMorse(input) : input;
    if (!morseOutput.trim()) return;

    setIsPlaying(true);
    const audioContext = new AudioContext();
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5;
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
          Text → Morse
        </Button>
        <Button
          variant={mode === 'decode' ? 'primary' : 'secondary'}
          onClick={() => setMode('decode')}
        >
          Morse → Text
        </Button>
      </div>

      <Textarea
        label={mode === 'encode' ? 'Text' : 'Morse Code'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'HELLO WORLD' : '.... . .-.. .-.. --- / .-- --- .-. .-.. -..'}
        rows={5}
      />

      <div className="flex gap-2 flex-wrap">
        <Button onClick={handleConvert}>Convert</Button>
        <Button variant="secondary" onClick={handleSwap}>
          ↔ Switch Mode
        </Button>
        <Button variant="secondary" onClick={playMorse} disabled={isPlaying}>
          {isPlaying ? 'Playing...' : '▶ Play Sound'}
        </Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); }}>
          Clear
        </Button>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Result
            </label>
            <CopyButton text={output} />
          </div>
          <Textarea value={output} readOnly rows={5} className="font-mono" />
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Morse Code Rules
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Dot (.) = Short signal (dit)</li>
          <li>• Dash (-) = Long signal (dah), 3x length of dot</li>
          <li>• Between letters = Single space</li>
          <li>• Between words = Slash (/) or 7 spaces</li>
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📡 What is Morse Code Converter?</h2>
        <p className="text-sm leading-relaxed">
          Morse code is a telegraph communication system invented by Samuel Morse in 1837.
          It represents letters, numbers, and punctuation using combinations of short signals (dots/dits)
          and long signals (dashes/dahs). Following ITU (International Telecommunication Union) standards,
          it uses the same codes worldwide. It is still used for emergency signals like SOS (··· --- ···).
          This tool provides bidirectional text-to-Morse conversion and audio playback.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🎵 Morse Code Timing Rules</h2>
        <div className="text-sm space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>Dot (.)</strong>: 1 unit signal</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>Dash (-)</strong>: 3 unit signal</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>Intra-character</strong>: 1 unit silence</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>Inter-character</strong>: 3 unit silence</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>Inter-word</strong>: 7 unit silence (shown as /)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>Frequency</strong>: 600Hz (standard tone)</div>
          </div>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'How do I send an SOS signal?', answer: 'SOS is ··· --- ···. It has been the universal distress signal since 1906. It is transmitted continuously without the usual inter-character spacing.' },
          { question: 'Can I convert non-Latin characters to Morse code?', answer: 'Standard Morse code only supports English alphabet, numbers, and some punctuation. Non-Latin text must first be romanized before converting to Morse code.' },
          { question: 'How does the audio playback work?', answer: 'It uses Web Audio API oscillators to generate a 600Hz sine wave. Dots play short tones and dashes play long tones, following ITU timing rules.' },
        ]}
      />
    </div>
  );
}
