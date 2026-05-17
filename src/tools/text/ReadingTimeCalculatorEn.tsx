'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';
import { Button } from '@/components/ui/Button';

type CalcMode = 'text' | 'slides' | 'target';
type SpeedLevel = 'slow' | 'normal' | 'fast';

interface SpeedConfig {
  readWpm: number;   // words per minute (reading)
  speakWpm: number;  // words per minute (speaking)
  label: string;
}

const speeds: Record<SpeedLevel, SpeedConfig> = {
  slow: { readWpm: 150, speakWpm: 100, label: 'Slow' },
  normal: { readWpm: 250, speakWpm: 160, label: 'Normal' },
  fast: { readWpm: 350, speakWpm: 230, label: 'Fast' },
};

function formatTime(minutes: number): string {
  if (minutes < 1) {
    return `${Math.round(minutes * 60)} sec`;
  } else if (minutes < 60) {
    const m = Math.floor(minutes);
    const s = Math.round((minutes - m) * 60);
    return s > 0 ? `${m} min ${s} sec` : `${m} min`;
  } else {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
  }
}

export function ReadingTimeCalculatorEn() {
  const [mode, setMode] = useState<CalcMode>('text');
  const [text, setText] = useState('');
  const [speed, setSpeed] = useState<SpeedLevel>('normal');

  // Slides mode
  const [slideCount, setSlideCount] = useState('');
  const [secsPerSlide, setSecsPerSlide] = useState('60');

  // Target time mode
  const [targetMinutes, setTargetMinutes] = useState('');

  const modeOptions: { value: CalcMode; label: string; icon: string }[] = [
    { value: 'text', label: 'Text Input', icon: '📝' },
    { value: 'slides', label: 'Slide Calculator', icon: '📊' },
    { value: 'target', label: 'Target Time', icon: '🎯' },
  ];

  const speedOptions: { value: SpeedLevel; label: string; readDesc: string; speakDesc: string }[] = [
    { value: 'slow', label: 'Slow', readDesc: '150 WPM', speakDesc: '100 WPM' },
    { value: 'normal', label: 'Normal', readDesc: '250 WPM', speakDesc: '160 WPM' },
    { value: 'fast', label: 'Fast', readDesc: '350 WPM', speakDesc: '230 WPM' },
  ];

  // Text mode analysis
  const textAnalysis = useMemo(() => {
    if (mode !== 'text' || !text.trim()) return null;

    const totalChars = text.length;
    const totalWords = text.trim().split(/\s+/).length;

    const config = speeds[speed];

    const readMinutes = totalWords / config.readWpm;
    const speakMinutes = totalWords / config.speakWpm;

    return {
      totalChars,
      totalWords,
      readingTime: formatTime(readMinutes),
      readingMinutes: readMinutes,
      speakingTime: formatTime(speakMinutes),
      speakingMinutes: speakMinutes,
    };
  }, [text, speed, mode]);

  // Slides mode calculation
  const slideAnalysis = useMemo(() => {
    if (mode !== 'slides') return null;
    const slides = parseInt(slideCount) || 0;
    const secs = parseInt(secsPerSlide) || 60;
    if (slides <= 0) return null;

    const totalSecs = slides * secs;
    const totalMin = totalSecs / 60;

    return {
      slides,
      secsPerSlide: secs,
      totalTime: formatTime(totalMin),
      totalMinutes: totalMin,
      suggestedWords: Math.round(totalMin * speeds[speed].speakWpm),
    };
  }, [slideCount, secsPerSlide, speed, mode]);

  // Target time reverse calculation
  const targetAnalysis = useMemo(() => {
    if (mode !== 'target') return null;
    const mins = parseFloat(targetMinutes) || 0;
    if (mins <= 0) return null;

    const config = speeds[speed];

    return {
      targetMinutes: mins,
      targetTime: formatTime(mins),
      readWords: Math.round(mins * config.readWpm),
      speakWords: Math.round(mins * config.speakWpm),
      suggestedSlides: Math.round(mins * 60 / 60),
    };
  }, [targetMinutes, speed, mode]);

  return (
    <div className="space-y-2">
      {/* Mode selection */}
      <div className="flex gap-2">
        {modeOptions.map((option) => (
          <Button
            key={option.value}
            variant={mode === option.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setMode(option.value)}
            className="flex-1"
          >
            <span className="mr-1">{option.icon}</span>
            {option.label}
          </Button>
        ))}
      </div>

      {/* Speed selection */}
      <div className="flex gap-2">
        {speedOptions.map((option) => (
          <Button
            key={option.value}
            variant={speed === option.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSpeed(option.value)}
            className="flex-1"
          >
            <div>
              <div>{option.label}</div>
              <div className="text-xs opacity-70">
                {mode === 'text' ? option.readDesc : option.speakDesc}
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* Text input mode */}
      {mode === 'text' && (
        <>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to calculate reading and speaking time..."
            rows={8}
          />

          {textAnalysis && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Card variant="bordered" className="p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reading Time</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {textAnalysis.readingTime}
                  </p>
                </Card>
                <Card variant="bordered" className="p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Speaking Time</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {textAnalysis.speakingTime}
                  </p>
                </Card>
              </div>

              <Card variant="bordered" className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Total Characters</p>
                    <p className="font-medium">{textAnalysis.totalChars.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Total Words</p>
                    <p className="font-medium">{textAnalysis.totalWords.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </>
      )}

      {/* Slides mode */}
      {mode === 'slides' && (
        <>
          <Card variant="bordered" className="p-4 space-y-4">
            <Input
              label="Number of Slides"
              type="number"
              min="1"
              value={slideCount}
              onChange={(e) => setSlideCount(e.target.value)}
              placeholder="e.g., 20"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Time per Slide
              </label>
              <div className="flex gap-2">
                {[
                  { value: '30', label: '30s' },
                  { value: '60', label: '1 min' },
                  { value: '90', label: '1.5 min' },
                  { value: '120', label: '2 min' },
                  { value: '180', label: '3 min' },
                ].map((opt) => (
                  <Button
                    key={opt.value}
                    variant={secsPerSlide === opt.value ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setSecsPerSlide(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {slideAnalysis && (
            <>
              <Card variant="bordered" className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Estimated Presentation Time</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {slideAnalysis.totalTime}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {slideAnalysis.slides} slides × {slideAnalysis.secsPerSlide}s
                </p>
              </Card>

              <Card variant="bordered" className="p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Suggested Script Length
                </p>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {slideAnalysis.suggestedWords.toLocaleString()} words
                  </p>
                </div>
              </Card>
            </>
          )}
        </>
      )}

      {/* Target time mode */}
      {mode === 'target' && (
        <>
          <Card variant="bordered" className="p-4 space-y-4">
            <Input
              label="Target Time (minutes)"
              type="number"
              min="1"
              step="0.5"
              value={targetMinutes}
              onChange={(e) => setTargetMinutes(e.target.value)}
              placeholder="e.g., 15"
            />
            <div className="flex gap-2 flex-wrap">
              {[5, 10, 15, 20, 30].map((m) => (
                <Button
                  key={m}
                  variant={targetMinutes === String(m) ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setTargetMinutes(String(m))}
                >
                  {m} min
                </Button>
              ))}
            </div>
          </Card>

          {targetAnalysis && (
            <>
              <Card variant="bordered" className="p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  📖 Words needed for {targetAnalysis.targetTime} of reading
                </p>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {targetAnalysis.readWords.toLocaleString()} words
                  </p>
                </div>
              </Card>

              <Card variant="bordered" className="p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  🎤 Words needed for {targetAnalysis.targetTime} presentation
                </p>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {targetAnalysis.speakWords.toLocaleString()} words
                  </p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
                  Suggested slides: ~{targetAnalysis.suggestedSlides} (at 1 min/slide)
                </p>
              </Card>
            </>
          )}
        </>
      )}

      {/* Reference */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Average reading speed: 200-250 words per minute</p>
        <p>• Average speaking speed: 120-180 words per minute</p>
        <p>• Presentations are slower due to pauses, emphasis, and audience interaction</p>
        <p>• Optimal blog length: 5-10 min (1,000-2,000 words)</p>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Reading Time & Presentation Time Calculator</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-white">This tool estimates how long it takes to read or present a piece of text based on average reading and speaking speeds.</strong>{' '}
          The average adult reads at <strong>200-250 WPM</strong>, while speaking rates during presentations are typically <strong>120-180 WPM</strong> due to pauses, emphasis, and audience interaction.
          <strong>Three modes</strong> are available: text input for direct measurement, slide calculator for presentation duration, and target time for working backwards from a time slot to script length.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Use Cases</h2>
        <ul className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
          <li><strong>Content creators &amp; bloggers</strong> — Ideal blog post length is <strong>1,000-2,000 words</strong>, a <strong>5-10 minute read</strong>.</li>
          <li><strong>Public speakers</strong> — Use the slide calculator with slide count × time per slide for accurate planning.</li>
          <li><strong>Target time mode</strong> — Know your <strong>15-minute time slot</strong>? Get the exact script length instantly.</li>
          <li><strong>Podcast scriptwriters &amp; YouTubers</strong> — Plan content length to fit intended time slots.</li>
        </ul>
      </div>

      <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 p-4 text-sm">
        <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">💡 Presentation tip</p>
        <p className="text-indigo-800 dark:text-indigo-300">
          Real-world delivery runs <strong>1.3-1.6× slower than reading</strong> due to pauses and audience interaction. Plan script length accordingly.
        </p>
      </div>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'How accurate is the reading time estimate?', answer: 'The estimate is based on widely accepted average reading speeds (200-250 WPM for adults). Actual reading time may vary depending on text complexity, reader proficiency, and distractions.' },
          { question: 'How is speaking time different from reading time?', answer: 'Speaking time uses a separate, slower speed (100-230 WPM vs 150-350 WPM for reading). This accounts for natural pauses, emphasis, audience interaction, and pacing that occur during verbal delivery.' },
          { question: 'How many slides should I have for a presentation?', answer: 'A common guideline is 1-2 minutes per slide. For a 15-minute presentation, aim for 8-15 slides depending on content density. Use the slide calculator to fine-tune your estimate.' },
        ]}
      />

      <div className="flex gap-4 text-sm">
        <a href="/en" className="text-blue-600 hover:underline">&larr; Home</a>
        <a href="/en/tools/character-counter-en" className="text-blue-600 hover:underline">Character Counter &rarr;</a>
      </div>
    </section>
  );
}
