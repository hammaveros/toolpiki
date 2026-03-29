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

// 테스트용 데이터 URL (Cloudflare의 무료 테스트 서버 사용)
const TEST_DOWNLOAD_URL = 'https://speed.cloudflare.com/__down?bytes=';
const TEST_UPLOAD_URL = 'https://speed.cloudflare.com/__up';

export function SpeedTest() {
  const [state, setState] = useState<TestState>('idle');
  const [phase, setPhase] = useState<TestPhase>('ping');
  const [progress, setProgress] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const [history, setHistory] = useState<TestResult[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Ping 테스트
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
        // 에러 무시
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

  // 단일 다운로드 요청
  const downloadChunk = useCallback(async (size: number): Promise<{ bytes: number; time: number }> => {
    const start = performance.now();
    try {
      const response = await fetch(`${TEST_DOWNLOAD_URL}${size}&_=${Date.now()}${Math.random()}`, {
        cache: 'no-store',
        signal: abortControllerRef.current?.signal,
      });
      const blob = await response.blob();
      const end = performance.now();
      return { bytes: blob.size, time: (end - start) / 1000 };
    } catch {
      return { bytes: 0, time: 0 };
    }
  }, []);

  // 다운로드 속도 테스트 (병렬 + 워밍업)
  const testDownload = useCallback(async (): Promise<number> => {
    // 워밍업 (TCP 연결 확립, slow start 통과)
    await Promise.all([
      downloadChunk(100000),
      downloadChunk(100000),
    ]);
    setProgress(35);

    // 본 측정: 병렬 4연결 × 3라운드, 큰 파일
    const rounds = [10000000, 10000000, 25000000]; // 10MB, 10MB, 25MB
    const samples: number[] = [];

    for (let r = 0; r < rounds.length; r++) {
      const size = rounds[r];
      const parallel = 4;
      const results = await Promise.all(
        Array.from({ length: parallel }, () => downloadChunk(size))
      );

      const validResults = results.filter(x => x.time > 0);
      if (validResults.length > 0) {
        const totalBytes = validResults.reduce((s, x) => s + x.bytes, 0);
        const maxTime = Math.max(...validResults.map(x => x.time)); // 병렬이니까 가장 긴 시간 기준
        const mbps = (totalBytes * 8) / (maxTime * 1000000);
        samples.push(mbps);
        setCurrentSpeed(mbps);
      }

      setProgress(35 + ((r + 1) / rounds.length * 30));
    }

    if (samples.length === 0) return 0;
    // 가장 느린 샘플 제거하고 평균
    samples.sort((a, b) => a - b);
    const trimmed = samples.length > 1 ? samples.slice(1) : samples;
    return trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
  }, [downloadChunk]);

  // 단일 업로드 요청
  const uploadChunk = useCallback(async (size: number): Promise<{ bytes: number; time: number }> => {
    const data = new Blob([new ArrayBuffer(size)]);
    const start = performance.now();
    try {
      await fetch(TEST_UPLOAD_URL, {
        method: 'POST',
        body: data,
        signal: abortControllerRef.current?.signal,
      });
      const end = performance.now();
      return { bytes: size, time: (end - start) / 1000 };
    } catch {
      return { bytes: 0, time: 0 };
    }
  }, []);

  // 업로드 속도 테스트 (병렬 + 워밍업)
  const testUpload = useCallback(async (): Promise<number> => {
    // 워밍업
    await Promise.all([
      uploadChunk(100000),
      uploadChunk(100000),
    ]);
    setProgress(70);

    // 본 측정: 병렬 3연결 × 3라운드
    const rounds = [2000000, 5000000, 5000000]; // 2MB, 5MB, 5MB
    const samples: number[] = [];

    for (let r = 0; r < rounds.length; r++) {
      const size = rounds[r];
      const parallel = 3;
      const results = await Promise.all(
        Array.from({ length: parallel }, () => uploadChunk(size))
      );

      const validResults = results.filter(x => x.time > 0);
      if (validResults.length > 0) {
        const totalBytes = validResults.reduce((s, x) => s + x.bytes, 0);
        const maxTime = Math.max(...validResults.map(x => x.time));
        const mbps = (totalBytes * 8) / (maxTime * 1000000);
        samples.push(mbps);
        setCurrentSpeed(mbps);
      }

      setProgress(70 + ((r + 1) / rounds.length * 30));
    }

    if (samples.length === 0) return 0;
    samples.sort((a, b) => a - b);
    const trimmed = samples.length > 1 ? samples.slice(1) : samples;
    return trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
  }, [uploadChunk]);

  // 전체 테스트 실행
  const runTest = useCallback(async () => {
    abortControllerRef.current = new AbortController();
    setState('testing');
    setProgress(0);
    setCurrentSpeed(0);
    setResult(null);

    try {
      // Ping 테스트
      setPhase('ping');
      const { ping, jitter } = await testPing();

      // 다운로드 테스트
      setPhase('download');
      const download = await testDownload();

      // 업로드 테스트
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

  // 테스트 중지
  const stopTest = useCallback(() => {
    abortControllerRef.current?.abort();
    setState('idle');
    setProgress(0);
    setCurrentSpeed(0);
  }, []);

  // 속도 등급 판정
  const getSpeedGrade = (download: number): { grade: string; color: string; description: string } => {
    if (download >= 100) return { grade: '최상', color: 'text-green-500', description: '4K 스트리밍, 대용량 다운로드에 최적' };
    if (download >= 50) return { grade: '상', color: 'text-blue-500', description: 'HD 스트리밍, 화상회의에 적합' };
    if (download >= 25) return { grade: '중상', color: 'text-cyan-500', description: '일반적인 스트리밍, 게임에 적합' };
    if (download >= 10) return { grade: '중', color: 'text-yellow-500', description: '웹 브라우징, SD 스트리밍 가능' };
    if (download >= 5) return { grade: '중하', color: 'text-orange-500', description: '기본적인 웹 사용 가능' };
    return { grade: '하', color: 'text-red-500', description: '느린 연결, 개선 필요' };
  };

  const phaseLabels: Record<TestPhase, string> = {
    ping: '응답 시간 측정 중...',
    download: '다운로드 속도 측정 중...',
    upload: '업로드 속도 측정 중...',
  };

  return (
    <div className="space-y-4">
      <Card variant="bordered" className="p-6">
        {/* 메인 속도계 */}
        <div className="text-center mb-6">
          <div className="relative w-48 h-48 mx-auto mb-4">
            {/* 배경 원 */}
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
              {/* 진행 원 */}
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
            {/* 중앙 텍스트 */}
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
                <span className="text-gray-400 dark:text-gray-500">시작</span>
              )}
            </div>
          </div>

          {/* 상태 텍스트 */}
          {state === 'testing' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {phaseLabels[phase]}
            </p>
          )}

          {/* 버튼 */}
          {state === 'idle' && (
            <Button onClick={runTest} size="lg">
              속도 측정 시작
            </Button>
          )}
          {state === 'testing' && (
            <Button onClick={stopTest} variant="secondary" size="lg">
              측정 중지
            </Button>
          )}
          {state === 'complete' && (
            <Button onClick={runTest} size="lg">
              다시 측정
            </Button>
          )}
        </div>

        {/* 결과 표시 */}
        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.download}
                </div>
                <div className="text-xs text-gray-500">다운로드 (Mbps)</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {result.upload}
                </div>
                <div className="text-xs text-gray-500">업로드 (Mbps)</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {result.ping}
                </div>
                <div className="text-xs text-gray-500">핑 (ms)</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {result.jitter}
                </div>
                <div className="text-xs text-gray-500">지터 (ms)</div>
              </div>
            </div>

            {/* 등급 표시 */}
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className={cn('text-lg font-bold', getSpeedGrade(result.download).color)}>
                인터넷 속도: {getSpeedGrade(result.download).grade}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {getSpeedGrade(result.download).description}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* 히스토리 */}
      {history.length > 0 && (
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            측정 기록
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

      {/* 설명 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          측정 항목 설명
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <strong className="text-blue-600 dark:text-blue-400">다운로드 속도</strong>
            <p>인터넷에서 데이터를 받는 속도. 스트리밍, 다운로드에 영향.</p>
          </div>
          <div>
            <strong className="text-green-600 dark:text-green-400">업로드 속도</strong>
            <p>인터넷으로 데이터를 보내는 속도. 영상통화, 업로드에 영향.</p>
          </div>
          <div>
            <strong className="text-purple-600 dark:text-purple-400">핑 (Ping)</strong>
            <p>서버 응답 시간. 낮을수록 좋음. 게임, 화상회의에 중요.</p>
          </div>
          <div>
            <strong className="text-orange-600 dark:text-orange-400">지터 (Jitter)</strong>
            <p>핑의 변동 폭. 낮을수록 안정적인 연결.</p>
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
          📶 인터넷 속도 테스트란?
        </h2>
        <p className="text-sm leading-relaxed">
          인터넷 속도 테스트는 현재 인터넷 연결의 다운로드 속도, 업로드 속도, 응답 시간(핑)을 측정하는 도구입니다.
          Cloudflare의 글로벌 엣지 서버를 활용하여 정확한 속도를 측정합니다.
          다양한 크기의 파일(100KB~5MB)을 전송하여 실제 사용 환경에 가까운 결과를 제공합니다.
          게임, 영상 스트리밍, 화상 회의 등 용도에 맞는 속도인지 확인해보세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 용도별 권장 속도
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">용도</th>
                <th className="text-left py-2 px-2">다운로드</th>
                <th className="text-left py-2 px-2">핑</th>
                <th className="text-left py-2 px-2">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">웹 브라우징</td><td className="font-mono">5+ Mbps</td><td>100ms 이하</td><td>일반 사용</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HD 스트리밍</td><td className="font-mono">25+ Mbps</td><td>50ms 이하</td><td>넷플릭스 1080p</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">4K 스트리밍</td><td className="font-mono">50+ Mbps</td><td>50ms 이하</td><td>유튜브 4K</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">온라인 게임</td><td className="font-mono">10+ Mbps</td><td>30ms 이하</td><td>핑이 더 중요</td></tr>
              <tr><td className="py-2 px-2 font-medium">화상 회의</td><td className="font-mono">10+ Mbps</td><td>50ms 이하</td><td>업로드도 중요</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 속도 개선 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>유선 연결</strong>: WiFi보다 유선(이더넷) 연결이 더 빠르고 안정적</li>
          <li><strong>공유기 위치</strong>: 장애물 없는 중앙에 배치, 바닥보다 높은 곳 권장</li>
          <li><strong>채널 변경</strong>: 5GHz WiFi 사용 또는 덜 혼잡한 채널로 변경</li>
          <li><strong>시간대</strong>: 피크 시간(저녁)을 피해 테스트하면 더 정확한 결과</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '다운로드 속도와 업로드 속도가 다른 이유는?',
            answer: '대부분의 가정용 인터넷은 비대칭(ADSL, 케이블) 방식으로, 다운로드에 더 많은 대역폭을 할당합니다. 대칭(기가) 회선이 아니면 업로드가 느린 것이 정상입니다.',
          },
          {
            question: '핑(Ping)과 지터(Jitter)의 차이는?',
            answer: '핑은 서버 응답 시간의 평균이고, 지터는 핑의 변동 폭입니다. 게임이나 화상통화에서는 핑뿐 아니라 지터도 낮아야 끊김이 없습니다.',
          },
          {
            question: '측정 결과가 약정 속도보다 낮아요',
            answer: '약정 속도는 이론상 최대치입니다. WiFi 손실, 라우터 성능, 서버 거리, 네트워크 혼잡 등으로 70-90% 수준이 일반적입니다. 유선 연결로 다시 테스트해보세요.',
          },
        ]}
      />
    </div>
  );
}
