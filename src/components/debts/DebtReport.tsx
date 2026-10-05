import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import {
  AlertTriangle,
  Search,
  Send,
  CreditCard,
  Eye,
  CheckCircle2,
  DollarSign,
  Users,
} from 'lucide-react';
import {
  formatUSD,
  formatKHR,
  formatKhmerDate,
  generateDebtReminderTelegram,
} from '../../utils/khmerHelpers';
import { Invoice } from '../../types';

interface DebtReportProps {
  onViewInvoice: (invoice: Invoice) => void;
}

export const DebtReport: React.FC<DebtReportProps> = ({ onViewInvoice }) => {
  const { getPatientDebts, totalDebtSum, recordPayment } = useDental();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Quick payment modal state
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'khqr' | 'cash' | 'bank' | 'card'>('khqr');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  // Get strictly debtor patients
  const debtorRecords = getPatientDebts();

  // Filter debtors by search
  const filteredDebtors = debtorRecords.filter(
    (item) =>
      item.patient.nameKhmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patient.nameLatin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patient.phone.includes(searchTerm)
  );

  const handleOpenPayModal = (inv: Invoice) => {
    setPayingInvoice(inv);
    setPayAmount(inv.balance);
  };

  const handleConfirmPayment = () => {
    if (!payingInvoice) return;
    if (payAmount <= 0) {
      alert('សូមបញ្ចូលចំនួនទឹកប្រាក់បង់!');
      return;
    }

    recordPayment(payingInvoice.id, payAmount, payMethod, 'ទូទាត់សមតុល្យជំពាក់');
    setPaymentSuccessMsg(`បានកត់ត្រាការបង់ប្រាក់ $${payAmount} សម្រាប់វិក្កយបត្រ #${payingInvoice.id} ដោយជោគជ័យ!`);
    setPayingInvoice(null);
    setTimeout(() => setPaymentSuccessMsg(''), 4000);
  };

  const handleSendTelegramReminder = (debtor: typeof debtorRecords[0]) => {
    const { shareUrl } = generateDebtReminderTelegram({
      nameKhmer: debtor.patient.nameKhmer,
      phone: debtor.patient.phone,
      totalDebt: debtor.debtAmount,
      nextDueDate: debtor.nextDueDate,
    });
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Metrics */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-rose-100 text-rose-700 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  របាយការណ៍អ្នកជំងឺជំពាក់ប្រាក់ (Outstanding Debtors Report)
                </h1>
                <p className="text-xs text-slate-500">
                  ប្រព័ន្ធចម្រាញ់ និងបង្ហាញតែឈ្មោះអ្នកជំងឺដែលមានសមតុល្យជំពាក់ សម្រាប់តាមដាន និងរំលឹកទារប្រាក់
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <div className="px-2 text-center">
              <span className="text-[11px] text-slate-500 block">អ្នកជំងឺជំពាក់សរុប</span>
              <span className="text-base font-bold text-slate-900 tabular-nums">
                {debtorRecords.length} នាក់
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="px-2 text-center">
              <span className="text-[11px] text-slate-500 block">ទឹកប្រាក់ជំពាក់សរុប</span>
              <span className="text-base font-extrabold text-rose-600 tabular-nums">
                {formatUSD(totalDebtSum)}
              </span>
              <span className="text-[10px] text-slate-400 block tabular-nums">
                ≈ {formatKHR(totalDebtSum)}
              </span>
            </div>
          </div>
        </div>

        {paymentSuccessMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs font-medium text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{paymentSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ស្វែងរកឈ្មោះ ឬលេខទូរស័ព្ទអ្នកជំងឺ..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="text-xs text-slate-500">
          បង្ហាញ <span className="font-semibold text-slate-900">{filteredDebtors.length}</span> នាក់ ក្នុងចំណោម {debtorRecords.length} នាក់
        </div>
      </div>

      {/* Debtors List (Strictly isolated - Requirement 5) */}
      {filteredDebtors.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            គ្មានអ្នកជំងឺជំពាក់ប្រាក់ដែលត្រូវបង្ហាញឡើយ
          </h3>
          <p className="text-xs text-slate-500">
            {searchTerm ? 'មិនមានលទ្ធផលផ្គូផ្គងនឹងពាក្យស្វែងរករបស់អ្នកឡើយ' : 'អ្នកជំងឺទាំងអស់បានទូទាត់ប្រាក់រួចរាល់ គ្មានសមតុល្យនៅខ្វះទេ'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">ឈ្មោះអ្នកជំងឺ</th>
                  <th className="py-3 px-4">លេខទូរស័ព្ទ / Telegram</th>
                  <th className="py-3 px-4 text-right">តម្លៃព្យាបាលសរុប</th>
                  <th className="py-3 px-4 text-right">បានបង់រួច</th>
                  <th className="py-3 px-4 text-right text-rose-700">នៅខ្វះ (ជំពាក់)</th>
                  <th className="py-3 px-4">ថ្ងៃព្យាបាលចុងក្រោយ</th>
                  <th className="py-3 px-4">ថ្ងៃកំណត់បង់បន្ទាប់</th>
                  <th className="py-3 px-4 text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDebtors.map((item) => {
                  const mainInvoice = item.invoices[0];
                  return (
                    <tr key={item.patient.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Patient Name */}
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div className="font-semibold text-slate-900">
                          {item.patient.nameKhmer}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {item.patient.nameLatin} ({item.patient.id})
                        </span>
                      </td>

                      {/* Phone & Telegram */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-700">{item.patient.phone}</div>
                        {item.patient.telegram && (
                          <span className="text-[11px] text-sky-600">
                            {item.patient.telegram}
                          </span>
                        )}
                      </td>

                      {/* Total Billed */}
                      <td className="py-3 px-4 text-right font-medium text-slate-700 tabular-nums">
                        {formatUSD(item.totalBilled)}
                      </td>

                      {/* Total Paid */}
                      <td className="py-3 px-4 text-right text-emerald-700 font-medium tabular-nums">
                        {formatUSD(item.totalPaid)}
                      </td>

                      {/* Debt Amount */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-bold text-rose-600 text-sm tabular-nums">
                          {formatUSD(item.debtAmount)}
                        </div>
                        <span className="text-[10px] text-slate-400 tabular-nums">
                          {formatKHR(item.debtAmount)}
                        </span>
                      </td>

                      {/* Last Date */}
                      <td className="py-3 px-4 text-slate-600">
                        {formatKhmerDate(item.lastInvoiceDate)}
                      </td>

                      {/* Next Due Date */}
                      <td className="py-3 px-4">
                        {item.nextDueDate ? (
                          <span className="text-amber-700 font-medium">
                            {formatKhmerDate(item.nextDueDate)}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Send Telegram Reminder */}
                          <button
                            type="button"
                            onClick={() => handleSendTelegramReminder(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-white bg-sky-500 rounded-md hover:bg-sky-600 transition-colors shadow-2xs cursor-pointer"
                            title="ផ្ញើសាររំលឹកបង់ប្រាក់តាម Telegram"
                          >
                            <Send className="w-3 h-3" />
                            <span>រំលឹក Telegram</span>
                          </button>

                          {/* Quick Payment Collect */}
                          {mainInvoice && (
                            <button
                              type="button"
                              onClick={() => handleOpenPayModal(mainInvoice)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-md hover:bg-teal-100 transition-colors cursor-pointer"
                              title="ទទួលប្រាក់បង់បង្គ្រប់"
                            >
                              <CreditCard className="w-3 h-3 text-teal-600" />
                              <span>បង់ប្រាក់</span>
                            </button>
                          )}

                          {/* View Invoice */}
                          {mainInvoice && (
                            <button
                              type="button"
                              onClick={() => onViewInvoice(mainInvoice)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title="មើលវិក្កយបត្រលម្អិត"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Collect Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              ទទួលការបង់ប្រាក់ជំពាក់ (Receive Debt Payment)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              វិក្កយបត្រ #{payingInvoice.id} · អ្នកជំងឺ៖ {payingInvoice.patientName}
            </p>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-500">សមតុល្យជំពាក់សរុប៖</span>
                <span className="font-bold text-rose-600 text-sm tabular-nums">
                  {formatUSD(payingInvoice.balance)} ({formatKHR(payingInvoice.balance)})
                </span>
              </div>

              <div>
                <label htmlFor="debt-pay-amount" className="block text-xs font-semibold text-slate-700 mb-1">
                  ចំនួនទឹកប្រាក់បង់លើកនេះ ($) *
                </label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="debt-pay-amount"
                    type="number"
                    min="1"
                    max={payingInvoice.balance}
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-bold tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  វិធីសាស្ត្រទូទាត់ (Payment Method) *
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'khqr', label: 'ABA KHQR / Bakong' },
                    { id: 'cash', label: 'សាច់ប្រាក់សុទ្ធ (Cash)' },
                    { id: 'bank', label: 'ផ្ទេរតាមធនាគារ' },
                    { id: 'card', label: 'កាតធនាគារ (Card)' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethod(m.id as any)}
                      className={`p-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                        payMethod === m.id
                          ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPayingInvoice(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs cursor-pointer"
              >
                បញ្ជាក់ការទទួលប្រាក់
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
