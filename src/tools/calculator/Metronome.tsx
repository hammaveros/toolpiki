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
const SCHEDULE_AHEAD_TIME = 0.1; // 초 단위로 미리 스케줄링할 시간
const LOOKAHEAD = 25; // 스케줄러 실행 간격(ms)
const TAP_RESET_MS = 2000; // 이 시간 이상 텀이 생기면 탭 기록 초기화

export function Metronome() {
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

  // 클릭음 하나를 오디오 타임라인의 정확한 시각에 예약
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

  // lookahead 스케줄러: 짧은 간격으로 깨어나 앞으로 필요한 노트를 미리 예약
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

  // 예약된 노트 큐를 보고 화면에 표시할 현재 비트를 갱신
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

  // 언마운트 시 오디오/타이머 정리
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

  // 탭 템포: 탭 간격의 평균으로 BPM 계산
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
      {/* BPM 컨트롤 */}
      <Card variant="bordered" className="p-6">
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-gray-900 dark:text-white font-mono tabular-nums">
            {bpm}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">BPM (분당 박자 수)</div>
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
            aria-label="BPM 1 감소"
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
            aria-label="BPM 1 증가"
          >
            +1
          </Button>
        </div>

        <div className="flex gap-2 justify-center flex-wrap">
          <Button onClick={toggle} size="lg" className="w-36">
            {isPlaying ? '정지' : '시작'}
          </Button>
          <Button variant="secondary" size="lg" onClick={handleTap}>
            탭 템포 {tapCount > 0 && tapCount < 2 ? `(${tapCount})` : ''}
          </Button>
        </div>
      </Card>

      {/* 박자 선택 */}
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

      {/* 비트 시각화 */}
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
            시작 버튼을 누르면 박자에 맞춰 점이 깜빡입니다
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
          🎵 메트로놈이란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">메트로놈은 일정한 박자를 클릭음으로 알려주어 연주자가 정확한 템포를 유지하도록 돕는 도구입니다.</strong>{' '}
          이 도구는 <strong>Web Audio API</strong>를 사용해 브라우저 안에서 직접 클릭음을 생성하며, 별도 설치나 네트워크 연결 없이 동작합니다.
          <strong>30~300 BPM</strong> 범위에서 템포를 조절할 수 있고, <strong>2/4, 3/4, 4/4, 6/8</strong> 박자를 지원하며 매 마디 첫 박에는 강세(악센트)를 넣어 마디의 시작을 쉽게 구분할 수 있습니다.
        </p>

        <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
          <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 핵심 포인트</p>
          <p className="text-blue-800 dark:text-blue-300">
            <strong>정확한 타이밍</strong>을 위해 오디오 타임라인에 클릭음을 미리 예약하는 <strong>lookahead 스케줄러</strong> 방식을 사용해, 브라우저 렌더링 지연에도 박자가 흔들리지 않습니다.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📖 사용 방법
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>BPM 조절</strong> — 슬라이더나 숫자 입력, +1/-1 버튼으로 원하는 템포를 맞춥니다.</li>
          <li><strong>탭 템포</strong> — 곡의 박자에 맞춰 &quot;탭 템포&quot; 버튼을 두 번 이상 누르면 간격을 분석해 자동으로 BPM을 계산합니다.</li>
          <li><strong>박자 선택</strong> — 곡에 맞는 박자표(2/4, 3/4, 4/4, 6/8)를 선택하면 마디당 박자 수가 바뀝니다.</li>
          <li><strong>시작/정지</strong> — 시작 버튼을 누르면 클릭음과 함께 점이 박자에 맞춰 깜빡이고, 첫 박은 더 크고 높은 소리로 강조됩니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 연습 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>느리게 시작</strong>: 목표 템포보다 20~30% 느리게 연습한 뒤 점진적으로 올리세요.</li>
          <li><strong>정확도 우선</strong>: 빠르게 틀리게 치는 것보다 느리더라도 정확하게 치는 습관이 중요합니다.</li>
          <li><strong>박자표 확인</strong>: 곡의 박자표와 다르게 연습하면 리듬감이 어긋날 수 있으니 악보의 박자표를 먼저 확인하세요.</li>
          <li><strong>강박 느끼기</strong>: 첫 박(강박)에 몸의 무게 중심을 살짝 싣는 느낌으로 연습하면 리듬감이 좋아집니다.</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '소리가 나지 않아요.',
            answer: '브라우저 정책상 사용자의 클릭 등 상호작용이 있어야 오디오 재생이 허용됩니다. 시작 버튼을 직접 눌러주세요. 또한 기기의 음소거 여부와 브라우저 탭 음소거 설정도 확인해 보세요.',
          },
          {
            question: '탭 템포는 어떻게 사용하나요?',
            answer: '연주하려는 곡의 박자에 맞춰 "탭 템포" 버튼을 최소 2번 이상, 일정한 간격으로 눌러주세요. 누른 간격들의 평균을 계산해 자동으로 BPM이 설정됩니다. 2초 이상 텀이 생기면 새로 탭한 것으로 간주해 다시 계산합니다.',
          },
          {
            question: '6/8박자는 4/4박자와 뭐가 다른가요?',
            answer: '4/4는 한 마디에 4분음표 4개가 들어가는 박자이고, 6/8은 한 마디에 8분음표 6개가 들어가는 박자입니다. 6/8은 보통 2개의 큰 그룹(3+3)으로 느껴지는 겹박자로, 왈츠나 셔플 리듬의 곡에서 자주 쓰입니다.',
          },
        ]}
      />
    </div>
  );
}
