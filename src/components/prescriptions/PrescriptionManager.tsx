import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { Prescription, PrescriptionItem } from '../../types';
import { COMMON_MEDICATIONS } from '../../data/initialData';
import {
  FileText,
  Plus,
  Printer,
  Trash2,
  X,
  Search,
  Pill,
} from 'lucide-react';
import { formatKhmerDate } from '../../utils/khmerHelpers';

export const PrescriptionManager: React.FC = () => {
  const { prescriptions, patients, addPrescription, deletePrescription } = useDental();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingRx, setViewingRx] = useState<Prescription | null>(null);

  // New Rx form state
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [doctorName, setDoctorName] = useState('ទន្តបណ្ឌិត សាន វិបុល');
  const [diagnosis, setDiagnosis] = useState('រលាកប្រឡាយឫសធ្មេញស្រួចស្រាវ (Acute Pulpitis)');
  const [advice, setAdvice] = useState('ចៀសវាងទំពារចំណីរឹងលើធ្មេញព្យាបាល ខ្ពុរមាត់ដោយទឹកអំបិលក្តៅឧណ្ហៗក្រោយអាហារ។');
  const [items, setItems] = useState<PrescriptionItem[]>([
    {
      id: 'item-1',
      medicineName: 'Amoxicillin 500mg',
      dosage: '500 mg',
      instruction: 'លេបម្តង ១ គ្រាប់ ក្រោយបាយ ៣ ដងក្នុងមួយថ្ងៃ (រៀងរាល់ ៨ ម៉ោង)',
      quantity: '15 គ្រាប់',
      durationDays: 5,
    },
    {
      id: 'item-2',
      medicineName: 'Ibuprofen 400mg',
      dosage: '400 mg',
      instruction: 'លេបម្តង ១ គ្រាប់ ក្រោយបាយពេលមានការឈឺចាប់',
      quantity: '10 គ្រាប់',
      durationDays: 3,
    },
  ]);

  const filteredPrescriptions = prescriptions.filter(
    (rx) =>
      rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.patientPhone.includes(searchTerm) ||
      rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedication = (med: typeof COMMON_MEDICATIONS[0]) => {
    const newItem: PrescriptionItem = {
      id: `item-${Date.now()}-${items.length + 1}`,
      medicineName: med.name,
      dosage: med.defaultDosage,
      instruction: med.instruction,
      quantity: '10 គ្រាប់',
      durationDays: 5,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof PrescriptionItem, val: any) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: val } : i))
    );
  };

  const handleSaveRx = () => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) {
      alert('សូមជ្រើសរើសអ្នកជំងឺ!');
      return;
    }
    if (items.length === 0) {
      alert('សូមបញ្ចូលថ្នាំយ៉ាងហោចណាស់មួយមុខ!');
      return;
    }

    const newRx = addPrescription({
      patientId: patient.id,
      patientName: patient.nameKhmer,
      patientPhone: patient.phone,
      doctorName,
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      items,
      advice,
    });

    setShowCreateModal(false);
    setViewingRx(newRx);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-100 text-teal-800 rounded-lg">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                ការចេញវេជ្ជបញ្ជាព្យាបាលធ្មេញ (Dental Prescriptions Rx)
              </h1>
              <p className="text-xs text-slate-500">
                ចេញវេជ្ជបញ្ជាឱសថទន្តសាស្ត្រ សេចក្តីណែនាំប្រើប្រាស់ និងបោះពុម្ពជូនអ្នកជំងឺ
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ចេញវេជ្ជបញ្ជាថ្មី (New Rx)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ស្វែងរកតាមឈ្មោះអ្នកជំងឺ រោគវិនិច្ឆ័យ..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <span className="text-xs text-slate-500">
          វេជ្ជបញ្ជាសរុប៖ <span className="font-semibold text-slate-900">{prescriptions.length}</span>
        </span>
      </div>

      {/* Prescriptions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrescriptions.map((rx) => (
          <div
            key={rx.id}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-300 transition-all shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[11px] font-mono font-semibold text-teal-700">
                    #{rx.id}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {rx.patientName}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ទូរស័ព្ទ៖ {rx.patientPhone}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {formatKhmerDate(rx.date)}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 mb-3 text-xs">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  រោគវិនិច្ឆ័យ (Diagnosis)
                </span>
                <span className="text-slate-800 font-medium line-clamp-1">
                  {rx.diagnosis}
                </span>
              </div>

              <div className="space-y-1 mb-4">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  ឱសថ ({rx.items.length} មុខ)៖
                </span>
                <div className="space-y-1">
                  {rx.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="text-xs text-slate-700 flex items-center gap-1.5">
                      <Pill className="w-3 h-3 text-teal-600 shrink-0" />
                      <span className="font-medium truncate">{item.medicineName}</span>
                      <span className="text-slate-400 text-[11px]">({item.quantity})</span>
                    </div>
                  ))}
                  {rx.items.length > 3 && (
                    <span className="text-[10px] text-slate-400 block italic">
                      + និង {rx.items.length - 3} មុខផ្សេងទៀត...
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500 truncate max-w-[150px]">
                {rx.doctorName}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewingRx(rx)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors cursor-pointer"
                >
                  មើល / បោះពុម្ព
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('តើអ្នកចង់លុបវេជ្ជបញ្ជានេះមែនទេ?')) {
                      deletePrescription(rx.id);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Prescription Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  ចេញវេជ្ជបញ្ជាថ្មី (New Dental Prescription)
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* Patient & Doctor Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rx-patient-select" className="block text-xs font-semibold text-slate-700 mb-1">
                    អ្នកជំងឺ *
                  </label>
                  <select
                    id="rx-patient-select"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nameKhmer} ({p.phone}) {p.medicalAlerts.length > 0 && p.medicalAlerts[0] !== 'គ្មាន' ? `[⚠️ ${p.medicalAlerts.join(', ')}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="rx-doctor-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    ទន្តបណ្ឌិតចេញវេជ្ជបញ្ជា *
                  </label>
                  <input
                    id="rx-doctor-name"
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <label htmlFor="rx-diagnosis" className="block text-xs font-semibold text-slate-700 mb-1">
                  រោគវិនិច្ឆ័យ (Diagnosis) *
                </label>
                <input
                  id="rx-diagnosis"
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="ឧ. រលាកប្រឡាយឫសធ្មេញ, ឈឺធ្មេញក្រោយវះកាត់, Gingivitis..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              {/* Quick Add Medication Presets */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  ឱសថទន្តសាស្ត្រពេញនិយម (Quick Add Presets)៖
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_MEDICATIONS.map((med) => (
                    <button
                      key={med.name}
                      type="button"
                      onClick={() => handleAddMedication(med)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 border border-slate-200 rounded-md transition-colors cursor-pointer"
                    >
                      + {med.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Medication Items Table */}
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  តារាងបញ្ជីឱសថត្រូវចេញ ({items.length} មុខ)៖
                </span>
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 relative"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-teal-800">
                          #{idx + 1}. {item.medicineName}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="លុបមុខថ្នាំនេះ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-slate-500 block mb-0.5">
                            កម្រិត & សេចក្តីណែនាំប្រើប្រាស់
                          </label>
                          <input
                            type="text"
                            value={item.instruction}
                            onChange={(e) => handleUpdateItem(item.id, 'instruction', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">
                            ចំនួនសរុប
                          </label>
                          <input
                            type="text"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">
                            រយៈពេលប្រើ (ថ្ងៃ)
                          </label>
                          <input
                            type="number"
                            value={item.durationDays}
                            onChange={(e) => handleUpdateItem(item.id, 'durationDays', Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice */}
              <div>
                <label htmlFor="rx-advice" className="block text-xs font-semibold text-slate-700 mb-1">
                  ការណែនាំបន្ថែម (Doctor's Advice & Precautions)
                </label>
                <textarea
                  id="rx-advice"
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg min-h-[60px]"
                />
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={handleSaveRx}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-xs"
              >
                រក្សាទុក & បោះពុម្ពវេជ្ជបញ្ជា
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Printable Prescription Modal */}
      {viewingRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            
            <div className="no-print flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
              <span className="text-xs font-semibold text-slate-700">
                វេជ្ជបញ្ជា #{viewingRx.id}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>បោះពុម្ព</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingRx(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Prescription Slip */}
            <div className="p-8 overflow-y-auto print-card space-y-6">
              {/* Clinic Header */}
              <div className="text-center pb-4 border-b-2 border-teal-700">
                <h2 className="text-lg font-bold text-slate-900">
                  គ្លីនិកទន្តសាស្ត្រ DentCare Pro
                </h2>
                <p className="text-xs text-slate-600">
                  វេជ្ជបញ្ជាឱសថព្យាបាលធ្មេញ / PRESCRIPTION (Rx)
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  ទូរស័ព្ទ៖ 012 345 678 · រាជធានីភ្នំពេញ
                </p>
              </div>

              {/* Patient info */}
              <div className="grid grid-cols-2 text-xs py-2 border-b border-slate-200">
                <div>
                  <p><span className="font-semibold text-slate-700">អ្នកជំងឺ៖</span> {viewingRx.patientName}</p>
                  <p><span className="font-semibold text-slate-700">ទូរស័ព្ទ៖</span> {viewingRx.patientPhone}</p>
                </div>
                <div className="text-right">
                  <p><span className="font-semibold text-slate-700">កាលបរិច្ឆេទ៖</span> {formatKhmerDate(viewingRx.date)}</p>
                  <p><span className="font-semibold text-slate-700">រោគវិនិច្ឆ័យ៖</span> {viewingRx.diagnosis}</p>
                </div>
              </div>

              {/* Rx Symbol & Items */}
              <div>
                <div className="text-2xl font-serif font-black text-teal-800 mb-3">
                  ℞
                </div>
                <div className="space-y-4">
                  {viewingRx.items.map((item, idx) => (
                    <div key={item.id} className="text-xs pb-3 border-b border-dotted border-slate-200">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{idx + 1}. {item.medicineName} ({item.dosage})</span>
                        <span className="font-mono">#{item.quantity}</span>
                      </div>
                      <div className="text-slate-600 mt-1 pl-4">
                        ➔ {item.instruction} (ប្រើប្រាស់ {item.durationDays} ថ្ងៃ)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice */}
              {viewingRx.advice && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700 block mb-0.5">ការណែនាំ៖</span>
                  <p className="text-slate-600">{viewingRx.advice}</p>
                </div>
              )}

              {/* Doctor Signature */}
              <div className="pt-8 grid grid-cols-2 text-xs text-center">
                <div></div>
                <div>
                  <div className="h-16"></div>
                  <div className="border-t border-slate-400 pt-1 font-semibold text-slate-900">
                    {viewingRx.doctorName}
                  </div>
                  <span className="text-[10px] text-slate-500">ទន្តបណ្ឌិតព្យាបាល</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
