'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';

const TIP_PRESETS = [
  { label: '15%', value: 15 },
  { label: '18%', value: 18 },
  { label: '20%', value: 20 },
  { label: '25%', value: 25 },
];

export function TipCalculator() {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState(20);
  const [customTip, setCustomTip] = useState('');
  const [splitCount, setSplitCount] = useState(1);
  const [isCustom, setIsCustom] = useState(false);

  const bill = parseFloat(billAmount) || 0;
  const tip = isCustom ? (parseFloat(customTip) || 0) : tipPercent;

  const calculations = useMemo(() => {
    const tipAmount = bill * (tip / 100);
    const total = bill + tipAmount;
    const perPerson = splitCount > 0 ? total / splitCount : total;
    const tipPerPerson = splitCount > 0 ? tipAmount / splitCount : tipAmount;

    return {
      tipAmount,
      total,
      perPerson,
      tipPerPerson,
    };
  }, [bill, tip, splitCount]);

  const handlePresetClick = (value: number) => {
    setTipPercent(value);
    setIsCustom(false);
    setCustomTip('');
  };

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value);
    setIsCustom(true);
  };

  const handleReset = () => {
    setBillAmount('');
    setTipPercent(20);
    setCustomTip('');
    setSplitCount(1);
    setIsCustom(false);
  };

  return (
    <div className="space-y-2">
      {/* Bill Amount */}
      <Card variant="bordered" className="p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bill Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
          <input
            type="number"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-3 text-2xl font-semibold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Tip Selection */}
      <Card variant="bordered" className="p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Tip Percentage
        </label>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {TIP_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetClick(preset.value)}
              className={`py-3 rounded-lg font-medium transition-all ${
                !isCustom && tipPercent === preset.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Custom Tip %
          </label>
          <div className="relative">
            <input
              type="number"
              value={customTip}
              onChange={(e) => handleCustomTipChange(e.target.value)}
              placeholder="Custom"
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isCustom
                  ? 'border-blue-500 ring-2 ring-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
          </div>
        </div>
      </Card>

      {/* Split */}
      <Card variant="bordered" className="p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Split Between
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
            className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 text-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            -
          </button>
          <span className="text-3xl font-bold text-gray-900 dark:text-white w-12 text-center">
            {splitCount}
          </span>
          <button
            onClick={() => setSplitCount(splitCount + 1)}
            className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 text-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            +
          </button>
          <span className="text-gray-500 dark:text-gray-400">
            {splitCount === 1 ? 'person' : 'people'}
          </span>
        </div>
      </Card>

      {/* Results */}
      <Card variant="bordered" className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Tip Amount</span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              ${calculations.tipAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Total</span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              ${calculations.total.toFixed(2)}
            </span>
          </div>

          {splitCount > 1 && (
            <>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Tip per Person</span>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  ${calculations.tipPerPerson.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 -mx-4">
                <span className="font-medium text-gray-900 dark:text-white">Per Person</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${calculations.perPerson.toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>

        <Button
          variant="secondary"
          onClick={handleReset}
          className="w-full mt-4"
        >
          Reset
        </Button>
      </Card>

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>💡 In the US, 15-20% tip is standard for good service</p>
        <p>💡 25%+ is for exceptional service</p>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💵 What is Tip Calculator?
        </h2>
        <p className="text-sm leading-relaxed">
          Tip Calculator is an essential tool for calculating gratuity at restaurants, cafes, and service establishments.
          Simply enter your bill amount and select a tip percentage to instantly see the tip amount and total.
          The bill split feature divides costs evenly among multiple people, perfect for group dining.
          Preset buttons for common US tipping rates (15%, 18%, 20%, 25%) make quick selections easy.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 US Tipping Guidelines by Service
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Service Type</th>
                <th className="text-left py-2 px-2">Standard</th>
                <th className="text-left py-2 px-2">Excellent</th>
                <th className="text-left py-2 px-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Restaurant</td><td>15-20%</td><td>20-25%</td><td>Based on pre-tax amount</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Bar/Bartender</td><td>$1-2/drink</td><td>15-20%</td><td>Per drink or tab total</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Delivery</td><td>15-20%</td><td>20%+</td><td>Consider weather/distance</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Taxi/Rideshare</td><td>15-20%</td><td>20%+</td><td>Round up for short rides</td></tr>
              <tr><td className="py-2 px-2 font-medium">Hair Salon</td><td>15-20%</td><td>20-25%</td><td>Per individual stylist</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Tipping Etiquette Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Calculate on pre-tax amount</strong>: Tip should be based on subtotal, not the tax-included total</li>
          <li><strong>Round up for convenience</strong>: $18.50 tip can be rounded to $19 or $20</li>
          <li><strong>Consider service quality</strong>: 15% for adequate, 20%+ for exceptional service</li>
          <li><strong>Large parties</strong>: Many restaurants auto-add 18-20% gratuity for groups of 6+</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Should I tip on the pre-tax or post-tax amount?',
            answer: 'Traditionally, tips are calculated on the pre-tax subtotal. However, many people tip on the total including tax for convenience. Either is acceptable.',
          },
          {
            question: 'How much should I tip for takeout orders?',
            answer: 'Takeout tipping is optional but increasingly common. 10-15% is typical if you want to show appreciation for the staff preparing your order.',
          },
          {
            question: 'Is tipping mandatory in the United States?',
            answer: 'While not legally required, tipping is a strong social expectation in the US. Service workers often rely on tips as a significant portion of their income, as base wages are lower for tipped positions.',
          },
        ]}
      />
    </div>
  );
}
