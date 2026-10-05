import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { Patient } from '../../types';
import { X, UserPlus } from 'lucide-react';

interface PatientFormModalProps {
  onClose: () => void;
  onSuccess: (patient: Patient) => void;
  initialPatient?: Patient;
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  onClose,
  onSuccess,
  initialPatient,
}) => {
  const { addPatient, updatePatient } = useDental();

  const [nameKhmer, setNameKhmer] = useState(initialPatient?.nameKhmer || '');
  const [nameLatin, setNameLatin] = useState(initialPatient?.nameLatin || '');
  const [gender, setGender] = useState<'female' | 'male' | 'other'>(initialPatient?.gender || 'female');
  const [age, setAge] = useState<number>(initialPatient?.age || 25);
  const [phone, setPhone] = useState(initialPatient?.phone || '');
  const [telegram, setTelegram] = useState(initialPatient?.telegram || '');
  const [address, setAddress] = useState(initialPatient?.address || 'ភ្នំពេញ');
  const [medicalAlertsStr, setMedicalAlertsStr] = useState(initialPatient?.medicalAlerts.join(', ') || 'គ្មាន');
  const [dentalAlertsStr, setDentalAlertsStr] = useState(initialPatient?.dentalAlerts.join(', ') || 'គ្មាន');
  const [notes, setNotes] = useState(initialPatient?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameKhmer || !phone) {
      alert('សូមបញ្ចូលឈ្មោះជាភាសាខ្មែរ និងលេខទូរស័ព្ទ!');
      return;
    }

    const medAlerts = medicalAlertsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const dentAlerts = dentalAlertsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (initialPatient) {
      updatePatient(initialPatient.id, {
        nameKhmer,
        nameLatin,
        gender,
        age,
        phone,
        telegram,
        address,
        medicalAlerts: medAlerts,
        dentalAlerts: dentAlerts,
        notes,
      });
      onSuccess({ ...initialPatient, nameKhmer, nameLatin, gender, age, phone, telegram, address, medicalAlerts: medAlerts, dentalAlerts: dentAlerts, notes });
    } else {
      const created = addPatient({
        nameKhmer,
        nameLatin,
        gender,
        age,
        phone,
        telegram,
        address,
        medicalAlerts: medAlerts,
        dentalAlerts: dentAlerts,
        notes,
      });
      onSuccess(created);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-teal-600" />
            <h2 className="font-bold text-slate-900 text-base">
              {initialPatient ? 'កែប្រែព័ត៌មានអ្នកជំងឺ' : 'ចុះឈ្មោះអ្នកជំងឺថ្មី (Patient Registration)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="pat-name-khmer" className="block text-xs font-semibold text-slate-700 mb-1">
                ឈ្មោះជាភាសាខ្មែរ *
              </label>
              <input
                id="pat-name-khmer"
                type="text"
                required
                value={nameKhmer}
                onChange={(e) => setNameKhmer(e.target.value)}
                placeholder="ឧ. សុខ ចិន្តា"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-medium"
              />
            </div>
            <div>
              <label htmlFor="pat-name-latin" className="block text-xs font-semibold text-slate-700 mb-1">
                ឈ្មោះជាអក្សរឡាតាំង (Latin Name)
              </label>
              <input
                id="pat-name-latin"
                type="text"
                value={nameLatin}
                onChange={(e) => setNameLatin(e.target.value)}
                placeholder="e.g. Sok Chenda"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="pat-gender" className="block text-xs font-semibold text-slate-700 mb-1">
                ភេទ
              </label>
              <select
                id="pat-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="female">ស្រី (Female)</option>
                <option value="male">ប្រុស (Male)</option>
                <option value="other">ផ្សេងៗ</option>
              </select>
            </div>
            <div>
              <label htmlFor="pat-age" className="block text-xs font-semibold text-slate-700 mb-1">
                អាយុ
              </label>
              <input
                id="pat-age"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg tabular-nums font-medium"
              />
            </div>
            <div>
              <label htmlFor="pat-telegram" className="block text-xs font-semibold text-slate-700 mb-1">
                Telegram (@User/Phone)
              </label>
              <input
                id="pat-telegram"
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@username"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label htmlFor="pat-phone" className="block text-xs font-semibold text-slate-700 mb-1">
              លេខទូរស័ព្ទ *
            </label>
            <input
              id="pat-phone"
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="012 345 678"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono font-medium"
            />
          </div>

          <div>
            <label htmlFor="pat-address" className="block text-xs font-semibold text-slate-700 mb-1">
              អាសយដ្ឋាន
            </label>
            <input
              id="pat-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="សង្កាត់ ខណ្ឌ រាជធានី/ខេត្ត"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="pat-med-alerts" className="block text-xs font-semibold text-rose-700 mb-1">
                ប្រវត្តិជំងឺ / អាលែកហ្ស៊ីថ្នាំ (Medical Alerts)
              </label>
              <input
                id="pat-med-alerts"
                type="text"
                value={medicalAlertsStr}
                onChange={(e) => setMedicalAlertsStr(e.target.value)}
                placeholder="ឧ. អាលែកហ្ស៊ី Penicillin, លើសឈាម"
                className="w-full px-3 py-2 text-xs border border-rose-200 rounded-lg bg-rose-50/40 text-rose-900"
              />
            </div>
            <div>
              <label htmlFor="pat-dent-alerts" className="block text-xs font-semibold text-slate-700 mb-1">
                បញ្ហាធ្មេញសំខាន់ៗ (Dental Alerts)
              </label>
              <input
                id="pat-dent-alerts"
                type="text"
                value={dentalAlertsStr}
                onChange={(e) => setDentalAlertsStr(e.target.value)}
                placeholder="ឧ. ធ្មេញស្រៀវខ្លាំង, រលាកអញ្ចាញ"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label htmlFor="pat-notes" className="block text-xs font-semibold text-slate-700 mb-1">
              កំណត់ចំណាំទូទៅ (Notes)
            </label>
            <textarea
              id="pat-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="កំណត់ចំណាំអំពីអ្នកជំងឺ..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg min-h-[50px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-xs"
            >
              {initialPatient ? 'កែប្រែព័ត៌មាន' : 'ចុះឈ្មោះអ្នកជំងឺ'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
