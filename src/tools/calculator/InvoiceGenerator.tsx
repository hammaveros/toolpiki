'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  from: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  to: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  items: InvoiceItem[];
  notes: string;
  taxRate: number;
}

const initialData: InvoiceData = {
  invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  from: { name: '', address: '', phone: '', email: '' },
  to: { name: '', address: '', phone: '', email: '' },
  items: [{ id: '1', description: '', quantity: 1, unitPrice: 0 }],
  notes: '',
  taxRate: 10,
};

export function InvoiceGenerator() {
  const [data, setData] = useState<InvoiceData>(initialData);
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    setData((prev) => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }],
    }));
  };

  const removeItem = (id: string) => {
    if (data.items.length <= 1) return;
    setData((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + tax;

  const formatCurrency = (n: number) => n.toLocaleString('ko-KR') + '원';

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>견적서 - ${data.invoiceNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Malgun Gothic', sans-serif; padding: 40px; color: #333; }
          .invoice { max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .title { font-size: 32px; font-weight: bold; color: #2563eb; }
          .invoice-info { text-align: right; }
          .invoice-info p { margin: 4px 0; color: #666; }
          .parties { display: flex; gap: 40px; margin-bottom: 30px; }
          .party { flex: 1; }
          .party-label { font-size: 12px; color: #666; margin-bottom: 8px; text-transform: uppercase; }
          .party-name { font-size: 18px; font-weight: bold; margin-bottom: 4px; }
          .party-detail { color: #666; font-size: 14px; line-height: 1.6; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f3f4f6; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666; }
          td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
          .text-right { text-align: right; }
          .totals { margin-left: auto; width: 300px; }
          .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .totals-row.total { font-size: 20px; font-weight: bold; border-top: 2px solid #333; padding-top: 12px; margin-top: 8px; }
          .notes { margin-top: 40px; padding: 20px; background: #f9fafb; border-radius: 8px; }
          .notes-label { font-size: 12px; color: #666; margin-bottom: 8px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="title">견적서</div>
            <div class="invoice-info">
              <p><strong>견적번호:</strong> ${data.invoiceNumber}</p>
              <p><strong>발행일:</strong> ${data.date}</p>
              <p><strong>유효기간:</strong> ${data.dueDate}</p>
            </div>
          </div>

          <div class="parties">
            <div class="party">
              <div class="party-label">공급자</div>
              <div class="party-name">${data.from.name || '-'}</div>
              <div class="party-detail">
                ${data.from.address ? data.from.address + '<br>' : ''}
                ${data.from.phone ? data.from.phone + '<br>' : ''}
                ${data.from.email || ''}
              </div>
            </div>
            <div class="party">
              <div class="party-label">공급받는자</div>
              <div class="party-name">${data.to.name || '-'}</div>
              <div class="party-detail">
                ${data.to.address ? data.to.address + '<br>' : ''}
                ${data.to.phone ? data.to.phone + '<br>' : ''}
                ${data.to.email || ''}
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>품목</th>
                <th class="text-right">수량</th>
                <th class="text-right">단가</th>
                <th class="text-right">금액</th>
              </tr>
            </thead>
            <tbody>
              ${data.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.description || '-'}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">${item.unitPrice.toLocaleString()}원</td>
                  <td class="text-right">${(item.quantity * item.unitPrice).toLocaleString()}원</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>공급가액</span>
              <span>${subtotal.toLocaleString()}원</span>
            </div>
            <div class="totals-row">
              <span>부가세 (${data.taxRate}%)</span>
              <span>${tax.toLocaleString()}원</span>
            </div>
            <div class="totals-row total">
              <span>합계</span>
              <span>${total.toLocaleString()}원</span>
            </div>
          </div>

          ${
            data.notes
              ? `
            <div class="notes">
              <div class="notes-label">비고</div>
              <div>${data.notes}</div>
            </div>
          `
              : ''
          }
        </div>
        <script>window.onload = () => { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4">
      {/* 기본 정보 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">기본 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">견적번호</label>
            <input
              type="text"
              value={data.invoiceNumber}
              onChange={(e) => setData((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">발행일</label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => setData((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">유효기간</label>
            <input
              type="date"
              value={data.dueDate}
              onChange={(e) => setData((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>
      </Card>

      {/* 공급자 / 공급받는자 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">공급자 (보내는 쪽)</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="상호/이름"
              value={data.from.name}
              onChange={(e) => setData((prev) => ({ ...prev, from: { ...prev.from, name: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="주소"
              value={data.from.address}
              onChange={(e) => setData((prev) => ({ ...prev, from: { ...prev.from, address: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="연락처"
              value={data.from.phone}
              onChange={(e) => setData((prev) => ({ ...prev, from: { ...prev.from, phone: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            <input
              type="email"
              placeholder="이메일"
              value={data.from.email}
              onChange={(e) => setData((prev) => ({ ...prev, from: { ...prev.from, email: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">공급받는자 (받는 쪽)</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="상호/이름"
              value={data.to.name}
              onChange={(e) => setData((prev) => ({ ...prev, to: { ...prev.to, name: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="주소"
              value={data.to.address}
              onChange={(e) => setData((prev) => ({ ...prev, to: { ...prev.to, address: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="연락처"
              value={data.to.phone}
              onChange={(e) => setData((prev) => ({ ...prev, to: { ...prev.to, phone: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            <input
              type="email"
              placeholder="이메일"
              value={data.to.email}
              onChange={(e) => setData((prev) => ({ ...prev, to: { ...prev.to, email: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
        </Card>
      </div>

      {/* 품목 */}
      <Card variant="bordered" className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">품목</h3>
          <Button variant="secondary" size="sm" onClick={addItem}>
            + 품목 추가
          </Button>
        </div>

        <div className="space-y-2">
          {data.items.map((item, idx) => (
            <div key={item.id} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="품목명"
                value={item.description}
                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
              <input
                type="number"
                placeholder="수량"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-right"
              />
              <input
                type="number"
                placeholder="단가"
                value={item.unitPrice}
                onChange={(e) => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                className="w-28 px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-right"
              />
              <span className="w-28 text-right text-sm font-medium">
                {formatCurrency(item.quantity * item.unitPrice)}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                disabled={data.items.length <= 1}
                className="text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* 합계 */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3 items-center mb-2">
            <span className="text-sm text-gray-500">부가세율</span>
            <input
              type="number"
              value={data.taxRate}
              onChange={(e) => setData((prev) => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
              className="w-16 px-2 py-1 text-sm border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-right"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">공급가액</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">부가세</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>합계</span>
              <span className="text-blue-600">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 비고 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">비고</h3>
        <textarea
          value={data.notes}
          onChange={(e) => setData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="추가 메모사항"
          rows={3}
          className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 resize-none"
        />
      </Card>

      {/* 버튼 */}
      <div className="flex gap-3">
        <Button onClick={handlePrint} className="flex-1">
          인쇄 / PDF 저장
        </Button>
        <Button variant="secondary" onClick={() => setData(initialData)}>
          초기화
        </Button>
      </div>

      <div className="text-xs text-gray-400 dark:text-gray-500">
        <p>• 인쇄 버튼을 누르면 브라우저 인쇄 창이 열립니다</p>
        <p>• PDF로 저장하려면 인쇄 창에서 &quot;PDF로 저장&quot;을 선택하세요</p>
      </div>

      {/* 숨김 프린트 영역 */}
      <div ref={printRef} className="hidden" />

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📄 견적서/인보이스 생성기란?
        </h2>
        <p className="text-sm leading-relaxed">
          견적서 생성기는 품목, 수량, 단가를 입력하면 전문적인 견적서를 자동으로 만들어주는 도구입니다.
          공급자와 공급받는자 정보를 입력하고, 부가세율을 설정하면 자동 계산됩니다.
          작성된 견적서는 브라우저 인쇄 기능을 통해 PDF로 저장하거나 바로 출력할 수 있습니다.
          별도의 프로그램 설치 없이 웹에서 바로 깔끔한 견적서를 만들 수 있어 프리랜서와 소규모 사업자에게 유용합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 견적서 vs 인보이스 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">구분</th>
                <th className="text-left py-2 px-2">견적서</th>
                <th className="text-left py-2 px-2">인보이스 (청구서)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">발행 시점</td><td>계약 전 (예상 금액)</td><td>작업 완료 후 (확정 금액)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">법적 효력</td><td>참고용 (계약 아님)</td><td>대금 청구 근거</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">유효기간</td><td>보통 30일</td><td>결제 기한 명시</td></tr>
              <tr><td className="py-2 px-2 font-medium">포함 내용</td><td>예상 품목, 수량, 단가</td><td>확정 품목, 결제 정보</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 견적서 작성 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>품목 상세 기술</strong>: "디자인 작업"보다 "로고 디자인 A4 1종 (3차 수정 포함)"처럼 구체적으로</li>
          <li><strong>유효기간 명시</strong>: 물가 변동에 대비해 견적 유효기간을 반드시 표시</li>
          <li><strong>부가세 별도/포함</strong>: 부가세 포함 여부를 명확히 (B2B는 별도가 일반적)</li>
          <li><strong>결제 조건</strong>: 선금/중도금/잔금 비율을 비고란에 명시하면 분쟁 방지</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '견적서에 도장/서명이 필요한가요?',
            answer: '견적서는 법적 계약서가 아니므로 도장이나 서명이 필수는 아닙니다. 다만 공식 문서로 사용하려면 사업자 직인이나 서명을 추가하는 것이 신뢰성을 높입니다.',
          },
          {
            question: 'PDF로 저장하려면 어떻게 하나요?',
            answer: '"인쇄 / PDF 저장" 버튼을 클릭하면 브라우저 인쇄 창이 열립니다. 여기서 프린터 대신 "PDF로 저장" 또는 "Microsoft Print to PDF"를 선택하면 PDF 파일로 저장됩니다.',
          },
          {
            question: '견적서 번호는 어떻게 관리하나요?',
            answer: '자동 생성된 번호를 사용하거나 직접 입력할 수 있습니다. 일반적으로 "연도-월-일련번호" 형식(예: 2024-01-001)으로 관리하면 추적이 쉽습니다.',
          },
        ]}
      />
    </div>
  );
}
