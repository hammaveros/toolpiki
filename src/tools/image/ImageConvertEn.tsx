'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

type ImageFormat = 'png' | 'jpeg' | 'webp';

interface ConvertedImage {
  id: string;
  originalFile: File;
  originalPreview: string;
  converted: string | null;
  convertedSize: number;
}

const FORMAT_INFO: Record<ImageFormat, { mime: string; ext: string; label: string }> = {
  png: { mime: 'image/png', ext: 'png', label: 'PNG (Lossless)' },
  jpeg: { mime: 'image/jpeg', ext: 'jpg', label: 'JPEG (Lossy)' },
  webp: { mime: 'image/webp', ext: 'webp', label: 'WebP (Modern)' },
};

export function ImageConvertEn() {
  const [images, setImages] = useState<ConvertedImage[]>([]);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState(90);
  const [isConverting, setIsConverting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImagesUpload = useCallback((files: File[]) => {
    const newImages: ConvertedImage[] = [];
    let loaded = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push({
          id: `${Date.now()}-${Math.random()}`,
          originalFile: file,
          originalPreview: e.target?.result as string,
          converted: null,
          convertedSize: 0,
        });
        loaded++;
        if (loaded === files.length) {
          setImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const convertSingle = (imageData: ConvertedImage): Promise<ConvertedImage> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        resolve(imageData);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageData);
        return;
      }

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const formatInfo = FORMAT_INFO[targetFormat];
        const qualityValue = targetFormat === 'png' ? 1 : quality / 100;
        const converted = canvas.toDataURL(formatInfo.mime, qualityValue);

        const base64Length = converted.split(',')[1].length;
        const convertedSize = Math.round((base64Length * 3) / 4);

        resolve({
          ...imageData,
          converted,
          convertedSize,
        });
      };
      img.src = imageData.originalPreview;
    });
  };

  const handleConvertAll = async () => {
    if (images.length === 0) return;

    setIsConverting(true);

    const convertedImages: ConvertedImage[] = [];
    for (const image of images) {
      const converted = await convertSingle(image);
      convertedImages.push(converted);
    }

    setImages(convertedImages);
    setIsConverting(false);
  };

  const handleDownloadAll = async () => {
    const convertedImages = images.filter((img) => img.converted);
    if (convertedImages.length === 0) return;

    const formatInfo = FORMAT_INFO[targetFormat];

    // Single file: direct download
    if (convertedImages.length === 1) {
      const img = convertedImages[0];
      const originalName = img.originalFile.name.replace(/\.[^/.]+$/, '');
      const link = document.createElement('a');
      link.download = `${originalName}.${formatInfo.ext}`;
      link.href = img.converted!;
      link.click();
      return;
    }

    // Multiple files: ZIP download
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    convertedImages.forEach((img) => {
      const originalName = img.originalFile.name.replace(/\.[^/.]+$/, '');
      const base64Data = img.converted!.split(',')[1];
      zip.file(`${originalName}.${formatInfo.ext}`, base64Data, { base64: true });
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.download = `converted_images.zip`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleDownloadSingle = (img: ConvertedImage) => {
    if (!img.converted) return;
    const formatInfo = FORMAT_INFO[targetFormat];
    const originalName = img.originalFile.name.replace(/\.[^/.]+$/, '');
    const link = document.createElement('a');
    link.download = `${originalName}.${formatInfo.ext}`;
    link.href = img.converted;
    link.click();
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleClear = () => {
    setImages([]);
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getOriginalFormat = (file: File): string => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const formatMap: Record<string, string> = {
      jpg: 'JPEG', jpeg: 'JPEG', png: 'PNG', gif: 'GIF', webp: 'WebP', bmp: 'BMP',
    };
    return formatMap[ext] || ext.toUpperCase();
  };

  const allConverted = images.length > 0 && images.every((img) => img.converted);

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        multiple
        onUpload={handleImagesUpload}
        label="Upload Images (multiple selection)"
        description="Supports JPG, PNG, GIF, WebP, BMP"
      />

      {images.length > 0 && (
        <>
          {/* Settings */}
          <Card variant="bordered" className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium">
                {images.length} image{images.length > 1 ? 's' : ''} selected
              </p>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear All
              </Button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Output Format
              </label>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(FORMAT_INFO) as ImageFormat[]).map((format) => (
                  <Button
                    key={format}
                    variant={targetFormat === format ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setTargetFormat(format)}
                  >
                    {FORMAT_INFO[format].label}
                  </Button>
                ))}
              </div>
            </div>

            {targetFormat !== 'png' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </Card>

          {/* Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleConvertAll} disabled={isConverting}>
              {isConverting ? 'Converting...' : `Convert All (${images.length})`}
            </Button>
            {allConverted && (
              <Button variant="secondary" onClick={handleDownloadAll}>
                Download All (.{FORMAT_INFO[targetFormat].ext})
              </Button>
            )}
          </div>

          {/* Image List */}
          <div className="space-y-3">
            {images.map((img) => (
              <Card key={img.id} variant="bordered" className="p-3">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <img
                    src={img.originalPreview}
                    alt={img.originalFile.name}
                    className="w-16 h-16 object-cover rounded"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{img.originalFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {getOriginalFormat(img.originalFile)} • {formatSize(img.originalFile.size)}
                      {img.converted && (
                        <span className="text-green-600 dark:text-green-400">
                          {' → '}{FORMAT_INFO[targetFormat].ext.toUpperCase()} • {formatSize(img.convertedSize)}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {img.converted && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownloadSingle(img)}
                      >
                        Download
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(img.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Format Comparison
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li><strong>PNG:</strong> Lossless compression, supports transparency, larger file size</li>
          <li><strong>JPEG:</strong> Lossy compression, best for photos, no transparency</li>
          <li><strong>WebP:</strong> Smaller than PNG/JPEG, modern browser support</li>
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
          🔄 What is Image Format Converter?
        </h2>
        <p className="text-sm leading-relaxed">
          Image Format Converter transforms images between different formats like JPG, PNG, and WebP online.
          Convert to WebP for web optimization, PNG when transparency is needed, or JPEG for smaller file sizes.
          Select multiple images for batch conversion and download them all at once as a ZIP file.
          All processing happens in your browser - no images are uploaded to any server, ensuring complete privacy.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Image Format Comparison
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Format</th>
                <th className="text-left py-2 px-2">Compression</th>
                <th className="text-left py-2 px-2">Transparency</th>
                <th className="text-left py-2 px-2">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">PNG</td><td>Lossless</td><td>Supported</td><td>Logos, icons, screenshots</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">JPEG</td><td>Lossy</td><td>Not supported</td><td>Photos, complex images</td></tr>
              <tr><td className="py-2 px-2 font-medium">WebP</td><td>Both</td><td>Supported</td><td>Web optimization (all uses)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Format Selection Guide
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Web performance</strong>: WebP reduces file size 25-35% vs JPEG/PNG</li>
          <li><strong>Need transparency</strong>: Choose PNG or WebP (JPEG lacks transparency)</li>
          <li><strong>Maximum quality</strong>: PNG (lossless) or JPEG at 100% quality</li>
          <li><strong>File size priority</strong>: JPEG at 70-80% or WebP recommended</li>
          <li><strong>Compatibility first</strong>: Use JPEG/PNG for older browser support</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Can I convert multiple images at once?',
            answer: 'Yes, select multiple images when uploading. After conversion, download them all as a ZIP file.',
          },
          {
            question: 'How do I set JPEG quality?',
            answer: 'A quality slider appears when selecting JPEG or WebP. 80-90% is recommended for balancing quality and file size.',
          },
          {
            question: 'Why is there no quality setting for PNG?',
            answer: 'PNG uses lossless compression with no quality loss. It always maintains original quality without a quality setting.',
          },
        ]}
      />
    </div>
  );
}
