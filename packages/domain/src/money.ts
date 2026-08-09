export function formatCurrency(amount: number): string {
  const rounded = Math.abs(amount || 0);
  const formatted = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);

  if (amount < 0) {
    return `-${formatted}`;
  }
  return formatted;
}

export function formatBalanceStatus(balance: number, type: 'customer' | 'supplier' | 'partner' | 'cash' | 'bank'): {
  text: string;
  badgeClass: string;
} {
  if (Math.abs(balance) < 0.01) {
    return { text: 'Bakiye Yok (0,00 ₺)', badgeClass: 'bg-slate-800 text-slate-400 border-slate-700' };
  }

  if (type === 'customer') {
    if (balance > 0) {
      return { text: 'Alacaklıyız (Müşteri Borçlu)', badgeClass: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60' };
    }
    return { text: 'Borçluyuz (Müşteri Alacaklı)', badgeClass: 'bg-rose-950/80 text-rose-400 border-rose-800/60' };
  }

  if (type === 'supplier') {
    if (balance > 0) {
      return { text: 'Borçluyuz (Tedarikçi Alacaklı)', badgeClass: 'bg-rose-950/80 text-rose-400 border-rose-800/60' };
    }
    return { text: 'Alacaklıyız (Tedarikçi Borçlu)', badgeClass: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60' };
  }

  if (type === 'partner') {
    if (balance > 0) {
      return { text: 'Ortak Alacaklı (Şirkete Verilecek)', badgeClass: 'bg-amber-950/80 text-amber-400 border-amber-800/60' };
    }
    return { text: 'Ortak Borçlu (Para Çekti)', badgeClass: 'bg-sky-950/80 text-sky-400 border-sky-800/60' };
  }

  if (balance >= 0) {
    return { text: 'Pozitif Bakiye', badgeClass: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60' };
  }
  return { text: 'Eksi Bakiye', badgeClass: 'bg-rose-950/80 text-rose-400 border-rose-800/60' };
}
