'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

type TestState = 'idle' | 'testing' | 'complete';
type TestPhase = 'download' | 'upload' | 'ping';

interface TestResult {
  download: number; // Mbps
  upload: number; // Mbps
  ping: number; // ms
  jitter: number; // ms
}

const TEST_DOWNLOAD_URL = 'https://speed.cloudflare.com/__down?bytes=';
const TEST_UPLOAD_URL = 'https://speed.cloudflare.com/__up';

export function SpeedTestEn() {
  const [state, setState] = useState<TestState>('idle');
  const [phase, setPhase] = useState<TestPhase>('ping');
  const [progress, setProgress] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const [history, setHistory] = useState<TestResult[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const testPing = useCallback(async (): Promise<{ ping: number; jitter: number }> => {
    const pings: number[] = [];
    const testCount = 5;

    for (let i = 0; i < testCount; i++) {
      const start = performance.now();
      try {
        await fetch(`${TEST_DOWNLOAD_URL}1`, {
          cache: 'no-store',
          signal: abortControllerRef.current?.signal,
        });
        const end = performance.now();
        pings.push(end - start);
      } catch {
        // Ignore errors
      }
      setProgress((i + 1) / testCount * 30);
    }

    if (pings.length === 0) return { ping: 0, jitter: 0 };

    const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length;
    const jitter = pings.length > 1
      ? Math.sqrt(pings.map(p => Math.pow(p - avgPing, 2)).reduce((a, b) => a + b, 0) / pings.length)
      : 0;

    return { ping: Math.round(avgPing), jitter: Math.round(jitter) };
  }, []);

  const testDownload = useCallback(async (): Promise<number> => {
    const testSizes = [100000, 500000, 1000000, 5000000];
    let totalBytes = 0;
    let totalTime = 0;

    for (let i = 0; i < testSizes.length; i++) {
      const size = testSizes[i];
      const start = performance.now();

      try {
        const response = await fetch(`${TEST_DOWNLOAD_URL}${size}`, {
          cache: 'no-store',
          signal: abortControllerRef.current?.signal,
        });
        const blob = await response.blob();
        const end = performance.now();

        totalBytes += blob.size;
        totalTime += (end - start) / 1000;

        const currentMbps = (totalBytes * 8) / (totalTime * 1000000);
        setCurrentSpeed(currentMbps);
      } catch {
        // Ignore errors
      }

      setProgress(30 + ((i + 1) / testSizes.length * 35));
    }

    if (totalTime === 0) return 0;
    return (totalBytes * 8) / (totalTime * 1000000);
  }, []);

  const testUpload = useCallback(async (): Promise<number> => {
    const testSizes = [100000, 500000, 1000000];
    let totalBytes = 0;
    let totalTime = 0;

    for (let i = 0; i < testSizes.length; i++) {
      const size = testSizes[i];
      const data = new Blob([new ArrayBuffer(size)]);
      const start = performance.now();

      try {
        await fetch(TEST_UPLOAD_URL, {
          method: 'POST',
          body: data,
          signal: abortControllerRef.current?.signal,
        });
        const end = performance.now();

        totalBytes += size;
        totalTime += (end - start) / 1000;

        const currentMbps = (totalBytes * 8) / (totalTime * 1000000);
        setCurrentSpeed(currentMbps);
      } catch {
        // Ignore errors
      }

      setProgress(65 + ((i + 1) / testSizes.length * 35));
    }

    if (totalTime === 0) return 0;
    return (totalBytes * 8) / (totalTime * 1000000);
  }, []);

  const runTest = useCallback(async () => {
    abortControllerRef.current = new AbortController();
    setState('testing');
    setProgress(0);
    setCurrentSpeed(0);
    setResult(null);

    try {
      setPhase('ping');
      const { ping, jitter } = await testPing();

      setPhase('download');
      const download = await testDownload();

      setPhase('upload');
      const upload = await testUpload();

      const newResult: TestResult = {
        download: Math.round(download * 100) / 100,
        upload: Math.round(upload * 100) / 100,
        ping,
        jitter,
      };

      setResult(newResult);
      setHistory(prev => [newResult, ...prev.slice(0, 4)]);
      setState('complete');
    } catch {
      setState('idle');
    }
  }, [testPing, testDownload, testUpload]);

  const stopTest = useCallback(() => {
    abortControllerRef.current?.abort();
    setState('idle');
    setProgress(0);
    setCurrentSpeed(0);
  }, []);

  const getSpeedGrade = (download: number): { grade: string; color: string; description: string } => {
    if (download >= 100) return { grade: 'Excellent', color: 'text-green-500', description: 'Perfect for 4K streaming and large downloads' };
    if (download >= 50) return { grade: 'Great', color: 'text-blue-500', description: 'Great for HD streaming and video calls' };
    if (download >= 25) return { grade: 'Good', color: 'text-cyan-500', description: 'Good for streaming and gaming' };
    if (download >= 10) return { grade: 'Fair', color: 'text-yellow-500', description: 'Suitable for web browsing and SD streaming' };
    if (download >= 5) return { grade: 'Slow', color: 'text-orange-500', description: 'Basic web usage only' };
    return { grade: 'Poor', color: 'text-red-500', description: 'Slow connection, improvement needed' };
  };

  const phaseLabels: Record<TestPhase, string> = {
    ping: 'Measuring latency...',
    download: 'Testing download speed...',
    upload: 'Testing upload speed...',
  };

  return (
    <div className="space-y-4">
      <Card variant="bordered" className="p-6">
        {/* Main speedometer */}
        <div className="text-center mb-6">
          <div className="relative w-48 h-48 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.83} 283`}
                className={cn(
                  'transition-all duration-300',
                  phase === 'ping' && 'text-purple-500',
                  phase === 'download' && 'text-blue-500',
                  phase === 'upload' && 'text-green-500',
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {state === 'testing' ? (
                <>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentSpeed.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">Mbps</span>
                </>
              ) : result ? (
                <>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {result.download}
                  </span>
                  <span className="text-sm text-gray-500">Mbps</span>
                </>
              ) : (
                <span className="text-gray-400 dark:text-gray-500">Start</span>
              )}
            </div>
          </div>

          {state === 'testing' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {phaseLabels[phase]}
            </p>
          )}

          {state === 'idle' && (
            <Button onClick={runTest} size="lg">
              Start Speed Test
            </Button>
          )}
          {state === 'testing' && (
            <Button onClick={stopTest} variant="secondary" size="lg">
              Stop Test
            </Button>
          )}
          {state === 'complete' && (
            <Button onClick={runTest} size="lg">
              Test Again
            </Button>
          )}
        </div>

        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.download}
                </div>
                <div className="text-xs text-gray-500">Download (Mbps)</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {result.upload}
                </div>
                <div className="text-xs text-gray-500">Upload (Mbps)</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {result.ping}
                </div>
                <div className="text-xs text-gray-500">Ping (ms)</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {result.jitter}
                </div>
                <div className="text-xs text-gray-500">Jitter (ms)</div>
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className={cn('text-lg font-bold', getSpeedGrade(result.download).color)}>
                Speed Rating: {getSpeedGrade(result.download).grade}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {getSpeedGrade(result.download).description}
              </p>
            </div>
          </div>
        )}
      </Card>

      {history.length > 0 && (
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Test History
          </h3>
          <div className="space-y-2">
            {history.map((h, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-800/50 rounded"
              >
                <span className="text-gray-500">#{history.length - idx}</span>
                <span>↓ {h.download} Mbps</span>
                <span>↑ {h.upload} Mbps</span>
                <span>{h.ping} ms</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Metric Definitions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <strong className="text-blue-600 dark:text-blue-400">Download Speed</strong>
            <p>How fast you receive data. Affects streaming and downloads.</p>
          </div>
          <div>
            <strong className="text-green-600 dark:text-green-400">Upload Speed</strong>
            <p>How fast you send data. Affects video calls and uploads.</p>
          </div>
          <div>
            <strong className="text-purple-600 dark:text-purple-400">Ping</strong>
            <p>Server response time. Lower is better for gaming and calls.</p>
          </div>
          <div>
            <strong className="text-orange-600 dark:text-orange-400">Jitter</strong>
            <p>Ping variation. Lower means more stable connection.</p>
          </div>
        </div>
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
          📶 What is Internet Speed Test?
        </h2>
        <p className="text-sm leading-relaxed">
          Internet Speed Test measures your connection's download speed, upload speed, and latency (ping).
          Uses Cloudflare's global edge servers for accurate measurements.
          Tests with various file sizes (100KB-5MB) to provide results close to real-world usage.
          Check if your speed is suitable for gaming, streaming, or video calls.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Recommended Speeds by Usage
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Usage</th>
                <th className="text-left py-2 px-2">Download</th>
                <th className="text-left py-2 px-2">Ping</th>
                <th className="text-left py-2 px-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Web Browsing</td><td className="font-mono">5+ Mbps</td><td>Under 100ms</td><td>General use</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HD Streaming</td><td className="font-mono">25+ Mbps</td><td>Under 50ms</td><td>Netflix 1080p</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">4K Streaming</td><td className="font-mono">50+ Mbps</td><td>Under 50ms</td><td>YouTube 4K</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Online Gaming</td><td className="font-mono">10+ Mbps</td><td>Under 30ms</td><td>Ping matters more</td></tr>
              <tr><td className="py-2 px-2 font-medium">Video Calls</td><td className="font-mono">10+ Mbps</td><td>Under 50ms</td><td>Upload also important</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Speed Improvement Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Wired connection</strong>: Ethernet is faster and more stable than WiFi</li>
          <li><strong>Router placement</strong>: Place centrally without obstacles, elevated position recommended</li>
          <li><strong>Channel change</strong>: Use 5GHz WiFi or switch to less congested channel</li>
          <li><strong>Test timing</strong>: Avoid peak hours (evening) for more accurate results</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Why is download speed different from upload speed?',
            answer: 'Most home internet uses asymmetric connections (ADSL, cable) that allocate more bandwidth to downloads. Unless you have symmetric fiber, slower upload is normal.',
          },
          {
            question: 'What is the difference between Ping and Jitter?',
            answer: 'Ping is the average server response time, while jitter is the variation in ping. For gaming and video calls, both ping AND jitter should be low to avoid lag.',
          },
          {
            question: 'My result is lower than my advertised speed',
            answer: 'Advertised speeds are theoretical maximums. WiFi loss, router performance, server distance, and network congestion typically result in 70-90% of advertised speeds. Try testing with a wired connection.',
          },
        ]}
      />
    </div>
  );
}
