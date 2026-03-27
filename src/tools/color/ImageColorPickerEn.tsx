'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

interface PickedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  position: { x: number; y: number };
}

export function ImageColorPickerEn() {
  const [image, setImage] = useState<string | null>(null);
  const [pickedColors, setPickedColors] = useState<PickedColor[]>([]);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setPickedColors([]);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageLoad = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
  };

  const getColorAtPosition = (e: React.MouseEvent<HTMLImageElement>): PickedColor | null => {
    if (!canvasRef.current || !imageRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return null;

    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    const hex = '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('').toUpperCase();

    return {
      hex,
      rgb: { r, g, b },
      position: { x, y },
    };
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const color = getColorAtPosition(e);
    if (color) {
      setPickedColors((prev) => [color, ...prev.slice(0, 9)]);
    }
  };

  const handleImageHover = (e: React.MouseEvent<HTMLImageElement>) => {
    const color = getColorAtPosition(e);
    setHoveredColor(color?.hex || null);
  };

  const clearColors = () => {
    setPickedColors([]);
  };

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        onFileSelect={handleImageUpload}
        label="Upload Image"
        description="Click on the image to extract colors"
      />

      {image && (
        <>
          <Card variant="bordered" className="p-4">
            <div className="relative inline-block">
              <img
                ref={imageRef}
                src={image}
                alt="Color picker"
                className="max-w-full h-auto rounded cursor-crosshair"
                style={{ maxHeight: '400px' }}
                onClick={handleImageClick}
                onMouseMove={handleImageHover}
                onMouseLeave={() => setHoveredColor(null)}
                onLoad={handleImageLoad}
              />
              {hoveredColor && (
                <div className="absolute top-2 right-2 flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded shadow">
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: hoveredColor }}
                  />
                  <span className="font-mono text-sm">{hoveredColor}</span>
                </div>
              )}
            </div>
          </Card>

          <canvas ref={canvasRef} className="hidden" />

          {pickedColors.length > 0 && (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Extracted Colors ({pickedColors.length})
                </h3>
                <Button variant="secondary" size="sm" onClick={clearColors}>
                  Clear
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {pickedColors.map((color, index) => (
                  <Card key={index} variant="bordered" className="p-3">
                    <div
                      className="w-full h-16 rounded mb-2"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono text-sm font-medium">{color.hex}</p>
                        <p className="text-xs text-gray-500">
                          rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                        </p>
                      </div>
                      <CopyButton text={color.hex} size="sm" />
                    </div>
                  </Card>
                ))}
              </div>

              <Card variant="bordered" className="p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Extracted Palette
                </h3>
                <div className="flex rounded overflow-hidden h-12">
                  {pickedColors.map((color, index) => (
                    <div
                      key={index}
                      className="flex-1"
                      style={{ backgroundColor: color.hex }}
                      title={color.hex}
                    />
                  ))}
                </div>
                <div className="mt-2">
                  <CopyButton
                    text={pickedColors.map((c) => c.hex).join(', ')}
                    label="Copy Palette"
                  />
                </div>
              </Card>
            </>
          )}
        </>
      )}

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
        <p>Click anywhere on the image to extract the color at that position.</p>
        <p>Up to 10 colors can be saved.</p>
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
          🖼️ What is Image Color Picker?
        </h2>
        <p className="text-sm leading-relaxed">
          Image Color Picker extracts exact color codes from any position in an uploaded image.
          Preview colors in real-time as you hover over the image, then click to save them.
          Save up to 10 colors to build a palette, with both HEX and RGB codes provided.
          Perfect for design reference analysis, brand color extraction, and photo color studies.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Color Extraction Use Cases
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Field</th>
                <th className="text-left py-2 px-2">Application</th>
                <th className="text-left py-2 px-2">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Web Design</td><td>Extract colors from reference images</td><td>Analyze inspiring website palettes</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Branding</td><td>Extract colors from logos/products</td><td>Document brand guidelines</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Photo Editing</td><td>Analyze original photo tones</td><td>Get color correction references</td></tr>
              <tr><td className="py-2 px-2 font-medium">Illustration</td><td>Extract palettes from reference art</td><td>Study and learn color schemes</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Color Extraction Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Pick representative colors</strong>: Extract multiple colors from key areas</li>
          <li><strong>Shadows and highlights</strong>: Extract both light and dark areas of the same object</li>
          <li><strong>High-resolution images</strong>: Use quality images for more accurate colors</li>
          <li><strong>Compression warning</strong>: JPEG compression can distort colors, prefer PNG</li>
          <li><strong>Color space awareness</strong>: Know the difference between web sRGB and print CMYK</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'The extracted color looks different from the original',
            answer: 'This can happen due to monitor color profiles, image compression, and color space differences. Using a calibrated monitor and lossless images (PNG) will give more accurate results.',
          },
          {
            question: 'Is my image uploaded to a server?',
            answer: 'No, all processing happens locally in your browser. Images are never sent to any server, and data is deleted when you close the page.',
          },
          {
            question: 'Can I extract more than 10 colors?',
            answer: 'When you extract a new color, the oldest one is automatically removed. Use the copy button to save important colors before they are replaced.',
          },
        ]}
      />
    </div>
  );
}
