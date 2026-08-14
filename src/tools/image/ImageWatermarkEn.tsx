'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'tiled';

type OutputFormat = 'png' | 'jpeg';

interface WatermarkSettings {
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  position: Position;
  rotation: number;
}

const POSITION_GRID: { value: Position; label: string; title: string }[] = [
  { value: 'top-left', label: '↖', title: 'Top left' },
  { value: 'top-center', label: '↑', title: 'Top center' },
  { value: 'top-right', label: '↗', title: 'Top right' },
  { value: 'middle-left', label: '←', title: 'Middle left' },
  { value: 'middle-center', label: '●', title: 'Center' },
  { value: 'middle-right', label: '→', title: 'Middle right' },
  { value: 'bottom-left', label: '↙', title: 'Bottom left' },
  { value: 'bottom-center', label: '↓', title: 'Bottom center' },
  { value: 'bottom-right', label: '↘', title: 'Bottom right' },
];

function drawWatermark(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  settings: WatermarkSettings,
  outputFormat: OutputFormat
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // JPEG doesn't support transparency, so fill a white background first
  if (outputFormat === 'jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const { text, fontSize, color, opacity, position, rotation } = settings;
  if (!text) return;

  const radians = (rotation * Math.PI) / 180;

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(100, opacity)) / 100;
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px sans-serif`;

  if (position === 'tiled') {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(radians);

    const textWidth = Math.max(ctx.measureText(text).width, fontSize);
    const gapX = textWidth + fontSize * 1.5;
    const gapY = fontSize * 3;
    const diag = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);

    for (let y = -diag; y <= diag; y += gapY) {
      for (let x = -diag; x <= diag; x += gapX) {
        ctx.fillText(text, x, y);
      }
    }
  } else {
    const padding = Math.max(16, fontSize * 0.4);
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let textAlign: CanvasTextAlign = 'center';
    let textBaseline: CanvasTextBaseline = 'middle';

    if (position.includes('left')) {
      x = padding;
      textAlign = 'left';
    } else if (position.includes('right')) {
      x = canvas.width - padding;
      textAlign = 'right';
    }

    if (position.startsWith('top')) {
      y = padding;
      textBaseline = 'top';
    } else if (position.startsWith('bottom')) {
      y = canvas.height - padding;
      textBaseline = 'bottom';
    }

    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.translate(x, y);
    ctx.rotate(radians);
    ctx.fillText(text, 0, 0);
  }

  ctx.restore();
}

export function ImageWatermarkEn() {
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [fileName, setFileName] = useState('image');

  const [text, setText] = useState('Watermark');
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(50);
  const [position, setPosition] = useState<Position>('bottom-right');
  const [rotation, setRotation] = useState(-30);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result !== 'string') return;

      const img = new Image();
      img.onload = () => {
        setImgObj(img);
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);

    setFileName(file.name.replace(/\.[^/.]+$/, '') || 'image');
  }, []);

  useEffect(() => {
    if (!imgObj || !canvasRef.current) return;
    drawWatermark(
      canvasRef.current,
      imgObj,
      { text, fontSize, color, opacity, position, rotation },
      outputFormat
    );
  }, [imgObj, text, fontSize, color, opacity, position, rotation, outputFormat]);

  const handleReset = () => {
    setImgObj(null);
    setImageSize(null);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mime = outputFormat === 'png' ? 'image/png' : 'image/jpeg';
    const extension = outputFormat === 'png' ? 'png' : 'jpg';

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${fileName}_watermark.${extension}`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      },
      mime,
      outputFormat === 'jpeg' ? 0.92 : undefined
    );
  };

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        onFileSelect={handleImageUpload}
        label="Upload Image"
        description="Choose an image to add a watermark to"
      />

      {imgObj && imageSize && (
        <>
          <Card variant="bordered" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Text / style settings */}
              <div className="space-y-4">
                <Input
                  label="Watermark Text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Text to display as watermark"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="200"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color
                    </label>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Opacity: {opacity}%
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rotation: {rotation}°
                  </label>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Position / output settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position
                  </label>
                  <div className="grid grid-cols-3 gap-1 w-fit">
                    {POSITION_GRID.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        title={p.title}
                        onClick={() => setPosition(p.value)}
                        className={`w-11 h-11 flex items-center justify-center rounded-lg border text-base transition-colors ${
                          position === p.value
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPosition('tiled')}
                    className={`mt-2 w-full py-2 text-sm rounded-lg border transition-colors ${
                      position === 'tiled'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    🔁 Tiled (Repeat)
                  </button>
                </div>

                <Select
                  label="Output Format"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                  options={[
                    { value: 'png', label: 'PNG (Transparent bg)' },
                    { value: 'jpeg', label: 'JPEG (Smaller size)' },
                  ]}
                />
              </div>
            </div>
          </Card>

          <Card variant="bordered" className="p-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview ({imageSize.width} x {imageSize.height}px)
            </p>
            <div className="overflow-auto max-w-full flex justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto rounded"
                style={{ maxHeight: '500px' }}
              />
            </div>
          </Card>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleDownload}>Download</Button>
            <Button variant="ghost" onClick={handleReset}>
              Remove Image
            </Button>
          </div>
        </>
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
          🖋️ What is Image Watermark?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">Overlays text on a photo to mark copyright or source.</strong>{' '}
          Adjust <strong>font size, color, opacity, and rotation angle</strong> freely, and choose a
          <strong>9-point placement</strong> or a <strong>tiled/repeat pattern</strong> that covers the whole image diagonally.
          Everything runs in the browser Canvas — images are never uploaded to a server.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📍 Placement Comparison
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Mode</th>
                <th className="text-left py-2 px-2">Features</th>
                <th className="text-left py-2 px-2">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">9-grid single position</td><td>Shows in one spot, minimal distraction</td><td>Blog photos, social media</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Tiled/repeat</td><td>Covers the entire image diagonally</td><td>Anti-theft, document/proof previews</td></tr>
              <tr><td className="py-2 px-2">Rotation angle</td><td>Tilts the text at an angle</td><td>Natural look, stronger anti-forgery</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Watermark Settings Guide
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Opacity 30-50%</strong> — visible mark without hiding the photo</li>
          <li><strong>Corner placement (e.g. bottom-right)</strong> — most common for copyright marks</li>
          <li><strong>Tiled + -30° rotation</strong> — effective for preventing document/design leaks</li>
          <li><strong>High-contrast color</strong> — pick white or black depending on background brightness</li>
        </ul>
        <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 p-4 text-sm">
          <p className="font-semibold text-emerald-900 dark:text-emerald-200 mb-1">💡 Watermark tip</p>
          <p className="text-emerald-800 dark:text-emerald-300">
            For shared photos, use <strong>bottom-right + 40% opacity</strong>. If theft prevention matters, use <strong>tiled mode</strong>.
          </p>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Does adding a watermark modify my original image?',
            answer: 'No, your original file remains unchanged. A new watermarked image is downloaded separately, and all processing happens in your browser without server uploads.',
          },
          {
            question: 'Should I choose PNG or JPEG?',
            answer: 'Choose PNG if you need transparency or the highest quality, and JPEG if you want a smaller file size. When saving as JPEG, transparent areas are filled with a white background.',
          },
          {
            question: 'How do I keep the watermark from covering the whole photo?',
            answer: 'Pick a corner from the 9-grid (e.g. bottom-right) and lower the opacity to 30-50% so the mark stays visible without obscuring the photo.',
          },
        ]}
      />
    </div>
  );
}
