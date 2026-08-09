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
  DollarSign,
  X,
  Sparkles,
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

  const selectedEntityName = selectedEntityObj ? selectedEntityObj.name : 'Seçilmedi';
  const selectedTargetName = selectedTargetObj ? selectedTargetObj.name : 'Kasa/Banka';

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

  const tabs = [
    { id: 'sale', label: 'Satış Yap', icon: Tag, color: 'text-sky-500' },
    { id: 'customer_payment', label: 'Tahsilat Al', icon: ArrowDownLeft, color: 'text-emerald-500' },
    { id: 'purchase', label: 'Alış / Satınalma', icon: Truck, color: 'text-purple-500' },
    { id: 'supplier_payment', label: 'Ödeme Yap', icon: ArrowUpRight, color: 'text-rose-500' },
    { id: 'expense', label: 'Gider Kaydı', icon: Zap, color: 'text-amber-500' },
    { id: 'partner_draw', label: 'Ortak Para Çekme', icon: PieChart, color: 'text-cyan-500' },
    { id: 'partner_deposit', label: 'Ortak Para Yatırma', icon: Sparkles, color: 'text-emerald-500' },
    { id: 'transfer', label: 'Para Transferi', icon: ArrowRightLeft, color: 'text-indigo-500' },
  ];

  return (
    <Card className="border-sky-500/40 bg-white dark:bg-slate-900 shadow-lg transition-all">
      <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-500" />
            <CardTitle className="text-base font-bold">Hızlı Finans İşlem Paneli</CardTitle>
            {successMsg && (
              <Badge variant="success" className="gap-1 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" /> İşlem Kaydedildi!
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
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Müşteri Seçin</label>
                <Select value={entityId} onValueChange={setEntityId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Müşteri seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c: any) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.name} ({c.accountCode || '120'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {activeTab === 'purchase' || activeTab === 'supplier_payment' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Tedarikçi Seçin</label>
                <Select value={entityId} onValueChange={setEntityId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Satıcı seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s: any) => (
                      <SelectItem key={s.id} value={s.id} className="text-xs">
                        {s.name} ({s.accountCode || '320'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {activeTab === 'partner_draw' || activeTab === 'partner_deposit' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Şirket Ortağı Seçin</label>
                <Select value={entityId} onValueChange={setEntityId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Ortak seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.map((p: any) => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">
                        {p.name}
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
                        {e.name}
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
            activeTab === 'partner_deposit' ||
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
                        {e.name}
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
                placeholder="Örn: Mutfak dolabı satışı, Elektrik faturası ödemesi vb."
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
        </form>
      </CardContent>
    </Card>
  );
};
