'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

// 2026년 기준 4대보험 요율
const RATES_2026 = {
  nationalPension: 0.0475, // 국민연금 4.75% (2026년 인상)
  nationalPensionMaxIncome: 6370000, // 기준소득월액 상한 (2025.7~2026.6)
  nationalPensionMinIncome: 400000, // 기준소득월액 하한 (2025.7~2026.6)
  healthInsurance: 0.03595, // 건강보험 3.595% (2026년 인상)
  longTermCare: 0.1314, // 장기요양 (건강보험의 13.14%, 2026년 인상)
  employmentInsurance: 0.009, // 고용보험 0.9% (동결)
};

// 간이세액표 (2026년 기준, 부양가족 수별 월급여 구간)
// 실제 간이세액표를 단순화한 근사치
function getIncomeTax(monthlyTaxable: number, dependents: number, children: number): number {
  // 부양가족 공제 반영 (본인 포함)
  // 8~20세 자녀 추가공제 반영
  const baseDeduction = dependents * 1500000; // 부양가족당 150만원 기본공제(연간)
  const childDeduction = children * 1500000; // 자녀세액공제(연간)

  // 연간 과세표준 추정
  const annualTaxable = monthlyTaxable * 12;
  const taxableIncome = Math.max(0, annualTaxable - baseDeduction);

  // 근로소득세율 (2026년)
  let tax = 0;
  if (taxableIncome <= 14000000) {
    tax = taxableIncome * 0.06;
  } else if (taxableIncome <= 50000000) {
    tax = 840000 + (taxableIncome - 14000000) * 0.15;
  } else if (taxableIncome <= 88000000) {
    tax = 6240000 + (taxableIncome - 50000000) * 0.24;
  } else if (taxableIncome <= 150000000) {
    tax = 15360000 + (taxableIncome - 88000000) * 0.35;
  } else if (taxableIncome <= 300000000) {
    tax = 37060000 + (taxableIncome - 150000000) * 0.38;
  } else if (taxableIncome <= 500000000) {
    tax = 94060000 + (taxableIncome - 300000000) * 0.40;
  } else if (taxableIncome <= 1000000000) {
    tax = 174060000 + (taxableIncome - 500000000) * 0.42;
  } else {
    tax = 384060000 + (taxableIncome - 1000000000) * 0.45;
  }

  // 자녀세액공제 차감
  const childCredit = children > 0 ? (children === 1 ? 150000 : children === 2 ? 350000 : 350000 + (children - 2) * 300000) : 0;
  tax = Math.max(0, tax - childCredit);

  // 월 소득세 (연간세액 / 12, 간이세액표 근사)
  return Math.round(tax / 12);
}

export function SalaryCalculator() {
  const [annualSalary, setAnnualSalary] = useState<string>('30000000');
  const [nonTaxable, setNonTaxable] = useState<string>('0');
  const [dependents, setDependents] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);

  const result = useMemo(() => {
    const salary = parseInt(annualSalary.replace(/,/g, '')) || 0;
    const nonTax = parseInt(nonTaxable.replace(/,/g, '')) || 0;

    // 월급여 계산
    const monthlyGross = Math.round(salary / 12);
    const monthlyNonTax = Math.round(nonTax / 12);
    const monthlyTaxable = monthlyGross - monthlyNonTax;

    // 국민연금 (기준소득월액 상하한 적용)
    // 기준소득월액 = min(max(월 소득, 하한액), 상한액)
    const pensionBaseIncome = Math.min(
      Math.max(monthlyTaxable, RATES_2026.nationalPensionMinIncome),
      RATES_2026.nationalPensionMaxIncome
    );
    let nationalPension = Math.round(pensionBaseIncome * RATES_2026.nationalPension);
    // 월 소득이 하한액 미만이면 하한액 기준으로 계산
    if (monthlyTaxable < RATES_2026.nationalPensionMinIncome) {
      nationalPension = Math.round(RATES_2026.nationalPensionMinIncome * RATES_2026.nationalPension);
    }
    // 60세 이상이거나 소득이 전혀 없으면 면제 (여기선 소득 0원만 체크)
    if (monthlyTaxable <= 0) nationalPension = 0;

    // 건강보험
    const healthInsurance = Math.round(monthlyTaxable * RATES_2026.healthInsurance);

    // 장기요양보험
    const longTermCare = Math.round(healthInsurance * RATES_2026.longTermCare);

    // 고용보험
    const employmentInsurance = Math.round(monthlyTaxable * RATES_2026.employmentInsurance);

    // 소득세
    const incomeTax = getIncomeTax(monthlyTaxable, dependents, children);

    // 지방소득세 (소득세의 10%)
    const localIncomeTax = Math.round(incomeTax * 0.1);

    // 총 공제액
    const totalDeduction = nationalPension + healthInsurance + longTermCare + employmentInsurance + incomeTax + localIncomeTax;

    // 월 실수령액
    const monthlyNet = monthlyGross - totalDeduction;

    return {
      monthlyGross,
      monthlyTaxable,
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      incomeTax,
      localIncomeTax,
      totalDeduction,
      monthlyNet,
      annualNet: monthlyNet * 12,
      annualDeduction: totalDeduction * 12,
    };
  }, [annualSalary, nonTaxable, dependents, children]);

  const formatNumber = (num: number) => num.toLocaleString('ko-KR');

  const handleSalaryChange = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    setAnnualSalary(num);
  };

  const handleNonTaxableChange = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    setNonTaxable(num);
  };

  return (
    <div className="space-y-2">
      {/* 입력 영역 */}
      <Card variant="bordered" className="p-6">
        <h2 className="text-lg font-semibold mb-4">급여 정보 입력</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              연봉 (세전)
            </label>
            <div className="relative">
              <Input
                type="text"
                value={formatNumber(parseInt(annualSalary) || 0)}
                onChange={(e) => handleSalaryChange(e.target.value)}
                placeholder="50,000,000"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              비과세 금액 (연간)
            </label>
            <div className="relative">
              <Input
                type="text"
                value={formatNumber(parseInt(nonTaxable) || 0)}
                onChange={(e) => handleNonTaxableChange(e.target.value)}
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">식대, 차량유지비 등</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              부양가족 수 (본인 포함)
            </label>
            <select
              value={dependents}
              onChange={(e) => setDependents(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => (
                <option key={n} value={n}>{n}명</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              8~20세 자녀 수
            </label>
            <select
              value={children}
              onChange={(e) => setChildren(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={n}>{n}명</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">자녀세액공제 대상</p>
          </div>
        </div>
      </Card>

      {/* 결과 영역 */}
      <Card variant="bordered" className="p-6">
        <h2 className="text-lg font-semibold mb-4">월 급여 명세</h2>

        {/* 실수령액 강조 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">월 실수령액</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {formatNumber(result.monthlyNet)}원
            </p>
          </div>
        </div>

        {/* 공제 내역 */}
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">월 급여 (세전)</span>
            <span className="font-medium">{formatNumber(result.monthlyGross)}원</span>
          </div>

          <div className="pl-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">국민연금 (4.75%)</span>
              <span className="text-red-500">-{formatNumber(result.nationalPension)}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">건강보험 (3.595%)</span>
              <span className="text-red-500">-{formatNumber(result.healthInsurance)}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">장기요양보험 (13.14%)</span>
              <span className="text-red-500">-{formatNumber(result.longTermCare)}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">고용보험 (0.9%)</span>
              <span className="text-red-500">-{formatNumber(result.employmentInsurance)}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">소득세</span>
              <span className="text-red-500">-{formatNumber(result.incomeTax)}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">지방소득세 (10%)</span>
              <span className="text-red-500">-{formatNumber(result.localIncomeTax)}원</span>
            </div>
          </div>

          <div className="flex justify-between py-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">공제 합계</span>
            <span className="font-medium text-red-500">-{formatNumber(result.totalDeduction)}원</span>
          </div>
        </div>
      </Card>

      {/* 연간 요약 */}
      <Card variant="bordered" className="p-6">
        <h2 className="text-lg font-semibold mb-4">연간 요약</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500">연 실수령액</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatNumber(result.annualNet)}원
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500">연 공제 합계</p>
            <p className="text-xl font-bold text-red-500">
              {formatNumber(result.annualDeduction)}원
            </p>
          </div>
        </div>
      </Card>

      {/* 기준 안내 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p className="font-medium">계산 기준 (2026년)</p>
        <p>• 국민연금: 4.75% (기준소득월액 하한 40만원, 상한 637만원)</p>
        <p>• 건강보험: 3.595%, 장기요양: 건강보험의 13.14%</p>
        <p>• 고용보험: 0.9%</p>
        <p>• 소득세: 간이세액표 기준 (근사치)</p>
        <p className="text-yellow-600 dark:text-yellow-500 mt-2">
          ※ 본 계산기는 참고용이며, 실제 세금은 비과세 항목, 추가 공제, 연말정산 등에 따라 달라질 수 있습니다.
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
          💰 연봉 계산기란?
        </h2>
        <p className="text-sm leading-relaxed">
          연봉 계산기는 세전 연봉에서 4대보험과 소득세를 공제한 실수령액을 계산하는 도구입니다.
          2026년 기준 4대보험 요율(국민연금 4.75%, 건강보험 3.595%, 장기요양 13.14%, 고용보험 0.9%)과 간이세액표를 적용합니다.
          부양가족 수, 자녀세액공제, 비과세 금액을 반영하여 정확도를 높일 수 있습니다.
          모든 계산은 브라우저에서 처리되며 입력 정보는 서버에 저장되지 않습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 2026년 4대보험 요율
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">항목</th>
                <th className="text-left py-2 px-2">요율 (근로자)</th>
                <th className="text-left py-2 px-2">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">국민연금</td><td className="font-mono">4.75%</td><td>기준소득월액 40만~637만원</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">건강보험</td><td className="font-mono">3.595%</td><td>2026년 인상분 반영</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">장기요양</td><td className="font-mono">13.14%</td><td>건강보험료의 비율</td></tr>
              <tr><td className="py-2 px-2 font-medium">고용보험</td><td className="font-mono">0.9%</td><td>동결</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 실수령액 높이는 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>비과세 활용</strong>: 식대(월 20만원), 차량유지비(월 20만원) 등 비과세 항목 확인</li>
          <li><strong>부양가족 등록</strong>: 소득 없는 배우자, 부모님 등록 시 소득세 감소</li>
          <li><strong>자녀세액공제</strong>: 8~20세 자녀 1인당 15~35만원 세액공제</li>
          <li><strong>연말정산 준비</strong>: 신용카드, 의료비, 교육비 공제 항목 미리 체크</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📌 2026년 최저임금 정보
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          2026년 최저임금은 시급 기준으로 결정되며, 주 40시간 근무 기준 월급과 연봉은 다음과 같습니다.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">구분</th>
                <th className="text-left py-2 px-2">금액</th>
                <th className="text-left py-2 px-2">산출 기준</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">시급</td><td className="font-mono">10,030원</td><td>최저임금위원회 고시</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">일급 (8시간)</td><td className="font-mono">80,240원</td><td>시급 × 8시간</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">월급 (주 40시간)</td><td className="font-mono">약 2,096,270원</td><td>시급 × 209시간 (주휴 포함)</td></tr>
              <tr><td className="py-2 px-2 font-medium">연봉 환산</td><td className="font-mono">약 25,155,240원</td><td>월급 × 12개월</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">※ 주 40시간 근무, 주휴수당 포함 기준. 실제 금액은 근로 조건에 따라 다를 수 있습니다.</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💵 연봉별 실수령액 예시
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          부양가족 1인(본인), 비과세 월 20만원 기준 대략적인 실수령 월급입니다. 실제 금액은 회사 공제 항목에 따라 다를 수 있습니다.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">세전 연봉</th>
                <th className="text-left py-2 px-2">월 실수령액 (약)</th>
                <th className="text-left py-2 px-2">공제율 (약)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">3,000만원</td><td className="font-mono">약 224만원</td><td>~10.5%</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">4,000만원</td><td className="font-mono">약 291만원</td><td>~12.5%</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">5,000만원</td><td className="font-mono">약 354만원</td><td>~15%</td></tr>
              <tr><td className="py-2 px-2 font-medium">7,000만원</td><td className="font-mono">약 476만원</td><td>~18.5%</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">※ 위 금액은 2026년 4대보험 요율 + 간이세액 기준 추정치이며, 정확한 금액은 위 계산기를 이용하세요.</p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '실제 급여와 왜 차이가 나나요?',
            answer: '이 계산기는 간이세액표 기준 근사치입니다. 실제 급여는 상여금, 성과급, 연말정산, 기타 공제 항목에 따라 달라질 수 있습니다.',
          },
          {
            question: '비과세 금액은 어떻게 확인하나요?',
            answer: '급여명세서에서 비과세 항목(식대, 차량유지비, 자가운전보조금 등)을 확인하세요. 비과세 항목은 회사마다 다릅니다.',
          },
          {
            question: '부양가족 수에는 누가 포함되나요?',
            answer: '본인, 배우자, 직계존속(부모님), 직계비속(자녀), 형제자매 중 연 소득 100만원 이하인 사람이 포함됩니다. 부양가족이 많을수록 소득세가 줄어듭니다.',
          },
        ]}
      />
    </div>
  );
}
