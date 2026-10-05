import React from 'react';
import { useDental } from '../context/DentalContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Calculator,
  RotateCcw,
  AlertCircle,
  Calendar,
  Layers,
} from 'lucide-react';
import { formatUSD } from '../utils/khmerHelpers';

interface HeaderProps {
  onOpenCalculator: () => void;
  onNavigate: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCalculator, onNavigate }) => {
  const {
    role,
    setRole,
    totalDebtSum,
    todayAppointmentsCount,
    lowStockCount,
    resetToSampleData,
  } = useDental();

  const roleNames: Record<UserRole, { labelKhmer: string; desc: string; color: string }> = {
    admin: { labelKhmer: 'រដ្ឋបាល (Admin)', desc: 'គ្រប់គ្រងទូទៅ & ការកំណត់', color: 'bg-indigo-600 text-white' },
    accountant: { labelKhmer: 'គណនេយ្យ (Accountant)', desc: 'ហិរញ្ញវត្ថុ & ភាគលាភ', color: 'bg-emerald-600 text-white' },
    cashier: { labelKhmer: 'អ្នកលក់/បេឡា (Cashier)', desc: 'ចុះឈ្មោះ & គិតលុយ', color: 'bg-amber-600 text-white' },
    dentist: { labelKhmer: 'ទន្តបណ្ឌិត (Dentist)', desc: 'ព្យាបាល & វេជ្ជបញ្ជា', color: 'bg-teal-600 text-white' },
  };

  return (
    <header className="no-print sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              <span className="text-white">🦷</span>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                DentCare Pro
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
                ប្រព័ន្ធគ្រប់គ្រងគ្លីនិកទន្តសាស្ត្រ
              </span>
            </div>
          </div>

          {/* Zone 2: Quick Status Indicators & Quick Nav */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-slate-600">
            <button
              onClick={() => onNavigate('appointments')}
              className="flex items-center gap-1.5 hover:text-teal-700 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>ណាត់ជួបថ្ងៃនេះ៖</span>
              <span className="font-semibold text-slate-900 tabular-nums">{todayAppointmentsCount} នាក់</span>
            </button>

            <span className="text-slate-300">·</span>

            <button
              onClick={() => onNavigate('debts')}
              className="flex items-center gap-1.5 hover:text-rose-700 transition-colors cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>ប្រាក់ជំពាក់សរុប៖</span>
              <span className="font-bold text-rose-600 tabular-nums">{formatUSD(totalDebtSum)}</span>
            </button>

            {lowStockCount > 0 && (
              <>
                <span className="text-slate-300">·</span>
                <button
                  onClick={() => onNavigate('stock')}
                  className="flex items-center gap-1.5 hover:text-amber-700 transition-colors cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>ស្តុកជិតអស់៖</span>
                  <span className="font-semibold text-amber-700 tabular-nums">{lowStockCount} មុខ</span>
                </button>
              </>
            )}
          </div>

          {/* Zone 3: Primary Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Installment Calculator Trigger */}
            <button
              onClick={onOpenCalculator}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer whitespace-nowrap"
              title="គណនាបង់រំលោះរហ័ស"
            >
              <Calculator className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">គណនារំលោះ</span>
            </button>

            {/* Role Switcher (Requirement 14: រដ្ឋបាល, គណនេយ្យ, អ្នកលក់, ទន្តបណ្ឌិត) */}
            <div className="relative inline-flex items-center">
              <label htmlFor="role-select" className="sr-only">តួនាទី</label>
              <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg p-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500 ml-1 hidden sm:inline-block" />
                <select
                  id="role-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="text-xs font-medium text-slate-800 bg-transparent border-none focus:outline-hidden cursor-pointer pr-1"
                >
                  <option value="admin">រដ្ឋបាល (Admin)</option>
                  <option value="accountant">គណនេយ្យ (Accountant)</option>
                  <option value="cashier">អ្នកលក់/បេឡា (Cashier)</option>
                  <option value="dentist">ទន្តបណ្ឌិត (Dentist)</option>
                </select>
              </div>
            </div>

            {/* Reset to demo seed data */}
            <button
              onClick={() => {
                if (window.confirm('តើអ្នកពិតជាចង់កំណត់ទិន្នន័យគំរូឡើងវិញមែនទេ?')) {
                  resetToSampleData();
                }
              }}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="ផ្ទុកទិន្នន័យគំរូឡើងវិញ"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
