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
          Lorem Ipsum is the standard dummy text used in the printing and typesetting industry.
          It originates from &quot;De Finibus Bonorum et Malorum&quot; (On the Ends of Good and Evil),
          a philosophical work written by the Roman statesman Cicero around 45 BC.
          In the 1500s, an unknown printer scrambled sections of the text to create a type specimen book,
          and it has remained the industry standard for placeholder text ever since.
          Because Lorem Ipsum consists of semi-random Latin words with no meaningful content,
          it allows designers and developers to focus on visual layout, typography, and spacing
          without being distracted by readable text.
          Over 500 years later, it continues to be the go-to choice for filling content areas in both print and digital media.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Common Use Cases</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Lorem Ipsum is widely used across many disciplines.
          In web design, it fills text areas in mockups and wireframes before actual content is ready,
          helping teams evaluate how a page will look with realistic text density.
          For UI/UX prototyping, it helps visualize how text behaves inside components like buttons, cards, modals, and navigation menus.
          In print layout, designers use it to test font sizes, line heights, margins, and column widths in posters, brochures, and magazines.
          App developers rely on it to simulate realistic screens when backend data is not yet available.
          Whether you need paragraphs for a blog template, sentences for a card layout, or individual words for tag clouds,
          this generator lets you produce exactly the amount of placeholder text you need.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Beyond Lorem Ipsum</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          While Lorem Ipsum remains the most popular choice, several alternative placeholder texts exist.
          Options like Hipster Ipsum, Bacon Ipsum, and Cupcake Ipsum add a fun twist to dummy text generation.
          Some designers prefer using real content samples in the target language to better test typography and readability.
          However, for client-facing presentations and professional design reviews,
          traditional Lorem Ipsum is still the safest and most universally understood option.
          It keeps the focus on design decisions rather than content debates.
        </p>
      </section>

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
