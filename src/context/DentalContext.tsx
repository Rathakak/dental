import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Patient,
  Appointment,
  Invoice,
  InstallmentPlan,
  Prescription,
  StockItem,
  FinancialRecord,
  DividendDistribution,
  TreatmentRecord,
  UserRole,
  ToothState,
  ToothCondition,
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_INVOICES,
  INITIAL_INSTALLMENT_PLANS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_STOCK_ITEMS,
  INITIAL_FINANCIAL_RECORDS,
  INITIAL_DIVIDENDS,
  INITIAL_TREATMENTS,
} from '../data/initialData';
import { calculateInstallmentSchedule } from '../utils/khmerHelpers';

interface DentalContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  // Patients
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'registeredDate' | 'teeth'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  updateToothState: (patientId: string, toothNumber: number, condition: ToothCondition, notes?: string) => void;
  treatments: TreatmentRecord[];
  addTreatment: (treatment: Omit<TreatmentRecord, 'id'>) => void;
  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  deleteAppointment: (id: string) => void;
  // Invoices & Payments
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => Invoice;
  recordPayment: (invoiceId: string, amount: number, method: Invoice['paymentMethod'], notes?: string) => void;
  // Installments
  installmentPlans: InstallmentPlan[];
  createInstallmentPlan: (plan: {
    patientId: string;
    patientName: string;
    patientPhone: string;
    treatmentDescription: string;
    totalCost: number;
    deposit: number;
    months: number;
    startDate?: string;
  }) => InstallmentPlan;
  payInstallmentStage: (planId: string, stageNumber: number, paymentMethod?: string) => void;
  // Prescriptions
  prescriptions: Prescription[];
  addPrescription: (prescription: Omit<Prescription, 'id'>) => Prescription;
  deletePrescription: (id: string) => void;
  // Inventory
  stockItems: StockItem[];
  addStockItem: (item: Omit<StockItem, 'id'>) => void;
  adjustStockQuantity: (id: string, change: number, reason?: string) => void;
  deleteStockItem: (id: string) => void;
  // Finance
  financialRecords: FinancialRecord[];
  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>) => void;
  deleteFinancialRecord: (id: string) => void;
  // Dividends
  dividends: DividendDistribution[];
  createDividendDistribution: (data: Omit<DividendDistribution, 'id' | 'createdDate'>) => void;
  markBeneficiaryPaid: (dividendId: string, beneficiaryId: string) => void;
  // Computed helpers
  getPatientDebts: () => {
    patient: Patient;
    invoices: Invoice[];
    totalBilled: number;
    totalPaid: number;
    debtAmount: number;
    lastInvoiceDate: string;
    nextDueDate?: string;
  }[];
  totalDebtSum: number;
  lowStockCount: number;
  todayAppointmentsCount: number;
  totalRevenueSum: number;
  totalExpensesSum: number;
  netProfitSum: number;
  resetToSampleData: () => void;
}

const DentalContext = createContext<DentalContextType | undefined>(undefined);

function getStorage<T>(key: string, initialValue: T): T {
  try {
    const item = localStorage.getItem(`dentcare_${key}`);
    return item ? JSON.parse(item) : initialValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return initialValue;
  }
}

function setStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(`dentcare_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}

export const DentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => getStorage('role', 'admin'));
  const [patients, setPatients] = useState<Patient[]>(() => getStorage('patients', INITIAL_PATIENTS));
  const [treatments, setTreatments] = useState<TreatmentRecord[]>(() => getStorage('treatments', INITIAL_TREATMENTS));
  const [appointments, setAppointments] = useState<Appointment[]>(() => getStorage('appointments', INITIAL_APPOINTMENTS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStorage('invoices', INITIAL_INVOICES));
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>(() => getStorage('installmentPlans', INITIAL_INSTALLMENT_PLANS));
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => getStorage('prescriptions', INITIAL_PRESCRIPTIONS));
  const [stockItems, setStockItems] = useState<StockItem[]>(() => getStorage('stockItems', INITIAL_STOCK_ITEMS));
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(() => getStorage('financialRecords', INITIAL_FINANCIAL_RECORDS));
  const [dividends, setDividends] = useState<DividendDistribution[]>(() => getStorage('dividends', INITIAL_DIVIDENDS));

  // Sync to local storage
  const setRole = (r: UserRole) => {
    setRoleState(r);
    setStorage('role', r);
  };

  useEffect(() => { setStorage('patients', patients); }, [patients]);
  useEffect(() => { setStorage('treatments', treatments); }, [treatments]);
  useEffect(() => { setStorage('appointments', appointments); }, [appointments]);
  useEffect(() => { setStorage('invoices', invoices); }, [invoices]);
  useEffect(() => { setStorage('installmentPlans', installmentPlans); }, [installmentPlans]);
  useEffect(() => { setStorage('prescriptions', prescriptions); }, [prescriptions]);
  useEffect(() => { setStorage('stockItems', stockItems); }, [stockItems]);
  useEffect(() => { setStorage('financialRecords', financialRecords); }, [financialRecords]);
  useEffect(() => { setStorage('dividends', dividends); }, [dividends]);

  // Reset function
  const resetToSampleData = () => {
    setPatients(INITIAL_PATIENTS);
    setTreatments(INITIAL_TREATMENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setInvoices(INITIAL_INVOICES);
    setInstallmentPlans(INITIAL_INSTALLMENT_PLANS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setStockItems(INITIAL_STOCK_ITEMS);
    setFinancialRecords(INITIAL_FINANCIAL_RECORDS);
    setDividends(INITIAL_DIVIDENDS);
  };

  // Patient Actions
  const addPatient = (patientData: Omit<Patient, 'id' | 'registeredDate' | 'teeth'>) => {
    const newId = `PT-${1000 + patients.length + 1}`;
    const today = new Date().toISOString().split('T')[0];
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      registeredDate: today,
      teeth: {},
    };
    setPatients(prev => [newPatient, ...prev]);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const updateToothState = (
    patientId: string,
    toothNumber: number,
    condition: ToothCondition,
    notes?: string
  ) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        const currentTeeth = { ...p.teeth };
        currentTeeth[toothNumber] = {
          toothNumber,
          condition,
          notes: notes !== undefined ? notes : currentTeeth[toothNumber]?.notes,
          updatedAt: new Date().toISOString().split('T')[0],
        };
        return { ...p, teeth: currentTeeth };
      })
    );
  };

  const addTreatment = (treatmentData: Omit<TreatmentRecord, 'id'>) => {
    const newId = `TR-${treatments.length + 101}`;
    const newTreatment: TreatmentRecord = { ...treatmentData, id: newId };
    setTreatments(prev => [newTreatment, ...prev]);
  };

  // Appointment Actions
  const addAppointment = (apptData: Omit<Appointment, 'id'>) => {
    const newId = `APT-${appointments.length + 201}`;
    const newAppt: Appointment = { ...apptData, id: newId };
    setAppointments(prev => [newAppt, ...prev]);
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, status } : a))
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // Invoices & Payments
  const addInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    const newId = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
    const newInvoice: Invoice = { ...invoiceData, id: newId };
    setInvoices(prev => [newInvoice, ...prev]);

    // Record initial income if paid > 0
    if (newInvoice.paid > 0) {
      addFinancialRecord({
        date: newInvoice.date,
        type: 'income',
        category: 'treatment_fee',
        title: `ទូទាត់វិក្កយបត្រ #${newInvoice.id} (${newInvoice.patientName})`,
        amount: newInvoice.paid,
        paymentMethod: newInvoice.paymentMethod,
        refInvoiceId: newInvoice.id,
        recordedBy: role === 'admin' ? 'រដ្ឋបាល' : role === 'accountant' ? 'គណនេយ្យ' : 'អ្នកលក់',
        notes: newInvoice.notes,
      });
    }

    return newInvoice;
  };

  const recordPayment = (
    invoiceId: string,
    amount: number,
    method: Invoice['paymentMethod'],
    notes?: string
  ) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = Math.min(inv.total, inv.paid + amount);
        const newBalance = Math.max(0, inv.total - newPaid);
        const newStatus: Invoice['status'] =
          newBalance === 0 ? 'paid' : newPaid > 0 ? 'partial' : 'unpaid';

        return {
          ...inv,
          paid: newPaid,
          balance: newBalance,
          status: newStatus,
          paymentMethod: method,
          notes: notes ? `${inv.notes ? inv.notes + ' | ' : ''}${notes}` : inv.notes,
        };
      })
    );

    // Also add to financial records
    const currentInv = invoices.find(i => i.id === invoiceId);
    if (currentInv) {
      addFinancialRecord({
        date: new Date().toISOString().split('T')[0],
        type: 'income',
        category: 'treatment_fee',
        title: `បង់បន្ថែមវិក្កយបត្រ #${invoiceId} (${currentInv.patientName})`,
        amount,
        paymentMethod: method,
        refInvoiceId: invoiceId,
        recordedBy: role === 'admin' ? 'រដ្ឋបាល' : role === 'accountant' ? 'គណនេយ្យ' : 'អ្នកលក់',
        notes: notes || 'បង់បង្គ្រប់សមតុល្យជំពាក់',
      });
    }
  };

  // Installments (Requirement 4 & 12)
  const createInstallmentPlan = ({
    patientId,
    patientName,
    patientPhone,
    treatmentDescription,
    totalCost,
    deposit,
    months,
    startDate,
  }: {
    patientId: string;
    patientName: string;
    patientPhone: string;
    treatmentDescription: string;
    totalCost: number;
    deposit: number;
    months: number;
    startDate?: string;
  }) => {
    const start = startDate || new Date().toISOString().split('T')[0];
    const { remainingBalance, monthlyPayment, stages } = calculateInstallmentSchedule(
      totalCost,
      deposit,
      months,
      start
    );

    const newPlanId = `INS-${new Date().getFullYear()}-${String(installmentPlans.length + 1).padStart(3, '0')}`;
    const newPlan: InstallmentPlan = {
      id: newPlanId,
      patientId,
      patientName,
      patientPhone,
      treatmentDescription,
      totalCost,
      deposit,
      remainingBalance,
      months,
      monthlyPayment,
      startDate: start,
      stages,
      status: 'active',
    };

    setInstallmentPlans(prev => [newPlan, ...prev]);

    // Also create corresponding invoice
    const invItems = [
      {
        id: `item-${Date.now()}-1`,
        description: `${treatmentDescription} (គម្រោងរំលោះ ${months} ខែ)`,
        qty: 1,
        unitPrice: totalCost,
        total: totalCost,
      },
    ];

    addInvoice({
      patientId,
      patientName,
      patientPhone,
      date: start,
      items: invItems,
      subtotal: totalCost,
      discount: 0,
      total: totalCost,
      paid: deposit,
      balance: remainingBalance,
      status: remainingBalance === 0 ? 'paid' : 'partial',
      paymentMethod: 'installment',
      doctorName: 'ទន្តបណ្ឌិតឯកទេស',
      notes: `កក់ប្រាក់ $${deposit} + រំលោះ $${monthlyPayment}/ខែ (${months} ខែ)`,
    });

    return newPlan;
  };

  const payInstallmentStage = (planId: string, stageNumber: number, paymentMethod: string = 'KHQR') => {
    setInstallmentPlans(prev =>
      prev.map(plan => {
        if (plan.id !== planId) return plan;
        let paidAmountNow = 0;
        const updatedStages = plan.stages.map(st => {
          if (st.stageNumber === stageNumber && st.status !== 'paid') {
            paidAmountNow = st.amount;
            return {
              ...st,
              paidAmount: st.amount,
              status: 'paid' as const,
              paidDate: new Date().toISOString().split('T')[0],
              notes: `បានបង់តាម ${paymentMethod}`,
            };
          }
          return st;
        });

        const newRemaining = Math.max(0, plan.remainingBalance - paidAmountNow);
        const allPaid = updatedStages.every(s => s.status === 'paid');

        return {
          ...plan,
          remainingBalance: newRemaining,
          status: allPaid ? ('completed' as const) : ('active' as const),
          stages: updatedStages,
        };
      })
    );

    const targetPlan = installmentPlans.find(p => p.id === planId);
    if (targetPlan) {
      const stage = targetPlan.stages.find(s => s.stageNumber === stageNumber);
      const stageAmt = stage ? stage.amount : targetPlan.monthlyPayment;
      addFinancialRecord({
        date: new Date().toISOString().split('T')[0],
        type: 'income',
        category: 'installment_collection',
        title: `ប្រមូលរំលោះដំណាក់កាលទី ${stageNumber} #${planId} (${targetPlan.patientName})`,
        amount: stageAmt,
        paymentMethod,
        recordedBy: role === 'admin' ? 'រដ្ឋបាល' : role === 'accountant' ? 'គណនេយ្យ' : 'អ្នកលក់',
        notes: `រំលោះ ${targetPlan.treatmentDescription}`,
      });
    }
  };

  // Prescriptions
  const addPrescription = (rxData: Omit<Prescription, 'id'>) => {
    const newId = `RX-${new Date().getFullYear()}-${String(prescriptions.length + 1).padStart(3, '0')}`;
    const newRx: Prescription = { ...rxData, id: newId };
    setPrescriptions(prev => [newRx, ...prev]);
    return newRx;
  };

  const deletePrescription = (id: string) => {
    setPrescriptions(prev => prev.filter(rx => rx.id !== id));
  };

  // Stock
  const addStockItem = (itemData: Omit<StockItem, 'id'>) => {
    const newId = `STK-${String(stockItems.length + 1).padStart(2, '0')}`;
    const newItem: StockItem = { ...itemData, id: newId };
    setStockItems(prev => [newItem, ...prev]);
  };

  const adjustStockQuantity = (id: string, change: number, reason?: string) => {
    setStockItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const newQty = Math.max(0, item.quantity + change);
        return {
          ...item,
          quantity: newQty,
          lastRestocked: change > 0 ? new Date().toISOString().split('T')[0] : item.lastRestocked,
        };
      })
    );
  };

  const deleteStockItem = (id: string) => {
    setStockItems(prev => prev.filter(s => s.id !== id));
  };

  // Finance
  const addFinancialRecord = (recData: Omit<FinancialRecord, 'id'>) => {
    const newId = `FIN-${String(financialRecords.length + 1).padStart(3, '0')}`;
    const newRecord: FinancialRecord = { ...recData, id: newId };
    setFinancialRecords(prev => [newRecord, ...prev]);
  };

  const deleteFinancialRecord = (id: string) => {
    setFinancialRecords(prev => prev.filter(f => f.id !== id));
  };

  // Dividends (Requirement 8)
  const createDividendDistribution = (data: Omit<DividendDistribution, 'id' | 'createdDate'>) => {
    const newId = `DIV-${new Date().getFullYear()}-${String(dividends.length + 1).padStart(2, '0')}`;
    const newDiv: DividendDistribution = {
      ...data,
      id: newId,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setDividends(prev => [newDiv, ...prev]);
  };

  const markBeneficiaryPaid = (dividendId: string, beneficiaryId: string) => {
    setDividends(prev =>
      prev.map(div => {
        if (div.id !== dividendId) return div;
        return {
          ...div,
          beneficiaries: div.beneficiaries.map(ben =>
            ben.id === beneficiaryId ? { ...ben, paidStatus: 'paid' as const } : ben
          ),
        };
      })
    );
  };

  // Requirement 5: Debt Report Isolation (Filter & show ONLY patients with debt)
  const getPatientDebts = () => {
    const debtorMap = new Map<string, { totalBilled: number; totalPaid: number; debtAmount: number; invoices: Invoice[]; lastDate: string }>();

    invoices.forEach(inv => {
      if (inv.balance > 0) {
        const existing = debtorMap.get(inv.patientId) || {
          totalBilled: 0,
          totalPaid: 0,
          debtAmount: 0,
          invoices: [],
          lastDate: inv.date,
        };
        existing.totalBilled += inv.total;
        existing.totalPaid += inv.paid;
        existing.debtAmount += inv.balance;
        existing.invoices.push(inv);
        if (new Date(inv.date) > new Date(existing.lastDate)) {
          existing.lastDate = inv.date;
        }
        debtorMap.set(inv.patientId, existing);
      }
    });

    const result = [];
    for (const [patientId, debtInfo] of debtorMap.entries()) {
      const patient = patients.find(p => p.id === patientId);
      if (patient && debtInfo.debtAmount > 0) {
        // Look up if patient has an active installment with next due date
        const plan = installmentPlans.find(pl => pl.patientId === patientId && pl.status !== 'completed');
        const nextPendingStage = plan?.stages.find(s => s.status === 'pending' || s.status === 'overdue');

        result.push({
          patient,
          invoices: debtInfo.invoices,
          totalBilled: debtInfo.totalBilled,
          totalPaid: debtInfo.totalPaid,
          debtAmount: debtInfo.debtAmount,
          lastInvoiceDate: debtInfo.lastDate,
          nextDueDate: nextPendingStage?.dueDate,
        });
      }
    }

    return result.sort((a, b) => b.debtAmount - a.debtAmount);
  };

  // Computed summary metrics
  const totalDebtSum = invoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);
  const lowStockCount = stockItems.filter(s => s.quantity <= s.minAlertQty).length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointmentsCount = appointments.filter(a => a.date === todayStr || a.date === '2026-10-05').length;

  const totalRevenueSum = financialRecords
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalExpensesSum = financialRecords
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + f.amount, 0);

  const netProfitSum = totalRevenueSum - totalExpensesSum;

  return (
    <DentalContext.Provider
      value={{
        role,
        setRole,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        updateToothState,
        treatments,
        addTreatment,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        invoices,
        addInvoice,
        recordPayment,
        installmentPlans,
        createInstallmentPlan,
        payInstallmentStage,
        prescriptions,
        addPrescription,
        deletePrescription,
        stockItems,
        addStockItem,
        adjustStockQuantity,
        deleteStockItem,
        financialRecords,
        addFinancialRecord,
        deleteFinancialRecord,
        dividends,
        createDividendDistribution,
        markBeneficiaryPaid,
        getPatientDebts,
        totalDebtSum,
        lowStockCount,
        todayAppointmentsCount,
        totalRevenueSum,
        totalExpensesSum,
        netProfitSum,
        resetToSampleData,
      }}
    >
      {children}
    </DentalContext.Provider>
  );
};

export const useDental = () => {
  const context = useContext(DentalContext);
  if (!context) {
    throw new Error('useDental must be used within a DentalProvider');
  }
  return context;
};
