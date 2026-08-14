'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

type SoundType = 'white' | 'pink' | 'brown' | 'rain' | 'ocean';
type BufferType = 'white' | 'pink' | 'brown';
type SleepMinutes = 0 | 15 | 30 | 60;

interface SoundOption {
  id: SoundType;
  emoji: string;
  label: string;
  description: string;
}

const SOUND_OPTIONS: SoundOption[] = [
  { id: 'white', emoji: '🌫️', label: 'White Noise', description: 'All frequencies mixed evenly' },
  { id: 'pink', emoji: '🌸', label: 'Pink Noise', description: 'Softer sound with boosted low end' },
  { id: 'brown', emoji: '🟤', label: 'Brown Noise', description: 'Deeper, heavier low-frequency sound' },
  { id: 'rain', emoji: '🌧️', label: 'Rain', description: 'Filtered noise shaped into rainfall' },
  { id: 'ocean', emoji: '🌊', label: 'Ocean Waves', description: 'Slow amplitude modulation of waves' },
];

const SLEEP_OPTIONS: { value: SleepMinutes; label: string }[] = [
  { value: 0, label: 'Off' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '60 min' },
];

const BUFFER_SECONDS = 3;

// ── Noise buffer generators (everything is synthesized live in the browser, no audio files) ──

function createWhiteNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const length = ctx.sampleRate * BUFFER_SECONDS;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function createPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const length = ctx.sampleRate * BUFFER_SECONDS;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  // Paul Kellet's refined pink noise approximation
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
    data[i] = pink * 0.11;
  }
  return buffer;
}

function createBrownNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const length = ctx.sampleRate * BUFFER_SECONDS;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  // Integrate (leaky integrator) white noise to bias energy toward low frequencies
  let lastOut = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 3.5;
  }
  return buffer;
}

function createNoiseBuffer(ctx: AudioContext, type: BufferType): AudioBuffer {
  switch (type) {
    case 'white': return createWhiteNoiseBuffer(ctx);
    case 'pink': return createPinkNoiseBuffer(ctx);
    case 'brown': return createBrownNoiseBuffer(ctx);
  }
}

interface SoundGraph {
  output: AudioNode;
  sources: AudioScheduledSourceNode[];
  nodes: AudioNode[];
}

function buildSoundGraph(
  ctx: AudioContext,
  type: SoundType,
  getBuffer: (bufferType: BufferType) => AudioBuffer
): SoundGraph {
  switch (type) {
    case 'white':
    case 'pink':
    case 'brown': {
      const source = ctx.createBufferSource();
      source.buffer = getBuffer(type);
      source.loop = true;
      return { output: source, sources: [source], nodes: [] };
    }
    case 'rain': {
      // Narrow white noise with a highpass + lowpass to get a "hiss" rainfall texture,
      // then slowly wobble the lowpass cutoff with an LFO for natural variation
      const source = ctx.createBufferSource();
      source.buffer = getBuffer('white');
      source.loop = true;

      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 1000;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 5000;

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.2;

      const lfoDepth = ctx.createGain();
      lfoDepth.gain.value = 1500;

      lfo.connect(lfoDepth);
      lfoDepth.connect(lowpass.frequency);

      source.connect(highpass);
      highpass.connect(lowpass);

      return {
        output: lowpass,
        sources: [source, lfo],
        nodes: [highpass, lfoDepth],
      };
    }
    case 'ocean': {
      // Smooth brown noise with a lowpass, then swell the overall volume with a slow
      // sine LFO to mimic waves rolling in and receding
      const source = ctx.createBufferSource();
      source.buffer = getBuffer('brown');
      source.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 500;

      const waveGain = ctx.createGain();
      waveGain.gain.value = 0.6;

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.12;

      const lfoDepth = ctx.createGain();
      lfoDepth.gain.value = 0.35;

      lfo.connect(lfoDepth);
      lfoDepth.connect(waveGain.gain);

      source.connect(lowpass);
      lowpass.connect(waveGain);

      return {
        output: waveGain,
        sources: [source, lfo],
        nodes: [lowpass, lfoDepth],
      };
    }
  }
}

function getAudioContextClass(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null;
  return (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ||
    null
  );
}

export function WhiteNoiseEn() {
  const [isSupported, setIsSupported] = useState(true);
  const [soundType, setSoundType] = useState<SoundType>('white');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(60);
  const [sleepMinutes, setSleepMinutes] = useState<SleepMinutes>(0);
  const [sleepRemaining, setSleepRemaining] = useState<number | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const bufferCacheRef = useRef<Partial<Record<BufferType, AudioBuffer>>>({});
  const activeSourcesRef = useRef<AudioScheduledSourceNode[]>([]);
  const activeNodesRef = useRef<AudioNode[]>([]);
  const sleepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sleepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check browser support (never runs during SSR)
  useEffect(() => {
    setIsSupported(!!getAudioContextClass());
  }, []);

  const getBuffer = useCallback((ctx: AudioContext, type: BufferType): AudioBuffer => {
    const cache = bufferCacheRef.current;
    if (!cache[type]) {
      cache[type] = createNoiseBuffer(ctx, type);
    }
    return cache[type]!;
  }, []);

  const ensureAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;

    if (audioContextRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }
      return audioContextRef.current;
    }

    const AudioContextClass = getAudioContextClass();
    if (!AudioContextClass) {
      setIsSupported(false);
      return null;
    }

    const ctx = new AudioContextClass();
    const masterGain = ctx.createGain();
    masterGain.gain.value = volume / 100;
    masterGain.connect(ctx.destination);

    audioContextRef.current = ctx;
    masterGainRef.current = masterGain;
    return ctx;
  }, [volume]);

  const stopAudioGraph = useCallback(() => {
    activeSourcesRef.current.forEach((node) => {
      try {
        node.stop();
      } catch {
        // Node already stopped, ignore
      }
    });
    activeSourcesRef.current = [];

    activeNodesRef.current.forEach((node) => {
      try {
        node.disconnect();
      } catch {
        // Node already disconnected, ignore
      }
    });
    activeNodesRef.current = [];
  }, []);

  const startAudioGraph = useCallback(
    (type: SoundType) => {
      const ctx = ensureAudioContext();
      const masterGain = masterGainRef.current;
      if (!ctx || !masterGain) return false;

      stopAudioGraph();

      const graph = buildSoundGraph(ctx, type, (bufferType) => getBuffer(ctx, bufferType));
      graph.output.connect(masterGain);

      graph.sources.forEach((source) => source.start());

      activeSourcesRef.current = graph.sources;
      activeNodesRef.current = [...graph.nodes, graph.output];
      return true;
    },
    [ensureAudioContext, getBuffer, stopAudioGraph]
  );

  const clearSleepTimers = useCallback(() => {
    if (sleepTimeoutRef.current) {
      clearTimeout(sleepTimeoutRef.current);
      sleepTimeoutRef.current = null;
    }
    if (sleepIntervalRef.current) {
      clearInterval(sleepIntervalRef.current);
      sleepIntervalRef.current = null;
    }
    setSleepRemaining(null);
  }, []);

  const handleStop = useCallback(() => {
    stopAudioGraph();
    clearSleepTimers();
    setIsPlaying(false);
  }, [stopAudioGraph, clearSleepTimers]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      handleStop();
      return;
    }

    const started = startAudioGraph(soundType);
    if (started) {
      setIsPlaying(true);
    }
  }, [isPlaying, handleStop, startAudioGraph, soundType]);

  const selectSound = useCallback(
    (type: SoundType) => {
      setSoundType(type);
      if (isPlaying) {
        startAudioGraph(type);
      }
    },
    [isPlaying, startAudioGraph]
  );

  const handleVolumeChange = useCallback((value: number) => {
    setVolume(value);
    const ctx = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (ctx && masterGain) {
      masterGain.gain.setTargetAtTime(value / 100, ctx.currentTime, 0.01);
    }
  }, []);

  // Sleep timer: while playing, counts down and auto-stops when it reaches zero
  useEffect(() => {
    clearSleepTimers();

    if (isPlaying && sleepMinutes > 0) {
      const endTime = Date.now() + sleepMinutes * 60_000;
      setSleepRemaining(sleepMinutes * 60);

      sleepIntervalRef.current = setInterval(() => {
        const remain = Math.max(0, Math.round((endTime - Date.now()) / 1000));
        setSleepRemaining(remain);
      }, 1000);

      sleepTimeoutRef.current = setTimeout(() => {
        handleStop();
      }, sleepMinutes * 60_000);
    }

    return () => {
      if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
      if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, sleepMinutes]);

  // Clean up audio resources on unmount
  useEffect(() => {
    return () => {
      stopAudioGraph();
      if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
      if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current);
      audioContextRef.current?.close().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeSound = SOUND_OPTIONS.find((s) => s.id === soundType) ?? SOUND_OPTIONS[0];

  if (!isSupported) {
    return (
      <div className="space-y-2">
        <Card variant="bordered" className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Your browser does not support the Web Audio API, so this tool cannot run.
            Please use a recent version of Chrome, Edge, Safari, or Firefox.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Playback controls */}
      <Card variant="bordered" className="p-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{activeSound.emoji}</div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {activeSound.label}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {activeSound.description}
          </p>
        </div>

        <div className="flex justify-center mb-6">
          {!isPlaying ? (
            <Button onClick={togglePlay} size="lg" className="w-40">
              ▶ Play
            </Button>
          ) : (
            <Button onClick={togglePlay} variant="secondary" size="lg" className="w-40">
              ⏸ Stop
            </Button>
          )}
        </div>

        {/* Volume */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Volume: {volume}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </Card>

      {/* Sound picker */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Choose a Sound
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SOUND_OPTIONS.map((sound) => (
            <button
              key={sound.id}
              onClick={() => selectSound(sound.id)}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-lg border text-center transition-colors',
                soundType === sound.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              <span className="text-2xl">{sound.emoji}</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {sound.label}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Sleep timer */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Sleep Timer
        </h3>
        <div className="flex gap-2">
          {SLEEP_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSleepMinutes(opt.value)}
              className={cn(
                'flex-1 py-2 text-sm rounded-lg transition-colors',
                sleepMinutes === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {isPlaying && sleepMinutes > 0 && sleepRemaining !== null && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
            Stopping automatically in {formatTime(sleepRemaining)}
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
          🎧 What is White Noise / Ambient Sound?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">
            Noise and nature sounds synthesized live using only the browser&apos;s Web Audio API.
          </strong>{' '}
          No pre-recorded <strong>audio files are used at all</strong> — white, pink, and brown noise, along with
          rain and ocean waves, are all computed on the spot.
          Useful for <strong>focus, sleep, tinnitus relief, and masking background noise</strong>.
        </p>

        <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
          <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 Key takeaway</p>
          <p className="text-blue-800 dark:text-blue-300">
            <strong>Brown noise or ocean waves</strong> tend to suit sleep, while <strong>white or pink noise</strong> works well for focused work.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Noise Color Comparison
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Type</th>
                <th className="text-left py-2 px-2">Characteristics</th>
                <th className="text-left py-2 px-2">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">White Noise</td><td>All frequencies evenly balanced, brightest and sharpest</td><td>Focus, masking background noise</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Pink Noise</td><td>Energy decreases at higher frequencies, sounds natural</td><td>Studying, light background sound</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Brown Noise</td><td>Low-frequency heavy, softest and deepest</td><td>Sleep, tinnitus relief</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Rain</td><td>Filtered white noise with subtle variation</td><td>Relaxation, reading</td></tr>
              <tr><td className="py-2 px-2 font-medium">Ocean Waves</td><td>Brown noise with slow volume modulation</td><td>Meditation, unwinding</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔬 How Is the Sound Generated?
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          Everything is computed inside the browser the moment you press play. Since there are no stored audio sources,
          there is no file download or network request involved at all.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>White noise</strong> — raw random values every sample. Equal energy across all frequency bands.</li>
          <li><strong>Pink noise</strong> — random values passed through a multi-stage filter that boosts low-end energy and reduces highs.</li>
          <li><strong>Brown noise</strong> — random values are continuously integrated (summed), producing slower-changing values that sound much deeper and softer.</li>
          <li><strong>Rain</strong> — white noise narrowed with a highpass and lowpass filter, then an LFO (a slow oscillating signal) wobbles the filter cutoff to create raindrop-like variation.</li>
          <li><strong>Ocean waves</strong> — brown noise smoothed with a lowpass filter, with the overall volume swelling up and down on a roughly 10-second sine cycle.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Tips for Effective Use
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Keep the volume low</strong>: A level quieter than normal conversation is safer for extended listening.</li>
          <li><strong>Use the sleep timer</strong>: Set it to 15-30 minutes if you don&apos;t need playback to continue after you fall asleep.</li>
          <li><strong>Keep the tab open</strong>: Closing the browser tab stops playback immediately.</li>
          <li><strong>Speakers over headphones</strong>: For long background listening sessions, speakers are gentler on the ears than headphones.</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Is the sound streamed from a server?',
            answer: 'No. There are no audio files or network requests at all. The waveform is calculated in real time inside your browser using the Web Audio API.',
          },
          {
            question: "What's the difference between white, pink, and brown noise?",
            answer: 'White noise mixes all frequencies evenly and sounds the brightest. Pink noise reduces the high end for a more natural sound. Brown noise is dominated by low frequencies and sounds the softest and deepest. The sound gets darker and lower as you move from white to pink to brown.',
          },
          {
            question: 'Does the audio keep playing if I switch to another tab?',
            answer: 'Yes, playback continues even while viewing another tab or window. Closing the tab itself, however, stops it immediately.',
          },
          {
            question: 'If the sleep timer is running, does changing the sound reset it?',
            answer: 'Switching sounds by itself does not affect the timer. The timer is only recalculated when the playing state changes or when you pick a different duration (15/30/60).',
          },
          {
            question: 'I hear a brief click or gap in the sound.',
            answer: 'A very small discontinuity can occur at the loop boundary of the noise buffer. It is usually barely noticeable; lowering the volume slightly can help if it bothers you.',
          },
        ]}
      />
    </div>
  );
}
