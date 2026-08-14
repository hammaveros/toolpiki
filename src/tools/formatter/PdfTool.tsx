'use client';

import { useState, useCallback, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { FaqSection } from '@/components/ui/FaqItem';

type ToolMode = 'merge' | 'split' | 'images';
type SplitMode = 'range' | 'each';

interface PdfFileItem {
  id: string;
  file: File;
  pageCount: number | null;
  error: string | null;
}

interface ImageFileItem {
  id: string;
  file: File;
  previewUrl: string;
}

interface SplitResultItem {
  id: string;
  name: string;
  blob: Blob;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function friendlyPdfError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/encrypt/i.test(msg)) {
    return '암호화된 PDF는 지원하지 않습니다. 암호를 해제한 후 다시 시도하세요.';
  }
  return 'PDF 파일을 읽을 수 없습니다. 손상되었거나 지원하지 않는 형식일 수 있습니다.';
}

function downloadBlob(blob: Blob, filename: string) {
  if (typeof window === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function parsePageRange(input: string, maxPage: number): [number, number] {
  const trimmed = input.trim();
  const rangeMatch = /^(\d+)\s*-\s*(\d+)$/.exec(trimmed);
  const singleMatch = /^(\d+)$/.exec(trimmed);

  let start: number;
  let end: number;

  if (rangeMatch) {
    start = parseInt(rangeMatch[1], 10);
    end = parseInt(rangeMatch[2], 10);
  } else if (singleMatch) {
    start = end = parseInt(singleMatch[1], 10);
  } else {
    throw new Error('올바른 페이지 범위를 입력하세요. 예: 2-5 또는 3');
  }

  if (start < 1 || end < 1 || start > end || end > maxPage) {
    throw new Error(`1부터 ${maxPage}까지의 범위로 입력하세요.`);
  }

  return [start, end];
}

export function PdfTool() {
  const [mode, setMode] = useState<ToolMode>('merge');

  // 병합
  const [pdfItems, setPdfItems] = useState<PdfFileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeError, setMergeError] = useState('');

  // 분할
  const [splitFile, setSplitFile] = useState<PdfFileItem | null>(null);
  const [splitMode, setSplitMode] = useState<SplitMode>('range');
  const [rangeInput, setRangeInput] = useState('');
  const [splitResults, setSplitResults] = useState<SplitResultItem[]>([]);
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitError, setSplitError] = useState('');

  // 이미지 → PDF
  const [imageItems, setImageItems] = useState<ImageFileItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertError, setConvertError] = useState('');

  // 언마운트 시 이미지 미리보기 URL 정리
  useEffect(() => {
    return () => {
      imageItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 병합 ──────────────────────────────────────────

  const handleMergeFilesUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const id = makeId();
      setPdfItems((prev) => [...prev, { id, file, pageCount: null, error: null }]);

      file
        .arrayBuffer()
        .then(async (buf) => {
          try {
            const doc = await PDFDocument.load(buf);
            const count = doc.getPageCount();
            setPdfItems((prev) => prev.map((p) => (p.id === id ? { ...p, pageCount: count } : p)));
          } catch (err) {
            setPdfItems((prev) =>
              prev.map((p) => (p.id === id ? { ...p, error: friendlyPdfError(err) } : p))
            );
          }
        })
        .catch((err) => {
          setPdfItems((prev) =>
            prev.map((p) => (p.id === id ? { ...p, error: friendlyPdfError(err) } : p))
          );
        });
    });

    e.target.value = '';
  }, []);

  const removePdfItem = (id: string) => {
    setPdfItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearPdfItems = () => {
    setPdfItems([]);
    setMergeError('');
  };

  const movePdfItem = (id: string, direction: 'up' | 'down') => {
    setPdfItems((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const mergeAll = async () => {
    const validItems = pdfItems.filter((p) => !p.error);
    if (validItems.length < 2) return;

    setIsMerging(true);
    setMergeError('');

    try {
      const mergedDoc = await PDFDocument.create();

      for (const item of validItems) {
        const buf = await item.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(buf);
        const copiedPages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => mergedDoc.addPage(page));
      }

      const bytes = await mergedDoc.save();
      downloadBlob(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }), `merged_${validItems.length}files.pdf`);
    } catch (err) {
      setMergeError(friendlyPdfError(err));
    } finally {
      setIsMerging(false);
    }
  };

  // ── 분할 ──────────────────────────────────────────

  const handleSplitFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const id = makeId();
    setSplitFile({ id, file, pageCount: null, error: null });
    setSplitResults([]);
    setSplitError('');
    setRangeInput('');

    file
      .arrayBuffer()
      .then(async (buf) => {
        try {
          const doc = await PDFDocument.load(buf);
          const count = doc.getPageCount();
          setSplitFile((prev) => (prev && prev.id === id ? { ...prev, pageCount: count } : prev));
        } catch (err) {
          setSplitFile((prev) =>
            prev && prev.id === id ? { ...prev, error: friendlyPdfError(err) } : prev
          );
        }
      })
      .catch((err) => {
        setSplitFile((prev) =>
          prev && prev.id === id ? { ...prev, error: friendlyPdfError(err) } : prev
        );
      });

    e.target.value = '';
  }, []);

  const clearSplitFile = () => {
    setSplitFile(null);
    setSplitResults([]);
    setSplitError('');
    setRangeInput('');
  };

  const doSplit = async () => {
    if (!splitFile || splitFile.error || splitFile.pageCount === null) return;

    setIsSplitting(true);
    setSplitError('');
    setSplitResults([]);

    try {
      const buf = await splitFile.file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buf);
      const baseName = splitFile.file.name.replace(/\.pdf$/i, '');
      const results: SplitResultItem[] = [];

      if (splitMode === 'each') {
        const totalPages = srcDoc.getPageCount();
        for (let i = 0; i < totalPages; i++) {
          const newDoc = await PDFDocument.create();
          const [page] = await newDoc.copyPages(srcDoc, [i]);
          newDoc.addPage(page);
          const bytes = await newDoc.save();
          results.push({
            id: `${makeId()}-${i}`,
            name: `${baseName}_p${i + 1}.pdf`,
            blob: new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }),
          });
        }
      } else {
        const [start, end] = parsePageRange(rangeInput, srcDoc.getPageCount());
        const indices = Array.from({ length: end - start + 1 }, (_, k) => start - 1 + k);
        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(srcDoc, indices);
        copiedPages.forEach((page) => newDoc.addPage(page));
        const bytes = await newDoc.save();
        results.push({
          id: makeId(),
          name: `${baseName}_p${start}-${end}.pdf`,
          blob: new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }),
        });
      }

      setSplitResults(results);
    } catch (err) {
      if (err instanceof Error && (err.message.includes('범위') || err.message.includes('입력'))) {
        setSplitError(err.message);
      } else {
        setSplitError(friendlyPdfError(err));
      }
    } finally {
      setIsSplitting(false);
    }
  };

  const downloadSplitResult = (item: SplitResultItem) => {
    downloadBlob(item.blob, item.name);
  };

  const downloadAllSplitResults = () => {
    splitResults.forEach((item, index) => {
      setTimeout(() => downloadSplitResult(item), index * 200);
    });
  };

  // ── 이미지 → PDF ──────────────────────────────────

  const handleImageFilesUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newItems: ImageFileItem[] = Array.from(files).map((file) => ({
      id: makeId(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImageItems((prev) => [...prev, ...newItems]);
    e.target.value = '';
  }, []);

  const removeImageItem = (id: string) => {
    setImageItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearImageItems = () => {
    imageItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setImageItems([]);
    setConvertError('');
  };

  const moveImageItem = (id: string, direction: 'up' | 'down') => {
    setImageItems((prev) => {
      const index = prev.findIndex((i) => i.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const convertImagesToPdf = async () => {
    if (imageItems.length === 0) return;

    setIsConverting(true);
    setConvertError('');

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of imageItems) {
        const buf = await item.file.arrayBuffer();
        const type = item.file.type;
        const ext = item.file.name.split('.').pop()?.toLowerCase() ?? '';

        let embedded;
        if (type === 'image/png' || ext === 'png') {
          embedded = await pdfDoc.embedPng(buf);
        } else if (type === 'image/jpeg' || type === 'image/jpg' || ext === 'jpg' || ext === 'jpeg') {
          embedded = await pdfDoc.embedJpg(buf);
        } else {
          throw new Error(`지원하지 않는 이미지 형식입니다: ${item.file.name} (JPG, PNG만 지원)`);
        }

        const { width, height } = embedded.size();
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(embedded, { x: 0, y: 0, width, height });
      }

      const bytes = await pdfDoc.save();
      downloadBlob(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }), 'images.pdf');
    } catch (err) {
      setConvertError(
        err instanceof Error ? err.message : '이미지를 PDF로 변환하는 중 오류가 발생했습니다.'
      );
    } finally {
      setIsConverting(false);
    }
  };

  const validPdfCount = pdfItems.filter((p) => !p.error).length;

  return (
    <div className="space-y-2">
      {/* 모드 선택 탭 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit flex-wrap">
        <button
          onClick={() => setMode('merge')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'merge'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          📎 병합
        </button>
        <button
          onClick={() => setMode('split')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'split'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          ✂️ 분할
        </button>
        <button
          onClick={() => setMode('images')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'images'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          🖼️ 이미지 → PDF
        </button>
      </div>

      {/* ── 병합 모드 ── */}
      {mode === 'merge' && (
        <div className="space-y-4">
          <Card variant="bordered" className="p-6">
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <div className="text-4xl mb-2">📎</div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  클릭하거나 PDF 파일을 드래그하세요
                </p>
                <p className="text-sm text-gray-500">여러 PDF 파일을 선택할 수 있습니다</p>
              </div>
              <input
                type="file"
                accept="application/pdf,.pdf"
                multiple
                onChange={handleMergeFilesUpload}
                className="hidden"
              />
            </label>
          </Card>

          {pdfItems.length > 0 && (
            <>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={mergeAll} disabled={validPdfCount < 2 || isMerging}>
                  {isMerging ? '병합 중...' : `병합해서 다운로드 (${validPdfCount}개)`}
                </Button>
                <Button variant="ghost" onClick={clearPdfItems}>
                  전체 삭제
                </Button>
              </div>

              {validPdfCount < 2 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  병합하려면 최소 2개 이상의 정상 PDF 파일이 필요합니다.
                </p>
              )}
              {mergeError && <p className="text-sm text-red-500">{mergeError}</p>}

              <div className="space-y-3">
                {pdfItems.map((item, index) => (
                  <Card key={item.id} variant="bordered" className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl flex-shrink-0">📄</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">{item.file.name}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <span>{formatSize(item.file.size)}</span>
                          {item.error ? (
                            <span className="text-red-500">{item.error}</span>
                          ) : item.pageCount !== null ? (
                            <span>{item.pageCount}페이지</span>
                          ) : (
                            <span>페이지 확인 중...</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => movePdfItem(item.id, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => movePdfItem(item.id, 'down')}
                          disabled={index === pdfItems.length - 1}
                        >
                          ↓
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => removePdfItem(item.id)}>
                          삭제
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── 분할 모드 ── */}
      {mode === 'split' && (
        <div className="space-y-4">
          <Card variant="bordered" className="p-6">
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <div className="text-4xl mb-2">✂️</div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  클릭하거나 PDF 파일을 드래그하세요
                </p>
                <p className="text-sm text-gray-500">한 개의 PDF 파일만 선택하세요</p>
              </div>
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleSplitFileUpload}
                className="hidden"
              />
            </label>
          </Card>

          {splitFile && (
            <>
              <Card variant="bordered" className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl flex-shrink-0">📄</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{splitFile.file.name}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>{formatSize(splitFile.file.size)}</span>
                      {splitFile.error ? (
                        <span className="text-red-500">{splitFile.error}</span>
                      ) : splitFile.pageCount !== null ? (
                        <span>총 {splitFile.pageCount}페이지</span>
                      ) : (
                        <span>페이지 확인 중...</span>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={clearSplitFile}>
                    삭제
                  </Button>
                </div>
              </Card>

              {!splitFile.error && splitFile.pageCount !== null && (
                <Card variant="bordered" className="p-4 space-y-4">
                  <Select
                    label="분할 방식"
                    value={splitMode}
                    onChange={(e) => setSplitMode(e.target.value as SplitMode)}
                    options={[
                      { value: 'range', label: '페이지 범위 지정' },
                      { value: 'each', label: '각 페이지를 개별 파일로' },
                    ]}
                  />

                  {splitMode === 'range' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        페이지 범위 (예: 2-5, 총 {splitFile.pageCount}페이지)
                      </label>
                      <input
                        type="text"
                        value={rangeInput}
                        onChange={(e) => setRangeInput(e.target.value)}
                        placeholder="2-5"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={doSplit}
                      disabled={
                        isSplitting || (splitMode === 'range' && !rangeInput.trim())
                      }
                    >
                      {isSplitting ? '분할 중...' : '분할하기'}
                    </Button>
                  </div>

                  {splitError && <p className="text-sm text-red-500">{splitError}</p>}
                </Card>
              )}

              {splitResults.length > 0 && (
                <>
                  <div className="flex gap-2 flex-wrap">
                    {splitResults.length > 1 && (
                      <Button variant="secondary" onClick={downloadAllSplitResults}>
                        전체 다운로드 ({splitResults.length}개)
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {splitResults.map((item) => (
                      <Card key={item.id} variant="bordered" className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="text-xl flex-shrink-0">📄</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{item.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatSize(item.blob.size)}
                            </p>
                          </div>
                          <Button size="sm" variant="secondary" onClick={() => downloadSplitResult(item)}>
                            다운로드
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* ── 이미지 → PDF 모드 ── */}
      {mode === 'images' && (
        <div className="space-y-4">
          <Card variant="bordered" className="p-6">
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  클릭하거나 이미지 파일을 드래그하세요
                </p>
                <p className="text-sm text-gray-500">JPG, PNG 지원 • 여러 파일 선택 가능</p>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                multiple
                onChange={handleImageFilesUpload}
                className="hidden"
              />
            </label>
          </Card>

          {imageItems.length > 0 && (
            <>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={convertImagesToPdf} disabled={isConverting}>
                  {isConverting ? '변환 중...' : `PDF로 변환 (${imageItems.length}개)`}
                </Button>
                <Button variant="ghost" onClick={clearImageItems}>
                  전체 삭제
                </Button>
              </div>

              {convertError && <p className="text-sm text-red-500">{convertError}</p>}

              <div className="space-y-3">
                {imageItems.map((item, index) => (
                  <Card key={item.id} variant="bordered" className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.previewUrl}
                          alt={item.file.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">{item.file.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formatSize(item.file.size)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveImageItem(item.id, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveImageItem(item.id, 'down')}
                          disabled={index === imageItems.length - 1}
                        >
                          ↓
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => removeImageItem(item.id)}>
                          삭제
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
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
          📄 PDF 도구란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">
            여러 개의 PDF를 하나로 합치거나, 하나의 PDF를 원하는 페이지 단위로 나누고,
            이미지를 PDF 문서로 변환하는 도구입니다.
          </strong>{' '}
          모든 처리는 <strong>브라우저 안에서만</strong> 실행되며, 파일이 서버로 업로드되지 않습니다.
          계약서, 보고서, 스캔 문서를 정리할 때 별도 프로그램 설치 없이 바로 사용할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 기능별 사용 상황
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">기능</th>
                <th className="text-left py-2 px-2">설명</th>
                <th className="text-left py-2 px-2">이런 상황에 사용</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800">
                <td className="py-2 px-2 font-mono">병합</td>
                <td>여러 PDF를 순서대로 이어붙여 하나로</td>
                <td>여러 장의 계약서·영수증을 한 파일로 제출</td>
              </tr>
              <tr className="border-b dark:border-gray-800">
                <td className="py-2 px-2 font-mono">분할</td>
                <td>특정 페이지 범위 추출 또는 페이지별 개별 파일 생성</td>
                <td>긴 보고서에서 필요한 챕터만 따로 저장</td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-mono">이미지 → PDF</td>
                <td>JPG/PNG 이미지를 한 페이지씩 담아 PDF로 변환</td>
                <td>스캔한 사진이나 영수증을 문서 파일로 제출</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 사용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>병합 순서</strong> — 목록의 ↑↓ 버튼으로 파일 순서를 원하는 대로 바꾼 뒤 병합하세요.</li>
          <li><strong>범위 표기</strong> — 분할 시 페이지 범위는 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">2-5</code>처럼 하이픈으로 입력합니다.</li>
          <li><strong>암호화된 PDF</strong> — 암호가 걸린 PDF는 지원하지 않습니다. 먼저 암호를 해제한 뒤 이용하세요.</li>
          <li><strong>이미지 페이지 크기</strong> — 이미지 원본 크기에 맞춰 페이지가 생성되므로, 화질 손실 없이 그대로 담깁니다.</li>
        </ul>
        <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 p-4 text-sm">
          <p className="font-semibold text-emerald-900 dark:text-emerald-200 mb-1">🔒 개인정보 안내</p>
          <p className="text-emerald-800 dark:text-emerald-300">
            업로드한 PDF와 이미지는 <strong>서버로 전송되지 않고 브라우저 안에서만 처리</strong>됩니다.
            민감한 계약서나 개인 문서도 안심하고 사용할 수 있습니다.
          </p>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '파일이 서버로 업로드되나요?',
            answer: '아니요. 모든 병합·분할·변환 작업은 사용자의 브라우저 안에서만 처리되며, 파일이 서버로 전송되거나 저장되지 않습니다.',
          },
          {
            question: '암호화된 PDF도 병합하거나 분할할 수 있나요?',
            answer: '아니요, 암호가 걸린 PDF는 지원하지 않습니다. PDF 뷰어나 다른 도구로 암호를 먼저 해제한 뒤 이용해 주세요.',
          },
          {
            question: '이미지 → PDF 변환에서 지원하는 이미지 형식은 무엇인가요?',
            answer: 'JPG(JPEG)와 PNG를 지원합니다. 업로드한 각 이미지는 원본 크기 그대로 한 페이지로 들어갑니다.',
          },
        ]}
      />
    </div>
  );
}
