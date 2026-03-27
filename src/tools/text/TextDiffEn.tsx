'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface DiffLine {
  type: 'same' | 'added' | 'removed' | 'modified';
  text1?: string;
  text2?: string;
  lineNum1?: number;
  lineNum2?: number;
}

// Myers diff algorithm (same as Git's O(ND) algorithm)
// Faster when differences are small, memory efficient
function computeDiff(text1: string, text2: string): DiffLine[] {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const m = lines1.length;
  const n = lines2.length;

  // Empty text handling
  if (m === 0 && n === 0) return [];
  if (m === 0) return lines2.map((l, i) => ({ type: 'added' as const, text2: l, lineNum2: i + 1 }));
  if (n === 0) return lines1.map((l, i) => ({ type: 'removed' as const, text1: l, lineNum1: i + 1 }));

  // Myers diff - extract edit script
  const max = m + n;
  const vSize = 2 * max + 1;
  const v = new Int32Array(vSize);
  v.fill(-1);
  const offset = max;
  v[offset + 1] = 0;

  // Save v snapshots for each d step (for backtracking)
  const trace: Int32Array[] = [];

  let found = false;
  for (let d = 0; d <= max; d++) {
    const vCopy = new Int32Array(v);
    trace.push(vCopy);

    for (let k = -d; k <= d; k += 2) {
      let x: number;
      if (k === -d || (k !== d && v[offset + k - 1] < v[offset + k + 1])) {
        x = v[offset + k + 1];
      } else {
        x = v[offset + k - 1] + 1;
      }
      let y = x - k;

      while (x < m && y < n && lines1[x] === lines2[y]) {
        x++;
        y++;
      }

      v[offset + k] = x;

      if (x >= m && y >= n) {
        found = true;
        break;
      }
    }
    if (found) break;
  }

  // Backtrack to generate edit path
  type Edit = { type: 'same' | 'added' | 'removed'; x: number; y: number };
  const edits: Edit[] = [];
  let cx = m, cy = n;

  for (let d = trace.length - 1; d >= 0; d--) {
    const vd = trace[d];
    const k = cx - cy;

    let prevK: number;
    if (k === -d || (k !== d && vd[offset + k - 1] < vd[offset + k + 1])) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }

    const prevX = vd[offset + prevK];
    const prevY = prevX - prevK;

    // diagonal (same lines)
    while (cx > prevX && cy > prevY) {
      cx--;
      cy--;
      edits.push({ type: 'same', x: cx, y: cy });
    }

    if (d > 0) {
      if (cx === prevX) {
        // insert
        cy--;
        edits.push({ type: 'added', x: cx, y: cy });
      } else {
        // delete
        cx--;
        edits.push({ type: 'removed', x: cx, y: cy });
      }
    }
  }

  edits.reverse();

  // Convert to DiffLine + merge removed/added → modified
  const temp: DiffLine[] = edits.map((e) => {
    if (e.type === 'same') {
      return { type: 'same', text1: lines1[e.x], text2: lines2[e.y], lineNum1: e.x + 1, lineNum2: e.y + 1 };
    } else if (e.type === 'removed') {
      return { type: 'removed', text1: lines1[e.x], lineNum1: e.x + 1 };
    } else {
      return { type: 'added', text2: lines2[e.y], lineNum2: e.y + 1 };
    }
  });

  const result: DiffLine[] = [];
  for (let idx = 0; idx < temp.length; idx++) {
    const current = temp[idx];
    if (current.type === 'removed' && idx + 1 < temp.length && temp[idx + 1].type === 'added') {
      const next = temp[idx + 1];
      result.push({
        type: 'modified',
        text1: current.text1,
        text2: next.text2,
        lineNum1: current.lineNum1,
        lineNum2: next.lineNum2,
      });
      idx++;
    } else {
      result.push(current);
    }
  }

  return result;
}

// Word-level highlight for modified lines
function highlightWordDiff(text1: string, text2: string): { highlighted1: React.ReactNode; highlighted2: React.ReactNode } {
  const words1 = text1.split(/(\s+)/);
  const words2 = text2.split(/(\s+)/);

  const highlighted1: React.ReactNode[] = [];
  const highlighted2: React.ReactNode[] = [];

  const maxLen = Math.max(words1.length, words2.length);

  for (let i = 0; i < maxLen; i++) {
    const w1 = words1[i] ?? '';
    const w2 = words2[i] ?? '';

    if (w1 === w2) {
      highlighted1.push(<span key={i}>{w1}</span>);
      highlighted2.push(<span key={i}>{w2}</span>);
    } else {
      if (w1) highlighted1.push(<span key={i} className="bg-red-200 dark:bg-red-800/50 rounded px-0.5">{w1}</span>);
      if (w2) highlighted2.push(<span key={i} className="bg-green-200 dark:bg-green-800/50 rounded px-0.5">{w2}</span>);
    }
  }

  return { highlighted1, highlighted2 };
}

type ViewMode = 'unified' | 'split';

const MAX_LINES = 50000;

export function TextDiffEn() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [error, setError] = useState<string | null>(null);

  const diff = useMemo(() => {
    if (!showDiff) return [];
    try {
      setError(null);
      return computeDiff(text1, text2);
    } catch {
      setError('Text is too long to compare. Please reduce the text length.');
      return [];
    }
  }, [text1, text2, showDiff]);

  const stats = useMemo(() => {
    if (!showDiff) return null;
    const added = diff.filter((d) => d.type === 'added').length;
    const removed = diff.filter((d) => d.type === 'removed').length;
    const modified = diff.filter((d) => d.type === 'modified').length;
    const same = diff.filter((d) => d.type === 'same').length;
    return { added, removed, modified, same };
  }, [diff, showDiff]);

  const lines1Count = text1.split('\n').length;
  const lines2Count = text2.split('\n').length;
  const isTooLong = lines1Count > MAX_LINES || lines2Count > MAX_LINES;

  const handleCompare = () => {
    if (isTooLong) return;
    setError(null);
    setShowDiff(true);
  };

  const handleClear = () => {
    setText1('');
    setText2('');
    setShowDiff(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleCompare();
    }
  };

  return (
    <div className="space-y-2">
      {!showDiff ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Original Text
              </label>
              <Textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter the first text to compare... (Ctrl+Enter to compare)"
                rows={15}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Modified Text
              </label>
              <Textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter the second text to compare... (Ctrl+Enter to compare)"
                rows={15}
                className="font-mono text-sm"
              />
            </div>
          </div>
          {isTooLong && (
            <p className="text-sm text-red-500 dark:text-red-400 text-center">
              Text is too long (max {MAX_LINES.toLocaleString()} lines). Original: {lines1Count.toLocaleString()} lines, Modified: {lines2Count.toLocaleString()} lines
            </p>
          )}
          <Button onClick={handleCompare} className="w-full" disabled={(!text1 && !text2) || isTooLong}>
            Compare
          </Button>
        </>
      ) : (
        <>
          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 text-center py-2">{error}</p>
          )}

          {/* Statistics */}
          {stats && !error && (
            <div className="flex flex-wrap gap-2 justify-center">
              <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">
                + {stats.added} added
              </div>
              <div className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                - {stats.removed} removed
              </div>
              <div className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm">
                ~ {stats.modified} modified
              </div>
              <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                = {stats.same} unchanged
              </div>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setViewMode('split')}
              className={cn(
                'px-4 py-2 text-sm rounded-lg transition-colors',
                viewMode === 'split'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={cn(
                'px-4 py-2 text-sm rounded-lg transition-colors',
                viewMode === 'unified'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              Unified View
            </button>
          </div>

          {viewMode === 'split' ? (
            <SplitView diff={diff} />
          ) : (
            <UnifiedView diff={diff} />
          )}

          <div className="flex gap-4">
            <Button onClick={() => setShowDiff(false)} variant="secondary" className="flex-1">
              Edit Again
            </Button>
            <Button onClick={handleClear} variant="secondary" className="flex-1">
              Clear
            </Button>
          </div>
        </>
      )}

      <SeoContent />
    </div>
  );
}

// Split View (Bitbucket/GitHub style - side by side)
function SplitView({ diff }: { diff: DiffLine[] }) {
  return (
    <Card variant="bordered" className="p-0 overflow-hidden">
      <div className="grid grid-cols-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
        <div className="px-3 py-2 bg-red-50 dark:bg-red-900/10 border-r-2 border-gray-300 dark:border-gray-600">Original</div>
        <div className="px-3 py-2 bg-green-50 dark:bg-green-900/10">Modified</div>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {diff.map((line, i) => {
          if (line.type === 'same') {
            return (
              <div key={i} className="grid grid-cols-2 text-sm font-mono border-b dark:border-gray-800 last:border-b-0">
                <div className="px-3 py-1 border-r-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all">
                  <span className="text-gray-400 dark:text-gray-500 select-none mr-2 text-xs w-6 inline-block text-right">{line.lineNum1}</span>
                  {line.text1}
                </div>
                <div className="px-3 py-1 text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all">
                  <span className="text-gray-400 dark:text-gray-500 select-none mr-2 text-xs w-6 inline-block text-right">{line.lineNum2}</span>
                  {line.text2}
                </div>
              </div>
            );
          }

          if (line.type === 'removed') {
            return (
              <div key={i} className="grid grid-cols-2 text-sm font-mono border-b dark:border-gray-800 last:border-b-0">
                <div className="px-3 py-1 border-r-2 border-gray-300 dark:border-gray-600 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 whitespace-pre-wrap break-all">
                  <span className="text-red-400 dark:text-red-500 select-none mr-2 text-xs w-6 inline-block text-right">{line.lineNum1}</span>
                  <span className="text-red-500 dark:text-red-400 select-none mr-1">-</span>
                  {line.text1}
                </div>
                <div className="px-3 py-1 bg-gray-50 dark:bg-gray-800/30 text-gray-400 dark:text-gray-600"></div>
              </div>
            );
          }

          if (line.type === 'added') {
            return (
              <div key={i} className="grid grid-cols-2 text-sm font-mono border-b dark:border-gray-800 last:border-b-0">
                <div className="px-3 py-1 border-r-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30 text-gray-400 dark:text-gray-600"></div>
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 whitespace-pre-wrap break-all">
                  <span className="text-green-400 dark:text-green-500 select-none mr-2 text-xs w-6 inline-block text-right">{line.lineNum2}</span>
                  <span className="text-green-500 dark:text-green-400 select-none mr-1">+</span>
                  {line.text2}
                </div>
              </div>
            );
          }

          if (line.type === 'modified') {
            const { highlighted1, highlighted2 } = highlightWordDiff(line.text1 ?? '', line.text2 ?? '');
            return (
              <div key={i} className="grid grid-cols-2 text-sm font-mono border-b dark:border-gray-800 last:border-b-0">
                <div className="px-3 py-1 border-r-2 border-gray-300 dark:border-gray-600 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 whitespace-pre-wrap break-all">
                  <span className="text-red-400 dark:text-red-500 select-none mr-2 text-xs w-6 inline-block text-right">{line.lineNum1}</span>
                  <span className="text-red-500 dark:text-red-400 select-none mr-1">-</span>
                  {highlighted1}
                </div>
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 whitespace-pre-wrap break-all">
                  <span className="text-green-400 dark:text-green-500 select-none mr-2 text-xs w-6 inline-block text-right">{line.lineNum2}</span>
                  <span className="text-green-500 dark:text-green-400 select-none mr-1">+</span>
                  {highlighted2}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </Card>
  );
}

// Unified View
function UnifiedView({ diff }: { diff: DiffLine[] }) {
  return (
    <Card variant="bordered" className="p-0 overflow-hidden">
      <div className="max-h-[500px] overflow-y-auto">
        <table className="w-full text-sm font-mono">
          <tbody>
            {diff.map((line, i) => {
              if (line.type === 'modified') {
                const { highlighted1, highlighted2 } = highlightWordDiff(line.text1 ?? '', line.text2 ?? '');
                return (
                  <>
                    <tr key={`${i}-removed`} className="bg-red-50 dark:bg-red-900/20">
                      <td className="w-10 px-2 py-1 text-right text-gray-400 border-r dark:border-gray-700 select-none">
                        {line.lineNum1 || ''}
                      </td>
                      <td className="w-10 px-2 py-1 text-right text-gray-400 border-r dark:border-gray-700 select-none"></td>
                      <td className="w-6 px-2 py-1 text-center select-none">
                        <span className="text-red-600 dark:text-red-400">-</span>
                      </td>
                      <td className="px-2 py-1 whitespace-pre-wrap break-all text-red-700 dark:text-red-300">
                        {highlighted1}
                      </td>
                    </tr>
                    <tr key={`${i}-added`} className="bg-green-50 dark:bg-green-900/20">
                      <td className="w-10 px-2 py-1 text-right text-gray-400 border-r dark:border-gray-700 select-none"></td>
                      <td className="w-10 px-2 py-1 text-right text-gray-400 border-r dark:border-gray-700 select-none">
                        {line.lineNum2 || ''}
                      </td>
                      <td className="w-6 px-2 py-1 text-center select-none">
                        <span className="text-green-600 dark:text-green-400">+</span>
                      </td>
                      <td className="px-2 py-1 whitespace-pre-wrap break-all text-green-700 dark:text-green-300">
                        {highlighted2}
                      </td>
                    </tr>
                  </>
                );
              }

              return (
                <tr
                  key={i}
                  className={cn(
                    line.type === 'added' && 'bg-green-50 dark:bg-green-900/20',
                    line.type === 'removed' && 'bg-red-50 dark:bg-red-900/20'
                  )}
                >
                  <td className="w-10 px-2 py-1 text-right text-gray-400 border-r dark:border-gray-700 select-none">
                    {line.lineNum1 || ''}
                  </td>
                  <td className="w-10 px-2 py-1 text-right text-gray-400 border-r dark:border-gray-700 select-none">
                    {line.lineNum2 || ''}
                  </td>
                  <td className="w-6 px-2 py-1 text-center select-none">
                    {line.type === 'added' && <span className="text-green-600 dark:text-green-400">+</span>}
                    {line.type === 'removed' && <span className="text-red-600 dark:text-red-400">-</span>}
                  </td>
                  <td className="px-2 py-1 whitespace-pre-wrap break-all">
                    {line.type === 'same' ? line.text1 : (line.text1 || line.text2) || ' '}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔍 What is Text Diff?
        </h2>
        <p className="text-sm leading-relaxed">
          Text diff is a technique for comparing two pieces of text line by line to identify what has been
          added, removed, or modified. Originating from the Unix diff command, this concept has become
          fundamental in software development, document management, and content editing. This tool lets you
          perform instant text comparisons directly in your browser with no installation or sign-up required,
          and all processing happens locally on your device.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Use Cases and Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>
            <strong>Code Review:</strong> Before submitting a pull request or committing changes, paste
            your original and modified code to spot unintended changes. The Split View mode displays both
            versions side by side for maximum readability.
          </li>
          <li>
            <strong>Document Version Tracking:</strong> Compare drafts of contracts, reports, or proposals
            to quickly identify what has changed between revisions. This is especially useful when multiple
            people collaborate on the same document.
          </li>
          <li>
            <strong>Configuration File Comparison:</strong> Track changes in server configs, environment
            variables, or JSON/YAML files to prevent deployment errors and catch misconfigurations early.
          </li>
          <li>
            <strong>Translation Review:</strong> Compare source text with translations to find missing
            sections or unintended modifications in the translated content.
          </li>
        </ul>
        <p className="text-sm leading-relaxed mt-3">
          Under the hood, this tool uses the Myers diff algorithm (the same algorithm used by Git) to compute
          differences efficiently. Beyond simple line-level comparison, it also provides word-level
          highlighting within modified lines so you can pinpoint exactly what changed. Two view modes are
          available: Unified View shows all changes in a single list with addition (+) and deletion (-)
          markers, while Split View places the original and modified text side by side for intuitive comparison.
        </p>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Does the text diff detect whitespace and blank line changes?',
            answer: 'Yes, the comparison works on an exact line-by-line basis, so any whitespace additions, deletions, or blank line changes are fully detected. For modified lines, word-level highlighting shows precisely which parts were changed.',
          },
          {
            question: 'What is the difference between Split View and Unified View?',
            answer: 'Split View places the original and modified texts side by side for intuitive comparison, while Unified View shows all changes in a single list with deletion (-) and addition (+) markers. Split View is great for code reviews, while Unified View is better for understanding the overall flow of changes.',
          },
          {
            question: 'Is my text sent to any server?',
            answer: 'No, all comparison processing happens entirely in your browser. No data is transmitted to any server, so you can safely compare sensitive code, documents, or configuration files without privacy concerns.',
          },
        ]}
      />
    </div>
  );
}
