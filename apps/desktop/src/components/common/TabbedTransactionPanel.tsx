import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '@/stores/ui.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Tag,
  ArrowDownLeft,
  Truck,
  ArrowUpRight,
  Zap,
  PieChart,
  ArrowRightLeft,
  CheckCircle2,
  BookOpen,
  DollarSign,
  X,
} from 'lucide-react';
import { formatCurrency } from '@cari-finance/domain';

export const TabbedTransactionPanel: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { defaultTransactionType } = useUIStore();

  const todayStr = new Date().toISOString().split('T')[0];

  const [activeTab, setActiveTab] = useState<string>(defaultTransactionType || 'sale');
  const [date, setDate] = useState(todayStr);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [entityId, setEntityId] = useState('');
  const [targetEntityId, setTargetEntityId] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Fetch Entity Lists for Select dropdowns
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => window.api.customers.list(),
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => window.api.suppliers.list(),
  });

  const { data: cashDesks = [] } = useQuery({
    queryKey: ['cash'],
    queryFn: () => window.api.cash.list(),
  });

  const { data: banks = [] } = useQuery({
    queryKey: ['banks'],
    queryFn: () => window.api.banks.list(),
  });

  const { data: partners = [] } = useQuery({
    queryKey: ['partners'],
    queryFn: () => window.api.partners.list(),
  });

  const cashAndBankOptions = [...cashDesks, ...banks];

  const selectedEntityObj =
    customers.find((c: any) => c.id === entityId) ||
    suppliers.find((s: any) => s.id === entityId) ||
    partners.find((p: any) => p.id === entityId) ||
    cashAndBankOptions.find((cb: any) => cb.id === entityId);

  const selectedTargetObj = cashAndBankOptions.find((cb: any) => cb.id === targetEntityId);

  const selectedEntityName = selectedEntityObj ? `${selectedEntityObj.name} (${selectedEntityObj.accountCode || ''})` : 'Seçilmedi';
  const selectedTargetName = selectedTargetObj ? `${selectedTargetObj.name} (${selectedTargetObj.accountCode || ''})` : 'Hesap';

  const createMutation = useMutation({
    mutationFn: (payload: any) => window.api.transactions.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['cash'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      setDescription('');
      setAmount('');
      setEntityId('');
      setTargetEntityId('');
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
      if (onClose) onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      alert('Lütfen geçerli bir tutar giriniz.');
      return;
    }
    if (!description.trim()) {
      alert('Lütfen açıklama yazınız.');
      return;
    }

    createMutation.mutate({
      type: activeTab,
      date,
      description,
      amount: numAmount,
      entityId,
      targetEntityId,
    });
  };

  // Helper to determine Double-Entry Accounts for live preview
  const getAccountingPreview = () => {
    const amt = Number(amount) || 0;
    switch (activeTab) {
      case 'sale':
        return {
          debitCode: selectedEntityObj?.accountCode || '120.001',
          debitName: `Müşteri Cari Hesabı (${selectedEntityName})`,
          creditCode: '600.01',
          creditName: 'Yurtiçi Satış Gelirleri',
          amount: amt,
        };
      case 'customer_payment':
        return {
          debitCode: selectedTargetObj?.accountCode || '100.001',
          debitName: `Kasa / Banka Hesabı (${selectedTargetName})`,
          creditCode: selectedEntityObj?.accountCode || '120.001',
          creditName: `Müşteri Cari Hesabı (${selectedEntityName})`,
          amount: amt,
        };
      case 'purchase':
        return {
          debitCode: '153.01',
          debitName: 'Ticari Mallar / Depo Stok',
          creditCode: selectedEntityObj?.accountCode || '320.001',
          creditName: `Tedarikçi Cari Hesabı (${selectedEntityName})`,
          amount: amt,
        };
      case 'supplier_payment':
        return {
          debitCode: selectedEntityObj?.accountCode || '320.001',
          debitName: `Tedarikçi Cari Hesabı (${selectedEntityName})`,
          creditCode: selectedTargetObj?.accountCode || '100.001',
          creditName: `Kasa / Banka Hesabı (${selectedTargetName})`,
          amount: amt,
        };
      case 'expense':
        return {
          debitCode: '770.01',
          debitName: 'Genel Yönetim Giderleri',
          creditCode: selectedTargetObj?.accountCode || '100.001',
          creditName: `Kasa / Banka Hesabı (${selectedTargetName})`,
          amount: amt,
        };
      case 'partner_draw':
        return {
          debitCode: selectedEntityObj?.accountCode || '500.001',
          debitName: `Ortak Cari Hesabı (${selectedEntityName})`,
          creditCode: selectedTargetObj?.accountCode || '100.001',
          creditName: `Kasa / Banka Hesabı (${selectedTargetName})`,
          amount: amt,
        };
      case 'transfer':
        return {
          debitCode: selectedTargetObj?.accountCode || '102.001',
          debitName: `Hedef Hesap (${selectedTargetName})`,
          creditCode: selectedEntityObj?.accountCode || '100.001',
          creditName: `Kaynak Hesap (${selectedEntityName})`,
          amount: amt,
        };
      default:
        return null;
    }
  };

  const preview = getAccountingPreview();

  const tabs = [
    { id: 'sale', label: 'Satış Fişi', icon: Tag, color: 'text-sky-500' },
    { id: 'customer_payment', label: 'Tahsilat Fişi', icon: ArrowDownLeft, color: 'text-emerald-500' },
    { id: 'purchase', label: 'Alım Fişi', icon: Truck, color: 'text-purple-500' },
    { id: 'supplier_payment', label: 'Ödeme Fişi', icon: ArrowUpRight, color: 'text-rose-500' },
    { id: 'expense', label: 'Gider Fişi', icon: Zap, color: 'text-amber-500' },
    { id: 'partner_draw', label: 'Ortak Hareketi', icon: PieChart, color: 'text-cyan-500' },
    { id: 'transfer', label: 'Virman Transfer', icon: ArrowRightLeft, color: 'text-indigo-500' },
  ];

  return (
    <Card className="border-sky-500/40 bg-white dark:bg-slate-900 shadow-lg transition-all">
      <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-500" />
            <CardTitle className="text-base font-bold">Sekmeli Hızlı İşlem & Kayıt Paneli</CardTitle>
            {successMsg && (
              <Badge variant="success" className="gap-1 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" /> İşlem Başarıyla Kaydedildi!
              </Badge>
            )}
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Tab Selection Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setEntityId('');
                  setTargetEntityId('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isActive
                    ? 'bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Primary Entity Selector */}
            {activeTab === 'sale' || activeTab === 'customer_payment' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Müşteri Cari Hesabı (120)</label>
                <Select value={entityId} onValueChange={setEntityId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Müşteri seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c: any) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.name} ({c.accountCode || '120.001'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {activeTab === 'purchase' || activeTab === 'supplier_payment' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Tedarikçi Cari Hesabı (320)</label>
                <Select value={entityId} onValueChange={setEntityId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Satıcı seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s: any) => (
                      <SelectItem key={s.id} value={s.id} className="text-xs">
                        {s.name} ({s.accountCode || '320.001'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {activeTab === 'partner_draw' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Ortak Cari Hesabı (500)</label>
                <Select value={entityId} onValueChange={setEntityId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Ortak seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.map((p: any) => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">
                        {p.name} ({p.accountCode || '500.001'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {activeTab === 'transfer' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Kaynak Kasa / Banka</label>
                <Select value={entityId} onValueChange={setEntityId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Kaynak hesap seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {cashAndBankOptions.map((e: any) => (
                      <SelectItem key={e.id} value={e.id} className="text-xs">
                        {e.name} ({e.accountCode || '100.001'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {/* Target Account (Cash/Bank) */}
            {activeTab === 'customer_payment' ||
            activeTab === 'supplier_payment' ||
            activeTab === 'expense' ||
            activeTab === 'partner_draw' ||
            activeTab === 'transfer' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  {activeTab === 'transfer' ? 'Hedef Kasa / Banka' : 'Kasa / Banka Hesabı'}
                </label>
                <Select value={targetEntityId} onValueChange={setTargetEntityId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Kasa / Banka seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {cashAndBankOptions.map((e: any) => (
                      <SelectItem key={e.id} value={e.id} className="text-xs">
                        {e.name} ({e.accountCode || '100.001'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {/* Date */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">İşlem Tarihi</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9 text-xs" />
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Tutar (TL)</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="h-9 text-xs font-mono font-bold text-sky-500 pl-7"
                />
                <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">İşlem Açıklaması</label>
              <Input
                placeholder="Örn: 3 adet ahşap masa teslimat satışı..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <Button type="submit" variant="default" disabled={createMutation.isPending} className="h-9 text-xs gap-2 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
              {createMutation.isPending ? 'Kaydediliyor...' : 'İşlemi Kaydet'}
            </Button>
          </div>

          {/* Live Accounting Preview */}
          {preview && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-500" />
                  Tekdüzen Yevmiye Fişi Önizlemesi:
                </span>
                <span className="font-mono text-sky-500">{formatCurrency(preview.amount)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {/* Borç Satırı */}
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-between">
                  <div>
                    <Badge variant="danger" className="text-[10px] mr-1.5">BORÇ ({preview.debitCode})</Badge>
                    <span className="text-[11px] font-semibold">{preview.debitName}</span>
                  </div>
                  <span className="font-bold">{formatCurrency(preview.amount)}</span>
                </div>

                {/* Alacak Satırı */}
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                  <div>
                    <Badge variant="success" className="text-[10px] mr-1.5">ALACAK ({preview.creditCode})</Badge>
                    <span className="text-[11px] font-semibold">{preview.creditName}</span>
                  </div>
                  <span className="font-bold">{formatCurrency(preview.amount)}</span>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
