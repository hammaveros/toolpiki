'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ImageCropEn() {
  const [image, setImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
        setCropArea({
          x: 0,
          y: 0,
          width: Math.min(img.width, 300),
          height: Math.min(img.height, 300),
        });
        setImage(e.target?.result as string);
        setCroppedImage(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left - cropArea.x,
      y: e.clientY - rect.top - cropArea.y,
    });
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current || !imageSize) return;

    const rect = containerRef.current.getBoundingClientRect();
    const scale = rect.width / imageSize.width;

    let newX = (e.clientX - rect.left - dragStart.x) / scale;
    let newY = (e.clientY - rect.top - dragStart.y) / scale;

    newX = Math.max(0, Math.min(newX, imageSize.width - cropArea.width));
    newY = Math.max(0, Math.min(newY, imageSize.height - cropArea.height));

    setCropArea((prev) => ({ ...prev, x: newX, y: newY }));
  }, [isDragging, dragStart, imageSize, cropArea.width, cropArea.height]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleCrop = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;
      ctx.drawImage(
        img,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, cropArea.width, cropArea.height
      );
      setCroppedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (!croppedImage) return;

    const link = document.createElement('a');
    link.download = `cropped_${cropArea.width}x${cropArea.height}.png`;
    link.href = croppedImage;
    link.click();
  };

  const aspectRatios = [
    { label: 'Free', value: null },
    { label: '1:1', value: 1 },
    { label: '4:3', value: 4/3 },
    { label: '16:9', value: 16/9 },
    { label: '3:2', value: 3/2 },
  ];

  const setAspectRatio = (ratio: number | null) => {
    if (!ratio || !imageSize) return;

    const newWidth = Math.min(cropArea.width, imageSize.width);
    const newHeight = Math.round(newWidth / ratio);

    if (newHeight <= imageSize.height) {
      setCropArea((prev) => ({
        ...prev,
        width: newWidth,
        height: newHeight,
        y: Math.min(prev.y, imageSize.height - newHeight),
      }));
    } else {
      const adjustedHeight = imageSize.height;
      const adjustedWidth = Math.round(adjustedHeight * ratio);
      setCropArea((prev) => ({
        ...prev,
        width: adjustedWidth,
        height: adjustedHeight,
        x: Math.min(prev.x, imageSize.width - adjustedWidth),
      }));
    }
  };

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        onFileSelect={handleImageUpload}
        label="Upload Image"
        description="Supports JPG, PNG, GIF, WebP"
      />

      {image && imageSize && (
        <>
          <Card variant="bordered" className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">X</label>
                <Input
                  type="number"
                  value={Math.round(cropArea.x)}
                  onChange={(e) => setCropArea((prev) => ({ ...prev, x: Number(e.target.value) }))}
                  min={0}
                  max={imageSize.width - cropArea.width}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Y</label>
                <Input
                  type="number"
                  value={Math.round(cropArea.y)}
                  onChange={(e) => setCropArea((prev) => ({ ...prev, y: Number(e.target.value) }))}
                  min={0}
                  max={imageSize.height - cropArea.height}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Width</label>
                <Input
                  type="number"
                  value={Math.round(cropArea.width)}
                  onChange={(e) => setCropArea((prev) => ({ ...prev, width: Number(e.target.value) }))}
                  min={1}
                  max={imageSize.width - cropArea.x}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Height</label>
                <Input
                  type="number"
                  value={Math.round(cropArea.height)}
                  onChange={(e) => setCropArea((prev) => ({ ...prev, height: Number(e.target.value) }))}
                  min={1}
                  max={imageSize.height - cropArea.y}
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {aspectRatios.map(({ label, value }) => (
                <Button
                  key={label}
                  variant="secondary"
                  size="sm"
                  onClick={() => setAspectRatio(value)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </Card>

          <div
            ref={containerRef}
            className="relative inline-block max-w-full overflow-hidden cursor-crosshair"
            style={{ userSelect: 'none' }}
          >
            <img
              src={image}
              alt="Original"
              className="max-w-full h-auto"
              style={{ maxHeight: '400px' }}
              draggable={false}
            />
            <div
              className="absolute inset-0 bg-black/50 pointer-events-none"
              style={{
                clipPath: `polygon(
                  0 0, 100% 0, 100% 100%, 0 100%, 0 0,
                  ${(cropArea.x / imageSize.width) * 100}% ${(cropArea.y / imageSize.height) * 100}%,
                  ${(cropArea.x / imageSize.width) * 100}% ${((cropArea.y + cropArea.height) / imageSize.height) * 100}%,
                  ${((cropArea.x + cropArea.width) / imageSize.width) * 100}% ${((cropArea.y + cropArea.height) / imageSize.height) * 100}%,
                  ${((cropArea.x + cropArea.width) / imageSize.width) * 100}% ${(cropArea.y / imageSize.height) * 100}%,
                  ${(cropArea.x / imageSize.width) * 100}% ${(cropArea.y / imageSize.height) * 100}%
                )`,
              }}
            />
            <div
              className="absolute border-2 border-white shadow-lg cursor-move"
              style={{
                left: `${(cropArea.x / imageSize.width) * 100}%`,
                top: `${(cropArea.y / imageSize.height) * 100}%`,
                width: `${(cropArea.width / imageSize.width) * 100}%`,
                height: `${(cropArea.height / imageSize.height) * 100}%`,
              }}
              onMouseDown={handleMouseDown}
            >
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-gray-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-gray-400" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-gray-400" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-gray-400" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCrop}>Crop</Button>
            {croppedImage && (
              <Button variant="secondary" onClick={handleDownload}>
                Download
              </Button>
            )}
          </div>

          {croppedImage && (
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Result ({Math.round(cropArea.width)} x {Math.round(cropArea.height)}px)
              </p>
              <img
                src={croppedImage}
                alt="Cropped"
                className="max-w-full h-auto rounded"
                style={{ maxHeight: '300px' }}
              />
            </Card>
          )}
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
          ✂️ What is Image Cropper?
        </h2>
        <p className="text-sm leading-relaxed">
          Image Cropper is an online tool that lets you select and extract specific areas from photos.
          Select your crop area by dragging, or enter precise pixel coordinates for exact control.
          Perfect for creating profile pictures, removing unwanted backgrounds, and resizing for social media thumbnails.
          No software installation needed - works directly in your browser with local processing to keep your images private.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📐 Aspect Ratio Presets
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Ratio</th>
                <th className="text-left py-2 px-2">Purpose</th>
                <th className="text-left py-2 px-2">Recommended For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">1:1</td><td>Square</td><td>Instagram, profile pictures</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">4:3</td><td>Traditional photo</td><td>Print, presentations</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">16:9</td><td>Widescreen</td><td>YouTube thumbnails, banners</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">3:2</td><td>DSLR standard</td><td>Photo prints, photobooks</td></tr>
              <tr><td className="py-2 px-2 font-medium">Free</td><td>Custom ratio</td><td>Special uses, banners</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Image Cropping Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Center your subject</strong>: Place people/products in the center for balanced composition</li>
          <li><strong>Leave margins</strong>: For thumbnails with text overlay, leave space at top or bottom</li>
          <li><strong>Platform specs</strong>: Each social media has different recommended ratios, use presets</li>
          <li><strong>Maintain resolution</strong>: Cropping too small may result in low resolution output</li>
          <li><strong>Precise cropping</strong>: Use pixel input for exact dimensions</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Does cropping damage the original image?',
            answer: 'No, the original image remains untouched. Cropped results download as new files, leaving your original safe.',
          },
          {
            question: 'Can I set exact crop dimensions?',
            answer: 'Yes, you can directly input X, Y coordinates and width, height in pixels for precise area selection.',
          },
          {
            question: 'How do I create square Instagram photos?',
            answer: 'Select the 1:1 ratio preset to automatically set a square crop area. Then drag to position and crop.',
          },
        ]}
      />
    </div>
  );
}
