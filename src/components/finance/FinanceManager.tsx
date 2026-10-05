import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { FinancialRecord } from '../../types';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Trash2,
  Calendar,
} from 'lucide-react';
import { formatUSD, formatKHR, formatKhmerDate } from '../../utils/khmerHelpers';

export const FinanceManager: React.FC = () => {
  const {
    financialRecords,
    addFinancialRecord,
    deleteFinancialRecord,
    totalRevenueSum,
    totalExpensesSum,
    netProfitSum,
  } = useDental();

  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New record form
  const [newRecord, setNewRecord] = useState<Omit<FinancialRecord, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    category: 'stock_purchase',
    title: '',
    amount: 100,
    paymentMethod: 'KHQR',
    recordedBy: 'គណនេយ្យករ',
    notes: '',
  });

  const filteredRecords = financialRecords.filter((rec) => {
    const matchesType = typeFilter === 'all' || rec.type === typeFilter;
    const matchesSearch =
      rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.category.includes(searchTerm);
    return matchesType && matchesSearch;
  });

  const handleSaveRecord = () => {
    if (!newRecord.title || newRecord.amount <= 0) {
      alert('សូមបញ្ចូលចំណងជើង និងចំនួនទឹកប្រាក់!');
      return;
    }
    addFinancialRecord(newRecord);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                របាយការណ៍ចំណូល-ចំណាយគ្លីនិក (Income & Expense Ledger)
              </h1>
              <p className="text-xs text-slate-500">
                កត់ត្រាចំណូលព្យាបាល ការប្រមូលរំលោះ និងចំណាយប្រតិបត្តិការទូទៅ
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>កត់ត្រាចំណូល / ចំណាយថ្មី</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">ចំណូលសរុប (Income)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-600 tabular-nums">
            {formatUSD(totalRevenueSum)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-0.5 tabular-nums">
            ≈ {formatKHR(totalRevenueSum)}
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">ចំណាយសរុប (Expense)</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-extrabold text-rose-600 tabular-nums">
            {formatUSD(totalExpensesSum)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-0.5 tabular-nums">
            ≈ {formatKHR(totalExpensesSum)}
          </span>
        </div>

        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-teal-800">សមតុល្យសាច់ប្រាក់សុទ្ធ</span>
            <DollarSign className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-extrabold text-teal-700 tabular-nums">
            {formatUSD(netProfitSum)}
          </div>
          <span className="text-[11px] text-teal-600 block mt-0.5 tabular-nums">
            ≈ {formatKHR(netProfitSum)}
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              typeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ទាំងអស់ ({financialRecords.length})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('income')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              typeFilter === 'income' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ចំណូល (Income)
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('expense')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              typeFilter === 'expense' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ចំណាយ (Expense)
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ស្វែងរកតាមចំណងជើង..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">កាលបរិច្ឆេទ</th>
                <th className="py-3 px-3">ប្រភេទ</th>
                <th className="py-3 px-4">ការពិពណ៌នា / ចំណងជើង</th>
                <th className="py-3 px-3 text-right">ចំនួនទឹកប្រាក់ ($)</th>
                <th className="py-3 px-3">វិធីទូទាត់</th>
                <th className="py-3 px-3">កត់ត្រាដោយ</th>
                <th className="py-3 px-2 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((rec) => {
                const isIncome = rec.type === 'income';
                return (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {formatKhmerDate(rec.date)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isIncome
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isIncome ? '+ ចំណូល' : '- ចំណាយ'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{rec.title}</div>
                      {rec.notes && <div className="text-[11px] text-slate-400">{rec.notes}</div>}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums whitespace-nowrap">
                      <span className={isIncome ? 'text-emerald-700' : 'text-rose-700'}>
                        {isIncome ? '+' : '-'}{formatUSD(rec.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {rec.paymentMethod}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {rec.recordedBy}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`តើអ្នកចង់លុបប្រតិបត្តិការ "${rec.title}" មែនទេ?`)) {
                            deleteFinancialRecord(rec.id);
                          }
                        }}
                        className="p-1 text-slate-300 hover:text-rose-600 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              កត់ត្រាប្រតិបត្តិការហិរញ្ញវត្ថុថ្មី
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              កត់ត្រាចំណូលពីការព្យាបាល ឬចំណាយប្រតិបត្តិការផ្សេងៗ
            </p>

            <div className="space-y-3">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setNewRecord({ ...newRecord, type: 'income' })}
                  className={`py-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    newRecord.type === 'income'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  + ចំណូល (Income)
                </button>
                <button
                  type="button"
                  onClick={() => setNewRecord({ ...newRecord, type: 'expense' })}
                  className={`py-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    newRecord.type === 'expense'
                      ? 'border-rose-600 bg-rose-50 text-rose-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  - ចំណាយ (Expense)
                </button>
              </div>

              <div>
                <label htmlFor="fin-title" className="block text-xs font-semibold text-slate-700 mb-1">
                  ចំណងជើង / ការពិពណ៌នា *
                </label>
                <input
                  id="fin-title"
                  type="text"
                  value={newRecord.title}
                  onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                  placeholder="ឧ. បង់ថ្លៃ Dental Lab សម្រាប់ Crown, ទិញស្រោមដៃ..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="fin-amount" className="block text-xs font-semibold text-slate-700 mb-1">
                    ចំនួនទឹកប្រាក់ ($) *
                  </label>
                  <input
                    id="fin-amount"
                    type="number"
                    min="1"
                    value={newRecord.amount}
                    onChange={(e) => setNewRecord({ ...newRecord, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="fin-date" className="block text-xs font-semibold text-slate-700 mb-1">
                    កាលបរិច្ឆេទ
                  </label>
                  <input
                    id="fin-date"
                    type="date"
                    value={newRecord.date}
                    onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="fin-category" className="block text-xs font-semibold text-slate-700 mb-1">
                  ប្រភេទចំណាត់ថ្នាក់
                </label>
                <select
                  id="fin-category"
                  value={newRecord.category}
                  onChange={(e) => setNewRecord({ ...newRecord, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  {newRecord.type === 'income' ? (
                    <>
                      <option value="treatment_fee">ថ្លៃព្យាបាលអ្នកជំងឺ</option>
                      <option value="installment_collection">ប្រមូលប្រាក់រំលោះ</option>
                      <option value="other">ចំណូលផ្សេងៗ</option>
                    </>
                  ) : (
                    <>
                      <option value="stock_purchase">ទិញសម្ភារៈស្តុក</option>
                      <option value="dental_lab">ថ្លៃរោងចក្រ Dental Lab</option>
                      <option value="rent_utility">ថ្លៃជួល & ទឹកភ្លើង</option>
                      <option value="doctor_salary">ប្រាក់បៀវត្សរ៍ & ភាគរយវេជ្ជបណ្ឌិត</option>
                      <option value="equipment">ទិញជួសជុលម៉ាស៊ីនពេទ្យ</option>
                      <option value="other">ចំណាយផ្សេងៗ</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="fin-method" className="block text-xs font-semibold text-slate-700 mb-1">
                  វិធីសាស្ត្រទូទាត់
                </label>
                <select
                  id="fin-method"
                  value={newRecord.paymentMethod}
                  onChange={(e) => setNewRecord({ ...newRecord, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="KHQR">ABA KHQR / Bakong</option>
                  <option value="Cash">សាច់ប្រាក់សុទ្ធ (Cash)</option>
                  <option value="Bank Transfer">ផ្ទេរតាមធនាគារ</option>
                  <option value="Card">កាតធនាគារ</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={handleSaveRecord}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-xs"
              >
                រក្សាទុកប្រតិបត្តិការ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
