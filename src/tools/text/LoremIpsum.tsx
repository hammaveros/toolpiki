'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { Textarea } from '@/components/ui/Textarea';
import { CopyButton } from '@/components/ui/CopyButton';
import { cn } from '@/lib/utils/cn';

type Language = 'latin' | 'korean';
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

const KOREAN_WORDS = [
  '그리고', '하지만', '그러나', '또한', '따라서', '그래서', '왜냐하면', '만약',
  '우리는', '그들은', '이것은', '저것은', '무엇이', '어디서', '언제나', '항상',
  '세상에는', '사람들이', '생각하는', '방법으로', '문제를', '해결할', '수있다',
  '행복을', '찾아서', '여행을', '떠나는', '사람들', '마음속', '깊은곳',
  '아름다운', '자연의', '풍경을', '바라보며', '평화로운', '시간을', '보내다',
  '미래에는', '더나은', '세상이', '펼쳐질', '것이라', '믿으며', '오늘도',
  '열심히', '노력하는', '모든이들', '응원한다', '꿈을향해', '나아가는',
  '발걸음', '멈추지', '않기를', '바란다', '희망찬', '내일을', '위하여',
  '함께', '손잡고', '걸어가자', '어둠속', '빛나는', '별처럼', '우리도',
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
  language: Language,
  unit: Unit,
  count: number,
  startWithLorem: boolean
): string {
  const words = language === 'latin' ? LATIN_WORDS : KOREAN_WORDS;

  if (unit === 'words') {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(pickRandom(words));
    }
    if (startWithLorem && language === 'latin') {
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
    if (startWithLorem && language === 'latin' && sentences.length > 0) {
      sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    }
    return sentences.join(' ');
  }

  // paragraphs
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    paragraphs.push(generateParagraph(words, 4, 7));
  }
  if (startWithLorem && language === 'latin' && paragraphs.length > 0) {
    paragraphs[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paragraphs[0];
  }
  return paragraphs.join('\n\n');
}

export function LoremIpsum() {
  const [language, setLanguage] = useState<Language>('latin');
  const [unit, setUnit] = useState<Unit>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [result, setResult] = useState('');

  const handleGenerate = useCallback(() => {
    setResult(generateLorem(language, unit, count, startWithLorem));
  }, [language, unit, count, startWithLorem]);

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-5">
        <div className="space-y-4">
          {/* 언어 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              언어
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('latin')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  language === 'latin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                라틴어 (Lorem Ipsum)
              </button>
              <button
                onClick={() => setLanguage('korean')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  language === 'korean'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                한글
              </button>
            </div>
          </div>

          {/* 단위 선택 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                단위
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              >
                <option value="paragraphs">문단</option>
                <option value="sentences">문장</option>
                <option value="words">단어</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                개수
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
            {language === 'latin' && (
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={startWithLorem}
                    onChange={(e) => setStartWithLorem(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Lorem ipsum으로 시작
                  </span>
                </label>
              </div>
            )}
          </div>

          <Button onClick={handleGenerate} className="w-full">
            생성하기
          </Button>
        </div>
      </Card>

      {result && (
        <Card variant="bordered" className="p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {result.length}자
            </span>
            <CopyButton text={result} label="복사" />
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Lorem Ipsum이란?</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Lorem Ipsum은 인쇄 및 조판 업계에서 사용하는 표준 더미 텍스트입니다.
          기원전 45년경 로마의 철학자 키케로(Cicero)가 쓴 &quot;De Finibus Bonorum et Malorum&quot;(선과 악의 극한에 대하여)에서 유래했으며,
          1500년대 한 익명의 인쇄공이 활자 견본용으로 사용하면서 널리 퍼지기 시작했습니다.
          500년이 넘는 세월 동안 인쇄 산업의 표준 더미 텍스트로 자리잡아 왔으며,
          디지털 시대에 들어서면서 전자 조판 소프트웨어와 웹 디자인에서도 핵심적으로 활용되고 있습니다.
          실제 의미가 없는 라틴어 단어 조합이기 때문에 디자인 작업 시 텍스트 내용에 주의가 분산되지 않아
          레이아웃과 타이포그래피 자체에 집중할 수 있다는 장점이 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">활용 사례</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Lorem Ipsum은 다양한 분야에서 폭넓게 사용됩니다.
          웹 디자인에서는 시안이나 목업 작업 시 실제 콘텐츠가 준비되기 전 레이아웃의 텍스트 영역을 채우는 데 활용됩니다.
          UI/UX 프로토타이핑에서는 버튼, 카드, 모달 등 컴포넌트 안에 텍스트가 들어갔을 때의 시각적 균형을 미리 확인할 수 있습니다.
          인쇄 레이아웃에서는 포스터, 브로셔, 잡지 편집 시 본문 영역의 글꼴 크기, 줄 간격, 여백 등을 테스트하는 용도로 씁니다.
          앱 개발에서는 서버 데이터가 아직 없을 때 화면을 채워서 전체적인 사용자 경험을 시뮬레이션할 수 있습니다.
          한글 더미 텍스트도 함께 지원하므로 한국어 프로젝트의 자간, 행간 테스트에도 활용해 보세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">더미 텍스트 대안</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Lorem Ipsum 외에도 다양한 더미 텍스트 대안이 있습니다.
          &quot;한글 입숨&quot;은 한국어 특유의 자간과 행간을 테스트하기에 적합하고,
          &quot;Hipster Ipsum&quot;이나 &quot;Bacon Ipsum&quot;처럼 재미있는 주제의 더미 텍스트도 존재합니다.
          프로젝트의 성격에 따라 적절한 더미 텍스트를 선택하면 작업의 분위기를 살릴 수 있습니다.
          다만 클라이언트에게 시안을 보여줄 때는 전통적인 Lorem Ipsum이 가장 무난한 선택입니다.
        </p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: 'Lorem Ipsum은 실제 라틴어인가요?', answer: '부분적으로 그렇습니다. 키케로의 원문에서 유래했지만, 중간중간 단어가 변형되거나 추가되어 정확한 라틴어 문법에 맞지는 않습니다. 의미 있는 문장이 아니라 시각적 채움을 위한 텍스트입니다.' },
          { question: '한글 더미 텍스트는 어떤 경우에 쓰나요?', answer: '한국어 웹사이트나 앱의 타이포그래피를 테스트할 때 유용합니다. 한글은 라틴 문자와 글자 폭, 줄 간격이 다르기 때문에 실제 한글 텍스트로 레이아웃을 확인하는 것이 더 정확합니다.' },
          { question: '생성된 텍스트를 상업적으로 사용해도 되나요?', answer: '네, Lorem Ipsum은 저작권이 없는 퍼블릭 도메인 텍스트입니다. 어떤 프로젝트에서든 자유롭게 사용할 수 있습니다.' },
        ]}
      />

      <div className="flex gap-4 text-sm">
        <a href="/" className="text-blue-600 hover:underline">← 홈으로</a>
        <a href="/tools/random-string-generator" className="text-blue-600 hover:underline">랜덤 문자열 →</a>
      </div>
    </div>
  );
}
