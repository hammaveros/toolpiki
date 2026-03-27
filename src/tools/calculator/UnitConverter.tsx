'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FaqSection } from '@/components/ui/FaqItem';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'data';

interface UnitInfo {
  name: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const UNITS: Record<UnitCategory, Record<string, UnitInfo>> = {
  length: {
    mm: { name: '밀리미터 (mm)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    cm: { name: '센티미터 (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    m: { name: '미터 (m)', toBase: (v) => v, fromBase: (v) => v },
    km: { name: '킬로미터 (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    in: { name: '인치 (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ft: { name: '피트 (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    yd: { name: '야드 (yd)', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    mi: { name: '마일 (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  },
  weight: {
    mg: { name: '밀리그램 (mg)', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    g: { name: '그램 (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    kg: { name: '킬로그램 (kg)', toBase: (v) => v, fromBase: (v) => v },
    t: { name: '톤 (t)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    oz: { name: '온스 (oz)', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    lb: { name: '파운드 (lb)', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    근: { name: '근', toBase: (v) => v * 0.6, fromBase: (v) => v / 0.6 },
  },
  temperature: {
    c: { name: '섭씨 (°C)', toBase: (v) => v, fromBase: (v) => v },
    f: { name: '화씨 (°F)', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
    k: { name: '켈빈 (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  },
  area: {
    mm2: { name: '제곱밀리미터 (mm²)', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    cm2: { name: '제곱센티미터 (cm²)', toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
    m2: { name: '제곱미터 (m²)', toBase: (v) => v, fromBase: (v) => v },
    km2: { name: '제곱킬로미터 (km²)', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    평: { name: '평', toBase: (v) => v * 3.305785, fromBase: (v) => v / 3.305785 },
    ac: { name: '에이커 (ac)', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    ha: { name: '헥타르 (ha)', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
  },
  volume: {
    ml: { name: '밀리리터 (ml)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    l: { name: '리터 (L)', toBase: (v) => v, fromBase: (v) => v },
    m3: { name: '세제곱미터 (m³)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    gal: { name: '갤런 (gal)', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    qt: { name: '쿼트 (qt)', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    pt: { name: '파인트 (pt)', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    cup: { name: '컵', toBase: (v) => v * 0.24, fromBase: (v) => v / 0.24 },
  },
  data: {
    b: { name: '바이트 (B)', toBase: (v) => v, fromBase: (v) => v },
    kb: { name: '킬로바이트 (KB)', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    mb: { name: '메가바이트 (MB)', toBase: (v) => v * 1024 ** 2, fromBase: (v) => v / 1024 ** 2 },
    gb: { name: '기가바이트 (GB)', toBase: (v) => v * 1024 ** 3, fromBase: (v) => v / 1024 ** 3 },
    tb: { name: '테라바이트 (TB)', toBase: (v) => v * 1024 ** 4, fromBase: (v) => v / 1024 ** 4 },
    bit: { name: '비트 (bit)', toBase: (v) => v / 8, fromBase: (v) => v * 8 },
    kbit: { name: '킬로비트 (Kbit)', toBase: (v) => v * 128, fromBase: (v) => v / 128 },
    mbit: { name: '메가비트 (Mbit)', toBase: (v) => v * 131072, fromBase: (v) => v / 131072 },
  },
};

const CATEGORY_NAMES: Record<UnitCategory, string> = {
  length: '길이',
  weight: '무게',
  temperature: '온도',
  area: '면적',
  volume: '부피',
  data: '데이터',
};

export function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('cm');
  const [toUnit, setToUnit] = useState('in');
  const [inputValue, setInputValue] = useState('1');

  const units = UNITS[category];

  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';

    const baseValue = units[fromUnit].toBase(value);
    const converted = units[toUnit].fromBase(baseValue);

    // 적절한 정밀도로 포맷
    if (Math.abs(converted) < 0.0001 || Math.abs(converted) > 10000000) {
      return converted.toExponential(6);
    }
    return Number(converted.toPrecision(10)).toString();
  }, [inputValue, fromUnit, toUnit, units]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory);
    const unitKeys = Object.keys(UNITS[newCategory]);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1]);
  };

  return (
    <div className="space-y-2">
      {/* 카테고리 선택 */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(UNITS) as UnitCategory[]).map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleCategoryChange(cat)}
          >
            {CATEGORY_NAMES[cat]}
          </Button>
        ))}
      </div>

      <Card variant="bordered" className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              변환할 값
            </label>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="font-mono"
            />
            <Select
              options={Object.entries(units).map(([key, unit]) => ({
                value: key,
                label: unit.name,
              }))}
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="flex justify-center">
            <Button variant="secondary" onClick={swapUnits}>
              ↔
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              결과
            </label>
            <Input
              type="text"
              value={result}
              readOnly
              className="font-mono bg-gray-50 dark:bg-gray-800"
            />
            <Select
              options={Object.entries(units).map(([key, unit]) => ({
                value: key,
                label: unit.name,
              }))}
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      {/* 변환 결과 텍스트 */}
      {inputValue && result && (
        <Card variant="bordered" className="p-4 text-center">
          <p className="text-lg">
            <span className="font-mono font-bold">{inputValue}</span>
            <span className="text-gray-500 mx-2">{units[fromUnit].name}</span>
            <span className="text-gray-400">=</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 mx-2">{result}</span>
            <span className="text-gray-500">{units[toUnit].name}</span>
          </p>
        </Card>
      )}

      {/* 빠른 참조 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          빠른 변환
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {Object.entries(units)
            .filter(([key]) => key !== fromUnit)
            .slice(0, 8)
            .map(([key, unit]) => {
              const value = parseFloat(inputValue);
              if (isNaN(value)) return null;
              const baseValue = units[fromUnit].toBase(value);
              const converted = unit.fromBase(baseValue);
              const display = Math.abs(converted) < 0.0001 || Math.abs(converted) > 10000000
                ? converted.toExponential(2)
                : converted.toPrecision(4);
              return (
                <div key={key} className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-gray-500">{unit.name}</span>
                  <p className="font-mono font-medium">{display}</p>
                </div>
              );
            })}
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
          📐 단위 변환기란?
        </h2>
        <p className="text-sm leading-relaxed">
          단위 변환기는 길이, 무게, 온도, 면적, 부피, 데이터 용량을 다양한 단위로 변환하는 도구입니다.
          미터법(SI), 야드파운드법(미국/영국), 한국 전통 단위(평, 근)를 모두 지원합니다.
          입력과 동시에 모든 단위로의 변환 결과를 실시간으로 확인할 수 있습니다.
          요리, 운동, 여행, 부동산, 개발 등 일상과 업무에서 필수적인 도구입니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 주요 단위 변환 참조표
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">카테고리</th>
                <th className="text-left py-2 px-2">자주 쓰는 변환</th>
                <th className="text-left py-2 px-2">값</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">길이</td><td>1 inch = ? cm</td><td className="font-mono">2.54 cm</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">길이</td><td>1 mile = ? km</td><td className="font-mono">1.609 km</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">무게</td><td>1 pound = ? kg</td><td className="font-mono">0.454 kg</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">면적</td><td>1 평 = ? m²</td><td className="font-mono">3.306 m²</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">온도</td><td>화씨 → 섭씨</td><td className="font-mono">(°F - 32) × 5/9</td></tr>
              <tr><td className="py-2 px-2 font-medium">데이터</td><td>1 GB = ? MB</td><td className="font-mono">1,024 MB</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 단위 변환 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>부동산</strong>: 평 → 제곱미터 변환으로 실제 면적 파악 (33평 ≈ 109㎡)</li>
          <li><strong>요리</strong>: 컵, 테이블스푼, 밀리리터 간 변환 (1 cup = 240ml)</li>
          <li><strong>운동</strong>: 마일 → 킬로미터 변환 (5K = 3.1마일)</li>
          <li><strong>저장장치</strong>: GB/TB 변환 (1TB = 1,024GB)</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '1 평은 몇 제곱미터인가요?',
            answer: '1 평은 약 3.3058 제곱미터입니다. 아파트 33평은 약 109제곱미터(전용면적 기준으로는 84㎡ 정도)입니다.',
          },
          {
            question: '화씨 100도는 섭씨로 몇 도인가요?',
            answer: '화씨 100°F는 섭씨 약 37.8°C입니다. 사람 체온이 화씨 98.6°F(섭씨 37°C) 정도이므로 미열 상태입니다.',
          },
          {
            question: 'KB, MB, GB 변환이 1,000이 아니라 1,024인 이유는?',
            answer: '컴퓨터는 2진법을 사용하므로 2^10=1,024를 기준으로 합니다. 단, 저장장치 제조사는 1,000 기준(SI)으로 표기해 실제 용량이 적어 보일 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}
