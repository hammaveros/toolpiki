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

function tokenize(text: string, minLength: number, ignoreCase: boolean): string[] {
  // Remove numbers and special characters, split words
  const words = text
    .replace(/[0-9]/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .map(w => ignoreCase ? w.toLowerCase() : w)
    .filter(w => w.length >= minLength);

  return words;
}

export function WordFrequencyEn() {
  const [text, setText] = useState('');
  const [minLength, setMinLength] = useState('2');
  const [topN, setTopN] = useState('20');
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('frequency');

  const analysis = useMemo(() => {
    if (!text.trim()) return null;

    const words = tokenize(text, parseInt(minLength) || 1, ignoreCase);
    const totalWords = words.length;

    // Count frequency
    const frequency: Record<string, number> = {};
    for (const word of words) {
      frequency[word] = (frequency[word] || 0) + 1;
    }

    // Result array
    let results: WordCount[] = Object.entries(frequency).map(([word, count]) => ({
      word,
      count,
      percentage: (count / totalWords) * 100,
    }));

    // Sort
    if (sortBy === 'frequency') {
      results.sort((a, b) => b.count - a.count);
    } else {
      results.sort((a, b) => a.word.localeCompare(b.word, 'en'));
    }

    // Top N
    const limit = parseInt(topN) || 20;
    const topResults = results.slice(0, limit);

    // Unique word count
    const uniqueWords = Object.keys(frequency).length;

    return {
      totalWords,
      uniqueWords,
      results: topResults,
      maxCount: Math.max(...topResults.map(r => r.count)),
    };
  }, [text, minLength, topN, ignoreCase, sortBy]);

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-5">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Text to Analyze
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to analyze word frequency..."
              rows={8}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Length
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
                Ignore Case
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <div className="flex gap-2">
              {([
                { value: 'frequency', label: 'Frequency' },
                { value: 'alphabetical', label: 'Alphabetical' },
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

      {/* Results */}
      {analysis && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card variant="bordered" className="p-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Words</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {analysis.totalWords.toLocaleString()}
              </div>
            </Card>
            <Card variant="bordered" className="p-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Unique Words</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {analysis.uniqueWords.toLocaleString()}
              </div>
            </Card>
          </div>

          <Card variant="bordered" className="p-5">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Top {Math.min(parseInt(topN), analysis.results.length)} Words
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
                        {item.count}x ({item.percentage.toFixed(1)}%)
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📊 What Is Word Frequency Analysis?</h2>
        <p className="text-sm leading-relaxed">
          Word frequency analysis is a fundamental text mining technique that counts how many times each word appears in a given text and ranks them by occurrence.
          It allows you to quickly identify the core topics, recurring themes, and most-used keywords within any document.
          This tool is applicable to a wide range of content including blog posts, academic papers, marketing copy, news articles, and social media data.
          With options like minimum word length filtering, case-insensitive matching, and flexible sorting, you can fine-tune the analysis to get exactly the insights you need.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💡 Common Use Cases</h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>SEO Keyword Analysis</strong> — Check whether your target keywords appear at an optimal density in your web content. Too few mentions may hurt search visibility, while excessive repetition can trigger keyword-stuffing penalties.</li>
          <li><strong>Academic Research</strong> — Identify the most frequently used terms in research papers, theses, or reports to verify that the writing stays focused on the intended subject.</li>
          <li><strong>Text Mining &amp; Data Analysis</strong> — Extract commonly mentioned words from customer reviews, survey responses, or social media comments to uncover trends and public sentiment.</li>
          <li><strong>Writing Improvement</strong> — Detect overused words and repetitive phrasing in your drafts. A higher ratio of unique words to total words may indicate richer, more engaging writing.</li>
          <li><strong>Language Learning</strong> — Discover the most common vocabulary in foreign-language texts to prioritize which words to study first for maximum reading comprehension.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📈 How to Interpret Results</h2>
        <div className="text-sm leading-relaxed space-y-2">
          <p>
            <strong>Total Words</strong> shows the overall number of words in your text, while <strong>Unique Words</strong> shows how many distinct words were used.
            A higher unique-to-total ratio indicates greater vocabulary diversity in the text.
          </p>
          <p>
            Each word entry displays a <strong>frequency count</strong> (how many times it appeared) and a <strong>percentage</strong> (its share of the total word count).
            For SEO purposes, aim for your primary keyword to fall within the 1-3% range for a natural keyword density.
          </p>
          <p>
            Use the <strong>minimum length filter</strong> to exclude short function words like &quot;a&quot;, &quot;the&quot;, &quot;is&quot;, and &quot;in&quot; that tend to dominate frequency lists without adding analytical value.
            Setting it to 3 or higher is recommended for most English text analyses.
          </p>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What does the minimum word length filter do?',
            answer: 'It excludes words shorter than the specified length from the analysis. For example, setting it to 3 will filter out common short words like "a", "an", "is", "it", and "the" that typically have high frequency but carry little analytical significance. This helps you focus on meaningful content words.',
          },
          {
            question: 'What is an ideal keyword density for SEO?',
            answer: 'Most SEO experts recommend keeping your primary keyword density between 1% and 3% of the total word count. You can check the percentage shown next to each word in the results. If your target keyword falls below 1%, consider adding more natural mentions. If it exceeds 3%, try replacing some instances with synonyms or related phrases.',
          },
          {
            question: 'How can I use this tool to improve my writing?',
            answer: 'Paste your draft into the analyzer and review the top results. If the same word appears disproportionately often, it may indicate repetitive writing. Try replacing overused words with synonyms. Also compare the unique word count to the total — a higher ratio generally signals more diverse and engaging writing.',
          },
        ]}
      />
    </div>
  );
}
