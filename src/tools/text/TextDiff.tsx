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

// Myers diff 알고리즘 (Git이 사용하는 O(ND) 알고리즘)
// 차이가 적을수록 빠르고, 메모리 효율적
function computeDiff(text1: string, text2: string): DiffLine[] {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const m = lines1.length;
  const n = lines2.length;

  // 빈 텍스트 처리
  if (m === 0 && n === 0) return [];
  if (m === 0) return lines2.map((l, i) => ({ type: 'added' as const, text2: l, lineNum2: i + 1 }));
  if (n === 0) return lines1.map((l, i) => ({ type: 'removed' as const, text1: l, lineNum1: i + 1 }));

  // Myers diff - edit script 추출
  const max = m + n;
  const vSize = 2 * max + 1;
  const v = new Int32Array(vSize);
  v.fill(-1);
  const offset = max;
  v[offset + 1] = 0;

  // 각 d 단계의 v 스냅샷 저장 (역추적용)
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

  // 역추적으로 edit path 생성
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

  // DiffLine 변환 + removed/added → modified 병합
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

// 단어 단위 하이라이트 (modified 라인용)
function highlightWordDiff(text1: string, text2: string): { highlighted1: React.ReactNode; highlighted2: React.ReactNode } {
  const words1 = text1.split(/(\s+)/);
  const words2 = text2.split(/(\s+)/);

  const highlighted1: React.ReactNode[] = [];
  const highlighted2: React.ReactNode[] = [];

  // 간단한 단어 비교
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

export function TextDiff() {
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
      setError('텍스트가 너무 길어서 비교할 수 없습니다. 텍스트를 줄여주세요.');
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
                원본 텍스트
              </label>
              <Textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="비교할 첫 번째 텍스트를 입력하세요... (Ctrl+Enter로 비교)"
                rows={15}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                비교 텍스트
              </label>
              <Textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="비교할 두 번째 텍스트를 입력하세요... (Ctrl+Enter로 비교)"
                rows={15}
                className="font-mono text-sm"
              />
            </div>
          </div>
          {isTooLong && (
            <p className="text-sm text-red-500 dark:text-red-400 text-center">
              텍스트가 너무 깁니다 (최대 {MAX_LINES.toLocaleString()}줄). 원본: {lines1Count.toLocaleString()}줄, 비교: {lines2Count.toLocaleString()}줄
            </p>
          )}
          <Button onClick={handleCompare} className="w-full" disabled={(!text1 && !text2) || isTooLong}>
            비교하기
          </Button>
        </>
      ) : (
        <>
          {/* 에러 */}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 text-center py-2">{error}</p>
          )}

          {/* 통계 */}
          {stats && !error && (
            <div className="flex flex-wrap gap-2 justify-center">
              <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">
                + {stats.added} 추가
              </div>
              <div className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                - {stats.removed} 삭제
              </div>
              <div className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm">
                ~ {stats.modified} 수정
              </div>
              <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                = {stats.same} 동일
              </div>
            </div>
          )}

          {/* 뷰 모드 토글 */}
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
              좌우 비교
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
              통합 뷰
            </button>
          </div>

          {viewMode === 'split' ? (
            <SplitView diff={diff} />
          ) : (
            <UnifiedView diff={diff} />
          )}

          <div className="flex gap-4">
            <Button onClick={() => setShowDiff(false)} variant="secondary" className="flex-1">
              다시 편집
            </Button>
            <Button onClick={handleClear} variant="secondary" className="flex-1">
              초기화
            </Button>
          </div>
        </>
      )}

      <SeoContent />
    </div>
  );
}

// 좌우 분할 뷰 (Bitbucket/GitHub 스타일)
function SplitView({ diff }: { diff: DiffLine[] }) {
  return (
    <Card variant="bordered" className="p-0 overflow-hidden">
      <div className="grid grid-cols-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
        <div className="px-3 py-2 bg-red-50 dark:bg-red-900/10 border-r-2 border-gray-300 dark:border-gray-600">원본</div>
        <div className="px-3 py-2 bg-green-50 dark:bg-green-900/10">수정본</div>
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

// 통합 뷰 (기존 스타일)
function UnifiedView({ diff }: { diff: DiffLine[] }) {
  return (
    <Card variant="bordered" className="p-0 overflow-hidden">
      <div className="max-h-[500px] overflow-y-auto">
        <table className="w-full text-sm font-mono">
          <tbody>
            {diff.map((line, i) => {
              if (line.type === 'modified') {
                // modified는 두 줄로 표시
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
          🔍 텍스트 비교(Diff)란?
        </h2>
        <p className="text-sm leading-relaxed">
          텍스트 비교(Diff)는 두 개의 텍스트를 줄 단위로 분석하여 어떤 부분이 추가, 삭제, 수정되었는지를
          시각적으로 보여주는 도구입니다. 프로그래밍에서 유래한 diff는 원래 유닉스 명령어로, 두 파일 간의
          차이를 계산하는 데 사용되었습니다. 현재는 코드 리뷰, 문서 변경 추적, 설정 파일 비교 등 다양한
          분야에서 필수적으로 활용되고 있으며, 이 도구는 브라우저에서 별도 설치 없이 바로 사용할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Diff 활용 사례와 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>
            <strong>코드 리뷰:</strong> Pull Request나 커밋 전에 변경된 코드를 확인하여 실수를 미리
            잡아낼 수 있습니다. 좌우 비교(Split View)를 사용하면 원본과 수정본을 나란히 비교할 수 있어
            가독성이 높습니다.
          </li>
          <li>
            <strong>문서 버전 관리:</strong> 계약서, 보고서, 제안서 등의 문서가 수정될 때 어떤 내용이
            바뀌었는지 빠르게 파악할 수 있습니다. 특히 여러 사람이 함께 작업하는 문서에서 유용합니다.
          </li>
          <li>
            <strong>설정 파일 비교:</strong> 서버 설정, 환경변수, JSON/YAML 파일 등의 변경 사항을
            추적하여 배포 전 실수를 방지할 수 있습니다.
          </li>
          <li>
            <strong>번역 검수:</strong> 원문과 번역문을 비교하여 누락된 부분이나 의도치 않은 변경을
            찾아낼 수 있습니다.
          </li>
        </ul>
        <p className="text-sm leading-relaxed mt-3">
          이 도구는 Myers diff 알고리즘(Git이 사용하는 것과 동일)을 기반으로 동작하여 대용량 텍스트도
          효율적으로 처리합니다. 단순 줄 비교뿐 아니라 수정된 줄 내에서 단어 단위 하이라이트도 지원합니다.
          통합 뷰(Unified View)와 좌우 비교(Split View) 두 가지 모드를 제공하여 상황에 맞게 선택할 수 있습니다.
        </p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '텍스트 비교 시 공백이나 빈 줄도 감지되나요?',
            answer: '네, 줄 단위로 정확히 비교하기 때문에 공백 추가/삭제, 빈 줄 변경도 모두 감지됩니다. 수정된 줄은 단어 단위로 어떤 부분이 바뀌었는지 하이라이트로 표시해 줍니다.',
          },
          {
            question: '좌우 비교(Split View)와 통합 뷰(Unified View)의 차이는 무엇인가요?',
            answer: '좌우 비교는 원본과 수정본을 나란히 배치하여 직관적으로 비교할 수 있고, 통합 뷰는 하나의 목록에서 삭제(-), 추가(+) 순으로 변경 사항을 보여줍니다. 코드 리뷰에는 좌우 비교가, 전체 흐름 파악에는 통합 뷰가 적합합니다.',
          },
          {
            question: '입력한 텍스트가 서버로 전송되나요?',
            answer: '아니요, 모든 비교 처리는 브라우저 내에서 이루어지며 서버로 데이터를 전송하지 않습니다. 민감한 코드나 문서도 안심하고 비교할 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}
