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
  { key: 'none', label: '원본', css: '' },
  { key: 'grayscale', label: '흑백', css: 'grayscale(1)' },
  { key: 'sepia', label: '세피아', css: 'sepia(0.85)' },
  { key: 'invert', label: '반전', css: 'invert(1)' },
  { key: 'blur', label: '블러', css: 'blur(2px)' },
  { key: 'bright', label: '화사하게', css: 'brightness(1.25) contrast(1.1) saturate(1.15)' },
  { key: 'vintage', label: '빈티지', css: 'sepia(0.4) contrast(1.1) brightness(0.92) saturate(1.35)' },
];

const FRAME_COLORS: { key: string; value: string; label: string }[] = [
  { key: 'white', value: '#ffffff', label: '화이트' },
  { key: 'black', value: '#111827', label: '블랙' },
  { key: 'pink', value: '#f472b6', label: '핑크' },
  { key: 'mint', value: '#34d399', label: '민트' },
  { key: 'yellow', value: '#fbbf24', label: '옐로우' },
  { key: 'blue', value: '#60a5fa', label: '블루' },
];

const STRIP_SHOT_COUNT = 4;
const COUNTDOWN_START = 3;
const COUNTDOWN_TICK_MS = 800;
const STRIP_SHOT_GAP_MS = 700;

function getFilterCss(key: FilterKey): string {
  return FILTERS.find((f) => f.key === key)?.css || '';
}

export function WebcamPhotobooth() {
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
          {/* 카메라 뷰 */}
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
                    <p className="text-base font-semibold text-slate-200">웹캠 포토부스를 시작해보세요</p>
                    <p className="text-sm text-slate-400 max-w-xs">
                      촬영한 사진은 브라우저 밖으로 전송되지 않습니다. 카메라 권한을 허용하면 바로 시작할 수 있어요.
                    </p>
                    <Button onClick={startCamera}>카메라 시작</Button>
                  </>
                )}

                {cameraState === 'requesting' && (
                  <p className="text-sm text-slate-300">카메라 권한을 요청하는 중...</p>
                )}

                {cameraState === 'denied' && (
                  <>
                    <p className="text-base font-semibold text-rose-300">카메라 권한이 거부되었습니다</p>
                    <p className="text-sm text-slate-400 max-w-xs">
                      브라우저 주소창 옆 카메라 아이콘 또는 사이트 설정에서 카메라 권한을 허용한 뒤 다시 시도해주세요.
                    </p>
                    <Button onClick={startCamera}>다시 시도</Button>
                  </>
                )}

                {cameraState === 'no-camera' && (
                  <>
                    <p className="text-base font-semibold text-amber-300">카메라를 찾을 수 없습니다</p>
                    <p className="text-sm text-slate-400 max-w-xs">
                      연결된 웹캠이 있는지 확인한 후 다시 시도해주세요.
                    </p>
                    <Button onClick={startCamera}>다시 시도</Button>
                  </>
                )}

                {cameraState === 'unsupported' && (
                  <>
                    <p className="text-base font-semibold text-amber-300">지원하지 않는 브라우저입니다</p>
                    <p className="text-sm text-slate-400 max-w-xs">
                      이 브라우저는 카메라 기능(getUserMedia)을 지원하지 않아요. 최신 크롬, 사파리, 엣지를 이용해주세요.
                    </p>
                  </>
                )}

                {cameraState === 'error' && (
                  <>
                    <p className="text-base font-semibold text-rose-300">카메라를 불러오지 못했습니다</p>
                    <p className="text-sm text-slate-400 max-w-xs">
                      HTTPS 환경인지, 다른 앱이 카메라를 사용 중은 아닌지 확인한 후 다시 시도해주세요.
                    </p>
                    <Button onClick={startCamera}>다시 시도</Button>
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
                {shots.length} / {STRIP_SHOT_COUNT}컷
              </div>
            )}
          </div>

          {cameraState === 'ready' && (
            <>
              {/* 필터 선택 */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">필터</p>
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
                {/* 촬영 모드 */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">촬영 모드</p>
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
                      1장 촬영
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
                      4컷 포토부스
                    </button>
                  </div>
                </div>

                {/* 기타 옵션 */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">옵션</p>
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
                      미러 모드 {mirrored ? 'ON' : 'OFF'}
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
                      3-2-1 카운트다운 {countdownOn ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>

              {mode === 'strip' && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">프레임 색상</p>
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

              {/* 촬영/정지 버튼 */}
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleCapture} disabled={isBusy}>
                  {isBusy
                    ? '촬영 중...'
                    : mode === 'single'
                    ? '📸 촬영하기'
                    : '📸 4컷 촬영 시작'}
                </Button>
                <Button variant="ghost" onClick={stopCamera} disabled={isBusy}>
                  카메라 끄기
                </Button>
              </div>

              {/* 촬영 중 썸네일 (4컷 모드) */}
              {mode === 'strip' && shots.length > 0 && !finalImage && (
                <div className="flex gap-2">
                  {shots.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={src}
                      alt={`촬영 ${i + 1}`}
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
              완성된 사진
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={finalImage}
              alt="촬영 결과"
              className={cn(
                'rounded-xl border border-gray-200 dark:border-gray-700',
                finalIsStrip ? 'max-h-[520px]' : 'w-full max-w-md'
              )}
            />
            <div className="flex gap-2 flex-wrap justify-center">
              <Button onClick={handleDownload}>PNG 다운로드</Button>
              <Button variant="secondary" onClick={handleRetake}>
                다시 촬영
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
          📸 웹캠 포토부스란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">브라우저의 카메라 API만으로 동작하는 즉석 포토부스입니다.</strong>{' '}
          <strong>흑백, 세피아, 반전, 블러, 빈티지</strong> 등 다양한 필터를 실시간으로 적용해보고, 마음에 드는 순간을
          <strong> 1장 촬영</strong> 또는 <strong>4컷 포토부스</strong>로 캡처할 수 있습니다.
          촬영한 이미지는 서버로 전송되지 않고 <strong>내 브라우저(Canvas)에서만</strong> 처리되어 PNG로 바로 저장됩니다.
        </p>

        <div className="mt-4 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900 p-4 text-sm">
          <p className="font-semibold text-violet-900 dark:text-violet-200 mb-1">🔒 개인정보 보호</p>
          <p className="text-violet-800 dark:text-violet-300">
            영상과 사진은 <strong>어디로도 업로드되지 않습니다.</strong> 카메라 스트림은 촬영이 끝나거나 페이지를 벗어나면
            즉시 종료되며, 모든 필터 처리와 이미지 합성은 브라우저 안에서만 이루어집니다.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎨 필터 종류 안내
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">필터</th>
                <th className="text-left py-2 px-2">효과</th>
                <th className="text-left py-2 px-2">추천 상황</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">흑백</td><td>컬러 제거</td><td>클래식한 프로필 사진</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">세피아</td><td>갈색 톤 보정</td><td>레트로/필름 감성</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">반전</td><td>색상 반전</td><td>독특한 재미용 컷</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">블러</td><td>부드러운 흐림</td><td>배경 신경 안 쓰고 싶을 때</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">화사하게</td><td>밝기·채도 상승</td><td>또렷하고 화사한 인물샷</td></tr>
              <tr><td className="py-2 px-2 font-medium">빈티지</td><td>채도·명암 보정</td><td>감성적인 필름 룩</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 촬영 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>미러 모드</strong>: 켜두면 거울처럼 보이는 화면 그대로 저장돼요. 텍스트가 들어간 배경이라면 꺼두는 걸 추천합니다.</li>
          <li><strong>3-2-1 카운트다운</strong>: 여러 명이 함께 찍을 때 켜두면 포즈를 잡을 시간이 생겨요.</li>
          <li><strong>4컷 포토부스</strong>: 0.7초 간격으로 4장을 연속 촬영해 하나의 세로 스트립 이미지로 합쳐줍니다.</li>
          <li><strong>조명</strong>: 얼굴 앞쪽에서 빛이 들어오도록 하면 필터 효과가 더 선명하게 보입니다.</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '촬영한 사진이 서버에 저장되나요?',
            answer: '아니요. 카메라 영상과 촬영된 사진은 전부 브라우저 안에서만 처리됩니다. 어떤 이미지도 외부 서버로 전송되거나 저장되지 않으며, 다운로드한 파일만 내 기기에 남습니다.',
          },
          {
            question: '카메라 권한을 허용했는데도 화면이 안 나와요.',
            answer: '다른 프로그램(화상회의 앱 등)이 카메라를 이미 사용 중이면 접근이 막힐 수 있습니다. 해당 프로그램을 종료하거나, 브라우저 사이트 설정에서 카메라 권한을 다시 확인한 뒤 "다시 시도" 버튼을 눌러주세요.',
          },
          {
            question: '4컷 포토부스는 어떻게 하나의 이미지로 합쳐지나요?',
            answer: '4장의 사진을 순서대로 세로로 배치하고, 선택한 프레임 색상을 배경으로 채워 하나의 PNG 이미지로 합성합니다. 합성 과정도 전부 브라우저의 Canvas 기능으로 처리됩니다.',
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
