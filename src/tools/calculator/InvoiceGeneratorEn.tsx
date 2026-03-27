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
  currency: string;
}

const initialData: InvoiceData = {
  invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  from: { name: '', address: '', phone: '', email: '' },
  to: { name: '', address: '', phone: '', email: '' },
  items: [{ id: '1', description: '', quantity: 1, unitPrice: 0 }],
  notes: '',
  taxRate: 0,
  currency: 'USD',
};

const currencies = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'CAD', symbol: 'C$' },
  { code: 'AUD', symbol: 'A$' },
];

export function InvoiceGeneratorEn() {
  const [data, setData] = useState<InvoiceData>(initialData);
  const printRef = useRef<HTMLDivElement>(null);

  const currencySymbol = currencies.find((c) => c.code === data.currency)?.symbol || '$';

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

  const formatCurrency = (n: number) => `${currencySymbol}${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${data.invoiceNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
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
            <div class="title">INVOICE</div>
            <div class="invoice-info">
              <p><strong>Invoice #:</strong> ${data.invoiceNumber}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Due Date:</strong> ${data.dueDate}</p>
            </div>
          </div>

          <div class="parties">
            <div class="party">
              <div class="party-label">From</div>
              <div class="party-name">${data.from.name || '-'}</div>
              <div class="party-detail">
                ${data.from.address ? data.from.address + '<br>' : ''}
                ${data.from.phone ? data.from.phone + '<br>' : ''}
                ${data.from.email || ''}
              </div>
            </div>
            <div class="party">
              <div class="party-label">Bill To</div>
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
                <th>Description</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${data.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.description || '-'}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">${currencySymbol}${item.unitPrice.toFixed(2)}</td>
                  <td class="text-right">${currencySymbol}${(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal</span>
              <span>${currencySymbol}${subtotal.toFixed(2)}</span>
            </div>
            ${
              data.taxRate > 0
                ? `
              <div class="totals-row">
                <span>Tax (${data.taxRate}%)</span>
                <span>${currencySymbol}${tax.toFixed(2)}</span>
              </div>
            `
                : ''
            }
            <div class="totals-row total">
              <span>Total</span>
              <span>${currencySymbol}${total.toFixed(2)}</span>
            </div>
          </div>

          ${
            data.notes
              ? `
            <div class="notes">
              <div class="notes-label">Notes</div>
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
      {/* Basic Info */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Invoice Details</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Invoice #</label>
            <input
              type="text"
              value={data.invoiceNumber}
              onChange={(e) => setData((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date</label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => setData((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Due Date</label>
            <input
              type="date"
              value={data.dueDate}
              onChange={(e) => setData((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Currency</label>
            <select
              value={data.currency}
              onChange={(e) => setData((prev) => ({ ...prev, currency: e.target.value }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* From / To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">From</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Business Name"
              value={data.from.name}
              onChange={(e) => setData((prev) => ({ ...prev, from: { ...prev.from, name: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Address"
              value={data.from.address}
              onChange={(e) => setData((prev) => ({ ...prev, from: { ...prev.from, address: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Phone"
              value={data.from.phone}
              onChange={(e) => setData((prev) => ({ ...prev, from: { ...prev.from, phone: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            <input
              type="email"
              placeholder="Email"
              value={data.from.email}
              onChange={(e) => setData((prev) => ({ ...prev, from: { ...prev.from, email: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Bill To</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Client Name"
              value={data.to.name}
              onChange={(e) => setData((prev) => ({ ...prev, to: { ...prev.to, name: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Address"
              value={data.to.address}
              onChange={(e) => setData((prev) => ({ ...prev, to: { ...prev.to, address: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Phone"
              value={data.to.phone}
              onChange={(e) => setData((prev) => ({ ...prev, to: { ...prev.to, phone: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            <input
              type="email"
              placeholder="Email"
              value={data.to.email}
              onChange={(e) => setData((prev) => ({ ...prev, to: { ...prev.to, email: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
        </Card>
      </div>

      {/* Items */}
      <Card variant="bordered" className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Items</h3>
          <Button variant="secondary" size="sm" onClick={addItem}>
            + Add Item
          </Button>
        </div>

        <div className="space-y-2">
          {data.items.map((item) => (
            <div key={item.id} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                className="w-16 px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-right"
              />
              <input
                type="number"
                placeholder="Price"
                value={item.unitPrice}
                onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                className="w-24 px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-right"
              />
              <span className="w-24 text-right text-sm font-medium">{formatCurrency(item.quantity * item.unitPrice)}</span>
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

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3 items-center mb-2">
            <span className="text-sm text-gray-500">Tax Rate</span>
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
              <span className="text-gray-500">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {data.taxRate > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span>
              <span className="text-blue-600">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</h3>
        <textarea
          value={data.notes}
          onChange={(e) => setData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes or payment terms"
          rows={3}
          className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 resize-none"
        />
      </Card>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button onClick={handlePrint} className="flex-1">
          Print / Save as PDF
        </Button>
        <Button variant="secondary" onClick={() => setData(initialData)}>
          Reset
        </Button>
      </div>

      <div className="text-xs text-gray-400 dark:text-gray-500">
        <p>• Click Print to open browser print dialog</p>
        <p>• To save as PDF, select &quot;Save as PDF&quot; in the print dialog</p>
      </div>

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
          📄 What is Invoice Generator?
        </h2>
        <p className="text-sm leading-relaxed">
          Invoice Generator creates professional invoices and estimates by entering items, quantities, and prices.
          Simply fill in your business information and client details, set the tax rate, and calculations are automatic.
          Export your invoice via browser print function as PDF or print directly on paper.
          No software installation required - create clean, professional invoices right in your browser, perfect for freelancers and small businesses.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Invoice vs Estimate Comparison
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Aspect</th>
                <th className="text-left py-2 px-2">Estimate/Quote</th>
                <th className="text-left py-2 px-2">Invoice</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">When Issued</td><td>Before work (projected)</td><td>After work (final)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Legal Status</td><td>Reference only</td><td>Payment demand</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Validity</td><td>Usually 30 days</td><td>Due date specified</td></tr>
              <tr><td className="py-2 px-2 font-medium">Contents</td><td>Estimated items/costs</td><td>Final items, payment info</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Invoice Best Practices
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Detailed Descriptions</strong>: Instead of "Design work", use "Logo design 1 set (includes 3 revisions)"</li>
          <li><strong>Clear Due Dates</strong>: Always specify payment terms (Net 15, Net 30, Due on Receipt)</li>
          <li><strong>Tax Clarity</strong>: Clearly state if prices include or exclude sales tax</li>
          <li><strong>Payment Methods</strong>: List accepted payment options (bank transfer, PayPal, etc.)</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Do I need a signature on invoices?',
            answer: 'Invoices typically do not require signatures to be legally valid. However, adding a digital signature or company seal can add professionalism and authenticity to your documents.',
          },
          {
            question: 'How do I save as PDF?',
            answer: 'Click "Print / Save as PDF" button to open the browser print dialog. Select "Save as PDF" or "Microsoft Print to PDF" as the printer, then save the file to your computer.',
          },
          {
            question: 'What invoice numbering system should I use?',
            answer: 'Common formats include sequential numbers (INV-001), date-based (2024-01-001), or client-based (ABC-001). The key is consistency for easy tracking and tax records.',
          },
        ]}
      />
    </div>
  );
}
