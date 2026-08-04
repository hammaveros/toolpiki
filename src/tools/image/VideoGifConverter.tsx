'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

export function VideoGifConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [resultSize, setResultSize] = useState(0);

  // Video to GIF options
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState(320);
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(3);
  const [videoDuration, setVideoDuration] = useState(0);
  const [quality, setQuality] = useState(10);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gifRef = useRef<any>(null);

  // Load GIF.js dynamically (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('gif.js').then((GIF) => {
        gifRef.current = GIF.default || GIF;
      });
    }
  }, []);

  const handleFileUpload = useCallback((uploadedFile: File) => {
    setFile(uploadedFile);
    setResult(null);
    setError(null);
    setProgress(0);
    setResultSize(0);

    const url = URL.createObjectURL(uploadedFile);
    setPreview(url);

    if (uploadedFile.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        setVideoDuration(video.duration);
        setDuration(Math.min(3, video.duration));
      };
    }
  }, []);

  const convertVideoToGif = async () => {
    if (!file || !videoRef.current || !canvasRef.current || !gifRef.current) {
      setError('GIF 라이브러리 로딩 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsConverting(true);
    setError(null);
    setProgress(0);
    setResult(null);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        if (video.readyState >= 2) {
          resolve();
        } else {
          video.onloadeddata = () => resolve();
        }
      });

      // Calculate dimensions
      const aspectRatio = video.videoHeight / video.videoWidth;
      const height = Math.round(width * aspectRatio);
      canvas.width = width;
      canvas.height = height;

      // Create GIF encoder
      const GIF = gifRef.current;
      const gif = new GIF({
        workers: 2,
        quality: quality,
        width: width,
        height: height,
        workerScript: '/gif.worker.js',
      });

      const frameInterval = 1 / fps;
      const totalFrames = Math.min(Math.floor(duration * fps), 60); // 최대 60프레임
      const delay = Math.round(1000 / fps);

      // Extract frames
      for (let i = 0; i < totalFrames; i++) {
        const currentTime = startTime + (i * frameInterval);
        if (currentTime > video.duration) break;

        video.currentTime = currentTime;

        await new Promise<void>((resolve) => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            resolve();
          };
          video.addEventListener('seeked', onSeeked);
        });

        ctx.drawImage(video, 0, 0, width, height);
        gif.addFrame(ctx, { copy: true, delay });
        setProgress(Math.round(((i + 1) / totalFrames) * 50)); // 50%까지는 프레임 추출
      }

      // Render GIF
      gif.on('progress', (p: number) => {
        setProgress(50 + Math.round(p * 50)); // 50~100%는 GIF 렌더링
      });

      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        setResult(url);
        setResultSize(blob.size);
        setIsConverting(false);
        setProgress(100);
      });

      gif.render();

    } catch (err) {
      setError('변환 중 오류: ' + (err instanceof Error ? err.message : '알 수 없는 오류'));
      setIsConverting(false);
    }
  };

  const handleConvert = () => {
    convertVideoToGif();
  };

  const handleDownload = () => {
    if (!result) return;

    const link = document.createElement('a');
    const fileName = file?.name.replace(/\.[^/.]+$/, '') || 'converted';
    link.download = `${fileName}.gif`;
    link.href = result;
    link.click();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        MP4 → GIF 변환
      </h2>

      {/* File Upload */}
      <FileUpload
        accept="video/mp4,video/webm,video/quicktime"
        onFileSelect={handleFileUpload}
        label="동영상 업로드"
        description="MP4, WebM 파일 지원 (짧은 영상 권장)"
      />

      {/* Video Preview & Options */}
      {preview && file && (
        <>
          <Card variant="bordered" className="p-4">
            <video
              ref={videoRef}
              src={preview}
              controls
              className="w-full max-h-64 rounded mb-4"
              crossOrigin="anonymous"
            />

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  시작 시간: {formatTime(startTime)} / {formatTime(videoDuration)}
                </label>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, videoDuration - duration)}
                  step="0.1"
                  value={startTime}
                  onChange={(e) => setStartTime(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  길이: {duration}초 (최대 {Math.min(5, videoDuration).toFixed(1)}초)
                </label>
                <input
                  type="range"
                  min="0.5"
                  max={Math.min(5, videoDuration - startTime)}
                  step="0.5"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    FPS: {fps}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="15"
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    너비: {width}px
                  </label>
                  <input
                    type="range"
                    min="160"
                    max="480"
                    step="40"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    품질: {quality}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500">
                예상 프레임: {Math.min(Math.floor(duration * fps), 60)}장 | 품질 낮을수록 빠르고 작음
              </p>
            </div>
          </Card>

          {/* Progress */}
          {isConverting && (
            <Card variant="bordered" className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{progress < 50 ? '프레임 추출 중...' : 'GIF 생성 중...'}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleConvert} disabled={isConverting}>
              {isConverting ? 'GIF 생성 중...' : 'GIF 생성'}
            </Button>
            {result && (
              <Button variant="secondary" onClick={handleDownload}>
                다운로드 ({formatSize(resultSize)})
              </Button>
            )}
          </div>
        </>
      )}

      {/* Result Preview */}
      {result && (
        <Card variant="bordered" className="p-4">
          <p className="text-sm font-medium mb-3">생성된 GIF</p>
          <img
            src={result}
            alt="Generated GIF"
            className="max-w-full max-h-64 mx-auto rounded"
          />
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card variant="bordered" className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </Card>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Info */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          사용 팁
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• 짧은 영상(3초 이하)에서 가장 잘 동작합니다</li>
          <li>• FPS, 너비가 낮을수록 파일 크기가 작아집니다</li>
          <li>• 품질 1이 가장 좋음, 20이 가장 빠름(파일 작음)</li>
          <li>• GIF는 256색 제한이 있어 복잡한 영상은 품질이 낮을 수 있습니다</li>
        </ul>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎬 MP4 GIF 변환기란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">동영상 파일을 애니메이션 GIF로 변환하는 도구.</strong>{' '}
          <strong>SNS, 메신저, 블로그, 이메일</strong>에서 짧은 클립을 간편하게 공유할 수 있습니다.
          <strong>시작 시간, 길이, 해상도, FPS, 품질</strong>을 세밀하게 조절해 원하는 결과물을 만들 수 있고,
          모든 변환은 브라우저에서 이뤄져 서버로 업로드되지 않습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 설정 옵션 가이드
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">옵션</th>
                <th className="text-left py-2 px-2">권장 값</th>
                <th className="text-left py-2 px-2">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">길이</td><td>1~3초</td><td>짧을수록 파일 크기 작음</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">FPS</td><td>10~15</td><td>낮을수록 용량 감소</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">너비</td><td>320px</td><td>SNS용 적정 크기</td></tr>
              <tr><td className="py-2 px-2 font-medium">품질</td><td>10</td><td>1(최고)~20(최저)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📦 설정에 따른 용량 변화
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          GIF 용량은 <strong>프레임 수 × 프레임당 픽셀 수</strong>로 결정됩니다.
          길이·FPS·너비 중 하나만 줄여도 체감이 크고, 두 개를 함께 줄이면 곱으로 작아집니다.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">설정</th>
                <th className="text-left py-2 px-2">총 프레임</th>
                <th className="text-left py-2 px-2">예상 용량</th>
                <th className="text-left py-2 px-2">쓸 만한 곳</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2 font-mono">2초·10fps·240px</td><td>20장</td><td>약 500KB~1MB</td><td>메신저, 이모티콘</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2 font-mono">3초·12fps·320px</td><td>36장</td><td>약 2~4MB</td><td>트위터, 블로그</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2 font-mono">3초·15fps·480px</td><td>45장</td><td>약 5~10MB</td><td>업로드 제한 주의</td></tr>
              <tr><td className="py-1.5 px-2 font-mono">5초·20fps·640px</td><td>100장</td><td>20MB 이상</td><td>대부분 업로드 불가</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed mt-3">
          실제 용량은 영상 내용에 크게 좌우됩니다. <strong>배경이 고정된 화면</strong>은 프레임 간 차이가 작아 잘 압축되지만,
          <strong>화면 전체가 흔들리거나 전환되는 장면</strong>은 매 프레임이 새 이미지나 다름없어 몇 배로 커집니다.
          카메라가 움직이는 구간보다 정지된 구간을 고르면 훨씬 가벼워집니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎨 GIF가 지저분해 보이는 이유
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          GIF는 1980년대 포맷이라 <strong>한 프레임에 최대 256색</strong>만 담을 수 있습니다.
          수백만 색을 쓰는 원본 영상을 256색으로 줄이는 과정에서 화질 저하가 생깁니다.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>그라데이션이 띠처럼 보임</strong> — 하늘이나 노을처럼 색이 서서히 변하는 장면에서 계단 현상이 두드러집니다.</li>
          <li><strong>점처럼 지글거림</strong> — 부족한 색을 점으로 섞어 흉내 내는 디더링 때문입니다. 움직이면 노이즈처럼 보입니다.</li>
          <li><strong>사람 피부톤이 부자연스러움</strong> — 미묘한 색 차이를 표현할 색이 모자라 얼룩덜룩해집니다.</li>
          <li><strong>어두운 장면에서 심함</strong> — 검정 근처의 계조가 뭉개져 형태를 알아보기 어려워집니다.</li>
        </ul>
        <p className="text-sm leading-relaxed mt-3">
          그래서 <strong>단순한 색과 뚜렷한 움직임</strong>이 있는 장면이 GIF에 잘 맞습니다.
          화질이 중요하거나 길이가 길다면 GIF를 고집하기보다 <strong>영상 파일 그대로 올리는 편</strong>이 화질도 좋고 용량도 훨씬 작습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 GIF 변환 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>파일 크기 줄이기</strong> — <strong>길이/FPS/너비</strong>를 줄이면 용량이 크게 감소</li>
          <li><strong>256색 제한</strong> — GIF는 <strong>256색</strong>만 표현, 단순한 영상이 더 좋음</li>
          <li><strong>루프 GIF</strong> — 시작/끝이 자연스럽게 연결되도록 편집</li>
          <li><strong>움짤 제작</strong> — 리액션, 밈 등 짧고 임팩트 있는 장면 선택</li>
          <li><strong>SNS 용량 제한</strong> — 대부분 <strong>15MB 이하</strong>, 트위터 <strong>5MB 이하</strong></li>
        </ul>
        <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 p-4 text-sm">
          <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">⚠️ 용량 폭증 주의</p>
          <p className="text-amber-800 dark:text-amber-300">
            <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-xs font-mono">3초 × 15fps × 480px</code>면 보통 <strong>5~10MB</strong>.
            큰 GIF가 필요하면 차라리 <strong>MP4 그대로</strong> 쓰는 게 좋습니다.
          </p>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'GIF 파일이 너무 큽니다. 어떻게 줄이나요?',
            answer: '길이를 짧게(2초 이하), FPS를 낮게(10 이하), 너비를 작게(320px 이하) 설정하면 파일 크기가 크게 줄어듭니다.',
          },
          {
            question: 'GIF 품질이 낮아 보입니다.',
            answer: 'GIF는 256색 제한이 있어 색상이 많은 영상은 품질이 떨어질 수 있습니다. 단순한 색상의 영상이나 애니메이션이 더 좋은 결과를 보여줍니다.',
          },
          {
            question: '변환에 시간이 오래 걸립니다.',
            answer: '프레임 수가 많거나(길이×FPS) 해상도가 높으면 변환 시간이 늘어납니다. 품질을 20에 가깝게 설정하면 더 빨리 변환됩니다.',
          },
          {
            question: '같은 설정인데 어떤 영상은 용량이 훨씬 커요.',
            answer: '프레임 간 변화량 차이 때문입니다. 배경이 고정된 장면은 잘 압축되지만, 화면 전체가 흔들리거나 전환되는 구간은 매 프레임이 새 이미지나 다름없어 몇 배로 커집니다.',
          },
          {
            question: '영상 파일이 서버로 업로드되나요?',
            answer: '아니요. 변환은 브라우저 안에서 처리되며 영상이 서버로 전송되지 않습니다. 다만 브라우저 메모리를 사용하므로 아주 큰 파일은 처리가 느려질 수 있습니다.',
          },
          {
            question: 'GIF 대신 영상을 쓰는 게 나을 때는 언제인가요?',
            answer: '길이가 3초를 넘거나 화질이 중요할 때입니다. 같은 장면이라도 영상 파일이 GIF보다 화질이 좋고 용량은 훨씬 작습니다. 요즘은 대부분의 플랫폼이 짧은 영상을 GIF처럼 자동 재생해 줍니다.',
          },
        ]}
      />
    </div>
  );
}
