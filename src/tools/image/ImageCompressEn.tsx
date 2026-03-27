'use client';

import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { FaqSection } from '@/components/ui/FaqItem';

type OutputFormat = 'jpeg' | 'png' | 'webp';

interface ImageItem {
  id: string;
  originalFile: File;
  originalPreview: string;
  compressedBlob: Blob | null;
  compressedPreview: string | null;
  status: 'pending' | 'compressing' | 'done' | 'error';
}

export function ImageCompressEn() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('jpeg');
  const [maxSize, setMaxSize] = useState('4096');
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFilesUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newItem: ImageItem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          originalFile: file,
          originalPreview: ev.target?.result as string,
          compressedBlob: null,
          compressedPreview: null,
          status: 'pending',
        };
        setImages((prev) => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  }, []);

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearAll = () => {
    setImages([]);
  };

  const getMimeType = (format: OutputFormat): string => {
    switch (format) {
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'webp': return 'image/webp';
    }
  };

  const getExtension = (format: OutputFormat): string => {
    switch (format) {
      case 'jpeg': return 'jpg';
      case 'png': return 'png';
      case 'webp': return 'webp';
    }
  };

  const compressAll = async () => {
    if (images.length === 0) return;

    setIsCompressing(true);
    const maxDimension = parseInt(maxSize);

    for (const img of images) {
      if (img.status === 'done') continue;

      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, status: 'compressing' } : i))
      );

      try {
        const options = {
          maxSizeMB: 10,
          maxWidthOrHeight: maxDimension,
          useWebWorker: true,
          initialQuality: quality / 100,
          fileType: getMimeType(outputFormat) as 'image/jpeg' | 'image/png' | 'image/webp',
        };

        const compressedBlob = await imageCompression(img.originalFile, options);

        const reader = new FileReader();
        reader.onload = (ev) => {
          setImages((prev) =>
            prev.map((i) =>
              i.id === img.id
                ? {
                    ...i,
                    compressedBlob,
                    compressedPreview: ev.target?.result as string,
                    status: 'done',
                  }
                : i
            )
          );
        };
        reader.readAsDataURL(compressedBlob);
      } catch (error) {
        console.error('Compression failed:', error);
        setImages((prev) =>
          prev.map((i) => (i.id === img.id ? { ...i, status: 'error' } : i))
        );
      }
    }

    setIsCompressing(false);
  };

  const downloadOne = (img: ImageItem) => {
    if (!img.compressedBlob) return;

    const url = URL.createObjectURL(img.compressedBlob);
    const link = document.createElement('a');
    const baseName = img.originalFile.name.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}_compressed.${getExtension(outputFormat)}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    const completed = images.filter((img) => img.status === 'done' && img.compressedBlob);
    if (completed.length === 0) return;

    if (completed.length === 1) {
      downloadOne(completed[0]);
      return;
    }

    completed.forEach((img, index) => {
      setTimeout(() => downloadOne(img), index * 200);
    });
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const totalOriginal = images.reduce((sum, img) => sum + img.originalFile.size, 0);
  const totalCompressed = images.reduce(
    (sum, img) => sum + (img.compressedBlob?.size || 0),
    0
  );
  const completedCount = images.filter((img) => img.status === 'done').length;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card variant="bordered" className="p-6">
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              Click or drag files here
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, WebP, GIF • Multiple files allowed
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesUpload}
            className="hidden"
          />
        </label>
      </Card>

      {images.length > 0 && (
        <>
          {/* Settings */}
          <Card variant="bordered" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Quality */}
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
                <div className="flex gap-1 mt-2">
                  {[20, 40, 60, 80, 100].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`flex-1 py-1 text-xs rounded ${
                        quality === q
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {q}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Format */}
              <Select
                label="Output Format"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                options={[
                  { value: 'jpeg', label: 'JPEG (Best for photos)' },
                  { value: 'png', label: 'PNG (Transparent bg)' },
                  { value: 'webp', label: 'WebP (Web optimized)' },
                ]}
              />

              {/* Max Resolution */}
              <Select
                label="Max Resolution"
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
                options={[
                  { value: '800', label: '800px (Social media)' },
                  { value: '1200', label: '1200px (Web use)' },
                  { value: '1920', label: '1920px (Full HD)' },
                  { value: '2560', label: '2560px (QHD)' },
                  { value: '4096', label: '4096px (Keep original)' },
                ]}
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={compressAll} disabled={isCompressing}>
              {isCompressing ? 'Compressing...' : `Compress All (${images.length})`}
            </Button>
            {completedCount > 0 && (
              <Button variant="secondary" onClick={downloadAll}>
                {completedCount === 1 ? 'Download' : `Download All (${completedCount})`}
              </Button>
            )}
            <Button variant="ghost" onClick={clearAll}>
              Clear All
            </Button>
          </div>

          {/* Statistics */}
          {completedCount > 0 && (
            <Card variant="bordered" className="p-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Images</p>
                  <p className="font-mono font-medium">{completedCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Original Total</p>
                  <p className="font-mono font-medium">{formatSize(totalOriginal)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Compressed</p>
                  <p className="font-mono font-medium">{formatSize(totalCompressed)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Saved</p>
                  <p className="font-mono font-medium text-green-600 dark:text-green-400">
                    {totalOriginal > 0
                      ? `${Math.round((1 - totalCompressed / totalOriginal) * 100)}%`
                      : '-'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Image List */}
          <div className="space-y-3">
            {images.map((img) => (
              <Card key={img.id} variant="bordered" className="p-4">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={img.originalPreview}
                      alt="Original"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">
                      {img.originalFile.name}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>Original: {formatSize(img.originalFile.size)}</span>
                      {img.compressedBlob && (
                        <>
                          <span>→</span>
                          <span className="text-green-600 dark:text-green-400">
                            {formatSize(img.compressedBlob.size)}
                          </span>
                          <span className="text-green-600 dark:text-green-400">
                            (-{Math.round((1 - img.compressedBlob.size / img.originalFile.size) * 100)}%)
                          </span>
                        </>
                      )}
                    </div>
                    <div className="mt-2">
                      {img.status === 'pending' && (
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                          Pending
                        </span>
                      )}
                      {img.status === 'compressing' && (
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded">
                          Compressing...
                        </span>
                      )}
                      {img.status === 'done' && (
                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded">
                          Done
                        </span>
                      )}
                      {img.status === 'error' && (
                        <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded">
                          Failed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 items-start">
                    {img.status === 'done' && (
                      <Button size="sm" variant="secondary" onClick={() => downloadOne(img)}>
                        Download
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => removeImage(img.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
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
          📦 What is Image Compressor?
        </h2>
        <p className="text-sm leading-relaxed">
          Image compression reduces file size while minimizing visible quality loss.
          Methods include lossy (JPEG) and lossless (PNG) compression, with modern WebP offering both benefits.
          Essential for improving website loading speeds, saving cloud storage, and meeting email/messenger size limits.
          Supports batch compression for processing multiple images at once.
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
                <th className="text-left py-2 px-2">Features</th>
                <th className="text-left py-2 px-2">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">JPEG</td><td>Lossy, high compression</td><td>Photos, complex images</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">PNG</td><td>Lossless, transparency</td><td>Logos, icons, screenshots</td></tr>
              <tr><td className="py-2 px-2 font-mono">WebP</td><td>Efficient, transparency/anim</td><td>Web optimization (recommended)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Quality Settings Guide
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>80-100%</strong>: High quality, for print or important photos</li>
          <li><strong>60-80%</strong>: Optimal for websites (quality/size balance)</li>
          <li><strong>40-60%</strong>: Social media uploads, preview images</li>
          <li><strong>20-40%</strong>: Maximum compression, noticeable quality loss</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Does compression modify my original image?',
            answer: 'No, your original file remains unchanged. A new compressed file is downloaded separately, and all processing happens in your browser without server uploads.',
          },
          {
            question: 'Should I choose JPEG or WebP?',
            answer: 'WebP provides 25-35% smaller files than JPEG at the same quality. Recommended for web use as modern browsers support it. Choose JPEG if compatibility with older software is needed.',
          },
          {
            question: 'Why is there a max resolution setting?',
            answer: 'High-resolution images (4000px+) are unnecessarily large for web use. Limiting to 1920px (Full HD) significantly reduces file size with no visible quality difference.',
          },
        ]}
      />
    </div>
  );
}
