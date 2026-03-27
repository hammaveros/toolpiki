'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FaqSection } from '@/components/ui/FaqItem';

interface MeetingInput {
  participants: string;
  duration: string;
  avgSalary: string;
}

export function MeetingCostCalculatorEn() {
  const [input, setInput] = useState<MeetingInput>({
    participants: '',
    duration: '',
    avgSalary: '75000',
  });

  const result = useMemo(() => {
    const participants = parseInt(input.participants) || 0;
    const duration = parseInt(input.duration) || 0;
    const avgSalary = parseInt(input.avgSalary) || 0;

    if (participants === 0 || duration === 0 || avgSalary === 0) {
      return null;
    }

    // Annual salary → hourly rate (2080 work hours: 52 weeks × 40 hours)
    const hourlyRate = avgSalary / 2080;
    const minuteRate = hourlyRate / 60;

    // Meeting cost calculation
    const totalMinutes = participants * duration;
    const totalCost = totalMinutes * minuteRate;

    // Monthly cost (assuming 22 work days)
    const monthlyCost = totalCost * 22;

    return {
      totalCost: Math.round(totalCost),
      hourlyRate: Math.round(hourlyRate),
      totalManHours: (totalMinutes / 60).toFixed(1),
      monthlyCost: Math.round(monthlyCost),
    };
  }, [input]);

  const handleChange = (field: keyof MeetingInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const presetSalaries = [
    { label: '$50K', value: '50000' },
    { label: '$75K', value: '75000' },
    { label: '$100K', value: '100000' },
    { label: '$150K', value: '150000' },
  ];

  const presetDurations = [
    { label: '30 min', value: '30' },
    { label: '1 hour', value: '60' },
    { label: '1.5 hours', value: '90' },
    { label: '2 hours', value: '120' },
  ];

  return (
    <div className="space-y-2">
      {/* Participants */}
      <Input
        label="Number of Participants"
        type="number"
        min="1"
        value={input.participants}
        onChange={handleChange('participants')}
        placeholder="e.g., 5"
      />

      {/* Meeting Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Meeting Duration (minutes)
        </label>
        <div className="flex gap-2 mb-2">
          {presetDurations.map((preset) => (
            <Button
              key={preset.value}
              variant={input.duration === preset.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setInput((prev) => ({ ...prev, duration: preset.value }))}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <Input
          type="number"
          min="1"
          value={input.duration}
          onChange={handleChange('duration')}
          placeholder="Enter custom"
        />
      </div>

      {/* Average Salary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Average Annual Salary ($)
        </label>
        <div className="flex gap-2 mb-2">
          {presetSalaries.map((preset) => (
            <Button
              key={preset.value}
              variant={input.avgSalary === preset.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setInput((prev) => ({ ...prev, avgSalary: preset.value }))}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <Input
          type="number"
          min="1"
          value={input.avgSalary}
          onChange={handleChange('avgSalary')}
          placeholder="Enter custom"
        />
      </div>

      {/* Result */}
      {result && (
        <Card variant="bordered" className="p-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Meeting Cost
            </p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              ${result.totalCost.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Total Man-Hours</p>
              <p className="font-medium text-lg">{result.totalManHours} hrs</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Hourly Rate</p>
              <p className="font-medium text-lg">${result.hourlyRate.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              If this meeting happens daily, monthly cost would be
            </p>
            <p className="text-xl font-semibold text-orange-600 dark:text-orange-400">
              ${result.monthlyCost.toLocaleString()}
            </p>
          </div>
        </Card>
      )}

      {/* Note */}
      <p className="text-xs text-gray-400 dark:text-gray-500">
        * Based on 2,080 annual work hours (40 hrs/week). Estimates only.
      </p>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💰 What is Meeting Cost Calculator?
        </h2>
        <p className="text-sm leading-relaxed">
          Meeting Cost Calculator visualizes the hidden labor costs of meetings.
          Enter the number of participants, meeting duration, and average salary to calculate meeting costs in dollars.
          Uses the standard 2,080 annual work hours (40 hours × 52 weeks) to derive hourly rates.
          Make better decisions about which meetings are truly necessary for productivity.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Meeting Cost Examples
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Scenario</th>
                <th className="text-left py-2 px-2">Setup</th>
                <th className="text-left py-2 px-2">Cost/Meeting</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Daily standup</td><td>5 people × 15min × $75K</td><td className="font-mono">~$45</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Team weekly</td><td>10 people × 60min × $75K</td><td className="font-mono">~$360</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Executive strategy</td><td>8 people × 120min × $150K</td><td className="font-mono">~$1,150</td></tr>
              <tr><td className="py-2 px-2 font-medium">Company all-hands</td><td>100 people × 60min × $75K</td><td className="font-mono">~$3,600</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Tips to Reduce Meeting Costs
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Minimize attendees</strong>: Include only essential decision-makers</li>
          <li><strong>Time limits</strong>: Set meetings for 30/45 minutes instead of an hour</li>
          <li><strong>Async alternatives</strong>: Use docs/Slack for updates that need no discussion</li>
          <li><strong>Standing meetings</strong>: Stand-up meetings naturally stay shorter</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Why does meeting cost matter?',
            answer: 'Meetings are invisible costs. A 5-person, 1-hour meeting consumes 5 hours of work time. Visualizing costs helps eliminate unnecessary meetings and enables better decision-making.',
          },
          {
            question: 'How is 2,080 hours calculated?',
            answer: 'It\'s the standard annual work hours: 40 hours/week × 52 weeks = 2,080 hours. Actual hours are less after holidays and PTO, so real hourly rates may be higher.',
          },
          {
            question: 'How can I get a more accurate cost?',
            answer: 'Input individual salaries instead of averages for precision. This calculator estimates using average salary. Including benefits typically adds 20-40% to actual costs.',
          },
        ]}
      />
    </div>
  );
}
