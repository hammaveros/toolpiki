'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { toPng } from 'html-to-image';
import { FaqSection } from '@/components/ui/FaqItem';

interface Team {
  name: string;
  members: string[];
}

type ViewMode = 'instant' | 'animated';
type AnimSpeed = 'fast' | 'slow';

// Seeded PRNG (mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Seeded shuffle (Fisher-Yates)
function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Deterministic team division from seed + inputs
function divideWithSeed(members: string[], teamCount: number, seed: number): Team[] {
  const rng = mulberry32(seed);
  const shuffled = seededShuffle(members, rng);
  const teams: Team[] = Array.from({ length: teamCount }, (_, i) => ({
    name: `${i + 1}팀`,
    members: [],
  }));
  const assignments = shuffled.map((name, idx) => ({ name, teamIdx: idx % teamCount }));
  const shuffledAssignments = seededShuffle(assignments, rng);
  shuffledAssignments.forEach(({ name, teamIdx }) => {
    teams[teamIdx].members.push(name);
  });
  return teams;
}

// 로컬스토리지 키
const STORAGE_KEY = 'team-picker-names';

export function TeamPicker() {
  const [namesInput, setNamesInput] = useState('');
  const [teamCount, setTeamCount] = useState(2);
  const [names, setNames] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 애니메이션 모드 상태
  const [viewMode, setViewMode] = useState<ViewMode>('animated');
  const [animSpeed, setAnimSpeed] = useState<AnimSpeed>('fast');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatedTeams, setAnimatedTeams] = useState<Team[]>([]);
  const [currentAssigning, setCurrentAssigning] = useState<{ name: string; teamIdx: number } | null>(null);
  const [assignedCount, setAssignedCount] = useState(0);
  const [totalToAssign, setTotalToAssign] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allTeamsRef = useRef<HTMLDivElement>(null);
  const restoredFromShare = useRef(false);

  // 로컬스토리지에서 참가자 목록 불러오기
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setNamesInput(saved);
    }
  }, []);

  // 입력 파싱 + 로컬스토리지 저장
  useEffect(() => {
    const parsed = namesInput
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    setNames(parsed);
    if (restoredFromShare.current) {
      restoredFromShare.current = false;
    } else {
      setTeams([]);
    }
    setError(null);

    // 로컬스토리지에 저장
    if (typeof window !== 'undefined' && namesInput.trim()) {
      localStorage.setItem(STORAGE_KEY, namesInput);
    }
  }, [namesInput]);

  // 애니메이션 정리
  const clearAnimTimer = useCallback(() => {
    if (animTimerRef.current) {
      clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => clearAnimTimer();
  }, [clearAnimTimer]);

  // 팀 나누기
  const divideTeams = () => {
    if (names.length < 2) {
      setError('최소 2명 이상 입력해 주세요');
      return;
    }
    if (teamCount < 2) {
      setError('최소 2팀 이상 선택해 주세요');
      return;
    }
    if (teamCount > names.length) {
      setError('팀 수가 인원보다 많습니다');
      return;
    }

    setError(null);
    clearAnimTimer();
    setTeams([]);
    setCurrentAssigning(null);

    // 이름 셔플
    const shuffled = [...names].sort(() => Math.random() - 0.5);

    // 팀 생성
    const newTeams: Team[] = [];
    for (let i = 0; i < teamCount; i++) {
      newTeams.push({
        name: `${i + 1}팀`,
        members: [],
      });
    }

    // 균등 분배: 먼저 팀 배정을 확정한 후 순서를 섞음
    // 각 사람에게 팀 번호를 부여 (라운드 로빈)
    const assignments: Array<{ name: string; teamIdx: number }> = shuffled.map((name, idx) => ({
      name,
      teamIdx: idx % teamCount,
    }));
    // 배정 순서를 랜덤으로 섞어서 예측 불가능하게
    const shuffledAssignments: Array<{ name: string; teamIdx: number }> = [...assignments].sort(() => Math.random() - 0.5);

    if (viewMode === 'instant') {
      // 바로보기: 기존처럼 즉시 표시
      setIsLoading(true);
      setTimeout(() => {
        shuffledAssignments.forEach(({ name, teamIdx }) => {
          newTeams[teamIdx].members.push(name);
        });
        setTeams(newTeams);
        setIsLoading(false);
      }, 800);
    } else {
      // 구경하면서 보기: 한 명씩 애니메이션
      setIsAnimating(true);
      setAnimatedTeams(newTeams);
      setAssignedCount(0);
      setTotalToAssign(shuffledAssignments.length);

      const delay = animSpeed === 'fast' ? 800 : 1800;

      const assignNext = (idx: number, currentTeams: Team[]) => {
        if (idx >= shuffledAssignments.length) {
          setCurrentAssigning(null);
          setIsAnimating(false);
          setTeams(currentTeams);
          setAnimatedTeams([]);
          return;
        }

        const name: string = shuffledAssignments[idx].name;
        const teamIdx: number = shuffledAssignments[idx].teamIdx;

        // 현재 배정 중인 사람 표시
        setCurrentAssigning({ name, teamIdx });

        animTimerRef.current = setTimeout(() => {
          const updated: Team[] = currentTeams.map((team, i) =>
            i === teamIdx
              ? { ...team, members: [...team.members, name] }
              : team
          );
          setAnimatedTeams(updated);
          setCurrentAssigning(null);
          setAssignedCount(idx + 1);

          animTimerRef.current = setTimeout(() => {
            assignNext(idx + 1, updated);
          }, delay * 0.3);
        }, delay * 0.7);
      };

      // 빈 팀 카드 보여준 후 시작
      animTimerRef.current = setTimeout(() => {
        assignNext(0, newTeams);
      }, 500);
    }
  };

  // 애니메이션 건너뛰기
  const skipAnimation = () => {
    clearAnimTimer();
    setCurrentAssigning(null);
    setIsAnimating(false);

    // 이름 다시 셔플하여 즉시 완료
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const newTeams: Team[] = [];
    for (let i = 0; i < teamCount; i++) {
      newTeams.push({ name: `${i + 1}팀`, members: [] });
    }
    const assignments: Array<{ name: string; teamIdx: number }> = shuffled.map((name, idx) => ({
      name,
      teamIdx: idx % teamCount,
    }));
    const shuffledAssignments: Array<{ name: string; teamIdx: number }> = [...assignments].sort(() => Math.random() - 0.5);
    shuffledAssignments.forEach(({ name, teamIdx }) => {
      newTeams[teamIdx].members.push(name);
    });
    setTeams(newTeams);
    setAnimatedTeams([]);
  };

  // 팀 이름 변경
  const updateTeamName = (idx: number, newName: string) => {
    setTeams((prev) =>
      prev.map((team, i) => (i === idx ? { ...team, name: newName } : team))
    );
  };

  // 다시 섞기
  const reshuffleTeams = () => {
    if (names.length >= 2 && teamCount >= 2) {
      divideTeams();
    }
  };

  // 초기화
  const reset = () => {
    setNamesInput('');
    setTeamCount(2);
    setNames([]);
    setTeams([]);
    setError(null);
  };

  // 공유 URL 생성
  const getShareUrl = () => {
    if (teams.length === 0) return '';
    const data = { teams };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
  };

  const saveAllAsImage = async () => {
    const el = allTeamsRef.current;
    if (!el) return;
    try {
      const dataUrl = await toPng(el, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        style: { padding: '20px', borderRadius: '12px' },
      });
      const link = document.createElement('a');
      link.download = '팀나누기-결과.png';
      link.href = dataUrl;
      link.click();
    } catch {
      // ignore
    }
  };

  const saveAllAsVideo = async () => {
    if (teams.length === 0) return;
    setIsRecording(true);

    try {
      const dpr = 2;
      const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      const bgColors = ['#dbeafe', '#fee2e2', '#dcfce7', '#fef9c3', '#f3e8ff', '#fce7f3', '#e0e7ff', '#cffafe'];

      const cols = Math.min(2, teams.length);
      const cardW = 320;
      const cardGap = 16;
      const pad = 24;
      const cw = pad * 2 + cols * cardW + (cols - 1) * cardGap;

      // 각 팀 카드 높이 계산
      const tmpCanvas = document.createElement('canvas');
      const tmpCtx = tmpCanvas.getContext('2d')!;
      tmpCtx.font = `13px ${font}`;

      const cardHeights = teams.map((team) => {
        let rows = 1;
        let mx = 0;
        team.members.forEach((member) => {
          const tw = tmpCtx.measureText(member).width + 24;
          if (mx + tw > cardW - 32) { mx = 0; rows++; }
          mx += tw + 6;
        });
        return 52 + rows * 34 + 16;
      });

      const gridRows = Math.ceil(teams.length / cols);
      let ch = pad + 36;
      for (let r = 0; r < gridRows; r++) {
        const indices = Array.from({ length: cols }, (_, c) => r * cols + c).filter((i) => i < teams.length);
        ch += Math.max(...indices.map((i) => cardHeights[i])) + cardGap;
      }
      ch += pad;

      const canvas = document.createElement('canvas');
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(dpr, dpr);

      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9')
        ? 'video/webm; codecs=vp9'
        : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

      const downloadPromise = new Promise<void>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = '팀나누기-결과.webm';
          a.click();
          URL.revokeObjectURL(url);
          resolve();
        };
      });

      const drawRoundRect = (x: number, y: number, rw: number, rh: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + rw - r, y);
        ctx.quadraticCurveTo(x + rw, y, x + rw, y + r);
        ctx.lineTo(x + rw, y + rh - r);
        ctx.quadraticCurveTo(x + rw, y + rh, x + rw - r, y + rh);
        ctx.lineTo(x + r, y + rh);
        ctx.quadraticCurveTo(x, y + rh, x, y + rh - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      };

      const showCounts = teams.map(() => 0);

      const drawFrame = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cw, ch);

        ctx.fillStyle = '#111827';
        ctx.font = `bold 18px ${font}`;
        ctx.fillText('팀 나누기 결과', pad, pad + 22);

        let y = pad + 40;
        for (let r = 0; r < gridRows; r++) {
          const rowIndices = Array.from({ length: cols }, (_, c) => r * cols + c).filter((i) => i < teams.length);
          const maxH = Math.max(...rowIndices.map((i) => cardHeights[i]));

          rowIndices.forEach((tIdx, colIdx) => {
            const x = pad + colIdx * (cardW + cardGap);
            const team = teams[tIdx];
            const bg = bgColors[tIdx % bgColors.length];

            drawRoundRect(x, y, cardW, cardHeights[tIdx], 10);
            ctx.fillStyle = bg;
            ctx.fill();
            ctx.strokeStyle = '#d1d5db';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = '#111827';
            ctx.font = `bold 16px ${font}`;
            ctx.fillText(team.name, x + 16, y + 28);

            ctx.fillStyle = '#6b7280';
            ctx.font = `13px ${font}`;
            const nameW = ctx.measureText(team.name).width;
            ctx.fillText(`(${team.members.length}명)`, x + 16 + nameW + 8, y + 28);

            let mx = x + 16;
            let my = y + 44;
            ctx.font = `13px ${font}`;
            const visible = team.members.slice(0, showCounts[tIdx]);
            visible.forEach((member) => {
              const tw = ctx.measureText(member).width + 24;
              if (mx + tw > x + cardW - 16) { mx = x + 16; my += 34; }
              drawRoundRect(mx, my, tw, 26, 13);
              ctx.fillStyle = '#ffffff';
              ctx.fill();
              ctx.strokeStyle = '#e5e7eb';
              ctx.lineWidth = 1;
              ctx.stroke();
              ctx.fillStyle = '#374151';
              ctx.fillText(member, mx + 12, my + 18);
              mx += tw + 6;
            });
          });

          y += maxH + cardGap;
        }
      };

      // 팀별로 멤버 하나씩 추가하는 스텝 생성
      const steps: Array<{ teamIdx: number; count: number }> = [];
      for (let t = 0; t < teams.length; t++) {
        for (let m = 1; m <= teams[t].members.length; m++) {
          steps.push({ teamIdx: t, count: m });
        }
      }

      recorder.start();
      drawFrame();
      await new Promise((r) => setTimeout(r, 500));

      for (const step of steps) {
        showCounts[step.teamIdx] = step.count;
        drawFrame();
        await new Promise((r) => setTimeout(r, 400));
      }

      await new Promise((r) => setTimeout(r, 1000));
      recorder.stop();
      await downloadPromise;
    } catch {
      // ignore
    } finally {
      setIsRecording(false);
    }
  };


  // URL에서 공유 데이터 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(7)));
        const parsed = JSON.parse(decoded);
        if (parsed.teams && Array.isArray(parsed.teams)) {
          restoredFromShare.current = true;
          const allMembers = parsed.teams.flatMap((t: Team) => t.members);
          setNamesInput(allMembers.join(', '));
          setTeams(parsed.teams);
          setTeamCount(parsed.teams.length);
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // 팀 색상
  const teamColors = [
    'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
    'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700',
    'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
    'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700',
    'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
    'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700',
    'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700',
    'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700',
  ];

  // 팀 배지 배경색 (애니메이션 중 이름 → 팀 표시용)
  const teamBadgeColors = [
    '#dbeafe', '#fee2e2', '#dcfce7', '#fef9c3',
    '#f3e8ff', '#fce7f3', '#e0e7ff', '#cffafe',
  ];

  return (
    <div className="space-y-2">
      {/* 입력 */}
      <Card variant="bordered" className="p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            참가자 이름 (쉼표 또는 줄바꿈으로 구분)
          </label>
          <textarea
            value={namesInput}
            onChange={(e) => setNamesInput(e.target.value)}
            placeholder="홍길동, 김철수, 이영희&#10;또는 한 줄에 한 명씩"
            className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          {names.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              총 {names.length}명 입력됨
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            팀 수
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setTeamCount((prev) => Math.max(2, prev - 1))}
              disabled={teamCount <= 2}
            >
              -
            </Button>
            <Input
              type="number"
              value={teamCount}
              onChange={(e) => setTeamCount(Math.max(2, Math.min(8, parseInt(e.target.value) || 2)))}
              className="w-20 text-center"
              min={2}
              max={8}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setTeamCount((prev) => Math.min(8, prev + 1))}
              disabled={teamCount >= 8}
            >
              +
            </Button>
            <span className="text-sm text-gray-500">팀</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* 모드 선택 */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            보기 방식
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode('instant')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${viewMode === 'instant'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              바로보기
            </button>
            <button
              type="button"
              onClick={() => setViewMode('animated')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${viewMode === 'animated'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              한명씩 보기
            </button>
          </div>
          {viewMode === 'animated' && (
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setAnimSpeed('fast')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors
                  ${animSpeed === 'fast'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                빠르게
              </button>
              <button
                type="button"
                onClick={() => setAnimSpeed('slow')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors
                  ${animSpeed === 'slow'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                느리게
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button onClick={divideTeams} disabled={isLoading || isAnimating}>
            {isLoading || isAnimating ? '나누는 중...' : '팀 나누기'}
          </Button>
          {isAnimating && (
            <Button variant="secondary" onClick={skipAnimation}>
              건너뛰기
            </Button>
          )}
          {!isAnimating && teams.length > 0 && (
            <Button variant="secondary" onClick={reshuffleTeams} disabled={isLoading}>
              다시 섞기
            </Button>
          )}
          <Button variant="ghost" onClick={reset} disabled={isAnimating}>
            초기화
          </Button>
        </div>
      </Card>

      {/* 로딩 애니메이션 (바로보기 모드) */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">
            팀을 나누는 중...
          </p>
        </div>
      )}

      {/* 한명씩 보기 애니메이션 */}
      {isAnimating && animatedTeams.length > 0 && (
        <div className="space-y-4">
          {/* 진행 상황 */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalToAssign > 0 ? (assignedCount / totalToAssign) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {assignedCount}/{totalToAssign}
              </span>
            </div>
            <div className="h-10 flex items-center justify-center">
              {currentAssigning ? (
                <div className="flex items-center justify-center gap-2 animate-bounce">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {currentAssigning.name}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span
                    className="text-sm font-medium px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: teamBadgeColors[currentAssigning.teamIdx % teamBadgeColors.length],
                    }}
                  >
                    {animatedTeams[currentAssigning.teamIdx]?.name}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-400 animate-pulse">...</span>
              )}
            </div>
          </div>

          {/* 팀 카드 (애니메이션 진행 중) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {animatedTeams.map((team, idx) => (
              <Card
                key={idx}
                variant="bordered"
                className={`p-4 border-2 transition-all duration-300 ${teamColors[idx % teamColors.length]}
                  ${currentAssigning?.teamIdx === idx ? 'ring-2 ring-blue-500 scale-[1.02]' : ''}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-lg">{team.name}</span>
                  <span className="text-sm text-gray-500">({team.members.length}명)</span>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                  {team.members.map((member, mIdx) => (
                    <span
                      key={mIdx}
                      className={`px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm
                                 border border-gray-200 dark:border-gray-700
                                 ${mIdx === team.members.length - 1 ? 'animate-fade-in' : ''}`}
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 최종 결과 */}
      {!isLoading && !isAnimating && teams.length > 0 && (
        <div className="space-y-4">
          <div ref={allTeamsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team, idx) => (
              <Card
                key={idx}
                variant="bordered"
                className={`p-4 border-2 ${teamColors[idx % teamColors.length]}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={team.name}
                    onChange={(e) => updateTeamName(idx, e.target.value)}
                    className="font-bold text-lg bg-transparent border-b border-transparent
                               hover:border-gray-300 dark:hover:border-gray-600
                               focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <span className="text-sm text-gray-500">({team.members.length}명)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {team.members.map((member, mIdx) => (
                    <span
                      key={mIdx}
                      className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm
                                 border border-gray-200 dark:border-gray-700"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* 전체 저장 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={saveAllAsImage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              이미지 저장
            </button>
            <button
              type="button"
              onClick={saveAllAsVideo}
              disabled={isRecording}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isRecording ? (
                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              )}
              {isRecording ? '녹화 중...' : '영상 저장'}
            </button>
          </div>

          {/* 공유 */}
          <Card variant="bordered" className="p-4">
            <p className="text-sm font-medium mb-3">결과 공유</p>
            <ResultShareButtons
              url={getShareUrl()}
              title={`팀 뽑기 결과: ${teams.length}팀`}
              description={teams.map((t) => `${t.name}: ${t.members.join(', ')}`).join(' | ')}
            />
          </Card>
        </div>
      )}

      {/* 안내 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 쉼표(,) 또는 줄바꿈으로 이름을 구분합니다</p>
        <p>• 팀 이름은 결과 화면에서 클릭하여 수정할 수 있습니다</p>
        <p>• 다시 섞기를 누르면 새로운 조합이 만들어집니다</p>
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
          👥 팀 뽑기란?
        </h2>
        <p className="text-sm leading-relaxed">
          팀 뽑기는 여러 명의 참가자를 원하는 수의 팀으로 무작위로 나누는 도구입니다.
          2팀에서 최대 8팀까지 설정 가능하며, 인원이 딱 나누어 떨어지지 않아도 라운드 로빈 방식으로 자동 분배됩니다.
          모든 참가자가 무작위로 섞인 후 팀에 배정되므로 공정한 팀 편성이 가능합니다.
          스포츠 경기, 프로젝트 그룹, 보드게임, 워크샵 등 다양한 상황에서 활용하세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          활용 예시
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">상황</th>
                <th className="text-left py-2 px-3 font-semibold">팀 수</th>
                <th className="text-left py-2 px-3 font-semibold">용도</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">스포츠</td>
                <td className="py-2 px-3">2팀</td>
                <td className="py-2 px-3">축구, 농구, 배드민턴 복식 등</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">수업/워크샵</td>
                <td className="py-2 px-3">3~5팀</td>
                <td className="py-2 px-3">조별 토론, 프로젝트 그룹</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">보드게임</td>
                <td className="py-2 px-3">2~4팀</td>
                <td className="py-2 px-3">팀 대항전, 협동 게임</td>
              </tr>
              <tr>
                <td className="py-2 px-3">회식</td>
                <td className="py-2 px-3">자유</td>
                <td className="py-2 px-3">테이블 배정, 게임 팀</td>
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
          <li>쉼표(,) 또는 줄바꿈으로 이름을 입력하세요</li>
          <li>팀 이름은 결과 화면에서 클릭해 수정할 수 있습니다</li>
          <li>참가자 목록은 다음 방문 시에도 유지됩니다</li>
          <li>공유 기능으로 팀 편성 결과를 전달하세요</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '인원이 팀 수로 나누어 떨어지지 않으면 어떻게 되나요?',
            answer: '라운드 로빈 방식으로 한 명씩 순서대로 배정하므로, 일부 팀이 1명 더 많아질 수 있습니다. 예를 들어 7명을 3팀으로 나누면 2팀은 3명, 1팀은 2명이 됩니다.',
          },
          {
            question: '팀 편성이 마음에 안 들면 어떻게 하나요?',
            answer: '"다시 섞기" 버튼을 클릭하면 새로운 무작위 조합이 생성됩니다. 원하는 결과가 나올 때까지 여러 번 시도할 수 있습니다.',
          },
          {
            question: '팀 이름을 바꿀 수 있나요?',
            answer: '네, 결과 화면에서 팀 이름 부분을 클릭하면 직접 수정할 수 있습니다. "1팀" 대신 "레드팀", "호랑이팀" 등 원하는 이름으로 변경하세요.',
          },
        ]}
      />
    </div>
  );
}
