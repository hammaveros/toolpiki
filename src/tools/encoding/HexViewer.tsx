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
          Hex Viewer는 파일을 바이트 단위로 풀어서 16진수(00~FF) 표와 ASCII 미리보기를 나란히 보여주는 도구입니다.
          확장자가 무엇이든 디스크 위의 데이터는 결국 0~255 사이의 정수 시퀀스이므로, 헤더 몇 바이트만 읽으면 진짜 파일 형식을 가려낼 수 있습니다.
          이 페이지는 행당 8/16/32바이트로 끊어 보여주고, 1KB 단위 페이지네이션으로 큰 파일도 부담 없이 훑을 수 있습니다.
          업로드는 브라우저의 FileReader API로 처리되며 데이터가 네트워크로 빠져나가지 않아 압축 파일·이미지·실행 파일 등 민감한 데이터도 안심하고 검사할 수 있습니다.
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

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🛠️ 이런 상황에서 써먹기 좋다</h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc pl-5">
          <li><strong>잘못된 확장자 파악</strong>: 누가 보낸 &quot;photo.jpg&quot;가 사실은 ZIP일 수 있습니다. 첫 4바이트가 <code>50 4B 03 04</code>면 ZIP, <code>89 50 4E 47</code>이면 PNG입니다.</li>
          <li><strong>BOM 확인</strong>: 텍스트 파일이 UTF-8 BOM(<code>EF BB BF</code>)이나 UTF-16 BOM(<code>FF FE</code>)을 달고 있는지 파악해 인코딩 오류 원인을 추적합니다.</li>
          <li><strong>EXIF/메타데이터 위치 추정</strong>: JPEG의 <code>FF E1</code> 마커, PNG의 <code>tEXt</code>·<code>eXIf</code> 청크가 어디에 박혀 있는지 눈으로 확인합니다.</li>
          <li><strong>망가진 파일 응급조치</strong>: 헤더 일부 손상으로 열리지 않는 PDF, ZIP 등을 정상 파일과 비교하면서 패치 위치를 찾을 때 유용합니다.</li>
          <li><strong>CTF/리버스 엔지니어링 입문</strong>: ELF(<code>7F 45 4C 46</code>), Mach-O, PE 헤더의 기본 구조 학습에도 자주 등장합니다.</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '파일 시그니처(매직 넘버)란?', answer: '거의 모든 바이너리 포맷은 파일 첫머리에 자신을 식별하는 고정 바이트 패턴을 박아둡니다. 예를 들어 PNG는 8바이트의 <code>89 50 4E 47 0D 0A 1A 0A</code>로 시작하며, 이 값이 어긋나면 뷰어가 곧바로 거부합니다. 확장자만 보지 말고 시그니처를 확인하면 파일을 더 정확히 판별할 수 있습니다.' },
          { question: '파일이 서버로 전송되나요?', answer: '전송되지 않습니다. 브라우저의 FileReader API가 파일을 ArrayBuffer로 메모리에 올린 뒤, 표시 로직이 같은 페이지 안에서만 동작합니다. 회사 보안 정책상 외부 업로드가 금지된 환경에서도 안전하게 사용할 수 있습니다.' },
          { question: '대용량 파일도 열 수 있나요?', answer: '전체 파일을 메모리에 적재하기 때문에 수백 MB 이상이면 브라우저 메모리 사용량이 급격히 올라 응답이 느려질 수 있습니다. 1KB 단위 페이지네이션으로 탐색 효율은 유지되지만, 실무에서 수 GB 덤프를 분석할 때는 데스크톱 전용 도구(010 Editor, HxD 등)를 함께 활용하는 편이 안전합니다.' },
        ]}
      />
    </div>
  );
}
