'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { cn } from '@/lib/utils/cn';

type CameraState = 'idle' | 'requesting' | 'ready' | 'denied' | 'no-camera' | 'unsupported' | 'error';
type CaptureMode = 'single' | 'strip';
type FilterKey = 'none' | 'grayscale' | 'sepia' | 'invert' | 'blur' | 'bright' | 'vintage';

interface FilterDef {
  key: FilterKey;
  label: string;
  css: string;
}

const FILTERS: FilterDef[] = [
  { key: 'none', label: 'Original', css: '' },
  { key: 'grayscale', label: 'Grayscale', css: 'grayscale(1)' },
  { key: 'sepia', label: 'Sepia', css: 'sepia(0.85)' },
  { key: 'invert', label: 'Invert', css: 'invert(1)' },
  { key: 'blur', label: 'Blur', css: 'blur(2px)' },
  { key: 'bright', label: 'Bright', css: 'brightness(1.25) contrast(1.1) saturate(1.15)' },
  { key: 'vintage', label: 'Vintage', css: 'sepia(0.4) contrast(1.1) brightness(0.92) saturate(1.35)' },
];

const FRAME_COLORS: { key: string; value: string; label: string }[] = [
  { key: 'white', value: '#ffffff', label: 'White' },
  { key: 'black', value: '#111827', label: 'Black' },
  { key: 'pink', value: '#f472b6', label: 'Pink' },
  { key: 'mint', value: '#34d399', label: 'Mint' },
  { key: 'yellow', value: '#fbbf24', label: 'Yellow' },
  { key: 'blue', value: '#60a5fa', label: 'Blue' },
];

const STRIP_SHOT_COUNT = 4;
const COUNTDOWN_START = 3;
const COUNTDOWN_TICK_MS = 800;
const STRIP_SHOT_GAP_MS = 700;

function getFilterCss(key: FilterKey): string {
  return FILTERS.find((f) => f.key === key)?.css || '';
}

export function WebcamPhotoboothEn() {
  const [cameraState, setCameraState] = useState<CameraState>('idle');
  const [mirrored, setMirrored] = useState(true);
  const [filter, setFilter] = useState<FilterKey>('none');
  const [mode, setMode] = useState<CaptureMode>('single');
  const [frameColor, setFrameColor] = useState(FRAME_COLORS[0].value);
  const [countdownOn, setCountdownOn] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [shots, setShots] = useState<string[]>([]);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [finalIsStrip, setFinalIsStrip] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const stopCamera = useCallback(() => {
    clearAllTimeouts();
    setIsBusy(false);
    setCountdown(null);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState('idle');
  }, [clearAllTimeouts]);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [clearAllTimeouts]);

  const startCamera = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported');
      return;
    }

    setCameraState('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraState('ready');
    } catch (err) {
      const name = (err as DOMException)?.name;
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setCameraState('denied');
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setCameraState('no-camera');
      } else {
        setCameraState('error');
      }
    }
  }, []);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.filter = getFilterCss(filter);
    ctx.save();
    if (mirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    return canvas.toDataURL('image/png');
  }, [filter, mirrored]);

  const composeStrip = useCallback((images: string[], color: string) => {
    Promise.all(
      images.map(
        (src) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
          })
      )
    )
      .then((imgs) => {
        const w = imgs[0].width;
        const h = imgs[0].height;
        const padding = Math.round(w * 0.05);
        const gap = Math.round(w * 0.03);
        const footer = Math.round(w * 0.14);

        const canvas = document.createElement('canvas');
        canvas.width = w + padding * 2;
        canvas.height = padding * 2 + h * imgs.length + gap * (imgs.length - 1) + footer;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        imgs.forEach((img, i) => {
          const y = padding + i * (h + gap);
          ctx.drawImage(img, padding, y, w, h);
        });

        const textY = canvas.height - footer / 2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${Math.round(w * 0.055)}px sans-serif`;
        ctx.lineWidth = Math.max(2, Math.round(w * 0.006));
        ctx.strokeStyle = 'rgba(0,0,0,0.35)';
        ctx.strokeText('TOOLPIKI PHOTO BOOTH', canvas.width / 2, textY);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('TOOLPIKI PHOTO BOOTH', canvas.width / 2, textY);

        setFinalImage(canvas.toDataURL('image/png'));
        setFinalIsStrip(true);
      })
      .catch(() => {
        setCameraState('error');
      });
  }, []);

  const runCountdownThenCapture = useCallback(
    (onDone: (dataUrl: string) => void) => {
      if (!countdownOn) {
        const url = captureFrame();
        if (url) onDone(url);
        return;
      }

      let n = COUNTDOWN_START;
      setCountdown(n);

      const tick = () => {
        n -= 1;
        if (n <= 0) {
          setCountdown(null);
          const url = captureFrame();
          if (url) onDone(url);
        } else {
          setCountdown(n);
          timeoutsRef.current.push(setTimeout(tick, COUNTDOWN_TICK_MS));
        }
      };

      timeoutsRef.current.push(setTimeout(tick, COUNTDOWN_TICK_MS));
    },
    [countdownOn, captureFrame]
  );

  const handleCaptureSingle = useCallback(() => {
    if (isBusy || cameraState !== 'ready') return;
    setIsBusy(true);
    setFinalImage(null);
    setFinalIsStrip(false);
    runCountdownThenCapture((url) => {
      setFinalImage(url);
      setFinalIsStrip(false);
      setIsBusy(false);
    });
  }, [isBusy, cameraState, runCountdownThenCapture]);

  const handleCaptureStrip = useCallback(() => {
    if (isBusy || cameraState !== 'ready') return;
    setIsBusy(true);
    setFinalImage(null);
    setFinalIsStrip(false);
    setShots([]);

    const collected: string[] = [];
    const color = frameColor;

    const takeNext = () => {
      runCountdownThenCapture((url) => {
        collected.push(url);
        setShots([...collected]);
        if (collected.length < STRIP_SHOT_COUNT) {
          timeoutsRef.current.push(setTimeout(takeNext, STRIP_SHOT_GAP_MS));
        } else {
          composeStrip(collected, color);
          setIsBusy(false);
        }
      });
    };

    takeNext();
  }, [isBusy, cameraState, frameColor, runCountdownThenCapture, composeStrip]);

  const handleCapture = mode === 'single' ? handleCaptureSingle : handleCaptureStrip;

  const handleRetake = useCallback(() => {
    setFinalImage(null);
    setFinalIsStrip(false);
    setShots([]);
  }, []);

  const handleDownload = useCallback(() => {
    if (!finalImage) return;
    const link = document.createElement('a');
    link.href = finalImage;
    link.download = finalIsStrip ? `toolpiki-photobooth-strip-${Date.now()}.png` : `toolpiki-photobooth-${Date.now()}.png`;
    link.click();
  }, [finalImage, finalIsStrip]);

  const activeFilterCss = getFilterCss(filter);

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-6">
        <div className="space-y-4">
          {/* Camera view */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                'w-full h-full object-cover',
                cameraState === 'ready' ? 'block' : 'hidden'
              )}
              style={{
                filter: activeFilterCss || undefined,
                transform: mirrored ? 'scaleX(-1)' : undefined,
              }}
            />

            {cameraState !== 'ready' && (
              <div className="flex flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center">
                  <CameraIcon className="w-7 h-7 text-slate-400" />
                </div>

                {cameraState === 'idle' && (
                  <>
                    <p className="text-base font-semibold text-slate-200">Start your webcam photobooth</p>
                    <p className="text-sm text-slate-400 max-w-xs">
                      Your photos never leave the browser. Allow camera access to get started.
                    </p>
                    <Button onClick={startCamera}>Start Camera</Button>
                  </>
                )}

                {cameraState === 'requesting' && (
                  <p className="text-sm text-slate-300">Requesting camera permission...</p>
                )}

                {cameraState === 'denied' && (
                  <>
                    <p className="text-base font-semibold text-rose-300">Camera permission denied</p>
                    <p className="text-sm text-slate-400 max-w-xs">
                      Allow camera access from the icon next to your address bar or your site settings, then try again.
                    </p>
                    <Button onClick={startCamera}>Try Again</Button>
                  </>
                )}

                {cameraState === 'no-camera' && (
                  <>
                    <p className="text-base font-semibold text-amber-300">No camera found</p>
                    <p className="text-sm text-slate-400 max-w-xs">
                      Please check that a webcam is connected, then try again.
                    </p>
                    <Button onClick={startCamera}>Try Again</Button>
                  </>
                )}

                {cameraState === 'unsupported' && (
                  <>
                    <p className="text-base font-semibold text-amber-300">Browser not supported</p>
                    <p className="text-sm text-slate-400 max-w-xs">
                      This browser doesn&apos;t support camera access (getUserMedia). Please use a recent Chrome, Safari, or Edge.
                    </p>
                  </>
                )}

                {cameraState === 'error' && (
                  <>
                    <p className="text-base font-semibold text-rose-300">Couldn&apos;t start the camera</p>
                    <p className="text-sm text-slate-400 max-w-xs">
                      Make sure you&apos;re on HTTPS and no other app is currently using the camera, then try again.
                    </p>
                    <Button onClick={startCamera}>Try Again</Button>
                  </>
                )}
              </div>
            )}

            {cameraState === 'ready' && countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="text-7xl font-bold text-white drop-shadow-lg">{countdown}</span>
              </div>
            )}

            {cameraState === 'ready' && mode === 'strip' && isBusy && countdown === null && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium">
                {shots.length} / {STRIP_SHOT_COUNT} shots
              </div>
            )}
          </div>

          {cameraState === 'ready' && (
            <>
              {/* Filter selection */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter</p>
                <div className="flex flex-wrap gap-1.5">
                  {FILTERS.map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setFilter(f.key)}
                      className={cn(
                        'px-3 py-1.5 text-xs rounded-full border transition-colors',
                        filter === f.key
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400'
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Capture mode */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Capture Mode</p>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setMode('single')}
                      className={cn(
                        'flex-1 px-3 py-2 text-sm rounded-lg border transition-colors',
                        mode === 'single'
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                      )}
                    >
                      Single Shot
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('strip')}
                      className={cn(
                        'flex-1 px-3 py-2 text-sm rounded-lg border transition-colors',
                        mode === 'strip'
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                      )}
                    >
                      4-Cut Booth
                    </button>
                  </div>
                </div>

                {/* Other options */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Options</p>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setMirrored((v) => !v)}
                      className={cn(
                        'flex-1 px-3 py-2 text-sm rounded-lg border transition-colors',
                        mirrored
                          ? 'bg-gray-900 border-gray-900 text-white dark:bg-gray-100 dark:border-gray-100 dark:text-gray-900'
                          : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                      )}
                    >
                      Mirror {mirrored ? 'ON' : 'OFF'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCountdownOn((v) => !v)}
                      className={cn(
                        'flex-1 px-3 py-2 text-sm rounded-lg border transition-colors',
                        countdownOn
                          ? 'bg-gray-900 border-gray-900 text-white dark:bg-gray-100 dark:border-gray-100 dark:text-gray-900'
                          : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                      )}
                    >
                      3-2-1 Countdown {countdownOn ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>

              {mode === 'strip' && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frame Color</p>
                  <div className="flex flex-wrap gap-2">
                    {FRAME_COLORS.map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        title={c.label}
                        onClick={() => setFrameColor(c.value)}
                        className={cn(
                          'w-8 h-8 rounded-full border-2 transition-transform',
                          frameColor === c.value
                            ? 'border-blue-500 scale-110'
                            : 'border-gray-200 dark:border-gray-700'
                        )}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Capture / stop buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleCapture} disabled={isBusy}>
                  {isBusy
                    ? 'Capturing...'
                    : mode === 'single'
                    ? '📸 Take Photo'
                    : '📸 Start 4-Cut'}
                </Button>
                <Button variant="ghost" onClick={stopCamera} disabled={isBusy}>
                  Stop Camera
                </Button>
              </div>

              {/* In-progress thumbnails (strip mode) */}
              {mode === 'strip' && shots.length > 0 && !finalImage && (
                <div className="flex gap-2">
                  {shots.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={src}
                      alt={`Shot ${i + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {finalImage && (
        <Card variant="bordered" className="p-6">
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 self-start">
              Your Photo
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={finalImage}
              alt="Captured result"
              className={cn(
                'rounded-xl border border-gray-200 dark:border-gray-700',
                finalIsStrip ? 'max-h-[520px]' : 'w-full max-w-md'
              )}
            />
            <div className="flex gap-2 flex-wrap justify-center">
              <Button onClick={handleDownload}>Download PNG</Button>
              <Button variant="secondary" onClick={handleRetake}>
                Retake
              </Button>
            </div>
          </div>
        </Card>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📸 What is Webcam Photobooth?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">An instant photobooth powered entirely by your browser&apos;s camera API.</strong>{' '}
          Try filters like <strong>grayscale, sepia, invert, blur, and vintage</strong> in real time, then capture the perfect
          moment as a <strong>single shot</strong> or a <strong>4-cut photo strip</strong>.
          Everything is processed <strong>locally on Canvas</strong> and saved as a PNG — no image is ever uploaded to a server.
        </p>

        <div className="mt-4 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900 p-4 text-sm">
          <p className="font-semibold text-violet-900 dark:text-violet-200 mb-1">🔒 Privacy first</p>
          <p className="text-violet-800 dark:text-violet-300">
            Your video and photos are <strong>never uploaded anywhere.</strong> The camera stream stops immediately
            when you finish shooting or leave the page, and all filtering and compositing happens inside your browser.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎨 Filter Guide
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Filter</th>
                <th className="text-left py-2 px-2">Effect</th>
                <th className="text-left py-2 px-2">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Grayscale</td><td>Removes color</td><td>Classic profile photos</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Sepia</td><td>Warm brown tone</td><td>Retro / film vibe</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Invert</td><td>Inverted colors</td><td>Fun, unusual shots</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Blur</td><td>Soft blur</td><td>Hiding a messy background</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Bright</td><td>Boosted brightness/saturation</td><td>Crisp, vivid portraits</td></tr>
              <tr><td className="py-2 px-2 font-medium">Vintage</td><td>Muted contrast & saturation</td><td>Nostalgic film look</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Shooting Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Mirror mode</strong>: Keeps the mirrored view you see saved as-is. Turn it off if your background has text.</li>
          <li><strong>3-2-1 countdown</strong>: Great for group shots so everyone has time to pose.</li>
          <li><strong>4-cut booth</strong>: Takes 4 shots 0.7 seconds apart and merges them into one vertical strip image.</li>
          <li><strong>Lighting</strong>: Light from in front of your face makes filter effects look more vivid.</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Are my photos saved to a server?',
            answer: 'No. The camera feed and captured photos are processed entirely in your browser. Nothing is uploaded or stored externally — only the file you choose to download stays on your device.',
          },
          {
            question: 'I allowed camera access but the video doesn’t show up.',
            answer: 'Another app (like a video call tool) may already be using your camera. Close that app or re-check camera permissions in your browser’s site settings, then click "Try Again".',
          },
          {
            question: 'How does the 4-cut booth combine photos into one image?',
            answer: 'The 4 shots are stacked vertically in order with your chosen frame color as the background, then merged into a single PNG. This compositing also happens entirely using the browser’s Canvas API.',
          },
        ]}
      />
    </div>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 8a2 2 0 012-2h1.5l1-1.5h7l1 1.5H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z"
      />
      <circle cx="12" cy="12.5" r="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
