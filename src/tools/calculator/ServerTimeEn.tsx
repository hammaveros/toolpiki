'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

interface ServerTimeResult {
  url: string;
  name: string;
  serverTime: number;
  localTimeAtMeasure: number;
  latency: number;
  offset: number;
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
  serverUrl: string | null;
}

const POPULAR_SITES = [
  { name: 'Ticketmaster', domain: 'ticketmaster.com' },
  { name: 'StubHub', domain: 'stubhub.com' },
  { name: 'Google', domain: 'google.com' },
  { name: 'Amazon', domain: 'amazon.com' },
  { name: 'Eventbrite', domain: 'eventbrite.com' },
  { name: 'AXS', domain: 'axs.com' },
];

function formatTimeWithMs(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  const ms = date.getMilliseconds().toString().padStart(3, '0');
  return `${h}:${m}:${s}.${ms}`;
}

function formatDateFull(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

function getCurrentTimeFromResult(result: ServerTimeResult): Date {
  const elapsed = Date.now() - result.localTimeAtMeasure;
  return new Date(result.serverTime + elapsed);
}

export function ServerTimeEn() {
  const [localTime, setLocalTime] = useState<Date>(new Date());
  const [serverResults, setServerResults] = useState<ServerTimeResult[]>([]);
  const [customUrl, setCustomUrl] = useState('');
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newAlarmTime, setNewAlarmTime] = useState({ hour: 0, minute: 0, second: 0, serverUrl: null as string | null });
  const [soundEnabled, setSoundEnabled] = useState(true);

  const baseTimeRef = useRef<{ date: number; perf: number } | null>(null);

  useEffect(() => {
    baseTimeRef.current = {
      date: Date.now(),
      perf: performance.now(),
    };

    let animationId: number;

    const updateTime = () => {
      if (baseTimeRef.current) {
        const elapsed = performance.now() - baseTimeRef.current.perf;
        const correctedTime = baseTimeRef.current.date + elapsed;
        setLocalTime(new Date(correctedTime));
      }
      animationId = requestAnimationFrame(updateTime);
    };

    animationId = requestAnimationFrame(updateTime);

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

      playBeep(880, 0, 0.15);
      playBeep(880, 0.25, 0.15);
      playBeep(1047, 0.5, 0.15);
      playBeep(1047, 0.7, 0.3);
    } catch {
      console.log('Audio not supported');
    }
  }, []);

  // Alarm check (server time or local time based)
  useEffect(() => {
    setAlarms(prev => prev.map(alarm => {
      if (!alarm.enabled || alarm.triggered) return alarm;

      // Determine which time to check (server time or local time)
      let checkTime: Date;
      if (alarm.serverUrl) {
        const serverResult = serverResults.find(r => r.url === alarm.serverUrl);
        if (serverResult && !serverResult.error && !serverResult.loading) {
          checkTime = getCurrentTimeFromResult(serverResult);
        } else {
          // No server result, skip check
          return alarm;
        }
      } else {
        checkTime = localTime;
      }

      const currentH = checkTime.getHours();
      const currentM = checkTime.getMinutes();
      const currentS = checkTime.getSeconds();
      const currentMs = checkTime.getMilliseconds();

      // Only trigger in 0~100ms of the target second (prevent duplicates)
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
          timestamp: startDate + rtt / 2,
        });

        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const best = measurements.reduce((a, b) => a.rtt < b.rtt ? a : b);

      result.latency = Math.round(best.rtt);
      result.localTimeAtMeasure = Date.now();
      result.serverTime = result.localTimeAtMeasure;
      result.offset = Math.round(-best.rtt / 2);
      result.loading = false;

    } catch {
      result.error = 'Connection failed';
      result.loading = false;
    }

    return result;
  }, []);

  const measureCustomUrl = useCallback(async () => {
    if (!customUrl.trim()) return;

    let url = customUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      new URL(url);
    } catch {
      return;
    }

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

  const addPopularSite = useCallback((domain: string) => {
    setCustomUrl(domain);
  }, []);

  const removeResult = useCallback((url: string) => {
    setServerResults(prev => prev.filter(r => r.url !== url));
  }, []);

  const refreshResult = useCallback(async (result: ServerTimeResult) => {
    setServerResults(prev => prev.map(r =>
      r.url === result.url ? { ...r, loading: true, error: undefined } : r
    ));

    const newResult = await measureServerTime(result.url, result.name);

    setServerResults(prev => prev.map(r =>
      r.url === result.url ? newResult : r
    ));
  }, [measureServerTime]);

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

  const removeAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  }, []);

  const toggleAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.map(a =>
      a.id === id ? { ...a, enabled: !a.enabled, triggered: false } : a
    ));
  }, []);

  const testSound = useCallback(() => {
    playAlarmSound();
  }, [playAlarmSound]);

  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <Card variant="bordered" className="p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {formatDateFull(localTime)}
        </div>
        <div className="text-5xl md:text-7xl font-mono font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          {formatTimeWithMs(localTime)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Your PC Time (drift-corrected with performance.now)
        </div>
      </Card>

      {/* Network Latency Measurement */}
      <Card variant="bordered" className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          Network Latency Measurement
        </h2>

        <div className="space-y-4">
          {/* Domain Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Enter domain (e.g., ticketmaster.com)"
              className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && measureCustomUrl()}
            />
            <Button onClick={measureCustomUrl} size="sm">Measure</Button>
          </div>

          {/* Quick Sites */}
          <div className="flex flex-wrap gap-1">
            <span className="text-xs text-gray-500 mr-1">Quick:</span>
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

          {/* Results */}
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
                          Remeasure
                        </button>
                      )}
                      <button
                        onClick={() => removeResult(result.url)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {result.loading ? (
                    <div className="text-sm text-gray-500 animate-pulse">Measuring... (3 samples)</div>
                  ) : result.error ? (
                    <div className="text-sm text-red-500">{result.error}</div>
                  ) : (
                    <>
                      <div className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {formatTimeWithMs(getCurrentTimeFromResult(result))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          <div className="text-xs text-gray-500">Round Trip Time (RTT)</div>
                          <div className="font-mono font-semibold text-orange-600 dark:text-orange-400">
                            {result.latency}ms
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          <div className="text-xs text-gray-500">One-way Latency (est.)</div>
                          <div className="font-mono font-semibold text-purple-600 dark:text-purple-400">
                            ~{Math.round(result.latency / 2)}ms
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        Your click reaches server in ~{Math.round(result.latency / 2)}ms
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
              <div>Enter a ticketing site domain</div>
              <div>to measure network latency</div>
            </div>
          )}
        </div>
      </Card>

      {/* Time Alarm */}
      <Card variant="bordered" className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          ⏰ Time Alarm
        </h2>

        <div className="space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Alarm Sound</span>
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
                Test
              </Button>
            </div>
          </div>

          {/* Alarm Input */}
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
              <span>h</span>
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
              <span>m</span>
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
              <span>s</span>
            </div>
          </div>

          {/* Server Time Selection */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">Time source:</span>
            <select
              value={newAlarmTime.serverUrl || ''}
              onChange={(e) => setNewAlarmTime(prev => ({ ...prev, serverUrl: e.target.value || null }))}
              className="px-3 py-1.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
            >
              <option value="">My PC Time</option>
              {serverResults.filter(r => !r.error && !r.loading).map(r => (
                <option key={r.url} value={r.url}>🌐 {r.name} Server</option>
              ))}
            </select>
            {newAlarmTime.serverUrl && (
              <span className="text-xs text-blue-500">
                ※ Alarm based on server time
              </span>
            )}
            <Button onClick={addAlarm} size="sm">Add Alarm</Button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'On the hour', s: 0 },
              { label: '10s before', s: 50 },
              { label: '30s before', s: 30 },
              { label: '1m before', s: 0, mOffset: -1 },
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
                Next {preset.label}
              </button>
            ))}
          </div>

          {/* Alarm List */}
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
                          🌐 {serverResults.find(r => r.url === alarm.serverUrl)?.name || 'Server'}
                        </span>
                      )}
                    </div>
                    {alarm.triggered && (
                      <span className="text-xs text-green-600 dark:text-green-400">Triggered</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeAlarm(alarm.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Ticketing Tips */}
      <Card variant="bordered" className="p-4">
        <h2 className="text-lg font-semibold mb-3">Ticketing Tips</h2>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li><strong>Sync PC Time:</strong> Windows Settings &rarr; Time & Language &rarr; Sync now</li>
          <li><strong>Consider Latency:</strong> Click RTT/2 milliseconds early (e.g., RTT 50ms = click 25ms early)</li>
          <li><strong>Refresh Timing:</strong> Refresh 10-15 seconds before sale opens</li>
          <li><strong>Wired Connection:</strong> Ethernet is more stable than WiFi</li>
          <li><strong>Browser:</strong> Use Ctrl+Shift+R for hard refresh (bypasses cache)</li>
          <li><strong>Multiple Tabs:</strong> Open multiple tabs (but not too many to avoid IP blocking)</li>
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
          ⏱️ What is Server Time?
        </h2>
        <p className="text-sm leading-relaxed">
          Server Time is a precision timing tool for ticketing, reservations, and time-sensitive events.
          Uses performance.now() API with drift correction to minimize JavaScript timer inaccuracies.
          Measures network round-trip time (RTT) to help you understand when your clicks reach the server.
          Time alarm feature lets you set notifications for exact moments, perfect for ticketing preparation.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Feature Comparison
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Feature</th>
                <th className="text-left py-2 px-2">Description</th>
                <th className="text-left py-2 px-2">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Millisecond Clock</td><td>Drift-corrected via performance.now</td><td>Accurate current time</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">RTT Measurement</td><td>3 samples, uses minimum</td><td>Network latency analysis</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">One-way Latency</td><td>Estimated as RTT/2</td><td>Click timing calculation</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Time Alarm</td><td>Second-precision alerts</td><td>Ticket sale notifications</td></tr>
              <tr><td className="py-2 px-2 font-medium">Server Time Sync</td><td>Alarms based on measured server</td><td>Synchronized alerts</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Ticketing Success Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Sync PC time</strong>: Synchronize with internet time server in Windows settings</li>
          <li><strong>Account for RTT</strong>: Click early by one-way latency (RTT 50ms = 25ms early)</li>
          <li><strong>Wired connection</strong>: Ethernet is more stable with lower latency than WiFi</li>
          <li><strong>Hard refresh</strong>: Use Ctrl+Shift+R to bypass browser cache</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What is the difference between RTT and one-way latency?',
            answer: 'RTT (Round Trip Time) is the total time to send a request and receive a response. One-way latency is half of RTT, estimating how long your click takes to reach the server. If RTT is 50ms, one-way is approximately 25ms.',
          },
          {
            question: 'Why measure 3 times?',
            answer: 'Network conditions can fluctuate momentarily. By taking 3 measurements and using the lowest (fastest) RTT, we reduce network noise and get a more accurate latency measurement.',
          },
          {
            question: 'What is drift correction?',
            answer: 'JavaScript\'s setInterval/setTimeout accumulate timing errors over time. performance.now() is a high-precision timer without this drift, so we use it as a reference to correct Date.now() values.',
          },
        ]}
      />
    </div>
  );
}
