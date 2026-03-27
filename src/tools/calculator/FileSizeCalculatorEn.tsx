'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
const speeds = [
  { label: '10 Mbps (Standard)', mbps: 10 },
  { label: '100 Mbps (Fast)', mbps: 100 },
  { label: '1 Gbps (Gigabit)', mbps: 1000 },
  { label: '5G Average (200 Mbps)', mbps: 200 },
  { label: 'USB 2.0 (480 Mbps)', mbps: 480 },
  { label: 'USB 3.0 (5 Gbps)', mbps: 5000 },
];

export function FileSizeCalculatorEn() {
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
    if (seconds < 60) return `${seconds.toFixed(1)} sec`;
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `${mins}m ${secs}s`;
    }
    const hours = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
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

      // Unit conversion results
      const newResults = units.map((unit) => {
        const index = units.indexOf(unit);
        const converted = bytes / Math.pow(1024, index);
        let formatted: string;
        if (converted >= 1000000) {
          formatted = converted.toExponential(2);
        } else if (converted < 0.01 && converted > 0) {
          formatted = converted.toExponential(2);
        } else {
          formatted = converted.toLocaleString('en-US', { maximumFractionDigits: 2 });
        }
        return { unit, value: formatted };
      });
      setResults(newResults);

      // Download time calculation
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
              File Size
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
              Unit Conversion
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
              Estimated Download Time
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
          💾 What is File Size Calculator?
        </h2>
        <p className="text-sm leading-relaxed">
          File Size Calculator converts between B, KB, MB, GB, TB, and PB units and estimates download times for various internet speeds.
          It uses binary units (1024-based) as used by operating systems for accurate conversions.
          Essential for planning large file transfers, storage capacity, and cloud storage management.
          Supports speeds from standard internet to gigabit and USB transfer rates.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 File Size Unit Reference
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Unit</th>
                <th className="text-left py-2 px-2">Size (Binary)</th>
                <th className="text-left py-2 px-2">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">KB</td><td className="font-mono">1,024 B</td><td>Small text document</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">MB</td><td className="font-mono">1,024 KB</td><td>High-res photo, MP3</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">GB</td><td className="font-mono">1,024 MB</td><td>Movie, game install</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">TB</td><td className="font-mono">1,024 GB</td><td>External drive, backup</td></tr>
              <tr><td className="py-2 px-2 font-medium">PB</td><td className="font-mono">1,024 TB</td><td>Data center, cloud</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 File Size Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Binary vs Decimal</strong>: 1TB drive shows ~931GB in Windows (1024 vs 1000 base)</li>
          <li><strong>Mbps vs MB/s</strong>: 100Mbps = 12.5MB/s (8 bits = 1 byte)</li>
          <li><strong>Real speed</strong>: Actual download is typically 70-80% of rated speed</li>
          <li><strong>5G note</strong>: Theoretical 10Gbps, real-world average 100-200Mbps</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Why does my 1TB drive show only 931GB in Windows?',
            answer: 'Manufacturers use 1TB = 1,000GB (decimal), but operating systems use 1TB = 1,024GB (binary). So 1,000,000,000,000 bytes ÷ 1,099,511,627,776 ≈ 931GB.',
          },
          {
            question: 'Why is my download slower than my internet speed?',
            answer: 'Internet speed is measured in Mbps (bits), downloads show MB/s (bytes). Since 8 bits = 1 byte, 100Mbps internet means max 12.5MB/s download speed.',
          },
          {
            question: 'Why is USB 3.0 slower than expected?',
            answer: 'USB 3.0\'s 5Gbps is the theoretical maximum. Real-world speeds depend on controller, drive speed, and file count—typically achieving 200-400MB/s.',
          },
        ]}
      />
    </div>
  );
}
