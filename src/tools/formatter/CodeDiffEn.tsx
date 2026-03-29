'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

interface DiffLine {
  type: 'equal' | 'add' | 'remove';
  content: string;
  lineNum1?: number;
  lineNum2?: number;
}

const MAX_LINES = 50000;

// Myers diff algorithm (same as Git's O(ND) algorithm)
function computeDiff(text1: string, text2: string): DiffLine[] {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const m = lines1.length;
  const n = lines2.length;

  if (m === 0 && n === 0) return [];
  if (m === 0) return lines2.map((l, i) => ({ type: 'add' as const, content: l, lineNum2: i + 1 }));
  if (n === 0) return lines1.map((l, i) => ({ type: 'remove' as const, content: l, lineNum1: i + 1 }));

  const max = m + n;
  const vSize = 2 * max + 1;
  const v = new Int32Array(vSize);
  v.fill(-1);
  const offset = max;
  v[offset + 1] = 0;

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

  type Edit = { type: 'equal' | 'add' | 'remove'; x: number; y: number };
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

    while (cx > prevX && cy > prevY) {
      cx--;
      cy--;
      edits.push({ type: 'equal', x: cx, y: cy });
    }

    if (d > 0) {
      if (cx === prevX) {
        cy--;
        edits.push({ type: 'add', x: cx, y: cy });
      } else {
        cx--;
        edits.push({ type: 'remove', x: cx, y: cy });
      }
    }
  }

  edits.reverse();

  return edits.map((e) => {
    if (e.type === 'equal') {
      return { type: 'equal', content: lines1[e.x], lineNum1: e.x + 1, lineNum2: e.y + 1 };
    } else if (e.type === 'remove') {
      return { type: 'remove', content: lines1[e.x], lineNum1: e.x + 1 };
    } else {
      return { type: 'add', content: lines2[e.y], lineNum2: e.y + 1 };
    }
  });
}

export function CodeDiffEn() {
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [diffResult, setDiffResult] = useState<DiffLine[]>([]);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('unified');
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const lines1Count = code1.split('\n').length;
  const lines2Count = code2.split('\n').length;
  const isTooLong = lines1Count > MAX_LINES || lines2Count > MAX_LINES;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (isTooLong) {
        setError(`Text is too long (max ${MAX_LINES.toLocaleString()} lines)`);
        setDiffResult([]);
        return;
      }
      if (code1 || code2) {
        try {
          setError(null);
          setDiffResult(computeDiff(code1, code2));
        } catch {
          setError('Text is too long to compare.');
          setDiffResult([]);
        }
      } else {
        setError(null);
        setDiffResult([]);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [code1, code2, isTooLong]);

  const stats = {
    added: diffResult.filter(d => d.type === 'add').length,
    removed: diffResult.filter(d => d.type === 'remove').length,
    unchanged: diffResult.filter(d => d.type === 'equal').length,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label="Original Code"
          value={code1}
          onChange={(e) => setCode1(e.target.value)}
          placeholder="Enter original code..."
          rows={20}
          className="font-mono text-sm"
        />
        <Textarea
          label="Modified Code"
          value={code2}
          onChange={(e) => setCode2(e.target.value)}
          placeholder="Enter modified code..."
          rows={20}
          className="font-mono text-sm"
        />
      </div>

      <div className="flex gap-2 items-center">
        <Button
          variant={viewMode === 'unified' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setViewMode('unified')}
        >
          Unified View
        </Button>
        <Button
          variant={viewMode === 'split' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setViewMode('split')}
        >
          Split View
        </Button>
        {diffResult.length > 0 && !error && (
          <span className="ml-auto text-sm text-gray-500">
            <span className="text-green-600">+{stats.added}</span>
            {' / '}
            <span className="text-red-600">-{stats.removed}</span>
            {' / '}
            <span className="text-gray-400">{stats.unchanged} unchanged</span>
          </span>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 text-center py-2">{error}</p>
      )}

      {diffResult.length > 0 && !error && (
        <Card variant="bordered" className="overflow-hidden">
          {viewMode === 'unified' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <tbody>
                  {diffResult.map((line, idx) => (
                    <tr
                      key={idx}
                      className={
                        line.type === 'add'
                          ? 'bg-green-50 dark:bg-green-900/20'
                          : line.type === 'remove'
                          ? 'bg-red-50 dark:bg-red-900/20'
                          : ''
                      }
                    >
                      <td className="w-12 px-2 py-0.5 text-right text-gray-400 select-none border-r border-gray-200 dark:border-gray-700">
                        {line.lineNum1 || ''}
                      </td>
                      <td className="w-12 px-2 py-0.5 text-right text-gray-400 select-none border-r border-gray-200 dark:border-gray-700">
                        {line.lineNum2 || ''}
                      </td>
                      <td className="w-6 px-2 py-0.5 text-center select-none">
                        {line.type === 'add' && <span className="text-green-600">+</span>}
                        {line.type === 'remove' && <span className="text-red-600">-</span>}
                      </td>
                      <td className="px-2 py-0.5 whitespace-pre">
                        {line.content || ' '}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <tbody>
                    {diffResult.filter(d => d.type !== 'add').map((line, idx) => (
                      <tr
                        key={idx}
                        className={line.type === 'remove' ? 'bg-red-50 dark:bg-red-900/20' : ''}
                      >
                        <td className="w-12 px-2 py-0.5 text-right text-gray-400 select-none border-r border-gray-200 dark:border-gray-700">
                          {line.lineNum1 || ''}
                        </td>
                        <td className="px-2 py-0.5 whitespace-pre">
                          {line.content || ' '}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <tbody>
                    {diffResult.filter(d => d.type !== 'remove').map((line, idx) => (
                      <tr
                        key={idx}
                        className={line.type === 'add' ? 'bg-green-50 dark:bg-green-900/20' : ''}
                      >
                        <td className="w-12 px-2 py-0.5 text-right text-gray-400 select-none border-r border-gray-200 dark:border-gray-700">
                          {line.lineNum2 || ''}
                        </td>
                        <td className="px-2 py-0.5 whitespace-pre">
                          {line.content || ' '}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>
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
          🔍 What is Code Diff?
        </h2>
        <p className="text-sm leading-relaxed">
          Code Diff is a tool that visually shows differences between two pieces of code or text.
          Similar to Git diff, it displays added lines (green), removed lines (red), and unchanged lines with color coding.
          It's essential for code review, version comparison, merge conflict resolution, and before/after refactoring comparison.
          Uses the Myers diff algorithm (same as Git) to efficiently compare even large code files.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 View Modes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Unified View</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Shows all changes sequentially in one column. Best for understanding overall flow
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Split View</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Shows original and modified side by side. Best for line-by-line comparison
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Use Cases
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>Preview changes before Pull Request review</li>
          <li>Compare config files before/after library updates</li>
          <li>Compare text data like SQL queries, configs, API responses</li>
          <li>Compare two versions when resolving merge conflicts</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'How is this different from Git diff?',
            answer: 'Git diff shows file changes in a Git repository, while this tool compares any two texts directly. Useful in non-Git environments or for comparing non-file data.',
          },
          {
            question: 'Can it handle large code files?',
            answer: 'Using the Myers diff algorithm, large files can be compared efficiently. Supports up to 50,000 lines.',
          },
          {
            question: 'Does it support character-level comparison?',
            answer: 'Currently only line-level comparison is supported. For character-level comparison, use the Text Diff tool.',
          },
        ]}
      />
    </div>
  );
}
