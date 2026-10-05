import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { StockItem } from '../../types';
import {
  Layers,
  AlertTriangle,
  Plus,
  Minus,
  Search,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { formatUSD, formatKhmerDate } from '../../utils/khmerHelpers';

export const StockManager: React.FC = () => {
  const { stockItems, addStockItem, adjustStockQuantity, deleteStockItem, lowStockCount } = useDental();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form
  const [newItem, setNewItem] = useState<Omit<StockItem, 'id'>>({
    code: '',
    nameKhmer: '',
    nameEnglish: '',
    category: 'dental_materials',
    quantity: 10,
    unit: 'ប្រអប់ (Box)',
    minAlertQty: 5,
    unitCost: 25,
    supplier: 'Cambodia Dental Supply',
    lastRestocked: new Date().toISOString().split('T')[0],
  });

  const categories = [
    { id: 'all', label: 'ទាំងអស់' },
    { id: 'dental_materials', label: 'សម្ភារៈប៉ះ/ស្រោប (Materials)' },
    { id: 'anesthetics', label: 'ថ្នាំស្ពឹក (Anesthetics)' },
    { id: 'ortho_supplies', label: 'សម្ភារៈពត់ធ្មេញ (Ortho)' },
    { id: 'instruments', label: 'ឧបករណ៍ទន្តសាស្ត្រ (Instruments)' },
    { id: 'consumables', label: 'សម្ភារៈប្រើប្រាស់ (Consumables)' },
  ];

  const filteredItems = stockItems.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch =
      item.nameKhmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalStockValue = stockItems.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);

  const handleSaveNewItem = () => {
    if (!newItem.nameKhmer || !newItem.code) {
      alert('សូមបញ្ចូលលេខកូដ និងឈ្មោះសម្ភារៈ!');
      return;
    }
    addStockItem(newItem);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-100 text-teal-800 rounded-lg">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                គ្រប់គ្រងស្តុកសម្ភារៈទន្តសាស្ត្រ (Dental Clinic Inventory)
              </h1>
              <p className="text-xs text-slate-500">
                តាមដានបរិមាណសម្ភារៈពេទ្យ ថ្នាំស្ពឹក ជ័រ និងការជូនដំណឹងពេលជិតអស់ពីស្តុក
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right pr-3 border-r border-slate-200">
            <span className="text-[11px] text-slate-500 block">តម្លៃស្តុកសរុប</span>
            <span className="text-base font-bold text-slate-900 tabular-nums">
              {formatUSD(totalStockValue)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>បន្ថែមសម្ភារៈថ្មី</span>
          </button>
        </div>
      </div>

      {/* Low Stock Alert Banner (Requirement 7) */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h2 className="text-xs font-bold">
                ការដាស់តឿនស្តុក៖ មានសម្ភារៈចំនួន {lowStockCount} មុខ ជិតអស់ពីស្តុក!
              </h2>
              <p className="text-[11px] text-amber-700">
                សូមពិនិត្យ និងបញ្ជាទិញបន្ថែមពីអ្នកផ្គត់ផ្គង់ដើម្បីកុំឱ្យខកខានដល់ការព្យាបាលអ្នកជំងឺ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className="text-xs font-semibold px-3 py-1 bg-amber-200/80 hover:bg-amber-300 rounded-lg text-amber-900 transition-colors cursor-pointer"
          >
            ពិនិត្យមើល
          </button>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === c.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ស្វែងរកតាមឈ្មោះ ឬកូដសម្ភារៈ..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">កូដសម្ភារៈ</th>
                <th className="py-3 px-4">ឈ្មោះសម្ភារៈ</th>
                <th className="py-3 px-3 text-center">បរិមាណស្តុក</th>
                <th className="py-3 px-3">ឯកតា</th>
                <th className="py-3 px-3 text-right">តម្លៃដើម / ឯកតា</th>
                <th className="py-3 px-3 text-right">តម្លៃសរុប</th>
                <th className="py-3 px-3">អ្នកផ្គត់ផ្គង់</th>
                <th className="py-3 px-4 text-center">កែសម្រួលស្តុក</th>
                <th className="py-3 px-2 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isLow = item.quantity <= item.minAlertQty;
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isLow ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                      {item.code}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.nameKhmer}</div>
                      <span className="text-[11px] text-slate-400">{item.nameEnglish}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className={`font-bold tabular-nums text-sm ${
                            isLow ? 'text-amber-700' : 'text-slate-900'
                          }`}
                        >
                          {item.quantity}
                        </span>
                        {isLow && (
                          <span
                            className="p-0.5 bg-amber-100 text-amber-700 rounded-sm"
                            title={`ជិតអស់ពីស្តុក! កម្រិតប្រកាសអាសន្នគឺ ${item.minAlertQty}`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{item.unit}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                      {formatUSD(item.unitCost)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                      {formatUSD(item.quantity * item.unitCost)}
                    </td>
                    <td className="py-3 px-3 text-slate-500 truncate max-w-[140px]">
                      {item.supplier}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => adjustStockQuantity(item.id, -1, 'ប្រើប្រាស់ក្នុងការព្យាបាល')}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="ដកចេញ ១ (ប្រើប្រាស់)"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustStockQuantity(item.id, 1, 'ទិញបន្ថែម')}
                          className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="បន្ថែម ១ (ទិញចូល)"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const add = prompt('បញ្ចូលចំនួនដែលបានទិញចូលបន្ថែម៖', '10');
                            if (add && !isNaN(Number(add))) {
                              adjustStockQuantity(item.id, Number(add));
                            }
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-md hover:bg-teal-100 transition-colors ml-1 cursor-pointer"
                        >
                          + បញ្ចូលស្តុក
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`តើអ្នកចង់លុបសម្ភារៈ "${item.nameKhmer}" មែនទេ?`)) {
                            deleteStockItem(item.id);
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

      {/* Add New Stock Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-6 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              បន្ថែមសម្ភារៈទន្តសាស្ត្រថ្មី (Add Stock Item)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              បញ្ចូលព័ត៌មានសម្ភារៈ ឬឱសថដើម្បីតាមដានក្នុងប្រព័ន្ធ
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="stk-code" className="block text-xs font-semibold text-slate-700 mb-1">
                    កូដសម្ភារៈ (Code) *
                  </label>
                  <input
                    id="stk-code"
                    type="text"
                    value={newItem.code}
                    onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                    placeholder="ឧ. MAT-BOND-01"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="stk-category" className="block text-xs font-semibold text-slate-700 mb-1">
                    ប្រភេទសម្ភារៈ
                  </label>
                  <select
                    id="stk-category"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="dental_materials">សម្ភារៈប៉ះ/ស្រោប</option>
                    <option value="anesthetics">ថ្នាំស្ពឹក</option>
                    <option value="ortho_supplies">សម្ភារៈពត់ធ្មេញ</option>
                    <option value="instruments">ឧបករណ៍ទន្តសាស្ត្រ</option>
                    <option value="consumables">សម្ភារៈប្រើប្រាស់</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="stk-name-khmer" className="block text-xs font-semibold text-slate-700 mb-1">
                  ឈ្មោះសម្ភារៈ (ភាសាខ្មែរ) *
                </label>
                <input
                  id="stk-name-khmer"
                  type="text"
                  value={newItem.nameKhmer}
                  onChange={(e) => setNewItem({ ...newItem, nameKhmer: e.target.value })}
                  placeholder="ឧ. ជ័រ Composite 3M A2"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="stk-name-english" className="block text-xs font-semibold text-slate-700 mb-1">
                  ឈ្មោះអង់គ្លេស (English Name)
                </label>
                <input
                  id="stk-name-english"
                  type="text"
                  value={newItem.nameEnglish}
                  onChange={(e) => setNewItem({ ...newItem, nameEnglish: e.target.value })}
                  placeholder="e.g. Composite Resin 3M Filtek"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="stk-quantity" className="block text-xs font-semibold text-slate-700 mb-1">
                    បរិមាណស្តុក
                  </label>
                  <input
                    id="stk-quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="stk-unit" className="block text-xs font-semibold text-slate-700 mb-1">
                    ឯកតា
                  </label>
                  <input
                    id="stk-unit"
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    placeholder="ប្រអប់, ដប, ឈុត"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="stk-min-alert" className="block text-xs font-semibold text-slate-700 mb-1">
                    កម្រិតរោទិ៍ជិតអស់
                  </label>
                  <input
                    id="stk-min-alert"
                    type="number"
                    value={newItem.minAlertQty}
                    onChange={(e) => setNewItem({ ...newItem, minAlertQty: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold text-amber-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="stk-unit-cost" className="block text-xs font-semibold text-slate-700 mb-1">
                    តម្លៃដើម ($)
                  </label>
                  <input
                    id="stk-unit-cost"
                    type="number"
                    value={newItem.unitCost}
                    onChange={(e) => setNewItem({ ...newItem, unitCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="stk-supplier" className="block text-xs font-semibold text-slate-700 mb-1">
                    អ្នកផ្គត់ផ្គង់ (Supplier)
                  </label>
                  <input
                    id="stk-supplier"
                    type="text"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
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
                onClick={handleSaveNewItem}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-xs"
              >
                រក្សាទុកសម្ភារៈ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
