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

export function LoanCalculator() {
  const [principal, setPrincipal] = useState<string>('100000000');
  const [rate, setRate] = useState<string>('4.5');
  const [termValue, setTermValue] = useState<string>('30');
  const [termUnit, setTermUnit] = useState<'months' | 'years'>('years');
  const [repaymentType, setRepaymentType] = useState<RepaymentType>('equal-payment');
  const [gracePeriod, setGracePeriod] = useState<string>('0');
  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo(() => {
    const P = parseInt(principal.replace(/,/g, '')) || 0;
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

    // 거치기간 처리
    for (let i = 1; i <= grace; i++) {
      const interest = Math.round(balance * monthlyRate);
      totalInterest += interest;
      schedule.push({
        month: i,
        payment: interest,
        principal: 0,
        interest,
        balance,
      });
    }

    // 상환기간 처리
    if (repaymentType === 'equal-payment') {
      // 원리금균등
      const n = repaymentMonths;
      const r = monthlyRate;
      const monthlyPayment = Math.round(balance * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));

      for (let i = grace + 1; i <= termMonths; i++) {
        const interest = Math.round(balance * monthlyRate);
        const principalPayment = monthlyPayment - interest;
        balance = Math.max(0, balance - principalPayment);
        totalInterest += interest;

        schedule.push({
          month: i,
          payment: i === termMonths ? principalPayment + interest + balance : monthlyPayment,
          principal: i === termMonths ? principalPayment + balance : principalPayment,
          interest,
          balance: i === termMonths ? 0 : balance,
        });
      }
    } else if (repaymentType === 'equal-principal') {
      // 원금균등
      const monthlyPrincipal = Math.round(balance / repaymentMonths);

      for (let i = grace + 1; i <= termMonths; i++) {
        const interest = Math.round(balance * monthlyRate);
        const isLast = i === termMonths;
        const principalPayment = isLast ? balance : monthlyPrincipal;
        balance = Math.max(0, balance - principalPayment);
        totalInterest += interest;

        schedule.push({
          month: i,
          payment: principalPayment + interest,
          principal: principalPayment,
          interest,
          balance,
        });
      }
    } else {
      // 만기일시
      for (let i = grace + 1; i < termMonths; i++) {
        const interest = Math.round(balance * monthlyRate);
        totalInterest += interest;

        schedule.push({
          month: i,
          payment: interest,
          principal: 0,
          interest,
          balance,
        });
      }

      // 마지막 달: 원금 + 이자
      const lastInterest = Math.round(balance * monthlyRate);
      totalInterest += lastInterest;
      schedule.push({
        month: termMonths,
        payment: balance + lastInterest,
        principal: balance,
        interest: lastInterest,
        balance: 0,
      });
    }

    const firstPayment = schedule[grace]?.payment || 0;
    const totalPayment = P + totalInterest;

    return {
      firstPayment,
      totalInterest,
      totalPayment,
      schedule,
      termMonths,
    };
  }, [principal, rate, termValue, termUnit, repaymentType, gracePeriod]);

  const formatNumber = (num: number) => num.toLocaleString('ko-KR');

  const handlePrincipalChange = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    setPrincipal(num);
  };

  const downloadCSV = () => {
    if (!result) return;

    const headers = ['회차', '상환금', '원금', '이자', '잔액'];
    const rows = result.schedule.map(row => [
      row.month,
      row.payment,
      row.principal,
      row.interest,
      row.balance,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '대출상환스케줄.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const repaymentTypes: { value: RepaymentType; label: string; desc: string }[] = [
    { value: 'equal-payment', label: '원리금균등', desc: '매월 동일한 금액 상환' },
    { value: 'equal-principal', label: '원금균등', desc: '원금을 균등하게, 이자는 감소' },
    { value: 'bullet', label: '만기일시', desc: '만기에 원금 일시 상환' },
  ];

  return (
    <div className="space-y-2">
      {/* 입력 영역 */}
      <Card variant="bordered" className="p-6">
        <h2 className="text-lg font-semibold mb-4">대출 정보 입력</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              대출원금
            </label>
            <div className="relative">
              <Input
                type="text"
                value={formatNumber(parseInt(principal) || 0)}
                onChange={(e) => handlePrincipalChange(e.target.value)}
                placeholder="100,000,000"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              연이율
            </label>
            <div className="relative">
              <Input
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="4.5"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              대출기간
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
                <option value="years">년</option>
                <option value="months">개월</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              거치기간 (개월)
            </label>
            <Input
              type="number"
              value={gracePeriod}
              onChange={(e) => setGracePeriod(e.target.value)}
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">이자만 납부하는 기간</p>
          </div>
        </div>

        {/* 상환방식 선택 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            상환방식
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

      {/* 결과 영역 */}
      {result && (
        <Card variant="bordered" className="p-6">
          <h2 className="text-lg font-semibold mb-4">상환 요약</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-500">월 상환금 (첫 회)</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatNumber(result.firstPayment)}원
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500">총 이자</p>
              <p className="text-2xl font-bold text-red-500">
                {formatNumber(result.totalInterest)}원
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500">총 상환금</p>
              <p className="text-2xl font-bold">
                {formatNumber(result.totalPayment)}원
              </p>
            </div>
          </div>

          {/* 상환 스케줄 토글 */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowSchedule(!showSchedule)}
            >
              {showSchedule ? '스케줄 숨기기' : '상환 스케줄 보기'}
            </Button>
            <Button variant="secondary" onClick={downloadCSV}>
              CSV 다운로드
            </Button>
          </div>

          {/* 상환 스케줄 테이블 */}
          {showSchedule && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 px-2 text-left">회차</th>
                    <th className="py-2 px-2 text-right">상환금</th>
                    <th className="py-2 px-2 text-right">원금</th>
                    <th className="py-2 px-2 text-right">이자</th>
                    <th className="py-2 px-2 text-right">잔액</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.slice(0, showSchedule ? undefined : 12).map((row) => (
                    <tr key={row.month} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 px-2">{row.month}개월</td>
                      <td className="py-2 px-2 text-right">{formatNumber(row.payment)}</td>
                      <td className="py-2 px-2 text-right">{formatNumber(row.principal)}</td>
                      <td className="py-2 px-2 text-right text-red-500">{formatNumber(row.interest)}</td>
                      <td className="py-2 px-2 text-right">{formatNumber(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* 안내 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 원리금균등: 매월 동일한 금액을 상환, 초기에 이자 비중 높음</p>
        <p>• 원금균등: 원금을 균등 분할, 총 이자 적지만 초기 부담 큼</p>
        <p>• 만기일시: 이자만 납부하다 만기에 원금 일시 상환</p>
        <p className="text-yellow-600 dark:text-yellow-500 mt-2">
          ※ 실제 대출은 중도상환수수료, 취급수수료 등이 추가될 수 있습니다.
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
          💰 대출 상환 계산기란?
        </h2>
        <p className="text-sm leading-relaxed">
          대출 상환 계산기는 원금, 금리, 기간을 입력해 월 상환금과 총 이자를 미리 계산하는 도구입니다.
          주택담보대출, 전세자금대출, 신용대출 등 모든 유형의 대출에 사용할 수 있습니다.
          원리금균등, 원금균등, 만기일시 세 가지 상환방식을 비교하여 자신에게 유리한 방식을 선택하세요.
          월별 상환 스케줄을 확인하고 CSV로 다운로드해 재정 계획에 활용할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 상환방식 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">상환방식</th>
                <th className="text-left py-2 px-2">특징</th>
                <th className="text-left py-2 px-2">총 이자</th>
                <th className="text-left py-2 px-2">추천 대상</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">원리금균등</td><td>매월 동일 금액 상환</td><td className="text-yellow-600">중간</td><td>일정한 지출 선호</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">원금균등</td><td>원금 균등, 이자 점감</td><td className="text-green-600">최저</td><td>초기 여유 있는 분</td></tr>
              <tr><td className="py-2 px-2 font-medium">만기일시</td><td>이자만 납부, 만기 원금</td><td className="text-red-600">최고</td><td>단기 대출, 투자 목적</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 대출 계획 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>DSR(총부채원리금상환비율) 확인</strong>: 연소득 대비 원리금 상환 비율(40% 이내 권장)</li>
          <li><strong>금리 유형 선택</strong>: 고정금리 vs 변동금리 장단점 파악</li>
          <li><strong>중도상환수수료</strong>: 3년 내 상환 시 수수료 발생 여부 확인</li>
          <li><strong>거치기간 활용</strong>: 초기 부담 완화, 단 총 이자 증가</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔄 원금균등 vs 원리금균등 차이
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          두 방식의 핵심 차이는 &quot;매월 갚는 원금이 같은가, 총 상환액이 같은가&quot;입니다.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>원금균등</strong>: 매월 동일한 원금을 상환하고, 이자는 남은 잔액에 대해 계산. 초기 상환액이 크지만 갈수록 줄어들며, <strong>총 이자가 적습니다</strong>.</li>
          <li><strong>원리금균등</strong>: 매월 상환 총액(원금+이자)이 동일. 예산 관리가 쉽고 초기 부담이 낮지만, 초반에는 이자 비중이 높아 <strong>총 이자가 더 많습니다</strong>.</li>
          <li><strong>예시 (1억, 연 5%, 20년)</strong>: 원금균등 총 이자 약 5,020만 원, 원리금균등 총 이자 약 5,840만 원으로 약 820만 원 차이가 납니다.</li>
          <li><strong>선택 기준</strong>: 초기 자금 여유가 있으면 원금균등, 매월 고정 지출을 선호하면 원리금균등이 유리합니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 대출 이자 절약 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>중도상환 활용</strong>: 여유 자금이 생기면 중도상환으로 원금을 줄이세요. 3년 후에는 중도상환수수료가 면제되는 경우가 많습니다.</li>
          <li><strong>금리 비교는 필수</strong>: 시중은행, 인터넷전문은행, 보험사, 상호금융까지 비교하면 0.5%포인트 이상 차이 나기도 합니다. 온라인에서 금융감독원 금리비교 서비스를 검색해보세요.</li>
          <li><strong>거치기간 최소화</strong>: 거치기간 동안은 원금이 줄지 않아 이자만 나가므로, 꼭 필요한 경우가 아니면 거치기간을 줄이는 것이 총 이자 절감에 효과적입니다.</li>
          <li><strong>대출 기간 단축</strong>: 같은 금리라도 기간이 절반이면 총 이자는 절반 이하로 줄어듭니다. 월 상환 부담이 가능하다면 기간을 줄여보세요.</li>
          <li><strong>금리인하요구권</strong>: 승진, 연봉 인상, 신용등급 상승 시 은행에 금리 인하를 요청할 수 있는 법적 권리입니다.</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '원리금균등과 원금균등 중 뭐가 유리한가요?',
            answer: '총 이자는 원금균등이 적지만, 초기 상환 부담이 큽니다. 수입이 일정하면 원리금균등, 초기 여유가 있으면 원금균등을 추천합니다.',
          },
          {
            question: '계산 결과와 실제 대출 금액이 다를 수 있나요?',
            answer: '네, 실제 대출에는 중도상환수수료, 인지세, 보증료 등 부대비용이 추가될 수 있습니다. 정확한 금액은 금융기관에 문의하세요.',
          },
          {
            question: '변동금리 대출도 계산할 수 있나요?',
            answer: '현재 버전은 고정금리 기준입니다. 변동금리 대출은 금리 변동 시점마다 상환금이 달라지므로 별도 시뮬레이션이 필요합니다.',
          },
        ]}
      />
    </div>
  );
}
