/**
 * Helper utilities for Khmer dental clinic management
 */

export const EXCHANGE_RATE_USD_KHR = 4100;

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

export function formatKHR(amountUSD: number): string {
  const khr = Math.round((amountUSD || 0) * EXCHANGE_RATE_USD_KHR);
  return new Intl.NumberFormat('km-KH').format(khr) + ' ៛';
}

export function formatBothCurrency(amountUSD: number): string {
  return `${formatUSD(amountUSD)} (${formatKHR(amountUSD)})`;
}

export const KHMER_MONTHS = [
  'មករា',
  'កុម្ភៈ',
  'មីនា',
  'មេសា',
  'ឧសភា',
  'មិថុនា',
  'កក្កដា',
  'សីហា',
  'កញ្ញា',
  'តុលា',
  'វិច្ឆិកា',
  'ធ្នូ',
];

export function formatKhmerDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = date.getDate();
  const month = KHMER_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function calculateInstallmentSchedule(
  totalCost: number,
  deposit: number,
  months: number,
  startDateStr: string = new Date().toISOString().split('T')[0]
) {
  const remaining = Math.max(0, totalCost - deposit);
  const duration = Math.max(1, months);
  const baseMonthly = Math.floor((remaining / duration) * 100) / 100;
  // Calculate difference to round off cleanly on final month
  const difference = Math.round((remaining - baseMonthly * duration) * 100) / 100;

  const startDate = new Date(startDateStr);
  const stages = [];

  for (let i = 1; i <= duration; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    // If it's the last month, absorb any rounding difference cents
    const amount = i === duration ? Math.round((baseMonthly + difference) * 100) / 100 : baseMonthly;

    stages.push({
      stageNumber: i,
      dueDate: dueDate.toISOString().split('T')[0],
      amount,
      paidAmount: 0,
      status: 'pending' as const,
    });
  }

  return {
    remainingBalance: remaining,
    monthlyPayment: baseMonthly,
    stages,
  };
}

/**
 * Requirement 13: Generate clean, professional Telegram share text & URL
 */
export function generateTelegramShareUrl(invoice: {
  id: string;
  patientName: string;
  patientPhone: string;
  date: string;
  items: { description: string; qty: number; unitPrice: number; total: number }[];
  total: number;
  paid: number;
  balance: number;
  doctorName?: string;
  nextDueDate?: string;
}): { shareUrl: string; directTelegramUrl?: string; messageText: string } {
  const itemsText = invoice.items
    .map((item, idx) => `  ${idx + 1}. ${item.description} (x${item.qty}) : $${item.total.toFixed(2)}`)
    .join('\n');

  const messageText = `🦷 គ្លីនិកទន្តសាស្ត្រ DENTCARE PRO
📋 វិក្កយបត្រ / បង្កាន់ដៃបង់ប្រាក់
━━━━━━━━━━━━━━━━━━
លេខវិក្កយបត្រ៖ #${invoice.id}
កាលបរិច្ឆេទ៖ ${formatKhmerDate(invoice.date)}
អ្នកជំងឺ៖ ${invoice.patientName}
ទូរស័ព្ទ៖ ${invoice.patientPhone}
${invoice.doctorName ? `ទន្តបណ្ឌិតព្យាបាល៖ ${invoice.doctorName}\n` : ''}
សេវាកម្មព្យាបាល៖
${itemsText}
━━━━━━━━━━━━━━━━━━
💰 តម្លៃសរុប (Total)៖ $${invoice.total.toFixed(2)} (${formatKHR(invoice.total)})
💵 បានបង់ប្រាក់ (Paid)៖ $${invoice.paid.toFixed(2)}
⏳ នៅខ្វះ/ជំពាក់ (Balance)៖ $${invoice.balance.toFixed(2)}
${invoice.nextDueDate ? `📅 ថ្ងៃកំណត់បង់បន្ទាប់៖ ${formatKhmerDate(invoice.nextDueDate)}\n` : ''}
🙏 សូមអរគុណលោកអ្នកដែលបានជឿទុកចិត្តលើគ្លីនិកយើងខ្ញុំ!
📞 ទំនាក់ទំនង៖ 012 345 678 / 098 765 432
📍 រាជធានីភ្នំពេញ`;

  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(messageText)}`;

  // Direct patient telegram if phone number is available
  let directTelegramUrl = undefined;
  if (invoice.patientPhone) {
    const cleanPhone = invoice.patientPhone.replace(/[^0-9]/g, '');
    const internationalPhone = cleanPhone.startsWith('0') ? '855' + cleanPhone.slice(1) : cleanPhone;
    directTelegramUrl = `https://t.me/+${internationalPhone}`;
  }

  return {
    shareUrl,
    directTelegramUrl,
    messageText,
  };
}

/**
 * Generate Telegram Debt Reminder Message (Requirement 5)
 */
export function generateDebtReminderTelegram(patient: {
  nameKhmer: string;
  phone: string;
  totalDebt: number;
  lastVisit?: string;
  nextDueDate?: string;
}): { shareUrl: string; directTelegramUrl?: string; messageText: string } {
  const messageText = `សួស្តីបង ${patient.nameKhmer},
គ្លីនិកទន្តសាស្ត្រ DentCare Pro សូមជម្រាបរំលឹកអំពីសមតុល្យបង់ប្រាក់ព្យាបាលធ្មេញ៖
━━━━━━━━━━━━━━━━━━
👤 អ្នកជំងឺ៖ ${patient.nameKhmer}
💰 ចំនួនទឹកប្រាក់នៅខ្វះ៖ $${patient.totalDebt.toFixed(2)} (${formatKHR(patient.totalDebt)})
${patient.nextDueDate ? `📅 ថ្ងៃកំណត់បង់៖ ${formatKhmerDate(patient.nextDueDate)}\n` : ''}
🏦 លោកអ្នកអាចធ្វើការផ្ទេរតាម ABA KHQR ឬបង់ផ្ទាល់នៅគ្លីនិក។
សូមអរគុណបងសម្រាប់ការសហការ!
📞 សាកសួរព័ត៌មានបន្ថែម៖ 012 345 678`;

  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(messageText)}`;

  let directTelegramUrl = undefined;
  if (patient.phone) {
    const cleanPhone = patient.phone.replace(/[^0-9]/g, '');
    const internationalPhone = cleanPhone.startsWith('0') ? '855' + cleanPhone.slice(1) : cleanPhone;
    directTelegramUrl = `https://t.me/+${internationalPhone}`;
  }

  return { shareUrl, directTelegramUrl, messageText };
}
