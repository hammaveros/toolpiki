'use client';

import { useState, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { Button } from '@/components/ui/Button';

export function HexViewerEn() {
  const [data, setData] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [viewMode, setViewMode] = useState<'hex' | 'binary'>('hex');
  const [bytesPerRow, setBytesPerRow] = useState(16);
  const [offset, setOffset] = useState(0);
  const maxDisplay = 1024;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);
    setOffset(0);

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      setData(new Uint8Array(buffer));
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);
    setOffset(0);

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      setData(new Uint8Array(buffer));
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const formatByte = (byte: number): string => {
    if (viewMode === 'hex') {
      return byte.toString(16).padStart(2, '0').toUpperCase();
    }
    return byte.toString(2).padStart(8, '0');
  };

  const formatOffset = (off: number): string => {
    return off.toString(16).padStart(8, '0').toUpperCase();
  };

  const toAscii = (byte: number): string => {
    if (byte >= 32 && byte <= 126) {
      return String.fromCharCode(byte);
    }
    return '.';
  };

  const displayData = data?.slice(offset, offset + maxDisplay);
  const rows: number[][] = [];
  if (displayData) {
    for (let i = 0; i < displayData.length; i += bytesPerRow) {
      rows.push(Array.from(displayData.slice(i, i + bytesPerRow)));
    }
  }

  const canPrev = offset > 0;
  const canNext = data && offset + maxDisplay < data.length;

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <Card variant="bordered" className="p-4">
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="text-4xl mb-3">📁</div>
          <p className="text-gray-600 dark:text-gray-400">
            Drag and drop a file or click to upload
          </p>
          <p className="text-xs text-gray-400 mt-2">
            All file types supported
          </p>
        </div>
      </Card>

      {data && (
        <>
          {/* File Info & Settings */}
          <Card variant="bordered" className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">File:</span>
                <span className="ml-2 text-sm font-medium">{fileName}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Size:</span>
                <span className="ml-2 text-sm font-medium">
                  {fileSize.toLocaleString()} bytes ({(fileSize / 1024).toFixed(2)} KB)
                </span>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'hex' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setViewMode('hex')}
                >
                  HEX
                </Button>
                <Button
                  variant={viewMode === 'binary' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setViewMode('binary')}
                >
                  Binary
                </Button>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mr-2">Bytes per row:</label>
                <select
                  value={bytesPerRow}
                  onChange={(e) => setBytesPerRow(Number(e.target.value))}
                  className="px-2 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value={8}>8</option>
                  <option value={16}>16</option>
                  <option value={32}>32</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Hex/Binary View */}
          <Card variant="bordered" className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {viewMode === 'hex' ? 'Hex' : 'Binary'} View
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Offset: 0x{formatOffset(offset)} - 0x{formatOffset(Math.min(offset + maxDisplay, data.length))}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setOffset(Math.max(0, offset - maxDisplay))}
                  disabled={!canPrev}
                >
                  Prev
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setOffset(offset + maxDisplay)}
                  disabled={!canNext}
                >
                  Next
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-2 pr-4 text-gray-500">Offset</th>
                    <th className="text-left py-2 text-gray-500">
                      {viewMode === 'hex' ? 'Hexadecimal' : 'Binary'}
                    </th>
                    <th className="text-left py-2 pl-4 text-gray-500">ASCII</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIdx) => {
                    const rowOffset = offset + rowIdx * bytesPerRow;
                    return (
                      <tr key={rowIdx} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-1 pr-4 text-blue-600 dark:text-blue-400">
                          {formatOffset(rowOffset)}
                        </td>
                        <td className="py-1">
                          <div className="flex flex-wrap gap-1">
                            {row.map((byte, byteIdx) => (
                              <span
                                key={byteIdx}
                                className={`${viewMode === 'hex' ? 'w-6' : 'w-[72px]'} text-center ${
                                  byte === 0 ? 'text-gray-400' : 'text-gray-900 dark:text-white'
                                }`}
                              >
                                {formatByte(byte)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-1 pl-4 text-green-600 dark:text-green-400">
                          {row.map(toAscii).join('')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {data.length > maxDisplay && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                Showing {maxDisplay.toLocaleString()} / {data.length.toLocaleString()} bytes (use pagination)
              </p>
            )}
          </Card>
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔍 What is Hex Viewer?</h2>
        <p className="text-sm leading-relaxed">
          Hex Viewer breaks a file apart byte by byte and renders the result as a 16-column grid of hexadecimal values (00–FF) alongside an ASCII preview.
          Every file on disk — image, video, executable, archive — is ultimately a sequence of integers between 0 and 255, so reading the first few bytes is often enough to identify the real format regardless of the filename extension.
          The page can show 8, 16, or 32 bytes per row and paginates in 1 KB chunks so even larger files stay responsive.
          Uploads are handled with the browser's FileReader API; nothing leaves your device, which means you can inspect sensitive binaries safely.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 Common File Signatures (Magic Numbers)</h2>
        <div className="text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs"><strong>89 50 4E 47</strong> — PNG Image</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs"><strong>FF D8 FF</strong> — JPEG Image</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs"><strong>25 50 44 46</strong> — PDF Document</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs"><strong>50 4B 03 04</strong> — ZIP Archive</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs"><strong>47 49 46 38</strong> — GIF Image</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs"><strong>4D 5A</strong> — Windows EXE</div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🛠️ Practical Things You Can Do Here</h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc pl-5">
          <li><strong>Spot a renamed file</strong>: someone sends &quot;photo.jpg&quot; that's actually a ZIP. A leading <code>50 4B 03 04</code> betrays ZIP, while real JPEGs start with <code>FF D8 FF</code>.</li>
          <li><strong>Check for BOM bytes</strong>: a text file beginning with <code>EF BB BF</code> carries a UTF-8 BOM; <code>FF FE</code> indicates UTF-16 LE. Stray BOMs are a frequent culprit behind encoding errors.</li>
          <li><strong>Locate metadata blocks</strong>: scan for JPEG's <code>FF E1</code> EXIF marker or PNG's <code>tEXt</code> / <code>eXIf</code> chunk to find where embedded text lives before stripping or editing it.</li>
          <li><strong>Repair broken archives</strong>: compare the header of a corrupted PDF or ZIP against a known-good copy to find exactly which bytes to patch.</li>
          <li><strong>Learn binary formats</strong>: ELF (<code>7F 45 4C 46</code>), Mach-O, and PE headers all reveal themselves clearly in a hex view, which makes this a popular starting point for CTF challenges and reverse-engineering tutorials.</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'What is a file signature (magic number)?', answer: 'A fixed byte pattern recorded at the start of a binary format that identifies it independently of the filename. PNG, for instance, always begins with the eight bytes 89 50 4E 47 0D 0A 1A 0A; if those bytes do not match, viewers reject the file immediately. Checking the magic number is far more reliable than trusting the extension.' },
          { question: 'Are files uploaded to a server?', answer: 'No. The browser FileReader API loads the file into a local ArrayBuffer and the display logic runs entirely on the same page. That makes the tool safe to use under corporate policies that forbid uploading files to external services.' },
          { question: 'Can I open large files?', answer: 'The current implementation pulls the entire file into memory, so anything past a few hundred megabytes will noticeably slow the browser. Pagination keeps navigation efficient, but for multi-gigabyte memory dumps you will likely want a desktop tool such as 010 Editor or HxD alongside.' },
        ]}
      />
    </div>
  );
}
