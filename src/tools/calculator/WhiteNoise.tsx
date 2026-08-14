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
  { id: 'white', emoji: '🌫️', label: '화이트 노이즈', description: '모든 주파수가 고르게 섞인 소리' },
  { id: 'pink', emoji: '🌸', label: '핑크 노이즈', description: '저음이 강조된 부드러운 소리' },
  { id: 'brown', emoji: '🟤', label: '브라운 노이즈', description: '더 낮고 묵직한 소리' },
  { id: 'rain', emoji: '🌧️', label: '빗소리', description: '필터링된 노이즈로 만든 빗소리' },
  { id: 'ocean', emoji: '🌊', label: '파도 소리', description: '느린 진폭 변조로 만든 파도 소리' },
];

const SLEEP_OPTIONS: { value: SleepMinutes; label: string }[] = [
  { value: 0, label: '끄기' },
  { value: 15, label: '15분' },
  { value: 30, label: '30분' },
  { value: 60, label: '60분' },
];

const BUFFER_SECONDS = 3;

// ── 노이즈 버퍼 생성 함수 (전부 브라우저에서 실시간 합성, 외부 파일 없음) ──

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
  // Paul Kellet의 핑크 노이즈 근사 필터
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
  // 화이트 노이즈를 누적 적분(leaky integrator)해서 저음 위주로 만듦
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
      // 화이트 노이즈를 하이패스 + 로우패스로 좁혀 '쏴아' 하는 빗소리 질감을 만들고,
      // 저속 LFO로 로우패스 컷오프를 흔들어 자연스러운 변화를 줌
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
      // 브라운 노이즈를 로우패스로 부드럽게 만들고, 느린 사인파(LFO)로 볼륨을 밀물/썰물처럼 흔들어
      // 파도가 밀려왔다 빠지는 느낌을 만듦
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

export function WhiteNoise() {
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

  // 브라우저 지원 여부 확인 (SSR에서는 실행되지 않음)
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
        // 이미 정지된 노드는 무시
      }
    });
    activeSourcesRef.current = [];

    activeNodesRef.current.forEach((node) => {
      try {
        node.disconnect();
      } catch {
        // 이미 연결 해제된 노드는 무시
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

  // 수면 타이머: 재생 중이고 타이머가 설정되어 있으면 카운트다운 후 자동 정지
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

  // 언마운트 시 오디오 리소스 정리
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
            현재 브라우저는 Web Audio API를 지원하지 않아 이 도구를 사용할 수 없습니다.
            최신 버전의 Chrome, Edge, Safari, Firefox를 이용해주세요.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* 재생 컨트롤 */}
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
              ▶ 재생
            </Button>
          ) : (
            <Button onClick={togglePlay} variant="secondary" size="lg" className="w-40">
              ⏸ 정지
            </Button>
          )}
        </div>

        {/* 볼륨 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            볼륨: {volume}%
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

      {/* 사운드 선택 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          사운드 선택
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

      {/* 수면 타이머 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          수면 타이머
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
            {formatTime(sleepRemaining)} 후 자동 정지됩니다
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
          🎧 화이트 노이즈 / 앰비언트 사운드란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">
            브라우저의 Web Audio API만으로 실시간 합성한 노이즈와 자연음 사운드입니다.
          </strong>{' '}
          미리 녹음된 <strong>오디오 파일을 전혀 사용하지 않고</strong>, 화이트/핑크/브라운 노이즈부터
          빗소리·파도 소리까지 모두 그 자리에서 계산해서 만들어냅니다.
          <strong>집중, 수면, 이명 완화, 주변 소음 차단</strong> 등 다양한 목적으로 활용됩니다.
        </p>

        <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
          <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 핵심 포인트</p>
          <p className="text-blue-800 dark:text-blue-300">
            <strong>수면에는 브라운 노이즈나 파도 소리</strong>가, <strong>집중 작업에는 화이트/핑크 노이즈</strong>가 더 잘 맞는 경향이 있습니다.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 노이즈 색상별 차이
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">종류</th>
                <th className="text-left py-2 px-2">특징</th>
                <th className="text-left py-2 px-2">추천 용도</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">화이트 노이즈</td><td>모든 주파수가 균일, 가장 밝고 날카로운 소리</td><td>집중, 주변 소음 차단</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">핑크 노이즈</td><td>고음으로 갈수록 에너지 감소, 자연스러운 소리</td><td>학습, 가벼운 배경음</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">브라운 노이즈</td><td>저음 위주, 가장 부드럽고 묵직함</td><td>수면, 이명 완화</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">빗소리</td><td>필터링된 화이트 노이즈 + 미세한 변화</td><td>휴식, 독서</td></tr>
              <tr><td className="py-2 px-2 font-medium">파도 소리</td><td>브라운 노이즈 + 느린 볼륨 변조</td><td>명상, 이완</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔬 어떻게 소리가 만들어지나요?
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          모든 사운드는 재생 버튼을 누르는 순간 브라우저 안에서 계산됩니다. 저장된 음원이 없기 때문에 파일 다운로드나 네트워크 요청이 전혀 없습니다.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>화이트 노이즈</strong> — 매 순간 무작위 값을 그대로 사용합니다. 모든 주파수 대역의 에너지가 동일합니다.</li>
          <li><strong>핑크 노이즈</strong> — 무작위 값을 여러 단계의 필터에 통과시켜 저음 쪽 에너지를 키우고 고음을 줄입니다.</li>
          <li><strong>브라운 노이즈</strong> — 무작위 값을 계속 누적(적분)해서 만듭니다. 값이 천천히 변하기 때문에 훨씬 낮고 부드럽게 들립니다.</li>
          <li><strong>빗소리</strong> — 화이트 노이즈를 하이패스·로우패스 필터로 좁힌 뒤, 저속 LFO(진동 신호)로 필터 컷오프를 흔들어 빗방울이 흩날리는 듯한 변화를 줍니다.</li>
          <li><strong>파도 소리</strong> — 브라운 노이즈를 로우패스로 부드럽게 만들고, 10초 안팎 주기의 사인파로 볼륨 자체를 밀물/썰물처럼 오르내리게 합니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 효과적으로 사용하는 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>볼륨은 낮게</strong>: 대화 소리보다 낮은 볼륨이 장시간 청취에 안전합니다.</li>
          <li><strong>수면 타이머 활용</strong>: 잠들고 나서까지 계속 재생될 필요가 없다면 15~30분으로 설정하세요.</li>
          <li><strong>탭을 열어두기</strong>: 브라우저 탭을 닫으면 재생이 즉시 멈춥니다.</li>
          <li><strong>헤드폰보다 스피커</strong>: 장시간 배경음으로 쓸 때는 스피커 재생이 귀에 덜 부담됩니다.</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '소리가 서버에서 스트리밍되나요?',
            answer: '아니요. 오디오 파일이나 네트워크 요청이 전혀 없습니다. Web Audio API로 브라우저 안에서 실시간으로 파형을 계산해 만들어냅니다.',
          },
          {
            question: '화이트, 핑크, 브라운 노이즈의 차이가 뭔가요?',
            answer: '화이트는 모든 주파수가 고르게 섞인 가장 밝은 소리이고, 핑크는 고음이 줄어든 자연스러운 소리, 브라운은 저음 위주의 가장 부드럽고 낮은 소리입니다. 숫자가 뒤로 갈수록(화이트→핑크→브라운) 더 어둡고 낮게 들립니다.',
          },
          {
            question: '재생 중에 탭을 다른 창으로 전환해도 소리가 계속 나나요?',
            answer: '네, 다른 탭이나 창을 보고 있어도 오디오는 계속 재생됩니다. 다만 탭 자체를 닫으면 즉시 멈춥니다.',
          },
          {
            question: '수면 타이머를 켠 상태에서 사운드를 바꾸면 타이머가 초기화되나요?',
            answer: '사운드 종류를 바꾸는 것 자체는 타이머에 영향을 주지 않습니다. 타이머는 재생 상태와 설정된 분(15/30/60)이 바뀔 때만 새로 계산됩니다.',
          },
          {
            question: '소리가 갑자기 끊기거나 클릭 잡음이 들려요.',
            answer: '노이즈 버퍼가 반복 재생(loop)되는 경계 지점에서 아주 미세한 불연속이 생길 수 있습니다. 대부분 알아채기 어려운 수준이며, 신경 쓰인다면 볼륨을 조금 낮춰보세요.',
          },
        ]}
      />
    </div>
  );
}
