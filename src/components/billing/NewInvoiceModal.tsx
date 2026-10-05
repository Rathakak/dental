import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { InvoiceItem } from '../../types';
import { COMMON_DENTAL_PROCEDURES } from '../../data/initialData';
import { X, Plus, Trash2, DollarSign } from 'lucide-react';
import { formatUSD, formatKHR } from '../../utils/khmerHelpers';

interface NewInvoiceModalProps {
  onClose: () => void;
  onSuccessCreated: (invoice: any) => void;
  preselectedPatientId?: string;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  onClose,
  onSuccessCreated,
  preselectedPatientId,
}) => {
  const { patients, addInvoice } = useDental();

  const [patientId, setPatientId] = useState(preselectedPatientId || patients[0]?.id || '');
  const [doctorName, setDoctorName] = useState('ទន្តបណ្ឌិត សាន វិបុល');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'khqr' | 'cash' | 'bank' | 'card'>('khqr');
  const [discount, setDiscount] = useState<number>(0);
  const [paid, setPaid] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'item-1',
      description: 'ពិនិត្យ និងប្រឹក្សាបញ្ហាធ្មេញ (Consultation)',
      qty: 1,
      unitPrice: 10,
      total: 10,
    },
  ]);

  const selectedPatient = patients.find((p) => p.id === patientId);

  const handleAddProcedure = (proc: typeof COMMON_DENTAL_PROCEDURES[0]) => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${items.length + 1}`,
      description: proc.name,
      qty: 1,
      unitPrice: proc.price,
      total: proc.price,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, val: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: val };
        if (field === 'qty' || field === 'unitPrice') {
          updated.total = updated.qty * updated.unitPrice;
        }
        return updated;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const total = Math.max(0, subtotal - discount);
  const balance = Math.max(0, total - paid);

  const handleSaveInvoice = () => {
    if (!selectedPatient) {
      alert('សូមជ្រើសរើសអ្នកជំងឺ!');
      return;
    }
    if (items.length === 0) {
      alert('សូមបញ្ចូលសេវាកម្មព្យាបាលយ៉ាងហោចមួយមុខ!');
      return;
    }

    const created = addInvoice({
      patientId: selectedPatient.id,
      patientName: selectedPatient.nameKhmer,
      patientPhone: selectedPatient.phone,
      date,
      items,
      subtotal,
      discount,
      total,
      paid,
      balance,
      status: balance === 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid',
      paymentMethod,
      doctorName,
      notes,
    });

    onSuccessCreated(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="font-bold text-slate-900 text-base">
              បង្កើតវិក្កយបត្រថ្មី (Create Dental Invoice)
            </h2>
            <p className="text-xs text-slate-500">គិតប្រាក់សេវាព្យាបាល បញ្ចុះតម្លៃ និងទទួលការបង់ប្រាក់</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="new-inv-patient" className="block text-xs font-semibold text-slate-700 mb-1">
                អ្នកជំងឺ *
              </label>
              <select
                id="new-inv-patient"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nameKhmer} ({p.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="new-inv-doctor" className="block text-xs font-semibold text-slate-700 mb-1">
                ទន្តបណ្ឌិតព្យាបាល
              </label>
              <select
                id="new-inv-doctor"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="ទន្តបណ្ឌិត សាន វិបុល">ទន្តបណ្ឌិត សាន វិបុល</option>
                <option value="ទន្តបណ្ឌិត លឹម ស្រីមុំ">ទន្តបណ្ឌិត លឹម ស្រីមុំ</option>
                <option value="ទន្តបណ្ឌិត តាំង ចាន់ដារ៉ា">ទន្តបណ្ឌិត តាំង ចាន់ដារ៉ា</option>
              </select>
            </div>
          </div>

          {/* Quick Procedure Selector */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              ជ្រើសរើសសេវាកម្មទន្តសាស្ត្ររហ័ស (Quick Procedures)៖
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 border border-slate-200 rounded-lg bg-slate-50/50">
              {COMMON_DENTAL_PROCEDURES.map((proc) => (
                <button
                  key={proc.name}
                  type="button"
                  onClick={() => handleAddProcedure(proc)}
                  className="px-2.5 py-1 text-xs bg-white hover:bg-teal-50 hover:text-teal-800 border border-slate-200 rounded-md transition-colors cursor-pointer text-slate-700"
                >
                  + {proc.name} (${proc.price})
                </button>
              ))}
            </div>
          </div>

          {/* Invoice Items Table */}
          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-2">
              តារាងសេវាកម្មត្រូវគិតប្រាក់ ({items.length} មុខ)៖
            </span>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                    className="flex-1 px-2 py-1 border border-slate-300 rounded bg-white"
                    placeholder="ឈ្មោះសេវាកម្ម"
                  />
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => handleUpdateItem(item.id, 'qty', Number(e.target.value))}
                    className="w-14 px-2 py-1 border border-slate-300 rounded bg-white text-center tabular-nums"
                    placeholder="ចំនួន"
                  />
                  <input
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                    className="w-20 px-2 py-1 border border-slate-300 rounded bg-white text-right tabular-nums font-medium"
                    placeholder="តម្លៃរាយ"
                  />
                  <span className="w-20 text-right font-bold text-slate-900 tabular-nums">
                    ${item.total.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Calculation Ledger */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">វិធីសាស្ត្រទូទាត់</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="khqr">ABA KHQR / Bakong</option>
                  <option value="cash">សាច់ប្រាក់សុទ្ធ (Cash)</option>
                  <option value="bank">ផ្ទេរធនាគារ</option>
                  <option value="card">កាតធនាគារ</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">កំណត់ចំណាំ</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ចំណាំបន្ថែមលើវិក្កយបត្រ..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>តម្លៃរង (Subtotal)៖</span>
                <span className="font-mono tabular-nums">{formatUSD(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>បញ្ចុះតម្លៃ ($)៖</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-24 px-2 py-0.5 border border-slate-300 rounded text-right tabular-nums text-rose-600"
                />
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                <span>តម្លៃសរុប (Total)៖</span>
                <span className="font-mono tabular-nums">{formatUSD(total)}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-800 font-semibold">
                <span>ប្រាក់បានបង់លើកនេះ ($)៖</span>
                <input
                  type="number"
                  min="0"
                  max={total}
                  value={paid}
                  onChange={(e) => setPaid(Number(e.target.value))}
                  className="w-24 px-2 py-0.5 border border-emerald-300 rounded text-right tabular-nums bg-emerald-50 text-emerald-800 font-bold"
                />
              </div>
              <div className="flex justify-between font-bold text-rose-700 border-t border-slate-200 pt-1">
                <span>នៅខ្វះ / ជំពាក់ (Balance)៖</span>
                <span className="font-mono tabular-nums">{formatUSD(balance)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800"
          >
            បោះបង់
          </button>
          <button
            type="button"
            onClick={handleSaveInvoice}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-xs"
          >
            ចេញវិក្កយបត្រ
          </button>
        </div>

      </div>
    </div>
  );
};
