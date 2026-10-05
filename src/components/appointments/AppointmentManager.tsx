import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { Appointment } from '../../types';
import {
  Calendar,
  Clock,
  User,
  Plus,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PlayCircle,
  Phone,
  Trash2,
} from 'lucide-react';
import { formatKhmerDate } from '../../utils/khmerHelpers';

export const AppointmentManager: React.FC = () => {
  const {
    appointments,
    patients,
    addAppointment,
    updateAppointmentStatus,
    deleteAppointment,
  } = useDental();

  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming'>('today');
  const [showAddModal, setShowAddModal] = useState(false);

  // New appointment form state
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [doctorName, setDoctorName] = useState('ទន្តបណ្ឌិត សាន វិបុល');
  const [date, setDate] = useState('2026-10-05');
  const [time, setTime] = useState('10:00');
  const [procedure, setProcedure] = useState('ពិនិត្យធ្មេញ និងកោសកំបោរ');
  const [chair, setChair] = useState('កៅអីលេខ ១');
  const [notes, setNotes] = useState('');

  const todayStr = '2026-10-05';

  const filteredAppointments = appointments.filter((appt) => {
    if (dateFilter === 'today') return appt.date === todayStr;
    if (dateFilter === 'upcoming') return appt.date >= todayStr;
    return true;
  });

  const handleCreateAppointment = () => {
    const selectedPatient = patients.find((p) => p.id === patientId);
    if (!selectedPatient) return;

    addAppointment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.nameKhmer,
      patientPhone: selectedPatient.phone,
      doctorName,
      date,
      time,
      procedure,
      chair,
      status: 'waiting',
      notes,
    });

    setShowAddModal(false);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'waiting':
        return { label: 'កំពុងរង់ចាំ', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: Clock };
      case 'in_progress':
        return { label: 'កំពុងព្យាបាល', color: 'text-teal-700 bg-teal-50 border-teal-200', icon: PlayCircle };
      case 'completed':
        return { label: 'បានបញ្ចប់', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2 };
      case 'cancelled':
        return { label: 'បានលុបចោល', color: 'text-slate-500 bg-slate-100 border-slate-200', icon: XCircle };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-100 text-teal-800 rounded-lg">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                គ្រប់គ្រងការណាត់ជួបអ្នកជំងឺ (Appointment Calendar)
              </h1>
              <p className="text-xs text-slate-500">
                រៀបចំកាលវិភាគ ជ្រើសរើសទន្តបណ្ឌិត និងចាត់ចែងកៅអីព្យាបាល
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ណាត់ជួបថ្មី (New Appointment)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit text-xs font-medium">
        <button
          type="button"
          onClick={() => setDateFilter('today')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            dateFilter === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ថ្ងៃនេះ ({appointments.filter((a) => a.date === todayStr).length})
        </button>
        <button
          type="button"
          onClick={() => setDateFilter('upcoming')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            dateFilter === 'upcoming' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ការណាត់ជួបបន្ទាប់ ({appointments.filter((a) => a.date >= todayStr).length})
        </button>
        <button
          type="button"
          onClick={() => setDateFilter('all')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            dateFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ទាំងអស់ ({appointments.length})
        </button>
      </div>

      {/* Appointment Cards / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.map((appt) => {
          const badge = getStatusBadge(appt.status);
          const BadgeIcon = badge.icon;

          return (
            <div
              key={appt.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
                      <Clock className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-sm font-bold text-slate-900 font-mono">
                        {appt.time}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {formatKhmerDate(appt.date)}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}
                  >
                    <BadgeIcon className="w-3 h-3" />
                    <span>{badge.label}</span>
                  </span>
                </div>

                <div className="my-3 space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {appt.patientName}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span className="font-mono">{appt.patientPhone}</span>
                  </div>
                  <div className="text-xs text-teal-800 font-medium pt-1">
                    សេវាកម្ម៖ {appt.procedure}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-0.5 mb-4">
                  <div className="flex justify-between">
                    <span>ទន្តបណ្ឌិត៖</span>
                    <span className="font-semibold text-slate-900">{appt.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ទីតាំង៖</span>
                    <span className="font-medium text-slate-800">{appt.chair}</span>
                  </div>
                  {appt.notes && (
                    <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-200 mt-1">
                      {appt.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Switcher Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {appt.status === 'waiting' && (
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(appt.id, 'in_progress')}
                      className="px-2.5 py-1 text-[11px] font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors cursor-pointer"
                    >
                      ចាប់ផ្តើមព្យាបាល
                    </button>
                  )}
                  {appt.status === 'in_progress' && (
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(appt.id, 'completed')}
                      className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors cursor-pointer"
                    >
                      បញ្ចប់ការព្យាបាល
                    </button>
                  )}
                  {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                      className="px-2 py-1 text-[11px] text-slate-500 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                    >
                      លុបចោល
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('តើអ្នកចង់លុបការណាត់ជួបនេះមែនទេ?')) {
                      deleteAppointment(appt.id);
                    }
                  }}
                  className="p-1 text-slate-300 hover:text-rose-600 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              កត់ត្រាការណាត់ជួបថ្មី (New Appointment)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              កំណត់កាលវិភាគ ជ្រើសរើសវេជ្ជបណ្ឌិត និងកៅអីព្យាបាល
            </p>

            <div className="space-y-3">
              <div>
                <label htmlFor="apt-patient-select" className="block text-xs font-semibold text-slate-700 mb-1">
                  ជ្រើសរើសអ្នកជំងឺ *
                </label>
                <select
                  id="apt-patient-select"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameKhmer} ({p.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="apt-date" className="block text-xs font-semibold text-slate-700 mb-1">
                    កាលបរិច្ឆេទ
                  </label>
                  <input
                    id="apt-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="apt-time" className="block text-xs font-semibold text-slate-700 mb-1">
                    ម៉ោងណាត់
                  </label>
                  <input
                    id="apt-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="apt-procedure" className="block text-xs font-semibold text-slate-700 mb-1">
                  សេវាកម្មព្យាបាល *
                </label>
                <input
                  id="apt-procedure"
                  type="text"
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                  placeholder="ឧ. ពិនិត្យ និងរឹតលួសពត់ធ្មេញ, ប៉ះធ្មេញ..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="apt-doctor" className="block text-xs font-semibold text-slate-700 mb-1">
                    ទន្តបណ្ឌិត
                  </label>
                  <select
                    id="apt-doctor"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="ទន្តបណ្ឌិត សាន វិបុល">ទន្តបណ្ឌិត សាន វិបុល</option>
                    <option value="ទន្តបណ្ឌិត លឹម ស្រីមុំ">ទន្តបណ្ឌិត លឹម ស្រីមុំ</option>
                    <option value="ទន្តបណ្ឌិត តាំង ចាន់ដារ៉ា">ទន្តបណ្ឌិត តាំង ចាន់ដារ៉ា</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="apt-chair" className="block text-xs font-semibold text-slate-700 mb-1">
                    កៅអីព្យាបាល (Chair)
                  </label>
                  <select
                    id="apt-chair"
                    value={chair}
                    onChange={(e) => setChair(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="កៅអីលេខ ១">កៅអីលេខ ១</option>
                    <option value="កៅអីលេខ ២">កៅអីលេខ ២</option>
                    <option value="កៅអីលេខ ៣">កៅអីលេខ ៣</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="apt-notes" className="block text-xs font-semibold text-slate-700 mb-1">
                  កំណត់ចំណាំ
                </label>
                <input
                  id="apt-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ឧ. អ្នកជំងឺចង់ពិគ្រោះពី Damon..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
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
                onClick={handleCreateAppointment}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-xs"
              >
                រក្សាទុកការណាត់ជួប
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
