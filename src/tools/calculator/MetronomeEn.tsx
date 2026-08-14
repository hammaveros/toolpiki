'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

type TimeSignature = '2/4' | '3/4' | '4/4' | '6/8';

interface ScheduledNote {
  beat: number;
  time: number;
}

const BEATS_PER_MEASURE: Record<TimeSignature, number> = {
  '2/4': 2,
  '3/4': 3,
  '4/4': 4,
  '6/8': 6,
};

const TIME_SIGNATURES: TimeSignature[] = ['2/4', '3/4', '4/4', '6/8'];

const MIN_BPM = 30;
const MAX_BPM = 300;
const SCHEDULE_AHEAD_TIME = 0.1; // how far ahead to schedule notes, in seconds
const LOOKAHEAD = 25; // how often the scheduler wakes up, in ms
const TAP_RESET_MS = 2000; // reset tap history if the gap exceeds this

export function MetronomeEn() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [tapCount, setTapCount] = useState(0);

  const bpmRef = useRef(bpm);
  const timeSignatureRef = useRef(timeSignature);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerIdRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentBeatNumberRef = useRef(0);
  const notesInQueueRef = useRef<ScheduledNote[]>([]);
  const tapTimesRef = useRef<number[]>([]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    timeSignatureRef.current = timeSignature;
  }, [timeSignature]);

  // Schedule a single click at a precise point on the audio timeline
  const scheduleNote = useCallback((beatNumber: number, time: number) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    notesInQueueRef.current.push({ beat: beatNumber, time });

    const isAccent = beatNumber === 0;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = isAccent ? 1000 : 750;

    const peakGain = isAccent ? 1 : 0.55;
    gainNode.gain.setValueAtTime(0.0001, time);
    gainNode.gain.exponentialRampToValueAtTime(peakGain, time + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.06);
  }, []);

  // Lookahead scheduler: wakes up frequently and schedules upcoming notes ahead of time
  const scheduler = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    while (nextNoteTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD_TIME) {
      scheduleNote(currentBeatNumberRef.current, nextNoteTimeRef.current);

      const secondsPerBeat = 60.0 / bpmRef.current;
      nextNoteTimeRef.current += secondsPerBeat;

      const beatsPerMeasure = BEATS_PER_MEASURE[timeSignatureRef.current];
      currentBeatNumberRef.current = (currentBeatNumberRef.current + 1) % beatsPerMeasure;
    }
  }, [scheduleNote]);

  // Reads the scheduled-note queue and updates which beat is highlighted on screen
  const drawLoop = useCallback(() => {
    const ctx = audioContextRef.current;
    if (ctx) {
      let lastBeat = -1;
      while (notesInQueueRef.current.length && notesInQueueRef.current[0].time < ctx.currentTime) {
        lastBeat = notesInQueueRef.current[0].beat;
        notesInQueueRef.current.shift();
      }
      if (lastBeat !== -1) {
        setCurrentBeat(lastBeat);
      }
    }
    rafIdRef.current = requestAnimationFrame(drawLoop);
  }, []);

  const stop = useCallback(() => {
    if (timerIdRef.current !== null) {
      window.clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    notesInQueueRef.current = [];
    setIsPlaying(false);
    setCurrentBeat(-1);
  }, []);

  const start = useCallback(() => {
    if (typeof window === 'undefined') return;

    const AudioContextClass: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;
    currentBeatNumberRef.current = 0;
    notesInQueueRef.current = [];
    nextNoteTimeRef.current = ctx.currentTime + 0.05;

    timerIdRef.current = window.setInterval(scheduler, LOOKAHEAD);
    rafIdRef.current = requestAnimationFrame(drawLoop);

    setIsPlaying(true);
  }, [scheduler, drawLoop]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  // Clean up audio and timers on unmount
  useEffect(() => {
    return () => {
      if (timerIdRef.current !== null) window.clearInterval(timerIdRef.current);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    };
  }, []);

  const handleBpmChange = (value: number) => {
    if (Number.isNaN(value)) return;
    setBpm(Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(value))));
  };

  // Tap tempo: compute BPM from the average interval between taps
  const handleTap = useCallback(() => {
    if (typeof window === 'undefined') return;
    const now = performance.now();
    const taps = tapTimesRef.current;

    if (taps.length > 0 && now - taps[taps.length - 1] > TAP_RESET_MS) {
      tapTimesRef.current = [];
    }

    tapTimesRef.current.push(now);
    if (tapTimesRef.current.length > 8) {
      tapTimesRef.current = tapTimesRef.current.slice(-8);
    }
    setTapCount(tapTimesRef.current.length);

    if (tapTimesRef.current.length >= 2) {
      const times = tapTimesRef.current;
      const intervals: number[] = [];
      for (let i = 1; i < times.length; i++) {
        intervals.push(times[i] - times[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const newBpm = Math.round(60000 / avgInterval);
      handleBpmChange(newBpm);
    }
  }, []);

  const beatsPerMeasure = BEATS_PER_MEASURE[timeSignature];

  return (
    <div className="space-y-2">
      {/* BPM Controls */}
      <Card variant="bordered" className="p-6">
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-gray-900 dark:text-white font-mono tabular-nums">
            {bpm}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">BPM (beats per minute)</div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-gray-400 w-8 text-right">{MIN_BPM}</span>
          <input
            type="range"
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpm}
            onChange={(e) => handleBpmChange(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-400 w-8">{MAX_BPM}</span>
        </div>

        <div className="flex items-center justify-center gap-3 mb-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleBpmChange(bpm - 1)}
            aria-label="Decrease BPM by 1"
          >
            -1
          </Button>
          <input
            type="number"
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpm}
            onChange={(e) => handleBpmChange(Number(e.target.value))}
            className="w-24 px-3 py-2 text-center text-lg font-bold rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleBpmChange(bpm + 1)}
            aria-label="Increase BPM by 1"
          >
            +1
          </Button>
        </div>

        <div className="flex gap-2 justify-center flex-wrap">
          <Button onClick={toggle} size="lg" className="w-36">
            {isPlaying ? 'Stop' : 'Start'}
          </Button>
          <Button variant="secondary" size="lg" onClick={handleTap}>
            Tap Tempo {tapCount > 0 && tapCount < 2 ? `(${tapCount})` : ''}
          </Button>
        </div>
      </Card>

      {/* Time Signature */}
      <Card variant="bordered" className="p-2">
        <div className="flex gap-1">
          {TIME_SIGNATURES.map((sig) => (
            <button
              key={sig}
              onClick={() => setTimeSignature(sig)}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                timeSignature === sig
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              {sig}
            </button>
          ))}
        </div>
      </Card>

      {/* Beat Visualizer */}
      <Card variant="bordered" className="p-6">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {Array.from({ length: beatsPerMeasure }).map((_, i) => {
            const isActive = isPlaying && currentBeat === i;
            const isAccent = i === 0;
            return (
              <div
                key={i}
                className={cn(
                  'rounded-full transition-all duration-75 flex items-center justify-center',
                  isAccent ? 'w-8 h-8' : 'w-6 h-6',
                  isActive
                    ? isAccent
                      ? 'bg-blue-600 scale-110 shadow-lg shadow-blue-500/50'
                      : 'bg-blue-400 scale-110'
                    : 'bg-gray-200 dark:bg-gray-700'
                )}
              >
                {isAccent && (
                  <span
                    className={cn(
                      'text-[10px] font-bold',
                      isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                    )}
                  >
                    1
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {!isPlaying && (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4">
            Press Start and the dots will pulse in time with the beat
          </p>
        )}
      </Card>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎵 What is a Metronome?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">A metronome produces a steady click at a fixed tempo, helping musicians keep accurate time while practicing or performing.</strong>{' '}
          This tool generates every click directly in your browser using the <strong>Web Audio API</strong> — no installation and no network connection required.
          Tempo is adjustable from <strong>30 to 300 BPM</strong>, with support for <strong>2/4, 3/4, 4/4, and 6/8</strong> time signatures, and the first beat of each measure is accented so you can always hear where the bar begins.
        </p>

        <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
          <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 Key point</p>
          <p className="text-blue-800 dark:text-blue-300">
            For accurate timing, clicks are pre-scheduled on the audio timeline using a <strong>lookahead scheduler</strong>, so the beat stays rock-solid even under browser rendering delays.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📖 How to Use
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Set the BPM</strong> — use the slider, the number field, or the +1/-1 buttons to dial in your tempo.</li>
          <li><strong>Tap Tempo</strong> — tap the &quot;Tap Tempo&quot; button at least twice in time with a song, and the interval between taps is used to calculate the BPM automatically.</li>
          <li><strong>Choose a time signature</strong> — pick the signature that matches your piece (2/4, 3/4, 4/4, 6/8) to change how many beats make up a measure.</li>
          <li><strong>Start/Stop</strong> — press Start to hear the click and watch the dots pulse in time; the first beat plays louder and higher-pitched for emphasis.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Practice Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Start slow</strong>: practice 20-30% below your target tempo, then increase it gradually.</li>
          <li><strong>Accuracy first</strong>: playing slowly but correctly builds better habits than playing fast with mistakes.</li>
          <li><strong>Check the time signature</strong>: practicing with the wrong signature can throw off your sense of rhythm, so confirm it against the sheet music first.</li>
          <li><strong>Feel the downbeat</strong>: shifting your weight slightly on the accented first beat helps internalize the rhythm.</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'I don’t hear any sound.',
            answer: 'Browsers require a user interaction, like a click, before audio playback is allowed, so make sure you pressed the Start button yourself. Also check that your device isn’t muted and that the browser tab isn’t muted.',
          },
          {
            question: 'How does tap tempo work?',
            answer: 'Tap the "Tap Tempo" button at least twice at a steady interval matching the song you want to play along with. The average gap between taps is used to set the BPM automatically. If more than 2 seconds pass between taps, the history resets and starts counting again.',
          },
          {
            question: 'What’s the difference between 6/8 and 4/4 time?',
            answer: '4/4 has four quarter-note beats per measure, while 6/8 has six eighth-note beats per measure. 6/8 is typically felt as two larger groups of three (a compound meter), and it’s common in waltz-like or shuffle-feel songs.',
          },
        ]}
      />
    </div>
  );
}
