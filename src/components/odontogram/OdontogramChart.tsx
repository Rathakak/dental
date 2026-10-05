import React, { useState } from 'react';
import { ToothCondition, ToothState } from '../../types';

interface OdontogramProps {
  teeth: Record<number, ToothState>;
  onToothClick?: (toothNumber: number) => void;
  interactive?: boolean;
}

const TOOTH_CONDITIONS: Record<
  ToothCondition,
  { labelKhmer: string; color: string; border: string; bg: string; icon: string }
> = {
  healthy: { labelKhmer: 'ធម្មតា (Healthy)', color: 'text-slate-600', border: 'border-slate-300', bg: 'bg-white', icon: '✓' },
  caries: { labelKhmer: 'ពុកធ្មេញ (Caries)', color: 'text-rose-700', border: 'border-rose-400', bg: 'bg-rose-100', icon: '●' },
  filled: { labelKhmer: 'ប៉ះរួច (Filled)', color: 'text-blue-700', border: 'border-blue-400', bg: 'bg-blue-100', icon: '■' },
  crown: { labelKhmer: 'ស្រោប (Crown)', color: 'text-amber-800', border: 'border-amber-400', bg: 'bg-amber-100', icon: '👑' },
  rct: { labelKhmer: 'ព្យាបាលឫស (RCT)', color: 'text-purple-700', border: 'border-purple-400', bg: 'bg-purple-100', icon: '⚡' },
  ortho: { labelKhmer: 'ពត់ធ្មេញ (Ortho)', color: 'text-teal-700', border: 'border-teal-400', bg: 'bg-teal-100', icon: '⚓' },
  missing: { labelKhmer: 'បាត់ធ្មេញ (Missing)', color: 'text-slate-400', border: 'border-dashed border-slate-400', bg: 'bg-slate-100', icon: '✕' },
  implant: { labelKhmer: 'ដាំបង្គោល (Implant)', color: 'text-indigo-700', border: 'border-indigo-400', bg: 'bg-indigo-100', icon: '🔩' },
  extracted: { labelKhmer: 'ដកចេញ (Extracted)', color: 'text-red-700', border: 'border-red-400', bg: 'bg-red-50', icon: '🚫' },
};

// Universal numbering: 1-16 (Upper) and 32-17 (Lower)
const UPPER_TEETH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const LOWER_TEETH = [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17];

// FDI numbering mapping
export const UNIVERSAL_TO_FDI: Record<number, number> = {
  1: 18, 2: 17, 3: 16, 4: 15, 5: 14, 6: 13, 7: 12, 8: 11,
  9: 21, 10: 22, 11: 23, 12: 24, 13: 25, 14: 26, 15: 27, 16: 28,
  17: 38, 18: 37, 19: 36, 20: 35, 21: 34, 22: 33, 23: 32, 24: 31,
  25: 41, 26: 42, 27: 43, 28: 44, 29: 45, 30: 46, 31: 47, 32: 48,
};

export const OdontogramChart: React.FC<OdontogramProps> = ({
  teeth = {},
  onToothClick,
  interactive = true,
}) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [numberingSystem, setNumberingSystem] = useState<'universal' | 'fdi'>('universal');

  const handleSelectTooth = (num: number) => {
    setSelectedTooth(num);
    if (onToothClick) {
      onToothClick(num);
    }
  };

  const renderTooth = (toothNumber: number, isUpper: boolean) => {
    const toothData = teeth[toothNumber];
    const condition: ToothCondition = toothData?.condition || 'healthy';
    const config = TOOTH_CONDITIONS[condition];
    const isSelected = selectedTooth === toothNumber;
    const displayNumber = numberingSystem === 'universal' ? toothNumber : UNIVERSAL_TO_FDI[toothNumber];

    return (
      <button
        key={toothNumber}
        type="button"
        onClick={() => handleSelectTooth(toothNumber)}
        disabled={!interactive}
        title={`ធ្មេញ #${displayNumber}: ${config.labelKhmer} ${toothData?.notes ? `(${toothData.notes})` : ''}`}
        className={`flex flex-col items-center justify-between p-1 rounded-lg transition-all text-center group cursor-pointer ${
          isSelected
            ? 'ring-2 ring-teal-500 bg-teal-50/50'
            : 'hover:bg-slate-50'
        } ${!interactive ? 'cursor-default' : ''}`}
      >
        {/* Upper number */}
        {isUpper && (
          <span className="text-[11px] font-mono font-medium text-slate-500 tabular-nums">
            {displayNumber}
          </span>
        )}

        {/* Tooth SVG Icon with condition coloring */}
        <div
          className={`w-7 h-9 sm:w-8 sm:h-10 border rounded-sm flex flex-col items-center justify-center relative transition-colors ${config.border} ${config.bg}`}
        >
          {/* Anatomical Crown & Root Representation */}
          <div className="text-[10px] font-bold">{config.icon}</div>
          {toothData?.notes && (
            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
          )}
        </div>

        {/* Lower number */}
        {!isUpper && (
          <span className="text-[11px] font-mono font-medium text-slate-500 tabular-nums">
            {displayNumber}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            តារាងធ្មេញអ្នកជំងឺ (Odontogram / Dental Chart)
          </h3>
          <p className="text-xs text-slate-500">
            ចុចលើធ្មេញនីមួយៗដើម្បីពិនិត្យ ឬកែប្រែស្ថានភាពព្យាបាល
          </p>
        </div>

        {/* Numbering Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setNumberingSystem('universal')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              numberingSystem === 'universal'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Universal (#1 - #32)
          </button>
          <button
            type="button"
            onClick={() => setNumberingSystem('fdi')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              numberingSystem === 'fdi'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            FDI World (#11 - #48)
          </button>
        </div>
      </div>

      {/* Teeth Grid */}
      <div className="space-y-4 overflow-x-auto pb-2">
        {/* Maxillary Arch (Upper) */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1 px-2">
            <span>ថ្គាមលើខាងស្តាំ (Maxilla Right)</span>
            <span className="font-semibold text-slate-700">ថ្គាមលើ (Upper Jaw)</span>
            <span>ថ្គាមលើខាងឆ្វេង (Maxilla Left)</span>
          </div>
          <div className="grid grid-cols-16 gap-1 min-w-[580px] bg-slate-50/70 p-2 rounded-lg border border-slate-100">
            {UPPER_TEETH.map((num) => renderTooth(num, true))}
          </div>
        </div>

        <div className="h-px bg-slate-200 my-2 relative">
          <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-white px-3 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Occlusal Plane
          </span>
        </div>

        {/* Mandibular Arch (Lower) */}
        <div>
          <div className="grid grid-cols-16 gap-1 min-w-[580px] bg-slate-50/70 p-2 rounded-lg border border-slate-100">
            {LOWER_TEETH.map((num) => renderTooth(num, false))}
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mt-1 px-2">
            <span>ថ្គាមក្រោមខាងស្តាំ (Mandible Right)</span>
            <span className="font-semibold text-slate-700">ថ្គាមក្រោម (Lower Jaw)</span>
            <span>ថ្គាមក្រោមខាងឆ្វេង (Mandible Left)</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-5 pt-3 border-t border-slate-100">
        <span className="text-[11px] font-semibold text-slate-500 block mb-2">
          កំណត់សម្គាល់ស្ថានភាពធ្មេញ (Condition Legend)៖
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 text-xs">
          {Object.entries(TOOTH_CONDITIONS).map(([key, item]) => (
            <div key={key} className="flex items-center gap-1.5 text-slate-700">
              <span
                className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center text-[8px] font-bold ${item.border} ${item.bg}`}
              >
                {item.icon}
              </span>
              <span className="truncate text-[11px]">{item.labelKhmer.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
