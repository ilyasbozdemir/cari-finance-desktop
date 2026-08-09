import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Wallet,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatCurrency } from '@/domain/money';
import { useUIStore } from '@/stores/ui.store';

export const CashPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { openQuickTransaction } = useUIStore();

  const [selectedCashId, setSelectedCashId] = useState<string | null>(null);
  const [addCashOpen, setAddCashOpen] = useState(false);
  const [cashName, setCashName] = useState('');

  const { data: cashDesks = [], isLoading } = useQuery({
    queryKey: ['cash'],
    queryFn: () => window.api.cash.list(),
  });

  const activeCashId = selectedCashId || (cashDesks.length > 0 ? cashDesks[0].id : null);

  const { data: movementsData } = useQuery({
    queryKey: ['cashMovements', activeCashId],
    queryFn: () => window.api.cash.getMovements(activeCashId!),
    enabled: !!activeCashId,
  });

  const createCashMutation = useMutation({
    mutationFn: (name: string) => window.api.cash.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash'] });
      setAddCashOpen(false);
      setCashName('');
    },
  });

  const handleCreateCash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashName.trim()) return;
    createCashMutation.mutate(cashName);
  };

  const currentDesk = cashDesks.find((c: any) => c.id === activeCashId);
  const movements = movementsData?.movements || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Wallet className="w-6 h-6 text-emerald-500" />
            Kasa Takibi (Nakit Gelir - Gider)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fiziksel TL kasalarınız, günlük nakit giriş-çıkışları ve anlık kasa bakiyeleri.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => openQuickTransaction('customer_payment')} variant="success" className="gap-2 text-xs">
            <ArrowDownRight className="w-4 h-4" />
            Kasaya Para Girişi
          </Button>
          <Button onClick={() => openQuickTransaction('expense')} variant="destructive" className="gap-2 text-xs">
            <ArrowUpRight className="w-4 h-4" />
            Kasadan Çıkış (Gider)
          </Button>
          <Button onClick={() => setAddCashOpen(true)} variant="outline" className="gap-2 text-xs">
            <Plus className="w-4 h-4" />
            Yeni Kasa Tanımla
          </Button>
        </div>
      </div>

      {/* Cash Desks Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cashDesks.map((desk: any) => {
          const isActive = desk.id === activeCashId;
          return (
            <Card
              key={desk.id}
              onClick={() => setSelectedCashId(desk.id)}
              className={`cursor-pointer transition-all ${
                isActive
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold">{desk.name}</CardTitle>
                <Badge variant={isActive ? 'success' : 'secondary'}>
                  {desk.code || '100 Kasa'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-black tracking-tight text-emerald-500">
                  {formatCurrency(desk.balance)}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <div>
                    <span>Giriş: </span>
                    <strong className="text-emerald-500 font-mono">{formatCurrency(desk.totalIncome)}</strong>
                  </div>
                  <div>
                    <span>Çıkış: </span>
                    <strong className="text-rose-500 font-mono">{formatCurrency(desk.totalExpense)}</strong>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cash Movements Ledger */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">
              {currentDesk?.name || 'Kasa'} - Hareket Dökümü
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Seçilen kasadaki tüm nakit giriş-çıkış fişleri</p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Belge Kodu</TableHead>
                <TableHead>İşlem Türü & Açıklama</TableHead>
                <TableHead className="text-right">Giren Para (Borç)</TableHead>
                <TableHead className="text-right">Çıkan Para (Alacak)</TableHead>
                <TableHead className="text-right">Anlık Bakiye</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                    Bu kasada henüz işlem bulunmamaktadır.
                  </TableCell>
                </TableRow>
              ) : (
                movements.map((mov: any) => (
                  <TableRow key={mov.id}>
                    <TableCell className="font-mono text-xs">{mov.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-[11px]">
                        {mov.docNumber || 'İŞLEM'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-800 dark:text-slate-200">{mov.description}</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-emerald-500">
                      {mov.income > 0 ? formatCurrency(mov.income) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-rose-500">
                      {mov.expense > 0 ? formatCurrency(mov.expense) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(mov.runningBalance)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Cash Desk Dialog */}
      <Dialog open={addCashOpen} onOpenChange={setAddCashOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Yeni Kasa Hesabı Tanımla</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateCash} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Kasa Adı *</label>
              <Input
                required
                placeholder="Örn: Fabrika İçi İkinci Kasa"
                value={cashName}
                onChange={(e) => setCashName(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setAddCashOpen(false)}>
                Vazgeç
              </Button>
              <Button type="submit" variant="default">
                Kasayı Oluştur
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
