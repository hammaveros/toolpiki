'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

export function ImageRotateEn() {
  const [image, setImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const processImage = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const isRotated = rotation === 90 || rotation === 270;
      canvas.width = isRotated ? img.height : img.width;
      canvas.height = isRotated ? img.width : img.height;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  }, [image, rotation, flipH, flipV]);

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.download = `rotated_${rotation}deg.png`;
    link.href = processedImage;
    link.click();
  };

  const handleReset = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setProcessedImage(null);
  };

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        onFileSelect={handleImageUpload}
        label="Upload Image"
        description="Supports JPG, PNG, GIF, WebP"
      />

      {image && (
        <>
          <Card variant="bordered" className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rotate
                </label>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="secondary" onClick={handleRotateLeft}>
                    ↺ 90° Left
                  </Button>
                  <Button variant="secondary" onClick={handleRotateRight}>
                    ↻ 90° Right
                  </Button>
                  <Button
                    variant={rotation === 180 ? 'primary' : 'secondary'}
                    onClick={() => setRotation(180)}
                  >
                    180°
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Current rotation: {rotation}°</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Flip
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={flipH ? 'primary' : 'secondary'}
                    onClick={() => setFlipH(!flipH)}
                  >
                    ↔ Flip Horizontal
                  </Button>
                  <Button
                    variant={flipV ? 'primary' : 'secondary'}
                    onClick={() => setFlipV(!flipV)}
                  >
                    ↕ Flip Vertical
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-2">
            <Button onClick={processImage}>Apply</Button>
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
            {processedImage && (
              <Button variant="secondary" onClick={handleDownload}>
                Download
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original</p>
              <div className="flex justify-center">
                <img
                  src={image}
                  alt="Original"
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </div>
            </Card>

            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</p>
              <div className="flex justify-center">
                <img
                  src={image}
                  alt="Preview"
                  className="max-w-full h-auto rounded transition-transform duration-200"
                  style={{
                    maxHeight: '300px',
                    objectFit: 'contain',
                    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                  }}
                />
              </div>
            </Card>
          </div>

          {processedImage && (
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Result (Rotation: {rotation}°, H-Flip: {flipH ? 'Yes' : 'No'}, V-Flip: {flipV ? 'Yes' : 'No'})
              </p>
              <div className="flex justify-center">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </div>
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
          🔄 What is Image Rotate/Flip?
        </h2>
        <p className="text-sm leading-relaxed">
          Image Rotate/Flip is an online tool that corrects photo orientation or applies mirror effects.
          Easily fix smartphone photos that were saved rotated, or correct scanned documents with wrong orientation.
          No software installation required - works directly in your browser with all processing done locally for privacy.
          Real-time preview lets you see the exact result before applying and downloading.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📐 Rotation Options Guide
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Option</th>
                <th className="text-left py-2 px-2">Description</th>
                <th className="text-left py-2 px-2">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">90° Left</td><td>Counter-clockwise 90°</td><td>Portrait to landscape</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">90° Right</td><td>Clockwise 90°</td><td>Landscape to portrait</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">180°</td><td>Upside down flip</td><td>Upside-down photos</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Flip Horizontal</td><td>Mirror left-right</td><td>Selfie flip, mirror effect</td></tr>
              <tr><td className="py-2 px-2 font-medium">Flip Vertical</td><td>Mirror top-bottom</td><td>Reflection effects</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Image Rotation Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>EXIF orientation issues</strong>: Fix photos with incorrect camera orientation metadata</li>
          <li><strong>Scanned documents</strong>: Correct wrongly scanned document orientation</li>
          <li><strong>Selfie correction</strong>: Use horizontal flip to restore original direction</li>
          <li><strong>Combine operations</strong>: Apply rotation and flip together for various effects</li>
          <li><strong>Preserve original</strong>: Preview before applying, download saves as new file</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Does rotation reduce image quality?',
            answer: 'Right-angle rotations (90°, 180°, 270°) are processed without quality loss. Results are saved as PNG to maintain high quality.',
          },
          {
            question: 'Can I combine rotation and flip?',
            answer: 'Yes, you can freely combine rotation angles with horizontal/vertical flip. The preview shows the result instantly.',
          },
          {
            question: 'What image formats are supported?',
            answer: 'JPG, PNG, GIF, WebP and most browser-supported image formats can be used. Results are saved as PNG.',
          },
        ]}
      />
    </div>
  );
}
