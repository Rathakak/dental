import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { Invoice } from '../../types';
import {
  FileSpreadsheet,
  Search,
  Plus,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { formatUSD, formatKhmerDate, generateTelegramShareUrl } from '../../utils/khmerHelpers';

interface InvoiceListProps {
  onViewInvoice: (invoice: Invoice) => void;
  onOpenNewInvoice: () => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  onViewInvoice,
  onOpenNewInvoice,
}) => {
  const { invoices } = useDental();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesSearch =
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patientPhone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return { label: 'ទូទាត់ដាច់', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'partial':
        return { label: 'បង់ខ្លះ (នៅខ្វះ)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'unpaid':
        return { label: 'មិនទាន់បង់', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    }
  };

  const handleShareTelegram = (inv: Invoice) => {
    const { shareUrl } = generateTelegramShareUrl(inv);
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-100 text-teal-800 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                ប្រវត្តិវិក្កយបត្រ និងការបង់ប្រាក់ (Invoice History)
              </h1>
              <p className="text-xs text-slate-500">
                តាមដានវិក្កយបត្រ ការទូទាត់ដាច់ បង់ខ្លះ និងចែករំលែកទៅ Telegram
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenNewInvoice}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>បង្កើតវិក្កយបត្រថ្មី (New Invoice)</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ទាំងអស់ ({invoices.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'paid' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ទូទាត់ដាច់ ({invoices.filter((i) => i.status === 'paid').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('partial')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'partial' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            នៅជំពាក់ ({invoices.filter((i) => i.status === 'partial').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ស្វែងរកតាមលេខវិក្កយបត្រ ឈ្មោះ..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">លេខវិក្កយបត្រ</th>
                <th className="py-3 px-4">កាលបរិច្ឆេទ</th>
                <th className="py-3 px-4">ឈ្មោះអ្នកជំងឺ</th>
                <th className="py-3 px-3 text-right">តម្លៃសរុប ($)</th>
                <th className="py-3 px-3 text-right">បានបង់រួច ($)</th>
                <th className="py-3 px-3 text-right">នៅខ្វះ ($)</th>
                <th className="py-3 px-3 text-center">ស្ថានភាព</th>
                <th className="py-3 px-3">វិធីទូទាត់</th>
                <th className="py-3 px-4 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => {
                const badge = getStatusBadge(inv.status);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-teal-800">
                      #{inv.id}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {formatKhmerDate(inv.date)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{inv.patientName}</div>
                      <span className="text-[11px] text-slate-400 font-mono">{inv.patientPhone}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                      {formatUSD(inv.total)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium tabular-nums text-emerald-700">
                      {formatUSD(inv.paid)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      <span className={inv.balance > 0 ? 'text-rose-600' : 'text-slate-400'}>
                        {formatUSD(inv.balance)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 uppercase font-mono text-[11px]">
                      {inv.paymentMethod}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleShareTelegram(inv)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-white bg-sky-500 rounded hover:bg-sky-600 transition-colors cursor-pointer"
                          title="Share ទៅ Telegram"
                        >
                          <Send className="w-3 h-3" />
                          <span>Telegram</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewInvoice(inv)}
                          className="p-1 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="មើលលម្អិត & បោះពុម្ព"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
