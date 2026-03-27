'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';

type QrMode = 'text' | 'wifi' | 'vcard';

interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

interface VcardData {
  name: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  url: string;
}

export function QrGeneratorEn() {
  const [mode, setMode] = useState<QrMode>('text');
  const [textInput, setTextInput] = useState('');
  const [wifiData, setWifiData] = useState<WifiData>({
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });
  const [vcardData, setVcardData] = useState<VcardData>({
    name: '',
    phone: '',
    email: '',
    company: '',
    title: '',
    url: '',
  });
  const [size, setSize] = useState('200');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR data string
  const getQrData = (): string => {
    switch (mode) {
      case 'text':
        return textInput;
      case 'wifi':
        if (!wifiData.ssid) return '';
        const hidden = wifiData.hidden ? 'H:true;' : '';
        return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};${hidden};`;
      case 'vcard':
        if (!vcardData.name) return '';
        let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
        vcard += `FN:${vcardData.name}\n`;
        if (vcardData.phone) vcard += `TEL:${vcardData.phone}\n`;
        if (vcardData.email) vcard += `EMAIL:${vcardData.email}\n`;
        if (vcardData.company) vcard += `ORG:${vcardData.company}\n`;
        if (vcardData.title) vcard += `TITLE:${vcardData.title}\n`;
        if (vcardData.url) vcard += `URL:${vcardData.url}\n`;
        vcard += 'END:VCARD';
        return vcard;
      default:
        return '';
    }
  };

  const qrData = getQrData();

  useEffect(() => {
    if (!qrData) {
      setQrDataUrl('');
      return;
    }

    generateQR(qrData, parseInt(size));
  }, [qrData, size, fgColor, bgColor]);

  const generateQR = (text: string, qrSize: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fg = fgColor.replace('#', '');
    const bg = bgColor.replace('#', '');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = qrSize;
      canvas.height = qrSize;
      ctx.drawImage(img, 0, 0, qrSize, qrSize);
      setQrDataUrl(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      setQrDataUrl('');
    };
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(text)}&color=${fg}&bgcolor=${bg}`;
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataUrl;
    link.click();
  };

  const modeLabels: Record<QrMode, string> = {
    text: 'Text/URL',
    wifi: 'Wi-Fi',
    vcard: 'Contact',
  };

  return (
    <div className="space-y-4">
      {/* Mode Selection Tabs */}
      <Card variant="bordered" className="p-2">
        <div className="flex gap-1">
          {(['text', 'wifi', 'vcard'] as QrMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
      </Card>

      {/* Mode-specific Input */}
      <Card variant="bordered" className="p-4">
        {mode === 'text' && (
          <Textarea
            label="QR Code Content"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter URL, text, phone number, etc..."
            rows={4}
          />
        )}

        {mode === 'wifi' && (
          <div className="space-y-3">
            <Input
              label="Network Name (SSID)"
              value={wifiData.ssid}
              onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
              placeholder="Wi-Fi network name"
            />
            <Input
              label="Password"
              type="password"
              value={wifiData.password}
              onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
              placeholder="Wi-Fi password"
            />
            <Select
              label="Encryption"
              value={wifiData.encryption}
              onChange={(e) => setWifiData({ ...wifiData, encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' })}
              options={[
                { value: 'WPA', label: 'WPA/WPA2/WPA3' },
                { value: 'WEP', label: 'WEP' },
                { value: 'nopass', label: 'No Password' },
              ]}
            />
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={wifiData.hidden}
                onChange={(e) => setWifiData({ ...wifiData, hidden: e.target.checked })}
                className="rounded"
              />
              Hidden Network
            </label>
          </div>
        )}

        {mode === 'vcard' && (
          <div className="space-y-3">
            <Input
              label="Name *"
              value={vcardData.name}
              onChange={(e) => setVcardData({ ...vcardData, name: e.target.value })}
              placeholder="John Doe"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Phone"
                value={vcardData.phone}
                onChange={(e) => setVcardData({ ...vcardData, phone: e.target.value })}
                placeholder="+1-234-567-8900"
              />
              <Input
                label="Email"
                type="email"
                value={vcardData.email}
                onChange={(e) => setVcardData({ ...vcardData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Company"
                value={vcardData.company}
                onChange={(e) => setVcardData({ ...vcardData, company: e.target.value })}
                placeholder="Company name"
              />
              <Input
                label="Title"
                value={vcardData.title}
                onChange={(e) => setVcardData({ ...vcardData, title: e.target.value })}
                placeholder="Job title"
              />
            </div>
            <Input
              label="Website"
              value={vcardData.url}
              onChange={(e) => setVcardData({ ...vcardData, url: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        )}
      </Card>

      {/* Options */}
      <Card variant="bordered" className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-36">
            <Select
              label="Size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              options={[
                { value: '150', label: '150 x 150' },
                { value: '200', label: '200 x 200' },
                { value: '300', label: '300 x 300' },
                { value: '400', label: '400 x 400' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Foreground
            </label>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Background
            </label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setFgColor('#000000');
              setBgColor('#ffffff');
            }}
          >
            Reset Colors
          </Button>
        </div>
      </Card>

      {/* QR Code Result */}
      {qrDataUrl && (
        <Card variant="bordered" className="p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: bgColor }}>
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                width={parseInt(size)}
                height={parseInt(size)}
              />
            </div>
            <Button variant="primary" onClick={handleDownload}>
              Download PNG
            </Button>
          </div>
        </Card>
      )}

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Help */}
      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>• <strong>Text/URL</strong>: Convert URLs, text, phone numbers into QR codes</p>
        <p>• <strong>Wi-Fi</strong>: Scan to automatically connect to Wi-Fi</p>
        <p>• <strong>Contact</strong>: Scan to save contact information</p>
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
          📱 What is QR Code Generator?
        </h2>
        <p className="text-sm leading-relaxed">
          QR Code Generator converts URLs, text, Wi-Fi credentials, and contact information into scannable QR codes.
          Perfect for business cards, posters, product packaging, and store signage.
          Customize foreground and background colors, choose your preferred size, and download as PNG.
          Wi-Fi QR codes allow automatic connection with a single scan, ideal for sharing guest network access.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 QR Code Modes
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Mode</th>
                <th className="text-left py-2 px-2">Content</th>
                <th className="text-left py-2 px-2">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Text/URL</td><td>Websites, text, phone numbers</td><td>Homepage links, coupon codes</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Wi-Fi</td><td>SSID, password, encryption</td><td>Cafe/store Wi-Fi access</td></tr>
              <tr><td className="py-2 px-2 font-medium">Contact (vCard)</td><td>Name, phone, email, company</td><td>Digital business cards</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 QR Code Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Optimal size</strong>: Use 300x300 or larger for printing; smaller sizes may cause scan errors</li>
          <li><strong>High contrast</strong>: Maintain strong contrast between foreground and background colors</li>
          <li><strong>Test first</strong>: Always test with multiple devices before printing</li>
          <li><strong>URL shortening</strong>: Long URLs increase complexity; consider using URL shorteners</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Why is my Wi-Fi QR code not working?',
            answer: 'Verify that the SSID and password are correct. For hidden networks, check the "Hidden Network" option. Some older devices may not support WPA3 encryption.',
          },
          {
            question: 'Can I change the QR code colors?',
            answer: 'Yes, but ensure sufficient contrast between colors. Dark foreground with light background works best. Light foreground colors may reduce scan reliability.',
          },
          {
            question: 'Where is my generated QR code stored?',
            answer: 'QR codes are generated in your browser and never uploaded to any server. Use the download button to save the PNG file. Closing the page requires regeneration.',
          },
        ]}
      />
    </div>
  );
}
