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
import { CheckCircle2, ArrowRightLeft, DollarSign } from 'lucide-react';

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

  return (
    <Dialog open={quickTransactionOpen} onOpenChange={closeQuickTransaction}>
      <DialogContent className="max-w-xl bg-slate-900/95 border-slate-800 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">Yeni Finansal İşlem Ekle</DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Arka planda çift taraflı muhasebe fişi (Borç = Alacak) otomatik oluşturulur.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* İşlem Türü */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">İşlem Türü</label>
            <Select
              value={selectedType}
              onValueChange={(val) => {
                setValue('type', val as any);
                setValue('entityId', '');
                setValue('targetEntityId', '');
              }}
            >
              <SelectTrigger className="w-full bg-slate-950/80 border-slate-700/80">
                <SelectValue placeholder="İşlem türünü seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">🏷️ Müşteriye Satış (Alacaklandırma)</SelectItem>
                <SelectItem value="customer_payment">💵 Müşteriden Tahsilat (Kasa/Banka Giriş)</SelectItem>
                <SelectItem value="purchase">🚚 Tedarikçiden Alım (Satınalma)</SelectItem>
                <SelectItem value="supplier_payment">💳 Satıcıya Ödeme Yapma (Kasa/Banka Çıkış)</SelectItem>
                <SelectItem value="expense">⚡ Gider Kaydı (Elektrik, Nakliye, Yemek vs.)</SelectItem>
                <SelectItem value="partner_draw">👤 Ortak Para Çekme (Şirketten Çıkış)</SelectItem>
                <SelectItem value="partner_deposit">🏛️ Ortak Para Yatırma (Şirkete Giriş)</SelectItem>
                <SelectItem value="transfer">🔄 Virman / Transfer (Kasa-Banka Arası)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Entity selection based on transaction type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Entity */}
            {selectedType === 'sale' || selectedType === 'customer_payment' ? (
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Müşteri (Cari)</label>
                <Select
                  value={watch('entityId')}
                  onValueChange={(val) => setValue('entityId', val)}
                >
                  <SelectTrigger className="w-full bg-slate-950/80 border-slate-700/80">
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
                {errors.entityId && <p className="text-xs text-rose-400 mt-1">{errors.entityId.message}</p>}
              </div>
            ) : null}

            {selectedType === 'purchase' || selectedType === 'supplier_payment' ? (
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Tedarikçi (Satıcı)</label>
                <Select
                  value={watch('entityId')}
                  onValueChange={(val) => setValue('entityId', val)}
                >
                  <SelectTrigger className="w-full bg-slate-950/80 border-slate-700/80">
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
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Şirket Ortağı</label>
                <Select
                  value={watch('entityId')}
                  onValueChange={(val) => setValue('entityId', val)}
                >
                  <SelectTrigger className="w-full bg-slate-950/80 border-slate-700/80">
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
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Kaynak Kasa/Banka</label>
                <Select
                  value={watch('entityId')}
                  onValueChange={(val) => setValue('entityId', val)}
                >
                  <SelectTrigger className="w-full bg-slate-950/80 border-slate-700/80">
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
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  {selectedType === 'transfer' ? 'Hedef Kasa/Banka' : 'Kasa / Banka Hesabı'}
                </label>
                <Select
                  value={watch('targetEntityId')}
                  onValueChange={(val) => setValue('targetEntityId', val)}
                >
                  <SelectTrigger className="w-full bg-slate-950/80 border-slate-700/80">
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
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">İşlem Tarihi</label>
              <Input
                type="date"
                {...register('date')}
                className="bg-slate-950/80 border-slate-700/80"
              />
              {errors.date && <p className="text-xs text-rose-400 mt-1">{errors.date.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Tutar (TL)</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  {...register('amount')}
                  className="bg-slate-950/80 border-slate-700/80 font-mono text-base font-bold text-sky-400 pl-8"
                />
                <DollarSign className="w-4 h-4 text-slate-500 absolute left-2.5 top-3" />
              </div>
              {errors.amount && <p className="text-xs text-rose-400 mt-1">{errors.amount.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">İşlem Açıklaması</label>
            <Input
              placeholder="Örn: 3 adet mutfak dolabı takımı siparişi..."
              {...register('description')}
              className="bg-slate-950/80 border-slate-700/80"
            />
            {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description.message}</p>}
          </div>

          {createMutation.isError && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              {(createMutation.error as Error).message}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
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
