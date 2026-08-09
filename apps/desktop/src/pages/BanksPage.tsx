import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Plus, ArrowRightLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatCurrency } from '@/domain/money';
import { useUIStore } from '@/stores/ui.store';

export const BanksPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { openQuickTransaction } = useUIStore();

  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [addBankOpen, setAddBankOpen] = useState(false);

  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const [branch, setBranch] = useState('');
  const [phone, setPhone] = useState('');

  const { data: banks = [] } = useQuery({
    queryKey: ['banks'],
    queryFn: () => window.api.banks.list(),
  });

  const activeBankId = selectedBankId || (banks.length > 0 ? banks[0].id : null);

  const { data: movementsData } = useQuery({
    queryKey: ['bankMovements', activeBankId],
    queryFn: () => window.api.banks.getMovements(activeBankId!),
    enabled: !!activeBankId,
  });

  const createBankMutation = useMutation({
    mutationFn: (payload: any) => window.api.banks.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      setAddBankOpen(false);
      setName('');
      setIban('');
      setBranch('');
      setPhone('');
    },
  });

  const handleCreateBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createBankMutation.mutate({ name, iban, branch, phone });
  };

  const currentBank = banks.find((b: any) => b.id === activeBankId);
  const movements = movementsData?.movements || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-sky-500" />
            Banka Hesapları & Virman
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Banka bakiyeleri, gelen/giden havaleler ve kasa-banka arası transferler.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => openQuickTransaction('transfer')} variant="default" className="gap-2 text-xs">
            <ArrowRightLeft className="w-4 h-4" />
            Kasa / Banka Virmanı
          </Button>
          <Button onClick={() => setAddBankOpen(true)} variant="outline" className="gap-2 text-xs">
            <Plus className="w-4 h-4" />
            Yeni Banka Hesabı
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banks.map((bank: any) => {
          const isActive = bank.id === activeBankId;
          return (
            <Card
              key={bank.id}
              onClick={() => setSelectedBankId(bank.id)}
              className={`cursor-pointer transition-all ${
                isActive
                  ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-md'
                  : 'hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold">{bank.name}</CardTitle>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{bank.address || 'Şube Belirtilmedi'}</p>
                </div>
                <Badge variant="default" className="font-mono text-[11px]">
                  {bank.accountCode || '102.001'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-black tracking-tight text-sky-500">
                  {formatCurrency(bank.balance)}
                </div>
                {bank.notes && (
                  <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400 truncate bg-slate-50 dark:bg-slate-950/60 p-1.5 rounded border border-slate-200 dark:border-slate-800">
                    IBAN: {bank.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">
            {currentBank?.name || 'Banka'} - Hesap Hareketleri ({currentBank?.accountCode || '102.001'})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Belge No</TableHead>
                <TableHead>Açıklama</TableHead>
                <TableHead className="text-right">Gelen Havale (Borç)</TableHead>
                <TableHead className="text-right">Giden Havale (Alacak)</TableHead>
                <TableHead className="text-right">Yürüyen Bakiye</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                    Bu banka hesabında henüz işlem yok.
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
                      {mov.incoming > 0 ? formatCurrency(mov.incoming) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-rose-500">
                      {mov.outgoing > 0 ? formatCurrency(mov.outgoing) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-sky-500">
                      {formatCurrency(mov.runningBalance)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={addBankOpen} onOpenChange={setAddBankOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Yeni Banka Hesabı Tanımla</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateBank} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Banka / Hesap Adı *</label>
              <Input
                required
                placeholder="Örn: Garanti BBVA Kurumsal"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">IBAN Numarası</label>
              <Input
                placeholder="TR99 0000 0000 0000 0000 0000 00"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Şube Adı</label>
              <Input placeholder="Organize Sanayi Şubesi" value={branch} onChange={(e) => setBranch(e.target.value)} />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setAddBankOpen(false)}>
                Vazgeç
              </Button>
              <Button type="submit" variant="default">
                Bankayı Kaydet
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
