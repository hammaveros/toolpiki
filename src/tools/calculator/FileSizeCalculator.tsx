'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
const speeds = [
  { label: '10 Mbps (일반 인터넷)', mbps: 10 },
  { label: '100 Mbps (고속 인터넷)', mbps: 100 },
  { label: '1 Gbps (기가 인터넷)', mbps: 1000 },
  { label: '5G 평균 (200 Mbps)', mbps: 200 },
  { label: 'USB 2.0 (480 Mbps)', mbps: 480 },
  { label: 'USB 3.0 (5 Gbps)', mbps: 5000 },
];

export function FileSizeCalculator() {
  const [inputValue, setInputValue] = useState('1');
  const [inputUnit, setInputUnit] = useState('GB');
  const [results, setResults] = useState<{ unit: string; value: string }[]>([]);
  const [downloadTimes, setDownloadTimes] = useState<{ speed: string; time: string }[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const convertToBytes = (value: number, unit: string): number => {
    const index = units.indexOf(unit);
    return value * Math.pow(1024, index);
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 1) return `${Math.round(seconds * 1000)} ms`;
    if (seconds < 60) return `${seconds.toFixed(1)} 초`;
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `${mins}분 ${secs}초`;
    }
    const hours = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);
    return `${hours}시간 ${mins}분`;
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const value = parseFloat(inputValue);
      if (isNaN(value) || value < 0) {
        setResults([]);
        setDownloadTimes([]);
        return;
      }

      const bytes = convertToBytes(value, inputUnit);

      // 단위 변환 결과
      const newResults = units.map((unit) => {
        const index = units.indexOf(unit);
        const converted = bytes / Math.pow(1024, index);
        let formatted: string;
        if (converted < 0.01 && converted > 0) {
          formatted = converted.toExponential(2);
        } else {
          formatted = converted.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
        }
        return { unit, value: formatted };
      });
      setResults(newResults);

      // 다운로드 시간 계산
      const newDownloadTimes = speeds.map(({ label, mbps }) => {
        const bytesPerSecond = (mbps * 1000000) / 8;
        const seconds = bytes / bytesPerSecond;
        return { speed: label, time: formatTime(seconds) };
      });
      setDownloadTimes(newDownloadTimes);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, inputUnit]);

  return (
    <div className="space-y-4">
      <Card variant="bordered" className="p-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              파일 크기
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              min="0"
              step="any"
            />
          </div>
          <div className="w-24">
            <select
              value={inputUnit}
              onChange={(e) => setInputUnit(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {results.length > 0 && (
        <>
          <Card variant="bordered" className="p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              단위 변환
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {results.map(({ unit, value }) => (
                <div
                  key={unit}
                  className={`p-3 rounded-lg ${inputUnit === unit ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-800'}`}
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400">{unit}</div>
                  <div className="font-mono font-medium flex items-center gap-1">
                    {value}
                    <CopyButton text={value} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="bordered" className="p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              예상 다운로드 시간
            </h3>
            <div className="space-y-2">
              {downloadTimes.map(({ speed, time }) => (
                <div key={speed} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{speed}</span>
                  <span className="font-mono font-medium">{time}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
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
          💾 파일 크기 계산기란?
        </h2>
        <p className="text-sm leading-relaxed">
          파일 크기 계산기는 B, KB, MB, GB, TB, PB 단위를 상호 변환하고, 인터넷 속도별 다운로드 예상 시간을 계산하는 도구입니다.
          컴퓨터에서 사용하는 이진 단위(1024 기준)를 적용하여 정확한 변환값을 제공합니다.
          대용량 파일 전송 시간 예측, 저장장치 용량 계획, 클라우드 스토리지 관리 등에 필수적인 도구입니다.
          일반 인터넷부터 기가 인터넷, USB 전송 속도까지 다양한 환경을 지원합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 파일 크기 단위표
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">단위</th>
                <th className="text-left py-2 px-2">크기 (이진)</th>
                <th className="text-left py-2 px-2">예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">KB</td><td className="font-mono">1,024 B</td><td>작은 텍스트 문서</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">MB</td><td className="font-mono">1,024 KB</td><td>고해상도 사진, MP3</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">GB</td><td className="font-mono">1,024 MB</td><td>영화 1편, 게임</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">TB</td><td className="font-mono">1,024 GB</td><td>외장하드, 대용량 백업</td></tr>
              <tr><td className="py-2 px-2 font-medium">PB</td><td className="font-mono">1,024 TB</td><td>데이터센터, 클라우드</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 파일 크기 이해 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>이진 vs 십진</strong>: 1TB 하드는 1000GB(제조사), 실제 Windows에선 ~931GB(1024 기준)</li>
          <li><strong>Mbps vs MB/s</strong>: 100Mbps = 12.5MB/s (8비트 = 1바이트)</li>
          <li><strong>실제 속도</strong>: 공칭 속도의 70-80%가 실제 다운로드 속도</li>
          <li><strong>5G 참고</strong>: 이론상 10Gbps, 실제 평균 100-200Mbps 수준</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '왜 1TB 하드가 Windows에서 931GB로 보이나요?',
            answer: '제조사는 1TB = 1,000GB(십진)로 표기하지만, 운영체제는 1TB = 1,024GB(이진)로 계산합니다. 따라서 1,000,000,000,000 ÷ 1,099,511,627,776 ≈ 931GB가 됩니다.',
          },
          {
            question: '인터넷 속도와 다운로드 속도가 다른 이유는?',
            answer: '인터넷 속도는 Mbps(비트), 다운로드는 MB/s(바이트)로 표시됩니다. 8비트 = 1바이트이므로, 100Mbps 인터넷은 최대 12.5MB/s 다운로드 속도입니다.',
          },
          {
            question: 'USB 3.0이 빠른데 왜 예상보다 느리게 전송되나요?',
            answer: 'USB 3.0의 5Gbps는 이론상 최대치입니다. 실제로는 컨트롤러 성능, 드라이브 속도, 파일 개수 등에 영향을 받아 실제 전송 속도는 200-400MB/s 수준입니다.',
          },
        ]}
      />
    </div>
  );
}
