import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRightLeft, Search, Plus, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatCurrency } from '@cari-finance/domain';
import { useUIStore } from '@/stores/ui.store';

export const TransactionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { openQuickTransaction } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => window.api.transactions.list({ limit: 200 }),
  });

  const cancelTransactionMutation = useMutation({
    mutationFn: (entryId: string) => window.api.transactions.cancel(entryId),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['cash'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      alert(`Ters Düzeltme Kaydı oluşturuldu: ${res.revDocNumber || 'TRS-001'}`);
    },
    onError: (err: Error) => {
      alert(err.message);
    },
  });

  const filteredTransactions = transactions.filter(
    (tx: any) =>
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.docNumber && tx.docNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.entryNumber && tx.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleReversal = (entryId: string, description: string) => {
    if (
      confirm(
        `DİKKAT! Tekdüzen muhasebe standartlarına göre silme yapılmaz.\n\n"${description}" işlemi için TERS DÜZELTME KAYDI oluşturulsun mu?`
      )
    ) {
      cancelTransactionMutation.mutate(entryId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <ArrowRightLeft className="w-6 h-6 text-sky-500" />
            Tüm Finansal İşlemler & Ters Düzeltme Fişleri
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Çift taraflı yevmiye kayıtları, resmi evrak numaraları ve kanuni ters kayıt geçmişi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => openQuickTransaction('sale')} variant="default" className="gap-2 text-xs font-semibold">
            <Plus className="w-4 h-4" />
            Yeni İşlem Gir
          </Button>
        </div>
      </div>

      {/* Audit Banner */}
      <Card className="border-sky-500/30 bg-sky-500/5 dark:bg-sky-950/20">
        <CardContent className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>
              <strong>VUK & TTK Muhasebe Kuralı:</strong> Yanlış veya hatalı işlemlerde fiziksel veri silinmez; geriye dönük izlenebilirlik için <strong>Ters Düzeltme Fişi (Reversing Entry)</strong> oluşturulur.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <Input
            placeholder="Evrak no, yevmiye no veya açıklama ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Toplam İşlem Adedi: <span className="text-sky-500 font-bold">{transactions.length}</span>
        </div>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Yevmiye Kayıtları & Fiş Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Evrak No / Yevmiye No</TableHead>
                <TableHead>İşlem Türü & Açıklama</TableHead>
                <TableHead className="text-right">Tutar (TL)</TableHead>
                <TableHead className="text-center">Durum / Fiş Tipi</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    Henüz işlem kaydı bulunmuyor.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((tx: any) => {
                  const isCancelled = tx.status === 'cancelled';
                  const isReversalDoc = tx.docNumber?.startsWith('TRS-');
                  return (
                    <TableRow key={tx.id} className={isCancelled ? 'opacity-60 bg-slate-100/50 dark:bg-slate-900/40' : ''}>
                      <TableCell className="font-mono text-xs">{tx.date}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-sky-500 text-xs">
                            {tx.docNumber || tx.entryNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{tx.entryNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">{tx.description}</span>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-slate-900 dark:text-white text-sm">
                        {formatCurrency(tx.totalAmount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={isReversalDoc ? 'warning' : isCancelled ? 'danger' : 'success'} className="text-[10px]">
                          {isReversalDoc ? 'Ters Düzeltme Kaydı' : isCancelled ? 'Ters Kaydı Oluşturuldu' : 'Aktif Yevmiye Fişi'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {!isCancelled && !isReversalDoc && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs gap-1.5 text-rose-500 border-rose-500/30 hover:bg-rose-500/10"
                            disabled={cancelTransactionMutation.isPending}
                            onClick={() => handleReversal(tx.id, tx.description)}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Ters Kayıt Oluştur
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
