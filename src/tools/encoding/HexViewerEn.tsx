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
          Hex Viewer displays binary file data in hexadecimal (Hex) or binary format.
          All files are ultimately composed of byte sequences (0-255), and this tool lets you inspect them visually.
          It is used for file header analysis, data format verification, corrupted file debugging, and reverse engineering.
          All processing happens in your browser — files are never uploaded to any server.
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

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'What is a file signature (magic number)?', answer: 'A unique identifier stored in the first few bytes of a file. It identifies the actual file format regardless of the file extension. For example, PNG files always start with 89 50 4E 47.' },
          { question: 'Are files uploaded to a server?', answer: 'No. All file processing is performed locally using the browser FileReader API. File data is never transmitted over the network.' },
          { question: 'Can I open large files?', answer: 'Since the entire file is loaded into memory, files over several hundred MB may slow down the browser. Use the 1KB pagination to browse efficiently.' },
        ]}
      />
    </div>
  );
}
