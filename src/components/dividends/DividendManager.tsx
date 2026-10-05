import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { BeneficiaryShare } from '../../types';
import {
  PieChart,
  DollarSign,
  Plus,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { formatUSD, formatKHR, formatKhmerDate } from '../../utils/khmerHelpers';

export const DividendManager: React.FC = () => {
  const {
    dividends,
    createDividendDistribution,
    markBeneficiaryPaid,
    totalRevenueSum,
    totalExpensesSum,
    netProfitSum,
  } = useDental();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [period, setPeriod] = useState('ខែមីនា ២០២៦');
  const [revenue, setRevenue] = useState(totalRevenueSum > 0 ? totalRevenueSum : 18500);
  const [expenses, setExpenses] = useState(totalExpensesSum > 0 ? totalExpensesSum : 7200);
  const [clinicReservePct, setClinicReservePct] = useState(20);

  // Beneficiaries configuration
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryShare[]>([
    { id: 'ben-1', name: 'ទន្តបណ្ឌិត សាន វិបុល', role: 'ទន្តបណ្ឌិតឯកទេស / ដៃគូស្ថាបនិក', sharePercent: 35, amount: 0, paidStatus: 'pending' },
    { id: 'ben-2', name: 'ទន្តបណ្ឌិត លឹម ស្រីមុំ', role: 'ទន្តបណ្ឌិតពត់ធ្មេញ / ដៃគូស្ថាបនិក', sharePercent: 35, amount: 0, paidStatus: 'pending' },
    { id: 'ben-3', name: 'លោក សុខ ផល្លា', role: 'ភាគទុនិកវិនិយោគិន (Investor)', sharePercent: 30, amount: 0, paidStatus: 'pending' },
  ]);

  const netProfit = Math.max(0, revenue - expenses);
  const clinicReserveAmount = Math.round((netProfit * (clinicReservePct / 100)) * 100) / 100;
  const distributableProfit = Math.max(0, netProfit - clinicReserveAmount);

  const calculatedBeneficiaries = beneficiaries.map((b) => ({
    ...b,
    amount: Math.round((distributableProfit * (b.sharePercent / 100)) * 100) / 100,
  }));

  const handleSaveDividend = () => {
    createDividendDistribution({
      period,
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit,
      clinicReservePercent: clinicReservePct,
      clinicReserveAmount,
      distributableProfit,
      beneficiaries: calculatedBeneficiaries,
    });
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-100 text-indigo-800 rounded-lg">
              <PieChart className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                គ្រប់គ្រងការបែងចែកភាគលាភ (Dividend & Profit Sharing)
              </h1>
              <p className="text-xs text-slate-500">
                គណនាប្រាក់ចំណេញសុទ្ធ កាត់ទុនបម្រុងគ្លីនិក និងបែងចែកភាគលាភជូនទន្តបណ្ឌិត និងភាគទុនិក
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>បង្កើតការបែងចែកភាគលាភថ្មី</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">ចំណូលសរុប (Revenue)</span>
            <span className="p-1 bg-emerald-50 text-emerald-600 rounded-md">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 tabular-nums">
            {formatUSD(totalRevenueSum)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            ≈ {formatKHR(totalRevenueSum)}
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">ចំណាយប្រតិបត្តិការ (Expenses)</span>
            <span className="p-1 bg-rose-50 text-rose-600 rounded-md">
              <ArrowDownRight className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 tabular-nums">
            {formatUSD(totalExpensesSum)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            ថ្លៃជួល សម្ភារៈ Dental Lab និងប្រាក់ខែ
          </span>
        </div>

        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-teal-800">ប្រាក់ចំណេញសុទ្ធ (Net Profit)</span>
            <DollarSign className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-extrabold text-teal-700 tabular-nums">
            {formatUSD(netProfitSum)}
          </div>
          <span className="text-[11px] text-teal-600 block mt-0.5">
            មុនកាត់ទុនបម្រុងពង្រីកគ្លីនិក
          </span>
        </div>
      </div>

      {/* Historical Dividend Distributions */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          ប្រវត្តិការបែងចែកភាគលាភប្រចាំខែ (Distribution History)
        </h2>

        {dividends.map((div) => (
          <div
            key={div.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
          >
            {/* Distribution Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <span className="text-[11px] font-mono font-semibold text-indigo-700">
                  #{div.id}
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  ការបែងចែកភាគលាភ {div.period}
                </h3>
                <span className="text-xs text-slate-400">
                  កាលបរិច្ឆេទបង្កើត៖ {formatKhmerDate(div.createdDate)}
                </span>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">ចំណេញសុទ្ធ</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {formatUSD(div.netProfit)}
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[10px] text-slate-400 block">ទុនបម្រុងគ្លីនិក ({div.clinicReservePercent}%)</span>
                  <span className="font-semibold text-teal-700 tabular-nums">
                    {formatUSD(div.clinicReserveAmount)}
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[10px] text-slate-400 block">ភាគលាភបែងចែក</span>
                  <span className="font-bold text-indigo-700 tabular-nums">
                    {formatUSD(div.distributableProfit)}
                  </span>
                </div>
              </div>
            </div>

            {/* Beneficiaries Breakdown */}
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-2">
                តារាងបែងចែកជូនដៃគូ និងភាគទុនិក៖
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {div.beneficiaries.map((ben) => (
                  <div
                    key={ben.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900">
                          {ben.name}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-indigo-700">
                          {ben.sharePercent}%
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mb-2">
                        {ben.role}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                          {formatUSD(ben.amount)}
                        </span>
                        <span className="text-[10px] text-slate-400 block tabular-nums">
                          ≈ {formatKHR(ben.amount)}
                        </span>
                      </div>

                      {ben.paidStatus === 'paid' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>បានបើក</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => markBeneficiaryPaid(div.id, ben.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-teal-700 bg-white border border-teal-300 rounded hover:bg-teal-50 transition-colors cursor-pointer"
                        >
                          បើកប្រាក់
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Dividend Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl p-6 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              គណនា និងបែងចែកភាគលាភថ្មី
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              បញ្ចូលចំណូល និងចំណាយដើម្បីគណនាភាគលាភស្វ័យប្រវត្ត
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="div-period" className="block text-xs font-semibold text-slate-700 mb-1">
                  ខែ / ត្រីមាសគិតភាគលាភ
                </label>
                <input
                  id="div-period"
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="div-revenue" className="block text-xs font-semibold text-slate-700 mb-1">
                    ចំណូលសរុប ($)
                  </label>
                  <input
                    id="div-revenue"
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="div-expenses" className="block text-xs font-semibold text-slate-700 mb-1">
                    ចំណាយសរុប ($)
                  </label>
                  <input
                    id="div-expenses"
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold tabular-nums"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">ចំណេញសុទ្ធ (Net Profit)៖</span>
                  <span className="font-bold text-slate-900 tabular-nums">{formatUSD(netProfit)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">ទុនបម្រុងគ្លីនិក (%):</span>
                  <input
                    type="number"
                    value={clinicReservePct}
                    onChange={(e) => setClinicReservePct(Number(e.target.value))}
                    className="w-16 px-2 py-0.5 text-xs border border-slate-300 rounded text-right font-bold"
                  />
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-teal-800">
                  <span>ប្រាក់ចំណេញត្រូវបែងចែក (Distributable)៖</span>
                  <span className="tabular-nums">{formatUSD(distributableProfit)}</span>
                </div>
              </div>

              {/* Share previews */}
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  ការបែងចែកតាមភាគហ៊ុន៖
                </span>
                <div className="space-y-1.5 text-xs">
                  {calculatedBeneficiaries.map((b) => (
                    <div key={b.id} className="flex justify-between p-2 bg-slate-50 rounded border border-slate-100">
                      <span>{b.name} ({b.sharePercent}%)</span>
                      <span className="font-bold text-slate-900 tabular-nums">{formatUSD(b.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={handleSaveDividend}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-xs"
              >
                រក្សាទុកការបែងចែក
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
