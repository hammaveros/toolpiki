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
          rows={20}
          className="font-mono text-sm"
        />
        <Textarea
          label="수정된 코드"
          value={code2}
          onChange={(e) => setCode2(e.target.value)}
          placeholder="수정된 코드를 입력하세요..."
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
          두 버전의 텍스트가 어디서 어떻게 달라졌는지 라인 단위로 보여주는 도구입니다.
          삭제된 줄은 빨간색, 새로 추가된 줄은 녹색으로 강조되고, 그대로 유지된 줄은 회색 톤으로 처리해서
          한눈에 변경 흐름이 잡힙니다. 내부적으로는 Git이 쓰는 것과 동일한 Myers diff (O(ND)) 알고리즘을 사용하고,
          최대 50,000줄까지 브라우저에서 바로 계산합니다. 서버로 코드를 전송하지 않기 때문에 사내 코드나 설정 파일을
          올려도 외부로 새지 않습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🛠️ 이런 상황에 써보세요
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>GitHub/GitLab 안 쓰는 사내 시스템에서 두 버전의 SQL 스키마를 비교할 때</li>
          <li>장애 났을 때 어제 nginx.conf와 오늘 nginx.conf 사이 무엇이 바뀌었는지 빠르게 잡아낼 때</li>
          <li>ChatGPT/Claude가 리팩토링한 코드와 원본을 나란히 두고 검토할 때</li>
          <li>Postman으로 받은 두 번의 API 응답 JSON을 붙여서 어떤 필드가 추가/삭제됐는지 확인할 때</li>
          <li>Slack으로 받은 코드 스니펫과 IDE에 있는 현재 코드를 비교할 때</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 보기 모드 고르기
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">통합 보기 (Unified)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              GitHub PR 화면처럼 한 컬럼에 +/- 라인이 섞여서 나옵니다. 모바일이나 좁은 모니터에서 보기 좋아요.
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">분할 보기 (Split)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              왼쪽에 원본, 오른쪽에 수정본이 나란히 표시되어 라인별로 직접 매칭해서 보기 편합니다. 와이드 모니터 추천.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 잘 쓰는 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>JSON/YAML 비교 전에 먼저 같은 포맷터로 정렬해두면 들여쓰기 차이로 인한 가짜 diff가 사라집니다.</li>
          <li>로그 파일 비교 시 타임스탬프 열은 sed/awk로 제거하고 붙이면 실제 변경 라인만 보여요.</li>
          <li>50,000줄 이상은 대용량으로 판단해 자르는 게 좋고, 큰 파일은 git diff --stat으로 먼저 후보를 좁히세요.</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'Git diff와 정확히 무엇이 다른가요?',
            answer: 'git diff는 워킹 트리/스테이지/커밋 사이를 비교하는 명령이고, 이 도구는 그냥 두 덩어리의 텍스트를 붙여 넣어서 즉시 비교하는 도구입니다. Git 저장소가 아닌 곳—예를 들면 두 API 응답, 두 설정 파일, AI가 생성한 코드 두 버전 등—을 비교할 때 더 편합니다.',
          },
          {
            question: '비교 결과를 저장하거나 공유할 수 있나요?',
            answer: '결과는 브라우저 안에서만 표시되고 서버에 저장되지 않습니다. 공유가 필요하면 결과 영역을 캡처하거나, 통합 보기 상태에서 텍스트를 복사해 PR 코멘트로 붙여 넣는 방식이 가장 빠릅니다.',
          },
          {
            question: '한글이나 이모지가 섞여도 정확히 비교되나요?',
            answer: '네. 라인 단위 문자열 비교라 유니코드 문자(한글, 일본어, 이모지)도 동일한 라인이면 변경 없음으로 판정됩니다. 다만 BOM이나 줄바꿈 문자(CRLF vs LF)는 다른 라인으로 잡힐 수 있으니 사전에 통일해 주세요.',
          },
          {
            question: '문자나 단어 단위로도 비교되나요?',
            answer: '현재 버전은 라인 단위까지만 지원합니다. 한 줄 안에서 어느 글자가 바뀌었는지 보고 싶다면 텍스트 비교 도구를 함께 쓰는 편이 빠릅니다.',
          },
        ]}
      />
    </div>
  );
}
