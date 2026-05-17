'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { Textarea } from '@/components/ui/Textarea';
import { CopyButton } from '@/components/ui/CopyButton';
import { cn } from '@/lib/utils/cn';

type Unit = 'paragraphs' | 'sentences' | 'words';

const LATIN_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
  'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
  'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos',
  'dolores', 'quas', 'molestias', 'excepturi', 'obcaecati', 'cupiditate',
];

function getSecureRandom(max: number): number {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function pickRandom<T>(arr: T[]): T {
  return arr[getSecureRandom(arr.length)];
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateSentence(words: string[], minWords: number, maxWords: number): string {
  const count = minWords + getSecureRandom(maxWords - minWords + 1);
  const sentence: string[] = [];

  for (let i = 0; i < count; i++) {
    sentence.push(pickRandom(words));
  }

  return capitalize(sentence.join(' ')) + '.';
}

function generateParagraph(words: string[], minSentences: number, maxSentences: number): string {
  const count = minSentences + getSecureRandom(maxSentences - minSentences + 1);
  const sentences: string[] = [];

  for (let i = 0; i < count; i++) {
    sentences.push(generateSentence(words, 8, 15));
  }

  return sentences.join(' ');
}

function generateLorem(
  unit: Unit,
  count: number,
  startWithLorem: boolean
): string {
  const words = LATIN_WORDS;

  if (unit === 'words') {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(pickRandom(words));
    }
    if (startWithLorem) {
      result[0] = 'lorem';
      if (result.length > 1) result[1] = 'ipsum';
    }
    return capitalize(result.join(' ')) + '.';
  }

  if (unit === 'sentences') {
    const sentences: string[] = [];
    for (let i = 0; i < count; i++) {
      sentences.push(generateSentence(words, 8, 15));
    }
    if (startWithLorem && sentences.length > 0) {
      sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    }
    return sentences.join(' ');
  }

  // paragraphs
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    paragraphs.push(generateParagraph(words, 4, 7));
  }
  if (startWithLorem && paragraphs.length > 0) {
    paragraphs[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paragraphs[0];
  }
  return paragraphs.join('\n\n');
}

export function LoremIpsumEn() {
  const [unit, setUnit] = useState<Unit>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [result, setResult] = useState('');

  const handleGenerate = useCallback(() => {
    setResult(generateLorem(unit, count, startWithLorem));
  }, [unit, count, startWithLorem]);

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-5">
        <div className="space-y-4">
          {/* Unit selection */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              >
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Count
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Start with Lorem ipsum
                </span>
              </label>
            </div>
          </div>

          <Button onClick={handleGenerate} className="w-full">
            Generate
          </Button>
        </div>
      </Card>

      {result && (
        <Card variant="bordered" className="p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {result.length} characters
            </span>
            <CopyButton text={result} label="Copy" />
          </div>
          <Textarea
            value={result}
            readOnly
            rows={10}
            className="font-mono text-sm"
          />
        </Card>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-6">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">What is Lorem Ipsum?</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-white">Lorem Ipsum is the standard dummy text used in the printing and typesetting industry.</strong>{' '}
          It originates from &quot;De Finibus Bonorum et Malorum&quot;, a philosophical work written by the <strong>Roman statesman Cicero around 45 BC</strong>.
          In the <strong>1500s</strong>, an unknown printer scrambled sections of the text to create a type specimen book,
          and it has remained the industry standard ever since. Because the text has no meaningful content,
          it lets designers focus on <strong>layout, typography, and spacing</strong> instead of reading along.
          Over <strong>500 years later</strong>, it remains the go-to choice for filling content areas in both print and digital media.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Common Use Cases</h2>
        <ul className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
          <li><strong>Web design</strong> — fills text areas in mockups and wireframes to evaluate visual density before real content is ready.</li>
          <li><strong>UI/UX prototyping</strong> — visualizes how text behaves inside buttons, cards, modals, and nav menus.</li>
          <li><strong>Print layout</strong> — tests font sizes, line heights, margins, and column widths in posters, brochures, and magazines.</li>
          <li><strong>App development</strong> — simulates realistic screens when backend data is not yet available.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Beyond Lorem Ipsum</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Alternative placeholder texts exist, including <strong>Hipster Ipsum</strong>, <strong>Bacon Ipsum</strong>, and <strong>Cupcake Ipsum</strong>.
          Some designers prefer real content samples in the target language to better test typography. However, for
          <strong>client-facing presentations and professional reviews</strong>, traditional Lorem Ipsum remains the safest, most universally understood option.
        </p>
      </section>

      <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 p-4 text-sm">
        <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">💡 Good to know</p>
        <p className="text-indigo-800 dark:text-indigo-300">
          Lorem Ipsum is in the <strong>public domain</strong>, so you can use it freely in any commercial or personal project without attribution.
        </p>
      </div>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'Is Lorem Ipsum actual Latin?', answer: 'Partially. It derives from Cicero\'s original work, but words have been altered, added, and rearranged over the centuries. It does not form grammatically correct Latin sentences and is not intended to convey meaning.' },
          { question: 'Why not just use real text as a placeholder?', answer: 'Real text tends to distract reviewers into reading and critiquing the content itself rather than evaluating the design. Lorem Ipsum keeps the focus on layout, typography, and visual hierarchy.' },
          { question: 'Can I use the generated text commercially?', answer: 'Yes. Lorem Ipsum is in the public domain and carries no copyright restrictions. You are free to use it in any project, whether personal or commercial.' },
        ]}
      />

      <div className="flex gap-4 text-sm">
        <a href="/en" className="text-blue-600 hover:underline">← Home</a>
        <a href="/en/tools/random-string-en" className="text-blue-600 hover:underline">Random String →</a>
      </div>
    </div>
  );
}
