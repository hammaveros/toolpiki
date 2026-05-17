'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { Textarea } from '@/components/ui/Textarea';

// Simple hash for consistent results
function hashText(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

interface AnalysisResult {
  aiScore: number;
  humanScore: number;
  verdict: string;
  confidence: string;
  factors: {
    name: string;
    score: number;
    description: string;
  }[];
}

function analyzeText(text: string): AnalysisResult {
  const hash = hashText(text);
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;
  const avgWordLength = text.replace(/\s+/g, '').length / Math.max(wordCount, 1);

  // Generate consistent but "fake" scores based on text properties
  const baseScore = 20 + (hash % 60);
  const lengthBonus = Math.min(wordCount / 10, 15);
  const complexityBonus = avgWordLength > 5 ? 10 : 0;

  const aiScore = Math.min(95, Math.max(15, baseScore + lengthBonus + complexityBonus));
  const humanScore = 100 - aiScore;

  let verdict: string;
  let confidence: string;

  if (aiScore >= 80) {
    verdict = 'Likely AI-Generated';
    confidence = 'High';
  } else if (aiScore >= 60) {
    verdict = 'Possibly AI-Generated';
    confidence = 'Medium';
  } else if (aiScore >= 40) {
    verdict = 'Mixed Signals';
    confidence = 'Low';
  } else {
    verdict = 'Likely Human-Written';
    confidence = 'Medium';
  }

  const factors = [
    {
      name: 'Vocabulary Pattern',
      score: 30 + (hash % 40) + (avgWordLength > 5 ? 10 : 0),
      description: 'Analysis of word choice and variety',
    },
    {
      name: 'Sentence Structure',
      score: 25 + ((hash >> 4) % 50),
      description: 'Consistency in sentence length and complexity',
    },
    {
      name: 'Writing Style',
      score: 20 + ((hash >> 8) % 55),
      description: 'Detection of patterns typical of AI writing',
    },
    {
      name: 'Content Coherence',
      score: 35 + ((hash >> 12) % 40),
      description: 'Flow and logical progression of ideas',
    },
  ];

  return { aiScore, humanScore, verdict, confidence, factors };
}

export function AiContentDetector() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const wordCount = useMemo(() => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [text]);

  const handleAnalyze = () => {
    if (wordCount < 50) return;

    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const analysis = analyzeText(text);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleReset = () => {
    setText('');
    setResult(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-6">
        <Textarea
          label="Paste text to analyze"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste at least 50 words of text to analyze..."
          rows={8}
        />

        <div className="flex justify-between items-center mt-3">
          <span className={`text-sm ${wordCount < 50 ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {wordCount} words {wordCount < 50 && '(minimum 50)'}
          </span>
          <div className="flex gap-2">
            {result && (
              <Button variant="outline" onClick={handleReset}>
                Clear
              </Button>
            )}
            <Button
              onClick={handleAnalyze}
              disabled={wordCount < 50 || isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
            </Button>
          </div>
        </div>
      </Card>

      {isAnalyzing && (
        <Card variant="bordered" className="p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">
              Analyzing text patterns...
            </p>
          </div>
        </Card>
      )}

      {result && !isAnalyzing && (
        <>
          {/* Main Result */}
          <Card variant="bordered" className="p-6">
            <div className="text-center mb-6">
              <div className={`text-5xl font-bold mb-2 ${getScoreColor(result.aiScore)}`}>
                {result.aiScore}%
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {result.verdict}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Confidence: {result.confidence}
              </p>
            </div>

            {/* Score Bar */}
            <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-500"
                style={{ width: `${result.humanScore}%` }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-gradient-to-r from-red-400 to-red-500"
                style={{ width: `${result.aiScore}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-medium text-white">
                <span>Human {result.humanScore}%</span>
                <span>AI {result.aiScore}%</span>
              </div>
            </div>
          </Card>

          {/* Detailed Analysis */}
          <Card variant="bordered" className="p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Analysis Breakdown
            </h3>
            <div className="space-y-4">
              {result.factors.map((factor) => (
                <div key={factor.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {factor.name}
                    </span>
                    <span className={`text-sm font-semibold ${getScoreColor(factor.score)}`}>
                      {factor.score}% AI
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        factor.score >= 70
                          ? 'bg-red-500'
                          : factor.score >= 40
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {factor.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Disclaimer */}
          <Card variant="bordered" className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700">
            <div className="flex gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                  Entertainment Only
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  This tool is for entertainment purposes only. It does not use actual AI detection technology.
                  Results are generated algorithmically and should not be used for academic or professional decisions.
                </p>
              </div>
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
    <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">What is an AI Content Detector?</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-white">An AI content detector analyzes text and estimates whether it was generated by an AI model or written by a human.</strong>{' '}
          As large language models like <strong>GPT</strong> and <strong>Claude</strong> have become more capable, the line between human and AI writing has blurred
          significantly. Detectors look for telltale patterns in writing style, vocabulary, and sentence structure that may indicate machine-generated content.
          <strong>This tool is a simulated experience for entertainment and educational purposes</strong>, giving you a sense of how real detection systems present their results.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">How AI Detection Works</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Real detection tools typically rely on two key metrics: <strong>perplexity</strong> and <strong>burstiness</strong>.
          <strong>Perplexity</strong> measures how predictable the text is — AI-generated content tends to choose statistically likely words (lower perplexity),
          while human writing includes unexpected word choices that raise it. <strong>Burstiness</strong> refers to variation in sentence length and complexity:
          humans mix short, punchy sentences with longer ones, while AI models produce more uniform structures. Advanced detectors also analyze
          vocabulary diversity, paragraph transitions, and formulaic AI phrases.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Limitations and Use Cases</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-white">No AI detection tool is 100% accurate.</strong>{' '}
          <strong>False positives</strong> can flag human-written content as AI-generated, especially for non-native English speakers or writers with a formal style.
          Conversely, AI text edited or paraphrased by a human may <strong>evade detection entirely</strong>. Common use cases include education (academic integrity),
          publishing (submission screening), content marketing (originality), and curiosity about how your writing compares to AI output.
        </p>
      </div>

      <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 p-4 text-sm">
        <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">⚠️ For entertainment only</p>
        <p className="text-indigo-800 dark:text-indigo-300">
          This tool is intended for fun and education. <strong>Do not use it to make academic, professional, or legal decisions about authorship.</strong>
        </p>
      </div>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'Is this a real AI detection tool?', answer: 'No. This tool is for entertainment purposes only. It uses algorithmic analysis based on text properties like word count and average word length, not actual AI detection technology. For professional needs, use dedicated AI detection services.' },
          { question: 'How many words do I need for analysis?', answer: 'You need at least 50 words for the tool to perform an analysis. Longer text samples generally allow real detection tools to produce more reliable results, with 200+ words being ideal for meaningful analysis.' },
          { question: 'Can AI detectors be fooled?', answer: 'Yes. Real AI detectors can be bypassed through paraphrasing, manual editing, or using tools that humanize AI text. Similarly, human-written text can sometimes be falsely flagged as AI-generated, especially formal or technical writing.' },
          { question: 'What are perplexity and burstiness?', answer: 'Perplexity measures how predictable or surprising the word choices in a text are. Burstiness measures the variation in sentence length and complexity. AI text tends to have low perplexity (predictable words) and low burstiness (uniform sentences), while human writing shows higher variation in both.' },
        ]}
      />

      <div className="flex gap-4 text-sm">
        <a href="/en" className="text-blue-600 hover:underline">← Home</a>
        <a href="/en/tools/character-counter-en" className="text-blue-600 hover:underline">Character Counter →</a>
      </div>
    </section>
  );
}
