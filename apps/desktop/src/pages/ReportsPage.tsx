import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileSpreadsheet, Download, RefreshCw, ShieldCheck, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@cari-finance/domain';
import { exportToPDF, exportToExcel } from '@/lib/export';
import { useUIStore } from '@/stores/ui.store';

export const ReportsPage: React.FC = () => {
  const { selectedFiscalYear } = useUIStore();
  const [mizanType, setMizanType] = useState<'gecici' | 'kesin'>('gecici');

  const { data: mizan = [], isLoading, refetch } = useQuery({
    queryKey: ['trialBalance', mizanType, selectedFiscalYear],
    queryFn: () => window.api.reports.getTrialBalance({ type: mizanType, fiscalYear: selectedFiscalYear }),
  });

  const totalDebitSum = mizan.reduce((acc: number, item: any) => acc + item.totalDebit, 0);
  const totalCreditSum = mizan.reduce((acc: number, item: any) => acc + item.totalCredit, 0);
  const isBalanced = Math.abs(totalDebitSum - totalCreditSum) < 0.01;

  const handleExportPDF = () => {
    const titleText = mizanType === 'gecici' ? 'Geçici Dönemsel Mizan Cetveli' : 'Yıl Sonu Kesin Mizan Cetveli';
    const headers = ['Hesap Kodu', 'Hesap Adı', 'Hesap Türü', 'Borç Toplamı (TL)', 'Alacak Toplamı (TL)', 'Borç Bakiye (TL)', 'Alacak Bakiye (TL)'];
    const rows = mizan.map((item: any) => [
      item.code,
      item.name,
      item.type,
      formatCurrency(item.totalDebit),
      formatCurrency(item.totalCredit),
      item.debitBalance > 0 ? formatCurrency(item.debitBalance) : '-',
      item.creditBalance > 0 ? formatCurrency(item.creditBalance) : '-',
    ]);

    exportToPDF({
      title: `${titleText} (${selectedFiscalYear})`,
      subtitle: 'Çift taraflı yevmiye kayıtları bazlı mizan cetveli.',
      headers,
      rows,
      filename: `mizan_${mizanType}_${selectedFiscalYear}_${new Date().toISOString().split('T')[0]}`,
      summaryRows: [
        { label: 'Genel Borç Toplamı', value: formatCurrency(totalDebitSum) },
        { label: 'Genel Alacak Toplamı', value: formatCurrency(totalCreditSum) },
        { label: 'Mizan Denge Durumu', value: isBalanced ? 'Tam Dengede (Eşit)' : 'Dengesiz' },
      ],
    });
  };

  const handleExportExcel = () => {
    const data = mizan.map((item: any) => ({
      'Hesap Kodu': item.code,
      'Hesap Adı': item.name,
      'Hesap Türü': item.type,
      'Borç Toplamı (TL)': item.totalDebit,
      'Alacak Toplamı (TL)': item.totalCredit,
      'Borç Bakiye (TL)': item.debitBalance,
      'Alacak Bakiye (TL)': item.creditBalance,
    }));
    exportToExcel(`mizan_${mizanType}_${selectedFiscalYear}_${new Date().toISOString().split('T')[0]}`, data, 'Mizan Raporu');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-sky-500" />
            Finansal Mizan Raporları ({selectedFiscalYear})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Seçilen <span className="font-bold text-sky-500 font-mono">{selectedFiscalYear === 'all' ? 'Tüm Yıllar' : `${selectedFiscalYear} Dönemi`}</span> resmi Geçici Mizan ve Kesin Mizan cetvelleri.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()} className="gap-2 text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            Yenile
          </Button>
          <Button variant="outline" onClick={handleExportExcel} className="gap-2 text-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            Excel İndir
          </Button>
          <Button variant="default" onClick={handleExportPDF} className="gap-2 text-xs">
            <Download className="w-3.5 h-3.5 text-sky-400" />
            Antetli Mizan PDF İndir
          </Button>
        </div>
      </div>

      {/* Mizan Type Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <Button
          variant={mizanType === 'gecici' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMizanType('gecici')}
          className="gap-2 text-xs font-semibold"
        >
          <Layers className="w-4 h-4" />
          Geçici Mizan (Aylık / Dönemsel)
        </Button>

        <Button
          variant={mizanType === 'kesin' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMizanType('kesin')}
          className="gap-2 text-xs font-semibold"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Kesin Mizan (Yıl Sonu Kapanış Mizani)
        </Button>
      </div>

      {/* Denge Statüsü */}
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {mizanType === 'gecici' ? 'Geçici Mizan Denge Durumu' : 'Kesin Mizan Denge Durumu'}
                </span>
                <Badge variant={isBalanced ? 'success' : 'danger'}>
                  {isBalanced ? 'Dengede (Eşit)' : 'Fark Var'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                SUM(Borç) === SUM(Alacak) denkliği otomatik doğrulanır.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-right">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Toplam Borç</span>
              <span className="font-mono text-base font-black text-rose-500">{formatCurrency(totalDebitSum)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Toplam Alacak</span>
              <span className="font-mono text-base font-black text-emerald-500">{formatCurrency(totalCreditSum)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mizan Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <span>{mizanType === 'gecici' ? 'Geçici Mizan Cetveli' : 'Yıl Sonu Kesin Mizan Cetveli'}</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Toplam {mizan.length} Hesap Kalemi</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hesap Kodu</TableHead>
                <TableHead>Hesap Adı</TableHead>
                <TableHead className="text-right">Borç Toplamı</TableHead>
                <TableHead className="text-right">Alacak Toplamı</TableHead>
                <TableHead className="text-right">Borç Bakiyesi</TableHead>
                <TableHead className="text-right">Alacak Bakiyesi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    Mizan verileri hesaplanıyor...
                  </TableCell>
                </TableRow>
              ) : mizan.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    Seçilen dönemde henüz muhasebe kaydı bulunmuyor.
                  </TableCell>
                </TableRow>
              ) : (
                mizan.map((item: any) => (
                  <TableRow key={item.code}>
                    <TableCell className="font-mono font-bold text-sky-500 text-xs">
                      {item.code}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.name}
                      {item.isClosed && (
                        <Badge variant="secondary" className="ml-2 text-[10px]">
                          Kapatıldı
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-700 dark:text-slate-300">
                      {formatCurrency(item.totalDebit)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-700 dark:text-slate-300">
                      {formatCurrency(item.totalCredit)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-rose-500">
                      {item.debitBalance > 0 ? formatCurrency(item.debitBalance) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-emerald-500">
                      {item.creditBalance > 0 ? formatCurrency(item.creditBalance) : '-'}
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
