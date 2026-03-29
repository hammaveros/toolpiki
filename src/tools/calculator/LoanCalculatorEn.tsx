'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

type RepaymentType = 'equal-payment' | 'equal-principal' | 'bullet';

interface ScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export function LoanCalculatorEn() {
  const [principal, setPrincipal] = useState<string>('100000');
  const [rate, setRate] = useState<string>('6.5');
  const [termValue, setTermValue] = useState<string>('30');
  const [termUnit, setTermUnit] = useState<'months' | 'years'>('years');
  const [repaymentType, setRepaymentType] = useState<RepaymentType>('equal-payment');
  const [gracePeriod, setGracePeriod] = useState<string>('0');
  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo(() => {
    const P = parseFloat(principal.replace(/,/g, '')) || 0;
    const annualRate = parseFloat(rate) || 0;
    const monthlyRate = annualRate / 100 / 12;
    const termMonths = termUnit === 'years' ? (parseInt(termValue) || 0) * 12 : (parseInt(termValue) || 0);
    const grace = parseInt(gracePeriod) || 0;
    const repaymentMonths = termMonths - grace;

    if (P <= 0 || annualRate <= 0 || termMonths <= 0 || repaymentMonths <= 0) {
      return null;
    }

    const schedule: ScheduleRow[] = [];
    let totalInterest = 0;
    let balance = P;

    // Grace period
    for (let i = 1; i <= grace; i++) {
      const interest = balance * monthlyRate;
      totalInterest += interest;
      schedule.push({
        month: i,
        payment: Math.round(interest * 100) / 100,
        principal: 0,
        interest: Math.round(interest * 100) / 100,
        balance: Math.round(balance * 100) / 100,
      });
    }

    // Repayment period
    if (repaymentType === 'equal-payment') {
      const n = repaymentMonths;
      const r = monthlyRate;
      const monthlyPayment = balance * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

      for (let i = grace + 1; i <= termMonths; i++) {
        const interest = balance * monthlyRate;
        const principalPayment = monthlyPayment - interest;
        balance = Math.max(0, balance - principalPayment);
        totalInterest += interest;

        schedule.push({
          month: i,
          payment: Math.round((i === termMonths ? principalPayment + interest + balance : monthlyPayment) * 100) / 100,
          principal: Math.round((i === termMonths ? principalPayment + balance : principalPayment) * 100) / 100,
          interest: Math.round(interest * 100) / 100,
          balance: i === termMonths ? 0 : Math.round(balance * 100) / 100,
        });
      }
    } else if (repaymentType === 'equal-principal') {
      const monthlyPrincipal = balance / repaymentMonths;

      for (let i = grace + 1; i <= termMonths; i++) {
        const interest = balance * monthlyRate;
        const isLast = i === termMonths;
        const principalPayment = isLast ? balance : monthlyPrincipal;
        balance = Math.max(0, balance - principalPayment);
        totalInterest += interest;

        schedule.push({
          month: i,
          payment: Math.round((principalPayment + interest) * 100) / 100,
          principal: Math.round(principalPayment * 100) / 100,
          interest: Math.round(interest * 100) / 100,
          balance: Math.round(balance * 100) / 100,
        });
      }
    } else {
      for (let i = grace + 1; i < termMonths; i++) {
        const interest = balance * monthlyRate;
        totalInterest += interest;

        schedule.push({
          month: i,
          payment: Math.round(interest * 100) / 100,
          principal: 0,
          interest: Math.round(interest * 100) / 100,
          balance: Math.round(balance * 100) / 100,
        });
      }

      const lastInterest = balance * monthlyRate;
      totalInterest += lastInterest;
      schedule.push({
        month: termMonths,
        payment: Math.round((balance + lastInterest) * 100) / 100,
        principal: Math.round(balance * 100) / 100,
        interest: Math.round(lastInterest * 100) / 100,
        balance: 0,
      });
    }

    const firstPayment = schedule[grace]?.payment || 0;
    const totalPayment = P + totalInterest;

    return {
      firstPayment: Math.round(firstPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      schedule,
      termMonths,
    };
  }, [principal, rate, termValue, termUnit, repaymentType, gracePeriod]);

  const formatCurrency = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handlePrincipalChange = (value: string) => {
    const num = value.replace(/[^0-9.]/g, '');
    setPrincipal(num);
  };

  const downloadCSV = () => {
    if (!result) return;

    const headers = ['Month', 'Payment', 'Principal', 'Interest', 'Balance'];
    const rows = result.schedule.map(row => [
      row.month,
      row.payment,
      row.principal,
      row.interest,
      row.balance,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'loan-schedule.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const repaymentTypes: { value: RepaymentType; label: string; desc: string }[] = [
    { value: 'equal-payment', label: 'Fixed Payment', desc: 'Same payment each month' },
    { value: 'equal-principal', label: 'Fixed Principal', desc: 'Principal fixed, interest decreases' },
    { value: 'bullet', label: 'Interest Only', desc: 'Pay principal at maturity' },
  ];

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-6">
        <h2 className="text-lg font-semibold mb-4">Loan Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Loan Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <Input
                type="text"
                value={formatCurrency(parseFloat(principal) || 0)}
                onChange={(e) => handlePrincipalChange(e.target.value)}
                placeholder="100,000"
                className="pl-7"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Annual Interest Rate
            </label>
            <div className="relative">
              <Input
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="6.5"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Loan Term
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={termValue}
                onChange={(e) => setTermValue(e.target.value)}
                placeholder="30"
                className="flex-1"
              />
              <select
                value={termUnit}
                onChange={(e) => setTermUnit(e.target.value as 'months' | 'years')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Grace Period (months)
            </label>
            <Input
              type="number"
              value={gracePeriod}
              onChange={(e) => setGracePeriod(e.target.value)}
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Interest-only period</p>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Repayment Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {repaymentTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setRepaymentType(type.value)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  repaymentType === type.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <p className="font-medium text-sm">{type.label}</p>
                <p className="text-xs text-gray-500">{type.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {result && (
        <Card variant="bordered" className="p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-500">Monthly Payment</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${formatCurrency(result.firstPayment)}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500">Total Interest</p>
              <p className="text-2xl font-bold text-red-500">
                ${formatCurrency(result.totalInterest)}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500">Total Payment</p>
              <p className="text-2xl font-bold">
                ${formatCurrency(result.totalPayment)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowSchedule(!showSchedule)}
            >
              {showSchedule ? 'Hide Schedule' : 'View Schedule'}
            </Button>
            <Button variant="secondary" onClick={downloadCSV}>
              Download CSV
            </Button>
          </div>

          {showSchedule && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 px-2 text-left">Month</th>
                    <th className="py-2 px-2 text-right">Payment</th>
                    <th className="py-2 px-2 text-right">Principal</th>
                    <th className="py-2 px-2 text-right">Interest</th>
                    <th className="py-2 px-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.month} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 px-2">{row.month}</td>
                      <td className="py-2 px-2 text-right">${formatCurrency(row.payment)}</td>
                      <td className="py-2 px-2 text-right">${formatCurrency(row.principal)}</td>
                      <td className="py-2 px-2 text-right text-red-500">${formatCurrency(row.interest)}</td>
                      <td className="py-2 px-2 text-right">${formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Fixed Payment: Same amount each month, most common for mortgages</p>
        <p>• Fixed Principal: Less total interest, higher initial payments</p>
        <p>• Interest Only: Lowest monthly payment, highest total interest</p>
        <p className="text-yellow-600 dark:text-yellow-500 mt-2">
          Note: Actual loans may include fees, prepayment penalties, and other charges.
        </p>
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
          💰 What is Loan Calculator?
        </h2>
        <p className="text-sm leading-relaxed">
          Loan Calculator helps you estimate monthly payments and total interest by entering principal, interest rate, and loan term.
          It works for all types of loans including mortgages, auto loans, personal loans, and student loans.
          Compare three repayment methods—fixed payment (amortization), fixed principal, and interest-only—to find the best option for your situation.
          View the monthly amortization schedule and download it as CSV for your financial planning.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Repayment Method Comparison
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Method</th>
                <th className="text-left py-2 px-2">Characteristics</th>
                <th className="text-left py-2 px-2">Total Interest</th>
                <th className="text-left py-2 px-2">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Fixed Payment</td><td>Same payment each month</td><td className="text-yellow-600">Medium</td><td>Stable monthly budget</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Fixed Principal</td><td>Principal equal, interest decreases</td><td className="text-green-600">Lowest</td><td>Higher initial capacity</td></tr>
              <tr><td className="py-2 px-2 font-medium">Interest Only</td><td>Interest only, principal at maturity</td><td className="text-red-600">Highest</td><td>Short-term, investment</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Loan Planning Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>DTI Ratio</strong>: Keep debt-to-income ratio under 36-43% for approval</li>
          <li><strong>Interest Type</strong>: Understand fixed vs variable rate pros and cons</li>
          <li><strong>Prepayment Penalties</strong>: Check if early payoff incurs fees</li>
          <li><strong>Grace Period</strong>: Reduces initial burden but increases total interest</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Which is better: fixed payment or fixed principal?',
            answer: 'Fixed principal results in less total interest, but has higher initial payments. Choose fixed payment for stable budgeting, fixed principal if you can afford higher early payments.',
          },
          {
            question: 'Why might actual loan payments differ from calculated results?',
            answer: 'Real loans may include additional costs like origination fees, closing costs, PMI, and prepayment penalties. Contact your lender for exact figures.',
          },
          {
            question: 'Can I calculate adjustable-rate mortgages (ARM)?',
            answer: 'This calculator uses fixed rates. ARMs require recalculation at each rate adjustment period. For ARM simulations, specialized tools are needed.',
          },
        ]}
      />
    </div>
  );
}
