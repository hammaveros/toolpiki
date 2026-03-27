'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

export function ImageResizeEn() {
  const [image, setImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
        setImage(e.target?.result as string);
        setResizedImage(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (keepAspectRatio && originalSize) {
      const ratio = originalSize.height / originalSize.width;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (keepAspectRatio && originalSize) {
      const ratio = originalSize.width / originalSize.height;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const handleResize = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      setResizedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (!resizedImage) return;

    const link = document.createElement('a');
    link.download = `resized_${width}x${height}.png`;
    link.href = resizedImage;
    link.click();
  };

  const presetSizes = [
    { label: '50%', factor: 0.5 },
    { label: '75%', factor: 0.75 },
    { label: '150%', factor: 1.5 },
    { label: '200%', factor: 2 },
  ];

  const commonSizes = [
    { label: 'HD (1280x720)', width: 1280, height: 720 },
    { label: 'Full HD (1920x1080)', width: 1920, height: 1080 },
    { label: 'Instagram (1080x1080)', width: 1080, height: 1080 },
    { label: 'Twitter (1200x675)', width: 1200, height: 675 },
  ];

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        onFileSelect={handleImageUpload}
        label="Upload Image"
        description="Supports JPG, PNG, GIF, WebP"
      />

      {image && originalSize && (
        <>
          <Card variant="bordered" className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Original size: {originalSize.width} x {originalSize.height}px
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Width (px)
                </label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Height (px)
                </label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  min={1}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={keepAspectRatio}
                onChange={(e) => setKeepAspectRatio(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Keep aspect ratio
              </span>
            </label>

            <div className="flex flex-wrap gap-2 mb-4">
              {presetSizes.map(({ label, factor }) => (
                <Button
                  key={label}
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setWidth(Math.round(originalSize.width * factor));
                    setHeight(Math.round(originalSize.height * factor));
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {commonSizes.map(({ label, width: w, height: h }) => (
                <Button
                  key={label}
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setWidth(w);
                    setHeight(h);
                    setKeepAspectRatio(false);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          </Card>

          <div className="flex gap-2">
            <Button onClick={handleResize}>Resize</Button>
            {resizedImage && (
              <Button variant="secondary" onClick={handleDownload}>
                Download
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original</p>
              <img
                src={image}
                alt="Original"
                className="max-w-full h-auto rounded"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
              />
            </Card>

            {resizedImage && (
              <Card variant="bordered" className="p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Result ({width} x {height}px)
                </p>
                <img
                  src={resizedImage}
                  alt="Resized"
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </Card>
            )}
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🖼️ What is Image Resizer?
        </h2>
        <p className="text-sm leading-relaxed">
          Image resizing changes the resolution (width × height in pixels) of photos or graphics.
          You can scale images while maintaining aspect ratio or adjust to specific dimensions for social media.
          Common uses include website loading optimization, social media formatting, thumbnail creation, and reducing email attachment sizes.
          All processing happens in your browser — images are never sent to any server.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Recommended Image Sizes by Platform
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Platform</th>
                <th className="text-left py-2 px-2">Use Case</th>
                <th className="text-left py-2 px-2">Recommended</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Instagram</td><td>Square Feed</td><td className="font-mono">1080×1080</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Instagram</td><td>Story</td><td className="font-mono">1080×1920</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Twitter/X</td><td>Post Image</td><td className="font-mono">1200×675</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Facebook</td><td>Shared Image</td><td className="font-mono">1200×630</td></tr>
              <tr><td className="py-2 px-2">YouTube</td><td>Thumbnail</td><td className="font-mono">1280×720</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Resizing Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Keep aspect ratio</strong>: Prevents image distortion</li>
          <li><strong>Avoid upscaling</strong>: Enlarging beyond original size reduces quality</li>
          <li><strong>File size savings</strong>: Reducing by 50% cuts file size by ~75%</li>
          <li><strong>Batch processing</strong>: Useful for formatting multiple images to same specs</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Does resizing reduce image quality?',
            answer: 'Downscaling has minimal quality loss. However, upscaling (enlarging beyond original) interpolates pixels and reduces sharpness. Keep dimensions at or below original size when possible.',
          },
          {
            question: 'What is the difference between keeping aspect ratio and free adjust?',
            answer: 'Keeping aspect ratio automatically adjusts height when you change width, preventing distortion. Free adjust lets you set any dimensions but may stretch or squeeze the image.',
          },
          {
            question: 'Are images uploaded to a server?',
            answer: 'No, all processing uses the browser Canvas API locally. Your image data never leaves your device, ensuring complete privacy.',
          },
        ]}
      />
    </div>
  );
}
