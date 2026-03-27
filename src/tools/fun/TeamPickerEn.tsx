'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultShareButtonsEn } from '@/components/share/ResultShareButtonsEn';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';
import { toPng } from 'html-to-image';

interface Team {
  name: string;
  members: string[];
}

export function TeamPickerEn() {
  const [namesInput, setNamesInput] = useState('');
  const [teamCount, setTeamCount] = useState(2);
  const [names, setNames] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const allTeamsRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const restoredFromShare = useRef(false);

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
  }, [namesInput]);

  const divideTeams = () => {
    if (names.length < 2) {
      setError('Please enter at least 2 names');
      return;
    }
    if (teamCount < 2) {
      setError('Please select at least 2 teams');
      return;
    }
    if (teamCount > names.length) {
      setError('Team count exceeds number of participants');
      return;
    }

    setError(null);
    setIsLoading(true);
    setTeams([]);

    setTimeout(() => {
      const shuffled = [...names].sort(() => Math.random() - 0.5);
      const newTeams: Team[] = [];
      for (let i = 0; i < teamCount; i++) {
        newTeams.push({
          name: `Team ${i + 1}`,
          members: [],
        });
      }

      // 균등 분배 후 배정 순서를 랜덤으로 섞어서 예측 불가능하게
      const assignments: Array<{ name: string; teamIdx: number }> = shuffled.map((name, idx) => ({
        name,
        teamIdx: idx % teamCount,
      }));
      const shuffledAssignments: Array<{ name: string; teamIdx: number }> = [...assignments].sort(() => Math.random() - 0.5);
      shuffledAssignments.forEach(({ name, teamIdx }) => {
        newTeams[teamIdx].members.push(name);
      });

      setTeams(newTeams);
      setIsLoading(false);
    }, 1500);
  };

  const updateTeamName = (idx: number, newName: string) => {
    setTeams((prev) =>
      prev.map((team, i) => (i === idx ? { ...team, name: newName } : team))
    );
  };

  const reshuffleTeams = () => {
    if (names.length >= 2 && teamCount >= 2) {
      divideTeams();
    }
  };

  const reset = () => {
    setNamesInput('');
    setTeamCount(2);
    setNames([]);
    setTeams([]);
    setError(null);
  };

  const getShareUrl = () => {
    if (teams.length === 0) return '';
    const data = { teams };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/en/tools/team-picker-en#share=${encoded}`;
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
      link.download = 'team-picker-result.png';
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
          a.download = 'team-picker-result.webm';
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
        ctx.fillText('Team Picker Results', pad, pad + 22);

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
            ctx.fillText(`(${team.members.length})`, x + 16 + nameW + 8, y + 28);

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

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Participant Names (separated by comma or newline)
          </label>
          <textarea
            value={namesInput}
            onChange={(e) => setNamesInput(e.target.value)}
            placeholder="John, Jane, Bob&#10;or one name per line"
            className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          {names.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {names.length} participants entered
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Number of Teams
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
            <span className="text-sm text-gray-500">teams</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <Button onClick={divideTeams} disabled={isLoading}>
            {isLoading ? 'Dividing...' : 'Divide Teams'}
          </Button>
          {teams.length > 0 && (
            <Button variant="secondary" onClick={reshuffleTeams} disabled={isLoading}>
              Reshuffle
            </Button>
          )}
          <Button variant="ghost" onClick={reset}>
            Reset
          </Button>
        </div>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">
            Dividing teams...
          </p>
          <div className="flex gap-2 mt-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {!isLoading && teams.length > 0 && (
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
                  <span className="text-sm text-gray-500">({team.members.length})</span>
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

          {/* Save all */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={saveAllAsImage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Save Image
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
              {isRecording ? 'Recording...' : 'Save Video'}
            </button>
          </div>

          <Card variant="bordered" className="p-4">
            <p className="text-sm font-medium mb-3">Share Results</p>
            <ResultShareButtonsEn
              url={getShareUrl()}
              title={`Team Picker Results: ${teams.length} teams`}
              description={teams.map((t) => `${t.name}: ${t.members.join(', ')}`).join(' | ')}
            />
          </Card>
        </div>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Separate names with commas (,) or newlines</p>
        <p>• Click team names in results to rename them</p>
        <p>• Click Reshuffle to create new combinations</p>
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
          What is Team Picker?
        </h2>
        <p className="text-sm leading-relaxed">
          Team Picker is a tool that randomly divides participants into your desired number of teams.
          Choose between 2 to 8 teams, and members are automatically distributed evenly using a round-robin method, even when numbers do not divide equally.
          All participants are shuffled randomly before team assignment, ensuring fair and unbiased team formation.
          Perfect for sports matches, project groups, board games, workshops, and more.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Use Cases
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">Situation</th>
                <th className="text-left py-2 px-3 font-semibold">Teams</th>
                <th className="text-left py-2 px-3 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Sports</td>
                <td className="py-2 px-3">2 teams</td>
                <td className="py-2 px-3">Soccer, basketball, doubles matches</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Class/Workshop</td>
                <td className="py-2 px-3">3-5 teams</td>
                <td className="py-2 px-3">Group discussions, project teams</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Board Games</td>
                <td className="py-2 px-3">2-4 teams</td>
                <td className="py-2 px-3">Team battles, cooperative games</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Events</td>
                <td className="py-2 px-3">Varies</td>
                <td className="py-2 px-3">Table assignments, party games</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Tips
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>Enter names separated by comma (,) or newline</li>
          <li>Click team names in results to customize them</li>
          <li>Participant lists are saved for your next visit</li>
          <li>Use share feature to send team assignments</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What if the number of people does not divide evenly?',
            answer: 'Using round-robin distribution, one person is assigned at a time in order. Some teams may have one more member. For example, 7 people into 3 teams results in two teams of 3 and one team of 2.',
          },
          {
            question: 'What if I do not like the team assignments?',
            answer: 'Click the "Reshuffle" button to generate a new random combination. You can try as many times as needed until you get satisfactory results.',
          },
          {
            question: 'Can I change team names?',
            answer: 'Yes! Click on the team name in the results to edit it directly. Change "Team 1" to "Red Team", "Tigers", or any name you prefer.',
          },
        ]}
      />
    </div>
  );
}
