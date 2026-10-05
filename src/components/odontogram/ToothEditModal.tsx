import React, { useState } from 'react';
import { ToothCondition, ToothState } from '../../types';
import { X, Check } from 'lucide-react';
import { UNIVERSAL_TO_FDI } from './OdontogramChart';

interface ToothEditModalProps {
  toothNumber: number;
  initialState?: ToothState;
  onSave: (toothNumber: number, condition: ToothCondition, notes: string) => void;
  onClose: () => void;
}

const CONDITIONS: { value: ToothCondition; labelKhmer: string; desc: string; color: string }[] = [
  { value: 'healthy', labelKhmer: 'ធ្មេញធម្មតា (Healthy)', desc: 'គ្មានបញ្ហា ធ្មេញល្អ', color: 'border-slate-300 bg-white' },
  { value: 'caries', labelKhmer: 'ពុកធ្មេញ / ដង្កូវស៊ី (Caries)', desc: 'មានប្រហោង ឬរលួយស្រទាប់កាចា', color: 'border-rose-300 bg-rose-50 text-rose-800' },
  { value: 'filled', labelKhmer: 'ប៉ះធ្មេញរួច (Filled)', desc: 'បានប៉ះជ័រ Composite ឬ Amalgam', color: 'border-blue-300 bg-blue-50 text-blue-800' },
  { value: 'rct', labelKhmer: 'ព្យាបាលឫសធ្មេញ (RCT)', desc: 'បានព្យាបាល ឬកំពុងព្យាបាលប្រឡាយឫស', color: 'border-purple-300 bg-purple-50 text-purple-800' },
  { value: 'crown', labelKhmer: 'ស្រោបធ្មេញ (Crown)', desc: 'ស្រោប Porcelain, Zirconia, Gold', color: 'border-amber-300 bg-amber-50 text-amber-800' },
  { value: 'ortho', labelKhmer: 'ពត់ធ្មេញ (Ortho Bracket)', desc: 'កំពុងដាក់ Bracket ឬសម្ភារៈពត់', color: 'border-teal-300 bg-teal-50 text-teal-800' },
  { value: 'missing', labelKhmer: 'បាក់ / បាត់ធ្មេញ (Missing)', desc: 'បាត់ធ្មេញពីកំណើត ឬបាក់បាត់', color: 'border-slate-300 bg-slate-100 text-slate-600' },
  { value: 'implant', labelKhmer: 'ដាំបង្គោលធ្មេញ (Implant)', desc: 'បានដាំបង្គោលទីតានីញ៉ូម Implant', color: 'border-indigo-300 bg-indigo-50 text-indigo-800' },
  { value: 'extracted', labelKhmer: 'ដកចេញរួច (Extracted)', desc: 'បានធ្វើការដកចេញដោយទន្តបណ្ឌិត', color: 'border-red-300 bg-red-50 text-red-800' },
];

export const ToothEditModal: React.FC<ToothEditModalProps> = ({
  toothNumber,
  initialState,
  onSave,
  onClose,
}) => {
  const [condition, setCondition] = useState<ToothCondition>(initialState?.condition || 'healthy');
  const [notes, setNotes] = useState(initialState?.notes || '');

  const fdiNumber = UNIVERSAL_TO_FDI[toothNumber];

  const handleSave = () => {
    onSave(toothNumber, condition, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">
              កំណត់ស្ថានភាពធ្មេញ #{toothNumber} (FDI #{fdiNumber})
            </h3>
            <p className="text-xs text-slate-500">ជ្រើសរើសរោគវិនិច្ឆ័យ ឬស្ថានភាពព្យាបាល</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              ស្ថានភាពធ្មេញ (Tooth Condition)៖
            </label>
            <div className="space-y-1.5">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond.value}
                  type="button"
                  onClick={() => setCondition(cond.value)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    condition === cond.value
                      ? 'border-teal-600 bg-teal-50/70 ring-1 ring-teal-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="text-xs font-medium text-slate-900 block">
                      {cond.labelKhmer}
                    </span>
                    <span className="text-[11px] text-slate-500">{cond.desc}</span>
                  </div>
                  {condition === cond.value && <Check className="w-4 h-4 text-teal-600" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="tooth-notes" className="block text-xs font-semibold text-slate-700 mb-1.5">
              កំណត់ចំណាំបន្ថែម (Notes)៖
            </label>
            <textarea
              id="tooth-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ឧទាហរណ៍៖ ប៉ះផ្ទៃ MO, ឫសធ្មេញរលាកខ្លាំង, ត្រូវការស្រោប Crown..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 min-h-[70px]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            បោះបង់
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
          >
            រក្សាទុកការផ្លាស់ប្តូរ
          </button>
        </div>
      </div>
    </div>
  );
};
