import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, ArrowUpRight, ArrowDownRight, FileText, FileSpreadsheet, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatCurrency, formatBalanceStatus } from '@/domain/money';
import { useUIStore } from '@/stores/ui.store';
import { exportToPDF, exportToExcel } from '@/lib/export';

export const PartnersPage: React.FC = () => {
  const { openQuickTransaction } = useUIStore();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: () => window.api.partners.list(),
  });

  const { data: partnerStatement } = useQuery({
    queryKey: ['partnerStatement', selectedPartnerId],
    queryFn: () => window.api.partners.getStatement(selectedPartnerId!),
    enabled: !!selectedPartnerId,
  });

  const handleExportPDF = () => {
    if (!partnerStatement) return;
    const headers = ['Tarih', 'Belge Kodu', 'Açıklama', 'Çekilen (Borç TL)', 'Yatırılan (Alacak TL)', 'Bakiye TL'];
    const rows = partnerStatement.movements.map((m: any) => [
      m.date,
      m.docNumber || 'ORTAK',
      m.description,
      m.drawAmount > 0 ? formatCurrency(m.drawAmount) : '-',
      m.depositAmount > 0 ? formatCurrency(m.depositAmount) : '-',
      formatCurrency(m.runningBalance),
    ]);

    exportToPDF({
      title: `${partnerStatement.partner.name} - Şirket Ortağı Cari Ekstresi`,
      subtitle: `${partnerStatement.partner.notes || 'Hissedar Ortak Hesabı'}`,
      headers,
      rows,
      filename: `ortak_ekstre_${partnerStatement.partner.name.replace(/\s+/g, '_')}`,
      summaryRows: [
        { label: 'Şirketten Çektiği Toplam (Borç)', value: formatCurrency(partnerStatement.totalDraws) },
        { label: 'Şirkete Yatırdığı Toplam (Alacak)', value: formatCurrency(partnerStatement.totalDeposits) },
        { label: 'Güncel Ortak Net Bakiyesi', value: formatCurrency(partnerStatement.currentBalance) },
      ],
    });
  };

  const handleExportExcel = () => {
    if (!partnerStatement) return;
    const data = partnerStatement.movements.map((m: any) => ({
      Tarih: m.date,
      'Belge Kodu': m.docNumber || 'ORTAK',
      Açıklama: m.description,
      'Çekilen (Borç TL)': m.drawAmount,
      'Yatırılan (Alacak TL)': m.depositAmount,
      'Yürüyen Bakiye TL': m.runningBalance,
    }));
    exportToExcel(`ortak_ekstre_${partnerStatement.partner.name.replace(/\s+/g, '_')}`, data, 'Ortak Ekstre');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <PieChart className="w-6 h-6 text-purple-500" />
            Şirket Ortakları Cari Hesapları
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Şirket ortaklarının kasadan/bankadan para çekmesi veya sermaye/fon koyması işlemleri.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => openQuickTransaction('partner_draw')} variant="destructive" className="gap-2 text-xs">
            <ArrowUpRight className="w-4 h-4" />
            Ortak Para Çekme
          </Button>
          <Button onClick={() => openQuickTransaction('partner_deposit')} variant="success" className="gap-2 text-xs">
            <ArrowDownRight className="w-4 h-4" />
            Ortak Para Yatırma
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {partners.map((partner: any) => {
          const status = formatBalanceStatus(partner.balance, 'partner');
          return (
            <Card
              key={partner.id}
              className="hover:border-purple-500/50 transition-all cursor-pointer"
              onClick={() => setSelectedPartnerId(partner.id)}
            >
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">{partner.name}</CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{partner.notes || 'Hissedar Ortak'}</p>
                </div>
                <Badge className={status.badgeClass}>{status.text}</Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Şirketten Çektiği (Borç):</span>
                    <span className="font-mono font-bold text-rose-500">
                      {formatCurrency(partner.totalDraws)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Şirkete Koyduğu (Alacak):</span>
                    <span className="font-mono font-bold text-emerald-500">
                      {formatCurrency(partner.totalDeposits)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Net Cari Bakiye:</span>
                  <span className="font-mono text-lg font-black text-slate-900 dark:text-white">
                    {formatCurrency(partner.balance)}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPartnerId(partner.id);
                  }}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Ortak Ekstresi Dökümü
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Partner Statement Dialog */}
      {selectedPartnerId && partnerStatement && (
        <Dialog open={!!selectedPartnerId} onOpenChange={() => setSelectedPartnerId(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {partnerStatement.partner.name} - Ortak Cari Ekstresi
                  </DialogTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {partnerStatement.partner.notes || 'Ortak Hesabı'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleExportExcel} className="gap-1.5 text-xs">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    Excel İndir
                  </Button>
                  <Button size="sm" variant="default" onClick={handleExportPDF} className="gap-1.5 text-xs">
                    <Download className="w-4 h-4 text-sky-400" />
                    Antetli PDF İndir
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Belge Kodu</TableHead>
                    <TableHead>Açıklama</TableHead>
                    <TableHead className="text-right">Çekilen (Borç)</TableHead>
                    <TableHead className="text-right">Yatırılan (Alacak)</TableHead>
                    <TableHead className="text-right">Bakiye</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partnerStatement.movements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                        Bu ortağa ait henüz para çekme veya yatırma işlemi kaydedilmedi.
                      </TableCell>
                    </TableRow>
                  ) : (
                    partnerStatement.movements.map((mov: any) => (
                      <TableRow key={mov.id}>
                        <TableCell className="font-mono text-xs">{mov.date}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono text-[11px]">
                            {mov.docNumber || 'ORTAK'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-slate-800 dark:text-slate-200">{mov.description}</TableCell>
                        <TableCell className="text-right font-mono font-semibold text-rose-500">
                          {mov.drawAmount > 0 ? formatCurrency(mov.drawAmount) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold text-emerald-500">
                          {mov.depositAmount > 0 ? formatCurrency(mov.depositAmount) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-slate-900 dark:text-white">
                          {formatCurrency(mov.runningBalance)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
