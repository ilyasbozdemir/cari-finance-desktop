import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '@/stores/ui.store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowRightLeft, DollarSign, BookOpen, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@cari-finance/domain';

const transactionSchema = z.object({
  type: z.enum([
    'sale',
    'customer_payment',
    'purchase',
    'supplier_payment',
    'partner_draw',
    'partner_deposit',
    'transfer',
    'expense',
  ]),
  date: z.string().min(1, 'Tarih seçilmelidir.'),
  description: z.string().min(2, 'En az 2 karakter açıklama giriniz.'),
  amount: z.preprocess((val) => Number(val), z.number().positive('Tutar 0\'dan büyük olmalıdır.')),
  entityId: z.string().optional(),
  targetEntityId: z.string().optional(),
  categoryId: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export const QuickTransactionDialog: React.FC = () => {
  const { quickTransactionOpen, closeQuickTransaction, defaultTransactionType } = useUIStore();
  const queryClient = useQueryClient();

  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: (defaultTransactionType as any) || 'sale',
      date: todayStr,
      description: '',
      amount: 0,
      entityId: '',
      targetEntityId: '',
      categoryId: '',
    },
  });

  const selectedType = watch('type');
  const amountVal = watch('amount') || 0;
  const selectedEntityId = watch('entityId');
  const selectedTargetEntityId = watch('targetEntityId');

  useEffect(() => {
    if (quickTransactionOpen) {
      reset({
        type: (defaultTransactionType as any) || 'sale',
        date: todayStr,
        description: '',
        amount: 0,
        entityId: '',
        targetEntityId: '',
        categoryId: '',
      });
    }
  }, [quickTransactionOpen, defaultTransactionType, reset, todayStr]);

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

  const selectedEntityName =
    customers.find((c: any) => c.id === selectedEntityId)?.name ||
    suppliers.find((s: any) => s.id === selectedEntityId)?.name ||
    partners.find((p: any) => p.id === selectedEntityId)?.name ||
    cashAndBankOptions.find((cb: any) => cb.id === selectedEntityId)?.name ||
    'Seçilmedi';

  const selectedTargetName =
    cashAndBankOptions.find((cb: any) => cb.id === selectedTargetEntityId)?.name || 'Kasa / Banka';

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
      closeQuickTransaction();
    },
  });

  const onSubmit = (values: TransactionFormValues) => {
    createMutation.mutate(values);
  };

  // Helper to determine Double-Entry Accounts for live preview
  const getAccountingPreview = () => {
    switch (selectedType) {
      case 'sale':
        return {
          debitCode: '120',
          debitName: `Müşteri Cari Hesabı (${selectedEntityName})`,
          creditCode: '600',
          creditName: 'Yurtiçi Satış Gelirleri',
        };
      case 'customer_payment':
        return {
          debitCode: '100 / 102',
          debitName: `Nakit Kasa / Banka (${selectedTargetName})`,
          creditCode: '120',
          creditName: `Müşteri Cari Hesabı (${selectedEntityName})`,
        };
      case 'purchase':
        return {
          debitCode: '153',
          debitName: 'Ticari Mallar / Stok Alımı',
          creditCode: '320',
          creditName: `Tedarikçi Cari Hesabı (${selectedEntityName})`,
        };
      case 'supplier_payment':
        return {
          debitCode: '320',
          debitName: `Tedarikçi Cari Hesabı (${selectedEntityName})`,
          creditCode: '100 / 102',
          creditName: `Nakit Kasa / Banka (${selectedTargetName})`,
        };
      case 'expense':
        return {
          debitCode: '770',
          debitName: 'Genel Yönetim Giderleri',
          creditCode: '100 / 102',
          creditName: `Nakit Kasa / Banka (${selectedTargetName})`,
        };
      case 'partner_draw':
        return {
          debitCode: '500',
          debitName: `Ortak Cari Hesabı Borç (${selectedEntityName})`,
          creditCode: '100 / 102',
          creditName: `Nakit Kasa / Banka (${selectedTargetName})`,
        };
      case 'partner_deposit':
        return {
          debitCode: '100 / 102',
          debitName: `Nakit Kasa / Banka (${selectedTargetName})`,
          creditCode: '500',
          creditName: `Ortak Cari Hesabı Alacak (${selectedEntityName})`,
        };
      case 'transfer':
        return {
          debitCode: '100 / 102',
          debitName: `Hedef Hesap (${selectedTargetName})`,
          creditCode: '100 / 102',
          creditName: `Kaynak Hesap (${selectedEntityName})`,
        };
    }
  };

  const preview = getAccountingPreview();

  return (
    <Dialog open={quickTransactionOpen} onOpenChange={closeQuickTransaction}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Yeni Finansal İşlem Fişi</DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Tekdüzen Hesap Planı kurallarıyla çift taraflı borç/alacak yevmiye maddesi oluşturulur.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* İşlem Türü */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">İşlem Türü</label>
            <Select
              value={selectedType}
              onValueChange={(val) => {
                setValue('type', val as any);
                setValue('entityId', '');
                setValue('targetEntityId', '');
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="İşlem türünü seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">🏷️ Müşteriye Vadeli Satış (120 Borç / 600 Alacak)</SelectItem>
                <SelectItem value="customer_payment">💵 Müşteriden Tahsilat Alınması (100 Borç / 120 Alacak)</SelectItem>
                <SelectItem value="purchase">🚚 Tedarikçiden Mal Alımı (153 Borç / 320 Alacak)</SelectItem>
                <SelectItem value="supplier_payment">💳 Satıcıya Ödeme Yapılması (320 Borç / 100 Alacak)</SelectItem>
                <SelectItem value="expense">⚡ Gider Kaydı (770 Borç / 100 Alacak)</SelectItem>
                <SelectItem value="partner_draw">👤 Ortak Para Çekme (500 Borç / 100 Alacak)</SelectItem>
                <SelectItem value="partner_deposit">🏛️ Ortak Para Yatırma (100 Borç / 500 Alacak)</SelectItem>
                <SelectItem value="transfer">🔄 Hesaplar Arası Virman (100/102 Çift Taraflı)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Entity selection based on transaction type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Entity */}
            {selectedType === 'sale' || selectedType === 'customer_payment' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Müşteri Cari Hesabı (120)</label>
                <Select
                  value={watch('entityId')}
                  onValueChange={(val) => setValue('entityId', val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Müşteri seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.balance > 0 ? `+${c.balance.toLocaleString('tr-TR')} ₺ Borçlu` : '0 ₺'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.entityId && <p className="text-xs text-rose-500 mt-1">{errors.entityId.message}</p>}
              </div>
            ) : null}

            {selectedType === 'purchase' || selectedType === 'supplier_payment' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Tedarikçi Cari Hesabı (320)</label>
                <Select
                  value={watch('entityId')}
                  onValueChange={(val) => setValue('entityId', val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Satıcı seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.balance > 0 ? `+${s.balance.toLocaleString('tr-TR')} ₺ Alacaklı` : '0 ₺'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {selectedType === 'partner_draw' || selectedType === 'partner_deposit' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Ortak Cari Hesabı (500)</label>
                <Select
                  value={watch('entityId')}
                  onValueChange={(val) => setValue('entityId', val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Ortak seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {selectedType === 'transfer' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Kaynak Kasa / Banka Hesabı</label>
                <Select
                  value={watch('entityId')}
                  onValueChange={(val) => setValue('entityId', val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Çıkış yapılacak hesap" />
                  </SelectTrigger>
                  <SelectContent>
                    {cashAndBankOptions.map((e: any) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {/* Target Account (Cash or Bank) */}
            {selectedType === 'customer_payment' ||
            selectedType === 'supplier_payment' ||
            selectedType === 'partner_draw' ||
            selectedType === 'partner_deposit' ||
            selectedType === 'transfer' ||
            selectedType === 'expense' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                  {selectedType === 'transfer' ? 'Hedef Kasa / Banka (100/102)' : 'Kasa / Banka Hesabı (100/102)'}
                </label>
                <Select
                  value={watch('targetEntityId')}
                  onValueChange={(val) => setValue('targetEntityId', val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Kasa veya Banka seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {cashAndBankOptions.map((e: any) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name} ({e.balance?.toLocaleString('tr-TR')} ₺)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          {/* Date & Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">İşlem Tarihi</label>
              <Input
                type="date"
                {...register('date')}
              />
              {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Tutar (TL)</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  {...register('amount')}
                  className="font-mono text-base font-bold text-sky-500 pl-8"
                />
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
              </div>
              {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">İşlem Açıklaması</label>
            <Input
              placeholder="Örn: 3 adet mutfak dolabı takımı sipariş satışı..."
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>}
          </div>

          {/* Canlı Tekdüzen Yevmiye Fişi Önizleme Kartı (Live Double-Entry Preview Card) */}
          {preview && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-500" />
                  Tekdüzen Yevmiye Fişi Önizlemesi:
                </span>
                <span className="font-mono text-sky-500">{formatCurrency(amountVal)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {/* Borç Satırı */}
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-between">
                  <div>
                    <Badge variant="danger" className="text-[10px] mr-1.5">BORÇ ({preview.debitCode})</Badge>
                    <span className="text-[11px] font-semibold">{preview.debitName}</span>
                  </div>
                  <span className="font-bold">{formatCurrency(amountVal)}</span>
                </div>

                {/* Alacak Satırı */}
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                  <div>
                    <Badge variant="success" className="text-[10px] mr-1.5">ALACAK ({preview.creditCode})</Badge>
                    <span className="text-[11px] font-semibold">{preview.creditName}</span>
                  </div>
                  <span className="font-bold">{formatCurrency(amountVal)}</span>
                </div>
              </div>
            </div>
          )}

          {createMutation.isError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
              {(createMutation.error as Error).message}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={closeQuickTransaction}
              className="px-5"
            >
              Vazgeç
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={createMutation.isPending}
              className="px-6 gap-2"
            >
              {createMutation.isPending ? (
                'Kaydediliyor...'
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  İşlemi Kaydet
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
