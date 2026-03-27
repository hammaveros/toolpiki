'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';

type SortBy = 'frequency' | 'alphabetical';

interface WordCount {
  word: string;
  count: number;
  percentage: number;
}

// 한글 조사 제거 (선택적)
const KOREAN_PARTICLES = [
  '은', '는', '이', '가', '을', '를', '에', '에서', '에게', '와', '과',
  '로', '으로', '의', '도', '만', '까지', '부터', '처럼', '같이', '보다',
  '랑', '이랑', '하고', '든지', '든가', '요', '야', '이야', '네', '죠'
];

function tokenize(text: string, minLength: number, ignoreCase: boolean, removeParticles: boolean): string[] {
  let processed = text;

  // 숫자 및 특수문자 제거, 단어 분리
  const words = processed
    .replace(/[0-9]/g, ' ')
    .replace(/[^\w\s가-힣]/g, ' ')
    .split(/\s+/)
    .map(w => ignoreCase ? w.toLowerCase() : w)
    .filter(w => w.length >= minLength);

  if (removeParticles) {
    return words.map(word => {
      // 한글 단어에서 조사 제거 시도
      for (const particle of KOREAN_PARTICLES) {
        if (word.endsWith(particle) && word.length > particle.length + 1) {
          return word.slice(0, -particle.length);
        }
      }
      return word;
    }).filter(w => w.length >= minLength);
  }

  return words;
}

export function WordFrequency() {
  const [text, setText] = useState('');
  const [minLength, setMinLength] = useState('2');
  const [topN, setTopN] = useState('20');
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [removeParticles, setRemoveParticles] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('frequency');

  const analysis = useMemo(() => {
    if (!text.trim()) return null;

    const words = tokenize(text, parseInt(minLength) || 1, ignoreCase, removeParticles);
    const totalWords = words.length;

    // 빈도 계산
    const frequency: Record<string, number> = {};
    for (const word of words) {
      frequency[word] = (frequency[word] || 0) + 1;
    }

    // 결과 배열
    let results: WordCount[] = Object.entries(frequency).map(([word, count]) => ({
      word,
      count,
      percentage: (count / totalWords) * 100,
    }));

    // 정렬
    if (sortBy === 'frequency') {
      results.sort((a, b) => b.count - a.count);
    } else {
      results.sort((a, b) => a.word.localeCompare(b.word, 'ko'));
    }

    // Top N
    const limit = parseInt(topN) || 20;
    const topResults = results.slice(0, limit);

    // 고유 단어 수
    const uniqueWords = Object.keys(frequency).length;

    return {
      totalWords,
      uniqueWords,
      results: topResults,
      maxCount: Math.max(...topResults.map(r => r.count)),
    };
  }, [text, minLength, topN, ignoreCase, removeParticles, sortBy]);

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-5">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              분석할 텍스트
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="분석할 텍스트를 입력하세요..."
              rows={8}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                최소 글자수
              </label>
              <Input
                type="number"
                value={minLength}
                onChange={(e) => setMinLength(e.target.value)}
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Top N
              </label>
              <Input
                type="number"
                value={topN}
                onChange={(e) => setTopN(e.target.value)}
                min="5"
                max="100"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ignoreCase}
                onChange={(e) => setIgnoreCase(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                대소문자 무시
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={removeParticles}
                onChange={(e) => setRemoveParticles(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                한글 조사 제거
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              정렬 기준
            </label>
            <div className="flex gap-2">
              {([
                { value: 'frequency', label: '빈도순' },
                { value: 'alphabetical', label: '가나다순' },
              ] as { value: SortBy; label: string }[]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    sortBy === opt.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 결과 */}
      {analysis && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card variant="bordered" className="p-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">전체 단어 수</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {analysis.totalWords.toLocaleString()}
              </div>
            </Card>
            <Card variant="bordered" className="p-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">고유 단어 수</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {analysis.uniqueWords.toLocaleString()}
              </div>
            </Card>
          </div>

          <Card variant="bordered" className="p-5">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              단어 빈도 Top {Math.min(parseInt(topN), analysis.results.length)}
            </h3>
            <div className="space-y-2">
              {analysis.results.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 text-right text-sm font-medium text-gray-500">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.word}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.count}회 ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${(item.count / analysis.maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📊 단어 빈도 분석이란?</h2>
        <p className="text-sm leading-relaxed">
          단어 빈도 분석(Word Frequency Analysis)은 텍스트에서 각 단어가 몇 번 등장하는지를 세어 빈도순으로 정렬하는 텍스트 마이닝의 기본 기법입니다.
          문서의 핵심 주제와 키워드를 빠르게 파악할 수 있으며, 블로그 글, 학술 논문, 마케팅 카피, 뉴스 기사 등 다양한 텍스트에 적용할 수 있습니다.
          이 도구는 한글 조사 자동 제거 기능을 제공하여 한국어 텍스트에서도 정확한 빈도 분석 결과를 얻을 수 있습니다.
          최소 글자수 필터, 대소문자 무시, 정렬 방식 변경 등 세밀한 옵션으로 원하는 분석 결과를 도출해 보세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💡 활용 사례</h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>SEO 키워드 분석</strong> — 블로그 글이나 웹페이지에서 타겟 키워드가 적절한 빈도로 사용되었는지 확인합니다. 키워드 밀도가 너무 낮으면 검색 노출이 어렵고, 너무 높으면 키워드 스터핑으로 페널티를 받을 수 있습니다.</li>
          <li><strong>학술 논문 분석</strong> — 논문이나 리포트에서 핵심 용어의 등장 빈도를 파악하여 연구 주제의 초점이 명확한지 검토할 수 있습니다.</li>
          <li><strong>텍스트 마이닝 / 데이터 분석</strong> — 고객 리뷰, 설문 응답, SNS 댓글 등 대량의 텍스트 데이터에서 자주 언급되는 단어를 추출하여 트렌드와 여론을 파악합니다.</li>
          <li><strong>글쓰기 개선</strong> — 같은 단어를 반복적으로 사용하고 있는지 확인하고, 어휘 다양성을 높여 글의 품질을 향상시킬 수 있습니다.</li>
          <li><strong>언어 학습</strong> — 외국어 텍스트에서 자주 등장하는 단어를 파악하여 효율적인 어휘 학습 우선순위를 정할 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📈 결과 해석 방법</h2>
        <div className="text-sm leading-relaxed space-y-2">
          <p>
            <strong>전체 단어 수</strong>는 텍스트에 포함된 총 단어의 개수이고, <strong>고유 단어 수</strong>는 중복을 제거한 서로 다른 단어의 수입니다.
            고유 단어 비율(고유 단어 수 / 전체 단어 수)이 높을수록 어휘가 다양하게 사용된 글입니다.
          </p>
          <p>
            각 단어 옆의 <strong>빈도수</strong>는 해당 단어가 몇 번 등장했는지를, <strong>비율(%)</strong>은 전체 단어 중 해당 단어가 차지하는 비중을 나타냅니다.
            SEO 목적이라면 주요 키워드의 비율이 1~3% 범위에 있는지 확인하는 것이 좋습니다.
          </p>
          <p>
            한글 분석 시 <strong>조사 제거</strong> 옵션을 켜면 &quot;학교에서&quot;, &quot;학교를&quot; 등이 모두 &quot;학교&quot;로 통합되어 더 정확한 빈도를 얻을 수 있습니다.
          </p>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '한글 조사 제거 기능은 어떻게 작동하나요?',
            answer: '한국어 텍스트에서 "은/는/이/가/을/를/에/에서" 등 흔한 조사를 자동으로 분리하여 원형 단어만 남깁니다. 예를 들어 "사과를", "사과가", "사과는"이 모두 "사과"로 통합되어 더 정확한 빈도 결과를 얻을 수 있습니다.',
          },
          {
            question: 'SEO 키워드 분석에 적절한 키워드 밀도는 얼마인가요?',
            answer: '일반적으로 주요 키워드의 비율이 전체 텍스트의 1~3% 정도가 자연스럽다고 알려져 있습니다. 이 도구에서 특정 키워드의 비율(%)을 확인하고, 너무 낮으면 키워드를 추가하거나, 너무 높으면 동의어로 교체하여 자연스러운 글을 유지하세요.',
          },
          {
            question: '최소 글자수 필터는 언제 사용하면 좋나요?',
            answer: '"이", "그", "a", "the" 같은 짧은 조사나 관사는 빈도가 높지만 분석에 의미가 없는 경우가 많습니다. 최소 글자수를 2 이상으로 설정하면 이런 불용어를 걸러내고 실질적으로 의미 있는 단어의 빈도만 확인할 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}
