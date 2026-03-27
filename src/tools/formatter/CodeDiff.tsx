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

// Myers diff 알고리즘 (Git이 사용하는 O(ND) 알고리즘)
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

export function CodeDiff() {
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
        setError(`텍스트가 너무 깁니다 (최대 ${MAX_LINES.toLocaleString()}줄)`);
        setDiffResult([]);
        return;
      }
      if (code1 || code2) {
        try {
          setError(null);
          setDiffResult(computeDiff(code1, code2));
        } catch {
          setError('텍스트가 너무 길어서 비교할 수 없습니다.');
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
          label="원본 코드"
          value={code1}
          onChange={(e) => setCode1(e.target.value)}
          placeholder="원본 코드를 입력하세요..."
          rows={12}
          className="font-mono text-sm"
        />
        <Textarea
          label="수정된 코드"
          value={code2}
          onChange={(e) => setCode2(e.target.value)}
          placeholder="수정된 코드를 입력하세요..."
          rows={12}
          className="font-mono text-sm"
        />
      </div>

      <div className="flex gap-2 items-center">
        <Button
          variant={viewMode === 'unified' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setViewMode('unified')}
        >
          통합 보기
        </Button>
        <Button
          variant={viewMode === 'split' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setViewMode('split')}
        >
          분할 보기
        </Button>
        {diffResult.length > 0 && !error && (
          <span className="ml-auto text-sm text-gray-500">
            <span className="text-green-600">+{stats.added}</span>
            {' / '}
            <span className="text-red-600">-{stats.removed}</span>
            {' / '}
            <span className="text-gray-400">{stats.unchanged} 동일</span>
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
          🔍 코드 비교 도구란?
        </h2>
        <p className="text-sm leading-relaxed">
          코드 비교(Code Diff) 도구는 두 개의 코드 또는 텍스트 간의 차이점을 시각적으로 보여주는 도구입니다.
          Git diff와 유사하게 추가된 줄(녹색), 삭제된 줄(빨간색), 변경되지 않은 줄을 색상으로 구분하여 표시합니다.
          코드 리뷰, 버전 비교, 병합 충돌 해결, 리팩토링 전후 비교 등 개발 작업에서 필수적으로 사용됩니다.
          Myers diff 알고리즘(Git과 동일)을 기반으로 대용량 코드도 효율적으로 비교합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 보기 모드
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">통합 보기 (Unified)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              모든 변경사항을 한 열에 순차적으로 표시. 전체 흐름 파악에 적합
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">분할 보기 (Split)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              원본과 수정본을 나란히 표시. 라인별 직접 비교에 적합
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 활용 사례
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>Pull Request 리뷰 전 변경사항 미리 확인</li>
          <li>라이브러리 업데이트 전후 설정 파일 비교</li>
          <li>SQL 쿼리, 설정 파일, API 응답 등 텍스트 데이터 비교</li>
          <li>병합 충돌 해결 시 두 버전 비교</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'Git diff와 어떻게 다른가요?',
            answer: 'Git diff는 Git 저장소의 파일 변경사항을 보여주지만, 이 도구는 임의의 두 텍스트를 직접 비교합니다. Git이 없는 환경이나 파일이 아닌 데이터 비교에 유용합니다.',
          },
          {
            question: '대용량 코드도 비교할 수 있나요?',
            answer: 'Myers diff 알고리즘을 사용하여 대용량 파일도 효율적으로 처리합니다. 최대 50,000줄까지 비교 가능합니다.',
          },
          {
            question: '문자 단위 비교도 가능한가요?',
            answer: '현재는 라인 단위 비교만 지원합니다. 문자 단위 비교가 필요하면 텍스트 비교 도구를 사용하세요.',
          },
        ]}
      />
    </div>
  );
}
