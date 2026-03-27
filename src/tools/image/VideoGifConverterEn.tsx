'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

export function VideoGifConverterEn() {
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
      setError('GIF library is loading. Please try again in a moment.');
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
      const totalFrames = Math.min(Math.floor(duration * fps), 60);
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
        setProgress(Math.round(((i + 1) / totalFrames) * 50));
      }

      // Render GIF
      gif.on('progress', (p: number) => {
        setProgress(50 + Math.round(p * 50));
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
      setError('Conversion error: ' + (err instanceof Error ? err.message : 'Unknown error'));
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
        MP4 → GIF Converter
      </h2>

      {/* File Upload */}
      <FileUpload
        accept="video/mp4,video/webm,video/quicktime"
        onFileSelect={handleFileUpload}
        label="Upload Video"
        description="Supports MP4, WebM files (short videos recommended)"
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
                  Start Time: {formatTime(startTime)} / {formatTime(videoDuration)}
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
                  Duration: {duration}s (max {Math.min(5, videoDuration).toFixed(1)}s)
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
                    Width: {width}px
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
                    Quality: {quality}
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
                Estimated frames: {Math.min(Math.floor(duration * fps), 60)} | Lower quality = faster & smaller
              </p>
            </div>
          </Card>

          {/* Progress */}
          {isConverting && (
            <Card variant="bordered" className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{progress < 50 ? 'Extracting frames...' : 'Creating GIF...'}</span>
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
              {isConverting ? 'Creating GIF...' : 'Create GIF'}
            </Button>
            {result && (
              <Button variant="secondary" onClick={handleDownload}>
                Download ({formatSize(resultSize)})
              </Button>
            )}
          </div>
        </>
      )}

      {/* Result Preview */}
      {result && (
        <Card variant="bordered" className="p-4">
          <p className="text-sm font-medium mb-3">Generated GIF</p>
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
          Tips
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Works best with short videos (under 3 seconds)</li>
          <li>• Lower FPS and width = smaller file size</li>
          <li>• Quality 1 = best, 20 = fastest (smaller file)</li>
          <li>• GIFs are limited to 256 colors, complex videos may lose quality</li>
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
          🎬 What is Video to GIF Converter?
        </h2>
        <p className="text-sm leading-relaxed">
          Video to GIF Converter transforms video files into animated GIFs online.
          Perfect for sharing short clips on social media, messaging apps, blogs, and emails.
          Fine-tune start time, duration, resolution, frame rate, and quality to create exactly what you need.
          All processing happens in your browser - no videos are uploaded to any server, ensuring complete privacy.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Settings Guide
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Setting</th>
                <th className="text-left py-2 px-2">Recommended</th>
                <th className="text-left py-2 px-2">Effect</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Duration</td><td>1-3 seconds</td><td>Shorter = smaller file</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">FPS</td><td>10-15</td><td>Lower = smaller file</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Width</td><td>320px</td><td>Good for social media</td></tr>
              <tr><td className="py-2 px-2 font-medium">Quality</td><td>10</td><td>1 (best) to 20 (fastest)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 GIF Conversion Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Reduce file size</strong>: Lower duration, FPS, and width for much smaller files</li>
          <li><strong>256 color limit</strong>: GIFs only support 256 colors, simpler videos work better</li>
          <li><strong>Loop effect</strong>: Choose clips where start and end connect naturally</li>
          <li><strong>Reaction GIFs</strong>: Pick short, impactful moments for best results</li>
          <li><strong>Size limits</strong>: Most platforms prefer under 15MB, Twitter under 5MB</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'The GIF file is too large. How do I reduce it?',
            answer: 'Shorten duration (under 2s), lower FPS (under 10), and reduce width (under 320px) to significantly decrease file size.',
          },
          {
            question: 'Why does my GIF look low quality?',
            answer: 'GIFs are limited to 256 colors, so videos with many colors may lose quality. Simpler scenes or animations produce better results.',
          },
          {
            question: 'Conversion takes too long.',
            answer: 'More frames (duration × FPS) and higher resolution increase processing time. Set quality closer to 20 for faster conversion.',
          },
        ]}
      />
    </div>
  );
}
