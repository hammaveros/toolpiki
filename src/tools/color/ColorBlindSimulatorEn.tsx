'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

type ColorBlindType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

interface ColorBlindInfo {
  name: string;
  description: string;
  matrix: number[][];
}

const COLOR_BLIND_TYPES: Record<ColorBlindType, ColorBlindInfo> = {
  normal: {
    name: 'Normal',
    description: 'Normal color vision',
    matrix: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
  },
  protanopia: {
    name: 'Protanopia',
    description: 'Red-blind (L-cone deficiency)',
    matrix: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758],
    ],
  },
  deuteranopia: {
    name: 'Deuteranopia',
    description: 'Green-blind (M-cone deficiency)',
    matrix: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7],
    ],
  },
  tritanopia: {
    name: 'Tritanopia',
    description: 'Blue-blind (S-cone deficiency)',
    matrix: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525],
    ],
  },
  achromatopsia: {
    name: 'Achromatopsia',
    description: 'Total color blindness (grayscale)',
    matrix: [
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
    ],
  },
};

function applyColorBlindness(imageData: ImageData, type: ColorBlindType): ImageData {
  const matrix = COLOR_BLIND_TYPES[type].matrix;
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    data[i] = Math.min(255, Math.max(0, r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2]));
    data[i + 1] = Math.min(255, Math.max(0, r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2]));
    data[i + 2] = Math.min(255, Math.max(0, r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2]));
  }

  return imageData;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function simulateColorBlindness(hex: string, type: ColorBlindType): string {
  const { r, g, b } = hexToRgb(hex);
  const matrix = COLOR_BLIND_TYPES[type].matrix;

  const newR = Math.min(255, Math.max(0, Math.round(r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2])));
  const newG = Math.min(255, Math.max(0, Math.round(r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2])));
  const newB = Math.min(255, Math.max(0, Math.round(r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2])));

  return `rgb(${newR}, ${newG}, ${newB})`;
}

const PALETTE_COLORS = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FF8000', '#80FF00', '#0080FF', '#FF0080', '#8000FF', '#00FF80'
];

export function ColorBlindSimulatorEn() {
  const [selectedType, setSelectedType] = useState<ColorBlindType>('protanopia');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback((imageSrc: string, type: ColorBlindType) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const processed = applyColorBlindness(imageData, type);
      ctx.putImageData(processed, 0, 0);

      setProcessedImage(canvas.toDataURL());
    };
    img.src = imageSrc;
  }, []);

  useEffect(() => {
    if (originalImage) {
      processImage(originalImage, selectedType);
    }
  }, [originalImage, selectedType, processImage]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setOriginalImage(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-2">
      {/* Color blindness type selection */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(COLOR_BLIND_TYPES) as [ColorBlindType, ColorBlindInfo][]).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setSelectedType(key)}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedType === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {info.name}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        {COLOR_BLIND_TYPES[selectedType].description}
      </p>

      {/* Image upload */}
      {!originalImage ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors',
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          )}
        >
          <div className="text-4xl mb-4">🖼️</div>
          <p className="text-gray-600 dark:text-gray-400">
            Drag an image or click to upload
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Supports PNG, JPG, GIF
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="bordered" className="p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Original
              </h3>
              <img
                src={originalImage}
                alt="Original image"
                className="w-full rounded-lg"
              />
            </Card>
            <Card variant="bordered" className="p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {COLOR_BLIND_TYPES[selectedType].name} Simulation
              </h3>
              {processedImage && (
                <img
                  src={processedImage}
                  alt="Simulated image"
                  className="w-full rounded-lg"
                />
              )}
            </Card>
          </div>

          <Button
            onClick={() => { setOriginalImage(null); setProcessedImage(null); }}
            variant="secondary"
            className="w-full"
          >
            Choose Another Image
          </Button>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {/* Color palette test */}
      <Card variant="bordered" className="p-5">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Color Palette Comparison
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {PALETTE_COLORS.map((color) => {
            const simColor = simulateColorBlindness(color, selectedType);

            return (
              <div key={color} className="space-y-1">
                <div
                  className="aspect-square rounded-lg"
                  style={{ backgroundColor: color }}
                  title={`Original: ${color}`}
                />
                <div
                  className="aspect-square rounded-lg"
                  style={{ backgroundColor: simColor }}
                  title={`Simulated: ${simColor}`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>Original</span>
          <span>Simulated</span>
        </div>
      </Card>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          👁️ What is Color Blindness Simulator?
        </h2>
        <p className="text-sm leading-relaxed">
          Color Blindness Simulator is an accessibility tool that shows how people with color vision deficiency perceive images.
          It supports major types including Protanopia (red-blind), Deuteranopia (green-blind), Tritanopia (blue-blind), and Achromatopsia (total color blindness).
          Compare both uploaded images and color palettes in real-time, making design reviews easy.
          About 8% of males and 0.5% of females worldwide have color vision deficiency, making accessibility consideration essential.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Color Vision Deficiency Types
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Type</th>
                <th className="text-left py-2 px-2">Affected Colors</th>
                <th className="text-left py-2 px-2">Prevalence</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Protanopia</td><td>Red-green confusion</td><td>1% male, 0.01% female</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Deuteranopia</td><td>Red-green confusion</td><td>5% male, 0.4% female</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Tritanopia</td><td>Blue-yellow confusion</td><td>Very rare (0.01%)</td></tr>
              <tr><td className="py-2 px-2 font-medium">Achromatopsia</td><td>All colors (grayscale only)</td><td>Extremely rare (0.003%)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Accessible Design Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Avoid color-only cues</strong>: Use icons, patterns, and text labels together</li>
          <li><strong>Sufficient contrast</strong>: Ensure brightness difference between foreground and background</li>
          <li><strong>Safe color combinations</strong>: Use blue-orange instead of red-green</li>
          <li><strong>Charts and graphs</strong>: Include patterns or markers beyond color</li>
          <li><strong>Error indicators</strong>: Provide multiple cues with red + icon + text</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Is the simulation identical to actual color blindness?',
            answer: 'The simulation is based on scientific models, but color vision deficiency varies between individuals. Use it to understand general trends, and actual user testing is recommended.',
          },
          {
            question: 'Which type should I check first?',
            answer: 'Red-green color blindness (Deuteranopia + Protanopia) is most common, so check these two types first. Over 99% of all color blind people have red-green deficiency.',
          },
          {
            question: 'Are my images sent to a server?',
            answer: 'No, all image processing is done locally in your browser. For privacy protection, images are never uploaded anywhere.',
          },
        ]}
      />
    </div>
  );
}
