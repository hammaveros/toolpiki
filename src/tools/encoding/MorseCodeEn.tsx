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
          Morse code dates back to 1837 when Samuel Morse and Alfred Vail patented a telegraph code that represents every character with combinations of two symbols — a short signal (dit) and a long one (dah).
          The international variant, agreed in 1851 and later folded into ITU standards, replaced the maritime use of Morse in 1999 when GMDSS took over, yet it remains in daily use by amateur radio operators and aviation navigation beacons.
          This tool converts text to Morse, decodes Morse back to text, and plays the result as actual audio by synthesising a 600 Hz sine wave through the Web Audio API.
          The SOS signal (<code>··· --- ···</code>) was standardised in Berlin in 1906 and has remained unchanged ever since.
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

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🎓 Useful Morse Patterns</h2>
        <div className="text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-2">Term</th>
                <th className="text-left py-2 px-2">Morse</th>
                <th className="text-left py-2 px-2">Note</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">SOS</td><td className="py-1 px-2 font-mono">··· --- ···</td><td className="py-1 px-2">Distress — sent as one continuous group</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">CQ</td><td className="py-1 px-2 font-mono">-·-· --·-</td><td className="py-1 px-2">&quot;Calling any station&quot; in amateur radio</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">73</td><td className="py-1 px-2 font-mono">--··· ···--</td><td className="py-1 px-2">Ham radio sign-off meaning &quot;best regards&quot;</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">HELLO</td><td className="py-1 px-2 font-mono">···· · ·-·· ·-·· ---</td><td className="py-1 px-2">Word boundary needs a slash (/)</td></tr>
              <tr><td className="py-1 px-2">QRT</td><td className="py-1 px-2 font-mono">--·- ·-· -</td><td className="py-1 px-2">Q-code meaning &quot;cease transmitting&quot;</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'How do I send an SOS signal?', answer: 'SOS is ··· --- ···, standardised at the 1906 Berlin International Radiotelegraph Convention. The trick is to send the entire pattern without the usual inter-character gap so it sounds like one unbroken group. Despite popular legend, the letters were chosen for clarity on a key, not as an acronym for &quot;Save Our Souls&quot;.' },
          { question: 'Can I convert non-Latin characters to Morse?', answer: 'The international ITU table only assigns dits and dahs to the Latin alphabet, the digits 0–9, and a handful of punctuation marks. For other scripts the practical approach is to romanise first (for example transliterating a name into Latin letters) and then run that through this converter.' },
          { question: 'How does the audio playback work?', answer: 'A Web Audio OscillatorNode generates a 600 Hz sine wave, attenuated to 50% by a GainNode. The dit length is fixed at 100 ms, the dah at 300 ms (3×), the inter-character pause at 200 ms, and the inter-word pause at 400 ms — matching the classic 1:3:3:7 ITU timing ratio.' },
        ]}
      />
    </div>
  );
}
