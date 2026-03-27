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
    mm: { name: 'Millimeter (mm)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    cm: { name: 'Centimeter (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    m: { name: 'Meter (m)', toBase: (v) => v, fromBase: (v) => v },
    km: { name: 'Kilometer (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    in: { name: 'Inch (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ft: { name: 'Foot (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    yd: { name: 'Yard (yd)', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    mi: { name: 'Mile (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  },
  weight: {
    mg: { name: 'Milligram (mg)', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    g: { name: 'Gram (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    kg: { name: 'Kilogram (kg)', toBase: (v) => v, fromBase: (v) => v },
    t: { name: 'Ton (t)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    oz: { name: 'Ounce (oz)', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    lb: { name: 'Pound (lb)', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
  },
  temperature: {
    c: { name: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
    f: { name: 'Fahrenheit (°F)', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
    k: { name: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  },
  area: {
    mm2: { name: 'Square mm (mm²)', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    cm2: { name: 'Square cm (cm²)', toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
    m2: { name: 'Square m (m²)', toBase: (v) => v, fromBase: (v) => v },
    km2: { name: 'Square km (km²)', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    sqft: { name: 'Square ft (ft²)', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    ac: { name: 'Acre (ac)', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    ha: { name: 'Hectare (ha)', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
  },
  volume: {
    ml: { name: 'Milliliter (ml)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    l: { name: 'Liter (L)', toBase: (v) => v, fromBase: (v) => v },
    m3: { name: 'Cubic meter (m³)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    gal: { name: 'Gallon (gal)', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    qt: { name: 'Quart (qt)', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    pt: { name: 'Pint (pt)', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    cup: { name: 'Cup', toBase: (v) => v * 0.24, fromBase: (v) => v / 0.24 },
    floz: { name: 'Fluid oz (fl oz)', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
  },
  data: {
    b: { name: 'Byte (B)', toBase: (v) => v, fromBase: (v) => v },
    kb: { name: 'Kilobyte (KB)', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    mb: { name: 'Megabyte (MB)', toBase: (v) => v * 1024 ** 2, fromBase: (v) => v / 1024 ** 2 },
    gb: { name: 'Gigabyte (GB)', toBase: (v) => v * 1024 ** 3, fromBase: (v) => v / 1024 ** 3 },
    tb: { name: 'Terabyte (TB)', toBase: (v) => v * 1024 ** 4, fromBase: (v) => v / 1024 ** 4 },
    bit: { name: 'Bit (bit)', toBase: (v) => v / 8, fromBase: (v) => v * 8 },
    kbit: { name: 'Kilobit (Kbit)', toBase: (v) => v * 128, fromBase: (v) => v / 128 },
    mbit: { name: 'Megabit (Mbit)', toBase: (v) => v * 131072, fromBase: (v) => v / 131072 },
  },
};

const CATEGORY_NAMES: Record<UnitCategory, string> = {
  length: 'Length',
  weight: 'Weight',
  temperature: 'Temperature',
  area: 'Area',
  volume: 'Volume',
  data: 'Data',
};

export function UnitConverterEn() {
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
      {/* Category selection */}
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
              Value to convert
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
              Result
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

      {/* Result text */}
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

      {/* Quick reference */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quick Conversion
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
          📐 What is Unit Converter?
        </h2>
        <p className="text-sm leading-relaxed">
          Unit Converter transforms values between different measurement units for length, weight, temperature, area, volume, and data.
          It supports both metric (SI) and imperial (US/UK) systems with instant real-time conversion.
          See all related unit conversions at once as you type, making comparisons easy.
          Essential for cooking, fitness, travel, real estate, and technical work.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Common Unit Conversion Reference
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Category</th>
                <th className="text-left py-2 px-2">Common Conversion</th>
                <th className="text-left py-2 px-2">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Length</td><td>1 inch = ? cm</td><td className="font-mono">2.54 cm</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Length</td><td>1 mile = ? km</td><td className="font-mono">1.609 km</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Weight</td><td>1 pound = ? kg</td><td className="font-mono">0.454 kg</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Volume</td><td>1 gallon = ? liters</td><td className="font-mono">3.785 L</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Temperature</td><td>°F to °C formula</td><td className="font-mono">(°F - 32) × 5/9</td></tr>
              <tr><td className="py-2 px-2 font-medium">Data</td><td>1 GB = ? MB</td><td className="font-mono">1,024 MB</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Unit Conversion Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Cooking</strong>: Cup, tablespoon, milliliter conversions (1 cup = 240ml)</li>
          <li><strong>Fitness</strong>: Miles to kilometers for running (5K = 3.1 miles)</li>
          <li><strong>Travel</strong>: Celsius to Fahrenheit for weather (20°C = 68°F)</li>
          <li><strong>Storage</strong>: GB/TB for drives (1TB = 1,024GB binary)</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'How many feet are in a mile?',
            answer: 'There are 5,280 feet in a mile, or 1,760 yards. A mile is approximately 1.609 kilometers.',
          },
          {
            question: 'What temperature is 100°F in Celsius?',
            answer: '100°F is approximately 37.8°C. Normal body temperature (98.6°F) is 37°C, so 100°F indicates a slight fever.',
          },
          {
            question: 'Why is KB/MB/GB based on 1,024 instead of 1,000?',
            answer: 'Computers use binary (base 2), so 2^10=1,024 is the natural unit. However, storage manufacturers often use 1,000 (SI units), which is why drives appear smaller than advertised.',
          },
        ]}
      />
    </div>
  );
}
