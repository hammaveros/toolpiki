'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';
import { toPng } from 'html-to-image';
import { LETTER_TEMPLATES, getTemplate, type LetterTemplate } from './letterTemplates';

const MAX_CHARS = 500;
const BASE_LETTER_URL = `${siteConfig.url}/en/letter?v=`;

function LetterCard({
  text,
  template,
  fontSize,
  letterRef,
}: {
  text: string;
  template: LetterTemplate;
  fontSize: string;
  letterRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={letterRef} className={`${template.cardClass} p-8 md:p-10 relative overflow-hidden`}>
      {template.cornerDecor && (
        <>
          {template.cornerDecor.topLeft && (
            <span className="absolute top-3 left-3 text-lg opacity-40">{template.cornerDecor.topLeft}</span>
          )}
          {template.cornerDecor.topRight && (
            <span className="absolute top-3 right-3 text-lg opacity-40">{template.cornerDecor.topRight}</span>
          )}
          {template.cornerDecor.bottomLeft && (
            <span className="absolute bottom-3 left-3 text-lg opacity-40">{template.cornerDecor.bottomLeft}</span>
          )}
          {template.cornerDecor.bottomRight && (
            <span className="absolute bottom-3 right-3 text-lg opacity-40">{template.cornerDecor.bottomRight}</span>
          )}
        </>
      )}
      <div className="text-center mb-4">
        <span className="text-4xl">{template.topDecor}</span>
      </div>
      <p className={`${fontSize} leading-relaxed ${template.textClass} whitespace-pre-wrap text-center`}>
        {text}
      </p>
      <div className={`text-right mt-6 text-[10px] ${template.watermarkClass}`}>jsspace.online</div>
    </div>
  );
}

export function LetterQrEn() {
  const [text, setText] = useState('');
  const [templateId, setTemplateId] = useState(1);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  const template = getTemplate(templateId);
  const isOverLimit = text.length > MAX_CHARS;
  const letterUrl = text ? `${BASE_LETTER_URL}${encodeURIComponent(text)}&t=${templateId}` : '';

  // Dynamic font size based on text length
  const getFontSize = () => {
    const len = text.length;
    if (len <= 30) return 'text-2xl';
    if (len <= 80) return 'text-xl';
    if (len <= 150) return 'text-lg';
    if (len <= 300) return 'text-base';
    return 'text-sm';
  };

  // QR generation
  const generateQR = useCallback((url: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx.drawImage(img, 0, 0, 300, 300);
      setQrDataUrl(canvas.toDataURL('image/png'));
    };
    img.onerror = () => setQrDataUrl('');
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
  }, []);

  useEffect(() => {
    if (!text.trim() || isOverLimit) {
      setQrDataUrl('');
      return;
    }
    const timer = setTimeout(() => generateQR(letterUrl), 500);
    return () => clearTimeout(timer);
  }, [letterUrl, isOverLimit, text, generateQR]);

  // Copy URL
  const handleCopyUrl = async () => {
    if (!letterUrl) return;
    await navigator.clipboard.writeText(letterUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download QR
  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'letter-qr.png';
    link.href = qrDataUrl;
    link.click();
  };

  // Save letter as image
  const handleSaveImage = async () => {
    if (!letterRef.current) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(letterRef.current, {
        backgroundColor: template.bgColor,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = 'letter.png';
      link.href = dataUrl;
      link.click();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Template selection */}
      <Card variant="bordered" className="p-4">
        <p className="text-sm font-medium mb-3">Choose a Stationery</p>
        <div className="flex flex-wrap gap-2">
          {LETTER_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplateId(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-all ${
                templateId === t.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.nameEn}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Write letter */}
      <Card variant="bordered" className="p-4">
        <p className="text-sm font-medium mb-2">Your Message</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a short letter... to a friend, colleague, or family member"
          rows={5}
          maxLength={MAX_CHARS}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end mt-2 text-xs">
          <span className={isOverLimit ? 'text-red-500 font-medium' : 'text-gray-400'}>
            {text.length} / {MAX_CHARS} chars
          </span>
        </div>
      </Card>

      {/* Letter preview */}
      {text.trim() && !isOverLimit && (
        <LetterCard text={text} template={template} fontSize={getFontSize()} letterRef={letterRef} />
      )}

      {/* QR code + buttons */}
      {qrDataUrl && (
        <Card variant="bordered" className="p-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-medium">Scan the QR code to read the letter</p>
            <img src={qrDataUrl} alt="Letter QR Code" width={200} height={200} className="rounded-lg" />
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={handleDownloadQr} variant="secondary" size="sm">
                Download QR
              </Button>
              <Button onClick={handleCopyUrl} variant="secondary" size="sm">
                {copied ? 'Copied!' : 'Copy URL'}
              </Button>
              <Button onClick={handleSaveImage} disabled={saving} variant="secondary" size="sm">
                {saving ? 'Saving...' : 'Save Letter Image'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Letter content is encoded in the URL and never stored on any server</p>
        <p>• Up to {MAX_CHARS} characters allowed (limited for QR readability)</p>
        <p>• Print the QR code and attach it to cards or gifts!</p>
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
          What is Letter QR?
        </h2>
        <p className="text-sm leading-relaxed">
          Letter QR is a tool that lets you write a short letter and share it as a QR code.
          When the recipient scans the QR code, a beautifully styled letter card appears.
          The letter content is encoded directly in the URL, so nothing is stored on any server.
          Choose from 5 unique stationery designs to make your letter even more special.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Creative Ideas
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">Occasion</th>
                <th className="text-left py-2 px-3 font-semibold">How to Use</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Birthday Gift</td>
                <td className="py-2 px-3">Attach QR to a card for a personal message</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Events</td>
                <td className="py-2 px-3">Share a message via QR poster at venues</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Encouragement</td>
                <td className="py-2 px-3">Send a QR code before exams or interviews</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Thank You</td>
                <td className="py-2 px-3">Share the URL link via text or social media</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Tips
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>Shorter messages produce simpler QR codes that are easier to scan</li>
          <li>You can save the letter as an image to share on social media</li>
          <li>Print QR codes at least 2cm (0.8in) for reliable scanning</li>
          <li>Line breaks (Enter) are preserved in the letter display</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Is my letter stored on any server?',
            answer: 'No, the letter content is encoded directly in the URL. It is processed entirely in your browser with no server storage.',
          },
          {
            question: 'What is the character limit?',
            answer: 'Up to 500 characters. The limit ensures the QR code remains easy to scan.',
          },
          {
            question: 'Can I print the QR code?',
            answer: 'Yes, download it as a high-resolution PNG and print it on cards, gifts, posters, or anything you like.',
          },
        ]}
      />
    </div>
  );
}
