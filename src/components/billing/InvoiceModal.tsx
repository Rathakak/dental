import React, { useState } from 'react';
import { Invoice } from '../../types';
import {
  X,
  Printer,
  Send,
  Copy,
  CheckCircle2,
  QrCode,
  CreditCard,
} from 'lucide-react';
import {
  formatUSD,
  formatKHR,
  formatKhmerDate,
  generateTelegramShareUrl,
} from '../../utils/khmerHelpers';

interface InvoiceModalProps {
  invoice: Invoice;
  onClose: () => void;
  onRecordPayment?: (invoiceId: string, amount: number, method: Invoice['paymentMethod']) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  onClose,
  onRecordPayment,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [showPayInput, setShowPayInput] = useState(false);
  const [payAmount, setPayAmount] = useState(invoice.balance);
  const [payMethod, setPayMethod] = useState<Invoice['paymentMethod']>('khqr');

  const { shareUrl, directTelegramUrl, messageText } = generateTelegramShareUrl(invoice);

  const handlePrint = () => {
    window.print();
  };

  const handleShareTelegram = () => {
    window.open(shareUrl, '_blank');
  };

  const handleDirectPatientTelegram = () => {
    if (directTelegramUrl) {
      window.open(directTelegramUrl, '_blank');
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmPayment = () => {
    if (onRecordPayment && payAmount > 0) {
      onRecordPayment(invoice.id, payAmount, payMethod);
      setShowPayInput(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">
              វិក្កយបត្រ #{invoice.id}
            </span>
            <span className="text-slate-300">·</span>
            <span
              className={`text-[11px] font-semibold ${
                invoice.status === 'paid'
                  ? 'text-emerald-700'
                  : invoice.status === 'partial'
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {invoice.status === 'paid' ? 'ទូទាត់ដាច់ (Paid)' : invoice.status === 'partial' ? 'បង់ខ្លះ (Partial)' : 'មិនទាន់បង់ (Unpaid)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Telegram Share Button (Requirement 13) */}
            <button
              type="button"
              onClick={handleShareTelegram}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors shadow-2xs cursor-pointer"
              title="ផ្ញើវិក្កយបត្រទៅ Telegram"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Share Telegram</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>បោះពុម្ព</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white print-card" id="printable-invoice">
          
          {/* Clinic Branding Header */}
          <div className="flex items-start justify-between pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🦷</span>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  គ្លីនិកទន្តសាស្ត្រ DentCare Pro
                </h1>
              </div>
              <p className="text-xs text-slate-500">
                ឯកទេសពត់ធ្មេញ ដាំបង្គោលធ្មេញ ស្រោបធ្មេញ និងព្យាបាលទូទៅ
              </p>
              <p className="text-xs text-slate-500 mt-1">
                អាសយដ្ឋាន៖ ផ្លូវ ១៩៨៦ សង្កាត់ភ្នំពេញថ្មី រាជធានីភ្នំពេញ · ទូរស័ព្ទ៖ 012 345 678 / 098 765 432
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider block">
                វិក្កយបត្រ / INVOICE
              </span>
              <span className="text-lg font-bold text-slate-900 font-mono block">
                #{invoice.id}
              </span>
              <span className="text-xs text-slate-500">
                កាលបរិច្ឆេទ៖ {formatKhmerDate(invoice.date)}
              </span>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-100 text-xs">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                ព័ត៌មានអ្នកជំងឺ (Bill To)
              </span>
              <div className="font-bold text-slate-900 text-sm">
                {invoice.patientName}
              </div>
              <div className="text-slate-600 font-mono">
                ទូរស័ព្ទ៖ {invoice.patientPhone}
              </div>
              <div className="text-slate-500">
                អត្តលេខ៖ {invoice.patientId}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                ព័ត៌មានព្យាបាល
              </span>
              <div className="text-slate-700">
                ទន្តបណ្ឌិត៖ <span className="font-semibold text-slate-900">{invoice.doctorName || 'ទន្តបណ្ឌិតប្រចាំការ'}</span>
              </div>
              <div className="text-slate-700">
                វិធីទូទាត់៖ <span className="font-medium uppercase">{invoice.paymentMethod}</span>
              </div>
              {invoice.notes && (
                <div className="text-slate-500 italic mt-0.5">
                  ចំណាំ៖ {invoice.notes}
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="py-4">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-1">ល.រ</th>
                  <th className="py-2.5 px-3">ការពិពណ៌នាសេវាកម្ម (Service Description)</th>
                  <th className="py-2.5 px-2 text-center">បរិមាណ</th>
                  <th className="py-2.5 px-3 text-right">តម្លៃរាយ ($)</th>
                  <th className="py-2.5 px-3 text-right">សរុប ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-1 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {item.description}
                      {item.toothNumber && (
                        <span className="text-teal-700 ml-1.5 font-normal">
                          (ធ្មេញ #{item.toothNumber})
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono">{item.qty}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                      {formatUSD(item.unitPrice)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                      {formatUSD(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Payment Summary */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            
            {/* Payment Method / Bakong KHQR Simulation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <QrCode className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-slate-800">
                  KHQR / ABA Scan to Pay
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Simulated QR Code box */}
                <div className="w-20 h-20 bg-white border border-slate-300 rounded-lg p-1.5 flex flex-col items-center justify-center shrink-0 shadow-2xs">
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white text-[9px] font-mono text-center rounded-xs p-1">
                    BAKONG KHQR
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <p className="font-semibold text-slate-900">គណនី៖ DentCare Pro Clinic</p>
                  <p className="font-mono">ABA: 001 234 567 (USD)</p>
                  <p className="font-mono">Bakong ID: dentcare@aba</p>
                  <p className="text-slate-400 text-[10px]">ស្កេនតាមគ្រប់ App ធនាគារក្នុងប្រទេសកម្ពុជា</p>
                </div>
              </div>
            </div>

            {/* Financial Ledger Calculation */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 text-slate-600">
                <span>តម្លៃរង (Subtotal)៖</span>
                <span className="font-mono tabular-nums">{formatUSD(invoice.subtotal)}</span>
              </div>

              {invoice.discount > 0 && (
                <div className="flex justify-between py-1 text-rose-600">
                  <span>បញ្ចុះតម្លៃ (Discount)៖</span>
                  <span className="font-mono tabular-nums">-{formatUSD(invoice.discount)}</span>
                </div>
              )}

              <div className="flex justify-between py-1.5 border-t border-slate-200 font-bold text-slate-900 text-sm">
                <span>តម្លៃសរុប (Total)៖</span>
                <span className="font-mono tabular-nums">{formatUSD(invoice.total)}</span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>ជាប្រាក់រៀល (in KHR)៖</span>
                <span className="font-medium tabular-nums">{formatKHR(invoice.total)}</span>
              </div>

              <div className="flex justify-between py-1 text-emerald-700 font-medium">
                <span>បានបង់រួច (Paid)៖</span>
                <span className="font-mono tabular-nums">{formatUSD(invoice.paid)}</span>
              </div>

              <div className="flex justify-between py-2 border-t border-slate-300 font-extrabold text-sm">
                <span className="text-rose-700">នៅខ្វះ / ជំពាក់ (Balance Due)៖</span>
                <span className="text-rose-700 font-mono tabular-nums">
                  {formatUSD(invoice.balance)}
                </span>
              </div>
            </div>

          </div>

          {/* Footer & Signatures */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 text-center text-xs text-slate-500">
            <div>
              <div className="h-14"></div>
              <div className="border-t border-slate-300 w-36 mx-auto pt-1 font-medium text-slate-700">
                ហត្ថលេខាអ្នកជំងឺ
              </div>
            </div>
            <div>
              <div className="h-14"></div>
              <div className="border-t border-slate-300 w-36 mx-auto pt-1 font-medium text-slate-700">
                ហត្ថលេខាគ្លីនិក / បេឡា
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-[11px] text-slate-400">
            សូមអរគុណសម្រាប់ការជឿទុកចិត្តលើគ្លីនិកទន្តសាស្ត្រយើងខ្ញុំ! វិក្កយបត្រនេះចេញដោយប្រព័ន្ធ DentCare Pro។
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {copySuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">បានចម្លងអត្ថបទ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>ចម្លងអត្ថបទវិក្កយបត្រ</span>
                </>
              )}
            </button>

            {directTelegramUrl && (
              <button
                type="button"
                onClick={handleDirectPatientTelegram}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
              >
                <span>ឆាត Telegram ទៅអ្នកជំងឺ</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {invoice.balance > 0 && onRecordPayment && !showPayInput && (
              <button
                type="button"
                onClick={() => setShowPayInput(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors cursor-pointer shadow-xs"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>កត់ត្រាការបង់ប្រាក់បន្ថែម</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              បិទ
            </button>
          </div>
        </div>

        {/* Quick payment expander */}
        {showPayInput && (
          <div className="no-print p-4 bg-teal-50 border-t border-teal-200 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <label htmlFor="inv-pay-amount" className="text-xs font-semibold text-slate-800">
                ចំនួនទឹកប្រាក់បង់ ($)៖
              </label>
              <input
                id="inv-pay-amount"
                type="number"
                min="1"
                max={invoice.balance}
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                className="w-24 px-2 py-1 text-xs border border-teal-300 rounded-md bg-white font-bold tabular-nums"
              />
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as any)}
                className="px-2 py-1 text-xs border border-teal-300 rounded-md bg-white font-medium"
              >
                <option value="khqr">KHQR</option>
                <option value="cash">សាច់ប្រាក់សុទ្ធ</option>
                <option value="bank">ផ្ទេរធនាគារ</option>
                <option value="card">កាតធនាគារ</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowPayInput(false)}
                className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-3.5 py-1 text-xs font-semibold text-white bg-teal-700 rounded-md hover:bg-teal-800"
              >
                រក្សាទុក
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
