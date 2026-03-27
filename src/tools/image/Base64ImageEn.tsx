'use client';

import { useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

export function Base64ImageEn() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [image, setImage] = useState<string | null>(null);
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [decodedImage, setDecodedImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [includePrefix, setIncludePrefix] = useState(true);

  const handleImageUpload = useCallback((file: File) => {
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImage(dataUrl);

      if (includePrefix) {
        setBase64Output(dataUrl);
      } else {
        setBase64Output(dataUrl.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  }, [includePrefix]);

  const handleDecode = () => {
    setError('');
    try {
      let dataUrl = base64Input.trim();

      if (!dataUrl.startsWith('data:')) {
        if (dataUrl.startsWith('/9j/')) {
          dataUrl = `data:image/jpeg;base64,${dataUrl}`;
        } else if (dataUrl.startsWith('iVBOR')) {
          dataUrl = `data:image/png;base64,${dataUrl}`;
        } else if (dataUrl.startsWith('R0lGOD')) {
          dataUrl = `data:image/gif;base64,${dataUrl}`;
        } else if (dataUrl.startsWith('UklGR')) {
          dataUrl = `data:image/webp;base64,${dataUrl}`;
        } else {
          dataUrl = `data:image/png;base64,${dataUrl}`;
        }
      }

      const img = new Image();
      img.onload = () => {
        setDecodedImage(dataUrl);
        setError('');
      };
      img.onerror = () => {
        setError('Invalid image data.');
        setDecodedImage(null);
      };
      img.src = dataUrl;
    } catch {
      setError('Error decoding Base64.');
      setDecodedImage(null);
    }
  };

  const handleDownload = () => {
    if (!decodedImage) return;

    const link = document.createElement('a');
    link.download = 'decoded_image.png';
    link.href = decodedImage;
    link.click();
  };

  const formatSize = (str: string): string => {
    const bytes = new Blob([str]).size;
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={mode === 'encode' ? 'primary' : 'secondary'}
          onClick={() => setMode('encode')}
        >
          Image → Base64
        </Button>
        <Button
          variant={mode === 'decode' ? 'primary' : 'secondary'}
          onClick={() => setMode('decode')}
        >
          Base64 → Image
        </Button>
      </div>

      {mode === 'encode' ? (
        <>
          <FileUpload
            accept="image/*"
            onFileSelect={handleImageUpload}
            label="Upload Image"
            description="Supports JPG, PNG, GIF, WebP"
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includePrefix}
              onChange={(e) => {
                setIncludePrefix(e.target.checked);
                if (image) {
                  if (e.target.checked) {
                    setBase64Output(image);
                  } else {
                    setBase64Output(image.split(',')[1]);
                  }
                }
              }}
              className="rounded"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Include Data URL prefix (data:image/...)
            </span>
          </label>

          {image && (
            <>
              <Card variant="bordered" className="p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Uploaded Image
                </p>
                <img
                  src={image}
                  alt="Uploaded"
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: '200px' }}
                />
              </Card>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Base64 Output ({formatSize(base64Output)})
                  </label>
                  <CopyButton text={base64Output} />
                </div>
                <Textarea
                  value={base64Output}
                  readOnly
                  rows={6}
                  className="font-mono text-xs"
                />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <Textarea
            label="Base64 Input"
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA... or iVBORw0KGgoAAAANSUhEUgAA..."
            rows={6}
            className="font-mono text-xs"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex gap-2">
            <Button onClick={handleDecode}>Convert</Button>
            {decodedImage && (
              <Button variant="secondary" onClick={handleDownload}>
                Download
              </Button>
            )}
            <Button variant="secondary" onClick={() => { setBase64Input(''); setDecodedImage(null); setError(''); }}>
              Clear
            </Button>
          </div>

          {decodedImage && (
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Converted Image
              </p>
              <img
                src={decodedImage}
                alt="Decoded"
                className="max-w-full h-auto rounded"
                style={{ maxHeight: '300px' }}
              />
            </Card>
          )}
        </>
      )}

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Usage Examples
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• CSS: background-image: url(data:image/png;base64,...);</li>
          <li>• HTML: &lt;img src=&quot;data:image/png;base64,...&quot; /&gt;</li>
          <li>• JSON: Store/transmit images as text</li>
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
          🖼️ What is Base64 Image Converter?
        </h2>
        <p className="text-sm leading-relaxed">
          Base64 Image Converter encodes image files to text strings or decodes Base64 strings back to images.
          Base64-encoded images can be embedded directly in HTML, CSS, or JavaScript code, eliminating external file dependencies.
          Widely used for email templates, single-file HTML distribution, and API data transmission.
          All processing happens in your browser, so images never leave your device - completely safe and private.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Image Format Base64 Signatures
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Format</th>
                <th className="text-left py-2 px-2">MIME Type</th>
                <th className="text-left py-2 px-2">Base64 Start</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">JPEG</td><td>image/jpeg</td><td className="font-mono">/9j/</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">PNG</td><td>image/png</td><td className="font-mono">iVBOR</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">GIF</td><td>image/gif</td><td className="font-mono">R0lGOD</td></tr>
              <tr><td className="py-2 px-2 font-medium">WebP</td><td>image/webp</td><td className="font-mono">UklGR</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Base64 Image Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Best for small images</strong>: Recommended for icons and logos under 10KB</li>
          <li><strong>Data URL prefix</strong>: data:image/... format required for CSS/HTML usage</li>
          <li><strong>Size increase</strong>: Base64 encoding adds about 33% to original size</li>
          <li><strong>No caching</strong>: Inline images cannot be browser-cached, causing repeated downloads</li>
          <li><strong>Email embedding</strong>: Useful for embedding images directly in HTML emails</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Does Base64 encoding make images larger?',
            answer: 'Yes, Base64 converts binary to text, increasing size by about 33%. Best suited for small images.',
          },
          {
            question: 'When is the Data URL prefix needed?',
            answer: 'For HTML img src or CSS background-image, you need the data:image/...;base64, prefix. API transmission may use pure Base64.',
          },
          {
            question: 'Can you detect image format from Base64?',
            answer: 'Yes, the starting characters indicate the format. This tool auto-detects signatures like /9j/ (JPEG) and iVBOR (PNG).',
          },
        ]}
      />
    </div>
  );
}
