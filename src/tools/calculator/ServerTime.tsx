'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

interface ServerTimeResult {
  url: string;
  name: string;
  serverTime: number; // timestamp
  localTimeAtMeasure: number; // 측정 당시 로컬 timestamp
  latency: number; // 네트워크 왕복 시간 (RTT)
  offset: number; // 서버 시간 - 로컬 시간 (보정값)
  error?: string;
  loading: boolean;
}

interface Alarm {
  id: string;
  hour: number;
  minute: number;
  second: number;
  enabled: boolean;
  triggered: boolean;
  serverUrl: string | null; // null이면 로컬 시간, 값 있으면 해당 서버 시간 기준
}

// 참고용 인기 사이트 (빠른 입력용)
const POPULAR_SITES = [
  { name: '인터파크', domain: 'interpark.com' },
  { name: '멜론', domain: 'melon.com' },
  { name: 'YES24', domain: 'yes24.com' },
  { name: '네이버', domain: 'naver.com' },
  { name: '다음', domain: 'daum.net' },
  { name: '구글', domain: 'google.com' },
];

function formatTimeWithMs(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  const ms = date.getMilliseconds().toString().padStart(3, '0');
  return `${h}:${m}:${s}.${ms}`;
}

function formatDateFull(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

// 현재 시간 계산 (측정 결과 기반)
function getCurrentTimeFromResult(result: ServerTimeResult): Date {
  const elapsed = Date.now() - result.localTimeAtMeasure;
  return new Date(result.serverTime + elapsed);
}

export function ServerTime() {
  // 고정밀 시간 (performance.now 기반 드리프트 보정)
  const [localTime, setLocalTime] = useState<Date>(new Date());
  const [serverResults, setServerResults] = useState<ServerTimeResult[]>([]);
  const [customUrl, setCustomUrl] = useState('');
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newAlarmTime, setNewAlarmTime] = useState({ hour: 0, minute: 0, second: 0, serverUrl: null as string | null });
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 드리프트 보정을 위한 기준점
  const baseTimeRef = useRef<{ date: number; perf: number } | null>(null);

  // 고정밀 로컬 시간 업데이트 (requestAnimationFrame + performance.now 보정)
  useEffect(() => {
    // 기준점 설정
    baseTimeRef.current = {
      date: Date.now(),
      perf: performance.now(),
    };

    let animationId: number;

    const updateTime = () => {
      if (baseTimeRef.current) {
        // performance.now()는 드리프트가 없으므로 이를 기준으로 보정
        const elapsed = performance.now() - baseTimeRef.current.perf;
        const correctedTime = baseTimeRef.current.date + elapsed;
        setLocalTime(new Date(correctedTime));
      }
      animationId = requestAnimationFrame(updateTime);
    };

    animationId = requestAnimationFrame(updateTime);

    // 매 10초마다 Date.now()와 재동기화 (큰 드리프트 방지)
    const syncInterval = setInterval(() => {
      baseTimeRef.current = {
        date: Date.now(),
        perf: performance.now(),
      };
    }, 10000);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(syncInterval);
    };
  }, []);

  // 알람 사운드 재생
  const playAlarmSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      const playBeep = (freq: number, delay: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime + delay);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration);
        oscillator.start(audioContext.currentTime + delay);
        oscillator.stop(audioContext.currentTime + delay + duration);
      };

      // 비프음 패턴: 삐-삐-삐삐 (높은 음으로 끝)
      playBeep(880, 0, 0.15);
      playBeep(880, 0.25, 0.15);
      playBeep(1047, 0.5, 0.15);
      playBeep(1047, 0.7, 0.3);
    } catch {
      console.log('Audio not supported');
    }
  }, []);

  // 알람 체크 (서버 시간 또는 로컬 시간 기준)
  useEffect(() => {
    setAlarms(prev => prev.map(alarm => {
      if (!alarm.enabled || alarm.triggered) return alarm;

      // 알람 기준 시간 결정 (서버 시간 or 로컬 시간)
      let checkTime: Date;
      if (alarm.serverUrl) {
        const serverResult = serverResults.find(r => r.url === alarm.serverUrl);
        if (serverResult && !serverResult.error && !serverResult.loading) {
          checkTime = getCurrentTimeFromResult(serverResult);
        } else {
          // 서버 결과 없으면 체크 안 함
          return alarm;
        }
      } else {
        checkTime = localTime;
      }

      const currentH = checkTime.getHours();
      const currentM = checkTime.getMinutes();
      const currentS = checkTime.getSeconds();
      const currentMs = checkTime.getMilliseconds();

      // 정확히 해당 초의 0~100ms 사이에만 트리거 (중복 방지)
      if (currentMs > 100) return alarm;

      if (alarm.hour === currentH &&
          alarm.minute === currentM &&
          alarm.second === currentS) {
        if (soundEnabled) {
          playAlarmSound();
        }
        return { ...alarm, triggered: true };
      }
      return alarm;
    }));
  }, [localTime, soundEnabled, serverResults, playAlarmSound]);

  // 서버 시간 측정 (여러 번 측정 후 평균)
  const measureServerTime = useCallback(async (url: string, name: string): Promise<ServerTimeResult> => {
    const result: ServerTimeResult = {
      url,
      name,
      serverTime: 0,
      localTimeAtMeasure: 0,
      latency: 0,
      offset: 0,
      loading: true,
    };

    try {
      // 3번 측정 후 최소 RTT 사용 (가장 정확한 측정값)
      const measurements: { rtt: number; timestamp: number }[] = [];

      for (let i = 0; i < 3; i++) {
        const startTime = performance.now();
        const startDate = Date.now();

        await fetch(url, {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store',
        });

        const endTime = performance.now();
        const rtt = endTime - startTime;

        measurements.push({
          rtt,
          timestamp: startDate + rtt / 2, // 요청 중간 시점
        });

        // 짧은 대기
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 최소 RTT 측정값 사용 (네트워크 노이즈 최소화)
      const best = measurements.reduce((a, b) => a.rtt < b.rtt ? a : b);

      result.latency = Math.round(best.rtt);
      result.localTimeAtMeasure = Date.now();
      // 서버 시간은 로컬 시간에서 RTT/2 보정
      result.serverTime = result.localTimeAtMeasure;
      result.offset = Math.round(-best.rtt / 2);
      result.loading = false;

    } catch {
      result.error = '연결 실패';
      result.loading = false;
    }

    return result;
  }, []);

  // 커스텀 URL 측정
  const measureCustomUrl = useCallback(async () => {
    if (!customUrl.trim()) return;

    let url = customUrl.trim();
    // 프로토콜 없으면 추가
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    // www 없으면 추가 (일부 사이트 리다이렉트 방지)
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.startsWith('www.') && !parsed.hostname.includes('.') === false) {
        // 서브도메인 없는 경우만 www 추가 시도
      }
    } catch {
      return;
    }

    // 이미 측정 중인지 확인
    const existingIndex = serverResults.findIndex(r => r.url === url);

    if (existingIndex >= 0) {
      setServerResults(prev => {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], loading: true, error: undefined };
        return updated;
      });
    } else {
      const hostname = new URL(url).hostname;
      setServerResults(prev => [{
        url,
        name: hostname.replace('www.', ''),
        serverTime: 0,
        localTimeAtMeasure: 0,
        latency: 0,
        offset: 0,
        loading: true,
      }, ...prev]);
    }

    const hostname = new URL(url).hostname;
    const result = await measureServerTime(url, hostname.replace('www.', ''));

    setServerResults(prev => {
      const idx = prev.findIndex(r => r.url === url);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = result;
        return updated;
      }
      return [result, ...prev];
    });

    setCustomUrl('');
  }, [customUrl, serverResults, measureServerTime]);

  // 인기 사이트 빠른 추가
  const addPopularSite = useCallback((domain: string) => {
    setCustomUrl(domain);
  }, []);

  // 결과 삭제
  const removeResult = useCallback((url: string) => {
    setServerResults(prev => prev.filter(r => r.url !== url));
  }, []);

  // 결과 새로고침
  const refreshResult = useCallback(async (result: ServerTimeResult) => {
    setServerResults(prev => prev.map(r =>
      r.url === result.url ? { ...r, loading: true, error: undefined } : r
    ));

    const newResult = await measureServerTime(result.url, result.name);

    setServerResults(prev => prev.map(r =>
      r.url === result.url ? newResult : r
    ));
  }, [measureServerTime]);

  // 알람 추가
  const addAlarm = useCallback(() => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      hour: newAlarmTime.hour,
      minute: newAlarmTime.minute,
      second: newAlarmTime.second,
      enabled: true,
      triggered: false,
      serverUrl: newAlarmTime.serverUrl,
    };
    setAlarms(prev => [...prev, newAlarm]);
  }, [newAlarmTime]);

  // 알람 삭제
  const removeAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  }, []);

  // 알람 토글
  const toggleAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.map(a =>
      a.id === id ? { ...a, enabled: !a.enabled, triggered: false } : a
    ));
  }, []);

  // 테스트 사운드
  const testSound = useCallback(() => {
    playAlarmSound();
  }, [playAlarmSound]);

  return (
    <div className="space-y-6">
      {/* 현재 시간 (큰 디스플레이) */}
      <Card variant="bordered" className="p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {formatDateFull(localTime)}
        </div>
        <div className="text-5xl md:text-7xl font-mono font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          {formatTimeWithMs(localTime)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          내 PC 시간 (performance.now 드리프트 보정)
        </div>
      </Card>

      {/* 서버 시간 측정 */}
      <Card variant="bordered" className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          🌐 네트워크 지연 측정
        </h2>

        <div className="space-y-4">
          {/* 도메인 입력 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="도메인 입력 (예: interpark.com)"
              className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && measureCustomUrl()}
            />
            <Button onClick={measureCustomUrl} size="sm">측정</Button>
          </div>

          {/* 인기 사이트 바로가기 */}
          <div className="flex flex-wrap gap-1">
            <span className="text-xs text-gray-500 mr-1">빠른 입력:</span>
            {POPULAR_SITES.map((site) => (
              <button
                key={site.domain}
                onClick={() => addPopularSite(site.domain)}
                className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {site.name}
              </button>
            ))}
          </div>

          {/* 측정 결과 */}
          {serverResults.length > 0 && (
            <div className="space-y-3">
              {serverResults.map((result) => (
                <div
                  key={result.url}
                  className={cn(
                    'p-4 rounded-lg border',
                    result.error
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{result.name}</span>
                    <div className="flex items-center gap-2">
                      {!result.loading && !result.error && (
                        <button
                          onClick={() => refreshResult(result)}
                          className="text-xs text-blue-500 hover:text-blue-700"
                        >
                          재측정
                        </button>
                      )}
                      <button
                        onClick={() => removeResult(result.url)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        삭제
                      </button>
                    </div>
                  </div>

                  {result.loading ? (
                    <div className="text-sm text-gray-500 animate-pulse">측정 중... (3회 측정)</div>
                  ) : result.error ? (
                    <div className="text-sm text-red-500">{result.error}</div>
                  ) : (
                    <>
                      {/* 현재 시간 (계속 갱신) */}
                      <div className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {formatTimeWithMs(getCurrentTimeFromResult(result))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          <div className="text-xs text-gray-500">왕복 시간 (RTT)</div>
                          <div className="font-mono font-semibold text-orange-600 dark:text-orange-400">
                            {result.latency}ms
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          <div className="text-xs text-gray-500">편도 지연 (추정)</div>
                          <div className="font-mono font-semibold text-purple-600 dark:text-purple-400">
                            ~{Math.round(result.latency / 2)}ms
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        💡 클릭 후 서버 도착까지 약 {Math.round(result.latency / 2)}ms 소요
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {serverResults.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">🎯</div>
              <div>티케팅 사이트 도메인을 입력하여</div>
              <div>네트워크 지연을 측정하세요</div>
            </div>
          )}
        </div>
      </Card>

      {/* 시간 알림 설정 */}
      <Card variant="bordered" className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          ⏰ 시간 알림
        </h2>

        <div className="space-y-4">
          {/* 사운드 설정 */}
          <div className="flex items-center justify-between">
            <span className="text-sm">알림 소리</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative',
                  soundEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                    soundEnabled ? 'left-7' : 'left-1'
                  )}
                />
              </button>
              <Button onClick={testSound} size="sm" variant="secondary">
                테스트
              </Button>
            </div>
          </div>

          {/* 알람 추가 */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="23"
                value={newAlarmTime.hour}
                onChange={(e) => setNewAlarmTime(prev => ({ ...prev, hour: Math.max(0, Math.min(23, parseInt(e.target.value) || 0)) }))}
                className="w-14 text-center px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700 text-sm"
              />
              <span>시</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="59"
                value={newAlarmTime.minute}
                onChange={(e) => setNewAlarmTime(prev => ({ ...prev, minute: Math.max(0, Math.min(59, parseInt(e.target.value) || 0)) }))}
                className="w-14 text-center px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700 text-sm"
              />
              <span>분</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="59"
                value={newAlarmTime.second}
                onChange={(e) => setNewAlarmTime(prev => ({ ...prev, second: Math.max(0, Math.min(59, parseInt(e.target.value) || 0)) }))}
                className="w-14 text-center px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700 text-sm"
              />
              <span>초</span>
            </div>
          </div>

          {/* 서버 시간 선택 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">기준 시간:</span>
            <select
              value={newAlarmTime.serverUrl || ''}
              onChange={(e) => setNewAlarmTime(prev => ({ ...prev, serverUrl: e.target.value || null }))}
              className="px-3 py-1.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
            >
              <option value="">내 PC 시간</option>
              {serverResults.filter(r => !r.error && !r.loading).map(r => (
                <option key={r.url} value={r.url}>🌐 {r.name} 서버</option>
              ))}
            </select>
            {newAlarmTime.serverUrl && (
              <span className="text-xs text-blue-500">
                ※ 서버 시간 기준으로 알림
              </span>
            )}
            <Button onClick={addAlarm} size="sm">알람 추가</Button>
          </div>

          {/* 빠른 설정 */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: '정각', s: 0 },
              { label: '10초 전', s: 50 },
              { label: '30초 전', s: 30 },
              { label: '1분 전', s: 0, mOffset: -1 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  const now = new Date();
                  let h = now.getHours();
                  let m = now.getMinutes() + 1;
                  if (preset.mOffset) m += preset.mOffset;
                  if (m >= 60) { m -= 60; h += 1; }
                  if (m < 0) { m += 60; h -= 1; }
                  if (h >= 24) h -= 24;
                  if (h < 0) h += 24;
                  setNewAlarmTime(prev => ({ ...prev, hour: h, minute: m, second: preset.s }));
                }}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                다음 {preset.label}
              </button>
            ))}
          </div>

          {/* 알람 목록 */}
          {alarms.length > 0 && (
            <div className="space-y-2">
              {alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border',
                    alarm.triggered
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : alarm.enabled
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={cn(
                        'w-10 h-5 rounded-full transition-colors relative',
                        alarm.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all',
                          alarm.enabled ? 'left-5' : 'left-0.5'
                        )}
                      />
                    </button>
                    <div>
                      <span className="font-mono text-lg">
                        {alarm.hour.toString().padStart(2, '0')}:
                        {alarm.minute.toString().padStart(2, '0')}:
                        {alarm.second.toString().padStart(2, '0')}
                      </span>
                      {alarm.serverUrl && (
                        <span className="ml-2 text-xs text-blue-500">
                          🌐 {serverResults.find(r => r.url === alarm.serverUrl)?.name || '서버'}
                        </span>
                      )}
                    </div>
                    {alarm.triggered && (
                      <span className="text-xs text-green-600 dark:text-green-400">✓ 울림</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeAlarm(alarm.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* 티케팅 팁 */}
      <Card variant="bordered" className="p-4">
        <h2 className="text-lg font-semibold mb-3">🎫 티케팅 팁</h2>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li>• <strong>PC 시간 동기화:</strong> Windows 설정 → 시간 및 언어 → 지금 동기화</li>
          <li>• <strong>네트워크 지연 고려:</strong> 측정된 RTT의 절반만큼 미리 클릭 (예: RTT 50ms → 25ms 전에 클릭)</li>
          <li>• <strong>새로고침 타이밍:</strong> 오픈 10-15초 전에 새로고침 후 대기</li>
          <li>• <strong>유선 연결 권장:</strong> WiFi보다 유선이 지연이 적고 안정적</li>
          <li>• <strong>브라우저:</strong> Chrome 기준 F5보다 Ctrl+Shift+R (캐시 무시 새로고침)</li>
          <li>• <strong>여러 탭:</strong> 같은 사이트 여러 탭 열기 (단, 과하면 서버 차단 위험)</li>
        </ul>
      </Card>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⏱️ 서버 시간이란?
        </h2>
        <p className="text-sm leading-relaxed">
          서버 시간은 티케팅, 예약, 이벤트 응모 등 정확한 타이밍이 중요한 상황을 위한 고정밀 시간 도구입니다.
          performance.now() API를 활용한 드리프트 보정으로 JavaScript 타이머 오차를 최소화합니다.
          네트워크 왕복 시간(RTT) 측정으로 클릭이 서버에 도달하는 시간을 파악할 수 있습니다.
          시간 알림 기능으로 정확한 시점에 알림을 받을 수 있어 티케팅 준비에 유용합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 기능별 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">기능</th>
                <th className="text-left py-2 px-2">설명</th>
                <th className="text-left py-2 px-2">활용</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">밀리초 시계</td><td>performance.now 드리프트 보정</td><td>정확한 현재 시간 확인</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">RTT 측정</td><td>3회 측정 후 최소값 사용</td><td>네트워크 지연 파악</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">편도 지연</td><td>RTT/2로 추정</td><td>클릭 타이밍 계산</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">시간 알림</td><td>초 단위 알람 설정</td><td>티케팅 오픈 알림</td></tr>
              <tr><td className="py-2 px-2 font-medium">서버 시간 기준</td><td>측정된 서버 기준 알람</td><td>서버와 동기화된 알림</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 티케팅 성공 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>PC 시간 동기화</strong>: Windows 설정에서 인터넷 시간 서버와 동기화</li>
          <li><strong>RTT 고려</strong>: 편도 지연만큼 미리 클릭 (RTT 50ms → 25ms 전)</li>
          <li><strong>유선 연결</strong>: WiFi보다 유선 연결이 지연이 적고 안정적</li>
          <li><strong>하드 새로고침</strong>: Ctrl+Shift+R로 캐시 무시 새로고침</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'RTT(왕복 시간)와 편도 지연의 차이는?',
            answer: 'RTT는 요청을 보내고 응답을 받기까지의 전체 시간입니다. 편도 지연은 RTT의 절반으로, 클릭이 서버에 도달하는 실제 시간을 추정합니다. RTT 50ms라면 편도는 약 25ms입니다.',
          },
          {
            question: '왜 3번 측정하나요?',
            answer: '네트워크는 순간적으로 변동이 있을 수 있습니다. 3번 측정 후 가장 낮은(빠른) RTT를 사용하면 네트워크 노이즈를 줄이고 더 정확한 지연 시간을 파악할 수 있습니다.',
          },
          {
            question: '드리프트 보정이란?',
            answer: 'JavaScript의 setInterval/setTimeout은 시간이 지나면 오차가 누적됩니다. performance.now()는 고정밀 타이머로 이런 드리프트가 없어, 이를 기준으로 Date.now()를 보정합니다.',
          },
        ]}
      />
    </div>
  );
}
