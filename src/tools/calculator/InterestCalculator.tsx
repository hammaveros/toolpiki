'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FaqSection } from '@/components/ui/FaqItem';

type CalcMode = 'basic' | 'savings' | 'compare' | 'goal';
type InterestType = 'simple' | 'compound';
type CompoundFrequency = 'monthly' | 'quarterly' | 'yearly';
type PeriodUnit = 'days' | 'months' | 'years';
type TaxType = 'taxable' | 'taxFree';
type GoalCalcType = 'period' | 'principal' | 'rate';

const TAX_RATE = 0.154; // 일반과세 15.4%

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
  basic: { label: '기본 계산', emoji: '📊' },
  savings: { label: '정기 적립', emoji: '💰' },
  compare: { label: '상품 비교', emoji: '⚖️' },
  goal: { label: '목표 역산', emoji: '🎯' },
};

export function InterestCalculator() {
  const [mode, setMode] = useState<CalcMode>('basic');

  // 기본 모드
  const [principal, setPrincipal] = useState<string>('10000000');
  const [rate, setRate] = useState<string>('5');
  const [periodValue, setPeriodValue] = useState<string>('3');
  const [periodUnit, setPeriodUnit] = useState<PeriodUnit>('years');
  const [interestType, setInterestType] = useState<InterestType>('compound');
  const [compoundFreq, setCompoundFreq] = useState<CompoundFrequency>('monthly');
  const [taxType, setTaxType] = useState<TaxType>('taxable');

  // 정기 적립 모드
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>('500000');
  const [savingsPeriod, setSavingsPeriod] = useState<string>('36');
  const [savingsRate, setSavingsRate] = useState<string>('4');

  // 비교 모드
  const [compareProducts, setCompareProducts] = useState<CompareProduct[]>([
    { id: 1, name: '상품 A', rate: '4.5', enabled: true },
    { id: 2, name: '상품 B', rate: '5.0', enabled: true },
    { id: 3, name: '상품 C', rate: '5.5', enabled: false },
  ]);
  const [comparePrincipal, setComparePrincipal] = useState<string>('10000000');
  const [comparePeriod, setComparePeriod] = useState<string>('3');

  // 목표 역산 모드
  const [goalType, setGoalType] = useState<GoalCalcType>('period');
  const [goalAmount, setGoalAmount] = useState<string>('100000000');
  const [goalPrincipal, setGoalPrincipal] = useState<string>('50000000');
  const [goalRate, setGoalRate] = useState<string>('5');
  const [goalPeriod, setGoalPeriod] = useState<string>('10');

  // 기본 모드 결과
  const basicResult = useMemo(() => {
    const P = parseInt(principal.replace(/,/g, '')) || 0;
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
          interest: Math.round(yearInterest),
          total: Math.round(P + yearInterest),
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
          interest: Math.round(yearTotal - P),
          total: Math.round(yearTotal),
        });
      }
    }

    const tax = taxType === 'taxable' ? Math.round(totalInterest * TAX_RATE) : 0;
    const afterTaxInterest = Math.round(totalInterest) - tax;
    const afterTaxFinalAmount = P + afterTaxInterest;

    return {
      principal: P, finalAmount: Math.round(finalAmount),
      totalInterest: Math.round(totalInterest), tax,
      afterTaxInterest, afterTaxFinalAmount, breakdown, periodYears: t,
    };
  }, [principal, rate, periodValue, periodUnit, interestType, compoundFreq, taxType]);

  // 정기 적립 결과
  const savingsResult = useMemo(() => {
    const monthly = parseInt(monthlyDeposit.replace(/,/g, '')) || 0;
    const months = parseInt(savingsPeriod) || 0;
    const r = (parseFloat(savingsRate) || 0) / 100 / 12;

    if (monthly <= 0 || months <= 0 || r <= 0) return null;

    // 복리 적금 공식: FV = PMT × [(1 + r)^n - 1] / r
    const totalDeposit = monthly * months;
    const futureValue = monthly * ((Math.pow(1 + r, months) - 1) / r);
    const totalInterest = futureValue - totalDeposit;
    const tax = Math.round(totalInterest * TAX_RATE);

    // 월별 내역
    const monthlyBreakdown = [];
    let accumulated = 0;
    for (let m = 1; m <= months; m++) {
      accumulated = accumulated * (1 + r) + monthly;
      if (m % 12 === 0 || m === months) {
        monthlyBreakdown.push({
          month: m,
          deposit: monthly * m,
          interest: Math.round(accumulated - monthly * m),
          total: Math.round(accumulated),
        });
      }
    }

    return {
      monthlyDeposit: monthly,
      months,
      totalDeposit,
      totalInterest: Math.round(totalInterest),
      tax,
      afterTaxInterest: Math.round(totalInterest) - tax,
      finalAmount: Math.round(futureValue),
      afterTaxFinal: Math.round(futureValue) - tax,
      breakdown: monthlyBreakdown,
    };
  }, [monthlyDeposit, savingsPeriod, savingsRate]);

  // 비교 모드 결과
  const compareResult = useMemo(() => {
    const P = parseInt(comparePrincipal.replace(/,/g, '')) || 0;
    const years = parseFloat(comparePeriod) || 0;
    if (P <= 0 || years <= 0) return null;

    return compareProducts
      .filter(p => p.enabled)
      .map(product => {
        const r = (parseFloat(product.rate) || 0) / 100;
        const finalAmount = P * Math.pow(1 + r / 12, 12 * years);
        const interest = finalAmount - P;
        const tax = Math.round(interest * TAX_RATE);
        return {
          ...product,
          principal: P,
          finalAmount: Math.round(finalAmount),
          interest: Math.round(interest),
          tax,
          afterTax: Math.round(interest) - tax,
          afterTaxFinal: P + Math.round(interest) - tax,
        };
      })
      .sort((a, b) => b.afterTaxFinal - a.afterTaxFinal);
  }, [comparePrincipal, comparePeriod, compareProducts]);

  // 목표 역산 결과
  const goalResult = useMemo(() => {
    const target = parseInt(goalAmount.replace(/,/g, '')) || 0;
    const P = parseInt(goalPrincipal.replace(/,/g, '')) || 0;
    const r = (parseFloat(goalRate) || 0) / 100;
    const years = parseFloat(goalPeriod) || 0;

    if (target <= 0) return null;

    if (goalType === 'period') {
      // 필요 기간 계산: t = ln(FV/PV) / ln(1 + r/12) / 12
      if (P <= 0 || r <= 0 || target <= P) return null;
      const monthlyRate = r / 12;
      const months = Math.log(target / P) / Math.log(1 + monthlyRate);
      const yearsNeeded = months / 12;
      return {
        type: 'period',
        yearsNeeded: yearsNeeded.toFixed(1),
        monthsNeeded: Math.ceil(months),
        principal: P,
        rate: r * 100,
        target,
      };
    } else if (goalType === 'principal') {
      // 필요 원금 계산: PV = FV / (1 + r/12)^(12*t)
      if (years <= 0 || r <= 0) return null;
      const principalNeeded = target / Math.pow(1 + r / 12, 12 * years);
      return {
        type: 'principal',
        principalNeeded: Math.ceil(principalNeeded),
        years,
        rate: r * 100,
        target,
      };
    } else {
      // 필요 이율 계산: r = 12 * [(FV/PV)^(1/(12*t)) - 1]
      if (P <= 0 || years <= 0 || target <= P) return null;
      const monthlyRate = Math.pow(target / P, 1 / (12 * years)) - 1;
      const annualRate = monthlyRate * 12 * 100;
      return {
        type: 'rate',
        rateNeeded: annualRate.toFixed(2),
        principal: P,
        years,
        target,
      };
    }
  }, [goalType, goalAmount, goalPrincipal, goalRate, goalPeriod]);

  const formatNumber = (num: number) => num.toLocaleString('ko-KR');
  const handleNumberInput = (value: string, setter: (v: string) => void) => {
    const num = value.replace(/[^0-9]/g, '');
    setter(num);
  };

  const freqLabels: Record<CompoundFrequency, string> = {
    monthly: '월 복리', quarterly: '분기 복리', yearly: '연 복리',
  };

  const updateProduct = (id: number, field: keyof CompareProduct, value: string | boolean) => {
    setCompareProducts(prev => prev.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  return (
    <div className="space-y-2">
      {/* 모드 선택 탭 */}
      <Card variant="bordered" className="p-2">
        <div className="flex gap-1 flex-wrap">
          {(Object.keys(modeLabels) as CalcMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 min-w-[80px] py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
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

      {/* 기본 계산 모드 */}
      {mode === 'basic' && (
        <>
          <Card variant="bordered" className="p-6">
            <h2 className="text-lg font-semibold mb-4">이자 계산 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">원금</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formatNumber(parseInt(principal) || 0)}
                    onChange={(e) => handleNumberInput(e.target.value, setPrincipal)}
                    placeholder="10,000,000"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">연이율</label>
                <div className="relative">
                  <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="5" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">기간</label>
                <div className="flex gap-2">
                  <Input type="number" value={periodValue} onChange={(e) => setPeriodValue(e.target.value)} placeholder="3" className="flex-1" />
                  <select value={periodUnit} onChange={(e) => setPeriodUnit(e.target.value as PeriodUnit)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <option value="years">년</option>
                    <option value="months">개월</option>
                    <option value="days">일</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">이자 방식</label>
                <div className="flex gap-2">
                  <button onClick={() => setInterestType('simple')} className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${interestType === 'simple' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>단리</button>
                  <button onClick={() => setInterestType('compound')} className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${interestType === 'compound' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>복리</button>
                </div>
              </div>
            </div>

            {interestType === 'compound' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">복리 주기</label>
                <div className="flex gap-2">
                  {(['monthly', 'quarterly', 'yearly'] as CompoundFrequency[]).map((freq) => (
                    <button key={freq} onClick={() => setCompoundFreq(freq)} className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-colors ${compoundFreq === freq ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>{freqLabels[freq]}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">세금</label>
              <div className="flex gap-2">
                <button onClick={() => setTaxType('taxable')} className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-colors ${taxType === 'taxable' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>일반과세 (15.4%)</button>
                <button onClick={() => setTaxType('taxFree')} className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-colors ${taxType === 'taxFree' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>비과세</button>
              </div>
            </div>
          </Card>

          {basicResult && (
            <Card variant="bordered" className="p-6">
              <h2 className="text-lg font-semibold mb-4">계산 결과</h2>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4 text-sm">
                {interestType === 'simple' ? (
                  <p className="text-gray-600 dark:text-gray-400">단리 공식: <span className="font-mono">A = P(1 + rt)</span></p>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">복리 공식: <span className="font-mono">A = P(1 + r/n)^(nt)</span> <span className="ml-2 text-xs">(n = {compoundFreq === 'monthly' ? 12 : compoundFreq === 'quarterly' ? 4 : 1})</span></p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500">원금</p>
                  <p className="text-xl font-bold">{formatNumber(basicResult.principal)}원</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-gray-500">세전 이자</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">+{formatNumber(basicResult.totalInterest)}원</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-500">세전 만기</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatNumber(basicResult.finalAmount)}원</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-gray-500">세금 ({taxType === 'taxable' ? '15.4%' : '0%'})</p>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">-{formatNumber(basicResult.tax)}원</p>
                </div>
                <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <p className="text-sm text-gray-500">세후 이자</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">+{formatNumber(basicResult.afterTaxInterest)}원</p>
                </div>
                <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border-2 border-blue-300 dark:border-blue-600">
                  <p className="text-sm text-gray-500">세후 실수령</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formatNumber(basicResult.afterTaxFinalAmount)}원</p>
                </div>
              </div>
              {basicResult.breakdown.length > 1 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">연도별 누적</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="py-2 px-2 text-left">연차</th>
                          <th className="py-2 px-2 text-right">원금</th>
                          <th className="py-2 px-2 text-right">누적 이자</th>
                          <th className="py-2 px-2 text-right">합계</th>
                        </tr>
                      </thead>
                      <tbody>
                        {basicResult.breakdown.map((row) => (
                          <tr key={row.year} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-2 px-2">{row.year}년차</td>
                            <td className="py-2 px-2 text-right">{formatNumber(row.principal)}</td>
                            <td className="py-2 px-2 text-right text-green-600">+{formatNumber(row.interest)}</td>
                            <td className="py-2 px-2 text-right font-medium">{formatNumber(row.total)}</td>
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

      {/* 정기 적립 모드 */}
      {mode === 'savings' && (
        <>
          <Card variant="bordered" className="p-6">
            <h2 className="text-lg font-semibold mb-4">💰 정기 적립 계산</h2>
            <p className="text-sm text-gray-500 mb-4">매월 일정 금액을 적립할 때의 복리 효과를 계산합니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">월 적립금</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formatNumber(parseInt(monthlyDeposit) || 0)}
                    onChange={(e) => handleNumberInput(e.target.value, setMonthlyDeposit)}
                    placeholder="500,000"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">적립 기간</label>
                <div className="relative">
                  <Input type="number" value={savingsPeriod} onChange={(e) => setSavingsPeriod(e.target.value)} placeholder="36" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">개월</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">연이율</label>
                <div className="relative">
                  <Input type="number" step="0.1" value={savingsRate} onChange={(e) => setSavingsRate(e.target.value)} placeholder="4" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                </div>
              </div>
            </div>
          </Card>

          {savingsResult && (
            <Card variant="bordered" className="p-6">
              <h2 className="text-lg font-semibold mb-4">적립 결과</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500">총 납입액</p>
                  <p className="text-lg font-bold">{formatNumber(savingsResult.totalDeposit)}원</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-gray-500">세전 이자</p>
                  <p className="text-lg font-bold text-green-600">+{formatNumber(savingsResult.totalInterest)}원</p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-gray-500">세금 (15.4%)</p>
                  <p className="text-lg font-bold text-red-600">-{formatNumber(savingsResult.tax)}원</p>
                </div>
                <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border-2 border-blue-300 dark:border-blue-600">
                  <p className="text-sm text-gray-500">세후 만기</p>
                  <p className="text-xl font-bold text-blue-700">{formatNumber(savingsResult.afterTaxFinal)}원</p>
                </div>
              </div>
              {savingsResult.breakdown.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">기간별 누적</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="py-2 px-2 text-left">기간</th>
                          <th className="py-2 px-2 text-right">누적 납입</th>
                          <th className="py-2 px-2 text-right">누적 이자</th>
                          <th className="py-2 px-2 text-right">합계</th>
                        </tr>
                      </thead>
                      <tbody>
                        {savingsResult.breakdown.map((row) => (
                          <tr key={row.month} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-2 px-2">{row.month}개월</td>
                            <td className="py-2 px-2 text-right">{formatNumber(row.deposit)}</td>
                            <td className="py-2 px-2 text-right text-green-600">+{formatNumber(row.interest)}</td>
                            <td className="py-2 px-2 text-right font-medium">{formatNumber(row.total)}</td>
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

      {/* 비교 모드 */}
      {mode === 'compare' && (
        <>
          <Card variant="bordered" className="p-6">
            <h2 className="text-lg font-semibold mb-4">⚖️ 상품 비교</h2>
            <p className="text-sm text-gray-500 mb-4">동일 조건에서 여러 이율의 상품을 비교합니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">원금</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formatNumber(parseInt(comparePrincipal) || 0)}
                    onChange={(e) => handleNumberInput(e.target.value, setComparePrincipal)}
                    placeholder="10,000,000"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">기간</label>
                <div className="relative">
                  <Input type="number" value={comparePeriod} onChange={(e) => setComparePeriod(e.target.value)} placeholder="3" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">년</span>
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
              <h2 className="text-lg font-semibold mb-4">비교 결과</h2>
              <div className="space-y-3">
                {compareResult.map((product, index) => (
                  <div key={product.id} className={`p-4 rounded-lg border ${index === 0 ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">
                        {index === 0 && '🏆 '}
                        {product.name} ({product.rate}%)
                      </span>
                      <span className={`text-lg font-bold ${index === 0 ? 'text-yellow-600' : 'text-blue-600'}`}>
                        {formatNumber(product.afterTaxFinal)}원
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>이자: +{formatNumber(product.interest)}원</span>
                      <span>세금: -{formatNumber(product.tax)}원</span>
                      <span>세후 이자: +{formatNumber(product.afterTax)}원</span>
                    </div>
                  </div>
                ))}
              </div>
              {compareResult.length >= 2 && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm">
                  <span className="font-medium">💡 차이: </span>
                  1위 vs 2위 = <span className="font-bold text-green-600">{formatNumber(compareResult[0].afterTaxFinal - compareResult[1].afterTaxFinal)}원</span> 차이
                </div>
              )}
            </Card>
          )}
        </>
      )}

      {/* 목표 역산 모드 */}
      {mode === 'goal' && (
        <>
          <Card variant="bordered" className="p-6">
            <h2 className="text-lg font-semibold mb-4">🎯 목표 금액 역산</h2>
            <p className="text-sm text-gray-500 mb-4">목표 금액 달성에 필요한 조건을 역산합니다.</p>

            <div className="flex gap-2 mb-4">
              {[
                { type: 'period' as GoalCalcType, label: '필요 기간' },
                { type: 'principal' as GoalCalcType, label: '필요 원금' },
                { type: 'rate' as GoalCalcType, label: '필요 이율' },
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">목표 금액</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formatNumber(parseInt(goalAmount) || 0)}
                    onChange={(e) => handleNumberInput(e.target.value, setGoalAmount)}
                    placeholder="100,000,000"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
                </div>
              </div>

              {goalType !== 'principal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">원금</label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={formatNumber(parseInt(goalPrincipal) || 0)}
                      onChange={(e) => handleNumberInput(e.target.value, setGoalPrincipal)}
                      placeholder="50,000,000"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
                  </div>
                </div>
              )}

              {goalType !== 'rate' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">연이율</label>
                  <div className="relative">
                    <Input type="number" step="0.1" value={goalRate} onChange={(e) => setGoalRate(e.target.value)} placeholder="5" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                  </div>
                </div>
              )}

              {goalType !== 'period' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">기간</label>
                  <div className="relative">
                    <Input type="number" value={goalPeriod} onChange={(e) => setGoalPeriod(e.target.value)} placeholder="10" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">년</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {goalResult && (
            <Card variant="bordered" className="p-6">
              <h2 className="text-lg font-semibold mb-4">역산 결과</h2>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                {goalResult.type === 'period' && (
                  <>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {formatNumber(goalResult.principal!)}원을 연 {goalResult.rate}%로 굴려서<br />
                      {formatNumber(goalResult.target)}원을 만들려면
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      약 {goalResult.yearsNeeded}년
                    </p>
                    <p className="text-sm text-gray-500 mt-1">({goalResult.monthsNeeded}개월)</p>
                  </>
                )}
                {goalResult.type === 'principal' && (
                  <>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      연 {goalResult.rate}%로 {goalResult.years}년 후<br />
                      {formatNumber(goalResult.target)}원을 만들려면
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatNumber(goalResult.principalNeeded!)}원
                    </p>
                    <p className="text-sm text-gray-500 mt-1">필요</p>
                  </>
                )}
                {goalResult.type === 'rate' && (
                  <>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {formatNumber(goalResult.principal!)}원을 {goalResult.years}년 후<br />
                      {formatNumber(goalResult.target)}원으로 만들려면
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      연 {goalResult.rateNeeded}%
                    </p>
                    <p className="text-sm text-gray-500 mt-1">필요</p>
                  </>
                )}
              </div>
            </Card>
          )}
        </>
      )}

      {/* 안내 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 단리: 원금에만 이자가 붙음 / 복리: 이자에도 이자가 붙음</p>
        <p>• 일반과세 15.4% = 이자소득세 14% + 지방소득세 1.4%</p>
        <p>• 정기 적립: 월 복리로 계산 (적금 방식)</p>
        <p className="text-yellow-600 dark:text-yellow-500">※ 실제 금융상품은 수수료, 우대금리 등에 따라 달라질 수 있습니다.</p>
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
          💵 이자 계산기란?
        </h2>
        <p className="text-sm leading-relaxed">
          이자 계산기는 원금, 이율, 기간을 입력해 단리/복리 이자와 만기 수령액을 계산하는 도구입니다.
          예금, 적금, CMA, 채권, 투자 수익률 등 다양한 금융상품의 이자를 미리 계산할 수 있습니다.
          정기 적립 모드로 적금의 복리 효과를 확인하고, 상품 비교로 최적의 선택을 하세요.
          목표 역산 기능으로 필요한 원금, 이율, 기간을 역으로 계산할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 단리 vs 복리 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">구분</th>
                <th className="text-left py-2 px-2">단리 (Simple)</th>
                <th className="text-left py-2 px-2">복리 (Compound)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">이자 계산</td><td>원금에만 이자 발생</td><td>원금 + 이자에 이자 발생</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">공식</td><td className="font-mono">A = P(1 + rt)</td><td className="font-mono">A = P(1 + r/n)^(nt)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">장기 수익</td><td>선형 증가</td><td>기하급수적 증가</td></tr>
              <tr><td className="py-2 px-2 font-medium">주로 사용</td><td>채권 이자, 단기 대출</td><td>예금, 적금, 투자</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 이자 계산 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>복리 주기</strong>: 월복리 {">"} 분기복리 {">"} 연복리 (같은 이율이라면 복리 주기가 짧을수록 유리)</li>
          <li><strong>세금 고려</strong>: 이자소득세 15.4% (일반과세)가 자동 적용됨</li>
          <li><strong>72의 법칙</strong>: 72 ÷ 연이율 = 원금 2배 되는 기간 (예: 6% → 12년)</li>
          <li><strong>실효이율 확인</strong>: 복리는 명목이율보다 실효이율이 높음</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '예금 금리 5%면 1억 원 넣으면 얼마 받나요?',
            answer: '1년 만기 예금 기준, 세전 이자 500만 원에서 세금 15.4%(77만 원)를 빼면 세후 약 423만 원의 이자를 받습니다. 복리 예금이면 조금 더 높습니다.',
          },
          {
            question: '적금과 예금 이자 계산이 왜 다른가요?',
            answer: '예금은 일시금을 예치해 전액에 이자가 붙지만, 적금은 매월 납입하므로 평균 예치 기간이 절반입니다. 같은 금리라면 예금 이자가 약 2배 높습니다.',
          },
          {
            question: '비과세 상품은 뭔가요?',
            answer: 'ISA, 청년희망적금, 조합예금 등 일정 조건 충족 시 이자소득세 15.4%가 면제됩니다. 계산기에서 비과세 옵션으로 시뮬레이션 가능합니다.',
          },
        ]}
      />
    </div>
  );
}
