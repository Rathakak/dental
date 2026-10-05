export type UserRole = 'admin' | 'accountant' | 'cashier' | 'dentist';

export type ToothCondition =
  | 'healthy'
  | 'caries'
  | 'filled'
  | 'crown'
  | 'rct'
  | 'ortho'
  | 'missing'
  | 'implant'
  | 'extracted';

export interface ToothState {
  toothNumber: number;
  condition: ToothCondition;
  notes?: string;
  updatedAt?: string;
}

export interface Patient {
  id: string;
  nameKhmer: string;
  nameLatin: string;
  gender: 'female' | 'male' | 'other';
  age: number;
  dob?: string;
  phone: string;
  telegram?: string;
  address: string;
  medicalAlerts: string[];
  dentalAlerts: string[];
  registeredDate: string;
  notes: string;
  teeth: Record<number, ToothState>;
}

export interface TreatmentRecord {
  id: string;
  patientId: string;
  toothNumbers: number[];
  procedureName: string;
  doctorName: string;
  date: string;
  cost: number;
  status: 'planned' | 'in_progress' | 'completed';
  notes: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  date: string;
  time: string;
  procedure: string;
  chair: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  toothNumber?: number;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  balance: number; // Remaining debt
  status: 'paid' | 'partial' | 'unpaid';
  paymentMethod: 'cash' | 'khqr' | 'bank' | 'card' | 'installment';
  doctorName: string;
  notes: string;
}

export interface InstallmentStage {
  stageNumber: number;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  notes?: string;
}

export interface InstallmentPlan {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  treatmentDescription: string;
  totalCost: number;
  deposit: number;
  remainingBalance: number;
  months: number;
  monthlyPayment: number;
  startDate: string;
  stages: InstallmentStage[];
  status: 'active' | 'completed' | 'overdue';
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  instruction: string;
  quantity: string;
  durationDays: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  items: PrescriptionItem[];
  advice: string;
}

export interface StockItem {
  id: string;
  code: string;
  nameKhmer: string;
  nameEnglish: string;
  category: 'dental_materials' | 'anesthetics' | 'instruments' | 'ortho_supplies' | 'consumables';
  quantity: number;
  unit: string;
  minAlertQty: number;
  unitCost: number;
  supplier: string;
  lastRestocked: string;
}

export interface FinancialRecord {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category:
    | 'treatment_fee'
    | 'installment_collection'
    | 'stock_purchase'
    | 'dental_lab'
    | 'rent_utility'
    | 'doctor_salary'
    | 'equipment'
    | 'other';
  title: string;
  amount: number;
  paymentMethod: string;
  refInvoiceId?: string;
  recordedBy: string;
  notes: string;
}

export interface BeneficiaryShare {
  id: string;
  name: string;
  role: string;
  sharePercent: number;
  amount: number;
  paidStatus: 'paid' | 'pending';
}

export interface DividendDistribution {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  clinicReservePercent: number;
  clinicReserveAmount: number;
  distributableProfit: number;
  beneficiaries: BeneficiaryShare[];
  createdDate: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'patients'
  | 'appointments'
  | 'invoices'
  | 'installments'
  | 'debts'
  | 'prescriptions'
  | 'stock'
  | 'finance'
  | 'dividends'
  | 'calculator';
