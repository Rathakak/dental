import React, { useState, useMemo } from 'react';
import { useDental } from '../../context/DentalContext';
import {
  X,
  Calculator,
  Send,
  Printer,
  Calendar,
  DollarSign,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import {
  formatUSD,
  formatKHR,
  calculateInstallmentSchedule,
  formatKhmerDate,
} from '../../utils/khmerHelpers';

interface AutoInstallmentCalculatorModalProps {
  onClose: () => void;
  preselectedPatientId?: string;
  onSuccessCreated?: () => void;
}

export const AutoInstallmentCalculatorModal: React.FC<AutoInstallmentCalculatorModalProps> = ({
  onClose,
  preselectedPatientId,
  onSuccessCreated,
}) => {
  const { patients, createInstallmentPlan } = useDental();

  const [patientId, setPatientId] = useState(preselectedPatientId || patients[0]?.id || '');
  const [treatmentDescription, setTreatmentDescription] = useState('ពត់ធ្មេញ Damon Clear លើក្រោម');
  const [totalCost, setTotalCost] = useState<number>(1800);
  const [deposit, setDeposit] = useState<number>(500);
  const [months, setMonths] = useState<number>(6);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [copySuccess, setCopySuccess] = useState(false);

  // Selected patient
  const selectedPatient = patients.find(p => p.id === patientId);

  // Real-time calculation based on inputs (Requirement 12)
  const calculation = useMemo(() => {
    return calculateInstallmentSchedule(
      Number(totalCost) || 0,
      Number(deposit) || 0,
      Number(months) || 1,
      startDate
    );
  }, [totalCost, deposit, months, startDate]);

  // Handle saving the calculated plan to the patient
  const handleSavePlan = () => {
    if (!selectedPatient) {
      alert('សូមជ្រើសរើសអ្នកជំងឺជាមុនសិន!');
      return;
    }
    if (totalCost <= 0) {
      alert('សូមបញ្ចូលតម្លៃព្យាបាលសរុប!');
      return;
    }

    createInstallmentPlan({
      patientId: selectedPatient.id,
      patientName: selectedPatient.nameKhmer,
      patientPhone: selectedPatient.phone,
      treatmentDescription,
      totalCost: Number(totalCost),
      deposit: Number(deposit),
      months: Number(months),
      startDate,
    });

    alert(`បានបង្កើតគម្រោងបង់រំលោះសម្រាប់ ${selectedPatient.nameKhmer} ដោយជោគជ័យ!`);
    if (onSuccessCreated) onSuccessCreated();
    onClose();
  };

  // Telegram formatted text for quote sharing (Requirement 13)
  const telegramMessage = useMemo(() => {
    const pName = selectedPatient ? selectedPatient.nameKhmer : 'អតិថិជន';
    const scheduleLines = calculation.stages
      .map(
        (s) =>
          `  • ដំណាក់កាលទី ${s.stageNumber} (ថ្ងៃ ${formatKhmerDate(s.dueDate)}): $${s.amount.toFixed(2)}`
      )
      .join('\n');

    return `🦷 គ្លីនិកទន្តសាស្ត្រ DENTCARE PRO
📋 តារាងគម្រោងបង់ប្រាក់រំលោះព្យាបាលធ្មេញ
━━━━━━━━━━━━━━━━━━
👤 អ្នកជំងឺ៖ ${pName}
🦷 សេវាកម្ម៖ ${treatmentDescription}
📅 ថ្ងៃចាប់ផ្តើម៖ ${formatKhmerDate(startDate)}
💰 តម្លៃព្យាបាលសរុប៖ $${totalCost.toFixed(2)} (${formatKHR(totalCost)})
💵 ប្រាក់កក់ដំបូង (Deposit)៖ $${deposit.toFixed(2)} (${formatKHR(deposit)})
⏳ សមតុល្យរំលោះ៖ $${calculation.remainingBalance.toFixed(2)}
⏱️ រយៈពេលរំលោះ៖ ${months} ខែ
💳 ចំនួនទឹកប្រាក់ត្រូវបង់ប្រចាំខែ៖ $${calculation.monthlyPayment.toFixed(2)} / ខែ

🗓️ កាលវិភាគបង់ប្រាក់៖
${scheduleLines}
━━━━━━━━━━━━━━━━━━
🙏 សូមអរគុណសម្រាប់ការជឿទុកចិត្ត!
📞 ទំនាក់ទំនង៖ 012 345 678`;
  }, [selectedPatient, treatmentDescription, startDate, totalCost, deposit, calculation, months]);

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(telegramMessage)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(telegramMessage);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                ប្រព័ន្ធគណនាការបង់រំលោះស្វ័យប្រវត្ត (Auto Installment Calculator)
              </h2>
              <p className="text-xs text-slate-500">
                បញ្ចូលលុយកក់ និងចំនួនខែ ប្រព័ន្ធនឹងគណនាចំនួនត្រូវបង់ប្រចាំខែ និងកាលវិភាគភ្លាមៗ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Input Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            
            {/* Patient Selector */}
            <div className="sm:col-span-2 md:col-span-1">
              <label htmlFor="inst-patient-select" className="block text-xs font-semibold text-slate-700 mb-1">
                ជ្រើសរើសអ្នកជំងឺ *
              </label>
              <select
                id="inst-patient-select"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nameKhmer} ({p.phone})
                  </option>
                ))}
              </select>
            </div>

            {/* Treatment description */}
            <div className="sm:col-span-2">
              <label htmlFor="inst-treatment-desc" className="block text-xs font-semibold text-slate-700 mb-1">
                សេវាកម្មព្យាបាល *
              </label>
              <input
                id="inst-treatment-desc"
                type="text"
                value={treatmentDescription}
                onChange={(e) => setTreatmentDescription(e.target.value)}
                placeholder="ឧ. ពត់ធ្មេញ Damon Clear, ដាំបង្គោលធ្មេញ Straumann..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

            {/* Total Cost ($) */}
            <div>
              <label htmlFor="inst-total-cost" className="block text-xs font-semibold text-slate-700 mb-1">
                តម្លៃព្យាបាលសរុប ($) *
              </label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  id="inst-total-cost"
                  type="number"
                  min="0"
                  step="10"
                  value={totalCost}
                  onChange={(e) => setTotalCost(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-bold tabular-nums"
                />
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                ≈ {formatKHR(totalCost)}
              </span>
            </div>

            {/* Deposit / Down Payment ($) */}
            <div>
              <label htmlFor="inst-deposit" className="block text-xs font-semibold text-slate-700 mb-1">
                ប្រាក់កក់ដំបូង ($) *
              </label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  id="inst-deposit"
                  type="number"
                  min="0"
                  step="10"
                  value={deposit}
                  onChange={(e) => setDeposit(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-bold tabular-nums text-teal-700"
                />
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                ≈ {formatKHR(deposit)}
              </span>
            </div>

            {/* Duration (Months) */}
            <div>
              <label htmlFor="inst-months" className="block text-xs font-semibold text-slate-700 mb-1">
                ចំនួនខែរំលោះ *
              </label>
              <div className="flex items-center gap-1.5">
                <select
                  id="inst-months"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-bold tabular-nums"
                >
                  <option value={3}>3 ខែ</option>
                  <option value={6}>6 ខែ</option>
                  <option value={10}>10 ខែ</option>
                  <option value={12}>12 ខែ (1 ឆ្នាំ)</option>
                  <option value={18}>18 ខែ (1 ឆ្នាំកន្លះ)</option>
                  <option value={24}>24 ខែ (2 ឆ្នាំ)</option>
                </select>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="inst-start-date" className="block text-xs font-semibold text-slate-700 mb-1">
                កាលបរិច្ឆេទចាប់ផ្តើម
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  id="inst-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
            </div>

          </div>

          {/* Instant Calculation Output Card (Requirement 12) */}
          <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 sm:p-5">
            <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block mb-3">
              លទ្ធផលគណនាស្វ័យប្រវត្ត (Calculation Summary)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-white border border-teal-100 rounded-lg">
                <span className="text-[11px] text-slate-500 block mb-0.5">តម្លៃសរុប</span>
                <span className="text-base font-bold text-slate-900 tabular-nums">
                  {formatUSD(totalCost)}
                </span>
              </div>
              <div className="p-3 bg-white border border-teal-100 rounded-lg">
                <span className="text-[11px] text-slate-500 block mb-0.5">ប្រាក់កក់</span>
                <span className="text-base font-bold text-teal-700 tabular-nums">
                  {formatUSD(deposit)}
                </span>
              </div>
              <div className="p-3 bg-white border border-teal-100 rounded-lg">
                <span className="text-[11px] text-slate-500 block mb-0.5">សមតុល្យនៅខ្វះ</span>
                <span className="text-base font-bold text-amber-700 tabular-nums">
                  {formatUSD(calculation.remainingBalance)}
                </span>
              </div>
              <div className="p-3 bg-teal-600 text-white rounded-lg shadow-xs">
                <span className="text-[11px] text-teal-100 block mb-0.5 font-medium">ត្រូវបង់ប្រចាំខែ</span>
                <span className="text-lg font-extrabold tabular-nums">
                  {formatUSD(calculation.monthlyPayment)}
                </span>
                <span className="text-[10px] text-teal-100 block">/ ខែ ({months} ដង)</span>
              </div>
            </div>
          </div>

          {/* Schedule Breakdown Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-800">
                តារាងកាលវិភាគបង់ប្រាក់រំលោះ ({months} ដំណាក់កាល)
              </h4>
              <span className="text-xs text-slate-500 tabular-nums">
                បង់រៀងរាល់ថ្ងៃទី {new Date(startDate).getDate()} នៃខែ
              </span>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">ដំណាក់កាល</th>
                    <th className="py-2.5 px-3">កាលបរិច្ឆេទត្រូវបង់ (Due Date)</th>
                    <th className="py-2.5 px-3 text-right">ទឹកប្រាក់ដុល្លារ ($)</th>
                    <th className="py-2.5 px-3 text-right">ទឹកប្រាក់រៀល (៛)</th>
                    <th className="py-2.5 px-3 text-center">ស្ថានភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {calculation.stages.map((stage) => (
                    <tr key={stage.stageNumber} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        លើកទី {stage.stageNumber}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {formatKhmerDate(stage.dueDate)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 tabular-nums">
                        {formatUSD(stage.amount)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500 tabular-nums">
                        {formatKHR(stage.amount)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="text-[11px] text-slate-500">
                          រង់ចាំទូទាត់
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          
          {/* Share & Copy Buttons (Requirement 13) */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleShareTelegram}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors cursor-pointer shadow-xs"
              title="ផ្ញើតារាងបង់រំលោះទៅ Telegram អ្នកជំងឺ"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ផ្ញើទៅ Telegram</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="ចម្លងអត្ថបទសម្រាប់ផ្ញើសារ"
            >
              {copySuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">បានចម្លង!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>ចម្លងអត្ថបទ</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center justify-center p-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="បោះពុម្ពតារាងបង់"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
            >
              បិទ
            </button>
            <button
              type="button"
              onClick={handleSavePlan}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs cursor-pointer"
            >
              បង្កើតគម្រោងរំលោះផ្លូវការ
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
