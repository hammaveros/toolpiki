'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

type ColorBlindType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

const colorBlindTypes: { type: ColorBlindType; name: string; description: string }[] = [
  { type: 'protanopia', name: 'Protanopia', description: 'Red-blind (no red cones)' },
  { type: 'deuteranopia', name: 'Deuteranopia', description: 'Green-blind (no green cones)' },
  { type: 'tritanopia', name: 'Tritanopia', description: 'Blue-blind (no blue cones)' },
  { type: 'achromatopsia', name: 'Achromatopsia', description: 'Total color blindness' },
];

const matrices: Record<ColorBlindType, number[][]> = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
};

function applyColorBlindness(imageData: ImageData, type: ColorBlindType): ImageData {
  const data = imageData.data;
  const matrix = matrices[type];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    data[i] = Math.min(255, matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b);
    data[i + 1] = Math.min(255, matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b);
    data[i + 2] = Math.min(255, matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b);
  }

  return imageData;
}

export function ColorBlindnessEn() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ColorBlindType>('deuteranopia');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = useCallback((imageSrc: string, type: ColorBlindType) => {
    setIsProcessing(true);

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

      setProcessedImage(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    };
    img.src = imageSrc;
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setOriginalImage(result);
      processImage(result, selectedType);
    };
    reader.readAsDataURL(file);
  };

  const handleTypeChange = (type: ColorBlindType) => {
    setSelectedType(type);
    if (originalImage) {
      processImage(originalImage, type);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.download = `colorblind-${selectedType}.png`;
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Image Upload */}
      <Card variant="bordered" className="p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          {originalImage ? (
            <p className="text-sm text-gray-500">Click to select another image</p>
          ) : (
            <>
              <p className="text-gray-500 mb-2">Click or drag image to upload</p>
              <p className="text-xs text-gray-400">Supports PNG, JPG, WebP</p>
            </>
          )}
        </div>
      </Card>

      {/* Color Blindness Type Selection */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Color Blindness Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {colorBlindTypes.map((item) => (
            <button
              key={item.type}
              onClick={() => handleTypeChange(item.type)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedType === item.type
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium text-gray-800 dark:text-white">{item.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Image Comparison */}
      {originalImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="bordered" className="p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original</h3>
            <img src={originalImage} alt="Original" className="w-full rounded-lg" />
          </Card>

          <Card variant="bordered" className="p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {colorBlindTypes.find((t) => t.type === selectedType)?.name} Simulation
            </h3>
            {isProcessing ? (
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Processing...</span>
              </div>
            ) : processedImage ? (
              <img src={processedImage} alt="Simulated" className="w-full rounded-lg" />
            ) : null}
          </Card>
        </div>
      )}

      {/* Download Button */}
      {processedImage && (
        <Button onClick={handleDownload} className="w-full">
          Download Simulated Image
        </Button>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Info */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Simulates how people with color blindness see images</p>
        <p>• Use for accessibility testing in web/app design</p>
        <p>• Images are processed locally and never sent to any server</p>
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
          👁️ What Is a Color Blindness Simulator?
        </h2>
        <p className="text-sm leading-relaxed">
          A color blindness simulator shows how people with color vision deficiency perceive images and designs.
          It is an essential accessibility tool for web designers, app developers, and graphic designers to ensure
          that content is readable and usable by everyone, regardless of their color vision.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔬 Types of Color Blindness
        </h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <div>
            <p className="font-medium">Red-Green Color Blindness (Most Common)</p>
            <p>Affects about 8% of males and 0.5% of females worldwide. It makes it difficult to distinguish between red and green colors. Includes Protanopia (red-blind) and Deuteranopia (green-blind).</p>
          </div>
          <div>
            <p className="font-medium">Blue-Yellow Color Blindness</p>
            <p>Also known as Tritanopia, this type makes it hard to tell blue and yellow apart. It is less common than red-green color blindness.</p>
          </div>
          <div>
            <p className="font-medium">Complete Color Blindness</p>
            <p>A very rare condition where no colors can be perceived at all. Everything appears in shades of gray (Achromatopsia).</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎨 Accessible Design Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>Never rely on color alone to convey information. Use patterns, icons, or text labels</li>
          <li>Use blue-orange combinations instead of red-green for better distinction</li>
          <li>Add visual cues like dashed lines or markers in charts and graphs</li>
          <li>Ensure sufficient contrast ratio (WCAG recommends 4.5:1 minimum)</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'How common is color blindness?',
            answer: 'About 8% of males (1 in 12) and 0.5% of females (1 in 200) worldwide have some form of color vision deficiency. Red-green color blindness is the most prevalent type.',
          },
          {
            question: 'Can this simulator diagnose color blindness?',
            answer: 'No, this tool simulates how color-blind individuals see images. For diagnosis, please consult an eye doctor who can perform tests like the Ishihara color test.',
          },
          {
            question: 'Are my uploaded images safe?',
            answer: 'Yes, all image processing is done locally in your browser. No images are uploaded to any server, ensuring complete privacy.',
          },
        ]}
      />
    </div>
  );
}
