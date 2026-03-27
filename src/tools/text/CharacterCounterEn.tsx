'use client';

import { useState, useMemo, useEffect } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { Button } from '@/components/ui/Button';
import { ResultShareButtonsEn } from '@/components/share/ResultShareButtonsEn';

interface ShareData {
  text: string;
}

type ViewMode = 'basic' | 'seo' | 'platform';

interface PlatformLimit {
  name: string;
  limit: number;
  type: 'char' | 'byte';
  description: string;
}

const PLATFORM_LIMITS: PlatformLimit[] = [
  { name: 'Twitter/X', limit: 280, type: 'char', description: 'Tweet max length' },
  { name: 'Instagram Caption', limit: 2200, type: 'char', description: 'Post caption' },
  { name: 'Instagram Bio', limit: 150, type: 'char', description: 'Profile bio' },
  { name: 'Facebook Post', limit: 63206, type: 'char', description: 'Max post length' },
  { name: 'YouTube Title', limit: 100, type: 'char', description: 'Video title' },
  { name: 'YouTube Description', limit: 5000, type: 'char', description: 'Video description' },
  { name: 'Meta Title', limit: 60, type: 'char', description: 'SEO title tag' },
  { name: 'Meta Description', limit: 160, type: 'char', description: 'SEO meta description' },
  { name: 'LinkedIn Post', limit: 3000, type: 'char', description: 'Post content' },
  { name: 'TikTok Caption', limit: 2200, type: 'char', description: 'Video caption' },
];

export function CharacterCounterEn() {
  const [text, setText] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('basic');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFromShare, setIsFromShare] = useState(false);

  // Restore share data from URL hash
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const encoded = hash.slice(7);
        const decoded = decodeURIComponent(atob(encoded));
        const parsed = JSON.parse(decoded) as ShareData;
        if (parsed.text) {
          setText(parsed.text);
          setIsFromShare(true);
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Generate share URL
  const getShareUrl = () => {
    if (typeof window === 'undefined' || !text.trim()) return '';
    try {
      const data: ShareData = { text };
      const json = JSON.stringify(data);
      const encoded = btoa(encodeURIComponent(json));
      const baseUrl = window.location.href.split('#')[0];
      return `${baseUrl}#share=${encoded}`;
    } catch {
      return '';
    }
  };

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim()).length;
    const lines = text ? text.split('\n').length : 0;
    const bytes = new Blob([text]).size;

    // SEO related stats
    const avgSentenceLength = sentences > 0 ? Math.round(words / sentences) : 0;
    const readingTimeMin = Math.ceil(words / 250); // 250 WPM for English

    return {
      chars, charsNoSpace, words, sentences, paragraphs, lines, bytes,
      avgSentenceLength, readingTimeMin
    };
  }, [text]);

  const handleClear = () => setText('');

  const handleExample = () => {
    setText(`Hello! Welcome to JSSpace Character Counter.

This tool calculates characters, words, and sentences in real-time. It's useful for checking character limits for blog posts, essays, and social media.

Try the SEO Analysis tab to check if your text fits meta description guidelines, or use the Platform tab to see limits for Twitter, Instagram, and more!`);
  };

  const modeLabels: Record<ViewMode, string> = {
    basic: 'Basic Stats',
    seo: 'SEO Analysis',
    platform: 'Platforms',
  };

  return (
    <div className="space-y-4">
      {/* Input area */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enter Text
          </label>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleExample}>
              Example
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text you want to count..."
          rows={8}
        />
      </div>

      {/* Mode selection tabs */}
      <Card variant="bordered" className="p-2">
        <div className="flex gap-1">
          {(['basic', 'seo', 'platform'] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                viewMode === m
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
      </Card>

      {/* Basic Stats */}
      {viewMode === 'basic' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard label="Characters" value={stats.chars} highlight />
          <StatCard label="No Spaces" value={stats.charsNoSpace} />
          <StatCard label="Words" value={stats.words} />
          <StatCard label="Sentences" value={stats.sentences} />
          <StatCard label="Paragraphs" value={stats.paragraphs} />
          <StatCard label="Lines" value={stats.lines} />
          <StatCard label="Bytes" value={stats.bytes} unit="B" />
          <StatCard label="Read Time" value={stats.readingTimeMin} unit="min" />
        </div>
      )}

      {/* SEO Analysis */}
      {viewMode === 'seo' && (
        <div className="space-y-4">
          {/* Meta tag analysis */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-semibold mb-3">Meta Tag Analysis</h3>
            <div className="space-y-3">
              <SeoMeter
                label="Title Tag (50-60 chars recommended)"
                current={stats.chars}
                min={50}
                max={60}
                limit={70}
              />
              <SeoMeter
                label="Meta Description (150-160 chars recommended)"
                current={stats.chars}
                min={150}
                max={160}
                limit={170}
              />
            </div>
          </Card>

          {/* Readability analysis */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-semibold mb-3">Readability Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.avgSentenceLength}
                </div>
                <div className="text-sm text-gray-500">Avg Sentence Length</div>
                <div className={`text-xs mt-1 ${
                  stats.avgSentenceLength <= 20
                    ? 'text-green-600'
                    : stats.avgSentenceLength <= 30
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}>
                  {stats.avgSentenceLength <= 20 ? 'Good' : stats.avgSentenceLength <= 30 ? 'Slightly long' : 'Too long'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.readingTimeMin} min
                </div>
                <div className="text-sm text-gray-500">Reading Time</div>
                <div className="text-xs text-gray-400 mt-1">250 WPM</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.words}
                </div>
                <div className="text-sm text-gray-500">Total Words</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.paragraphs}
                </div>
                <div className="text-sm text-gray-500">Paragraphs</div>
              </div>
            </div>
          </Card>

          {/* SEO Tips */}
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">SEO Writing Tips</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Keep title tags 50-60 characters with main keyword</li>
              <li>Meta descriptions should be 150-160 chars with call-to-action</li>
              <li>Average sentence length under 20 words improves readability</li>
              <li>Break content into 3-4 sentence paragraphs</li>
            </ul>
          </div>
        </div>
      )}

      {/* Platform Limits */}
      {viewMode === 'platform' && (
        <div className="space-y-2">
          {PLATFORM_LIMITS.map((platform) => {
            const current = platform.type === 'byte' ? stats.bytes : stats.chars;
            const percent = Math.min(100, (current / platform.limit) * 100);
            const isOver = current > platform.limit;

            return (
              <Card key={platform.name} variant="bordered" className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="font-medium text-sm">{platform.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {platform.description}
                    </span>
                  </div>
                  <div className={`text-sm font-mono ${isOver ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    {current.toLocaleString()} / {platform.limit.toLocaleString()}
                    {platform.type === 'byte' ? 'B' : ''}
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isOver
                        ? 'bg-red-500'
                        : percent > 90
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
                {isOver && (
                  <p className="text-xs text-red-600 mt-1">
                    {current - platform.limit}{platform.type === 'byte' ? 'B' : ' chars'} over limit
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Result sharing */}
      <ResultShareButtonsEn
        url={getShareUrl()}
        title={`Characters: ${stats.chars}`}
        description={`${stats.words} words, ${stats.sentences} sentences`}
        visible={text.trim().length > 0}
      />

      {/* Help text */}
      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>• Characters: Total count including spaces</p>
        <p>• Bytes: UTF-8 encoding size</p>
        <p>• Reading time: Based on 250 words per minute</p>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoMeter({
  label,
  current,
  min,
  max,
  limit
}: {
  label: string;
  current: number;
  min: number;
  max: number;
  limit: number;
}) {
  const getStatus = () => {
    if (current === 0) return { color: 'gray', text: 'Waiting...' };
    if (current < min) return { color: 'yellow', text: 'Too short' };
    if (current >= min && current <= max) return { color: 'green', text: 'Perfect' };
    if (current > max && current <= limit) return { color: 'yellow', text: 'Slightly long' };
    return { color: 'red', text: 'Too long' };
  };

  const status = getStatus();
  const percent = Math.min(100, (current / limit) * 100);

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className={`font-medium text-${status.color}-600`}>
          {current} chars - {status.text}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
        {/* Recommended range indicator */}
        <div
          className="absolute h-full bg-green-200 dark:bg-green-900"
          style={{
            left: `${(min / limit) * 100}%`,
            width: `${((max - min) / limit) * 100}%`
          }}
        />
        {/* Current position */}
        <div
          className={`h-full transition-all duration-300 ${
            status.color === 'green'
              ? 'bg-green-500'
              : status.color === 'yellow'
                ? 'bg-yellow-500'
                : status.color === 'red'
                  ? 'bg-red-500'
                  : 'bg-gray-400'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📝 What Is a Character Counter?
        </h2>
        <p className="text-sm leading-relaxed">
          A character counter is a tool that instantly calculates the number of characters, words, sentences,
          paragraphs, and bytes in your text. It is essential for checking platform character limits like
          Twitter (280 characters), Instagram captions (2,200 characters), and YouTube titles (100 characters).
          It also helps optimize SEO meta tags by ensuring your title stays under 60 characters
          and your description within 155-160 characters.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Common Platform Character Limits
        </h2>
        <div className="text-sm leading-relaxed space-y-1">
          <p><strong>Twitter (X):</strong> 280 characters</p>
          <p><strong>Instagram Caption:</strong> 2,200 characters</p>
          <p><strong>YouTube Title:</strong> 100 characters (recommended 60)</p>
          <p><strong>Facebook Post:</strong> 63,206 characters (recommended under 250)</p>
          <p><strong>LinkedIn Post:</strong> 3,000 characters</p>
          <p><strong>SEO Title Tag:</strong> ~60 characters</p>
          <p><strong>SEO Meta Description:</strong> 155-160 characters</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Understanding Byte Size
        </h2>
        <p className="text-sm leading-relaxed">
          Different characters use different amounts of storage. In UTF-8 encoding, English letters and numbers
          use 1 byte each, while characters from other scripts (Chinese, Japanese, Korean, etc.) typically use 3 bytes.
          Emojis can use 4 bytes. This is important when working with database field limits, API payload sizes,
          or SMS messages (160 characters for standard SMS, 70 for Unicode).
        </p>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Are spaces included in the character count?',
            answer: 'Yes, spaces are included by default. The tool also shows character count without spaces, so you can use whichever metric you need.',
          },
          {
            question: 'How are words counted?',
            answer: 'Words are counted by splitting text on whitespace. Consecutive spaces are treated as a single separator. Hyphenated words count as one word.',
          },
          {
            question: 'Is my text sent to any server?',
            answer: 'No, all counting is done locally in your browser using JavaScript. Your text never leaves your device, ensuring complete privacy.',
          },
        ]}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  unit = '',
  highlight = false,
}: {
  label: string;
  value: number;
  unit?: string;
  highlight?: boolean;
}) {
  return (
    <Card
      variant="bordered"
      className={`p-4 text-center ${
        highlight ? 'border-blue-500 dark:border-blue-400' : ''
      }`}
    >
      <div
        className={`text-2xl md:text-3xl font-bold ${
          highlight
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-900 dark:text-white'
        }`}
      >
        {value.toLocaleString()}
        {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {label}
      </div>
    </Card>
  );
}
