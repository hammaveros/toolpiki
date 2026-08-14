'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

type Status = 'idle' | 'loading' | 'ready' | 'error';

// AudioBuffer → WAV(PCM 16bit) 인코딩
function encodeWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numFrames = buffer.length;
  const bytesPerSample = 2; // 16bit
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = numFrames * blockAlign;
  const bufferSize = 44 + dataSize;

  const arrayBuffer = new ArrayBuffer(bufferSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF 헤더
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  // fmt 청크
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // fmt 청크 크기
  view.setUint16(20, 1, true); // PCM 포맷
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // byteRate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bitsPerSample

  // data 청크
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // 채널 데이터를 인터리브하여 PCM 16bit로 변환
  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channelData.push(buffer.getChannelData(ch));
  }

  let offset = 44;
  for (let i = 0; i < numFrames; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channelData[ch][i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toFixed(2);
  return `${m}:${s.padStart(5, '0')}`;
}

export function AudioCutter() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fileName, setFileName] = useState('');
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCutting, setIsCutting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const playStartTimeRef = useRef(0);
  const playOffsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new Ctx();
    }
    return audioContextRef.current;
  }, []);

  const drawWaveform = useCallback((buffer: AudioBuffer) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;

    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      const start = i * step;
      const end = Math.min(start + step, data.length);
      for (let j = start; j < end; j++) {
        const v = data[j];
        if (v < min) min = v;
        if (v > max) max = v;
      }
      ctx.moveTo(i, (1 + min) * amp);
      ctx.lineTo(i, (1 + max) * amp);
    }
    ctx.stroke();
  }, []);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setStatus('loading');
    setErrorMsg('');
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const ctx = getAudioContext();
      const decoded = await new Promise<AudioBuffer>((resolve, reject) => {
        ctx.decodeAudioData(arrayBuffer.slice(0), resolve, reject);
      });

      audioBufferRef.current = decoded;
      setFileName(file.name);
      setDuration(decoded.duration);
      setStart(0);
      setEnd(decoded.duration);
      setStatus('ready');

      requestAnimationFrame(() => drawWaveform(decoded));
    } catch (err) {
      console.error('오디오 디코딩 실패:', err);
      setStatus('error');
      setErrorMsg('이 파일을 재생할 수 없습니다. 지원하는 형식(MP3, WAV, M4A, OGG)인지 확인해주세요.');
    }
  }, [getAudioContext, drawWaveform]);

  const stopPlayback = useCallback(() => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.onended = null;
        sourceNodeRef.current.stop();
      } catch {
        // 이미 정지된 경우 무시
      }
      sourceNodeRef.current = null;
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playSelection = useCallback(() => {
    const buffer = audioBufferRef.current;
    if (!buffer) return;
    if (end <= start) return;

    stopPlayback();

    const ctx = getAudioContext();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const playDuration = end - start;
    source.start(0, start, playDuration);
    sourceNodeRef.current = source;
    playStartTimeRef.current = ctx.currentTime;
    playOffsetRef.current = start;
    setIsPlaying(true);

    source.onended = () => {
      setIsPlaying(false);
      sourceNodeRef.current = null;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [start, end, getAudioContext, stopPlayback]);

  const handleCut = useCallback(async () => {
    const buffer = audioBufferRef.current;
    if (!buffer) return;
    if (end <= start) {
      setErrorMsg('종료 시간은 시작 시간보다 커야 합니다.');
      return;
    }

    setIsCutting(true);
    setErrorMsg('');

    try {
      const sampleRate = buffer.sampleRate;
      const startFrame = Math.floor(start * sampleRate);
      const endFrame = Math.min(Math.floor(end * sampleRate), buffer.length);
      const frameCount = Math.max(0, endFrame - startFrame);

      const OfflineCtx = window.OfflineAudioContext || (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext;
      const offlineCtx = new OfflineCtx(buffer.numberOfChannels, frameCount, sampleRate);

      const trimmedBuffer = offlineCtx.createBuffer(buffer.numberOfChannels, frameCount, sampleRate);
      for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
        const sourceData = buffer.getChannelData(ch);
        const targetData = trimmedBuffer.getChannelData(ch);
        targetData.set(sourceData.subarray(startFrame, endFrame));
      }

      const wavBlob = encodeWav(trimmedBuffer);

      setResultUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(wavBlob);
      });
      setResultSize(wavBlob.size);
    } catch (err) {
      console.error('자르기 실패:', err);
      setErrorMsg('자르기 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsCutting(false);
    }
  }, [start, end]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const baseName = fileName.replace(/\.[^/.]+$/, '') || 'audio';
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `${baseName}_trimmed.wav`;
    link.click();
  }, [resultUrl, fileName]);

  const reset = useCallback(() => {
    stopPlayback();
    audioBufferRef.current = null;
    setStatus('idle');
    setFileName('');
    setDuration(0);
    setStart(0);
    setEnd(0);
    setErrorMsg('');
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setResultSize(0);
  }, [stopPlayback]);

  // 언마운트 시 정리
  useEffect(() => {
    resultUrlRef.current = resultUrl;
  }, [resultUrl]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop();
        } catch {
          // 무시
        }
      }
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-6">
        <div className="space-y-4">
          {/* 업로드 영역 */}
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <div className="text-4xl mb-2">🎧</div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                클릭하거나 오디오 파일을 드래그하세요
              </p>
              <p className="text-sm text-gray-500">
                MP3, WAV, M4A, OGG 지원 • 브라우저에서만 처리되며 서버로 전송되지 않습니다
              </p>
            </div>
            <input
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.ogg"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {status === 'loading' && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              오디오 파일을 분석하는 중...
            </p>
          )}

          {status === 'error' && (
            <div className="text-sm px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded">
              {errorMsg}
            </div>
          )}

          {status === 'ready' && (
            <>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{fileName}</span>
                <span className="ml-2 text-gray-400">전체 길이 {formatTime(duration)}</span>
              </div>

              {/* 파형 캔버스 */}
              <div className="relative w-full">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={120}
                  className="w-full h-[120px] rounded bg-gray-100 dark:bg-gray-800"
                />
              </div>

              {/* 구간 설정 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    시작: {formatTime(start)}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    step={0.01}
                    value={start}
                    onChange={(e) => {
                      const v = Math.min(Number(e.target.value), end);
                      setStart(v);
                    }}
                    className="w-full"
                  />
                  <input
                    type="number"
                    min={0}
                    max={duration}
                    step={0.01}
                    value={start.toFixed(2)}
                    onChange={(e) => {
                      const v = Math.max(0, Math.min(Number(e.target.value), end));
                      setStart(v);
                    }}
                    className="mt-2 w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    종료: {formatTime(end)}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    step={0.01}
                    value={end}
                    onChange={(e) => {
                      const v = Math.max(Number(e.target.value), start);
                      setEnd(v);
                    }}
                    className="w-full"
                  />
                  <input
                    type="number"
                    min={0}
                    max={duration}
                    step={0.01}
                    value={end.toFixed(2)}
                    onChange={(e) => {
                      const v = Math.min(duration, Math.max(Number(e.target.value), start));
                      setEnd(v);
                    }}
                    className="mt-2 w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                선택 구간 길이: <span className="font-mono">{formatTime(Math.max(0, end - start))}</span>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-2 flex-wrap">
                {!isPlaying ? (
                  <Button variant="secondary" onClick={playSelection} disabled={end <= start}>
                    ▶ 선택 구간 미리듣기
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={stopPlayback}>
                    ⏸ 정지
                  </Button>
                )}
                <Button onClick={handleCut} disabled={isCutting || end <= start}>
                  {isCutting ? '자르는 중...' : '✂ 자르기'}
                </Button>
                <Button variant="ghost" onClick={reset}>
                  초기화
                </Button>
              </div>

              {errorMsg && status === 'ready' && (
                <div className="text-sm px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded">
                  {errorMsg}
                </div>
              )}

              {/* 결과 */}
              {resultUrl && (
                <Card variant="bordered" className="p-4 bg-green-50 dark:bg-green-900/10">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <p className="font-medium text-green-700 dark:text-green-400">자르기 완료 (WAV)</p>
                      <p className="text-gray-500 dark:text-gray-400">
                        길이 {formatTime(Math.max(0, end - start))} • 크기 {formatSize(resultSize)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <audio controls src={resultUrl} className="max-w-[220px]" />
                      <Button size="sm" onClick={handleDownload}>
                        다운로드 (.wav)
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <p className="text-xs text-gray-400 dark:text-gray-500">
                ※ 결과 파일은 WAV 형식으로만 내보내집니다. MP3 등 다른 형식으로의 인코딩은 지원하지 않습니다.
              </p>
            </>
          )}
        </div>
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
          🎬 오디오 자르기(트리머)란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">오디오 파일에서 원하는 구간만 잘라내어 새 파일로 저장하는 도구입니다.</strong>{' '}
          <strong>Web Audio API</strong>를 사용해 파일을 브라우저에서 직접 디코딩하고 편집하므로, 서버 업로드 없이 <strong>100% 로컬</strong>에서 처리됩니다.
          벨소리 만들기, 강의/팟캐스트 하이라이트 추출, 노이즈 구간 제거 등에 활용할 수 있습니다.
        </p>

        <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
          <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 핵심 포인트</p>
          <p className="text-blue-800 dark:text-blue-300">파일이 서버로 전송되지 않아 <strong>개인정보나 저작권이 민감한 오디오</strong>도 안전하게 편집할 수 있습니다.</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 사용 방법
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>파일 업로드</strong> — MP3, WAV, M4A, OGG 등 브라우저가 지원하는 오디오 파일을 선택합니다.</li>
          <li><strong>파형 확인</strong> — 업로드하면 자동으로 파형이 그려져 소리가 큰 구간을 한눈에 볼 수 있습니다.</li>
          <li><strong>구간 설정</strong> — 슬라이더나 숫자 입력으로 시작/종료 시간을 지정합니다.</li>
          <li><strong>미리듣기</strong> — 자르기 전에 선택 구간만 재생해 확인할 수 있습니다.</li>
          <li><strong>자르기 및 다운로드</strong> — WAV 파일로 인코딩되어 바로 다운로드됩니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔍 왜 결과가 WAV 파일인가요?
        </h2>
        <p className="text-sm leading-relaxed">
          브라우저는 오디오를 디코딩하면 압축이 풀린 <strong>PCM(원본 파형 데이터)</strong> 형태로 다룹니다.
          이 PCM 데이터를 다시 MP3 같은 압축 형식으로 인코딩하려면 별도의 무거운 인코더 라이브러리가 필요합니다.
          이 도구는 <strong>추가 라이브러리 없이</strong> 순수 브라우저 API만으로 동작하도록 만들어져 있어,
          PCM 데이터에 헤더만 붙이면 되는 <strong>WAV 형식으로만 내보내기</strong>를 지원합니다.
          WAV는 무손실 형식이라 화질(음질) 저하 없이 정확하게 원하는 구간을 얻을 수 있다는 장점도 있습니다.
        </p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '업로드한 파일이 서버로 전송되나요?',
            answer: '아니요. 모든 디코딩과 편집은 브라우저 안에서만 이루어지며, 파일이 서버로 업로드되지 않습니다. 인터넷 연결이 끊겨도 도구는 계속 동작합니다.',
          },
          {
            question: 'MP3로 다운로드할 수 없나요?',
            answer: '이 도구는 순수 브라우저 API만으로 동작하도록 만들어졌기 때문에 결과물은 WAV 형식으로만 제공됩니다. WAV는 무손실 형식이라 음질 손실 없이 구간을 잘라낼 수 있으며, 필요하다면 다른 변환 도구로 MP3로 다시 압축할 수 있습니다.',
          },
          {
            question: '특정 파일이 "재생할 수 없습니다" 오류가 떠요.',
            answer: '브라우저가 지원하지 않는 코덱이거나 파일이 손상된 경우입니다. 대부분의 브라우저는 MP3, WAV, M4A(AAC), OGG를 지원하지만 일부 특수한 코덱은 디코딩에 실패할 수 있습니다. 다른 형식으로 변환 후 다시 시도해보세요.',
          },
        ]}
      />
    </div>
  );
}
