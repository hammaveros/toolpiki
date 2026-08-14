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
    return 'Encrypted PDFs are not supported. Please remove the password and try again.';
  }
  return 'Could not read the PDF file. It may be corrupted or in an unsupported format.';
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
    throw new Error('Enter a valid page range, e.g. 2-5 or 3');
  }

  if (start < 1 || end < 1 || start > end || end > maxPage) {
    throw new Error(`Enter a range between 1 and ${maxPage}.`);
  }

  return [start, end];
}

export function PdfToolEn() {
  const [mode, setMode] = useState<ToolMode>('merge');

  // Merge
  const [pdfItems, setPdfItems] = useState<PdfFileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeError, setMergeError] = useState('');

  // Split
  const [splitFile, setSplitFile] = useState<PdfFileItem | null>(null);
  const [splitMode, setSplitMode] = useState<SplitMode>('range');
  const [rangeInput, setRangeInput] = useState('');
  const [splitResults, setSplitResults] = useState<SplitResultItem[]>([]);
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitError, setSplitError] = useState('');

  // Images -> PDF
  const [imageItems, setImageItems] = useState<ImageFileItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertError, setConvertError] = useState('');

  // Clean up image preview URLs on unmount
  useEffect(() => {
    return () => {
      imageItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Merge ──────────────────────────────────────────

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

  // ── Split ──────────────────────────────────────────

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
      if (err instanceof Error && (err.message.includes('range') || err.message.includes('Enter'))) {
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

  // ── Images -> PDF ──────────────────────────────────

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
          throw new Error(`Unsupported image format: ${item.file.name} (only JPG and PNG are supported)`);
        }

        const { width, height } = embedded.size();
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(embedded, { x: 0, y: 0, width, height });
      }

      const bytes = await pdfDoc.save();
      downloadBlob(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }), 'images.pdf');
    } catch (err) {
      setConvertError(
        err instanceof Error ? err.message : 'An error occurred while converting images to PDF.'
      );
    } finally {
      setIsConverting(false);
    }
  };

  const validPdfCount = pdfItems.filter((p) => !p.error).length;

  return (
    <div className="space-y-2">
      {/* Mode Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit flex-wrap">
        <button
          onClick={() => setMode('merge')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'merge'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          📎 Merge
        </button>
        <button
          onClick={() => setMode('split')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'split'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          ✂️ Split
        </button>
        <button
          onClick={() => setMode('images')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'images'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          🖼️ Images → PDF
        </button>
      </div>

      {/* ── Merge Mode ── */}
      {mode === 'merge' && (
        <div className="space-y-4">
          <Card variant="bordered" className="p-6">
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <div className="text-4xl mb-2">📎</div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Click or drag PDF files here
                </p>
                <p className="text-sm text-gray-500">You can select multiple PDF files</p>
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
                  {isMerging ? 'Merging...' : `Merge & Download (${validPdfCount})`}
                </Button>
                <Button variant="ghost" onClick={clearPdfItems}>
                  Clear All
                </Button>
              </div>

              {validPdfCount < 2 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  You need at least 2 valid PDF files to merge.
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
                            <span>{item.pageCount} pages</span>
                          ) : (
                            <span>Checking pages...</span>
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
                          Remove
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

      {/* ── Split Mode ── */}
      {mode === 'split' && (
        <div className="space-y-4">
          <Card variant="bordered" className="p-6">
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <div className="text-4xl mb-2">✂️</div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Click or drag a PDF file here
                </p>
                <p className="text-sm text-gray-500">Select a single PDF file</p>
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
                        <span>{splitFile.pageCount} pages total</span>
                      ) : (
                        <span>Checking pages...</span>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={clearSplitFile}>
                    Remove
                  </Button>
                </div>
              </Card>

              {!splitFile.error && splitFile.pageCount !== null && (
                <Card variant="bordered" className="p-4 space-y-4">
                  <Select
                    label="Split Mode"
                    value={splitMode}
                    onChange={(e) => setSplitMode(e.target.value as SplitMode)}
                    options={[
                      { value: 'range', label: 'Extract a page range' },
                      { value: 'each', label: 'Each page as a separate file' },
                    ]}
                  />

                  {splitMode === 'range' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Page range (e.g. 2-5, {splitFile.pageCount} pages total)
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
                      {isSplitting ? 'Splitting...' : 'Split'}
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
                        Download All ({splitResults.length})
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
                            Download
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

      {/* ── Images -> PDF Mode ── */}
      {mode === 'images' && (
        <div className="space-y-4">
          <Card variant="bordered" className="p-6">
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Click or drag image files here
                </p>
                <p className="text-sm text-gray-500">Supports JPG, PNG • Multiple files allowed</p>
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
                  {isConverting ? 'Converting...' : `Convert to PDF (${imageItems.length})`}
                </Button>
                <Button variant="ghost" onClick={clearImageItems}>
                  Clear All
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
                          Remove
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
          📄 What is the PDF Tool?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">
            A tool for combining multiple PDFs into one, splitting a PDF into pages or ranges,
            and converting images into a PDF document.
          </strong>{' '}
          All processing happens <strong>entirely in your browser</strong> — files are never uploaded to a server.
          Handy for organizing contracts, reports, or scanned documents without installing any software.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 When to Use Each Feature
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Feature</th>
                <th className="text-left py-2 px-2">Description</th>
                <th className="text-left py-2 px-2">Typical Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800">
                <td className="py-2 px-2 font-mono">Merge</td>
                <td>Combine multiple PDFs in order into a single file</td>
                <td>Submitting several contracts or receipts as one file</td>
              </tr>
              <tr className="border-b dark:border-gray-800">
                <td className="py-2 px-2 font-mono">Split</td>
                <td>Extract a page range, or create one file per page</td>
                <td>Saving just one chapter from a long report</td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-mono">Images → PDF</td>
                <td>Turn JPG/PNG images into one page each in a PDF</td>
                <td>Submitting scanned photos or receipts as a document</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Usage Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Merge order</strong> — use the ↑↓ buttons in the file list to reorder files before merging.</li>
          <li><strong>Range format</strong> — for splitting, enter page ranges with a hyphen, e.g. <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">2-5</code>.</li>
          <li><strong>Encrypted PDFs</strong> — password-protected PDFs are not supported. Remove the password first.</li>
          <li><strong>Image page size</strong> — each page is sized to match the original image, so there is no quality loss.</li>
        </ul>
        <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 p-4 text-sm">
          <p className="font-semibold text-emerald-900 dark:text-emerald-200 mb-1">🔒 Privacy note</p>
          <p className="text-emerald-800 dark:text-emerald-300">
            Uploaded PDFs and images are <strong>processed entirely in your browser and never sent to a server</strong>.
            Safe to use even with sensitive contracts or personal documents.
          </p>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Are my files uploaded to a server?',
            answer: 'No. All merge, split, and conversion operations happen entirely in your browser — files are never uploaded to or stored on a server.',
          },
          {
            question: 'Can I merge or split encrypted PDFs?',
            answer: 'No, password-protected PDFs are not supported. Please remove the password using a PDF viewer or another tool first, then try again.',
          },
          {
            question: 'What image formats are supported for Images → PDF?',
            answer: 'JPG (JPEG) and PNG are supported. Each uploaded image becomes a page sized to its original dimensions.',
          },
        ]}
      />
    </div>
  );
}
