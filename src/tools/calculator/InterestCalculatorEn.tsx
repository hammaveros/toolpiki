'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

type CalcMode = 'basic' | 'savings' | 'compare' | 'goal';
type InterestType = 'simple' | 'compound';
type CompoundFrequency = 'monthly' | 'quarterly' | 'yearly';
type PeriodUnit = 'days' | 'months' | 'years';
type TaxType = 'taxable' | 'taxFree';
type GoalCalcType = 'period' | 'principal' | 'rate';

const TAX_RATE = 0.15; // 15% tax rate (general)

interface YearlyBreakdown {
  year: number;
  principal: number;
  interest: number;
  total: number;
}

interface CompareProduct {
  id: number;
  name: string;
  rate: string;
  enabled: boolean;
}

const modeLabels: Record<CalcMode, { label: string; emoji: string }> = {
  basic: { label: 'Basic', emoji: '📊' },
  savings: { label: 'Savings', emoji: '💰' },
  compare: { label: 'Compare', emoji: '⚖️' },
  goal: { label: 'Goal', emoji: '🎯' },
};

export function InterestCalculatorEn() {
  const [mode, setMode] = useState<CalcMode>('basic');

  // Basic mode
  const [principal, setPrincipal] = useState<string>('10000');
  const [rate, setRate] = useState<string>('5');
  const [periodValue, setPeriodValue] = useState<string>('3');
  const [periodUnit, setPeriodUnit] = useState<PeriodUnit>('years');
  const [interestType, setInterestType] = useState<InterestType>('compound');
  const [compoundFreq, setCompoundFreq] = useState<CompoundFrequency>('monthly');
  const [taxType, setTaxType] = useState<TaxType>('taxFree');

  // Savings mode
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>('500');
  const [savingsPeriod, setSavingsPeriod] = useState<string>('36');
  const [savingsRate, setSavingsRate] = useState<string>('4');

  // Compare mode
  const [compareProducts, setCompareProducts] = useState<CompareProduct[]>([
    { id: 1, name: 'Product A', rate: '4.5', enabled: true },
    { id: 2, name: 'Product B', rate: '5.0', enabled: true },
    { id: 3, name: 'Product C', rate: '5.5', enabled: false },
  ]);
  const [comparePrincipal, setComparePrincipal] = useState<string>('10000');
  const [comparePeriod, setComparePeriod] = useState<string>('3');

  // Goal mode
  const [goalType, setGoalType] = useState<GoalCalcType>('period');
  const [goalAmount, setGoalAmount] = useState<string>('100000');
  const [goalPrincipal, setGoalPrincipal] = useState<string>('50000');
  const [goalRate, setGoalRate] = useState<string>('5');
  const [goalPeriod, setGoalPeriod] = useState<string>('10');

  // Basic mode result
  const basicResult = useMemo(() => {
    const P = parseFloat(principal.replace(/,/g, '')) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const period = parseFloat(periodValue) || 0;

    if (P <= 0 || r <= 0 || period <= 0) return null;

    let t: number;
    if (periodUnit === 'days') t = period / 365;
    else if (periodUnit === 'months') t = period / 12;
    else t = period;

    let finalAmount: number;
    let totalInterest: number;
    const breakdown: YearlyBreakdown[] = [];

    if (interestType === 'simple') {
      totalInterest = P * r * t;
      finalAmount = P + totalInterest;
      for (let year = 1; year <= Math.ceil(t); year++) {
        const yearFraction = Math.min(year, t);
        const yearInterest = P * r * yearFraction;
        breakdown.push({
          year, principal: P,
          interest: Math.round(yearInterest * 100) / 100,
          total: Math.round((P + yearInterest) * 100) / 100,
        });
      }
    } else {
      let n: number;
      switch (compoundFreq) {
        case 'monthly': n = 12; break;
        case 'quarterly': n = 4; break;
        case 'yearly': n = 1; break;
      }
      finalAmount = P * Math.pow(1 + r / n, n * t);
      totalInterest = finalAmount - P;
      for (let year = 1; year <= Math.ceil(t); year++) {
        const yearFraction = Math.min(year, t);
        const yearTotal = P * Math.pow(1 + r / n, n * yearFraction);
        breakdown.push({
          year, principal: P,
          interest: Math.round((yearTotal - P) * 100) / 100,
          total: Math.round(yearTotal * 100) / 100,
        });
      }
    }

    const tax = taxType === 'taxable' ? Math.round(totalInterest * TAX_RATE * 100) / 100 : 0;
    const afterTaxInterest = Math.round((totalInterest - tax) * 100) / 100;
    const afterTaxFinalAmount = Math.round((P + afterTaxInterest) * 100) / 100;

    return {
      principal: P, finalAmount: Math.round(finalAmount * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100, tax,
      afterTaxInterest, afterTaxFinalAmount, breakdown, periodYears: t,
    };
  }, [principal, rate, periodValue, periodUnit, interestType, compoundFreq, taxType]);

  // Savings result
  const savingsResult = useMemo(() => {
    const monthly = parseFloat(monthlyDeposit.replace(/,/g, '')) || 0;
    const months = parseInt(savingsPeriod) || 0;
    const r = (parseFloat(savingsRate) || 0) / 100 / 12;

    if (monthly <= 0 || months <= 0 || r <= 0) return null;

    const totalDeposit = monthly * months;
    const futureValue = monthly * ((Math.pow(1 + r, months) - 1) / r);
    const totalInterest = futureValue - totalDeposit;
    const tax = Math.round(totalInterest * TAX_RATE * 100) / 100;

    const monthlyBreakdown = [];
    let accumulated = 0;
    for (let m = 1; m <= months; m++) {
      accumulated = accumulated * (1 + r) + monthly;
      if (m % 12 === 0 || m === months) {
        monthlyBreakdown.push({
          month: m,
          deposit: Math.round(monthly * m * 100) / 100,
          interest: Math.round((accumulated - monthly * m) * 100) / 100,
          total: Math.round(accumulated * 100) / 100,
        });
      }
    }

    return {
      monthlyDeposit: monthly,
      months,
      totalDeposit: Math.round(totalDeposit * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      tax,
      afterTaxInterest: Math.round((totalInterest - tax) * 100) / 100,
      finalAmount: Math.round(futureValue * 100) / 100,
      afterTaxFinal: Math.round((futureValue - tax) * 100) / 100,
      breakdown: monthlyBreakdown,
    };
  }, [monthlyDeposit, savingsPeriod, savingsRate]);

  // Compare result
  const compareResult = useMemo(() => {
    const P = parseFloat(comparePrincipal.replace(/,/g, '')) || 0;
    const years = parseFloat(comparePeriod) || 0;
    if (P <= 0 || years <= 0) return null;

    return compareProducts
      .filter(p => p.enabled)
      .map(product => {
        const r = (parseFloat(product.rate) || 0) / 100;
        const finalAmount = P * Math.pow(1 + r / 12, 12 * years);
        const interest = finalAmount - P;
        const tax = Math.round(interest * TAX_RATE * 100) / 100;
        return {
          ...product,
          principal: P,
          finalAmount: Math.round(finalAmount * 100) / 100,
          interest: Math.round(interest * 100) / 100,
          tax,
          afterTax: Math.round((interest - tax) * 100) / 100,
          afterTaxFinal: Math.round((P + interest - tax) * 100) / 100,
        };
      })
      .sort((a, b) => b.afterTaxFinal - a.afterTaxFinal);
  }, [comparePrincipal, comparePeriod, compareProducts]);

  // Goal result
  const goalResult = useMemo(() => {
    const target = parseFloat(goalAmount.replace(/,/g, '')) || 0;
    const P = parseFloat(goalPrincipal.replace(/,/g, '')) || 0;
    const r = (parseFloat(goalRate) || 0) / 100;
    const years = parseFloat(goalPeriod) || 0;

    if (target <= 0) return null;

    if (goalType === 'period') {
      if (P <= 0 || r <= 0 || target <= P) return null;
      const monthlyRate = r / 12;
      const months = Math.log(target / P) / Math.log(1 + monthlyRate);
      const yearsNeeded = months / 12;
      return {
        type: 'period',
        yearsNeeded: yearsNeeded.toFixed(1),
        monthsNeeded: Math.ceil(months),
        principal: P, rate: r * 100, target,
      };
    } else if (goalType === 'principal') {
      if (years <= 0 || r <= 0) return null;
      const principalNeeded = target / Math.pow(1 + r / 12, 12 * years);
      return {
        type: 'principal',
        principalNeeded: Math.ceil(principalNeeded * 100) / 100,
        years, rate: r * 100, target,
      };
    } else {
      if (P <= 0 || years <= 0 || target <= P) return null;
      const monthlyRate = Math.pow(target / P, 1 / (12 * years)) - 1;
      const annualRate = monthlyRate * 12 * 100;
      return {
        type: 'rate',
        rateNeeded: annualRate.toFixed(2),
        principal: P, years, target,
      };
    }
  }, [goalType, goalAmount, goalPrincipal, goalRate, goalPeriod]);

  const formatCurrency = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const handleNumberInput = (value: string, setter: (v: string) => void) => {
    const num = value.replace(/[^0-9.]/g, '');
    setter(num);
  };

  const freqLabels: Record<CompoundFrequency, string> = {
    monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Yearly',
  };

  const updateProduct = (id: number, field: keyof CompareProduct, value: string | boolean) => {
    setCompareProducts(prev => prev.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  return (
    <div className="space-y-2">
      {/* Mode Selection */}
      <Card variant="bordered" className="p-2">
        <div className="flex gap-1 flex-wrap">
          {(Object.keys(modeLabels) as CalcMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 min-w-[70px] py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {modeLabels[m].emoji} {modeLabels[m].label}
            </button>
          ))}
        </div>
      </Card>

      {/* Basic Mode */}
      {mode === 'basic' && (
        <>
          <Card variant="bordered" className="p-6">
            <h2 className="text-lg font-semibold mb-4">Interest Calculator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Principal</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <Input
                    type="text"
                    value={formatCurrency(parseFloat(principal) || 0)}
                    onChange={(e) => handleNumberInput(e.target.value, setPrincipal)}
                    placeholder="10,000"
                    className="pl-7"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Rate</label>
                <div className="relative">
                  <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="5" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Period</label>
                <div className="flex gap-2">
                  <Input type="number" value={periodValue} onChange={(e) => setPeriodValue(e.target.value)} placeholder="3" className="flex-1" />
                  <select value={periodUnit} onChange={(e) => setPeriodUnit(e.target.value as PeriodUnit)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interest Type</label>
                <div className="flex gap-2">
                  <button onClick={() => setInterestType('simple')} className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${interestType === 'simple' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>Simple</button>
                  <button onClick={() => setInterestType('compound')} className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${interestType === 'compound' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>Compound</button>
                </div>
              </div>
            </div>

            {interestType === 'compound' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Compounding</label>
                <div className="flex gap-2">
                  {(['monthly', 'quarterly', 'yearly'] as CompoundFrequency[]).map((freq) => (
                    <button key={freq} onClick={() => setCompoundFreq(freq)} className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-colors ${compoundFreq === freq ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>{freqLabels[freq]}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tax</label>
              <div className="flex gap-2">
                <button onClick={() => setTaxType('taxable')} className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-colors ${taxType === 'taxable' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>Taxable (15%)</button>
                <button onClick={() => setTaxType('taxFree')} className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-colors ${taxType === 'taxFree' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>Tax-Free</button>
              </div>
            </div>
          </Card>

          {basicResult && (
            <Card variant="bordered" className="p-6">
              <h2 className="text-lg font-semibold mb-4">Results</h2>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4 text-sm">
                {interestType === 'simple' ? (
                  <p className="text-gray-600 dark:text-gray-400">Simple: <span className="font-mono">A = P(1 + rt)</span></p>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">Compound: <span className="font-mono">A = P(1 + r/n)^(nt)</span> <span className="ml-2 text-xs">(n = {compoundFreq === 'monthly' ? 12 : compoundFreq === 'quarterly' ? 4 : 1})</span></p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500">Principal</p>
                  <p className="text-xl font-bold">${formatCurrency(basicResult.principal)}</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-gray-500">Interest</p>
                  <p className="text-xl font-bold text-green-600">+${formatCurrency(basicResult.totalInterest)}</p>
                </div>
                <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border-2 border-blue-300 dark:border-blue-600">
                  <p className="text-sm text-gray-500">Final Amount</p>
                  <p className="text-2xl font-bold text-blue-700">${formatCurrency(basicResult.afterTaxFinalAmount)}</p>
                </div>
              </div>
              {basicResult.breakdown.length > 1 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year-by-Year</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="py-2 px-2 text-left">Year</th>
                          <th className="py-2 px-2 text-right">Principal</th>
                          <th className="py-2 px-2 text-right">Interest</th>
                          <th className="py-2 px-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {basicResult.breakdown.map((row) => (
                          <tr key={row.year} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-2 px-2">Year {row.year}</td>
                            <td className="py-2 px-2 text-right">${formatCurrency(row.principal)}</td>
                            <td className="py-2 px-2 text-right text-green-600">+${formatCurrency(row.interest)}</td>
                            <td className="py-2 px-2 text-right font-medium">${formatCurrency(row.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card>
          )}
        </>
      )}

      {/* Savings Mode */}
      {mode === 'savings' && (
        <>
          <Card variant="bordered" className="p-6">
            <h2 className="text-lg font-semibold mb-4">💰 Regular Savings</h2>
            <p className="text-sm text-gray-500 mb-4">Calculate compound interest with monthly deposits.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Deposit</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <Input
                    type="text"
                    value={formatCurrency(parseFloat(monthlyDeposit) || 0)}
                    onChange={(e) => handleNumberInput(e.target.value, setMonthlyDeposit)}
                    placeholder="500"
                    className="pl-7"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Period</label>
                <div className="relative">
                  <Input type="number" value={savingsPeriod} onChange={(e) => setSavingsPeriod(e.target.value)} placeholder="36" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">months</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Rate</label>
                <div className="relative">
                  <Input type="number" step="0.1" value={savingsRate} onChange={(e) => setSavingsRate(e.target.value)} placeholder="4" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                </div>
              </div>
            </div>
          </Card>

          {savingsResult && (
            <Card variant="bordered" className="p-6">
              <h2 className="text-lg font-semibold mb-4">Savings Results</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500">Total Deposits</p>
                  <p className="text-lg font-bold">${formatCurrency(savingsResult.totalDeposit)}</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-gray-500">Interest Earned</p>
                  <p className="text-lg font-bold text-green-600">+${formatCurrency(savingsResult.totalInterest)}</p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-gray-500">Tax (15%)</p>
                  <p className="text-lg font-bold text-red-600">-${formatCurrency(savingsResult.tax)}</p>
                </div>
                <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border-2 border-blue-300 dark:border-blue-600">
                  <p className="text-sm text-gray-500">Final Amount</p>
                  <p className="text-xl font-bold text-blue-700">${formatCurrency(savingsResult.afterTaxFinal)}</p>
                </div>
              </div>
              {savingsResult.breakdown.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Progress</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="py-2 px-2 text-left">Month</th>
                          <th className="py-2 px-2 text-right">Deposits</th>
                          <th className="py-2 px-2 text-right">Interest</th>
                          <th className="py-2 px-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {savingsResult.breakdown.map((row) => (
                          <tr key={row.month} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-2 px-2">{row.month} mo</td>
                            <td className="py-2 px-2 text-right">${formatCurrency(row.deposit)}</td>
                            <td className="py-2 px-2 text-right text-green-600">+${formatCurrency(row.interest)}</td>
                            <td className="py-2 px-2 text-right font-medium">${formatCurrency(row.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card>
          )}
        </>
      )}

      {/* Compare Mode */}
      {mode === 'compare' && (
        <>
          <Card variant="bordered" className="p-6">
            <h2 className="text-lg font-semibold mb-4">⚖️ Compare Products</h2>
            <p className="text-sm text-gray-500 mb-4">Compare different interest rates side by side.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Principal</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <Input
                    type="text"
                    value={formatCurrency(parseFloat(comparePrincipal) || 0)}
                    onChange={(e) => handleNumberInput(e.target.value, setComparePrincipal)}
                    placeholder="10,000"
                    className="pl-7"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Period</label>
                <div className="relative">
                  <Input type="number" value={comparePeriod} onChange={(e) => setComparePeriod(e.target.value)} placeholder="3" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">years</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {compareProducts.map((product) => (
                <div key={product.id} className={`flex items-center gap-3 p-3 rounded-lg border ${product.enabled ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 opacity-50'}`}>
                  <input type="checkbox" checked={product.enabled} onChange={(e) => updateProduct(product.id, 'enabled', e.target.checked)} className="w-5 h-5" />
                  <Input value={product.name} onChange={(e) => updateProduct(product.id, 'name', e.target.value)} className="flex-1" />
                  <div className="relative w-24">
                    <Input type="number" step="0.1" value={product.rate} onChange={(e) => updateProduct(product.id, 'rate', e.target.value)} />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {compareResult && compareResult.length > 0 && (
            <Card variant="bordered" className="p-6">
              <h2 className="text-lg font-semibold mb-4">Comparison Results</h2>
              <div className="space-y-3">
                {compareResult.map((product, index) => (
                  <div key={product.id} className={`p-4 rounded-lg border ${index === 0 ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">
                        {index === 0 && '🏆 '}
                        {product.name} ({product.rate}%)
                      </span>
                      <span className={`text-lg font-bold ${index === 0 ? 'text-yellow-600' : 'text-blue-600'}`}>
                        ${formatCurrency(product.afterTaxFinal)}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>Interest: +${formatCurrency(product.interest)}</span>
                      <span>Tax: -${formatCurrency(product.tax)}</span>
                    </div>
                  </div>
                ))}
              </div>
              {compareResult.length >= 2 && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm">
                  <span className="font-medium">💡 Difference: </span>
                  1st vs 2nd = <span className="font-bold text-green-600">${formatCurrency(compareResult[0].afterTaxFinal - compareResult[1].afterTaxFinal)}</span>
                </div>
              )}
            </Card>
          )}
        </>
      )}

      {/* Goal Mode */}
      {mode === 'goal' && (
        <>
          <Card variant="bordered" className="p-6">
            <h2 className="text-lg font-semibold mb-4">🎯 Goal Calculator</h2>
            <p className="text-sm text-gray-500 mb-4">Calculate what you need to reach your financial goal.</p>

            <div className="flex gap-2 mb-4">
              {[
                { type: 'period' as GoalCalcType, label: 'Time Needed' },
                { type: 'principal' as GoalCalcType, label: 'Amount Needed' },
                { type: 'rate' as GoalCalcType, label: 'Rate Needed' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setGoalType(item.type)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-colors ${goalType === item.type ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <Input
                    type="text"
                    value={formatCurrency(parseFloat(goalAmount) || 0)}
                    onChange={(e) => handleNumberInput(e.target.value, setGoalAmount)}
                    placeholder="100,000"
                    className="pl-7"
                  />
                </div>
              </div>

              {goalType !== 'principal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Starting Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <Input
                      type="text"
                      value={formatCurrency(parseFloat(goalPrincipal) || 0)}
                      onChange={(e) => handleNumberInput(e.target.value, setGoalPrincipal)}
                      placeholder="50,000"
                      className="pl-7"
                    />
                  </div>
                </div>
              )}

              {goalType !== 'rate' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Rate</label>
                  <div className="relative">
                    <Input type="number" step="0.1" value={goalRate} onChange={(e) => setGoalRate(e.target.value)} placeholder="5" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                  </div>
                </div>
              )}

              {goalType !== 'period' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Period</label>
                  <div className="relative">
                    <Input type="number" value={goalPeriod} onChange={(e) => setGoalPeriod(e.target.value)} placeholder="10" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">years</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {goalResult && (
            <Card variant="bordered" className="p-6">
              <h2 className="text-lg font-semibold mb-4">Goal Analysis</h2>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                {goalResult.type === 'period' && (
                  <>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      To grow ${formatCurrency(goalResult.principal!)} to ${formatCurrency(goalResult.target)}<br />
                      at {goalResult.rate}% annual rate:
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      ~{goalResult.yearsNeeded} years
                    </p>
                    <p className="text-sm text-gray-500 mt-1">({goalResult.monthsNeeded} months)</p>
                  </>
                )}
                {goalResult.type === 'principal' && (
                  <>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      To have ${formatCurrency(goalResult.target)} in {goalResult.years} years<br />
                      at {goalResult.rate}% annual rate:
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      ${formatCurrency(goalResult.principalNeeded!)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">starting amount needed</p>
                  </>
                )}
                {goalResult.type === 'rate' && (
                  <>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      To grow ${formatCurrency(goalResult.principal!)} to ${formatCurrency(goalResult.target)}<br />
                      in {goalResult.years} years:
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {goalResult.rateNeeded}% annually
                    </p>
                    <p className="text-sm text-gray-500 mt-1">rate needed</p>
                  </>
                )}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Help */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Simple: Interest on principal only / Compound: Interest on interest</p>
        <p>• More frequent compounding = higher returns</p>
        <p>• Savings mode: Monthly deposits with compound interest</p>
        <p className="text-yellow-600 dark:text-yellow-500">Note: Actual returns may vary due to taxes, fees, and market conditions.</p>
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
          💵 What is Interest Calculator?
        </h2>
        <p className="text-sm leading-relaxed">
          Interest Calculator computes simple and compound interest along with maturity amounts using principal, rate, and time period.
          Use it for savings accounts, CDs, bonds, investments, and any financial planning that involves interest.
          The savings mode calculates compound interest with regular monthly deposits, while the compare mode helps find the best product.
          Goal calculator works backwards to find required principal, rate, or time to reach your target amount.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Simple vs Compound Interest
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Aspect</th>
                <th className="text-left py-2 px-2">Simple Interest</th>
                <th className="text-left py-2 px-2">Compound Interest</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Calculation</td><td>Interest on principal only</td><td>Interest on principal + interest</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Formula</td><td className="font-mono">A = P(1 + rt)</td><td className="font-mono">A = P(1 + r/n)^(nt)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Long-term Growth</td><td>Linear increase</td><td>Exponential increase</td></tr>
              <tr><td className="py-2 px-2 font-medium">Common Uses</td><td>Bond yields, short loans</td><td>Savings, CDs, investments</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Interest Calculation Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Compounding frequency</strong>: Monthly {">"} Quarterly {">"} Yearly (more frequent = higher returns)</li>
          <li><strong>Tax consideration</strong>: Interest income is typically taxed (15% in this calculator)</li>
          <li><strong>Rule of 72</strong>: 72 ÷ annual rate = years to double money (e.g., 6% → 12 years)</li>
          <li><strong>Effective rate</strong>: APY (Annual Percentage Yield) accounts for compounding</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'How much interest will I earn on $10,000 at 5%?',
            answer: 'For a 1-year CD at 5% with monthly compounding, you would earn about $511.62 before taxes. After 15% tax, you receive approximately $434.88 in interest.',
          },
          {
            question: 'Why does compound interest grow faster?',
            answer: 'Compound interest earns interest on your interest. Over time, this creates exponential growth as each period adds interest on an increasingly larger balance.',
          },
          {
            question: 'What is APY vs APR?',
            answer: 'APR (Annual Percentage Rate) is the simple interest rate. APY (Annual Percentage Yield) includes the effect of compounding, making it higher. Always compare APYs for savings products.',
          },
        ]}
      />
    </div>
  );
}
