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
          MP4 GIF 변환기는 동영상 파일을 애니메이션 GIF로 변환하는 온라인 도구입니다.
          SNS, 메신저, 블로그, 이메일 등에서 짧은 클립을 간편하게 공유할 수 있습니다.
          시작 시간, 길이, 해상도, 프레임레이트, 품질 등을 세밀하게 조절하여 원하는 결과물을 만들 수 있습니다.
          모든 변환 작업은 브라우저에서 이루어지며, 영상이 서버로 업로드되지 않아 개인정보가 안전합니다.
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
          💡 GIF 변환 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>파일 크기 줄이기</strong>: 길이, FPS, 너비를 줄이면 용량이 크게 감소</li>
          <li><strong>256색 제한</strong>: GIF는 256색만 표현 가능, 단순한 영상이 더 좋은 결과</li>
          <li><strong>루프 GIF</strong>: 시작과 끝이 자연스럽게 연결되도록 편집하면 효과적</li>
          <li><strong>움짤 제작</strong>: 리액션, 밈 등 짧고 임팩트 있는 장면 선택</li>
          <li><strong>SNS 용량 제한</strong>: 대부분 15MB 이하 권장, 트위터는 5MB 이하</li>
        </ul>
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
        ]}
      />
    </div>
  );
}
