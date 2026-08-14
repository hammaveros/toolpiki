'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

type Status = 'idle' | 'loading' | 'ready' | 'error';

// Encode an AudioBuffer to a WAV (16-bit PCM) Blob
function encodeWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numFrames = buffer.length;
  const bytesPerSample = 2; // 16-bit
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

  // RIFF header
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  // fmt chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // byteRate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bitsPerSample

  // data chunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Interleave channel data into 16-bit PCM
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

export function AudioCutterEn() {
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
      console.error('Audio decoding failed:', err);
      setStatus('error');
      setErrorMsg('This file could not be played. Please check that it is a supported format (MP3, WAV, M4A, OGG).');
    }
  }, [getAudioContext, drawWaveform]);

  const stopPlayback = useCallback(() => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.onended = null;
        sourceNodeRef.current.stop();
      } catch {
        // Ignore if already stopped
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
      setErrorMsg('End time must be greater than start time.');
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
      console.error('Trim failed:', err);
      setErrorMsg('Something went wrong while trimming. Please try again.');
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

  // Cleanup on unmount
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
          // ignore
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
          {/* Upload area */}
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <div className="text-4xl mb-2">🎧</div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                Click or drag an audio file here
              </p>
              <p className="text-sm text-gray-500">
                Supports MP3, WAV, M4A, OGG • Processed entirely in your browser, never uploaded
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
              Analyzing audio file...
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
                <span className="ml-2 text-gray-400">Total length {formatTime(duration)}</span>
              </div>

              {/* Waveform canvas */}
              <div className="relative w-full">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={120}
                  className="w-full h-[120px] rounded bg-gray-100 dark:bg-gray-800"
                />
              </div>

              {/* Range settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start: {formatTime(start)}
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
                    End: {formatTime(end)}
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
                Selected duration: <span className="font-mono">{formatTime(Math.max(0, end - start))}</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                {!isPlaying ? (
                  <Button variant="secondary" onClick={playSelection} disabled={end <= start}>
                    ▶ Preview Selection
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={stopPlayback}>
                    ⏸ Stop
                  </Button>
                )}
                <Button onClick={handleCut} disabled={isCutting || end <= start}>
                  {isCutting ? 'Cutting...' : '✂ Cut'}
                </Button>
                <Button variant="ghost" onClick={reset}>
                  Reset
                </Button>
              </div>

              {errorMsg && status === 'ready' && (
                <div className="text-sm px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded">
                  {errorMsg}
                </div>
              )}

              {/* Result */}
              {resultUrl && (
                <Card variant="bordered" className="p-4 bg-green-50 dark:bg-green-900/10">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <p className="font-medium text-green-700 dark:text-green-400">Trim complete (WAV)</p>
                      <p className="text-gray-500 dark:text-gray-400">
                        Length {formatTime(Math.max(0, end - start))} • Size {formatSize(resultSize)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <audio controls src={resultUrl} className="max-w-[220px]" />
                      <Button size="sm" onClick={handleDownload}>
                        Download (.wav)
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <p className="text-xs text-gray-400 dark:text-gray-500">
                * Output is exported as WAV only. Encoding to MP3 or other compressed formats is not supported.
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
          🎬 What is an Audio Cutter / Trimmer?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">A tool that extracts a chosen segment from an audio file and saves it as a new file.</strong>{' '}
          It uses the <strong>Web Audio API</strong> to decode and edit the file directly in your browser, so processing happens <strong>100% locally</strong> with no server upload.
          Useful for making ringtones, pulling highlights from lectures or podcasts, or removing noisy sections.
        </p>

        <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
          <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 Key point</p>
          <p className="text-blue-800 dark:text-blue-300">Since files never leave your device, you can safely edit <strong>private or copyright-sensitive audio</strong>.</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 How to Use
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Upload a file</strong> — choose an MP3, WAV, M4A, OGG, or other browser-supported audio file.</li>
          <li><strong>Check the waveform</strong> — a waveform is drawn automatically so you can spot loud sections at a glance.</li>
          <li><strong>Set the range</strong> — use the sliders or number inputs to set the start and end time.</li>
          <li><strong>Preview</strong> — play back just the selected range before committing to the cut.</li>
          <li><strong>Cut and download</strong> — the trimmed segment is encoded as a WAV file, ready to download.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔍 Why is the output a WAV file?
        </h2>
        <p className="text-sm leading-relaxed">
          When a browser decodes audio, it works with uncompressed <strong>PCM (raw waveform) data</strong>.
          Re-encoding that PCM data into a compressed format like MP3 requires a separate, fairly heavy encoder library.
          This tool is built to run with <strong>zero extra libraries</strong>, using only native browser APIs,
          so it supports <strong>WAV-only export</strong> — a format where you just prepend a header to the PCM data.
          As a bonus, WAV is lossless, so the trimmed segment retains full audio quality with no compression artifacts.
        </p>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Is my uploaded file sent to a server?',
            answer: 'No. All decoding and editing happen entirely in your browser, and the file is never uploaded. The tool keeps working even if you lose your internet connection.',
          },
          {
            question: 'Can I download the result as MP3?',
            answer: 'This tool is built to run on native browser APIs alone, so the output is WAV only. WAV is lossless, meaning the trimmed clip keeps full audio quality; if you need MP3, you can re-compress the WAV with another converter afterward.',
          },
          {
            question: 'I get a "could not be played" error for a certain file.',
            answer: 'This usually means the browser does not support the codec, or the file is corrupted. Most browsers support MP3, WAV, M4A (AAC), and OGG, but some less common codecs may fail to decode. Try converting the file to a different format first.',
          },
        ]}
      />
    </div>
  );
}
