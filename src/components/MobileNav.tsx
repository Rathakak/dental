import React from 'react';
import { ActiveTab } from '../types';
import {
  LayoutDashboard,
  Users,
  Calendar,
  AlertTriangle,
  Menu,
} from 'lucide-react';
import { useDental } from '../context/DentalContext';

interface MobileNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onToggleSidebar: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
  onToggleSidebar,
}) => {
  const { getPatientDebts } = useDental();
  const debtorsCount = getPatientDebts().length;

  return (
    <nav className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        <button
          type="button"
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[60px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'dashboard' ? 'text-teal-700 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">ផ្ទាំងដើម</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('patients')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[60px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'patients' ? 'text-teal-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">អ្នកជំងឺ</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('appointments')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[60px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'appointments' ? 'text-teal-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">ណាត់ជួប</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('debts')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[60px] min-h-[44px] rounded-lg transition-colors relative cursor-pointer ${
            activeTab === 'debts' ? 'text-rose-600 font-bold' : 'text-slate-500'
          }`}
        >
          <AlertTriangle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">ជំពាក់</span>
          {debtorsCount > 0 && (
            <span className="absolute top-1 right-3 w-4 h-4 bg-rose-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
              {debtorsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex flex-col items-center justify-center py-1.5 px-3 min-w-[60px] min-h-[44px] rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">ម៉ឺនុយ</span>
        </button>
      </div>
    </nav>
  );
};
