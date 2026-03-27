'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

interface BmiRange {
  min: number;
  max: number;
  label: string;
  color: string;
  bgColor: string;
}

const BMI_RANGES: BmiRange[] = [
  { min: 0, max: 18.5, label: 'Underweight', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  { min: 18.5, max: 25, label: 'Normal', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  { min: 25, max: 30, label: 'Overweight', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { min: 30, max: 35, label: 'Obese', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  { min: 35, max: 100, label: 'Severely Obese', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
];

function getBmiRange(bmi: number): BmiRange {
  return BMI_RANGES.find((r) => bmi >= r.min && bmi < r.max) || BMI_RANGES[BMI_RANGES.length - 1];
}

export function BmiCalculatorEn() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    const h = parseFloat(height) / 100; // cm to m
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) return null;

    const bmi = w / (h * h);
    const range = getBmiRange(bmi);

    // Normal weight range
    const normalMin = 18.5 * h * h;
    const normalMax = 25 * h * h;

    // Ideal weight (BMI 22 based)
    const idealWeight = 22 * h * h;

    // Weight difference
    const weightDiff = w - idealWeight;

    return {
      bmi: bmi.toFixed(1),
      range,
      normalMin: normalMin.toFixed(1),
      normalMax: normalMax.toFixed(1),
      idealWeight: idealWeight.toFixed(1),
      weightDiff: weightDiff.toFixed(1),
      needToLose: weightDiff > 0,
    };
  }, [height, weight]);

  const handleCalculate = () => {
    if (height && weight) {
      setShowResult(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCalculate();
    }
  };

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-5">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Height (cm)
            </label>
            <Input
              type="number"
              value={height}
              onChange={(e) => { setHeight(e.target.value); setShowResult(false); }}
              onKeyDown={handleKeyDown}
              placeholder="e.g., 170"
              min="100"
              max="250"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Weight (kg)
            </label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => { setWeight(e.target.value); setShowResult(false); }}
              onKeyDown={handleKeyDown}
              placeholder="e.g., 65"
              min="20"
              max="300"
            />
          </div>
          <Button onClick={handleCalculate} className="w-full">
            Calculate
          </Button>
        </div>
      </Card>

      {showResult && result && (
        <>
          <Card variant="bordered" className={cn('p-6 text-center', result.range.bgColor)}>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              BMI (Body Mass Index)
            </div>
            <div className={cn('text-5xl font-bold mb-2', result.range.color)}>
              {result.bmi}
            </div>
            <div className={cn('text-xl font-medium', result.range.color)}>
              {result.range.label}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card variant="bordered" className="p-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Normal Weight Range</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {result.normalMin} - {result.normalMax} kg
              </div>
            </Card>
            <Card variant="bordered" className="p-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Ideal Weight</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {result.idealWeight} kg
              </div>
            </Card>
          </div>

          {parseFloat(result.weightDiff) !== 0 && (
            <Card variant="bordered" className="p-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                To reach ideal weight
              </div>
              <div className={cn(
                'text-2xl font-bold',
                result.needToLose
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-blue-600 dark:text-blue-400'
              )}>
                {result.needToLose ? '-' : '+'}{Math.abs(parseFloat(result.weightDiff))} kg
              </div>
            </Card>
          )}

          {/* BMI Range Visualization */}
          <Card variant="bordered" className="p-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              BMI Range
            </div>
            <div className="relative h-8 rounded-full overflow-hidden flex">
              {BMI_RANGES.map((range, i) => (
                <div
                  key={i}
                  className={cn('flex-1 flex items-center justify-center text-xs font-medium', range.bgColor, range.color)}
                >
                  {range.label}
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div
                className="absolute w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-white"
                style={{
                  left: `${Math.min(Math.max((parseFloat(result.bmi) / 40) * 100, 2), 98)}%`,
                  transform: 'translateX(-50%)',
                }}
              />
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
          ⚖️ What is BMI Calculator?
        </h2>
        <p className="text-sm leading-relaxed">
          BMI (Body Mass Index) is an international standard metric that measures body fat based on height and weight ratio.
          It is calculated by dividing weight (kg) by the square of height (m), and is the obesity assessment standard recommended by the WHO.
          This calculator computes your BMI from entered height and weight, showing your normal weight range and ideal weight.
          A visual BMI range chart helps you understand your current health status at a glance.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 WHO BMI Classification
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Category</th>
                <th className="text-left py-2 px-2">BMI Range</th>
                <th className="text-left py-2 px-2">Health Risk</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Underweight</td><td className="font-mono">Below 18.5</td><td>Nutritional deficiency risk</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Normal</td><td className="font-mono">18.5 - 24.9</td><td>Healthy weight range</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Overweight</td><td className="font-mono">25 - 29.9</td><td>Lifestyle changes recommended</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Obese Class I</td><td className="font-mono">30 - 34.9</td><td>Increased metabolic syndrome risk</td></tr>
              <tr><td className="py-2 px-2 font-medium">Obese Class II+</td><td className="font-mono">35 and above</td><td>High cardiovascular disease risk</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 BMI Limitations and Complementary Metrics
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Muscle mass not reflected</strong>: Athletes may have high BMI but be healthy (check body fat percentage)</li>
          <li><strong>Fat distribution</strong>: Abdominal fat is more dangerous; measure waist circumference</li>
          <li><strong>Age/gender differences</strong>: Same BMI means different things for elderly vs young adults</li>
          <li><strong>Not applicable for pregnancy</strong>: BMI standards do not apply during pregnancy</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Why are Asian BMI standards different from Western ones?',
            answer: 'Asians have higher body fat percentage and more visceral fat at the same BMI, increasing cardiovascular disease risk. Therefore, 23+ is classified as overweight, lower than the WHO standard of 25+.',
          },
          {
            question: 'My BMI is normal but I have belly fat. Why?',
            answer: 'BMI only measures overall weight ratio and cannot detect "skinny fat." Check your waist circumference (men over 40 inches, women over 35 inches) or body fat percentage as well.',
          },
          {
            question: 'Can children and teenagers use these standards?',
            answer: 'No. During growth periods, BMI percentiles by age are used. Adult BMI standards only apply to those 18 years and older.',
          },
        ]}
      />
    </div>
  );
}
