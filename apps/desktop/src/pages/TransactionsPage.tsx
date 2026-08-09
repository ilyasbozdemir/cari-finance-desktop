import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRightLeft, Search, Plus, Ban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatCurrency } from '@/domain/money';
import { useUIStore } from '@/stores/ui.store';

export const TransactionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { openQuickTransaction } = useUIStore();

  const [searchTerm, setSearchTerm] = useState('');

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => window.api.transactions.list({ limit: 200 }),
  });

  const cancelMutation = useMutation({
    mutationFn: (entryId: string) => window.api.transactions.cancel(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['cash'] });
    },
  });

  const filteredTransactions = transactions.filter((tx: any) =>
    (tx.description && tx.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (tx.docNumber && tx.docNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ArrowRightLeft className="w-6 h-6 text-sky-400" />
            Tüm Finansal İşlemler
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sistemdeki tüm satış, alım, tahsilat, ödeme, virman ve gider hareketlerinin geçmişi.
          </p>
        </div>

        <Button onClick={() => openQuickTransaction('sale')} variant="default" className="gap-2">
          <Plus className="w-4 h-4" />
          Yeni İşlem Ekle
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <Input
            placeholder="Açıklama veya belge numarası ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-900/80 border-slate-800"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-white">İşlem Geçmişi Dökümü</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Belge No</TableHead>
                <TableHead>Fiş No</TableHead>
                <TableHead>Açıklama</TableHead>
                <TableHead className="text-right">Tutar</TableHead>
                <TableHead className="text-center">Durum</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    Kayıtlı işlem bulunamadı.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((tx: any) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-xs text-slate-300">{tx.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-[11px]">
                        {tx.docNumber || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-400">{tx.entryNumber}</TableCell>
                    <TableCell className="font-medium text-slate-200">{tx.description}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-sky-400 text-sm">
                      {formatCurrency(tx.totalAmount)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={tx.status === 'active' ? 'success' : 'danger'}>
                        {tx.status === 'active' ? 'Aktif' : 'İptal Edildi'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.status === 'active' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 gap-1"
                          onClick={() => {
                            if (confirm('Bu işlemi iptal etmek istediğinize emin misiniz?')) {
                              cancelMutation.mutate(tx.id);
                            }
                          }}
                        >
                          <Ban className="w-3.5 h-3.5" />
                          İptal Et
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
