'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';

interface LadderPath {
  col: number;
  row: number;
  direction: 'left' | 'right';
}

export function LadderGame() {
  const [playersInput, setPlayersInput] = useState('A, B, C');
  const [resultsInput, setResultsInput] = useState('당첨, 꽝, 꽝');
  const [players, setPlayers] = useState<string[]>(['A', 'B', 'C']);
  const [results, setResults] = useState<string[]>(['당첨', '꽝', '꽝']);
  const [error, setError] = useState<string | null>(null);
  const [ladderPaths, setLadderPaths] = useState<LadderPath[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [animationPath, setAnimationPath] = useState<{ col: number; row: number }[]>([]);
  const [currentPosition, setCurrentPosition] = useState<{ col: number; row: number } | null>(null);
  const [finalResults, setFinalResults] = useState<Map<number, number>>(new Map());
  const [hideMiddle, setHideMiddle] = useState(true); // 가운데 숨기기 옵션
  const [isShuffling, setIsShuffling] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const restoredFromShare = useRef(false);

  // 인원수에 따라 rows 동적 계산 (최소 8, 최대 14)
  const rows = Math.min(14, Math.max(8, players.length * 2 + 2));

  // 사다리 생성 - 모든 참가자가 다른 결과에 매칭되도록 보장
  const generateLadder = useCallback(() => {
    const cols = players.length;
    let paths: LadderPath[] = [];
    let attempts = 0;
    const maxAttempts = 100;

    // 최소 가로선 개수 (충분히 복잡하게)
    const minPaths = Math.max(rows * (cols - 1) * 0.4, cols * 2);

    // 유효한 사다리가 생성될 때까지 반복
    while (attempts < maxAttempts) {
      paths = [];

      for (let row = 0; row < rows; row++) {
        // 각 행에서 가로선 후보 위치
        const availableCols: number[] = [];
        for (let col = 0; col < cols - 1; col++) {
          // 같은 행에서 인접한 가로선이 없어야 함
          const hasAdjacentPath = paths.some(
            (p) => p.row === row && Math.abs(p.col - col) <= 1
          );
          if (!hasAdjacentPath) {
            availableCols.push(col);
          }
        }

        // 70% 확률로 가로선 생성 (더 복잡하게)
        for (const col of availableCols) {
          if (Math.random() < 0.7) {
            // 다시 인접 체크 (방금 추가한 것과 충돌 방지)
            const hasAdjacentPath = paths.some(
              (p) => p.row === row && Math.abs(p.col - col) <= 1
            );
            if (!hasAdjacentPath) {
              paths.push({ col, row, direction: 'right' });
            }
          }
        }
      }

      // 최소 가로선 개수 미달 시 추가 생성
      if (paths.length < minPaths) {
        for (let row = 0; row < rows && paths.length < minPaths; row++) {
          for (let col = 0; col < cols - 1 && paths.length < minPaths; col++) {
            const hasPath = paths.some((p) => p.row === row && p.col === col);
            const hasAdjacentPath = paths.some(
              (p) => p.row === row && Math.abs(p.col - col) <= 1
            );
            if (!hasPath && !hasAdjacentPath) {
              paths.push({ col, row, direction: 'right' });
            }
          }
        }
      }

      // 생성된 사다리로 결과 매핑 테스트
      const resultMapping: number[] = [];
      for (let startCol = 0; startCol < cols; startCol++) {
        let currentCol = startCol;
        for (let row = 0; row < rows; row++) {
          const rightPath = paths.find((p) => p.col === currentCol && p.row === row);
          const leftPath = paths.find((p) => p.col === currentCol - 1 && p.row === row);
          if (rightPath) currentCol++;
          else if (leftPath) currentCol--;
        }
        resultMapping.push(currentCol);
      }

      // 모든 결과가 고유한지 확인 (1:1 매칭)
      const uniqueResults = new Set(resultMapping);
      if (uniqueResults.size === cols && paths.length >= minPaths) {
        // 유효한 사다리 생성 완료
        break;
      }

      attempts++;
    }

    setLadderPaths(paths);
    setIsRevealed(false);
    setSelectedPlayer(null);
    setAnimationPath([]);
    setCurrentPosition(null);
    setFinalResults(new Map());
  }, [players.length]);

  useEffect(() => {
    generateLadder();
  }, [generateLadder]);

  // 사다리 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cols = players.length;
    const colWidth = width / cols;
    const rowHeight = height / (rows + 1);

    ctx.clearRect(0, 0, width, height);

    // 숨기기 모드 체크 (한 명이라도 클릭하면 바로 공개)
    const shouldHide = hideMiddle && !isRevealed && finalResults.size === 0 && selectedPlayer === null;

    // 숨기기 영역 (상단/하단 여백만 남기고 전체 가림)
    const hideStartY = rowHeight * 1.2;  // 상단 약간 아래부터
    const hideEndY = height - rowHeight * 1.2;  // 하단 약간 위까지

    // 세로선 (전체)
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 3;
    for (let col = 0; col < cols; col++) {
      const x = colWidth * col + colWidth / 2;
      ctx.beginPath();
      ctx.moveTo(x, rowHeight * 0.5);
      ctx.lineTo(x, height - rowHeight * 0.5);
      ctx.stroke();
    }

    // 가로선 (숨기기 모드가 아닐 때만 표시)
    if (!shouldHide) {
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 3;
      ladderPaths.forEach(({ col, row }) => {
        const x1 = colWidth * col + colWidth / 2;
        const x2 = colWidth * (col + 1) + colWidth / 2;
        const y = rowHeight * (row + 1);

        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      });
    }

    // 숨기기 박스 (불투명하게 가림)
    if (shouldHide) {
      // 배경색에 맞춰서 (다크모드 감지)
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // 그라데이션으로 자연스럽게
      const gradient = ctx.createLinearGradient(0, hideStartY - 20, 0, hideStartY + 20);
      gradient.addColorStop(0, isDark ? 'rgba(31, 41, 55, 0)' : 'rgba(249, 250, 251, 0)');
      gradient.addColorStop(1, isDark ? 'rgba(31, 41, 55, 1)' : 'rgba(249, 250, 251, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, hideStartY - 20, width, 40);

      // 가운데 완전 불투명
      ctx.fillStyle = isDark ? '#1f2937' : '#f9fafb';
      ctx.fillRect(0, hideStartY, width, hideEndY - hideStartY);

      // 하단 그라데이션
      const gradient2 = ctx.createLinearGradient(0, hideEndY - 20, 0, hideEndY + 20);
      gradient2.addColorStop(0, isDark ? 'rgba(31, 41, 55, 1)' : 'rgba(249, 250, 251, 1)');
      gradient2.addColorStop(1, isDark ? 'rgba(31, 41, 55, 0)' : 'rgba(249, 250, 251, 0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, hideEndY - 20, width, 40);

      // 물음표 표시
      ctx.fillStyle = isDark ? '#6b7280' : '#9ca3af';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', width / 2, (hideStartY + hideEndY) / 2);
    }

    // 애니메이션 경로
    if (animationPath.length > 1) {
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 5;
      ctx.beginPath();

      animationPath.forEach((point, idx) => {
        const x = colWidth * point.col + colWidth / 2;
        // row 0 = 시작점, row 1~rows = 가로선 위치, row > rows = 끝점
        const y = point.row === 0
          ? rowHeight * 0.5
          : point.row > rows
            ? height - rowHeight * 0.5
            : rowHeight * point.row;

        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

    // 현재 위치에 공 그리기
    if (currentPosition) {
      const x = colWidth * currentPosition.col + colWidth / 2;
      // row 0 = 시작점, row 1~rows = 가로선 위치, row > rows = 끝점
      const y = currentPosition.row === 0
        ? rowHeight * 0.5
        : currentPosition.row > rows
          ? height - rowHeight * 0.5
          : rowHeight * currentPosition.row;

      // 그림자
      ctx.beginPath();
      ctx.arc(x + 2, y + 2, 12, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fill();

      // 공
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      const gradient = ctx.createRadialGradient(x - 4, y - 4, 0, x, y, 12);
      gradient.addColorStop(0, '#FF6B6B');
      gradient.addColorStop(1, '#EE5A5A');
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = '#CC4444';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 하이라이트
      ctx.beginPath();
      ctx.arc(x - 4, y - 4, 4, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
    }
  }, [players.length, ladderPaths, animationPath, currentPosition, hideMiddle, isRevealed, finalResults, rows]);

  // 사다리 타기 실행
  const runLadder = (startCol: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSelectedPlayer(startCol);
    setCurrentPosition(null);
    setAnimationPath([]);

    // 전체 경로 계산 (세로 이동 포함)
    const fullPath: { col: number; row: number }[] = [];
    let currentCol = startCol;

    // 시작점
    fullPath.push({ col: startCol, row: 0 });

    for (let row = 0; row < rows; row++) {
      // 현재 위치에서 오른쪽으로 가는 가로선 확인
      const rightPath = ladderPaths.find((p) => p.col === currentCol && p.row === row);
      // 현재 위치에서 왼쪽으로 가는 가로선 확인
      const leftPath = ladderPaths.find((p) => p.col === currentCol - 1 && p.row === row);

      if (rightPath) {
        // 가로선 위치까지 내려감
        fullPath.push({ col: currentCol, row: row + 1 });
        // 옆으로 이동
        currentCol++;
        fullPath.push({ col: currentCol, row: row + 1 });
      } else if (leftPath) {
        // 가로선 위치까지 내려감
        fullPath.push({ col: currentCol, row: row + 1 });
        // 옆으로 이동
        currentCol--;
        fullPath.push({ col: currentCol, row: row + 1 });
      } else {
        // 그냥 아래로
        fullPath.push({ col: currentCol, row: row + 1 });
      }
    }

    // 끝점 추가 (마지막 가로선과 끝점 위치가 다르므로 별도 추가)
    fullPath.push({ col: currentCol, row: rows + 1 });

    // 애니메이션 - 공이 경로를 따라감
    let i = 0;
    const animate = () => {
      if (i < fullPath.length) {
        setCurrentPosition(fullPath[i]);
        setAnimationPath(fullPath.slice(0, i + 1));
        i++;
        setTimeout(animate, 120);
      } else {
        // 애니메이션 완료
        setTimeout(() => {
          setCurrentPosition(null);
          setFinalResults((prev) => new Map(prev).set(startCol, currentCol));
          setIsAnimating(false);
        }, 300);
      }
    };
    animate();
  };

  // 전체 공개
  const revealAll = () => {
    const newResults = new Map<number, number>();

    for (let startCol = 0; startCol < players.length; startCol++) {
      let currentCol = startCol;

      for (let row = 0; row < rows; row++) {
        const rightPath = ladderPaths.find((p) => p.col === currentCol && p.row === row);
        const leftPath = ladderPaths.find((p) => p.col === currentCol - 1 && p.row === row);

        if (rightPath) {
          currentCol++;
        } else if (leftPath) {
          currentCol--;
        }
      }

      newResults.set(startCol, currentCol);
    }

    setFinalResults(newResults);
    setIsRevealed(true);
  };

  // 입력 변경 시 자동 적용 체크
  useEffect(() => {
    // 공유 복원 직후에는 입력 파싱/초기화 건너뛰기
    if (restoredFromShare.current) {
      restoredFromShare.current = false;
      return;
    }

    const parsedPlayers = playersInput.split(',').map(s => s.trim()).filter(Boolean);
    const parsedResults = resultsInput.split(',').map(s => s.trim()).filter(Boolean);

    if (parsedPlayers.length < 2) {
      setError('참가자를 2명 이상 입력하세요');
      return;
    }
    if (parsedPlayers.length > 8) {
      setError('참가자는 최대 8명까지 가능합니다');
      return;
    }
    if (parsedResults.length !== parsedPlayers.length) {
      setError(`참가자 ${parsedPlayers.length}명, 결과 ${parsedResults.length}개 - 개수를 맞춰주세요`);
      return;
    }

    // 개수 맞으면 자동 적용
    setError(null);
    setPlayers(parsedPlayers);
    setResults(parsedResults);
  }, [playersInput, resultsInput]);

  // 초기화
  const resetGame = () => {
    setPlayersInput('A, B, C');
    setResultsInput('당첨, 꽝, 꽝');
    setPlayers(['A', 'B', 'C']);
    setResults(['당첨', '꽝', '꽝']);
    setError(null);
    setIsRevealed(false);
    setSelectedPlayer(null);
    setAnimationPath([]);
    setFinalResults(new Map());
  };

  const shuffleResults = () => {
    if (isShuffling) return;
    setIsShuffling(true);

    const original = [...results];
    let count = 0;
    const maxCycles = 6;

    const interval = setInterval(() => {
      count++;
      if (count < maxCycles) {
        // 섞이는 중간 과정 보여주기
        const temp = [...original].sort(() => Math.random() - 0.5);
        setResults(temp);
      } else {
        clearInterval(interval);
        const finalShuffled = [...original].sort(() => Math.random() - 0.5);
        setResults(finalShuffled);
        setResultsInput(finalShuffled.join(', '));
        generateLadder();
        setTimeout(() => setIsShuffling(false), 200);
      }
    }, 80);
  };

  // 사다리 컨테이너 너비 계산
  const ladderWidth = Math.min(400, players.length * 80);

  const getShareUrl = () => {
    if (finalResults.size === 0) return '';
    const mappings = players.map((player, idx) => ({
      player,
      result: results[finalResults.get(idx) || 0]
    }));
    const data = { mappings };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/tools/ladder-game#share=${encoded}`;
  };

  // URL hash에서 공유 데이터 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(7)));
        const parsed = JSON.parse(decoded);
        if (parsed.mappings && Array.isArray(parsed.mappings)) {
          // 공유된 결과만 표시 (사다리는 재생성 불가)
          restoredFromShare.current = true;
          const sharedPlayers = parsed.mappings.map((m: { player: string }) => m.player);
          const sharedResults = parsed.mappings.map((m: { result: string }) => m.result);
          setPlayers(sharedPlayers);
          setPlayersInput(sharedPlayers.join(', '));
          setResults(sharedResults);
          setResultsInput(sharedResults.join(', '));
          // 매핑 설정 (순서대로)
          const newFinalResults = new Map<number, number>();
          parsed.mappings.forEach((_: unknown, idx: number) => {
            newFinalResults.set(idx, idx);
          });
          setFinalResults(newFinalResults);
          setIsRevealed(true);
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <div className="space-y-2">
      {/* 사다리 영역 - 참가자/사다리/결과 정렬 */}
      <div className="flex flex-col items-center">
        {/* 플레이어 */}
        <div
          className="grid gap-1 mb-2"
          style={{
            width: ladderWidth,
            gridTemplateColumns: `repeat(${players.length}, 1fr)`
          }}
        >
          {players.map((player, idx) => (
            <button
              key={idx}
              onClick={() => runLadder(idx)}
              disabled={isAnimating}
              className={`px-2 py-2 rounded-lg font-medium transition-all text-sm truncate ${
                selectedPlayer === idx && isAnimating
                  ? 'bg-red-500 text-white'
                  : finalResults.has(idx)
                  ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-2 border-green-400'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {finalResults.has(idx)
                ? `${player} → ${results[finalResults.get(idx)!]}`
                : player}
            </button>
          ))}
        </div>

        {/* 사다리 */}
        <canvas
          ref={canvasRef}
          width={ladderWidth}
          height={300}
          className="bg-gray-50 dark:bg-gray-800 rounded-lg"
        />

        {/* 결과 */}
        <div
          className="grid gap-1 mt-2"
          style={{
            width: ladderWidth,
            gridTemplateColumns: `repeat(${results.length}, 1fr)`
          }}
        >
          {results.map((result, idx) => {
            const winnerIdx = [...finalResults.entries()].find(([, v]) => v === idx)?.[0];
            return (
              <div
                key={idx}
                className={`px-2 py-2 rounded-lg text-center text-sm transition-all duration-100 ${
                  isShuffling
                    ? 'bg-blue-100 dark:bg-blue-900/30 scale-95'
                    : winnerIdx !== undefined
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <p className="font-medium truncate">{result || '?'}</p>
                {winnerIdx !== undefined && (
                  <p className="text-xs text-gray-500 truncate">{players[winnerIdx]}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 옵션 */}
      <div className="flex justify-center">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={hideMiddle}
            onChange={(e) => setHideMiddle(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-gray-700 dark:text-gray-300">사다리 가운데 숨기기</span>
        </label>
      </div>

      {/* 버튼들 */}
      <div className="flex justify-center gap-3 flex-wrap">
        <Button variant="secondary" onClick={generateLadder}>
          사다리 재생성
        </Button>
        <Button variant="secondary" onClick={shuffleResults} disabled={isShuffling}>
          {isShuffling ? '🔀 섞는 중...' : '🔀 결과 섞기'}
        </Button>
        <Button onClick={revealAll} disabled={isRevealed}>
          전체 공개
        </Button>
        <Button variant="ghost" onClick={resetGame}>
          초기화
        </Button>
      </div>

      {/* 결과 공유 - 전체 공개 후 */}
      {isRevealed && finalResults.size > 0 && (
        <div>
          <div>
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-bold mb-3">🪜 사다리타기 결과</p>
              <div className="space-y-2">
                {players.map((player, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">{player}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">{results[finalResults.get(idx) ?? 0]}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card variant="bordered" className="p-4 mt-3">
            <p className="text-sm font-medium mb-3">결과 공유</p>
            <ResultShareButtons
              url={getShareUrl()}
              title={`사다리 게임 결과: ${players.length}명`}
              description={players.map((p, i) => `${p}→${results[finalResults.get(i) || 0]}`).join(', ')}
            />
          </Card>
        </div>
      )}

      {/* 설정 */}
      <Card variant="bordered" className="p-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">참가자 (쉼표로 구분, 최대 8명)</p>
          <Input
            value={playersInput}
            onChange={(e) => setPlayersInput(e.target.value)}
            placeholder="예: 철수, 영희, 민수"
          />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">결과 (참가자 수와 동일)</p>
          <Input
            value={resultsInput}
            onChange={(e) => setResultsInput(e.target.value)}
            placeholder="예: 당첨, 꽝, 꽝"
          />
        </div>
        {error && (
          <p className="text-xs text-orange-500 font-medium">{error}</p>
        )}
      </Card>

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 이름을 클릭하면 사다리를 탑니다</p>
        <p>• 전체 공개로 모든 결과를 한번에 볼 수 있습니다</p>
        <p>• 참가자와 결과 개수가 일치해야 합니다</p>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🪜 사다리 타기(게임)란?
        </h2>
        <p className="text-sm leading-relaxed">
          사다리 타기(사다리 게임)는 참가자들이 각자 출발점을 선택하고, 세로선을 따라 내려가다가 가로선을 만나면 옆으로 이동하여 최종 결과에 도달하는 추첨 방식입니다.
          가로선이 무작위로 배치되어 누가 어떤 결과를 받을지 예측할 수 없어 공정한 추첨이 가능합니다.
          회식 벌칙, 청소 당번, 순서 정하기, 선물 교환, 역할 분담 등 다양한 상황에서 활용할 수 있습니다.
          최대 8명까지 참여 가능하며, 애니메이션으로 경로를 확인할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          사다리 타기 활용 예시
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">상황</th>
                <th className="text-left py-2 px-3 font-semibold">참가자 예시</th>
                <th className="text-left py-2 px-3 font-semibold">결과 예시</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">회식 벌칙</td>
                <td className="py-2 px-3">팀원 이름</td>
                <td className="py-2 px-3">노래방 애창곡, 건배사, 면제 등</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">청소 당번</td>
                <td className="py-2 px-3">A, B, C, D</td>
                <td className="py-2 px-3">화장실, 주방, 거실, 면제</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">선물 교환</td>
                <td className="py-2 px-3">참가자 이름</td>
                <td className="py-2 px-3">선물 번호 (1, 2, 3...)</td>
              </tr>
              <tr>
                <td className="py-2 px-3">발표 순서</td>
                <td className="py-2 px-3">조별 이름</td>
                <td className="py-2 px-3">1번째, 2번째, 3번째...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          사용 팁
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>참가자와 결과 개수가 동일해야 합니다 (쉼표로 구분)</li>
          <li>"가운데 숨기기" 옵션으로 결과 공개 전까지 경로를 숨길 수 있습니다</li>
          <li>"결과 섞기" 버튼으로 결과 순서를 무작위로 바꿀 수 있습니다</li>
          <li>참가자 이름을 클릭하면 해당 경로가 애니메이션으로 표시됩니다</li>
          <li>결과 공유 버튼으로 친구들에게 결과를 공유하세요</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '사다리 결과가 정말 공정한가요?',
            answer: '네, 가로선이 무작위로 생성되어 모든 참가자가 모든 결과에 동등하게 매칭될 확률을 가집니다. 새로 생성할 때마다 완전히 새로운 사다리가 만들어집니다.',
          },
          {
            question: '최대 몇 명까지 참여할 수 있나요?',
            answer: '최대 8명까지 참여 가능합니다. 참가자 수가 많아질수록 사다리의 가로선도 자동으로 늘어나 충분히 복잡한 구조를 유지합니다.',
          },
          {
            question: '결과를 미리 알 수 없게 하려면?',
            answer: '"가운데 숨기기" 옵션을 켜면 사다리 중간 부분이 가려져서 결과를 클릭하기 전까지 경로를 알 수 없습니다. 공정한 추첨을 위해 추천하는 설정입니다.',
          },
        ]}
      />
    </div>
  );
}
