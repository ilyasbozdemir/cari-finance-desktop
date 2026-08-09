import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, FileSpreadsheet, Download, Layers, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@cari-finance/domain';
import { exportToPDF, exportToExcel } from '@/lib/export';

export const AccountingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'yevmiye' | 'kebir' | 'muavin'>('yevmiye');

  // Yevmiye Defteri
  const { data: journalEntries = [], isLoading: loadingYevmiye, refetch: refetchYevmiye } = useQuery({
    queryKey: ['accountingJournal'],
    queryFn: () => window.api.accounts.getJournalEntries(),
  });

  // Defter-i Kebir (Büyük Defter)
  const { data: kebirList = [], isLoading: loadingKebir, refetch: refetchKebir } = useQuery({
    queryKey: ['accountingKebir'],
    queryFn: () => window.api.reports.getKebir(),
    enabled: activeTab === 'kebir',
  });

  // Muavin Defteri (Yardımcı Defter)
  const { data: muavinList = [], isLoading: loadingMuavin, refetch: refetchMuavin } = useQuery({
    queryKey: ['accountingMuavin'],
    queryFn: () => window.api.reports.getMuavin(),
    enabled: activeTab === 'muavin',
  });

  const handleExportPDF = () => {
    if (activeTab === 'yevmiye') {
      const headers = ['Yevmiye No', 'Tarih', 'Hesap Kodu', 'Hesap Adı / Açıklama', 'Borç (TL)', 'Alacak (TL)'];
      const rows: any[][] = [];
      journalEntries.forEach((entry: any) => {
        entry.items.forEach((item: any) => {
          rows.push([
            entry.entryNumber,
            entry.date,
            item.accountCode,
            `${item.accountName} (${item.description})`,
            item.debit > 0 ? formatCurrency(item.debit) : '-',
            item.credit > 0 ? formatCurrency(item.credit) : '-',
          ]);
        });
      });
      exportToPDF({
        title: 'Resmi Yevmiye Defteri (Journal Ledger)',
        subtitle: 'Çift taraflı yevmiye maddeleri kayıt dokümanı',
        headers,
        rows,
        filename: `yevmiye_defteri_${new Date().toISOString().split('T')[0]}`,
      });
    } else if (activeTab === 'kebir') {
      const headers = ['Hesap Kodu', 'Hesap Adı', 'Hesap Türü', 'Toplam Borç', 'Toplam Alacak', 'Net Bakiye'];
      const rows = kebirList.map((k: any) => [
        k.code,
        k.name,
        k.type,
        formatCurrency(k.totalDebit),
        formatCurrency(k.totalCredit),
        formatCurrency(k.balance),
      ]);
      exportToPDF({
        title: 'Defter-i Kebir (Büyük Defter)',
        subtitle: 'Ana hesap grupları borç ve alacak toplamları',
        headers,
        rows,
        filename: `defteri_kebir_${new Date().toISOString().split('T')[0]}`,
      });
    } else {
      const headers = ['Cari / Kasa Adı', 'Tür', 'Toplam Borç', 'Toplam Alacak', 'Net Bakiye'];
      const rows = muavinList.map((m: any) => [
        m.name,
        m.type,
        formatCurrency(m.totalDebit),
        formatCurrency(m.totalCredit),
        formatCurrency(m.balance),
      ]);
      exportToPDF({
        title: 'Muavin Defter (Yardımcı Defter)',
        subtitle: 'Müşteri, tedarikçi ve kasa yardımcı defter dökümü',
        headers,
        rows,
        filename: `muavin_defter_${new Date().toISOString().split('T')[0]}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-sky-500" />
            Resmi Defterler (Yevmiye, Kebir, Muavin)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tekdüzen hesap planı bazlı Yevmiye Defteri, Defter-i Kebir ve Yardımcı Muavin Defteri.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="default" onClick={handleExportPDF} className="gap-2 text-xs font-semibold">
            <Download className="w-4 h-4 text-sky-400" />
            Antetli Defter PDF İndir
          </Button>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <Button
          variant={activeTab === 'yevmiye' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('yevmiye')}
          className="gap-2 text-xs font-semibold"
        >
          <BookOpen className="w-4 h-4" />
          Yevmiye Defteri
        </Button>

        <Button
          variant={activeTab === 'kebir' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('kebir')}
          className="gap-2 text-xs font-semibold"
        >
          <Layers className="w-4 h-4" />
          Defter-i Kebir (Büyük Defter)
        </Button>

        <Button
          variant={activeTab === 'muavin' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('muavin')}
          className="gap-2 text-xs font-semibold"
        >
          <FileText className="w-4 h-4" />
          Muavin Defteri (Yardımcı Defter)
        </Button>
      </div>

      {/* Tab 1: Yevmiye Defteri */}
      {activeTab === 'yevmiye' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Resmi Yevmiye Fişleri Dökümü</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {journalEntries.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center">Henüz yevmiye kaydı bulunmuyor.</p>
              ) : (
                journalEntries.map((entry: any) => (
                  <div
                    key={entry.id}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/40"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="font-mono font-bold">
                          {entry.entryNumber}
                        </Badge>
                        <span className="font-mono text-slate-500 dark:text-slate-400">{entry.date}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{entry.description}</span>
                      </div>
                      <Badge variant={entry.status === 'active' ? 'success' : 'danger'}>
                        {entry.status === 'active' ? 'Dengede (Onaylı)' : 'İptal / Ters Kayıt'}
                      </Badge>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow className="h-8">
                          <TableHead className="text-[11px]">Hesap Kodu</TableHead>
                          <TableHead className="text-[11px]">Hesap Adı</TableHead>
                          <TableHead className="text-[11px]">Açıklama</TableHead>
                          <TableHead className="text-right text-[11px]">Borç (TL)</TableHead>
                          <TableHead className="text-right text-[11px]">Alacak (TL)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entry.items.map((item: any) => (
                          <TableRow key={item.id} className="h-8 text-xs">
                            <TableCell className="font-mono font-bold text-sky-500">{item.accountCode}</TableCell>
                            <TableCell className="font-medium text-slate-800 dark:text-slate-200">{item.accountName}</TableCell>
                            <TableCell className="text-slate-500 dark:text-slate-400">{item.description}</TableCell>
                            <TableCell className="text-right font-mono text-rose-500 font-semibold">
                              {item.debit > 0 ? formatCurrency(item.debit) : '-'}
                            </TableCell>
                            <TableCell className="text-right font-mono text-emerald-500 font-semibold">
                              {item.credit > 0 ? formatCurrency(item.credit) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Defter-i Kebir */}
      {activeTab === 'kebir' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Defter-i Kebir (Ana Hesap Grupları)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {kebirList.map((kebir: any) => (
              <div key={kebir.code} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="default" className="font-mono text-xs">
                      {kebir.code}
                    </Badge>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{kebir.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span>Borç Toplamı: <strong className="text-rose-500">{formatCurrency(kebir.totalDebit)}</strong></span>
                    <span>Alacak Toplamı: <strong className="text-emerald-500">{formatCurrency(kebir.totalCredit)}</strong></span>
                    <span>Bakiye: <strong className="text-sky-500">{formatCurrency(kebir.balance)}</strong></span>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Evrak No</TableHead>
                      <TableHead>Açıklama</TableHead>
                      <TableHead className="text-right">Borç (TL)</TableHead>
                      <TableHead className="text-right">Alacak (TL)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kebir.items.map((it: any) => (
                      <TableRow key={it.id}>
                        <TableCell className="font-mono text-xs">{it.date}</TableCell>
                        <TableCell className="font-mono text-xs text-sky-500">{it.docNumber || '-'}</TableCell>
                        <TableCell className="text-slate-800 dark:text-slate-200">{it.description}</TableCell>
                        <TableCell className="text-right font-mono text-rose-500 font-semibold">
                          {it.debit > 0 ? formatCurrency(it.debit) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-mono text-emerald-500 font-semibold">
                          {it.credit > 0 ? formatCurrency(it.credit) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Muavin Defteri */}
      {activeTab === 'muavin' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Muavin Defteri (Yardımcı Defter Detayı)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {muavinList.map((muavin: any) => (
              <div key={muavin.entityId} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {muavin.type.toUpperCase()}
                    </Badge>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{muavin.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span>Toplam Borç: <strong className="text-rose-500">{formatCurrency(muavin.totalDebit)}</strong></span>
                    <span>Toplam Alacak: <strong className="text-emerald-500">{formatCurrency(muavin.totalCredit)}</strong></span>
                    <span>Son Bakiye: <strong className="text-sky-500">{formatCurrency(muavin.balance)}</strong></span>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Evrak No</TableHead>
                      <TableHead>İşlem Açıklaması</TableHead>
                      <TableHead className="text-right">Borç (TL)</TableHead>
                      <TableHead className="text-right">Alacak (TL)</TableHead>
                      <TableHead className="text-right">Yürüyen Bakiye</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {muavin.items.map((it: any) => (
                      <TableRow key={it.id}>
                        <TableCell className="font-mono text-xs">{it.date}</TableCell>
                        <TableCell className="font-mono text-xs text-sky-500">{it.docNumber || '-'}</TableCell>
                        <TableCell className="text-slate-800 dark:text-slate-200">{it.description}</TableCell>
                        <TableCell className="text-right font-mono text-rose-500 font-semibold">
                          {it.debit > 0 ? formatCurrency(it.debit) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-mono text-emerald-500 font-semibold">
                          {it.credit > 0 ? formatCurrency(it.credit) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-sky-500">
                          {formatCurrency(it.runningBalance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
