'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { Button } from '@/components/ui/Button';

type MessageType = 'email' | 'slack' | 'sms' | 'twitter';

interface LengthGuide {
  optimal: number;
  max: number;
  label: string;
}

const guides: Record<MessageType, LengthGuide> = {
  email: { optimal: 150, max: 500, label: 'Email' },
  slack: { optimal: 100, max: 300, label: 'Slack/Teams' },
  sms: { optimal: 140, max: 160, label: 'SMS' },
  twitter: { optimal: 200, max: 280, label: 'Twitter/X' },
};

export function MessageLengthCheckerEn() {
  const [text, setText] = useState('');
  const [type, setType] = useState<MessageType>('email');

  const analysis = useMemo(() => {
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lineCount = text ? text.split('\n').length : 0;
    const guide = guides[type];

    // Status determination
    let status: 'short' | 'optimal' | 'long' | 'too-long';
    let statusText: string;
    let statusColor: string;

    if (charCount === 0) {
      status = 'short';
      statusText = 'Enter text';
      statusColor = 'text-gray-400';
    } else if (charCount < guide.optimal * 0.3) {
      status = 'short';
      statusText = 'Short';
      statusColor = 'text-yellow-600 dark:text-yellow-400';
    } else if (charCount <= guide.optimal) {
      status = 'optimal';
      statusText = 'Optimal';
      statusColor = 'text-green-600 dark:text-green-400';
    } else if (charCount <= guide.max) {
      status = 'long';
      statusText = 'Slightly Long';
      statusColor = 'text-orange-600 dark:text-orange-400';
    } else {
      status = 'too-long';
      statusText = 'Too Long';
      statusColor = 'text-red-600 dark:text-red-400';
    }

    // Progress (based on max)
    const progress = Math.min((charCount / guide.max) * 100, 100);
    const optimalProgress = (guide.optimal / guide.max) * 100;

    return {
      charCount,
      wordCount,
      lineCount,
      status,
      statusText,
      statusColor,
      progress,
      optimalProgress,
      guide,
    };
  }, [text, type]);

  const typeOptions: { value: MessageType; label: string }[] = [
    { value: 'email', label: 'Email' },
    { value: 'slack', label: 'Slack/Teams' },
    { value: 'sms', label: 'SMS' },
    { value: 'twitter', label: 'Twitter/X' },
  ];

  return (
    <div className="space-y-2">
      {/* Message type selection */}
      <div className="flex gap-2">
        {typeOptions.map((option) => (
          <Button
            key={option.value}
            variant={type === option.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setType(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Text input */}
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your message..."
        rows={6}
      />

      {/* Result */}
      <Card variant="bordered" className="p-4">
        {/* Status display */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-2xl font-bold ${analysis.statusColor}`}>
            {analysis.statusText}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {analysis.charCount} / {analysis.guide.max} chars
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          {/* Optimal zone indicator */}
          <div
            className="absolute top-0 h-full bg-green-200 dark:bg-green-900"
            style={{ width: `${analysis.optimalProgress}%` }}
          />
          {/* Current progress */}
          <div
            className={`absolute top-0 h-full transition-all duration-200 ${
              analysis.status === 'too-long'
                ? 'bg-red-500'
                : analysis.status === 'long'
                ? 'bg-orange-500'
                : analysis.status === 'optimal'
                ? 'bg-green-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${analysis.progress}%` }}
          />
        </div>

        {/* Guidelines */}
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
          <span>0</span>
          <span>Optimal {analysis.guide.optimal}</span>
          <span>Max {analysis.guide.max}</span>
        </div>

        {/* Detailed info */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Characters</p>
            <p className="font-medium">{analysis.charCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Words</p>
            <p className="font-medium">{analysis.wordCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Lines</p>
            <p className="font-medium">{analysis.lineCount}</p>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Email: Keep summary under 150 chars, then elaborate</p>
        <p>• Slack/Teams: Keep readable without scrolling</p>
        <p>• SMS: Over 160 chars may split into multiple messages</p>
        <p>• Twitter/X: Maximum 280 characters</p>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">What is a Message Length Checker?</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          A message length checker helps you ensure your messages fit within the recommended character limits for different communication platforms.
          Each platform has its own optimal length for maximum engagement. Emails with subject lines under 50 characters and body summaries under 150 characters tend to have higher open and response rates.
          Slack and Teams messages are most effective when kept under 100 characters so recipients can read them without scrolling.
          Standard SMS messages are limited to 160 characters for Latin-based text. Exceeding this limit causes the message to be split into multiple segments, which may increase costs and reduce readability.
          Twitter/X enforces a strict 280-character cap, making every character count for concise communication.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Platform Limits at a Glance</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Understanding platform-specific character limits is essential for effective digital communication. SMS messages using GSM-7 encoding support up to 160 characters per segment, while Unicode messages (used for non-Latin scripts or special characters) are limited to 70 characters per segment.
          Push notifications on iOS typically display around 110 characters on the lock screen, so keeping alerts short ensures the full message is visible.
          Marketing emails with preview text under 90 characters perform best since most email clients truncate longer previews.
          This tool provides real-time visual feedback with a progress bar and status indicators (Short, Optimal, Slightly Long, Too Long), along with character count, word count, and line count to help you craft the perfect message every time.
        </p>
      </div>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'What happens if my SMS exceeds 160 characters?', answer: 'SMS messages over 160 characters are automatically split into multiple segments. Each segment is billed separately, and the maximum per-segment length drops to 153 characters due to concatenation headers.' },
          { question: 'What is the ideal email subject line length?', answer: 'Research suggests keeping email subject lines between 30 and 50 characters for optimal open rates. Mobile devices typically display only about 30 characters, so front-loading keywords is recommended.' },
          { question: 'Does the character count include spaces?', answer: 'Yes, spaces are counted as characters on all platforms. This is important because SMS and Twitter/X limits include spaces in their character count calculations.' },
        ]}
      />

      <div className="flex gap-4 text-sm">
        <a href="/en" className="text-blue-600 hover:underline">&larr; Home</a>
        <a href="/en/tools/character-counter-en" className="text-blue-600 hover:underline">Character Counter &rarr;</a>
      </div>
    </section>
  );
}
