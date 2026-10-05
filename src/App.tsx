import React, { useState } from 'react';
import { DentalProvider, useDental } from './context/DentalContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Dashboard } from './components/Dashboard';
import { PatientList } from './components/patients/PatientList';
import { PatientDetailModal } from './components/patients/PatientDetailModal';
import { PatientFormModal } from './components/patients/PatientFormModal';
import { AppointmentManager } from './components/appointments/AppointmentManager';
import { InvoiceList } from './components/billing/InvoiceList';
import { InvoiceModal } from './components/billing/InvoiceModal';
import { NewInvoiceModal } from './components/billing/NewInvoiceModal';
import { InstallmentManager } from './components/installments/InstallmentManager';
import { AutoInstallmentCalculatorModal } from './components/installments/AutoInstallmentCalculatorModal';
import { DebtReport } from './components/debts/DebtReport';
import { PrescriptionManager } from './components/prescriptions/PrescriptionManager';
import { StockManager } from './components/inventory/StockManager';
import { FinanceManager } from './components/finance/FinanceManager';
import { DividendManager } from './components/dividends/DividendManager';
import { ActiveTab, Patient, Invoice } from './types';

const MainAppContent: React.FC = () => {
  const { recordPayment } = useDental();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Modals state
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorPatientId, setCalculatorPatientId] = useState<string | undefined>(undefined);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | undefined>(undefined);

  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [newInvoicePatientId, setNewInvoicePatientId] = useState<string | undefined>(undefined);

  const handleOpenCalculatorWithPatient = (pId?: string) => {
    setCalculatorPatientId(pId);
    setShowCalculator(true);
  };

  const handleOpenNewInvoiceWithPatient = (pId?: string) => {
    setNewInvoicePatientId(pId);
    setShowNewInvoice(true);
  };

  const handleOpenEditPatient = (p: Patient) => {
    setPatientToEdit(p);
    setShowPatientForm(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 pb-16 lg:pb-0">
      
      {/* 3-zone Header */}
      <Header
        onOpenCalculator={() => handleOpenCalculatorWithPatient()}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar & Mobile Drawer */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          onOpenCalculator={() => handleOpenCalculatorWithPatient()}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        {/* Main Viewport Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenCalculator={() => handleOpenCalculatorWithPatient()}
              onOpenRegister={() => {
                setPatientToEdit(undefined);
                setShowPatientForm(true);
              }}
              onOpenNewInvoice={() => handleOpenNewInvoiceWithPatient()}
              onSelectPatient={(p) => setSelectedPatient(p)}
              onViewInvoice={(inv) => setViewingInvoice(inv)}
            />
          )}

          {activeTab === 'patients' && (
            <PatientList
              onSelectPatient={(p) => setSelectedPatient(p)}
              onOpenRegister={() => {
                setPatientToEdit(undefined);
                setShowPatientForm(true);
              }}
              onEditPatient={handleOpenEditPatient}
            />
          )}

          {activeTab === 'appointments' && <AppointmentManager />}

          {activeTab === 'invoices' && (
            <InvoiceList
              onViewInvoice={(inv) => setViewingInvoice(inv)}
              onOpenNewInvoice={() => handleOpenNewInvoiceWithPatient()}
            />
          )}

          {activeTab === 'installments' && (
            <InstallmentManager
              onOpenCalculator={() => handleOpenCalculatorWithPatient()}
            />
          )}

          {activeTab === 'debts' && (
            <DebtReport
              onViewInvoice={(inv) => setViewingInvoice(inv)}
            />
          )}

          {activeTab === 'prescriptions' && <PrescriptionManager />}

          {activeTab === 'stock' && <StockManager />}

          {activeTab === 'finance' && <FinanceManager />}

          {activeTab === 'dividends' && <DividendManager />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Requirement 10) */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onToggleSidebar={() => setIsSidebarOpenMobile((prev) => !prev)}
      />

      {/* MODAL 1: Auto Installment Calculator (Requirement 12 & 13) */}
      {showCalculator && (
        <AutoInstallmentCalculatorModal
          preselectedPatientId={calculatorPatientId}
          onClose={() => {
            setShowCalculator(false);
            setCalculatorPatientId(undefined);
          }}
          onSuccessCreated={() => {
            setActiveTab('installments');
          }}
        />
      )}

      {/* MODAL 2: Patient Registration / Edit (Requirement 1) */}
      {showPatientForm && (
        <PatientFormModal
          initialPatient={patientToEdit}
          onClose={() => {
            setShowPatientForm(false);
            setPatientToEdit(undefined);
          }}
          onSuccess={(p) => {
            setSelectedPatient(p);
          }}
        />
      )}

      {/* MODAL 3: Patient Detail & Odontogram Chart (Requirement 11) */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onEditPatient={handleOpenEditPatient}
          onOpenNewInvoice={handleOpenNewInvoiceWithPatient}
          onOpenCalculator={handleOpenCalculatorWithPatient}
          onViewInvoice={(inv) => setViewingInvoice(inv)}
        />
      )}

      {/* MODAL 4: Invoice View, Print & Telegram Share (Requirement 6 & 13) */}
      {viewingInvoice && (
        <InvoiceModal
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          onRecordPayment={(invId, amount, method) => {
            recordPayment(invId, amount, method);
            // Refresh invoice
            setViewingInvoice((prev) =>
              prev ? { ...prev, paid: prev.paid + amount, balance: Math.max(0, prev.balance - amount) } : null
            );
          }}
        />
      )}

      {/* MODAL 5: Create New Invoice (Requirement 2) */}
      {showNewInvoice && (
        <NewInvoiceModal
          preselectedPatientId={newInvoicePatientId}
          onClose={() => {
            setShowNewInvoice(false);
            setNewInvoicePatientId(undefined);
          }}
          onSuccessCreated={(createdInv) => {
            setViewingInvoice(createdInv);
          }}
        />
      )}

    </div>
  );
};

export default function App() {
  return (
    <DentalProvider>
      <MainAppContent />
    </DentalProvider>
  );
}
