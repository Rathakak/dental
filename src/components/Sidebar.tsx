import React from 'react';
import { useDental } from '../context/DentalContext';
import { ActiveTab, UserRole } from '../types';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileSpreadsheet,
  CreditCard,
  AlertTriangle,
  FileText,
  Layers,
  DollarSign,
  PieChart,
  Calculator,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenCalculator: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenCalculator,
  isOpenMobile,
  onCloseMobile,
}) => {
  const {
    role,
    patients,
    todayAppointmentsCount,
    lowStockCount,
    getPatientDebts,
  } = useDental();

  const debtorsCount = getPatientDebts().length;

  interface NavItem {
    id: ActiveTab;
    labelKhmer: string;
    labelEnglish: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
    roles?: UserRole[];
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      labelKhmer: 'ផ្ទាំងគ្រប់គ្រង',
      labelEnglish: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'patients',
      labelKhmer: 'អ្នកជំងឺ & ធ្មេញ',
      labelEnglish: 'Patients & Odontogram',
      icon: Users,
      badge: patients.length,
    },
    {
      id: 'appointments',
      labelKhmer: 'ការណាត់ជួប',
      labelEnglish: 'Appointments',
      icon: Calendar,
      badge: todayAppointmentsCount > 0 ? todayAppointmentsCount : undefined,
      badgeColor: 'bg-teal-100 text-teal-800',
    },
    {
      id: 'invoices',
      labelKhmer: 'វិក្កយបត្រ & បង់ប្រាក់',
      labelEnglish: 'Invoices & Billing',
      icon: FileSpreadsheet,
    },
    {
      id: 'installments',
      labelKhmer: 'បង់ប្រាក់រំលោះ',
      labelEnglish: 'Installment Plans',
      icon: CreditCard,
    },
    {
      id: 'debts',
      labelKhmer: 'របាយការណ៍ជំពាក់',
      labelEnglish: 'Debt & Receivables',
      icon: AlertTriangle,
      badge: debtorsCount > 0 ? debtorsCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold',
    },
    {
      id: 'prescriptions',
      labelKhmer: 'ការចេញវេជ្ជបញ្ជា',
      labelEnglish: 'Prescriptions (Rx)',
      icon: FileText,
    },
    {
      id: 'stock',
      labelKhmer: 'ស្តុកសម្ភារៈពេទ្យ',
      labelEnglish: 'Dental Inventory',
      icon: Layers,
      badge: lowStockCount > 0 ? `! ${lowStockCount}` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 font-bold',
      roles: ['admin', 'accountant'],
    },
    {
      id: 'finance',
      labelKhmer: 'ចំណូល-ចំណាយ',
      labelEnglish: 'Income & Expenses',
      icon: DollarSign,
      roles: ['admin', 'accountant'],
    },
    {
      id: 'dividends',
      labelKhmer: 'ភាគលាភ & ដៃគូ',
      labelEnglish: 'Profit & Dividends',
      icon: PieChart,
      roles: ['admin', 'accountant'],
    },
  ];

  // Filter items based on current role (Requirement 14)
  const accessibleItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(role);
  });

  const handleItemClick = (id: ActiveTab) => {
    onTabChange(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`no-print fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          
          {/* Mobile Drawer Header */}
          <div className="p-4 border-b border-slate-100 lg:hidden flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🦷</span>
              <span className="font-bold text-slate-900 text-sm">DentCare Pro</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              ✕
            </button>
          </div>

          {/* Quick Calculator Action Box */}
          <div className="p-3 m-3 bg-teal-50/70 border border-teal-200/80 rounded-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <Calculator className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-teal-900">
                គណនាបង់រំលោះស្វ័យប្រវត្ត
              </span>
            </div>
            <p className="text-[11px] text-teal-700/90 mb-2 leading-relaxed">
              បញ្ចូលលុយកក់ និងចំនួនខែ ប្រព័ន្ធនឹងគណនាភ្លាមៗ!
            </p>
            <button
              type="button"
              onClick={() => {
                onOpenCalculator();
                onCloseMobile();
              }}
              className="w-full py-1.5 px-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center block"
            >
              បើកផ្ទាំងគណនា ➔
            </button>
          </div>

          {/* Nav List */}
          <nav className="flex-1 px-3 space-y-1">
            {accessibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <div className="text-left truncate">
                      <span className="block truncate">{item.labelKhmer}</span>
                      <span
                        className={`text-[10px] block truncate ${
                          isActive ? 'text-teal-100' : 'text-slate-400'
                        }`}
                      >
                        {item.labelEnglish}
                      </span>
                    </div>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-full shrink-0 tabular-nums ${
                        isActive
                          ? 'bg-white text-teal-800 font-bold'
                          : item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Current Role Footer Indicator */}
          <div className="p-3 m-3 border-t border-slate-100 bg-slate-50/80 rounded-xl">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-[11px] text-slate-500">តួនាទីបច្ចុប្បន្ន៖</span>
              </div>
              <span className="font-semibold text-slate-800 text-[11px] uppercase">
                {role === 'admin'
                  ? 'រដ្ឋបាល'
                  : role === 'accountant'
                  ? 'គណនេយ្យ'
                  : role === 'cashier'
                  ? 'អ្នកលក់'
                  : 'ទន្តបណ្ឌិត'}
              </span>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};
