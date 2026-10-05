import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { InstallmentPlan } from '../../types';
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  CreditCard,
  DollarSign,
} from 'lucide-react';
import {
  formatUSD,
  formatKHR,
  formatKhmerDate,
} from '../../utils/khmerHelpers';

interface InstallmentManagerProps {
  onOpenCalculator: () => void;
}

export const InstallmentManager: React.FC<InstallmentManagerProps> = ({ onOpenCalculator }) => {
  const { installmentPlans, payInstallmentStage } = useDental();
  const [filter, setFilter] = useState<'all' | 'active' | 'overdue' | 'completed'>('all');
  const [selectedPlan, setSelectedPlan] = useState<InstallmentPlan | null>(installmentPlans[0] || null);
  const [payingStage, setPayingStage] = useState<{ planId: string; stageNumber: number; amount: number } | null>(null);

  const filteredPlans = installmentPlans.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const handleConfirmStagePay = () => {
    if (!payingStage) return;
    payInstallmentStage(payingStage.planId, payingStage.stageNumber, 'KHQR');
    setPayingStage(null);

    // Refresh selected plan
    const updated = installmentPlans.find(p => p.id === payingStage.planId);
    if (updated) setSelectedPlan(updated);
  };

  const handleSharePlanTelegram = (plan: InstallmentPlan) => {
    const lines = plan.stages
      .map(
        (s) =>
          `  • ដំណាក់កាលទី ${s.stageNumber} (ថ្ងៃ ${formatKhmerDate(s.dueDate)}): $${s.amount.toFixed(2)} [${
            s.status === 'paid' ? '✅ បានបង់' : s.status === 'overdue' ? '⚠️ ហួសកំណត់' : '⏳ រង់ចាំ'
          }]`
      )
      .join('\n');

    const text = `🦷 គ្លីនិកទន្តសាស្ត្រ DENTCARE PRO
📋 បច្ចុប្បន្នភាពគម្រោងបង់រំលោះ (#${plan.id})
━━━━━━━━━━━━━━━━━━
👤 អ្នកជំងឺ៖ ${plan.patientName}
🦷 សេវាកម្ម៖ ${plan.treatmentDescription}
💰 តម្លៃសរុប៖ $${plan.totalCost.toFixed(2)} (${formatKHR(plan.totalCost)})
💵 បានកក់ដំបូង៖ $${plan.deposit.toFixed(2)}
⏳ នៅសល់ត្រូវបង់៖ $${plan.remainingBalance.toFixed(2)}
💳 ត្រូវបង់ប្រចាំខែ៖ $${plan.monthlyPayment.toFixed(2)}/ខែ (${plan.months} ខែ)

កាលវិភាគបង់ប្រាក់៖
${lines}
━━━━━━━━━━━━━━━━━━
សូមអរគុណ! ទំនាក់ទំនង៖ 012 345 678`;

    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-100 text-teal-800 rounded-lg">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                គ្រប់គ្រងការបង់ប្រាក់ជាដំណាក់កាល (Installment Plans)
              </h1>
              <p className="text-xs text-slate-500">
                តាមដានគម្រោងពត់ធ្មេញ ដាំបង្គោលធ្មេញ និងការបង់ប្រាក់ប្រចាំខែ
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCalculator}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>គណនា & បង្កើតគម្រោងថ្មី (New Plan)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit text-xs font-medium">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ទាំងអស់ ({installmentPlans.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('active')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            filter === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          កំពុងបង់ ({installmentPlans.filter((p) => p.status === 'active').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('overdue')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            filter === 'overdue' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ហួសកំណត់ ({installmentPlans.filter((p) => p.status === 'overdue').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            filter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          បង់ចប់ ({installmentPlans.filter((p) => p.status === 'completed').length})
        </button>
      </div>

      {/* Main Grid: Plan List & Plan Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Plans List */}
        <div className="space-y-3">
          {filteredPlans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            const paidStagesCount = plan.stages.filter((s) => s.status === 'paid').length;
            const progressPercent = Math.round((paidStagesCount / plan.months) * 100);

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-teal-600 bg-white ring-2 ring-teal-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <span className="text-[10px] font-mono font-semibold text-slate-400">
                      #{plan.id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {plan.patientName}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      plan.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : plan.status === 'overdue'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {plan.status === 'completed' ? 'បង់ចប់សព្វគ្រប់' : plan.status === 'overdue' ? 'ហួសកំណត់' : 'កំពុងបង់'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-1 mb-3">
                  {plan.treatmentDescription}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>វឌ្ឍនភាព៖ {paidStagesCount}/{plan.months} លើក</span>
                    <span className="font-semibold text-slate-700">{progressPercent}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        plan.status === 'completed' ? 'bg-emerald-500' : 'bg-teal-600'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-500">
                    នៅខ្វះ៖ <strong className="text-slate-900 tabular-nums">{formatUSD(plan.remainingBalance)}</strong>
                  </span>
                  <span className="text-teal-700 font-semibold tabular-nums">
                    {formatUSD(plan.monthlyPayment)}/ខែ
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Plan Detail & Stages */}
        <div className="lg:col-span-2">
          {selectedPlan ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-teal-700">
                      #{selectedPlan.id}
                    </span>
                    <span className="text-slate-300">·</span>
                    <h2 className="text-base font-bold text-slate-900">
                      {selectedPlan.patientName}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedPlan.treatmentDescription} · ទូរស័ព្ទ៖ {selectedPlan.patientPhone}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSharePlanTelegram(selectedPlan)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Share ទៅ Telegram</span>
                </button>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">តម្លៃសរុប</span>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">
                    {formatUSD(selectedPlan.totalCost)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">ប្រាក់កក់ដំបូង</span>
                  <span className="text-sm font-bold text-teal-700 tabular-nums">
                    {formatUSD(selectedPlan.deposit)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">នៅសល់រំលោះ</span>
                  <span className="text-sm font-bold text-rose-600 tabular-nums">
                    {formatUSD(selectedPlan.remainingBalance)}
                  </span>
                </div>
                <div className="p-3 bg-teal-600 text-white rounded-lg">
                  <span className="text-[11px] text-teal-100 block">បង់ប្រចាំខែ</span>
                  <span className="text-base font-extrabold tabular-nums">
                    {formatUSD(selectedPlan.monthlyPayment)}
                  </span>
                </div>
              </div>

              {/* Stages Breakdown Table */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-3">
                  កាលវិភាគបង់ប្រាក់ ({selectedPlan.stages.length} ដំណាក់កាល)
                </h3>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">ដំណាក់កាល</th>
                        <th className="py-2.5 px-3">ថ្ងៃកំណត់ (Due Date)</th>
                        <th className="py-2.5 px-3 text-right">ទឹកប្រាក់ ($)</th>
                        <th className="py-2.5 px-3 text-center">ស្ថានភាព</th>
                        <th className="py-2.5 px-3 text-center">សកម្មភាព</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedPlan.stages.map((stage) => (
                        <tr key={stage.stageNumber} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-900">
                            លើកទី {stage.stageNumber}
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {formatKhmerDate(stage.dueDate)}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                            {formatUSD(stage.amount)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {stage.status === 'paid' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>បង់រួច ({stage.paidDate ? formatKhmerDate(stage.paidDate) : ''})</span>
                              </span>
                            ) : stage.status === 'overdue' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>ហួសកាលកំណត់</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-500">
                                រង់ចាំបង់
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {stage.status !== 'paid' ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setPayingStage({
                                    planId: selectedPlan.id,
                                    stageNumber: stage.stageNumber,
                                    amount: stage.amount,
                                  })
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-md hover:bg-teal-100 transition-colors cursor-pointer"
                              >
                                <CreditCard className="w-3 h-3 text-teal-600" />
                                <span>ទទួលប្រាក់</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400">រួចរាល់</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-xs">
              ជ្រើសរើសគម្រោងបង់រំលោះនៅខាងឆ្វេងដើម្បីពិនិត្យលម្អិត
            </div>
          )}
        </div>

      </div>

      {/* Pay Stage Confirmation Modal */}
      {payingStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              បញ្ជាក់ការទទួលប្រាក់រំលោះលើកទី {payingStage.stageNumber}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              ចំនួនទឹកប្រាក់ត្រូវទូទាត់៖ <strong className="text-teal-700 tabular-nums">{formatUSD(payingStage.amount)}</strong> ({formatKHR(payingStage.amount)})
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPayingStage(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={handleConfirmStagePay}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
              >
                បញ្ជាក់ទទួលប្រាក់ (KHQR)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
