import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { Patient } from '../../types';
import {
  Users,
  Search,
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  Phone,
  FileSpreadsheet,
} from 'lucide-react';
import { formatKhmerDate } from '../../utils/khmerHelpers';

interface PatientListProps {
  onSelectPatient: (patient: Patient) => void;
  onOpenRegister: () => void;
  onEditPatient: (patient: Patient) => void;
}

export const PatientList: React.FC<PatientListProps> = ({
  onSelectPatient,
  onOpenRegister,
  onEditPatient,
}) => {
  const { patients, deletePatient } = useDental();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(
    (p) =>
      p.nameKhmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameLatin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-100 text-teal-800 rounded-lg">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                គ្រប់គ្រងចុះឈ្មោះ និងប្រវត្តិអ្នកជំងឺ (Patients Management)
              </h1>
              <p className="text-xs text-slate-500">
                បញ្ជីអ្នកជំងឺ ប្រវត្តិព្យាបាល តារាងធ្មេញ Odontogram និងការព្រមានសុខភាព
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenRegister}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>ចុះឈ្មោះអ្នកជំងឺថ្មី</span>
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
            placeholder="ស្វែងរកតាមឈ្មោះ លេខទូរស័ព្ទ អត្តលេខ..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <span className="text-xs text-slate-500">
          អ្នកជំងឺសរុប៖ <span className="font-semibold text-slate-900">{patients.length}</span> នាក់
        </span>
      </div>

      {/* Patient Cards / Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">អត្តលេខ</th>
                <th className="py-3 px-4">ឈ្មោះអ្នកជំងឺ</th>
                <th className="py-3 px-3">ភេទ / អាយុ</th>
                <th className="py-3 px-3">លេខទូរស័ព្ទ</th>
                <th className="py-3 px-4">ការដាស់តឿនសុខភាព (Alerts)</th>
                <th className="py-3 px-3">ថ្ងៃចុះឈ្មោះ</th>
                <th className="py-3 px-4 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((patient) => {
                const hasAlert = patient.medicalAlerts.length > 0 && patient.medicalAlerts[0] !== 'គ្មាន';

                return (
                  <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-teal-800">
                      {patient.id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 text-sm">
                        {patient.nameKhmer}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {patient.nameLatin}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      {patient.gender === 'female' ? 'ស្រី' : 'ប្រុស'}, {patient.age} ឆ្នាំ
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-mono text-slate-800">{patient.phone}</div>
                      {patient.telegram && (
                        <span className="text-[11px] text-sky-600 font-medium">
                          {patient.telegram}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {hasAlert ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                          <span className="truncate max-w-[180px]">{patient.medicalAlerts.join(', ')}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">ធម្មតា</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {formatKhmerDate(patient.registeredDate)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectPatient(patient)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded hover:bg-teal-100 transition-colors cursor-pointer"
                          title="មើលប្រវត្តិអ្នកជំងឺ & តារាងធ្មេញ"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>ប្រវត្តិ & ធ្មេញ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditPatient(patient)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="កែប្រែព័ត៌មាន"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`តើអ្នកចង់លុបអ្នកជំងឺ "${patient.nameKhmer}" មែនទេ?`)) {
                              deletePatient(patient.id);
                            }
                          }}
                          className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors cursor-pointer"
                          title="លុបអ្នកជំងឺ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
