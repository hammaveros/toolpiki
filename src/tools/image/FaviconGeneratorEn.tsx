'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

const FAVICON_SIZES = [16, 32, 48, 64, 128, 180, 192, 512];

interface GeneratedFavicon {
  size: number;
  dataUrl: string;
}

export function FaviconGeneratorEn() {
  const [image, setImage] = useState<string | null>(null);
  const [favicons, setFavicons] = useState<GeneratedFavicon[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setFavicons([]);
    };
    reader.readAsDataURL(file);
  }, []);

  const generateFavicons = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const generated: GeneratedFavicon[] = [];

      FAVICON_SIZES.forEach((size) => {
        canvas.width = size;
        canvas.height = size;

        const scale = Math.max(size / img.width, size / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (size - scaledWidth) / 2;
        const y = (size - scaledHeight) / 2;

        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

        generated.push({
          size,
          dataUrl: canvas.toDataURL('image/png'),
        });
      });

      setFavicons(generated);
    };
    img.src = image;
  };

  const downloadFavicon = (favicon: GeneratedFavicon) => {
    const link = document.createElement('a');
    link.download = `favicon-${favicon.size}x${favicon.size}.png`;
    link.href = favicon.dataUrl;
    link.click();
  };

  const downloadAll = () => {
    favicons.forEach((favicon, index) => {
      setTimeout(() => {
        downloadFavicon(favicon);
      }, index * 200);
    });
  };

  const generateHtmlCode = (): string => {
    return `<!-- Basic favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">

<!-- Android Chrome -->
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">

<!-- MS Tile -->
<meta name="msapplication-TileImage" content="/favicon-128x128.png">`;
  };

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        onFileSelect={handleImageUpload}
        label="Upload Image"
        description="Square image recommended (512x512 or larger)"
      />

      {image && (
        <>
          <Card variant="bordered" className="p-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Original Image
            </p>
            <img
              src={image}
              alt="Original"
              className="max-w-32 h-auto rounded"
            />
          </Card>

          <div className="flex gap-2">
            <Button onClick={generateFavicons}>Generate Favicons</Button>
            {favicons.length > 0 && (
              <Button variant="secondary" onClick={downloadAll}>
                Download All
              </Button>
            )}
          </div>

          {favicons.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                {favicons.map((favicon) => (
                  <Card
                    key={favicon.size}
                    variant="bordered"
                    className="p-2 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => downloadFavicon(favicon)}
                  >
                    <div className="flex justify-center mb-2">
                      <img
                        src={favicon.dataUrl}
                        alt={`${favicon.size}x${favicon.size}`}
                        style={{
                          width: Math.min(favicon.size, 64),
                          height: Math.min(favicon.size, 64),
                          imageRendering: favicon.size < 32 ? 'pixelated' : 'auto',
                        }}
                        className="rounded"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {favicon.size}x{favicon.size}
                    </p>
                  </Card>
                ))}
              </div>

              <Card variant="bordered" className="p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  HTML Code
                </p>
                <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                  {generateHtmlCode()}
                </pre>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigator.clipboard.writeText(generateHtmlCode())}
                >
                  Copy Code
                </Button>
              </Card>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Size Guide
                </h3>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li><strong>16x16:</strong> Browser tab</li>
                  <li><strong>32x32:</strong> Browser tab (high-res)</li>
                  <li><strong>48x48:</strong> Windows site icon</li>
                  <li><strong>64x64:</strong> Windows desktop shortcut</li>
                  <li><strong>128x128:</strong> Chrome Web Store</li>
                  <li><strong>180x180:</strong> Apple Touch Icon (iOS)</li>
                  <li><strong>192x192:</strong> Android Chrome</li>
                  <li><strong>512x512:</strong> PWA splash screen</li>
                </ul>
              </div>
            </>
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
          ⭐ What is Favicon Generator?
        </h2>
        <p className="text-sm leading-relaxed">
          Favicon Generator creates website favicons in all required sizes from a single source image.
          Upload one image and automatically generate icons for browser tabs, bookmarks, iOS/Android home screens, and PWA splash screens.
          All platforms require different icon sizes - this tool creates them all at once.
          Download icons individually or all at once, with ready-to-use HTML code included.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Favicon Size Guide
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Size</th>
                <th className="text-left py-2 px-2">Purpose</th>
                <th className="text-left py-2 px-2">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">16x16</td><td>Browser tab (standard)</td><td>Essential</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">32x32</td><td>Browser tab (high-res)</td><td>Essential</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">180x180</td><td>Apple Touch Icon (iOS)</td><td>Recommended</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">192x192</td><td>Android Chrome</td><td>Recommended</td></tr>
              <tr><td className="py-2 px-2 font-medium">512x512</td><td>PWA splash screen</td><td>PWA Required</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Tips for Great Favicons
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Square source</strong>: Use 512x512 or larger square images</li>
          <li><strong>Simple design</strong>: Keep it recognizable at small sizes</li>
          <li><strong>Transparent background</strong>: PNG format supports transparency</li>
          <li><strong>Brand colors</strong>: Use core logo colors for recognition</li>
          <li><strong>Test small</strong>: Make sure it looks good at 16x16</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What size should the source image be?',
            answer: 'Use a square image at least 512x512 pixels. Scaling down from larger images maintains better quality.',
          },
          {
            question: 'Where do I place the generated favicons?',
            answer: 'Usually in your website root directory. Add the provided HTML code inside your <head> tag.',
          },
          {
            question: 'Do I still need an ICO file?',
            answer: 'Modern browsers support PNG favicons well. ICO files are only needed for legacy IE compatibility.',
          },
        ]}
      />
    </div>
  );
}
