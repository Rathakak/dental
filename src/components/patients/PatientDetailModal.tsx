import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { Patient, ToothCondition } from '../../types';
import { OdontogramChart } from '../odontogram/OdontogramChart';
import { ToothEditModal } from '../odontogram/ToothEditModal';
import {
  X,
  User,
  Phone,
  Calendar,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  DollarSign,
  Plus,
  Send,
} from 'lucide-react';
import { formatUSD, formatKhmerDate } from '../../utils/khmerHelpers';

interface PatientDetailModalProps {
  patient: Patient;
  onClose: () => void;
  onEditPatient: (patient: Patient) => void;
  onOpenNewInvoice: (patientId: string) => void;
  onOpenCalculator: (patientId: string) => void;
  onViewInvoice: (invoice: any) => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  onClose,
  onEditPatient,
  onOpenNewInvoice,
  onOpenCalculator,
  onViewInvoice,
}) => {
  const {
    updateToothState,
    treatments,
    addTreatment,
    invoices,
    installmentPlans,
    prescriptions,
  } = useDental();

  const [activeTab, setActiveTab] = useState<'odontogram' | 'treatments' | 'invoices' | 'installments' | 'prescriptions'>('odontogram');
  const [selectedToothToEdit, setSelectedToothToEdit] = useState<number | null>(null);

  // New treatment record state
  const [showAddTreatment, setShowAddTreatment] = useState(false);
  const [newProcName, setNewProcName] = useState('ប៉ះធ្មេញជ័រ Composite');
  const [newToothNum, setNewToothNum] = useState<number>(14);
  const [newCost, setNewCost] = useState<number>(30);
  const [newDoc, setNewDoc] = useState('ទន្តបណ្ឌិត សាន វិបុល');

  // Filtered data for this patient
  const patientTreatments = treatments.filter((t) => t.patientId === patient.id);
  const patientInvoices = invoices.filter((i) => i.patientId === patient.id);
  const patientPlans = installmentPlans.filter((p) => p.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter((r) => r.patientId === patient.id);

  const totalSpent = patientInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = patientInvoices.reduce((sum, inv) => sum + inv.paid, 0);
  const totalDebt = patientInvoices.reduce((sum, inv) => sum + inv.balance, 0);

  const handleToothClick = (toothNum: number) => {
    setSelectedToothToEdit(toothNum);
  };

  const handleSaveToothCondition = (toothNum: number, condition: ToothCondition, notes: string) => {
    updateToothState(patient.id, toothNum, condition, notes);
    setSelectedToothToEdit(null);
  };

  const handleSaveTreatment = () => {
    addTreatment({
      patientId: patient.id,
      toothNumbers: [newToothNum],
      procedureName: newProcName,
      doctorName: newDoc,
      date: new Date().toISOString().split('T')[0],
      cost: newCost,
      status: 'completed',
      notes: 'កត់ត្រាក្នុងប្រវត្តិអ្នកជំងឺ',
    });
    setShowAddTreatment(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header Profile Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-slate-200 bg-slate-50/70 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              {patient.nameKhmer.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900">
                  {patient.nameKhmer}
                </h1>
                <span className="text-xs text-slate-500 font-medium">
                  ({patient.nameLatin})
                </span>
                <span className="text-xs font-mono font-semibold text-teal-800">
                  {patient.id}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                <span>{patient.gender === 'female' ? 'ស្រី' : 'ប្រុស'}, {patient.age} ឆ្នាំ</span>
                <span>·</span>
                <span className="font-mono">{patient.phone}</span>
                {patient.telegram && (
                  <>
                    <span>·</span>
                    <span className="text-sky-600">{patient.telegram}</span>
                  </>
                )}
                <span>·</span>
                <span className="truncate max-w-[200px]">{patient.address}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onEditPatient(patient)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              កែប្រែព័ត៌មាន
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Alerts & Financial Badges */}
        <div className="px-5 py-2.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {patient.medicalAlerts.length > 0 && patient.medicalAlerts[0] !== 'គ្មាន' ? (
              <div className="flex items-center gap-1.5 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>អាលែកហ្ស៊ី / បញ្ហាសុខភាព៖ {patient.medicalAlerts.join(', ')}</span>
              </div>
            ) : (
              <span className="text-slate-500">សុខភាពទូទៅ៖ ធម្មតា (គ្មានអាលែកហ្ស៊ី)</span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span>ព្យាបាលសរុប៖ <strong>{formatUSD(totalSpent)}</strong></span>
            <span>បានបង់៖ <strong className="text-emerald-700">{formatUSD(totalPaid)}</strong></span>
            {totalDebt > 0 && (
              <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                ជំពាក់៖ {formatUSD(totalDebt)}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 border-b border-slate-200 bg-white text-xs font-medium overflow-x-auto">
          {[
            { id: 'odontogram', label: 'តារាងធ្មេញ (Odontogram)' },
            { id: 'treatments', label: `ប្រវត្តិព្យាបាល (${patientTreatments.length})` },
            { id: 'invoices', label: `វិក្កយបត្រ (${patientInvoices.length})` },
            { id: 'installments', label: `គម្រោងបង់រំលោះ (${patientPlans.length})` },
            { id: 'prescriptions', label: `វេជ្ជបញ្ជា (${patientPrescriptions.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-800 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* TAB 1: Odontogram Chart */}
          {activeTab === 'odontogram' && (
            <div className="space-y-4">
              <OdontogramChart
                teeth={patient.teeth}
                onToothClick={handleToothClick}
                interactive={true}
              />
            </div>
          )}

          {/* TAB 2: Treatments History */}
          {activeTab === 'treatments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-700">
                  កំណត់ត្រាការព្យាបាលកន្លងមក
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddTreatment(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>កត់ត្រាការព្យាបាល</span>
                </button>
              </div>

              {patientTreatments.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  មិនទាន់មានកំណត់ត្រាការព្យាបាលនៅឡើយ
                </div>
              ) : (
                <div className="space-y-3">
                  {patientTreatments.map((tr) => (
                    <div
                      key={tr.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 text-sm">
                            {tr.procedureName}
                          </span>
                          {tr.toothNumbers.length > 0 && (
                            <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded font-semibold">
                              ធ្មេញ #{tr.toothNumbers.join(', #')}
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 space-y-0.5">
                          <p>ទន្តបណ្ឌិត៖ {tr.doctorName} · កាលបរិច្ឆេទ៖ {formatKhmerDate(tr.date)}</p>
                          {tr.notes && <p className="italic text-slate-600">{tr.notes}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                          {formatUSD(tr.cost)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Invoices */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-700">
                  វិក្កយបត្ររបស់អ្នកជំងឺ
                </span>
                <button
                  type="button"
                  onClick={() => onOpenNewInvoice(patient.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ចេញវិក្កយបត្រថ្មី</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">លេខវិក្កយបត្រ</th>
                      <th className="py-2.5 px-3">កាលបរិច្ឆេទ</th>
                      <th className="py-2.5 px-3 text-right">តម្លៃសរុប</th>
                      <th className="py-2.5 px-3 text-right">បានបង់</th>
                      <th className="py-2.5 px-3 text-right">នៅខ្វះ</th>
                      <th className="py-2.5 px-3 text-center">ស្ថានភាព</th>
                      <th className="py-2.5 px-3 text-center">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patientInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-teal-800">#{inv.id}</td>
                        <td className="py-2.5 px-3 text-slate-600">{formatKhmerDate(inv.date)}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold">{formatUSD(inv.total)}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-700">{formatUSD(inv.paid)}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-rose-600">{formatUSD(inv.balance)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {inv.status === 'paid' ? 'ទូទាត់ដាច់' : 'នៅខ្វះ'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => onViewInvoice(inv)}
                            className="px-2 py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded cursor-pointer"
                          >
                            មើល / បោះពុម្ព
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Installments */}
          {activeTab === 'installments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-700">
                  គម្រោងបង់រំលោះរបស់អ្នកជំងឺ
                </span>
                <button
                  type="button"
                  onClick={() => onOpenCalculator(patient.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>គណនា & បង្កើតគម្រោងរំលោះ</span>
                </button>
              </div>

              {patientPlans.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  អ្នកជំងឺមិនទាន់មានគម្រោងបង់រំលោះនៅឡើយទេ
                </div>
              ) : (
                <div className="space-y-3">
                  {patientPlans.map((plan) => (
                    <div key={plan.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono font-semibold text-teal-700">#{plan.id}</span>
                          <h4 className="font-bold text-slate-900 text-sm">{plan.treatmentDescription}</h4>
                          <p className="text-slate-500">រយៈពេល {plan.months} ខែ · {formatUSD(plan.monthlyPayment)}/ខែ</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 block tabular-nums">{formatUSD(plan.totalCost)}</span>
                          <span className="text-rose-600 font-semibold tabular-nums">នៅសល់៖ {formatUSD(plan.remainingBalance)}</span>
                        </div>
                      </div>

                      {/* Stages list */}
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-slate-200 text-center">
                        {plan.stages.map((st) => (
                          <div
                            key={st.stageNumber}
                            className={`p-2 rounded-lg border text-[11px] ${
                              st.status === 'paid'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : st.status === 'overdue'
                                ? 'bg-rose-50 border-rose-200 text-rose-800 font-bold'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="block font-semibold">លើកទី {st.stageNumber}</span>
                            <span className="font-mono block tabular-nums">{formatUSD(st.amount)}</span>
                            <span className="text-[10px] block opacity-80">{st.status === 'paid' ? '✓ បង់រួច' : 'រង់ចាំ'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Prescriptions */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              {patientPrescriptions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  មិនទាន់មានប្រវត្តិវេជ្ជបញ្ជាសម្រាប់អ្នកជំងឺនេះឡើយ
                </div>
              ) : (
                <div className="space-y-3">
                  {patientPrescriptions.map((rx) => (
                    <div key={rx.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono font-semibold text-teal-700">#{rx.id}</span>
                          <h4 className="font-bold text-slate-900">{rx.diagnosis}</h4>
                          <span className="text-slate-500">ចេញដោយ {rx.doctorName} · {formatKhmerDate(rx.date)}</span>
                        </div>
                      </div>
                      <div className="pl-3 border-l-2 border-teal-500 space-y-1">
                        {rx.items.map((item) => (
                          <p key={item.id} className="text-slate-700">
                            • <strong>{item.medicineName}</strong>: {item.instruction} ({item.quantity})
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Tooth Edit Sub-Modal */}
      {selectedToothToEdit && (
        <ToothEditModal
          toothNumber={selectedToothToEdit}
          initialState={patient.teeth[selectedToothToEdit]}
          onSave={handleSaveToothCondition}
          onClose={() => setSelectedToothToEdit(null)}
        />
      )}

      {/* Add Treatment Quick Modal */}
      {showAddTreatment && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              កត់ត្រាការព្យាបាលថ្មី
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label htmlFor="proc-name" className="block text-slate-700 font-semibold mb-1">
                  ឈ្មោះសេវាកម្មព្យាបាល
                </label>
                <input
                  id="proc-name"
                  type="text"
                  value={newProcName}
                  onChange={(e) => setNewProcName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="proc-tooth-num" className="block text-slate-700 font-semibold mb-1">
                    លេខធ្មេញ (#)
                  </label>
                  <input
                    id="proc-tooth-num"
                    type="number"
                    min="1"
                    max="32"
                    value={newToothNum}
                    onChange={(e) => setNewToothNum(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="proc-cost" className="block text-slate-700 font-semibold mb-1">
                    តម្លៃ ($)
                  </label>
                  <input
                    id="proc-cost"
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-bold tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="proc-doctor" className="block text-slate-700 font-semibold mb-1">
                  ទន្តបណ្ឌិត
                </label>
                <input
                  id="proc-doctor"
                  type="text"
                  value={newDoc}
                  onChange={(e) => setNewDoc(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddTreatment(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={handleSaveTreatment}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700"
              >
                រក្សាទុក
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
