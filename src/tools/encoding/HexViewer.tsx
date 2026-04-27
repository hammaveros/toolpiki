'use client';

import { useState, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { Button } from '@/components/ui/Button';

export function HexViewer() {
  const [data, setData] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [viewMode, setViewMode] = useState<'hex' | 'binary'>('hex');
  const [bytesPerRow, setBytesPerRow] = useState(16);
  const [offset, setOffset] = useState(0);
  const maxDisplay = 1024; // 최대 표시 바이트
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
      {/* 파일 업로드 */}
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
            파일을 드래그하거나 클릭하여 업로드
          </p>
          <p className="text-xs text-gray-400 mt-2">
            모든 파일 형식 지원
          </p>
        </div>
      </Card>

      {data && (
        <>
          {/* 파일 정보 및 설정 */}
          <Card variant="bordered" className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">파일명:</span>
                <span className="ml-2 text-sm font-medium">{fileName}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">크기:</span>
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
                <label className="text-xs text-gray-500 dark:text-gray-400 mr-2">행당 바이트:</label>
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

          {/* Hex/Binary 뷰 */}
          <Card variant="bordered" className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {viewMode === 'hex' ? 'Hex' : 'Binary'} 뷰
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>오프셋: 0x{formatOffset(offset)} - 0x{formatOffset(Math.min(offset + maxDisplay, data.length))}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setOffset(Math.max(0, offset - maxDisplay))}
                  disabled={!canPrev}
                >
                  이전
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setOffset(offset + maxDisplay)}
                  disabled={!canNext}
                >
                  다음
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
                {maxDisplay.toLocaleString()} / {data.length.toLocaleString()} bytes 표시 중 (페이지네이션 사용)
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔍 Hex Viewer란?</h2>
        <p className="text-sm leading-relaxed">
          Hex Viewer는 파일의 바이너리 데이터를 16진수(Hexadecimal) 또는 2진수(Binary) 형태로 표시하는 도구입니다.
          모든 파일은 궁극적으로 바이트(0~255) 시퀀스로 구성되어 있으며, 이를 시각적으로 확인할 수 있습니다.
          파일 헤더 분석, 데이터 포맷 확인, 손상된 파일 디버깅, 리버스 엔지니어링 등에 활용됩니다.
          모든 처리는 브라우저에서 이루어지며 파일이 서버로 전송되지 않아 안전합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 주요 파일 시그니처 (매직 넘버)</h2>
        <div className="text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs"><strong>89 50 4E 47</strong> — PNG 이미지</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs"><strong>FF D8 FF</strong> — JPEG 이미지</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs"><strong>25 50 44 46</strong> — PDF 문서</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs"><strong>50 4B 03 04</strong> — ZIP 아카이브</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs"><strong>47 49 46 38</strong> — GIF 이미지</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs"><strong>4D 5A</strong> — Windows EXE</div>
          </div>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '파일 시그니처(매직 넘버)란 무엇인가요?', answer: '파일의 처음 몇 바이트에 기록된 고유 식별자입니다. 파일 확장자와 관계없이 실제 파일 형식을 판별할 수 있습니다. 예를 들어 PNG 파일은 항상 89 50 4E 47로 시작합니다.' },
          { question: '파일이 서버로 전송되나요?', answer: '아니요. 모든 파일 처리는 브라우저의 FileReader API를 사용하여 로컬에서 수행됩니다. 파일 데이터가 네트워크를 통해 전송되지 않습니다.' },
          { question: '대용량 파일도 열 수 있나요?', answer: '파일 전체를 메모리에 로드하므로 수백 MB 이상 파일은 브라우저가 느려질 수 있습니다. 1KB 단위 페이지네이션으로 효율적으로 탐색할 수 있습니다.' },
        ]}
      />
    </div>
  );
}
