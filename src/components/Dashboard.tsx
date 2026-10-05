import React from 'react';
import { useDental } from '../context/DentalContext';
import {
  Users,
  Calendar,
  AlertTriangle,
  CreditCard,
  Layers,
  ArrowUpRight,
  Calculator,
  UserPlus,
  FileSpreadsheet,
  Clock,
  Send,
  PieChart,
} from 'lucide-react';
import {
  formatUSD,
  formatKHR,
  formatKhmerDate,
  generateDebtReminderTelegram,
} from '../utils/khmerHelpers';
import { ActiveTab, Patient, Invoice } from '../types';

interface DashboardProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenCalculator: () => void;
  onOpenRegister: () => void;
  onOpenNewInvoice: () => void;
  onSelectPatient: (patient: Patient) => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenCalculator,
  onOpenRegister,
  onOpenNewInvoice,
  onSelectPatient,
  onViewInvoice,
}) => {
  const {
    patients,
    appointments,
    invoices,
    installmentPlans,
    totalDebtSum,
    lowStockCount,
    todayAppointmentsCount,
    totalRevenueSum,
    getPatientDebts,
    role,
  } = useDental();

  const debtors = getPatientDebts();
  const todayAppointments = appointments.filter((a) => a.date === '2026-10-05');

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-teal-700 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-semibold text-teal-200 uppercase tracking-wider block mb-1">
            សូមស្វាគមន៍មកកាន់ DentCare Pro
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2">
            ប្រព័ន្ធគ្រប់គ្រងគ្លីនិកទន្តសាស្ត្រឆ្លាតវៃ
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed mb-5">
            គ្រប់គ្រងការចុះឈ្មោះអ្នកជំងឺ តារាងធ្មេញ Odontogram ការណាត់ជួប បង់ប្រាក់រំលោះ របាយការណ៍ជំពាក់ ចេញវេជ្ជបញ្ជា និងភាគលាភ
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={onOpenCalculator}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-950 bg-teal-300 rounded-lg hover:bg-teal-200 transition-colors shadow-xs cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>គណនាបង់រំលោះស្វ័យប្រវត្ត (Calculator)</span>
            </button>

            <button
              type="button"
              onClick={onOpenRegister}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 rounded-lg border border-white/20 transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>ចុះឈ្មោះអ្នកជំងឺ</span>
            </button>

            <button
              type="button"
              onClick={onOpenNewInvoice}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 rounded-lg border border-white/20 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>ចេញវិក្កយបត្រ</span>
            </button>
          </div>
        </div>

        {/* Decorative background tooth graphic */}
        <div className="absolute -right-8 -bottom-10 text-white/5 text-[180px] select-none pointer-events-none font-serif">
          🦷
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div
          onClick={() => onNavigate('finance')}
          className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs hover:border-teal-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">ចំណូលសរុប</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
            {formatUSD(totalRevenueSum)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-0.5 tabular-nums">
            ≈ {formatKHR(totalRevenueSum)}
          </span>
        </div>

        {/* Outstanding Debts (Requirement 5) */}
        <div
          onClick={() => onNavigate('debts')}
          className="bg-white border border-rose-200 rounded-xl p-4 sm:p-5 shadow-xs hover:border-rose-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-rose-700">ប្រាក់ជំពាក់សរុប (Debt)</span>
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-600 tabular-nums">
            {formatUSD(totalDebtSum)}
          </div>
          <span className="text-[11px] text-rose-500 font-semibold block mt-0.5">
            {debtors.length} នាក់នៅជំពាក់ ➔ មើលរបាយការណ៍
          </span>
        </div>

        {/* Today's Appointments */}
        <div
          onClick={() => onNavigate('appointments')}
          className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs hover:border-teal-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">ណាត់ជួបថ្ងៃនេះ</span>
            <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
            {todayAppointmentsCount} នាក់
          </div>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            ថ្ងៃទី ០៥ ខែតុលា ២០២៦
          </span>
        </div>

        {/* Active Installments */}
        <div
          onClick={() => onNavigate('installments')}
          className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs hover:border-teal-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">គម្រោងបង់រំលោះ</span>
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
            {installmentPlans.length} គម្រោង
          </div>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            កំពុងដំណើរការតាមដំណាក់កាល
          </span>
        </div>

      </div>

      {/* Two Column Layout: Urgent Debtors & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Urgent Debtors Reminder Box (Requirement 5) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  បញ្ជីអ្នកជំងឺជំពាក់ប្រាក់ដែលត្រូវរំលឹក (Debt Reminders)
                </h3>
                <p className="text-xs text-slate-500">បង្ហាញតែអ្នកជំងឺមានសមតុល្យនៅខ្វះ</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('debts')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors cursor-pointer"
            >
              មើលទាំងអស់ ➔
            </button>
          </div>

          <div className="space-y-3">
            {debtors.slice(0, 4).map((debtor) => (
              <div
                key={debtor.patient.id}
                className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {debtor.patient.nameKhmer}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {debtor.patient.phone}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    ព្យាបាលសរុប៖ {formatUSD(debtor.totalBilled)} · បានបង់៖ {formatUSD(debtor.totalPaid)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="font-extrabold text-rose-600 text-sm tabular-nums block">
                      {formatUSD(debtor.debtAmount)}
                    </span>
                    <span className="text-[10px] text-slate-400 block tabular-nums">
                      {formatKHR(debtor.debtAmount)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const { shareUrl } = generateDebtReminderTelegram({
                        nameKhmer: debtor.patient.nameKhmer,
                        phone: debtor.patient.phone,
                        totalDebt: debtor.debtAmount,
                        nextDueDate: debtor.nextDueDate,
                      });
                      window.open(shareUrl, '_blank');
                    }}
                    className="p-1.5 text-white bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors cursor-pointer shadow-2xs"
                    title="ផ្ញើសាររំលឹកបង់ប្រាក់តាម Telegram"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Today's Appointments Schedule */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-teal-100 text-teal-800 rounded-lg">
                <Calendar className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  កាលវិភាគណាត់ជួបថ្ងៃនេះ (Today's Schedule)
                </h3>
                <p className="text-xs text-slate-500">{todayAppointments.length} ការណាត់ជួបត្រូវព្យាបាល</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('appointments')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors cursor-pointer"
            >
              មើលកាលវិភាគ ➔
            </button>
          </div>

          <div className="space-y-2.5">
            {todayAppointments.map((appt) => (
              <div
                key={appt.id}
                className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="text-center font-mono font-bold text-teal-800 bg-white border border-slate-200 px-2 py-1 rounded">
                    {appt.time}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{appt.patientName}</h4>
                    <span className="text-[11px] text-slate-500">
                      {appt.procedure} · {appt.chair}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-semibold text-teal-700 block">
                    {appt.doctorName}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      appt.status === 'in_progress'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {appt.status === 'in_progress' ? 'កំពុងព្យាបាល' : 'កំពុងរង់ចាំ'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Invoices & Quick Telegram Share Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              វិក្កយបត្រថ្មីៗ (Recent Invoices & Telegram Sharing)
            </h3>
            <p className="text-xs text-slate-500">
              ចុចប៊ូតុង Telegram ដើម្បីផ្ញើបង្កាន់ដៃបង់ប្រាក់ភ្លាមៗ
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('invoices')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
          >
            មើលប្រវត្តិវិក្កយបត្រ ➔
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">លេខវិក្កយបត្រ</th>
                <th className="py-2.5 px-3">កាលបរិច្ឆេទ</th>
                <th className="py-2.5 px-3">អ្នកជំងឺ</th>
                <th className="py-2.5 px-3 text-right">តម្លៃសរុប</th>
                <th className="py-2.5 px-3 text-right">បានបង់</th>
                <th className="py-2.5 px-3 text-right">នៅខ្វះ</th>
                <th className="py-2.5 px-3 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.slice(0, 5).map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-teal-800">#{inv.id}</td>
                  <td className="py-2.5 px-3 text-slate-600">{formatKhmerDate(inv.date)}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{inv.patientName}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">{formatUSD(inv.total)}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-700">{formatUSD(inv.paid)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">
                    <span className={inv.balance > 0 ? 'text-rose-600' : 'text-slate-400'}>
                      {formatUSD(inv.balance)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onViewInvoice(inv)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded cursor-pointer"
                    >
                      មើល / Share
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
