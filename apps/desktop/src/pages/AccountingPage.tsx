import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatCurrency } from '@/domain/money';

export const AccountingPage: React.FC = () => {
  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => window.api.accounts.list(),
  });

  const { data: trialBalance = [] } = useQuery({
    queryKey: ['trialBalance'],
    queryFn: () => window.api.reports.getTrialBalance(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-sky-400" />
            Muhasebe & Çift Taraflı Fiş Motoru
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Arka planda çalışan Tek Düzen Hesap Planı, yevmiye fişleri ve mizan bakiyeleri.
          </p>
        </div>

        <Badge variant="success" className="gap-1.5 py-1.5 px-3">
          <CheckCircle2 className="w-4 h-4" />
          Toplam Borç = Toplam Alacak Garantili
        </Badge>
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="chart">Tek Düzen Hesap Planı</TabsTrigger>
          <TabsTrigger value="mizan">Mizan Raporu (Borç/Alacak)</TabsTrigger>
        </TabsList>

        {/* Tab 1: Hesap Planı */}
        <TabsContent value="chart" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold text-white">Hesap Kodları ve Bakiyeler</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hesap Kodu</TableHead>
                    <TableHead>Hesap Adı</TableHead>
                    <TableHead>Sınıfı</TableHead>
                    <TableHead className="text-right">Toplam Borç</TableHead>
                    <TableHead className="text-right">Toplam Alacak</TableHead>
                    <TableHead className="text-right">Net Bakiye</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((acc: any) => (
                    <TableRow key={acc.id}>
                      <TableCell className="font-mono font-bold text-sky-400 text-xs">
                        {acc.code}
                      </TableCell>
                      <TableCell className="font-medium text-slate-200">{acc.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize text-[11px]">
                          {acc.type === 'asset'
                            ? 'Varlık'
                            : acc.type === 'liability'
                            ? 'Borç'
                            : acc.type === 'equity'
                            ? 'Sermaye'
                            : acc.type === 'revenue'
                            ? 'Gelir'
                            : 'Gider'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-300">
                        {formatCurrency(acc.totalDebit)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-300">
                        {formatCurrency(acc.totalCredit)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-white">
                        {formatCurrency(acc.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Mizan Raporu */}
        <TabsContent value="mizan" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold text-white">Genel Geçici Mizan</CardTitle>
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
                  {trialBalance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                        Mizanda gösterilecek hareketli hesap bulunamadı.
                      </TableCell>
                    </TableRow>
                  ) : (
                    trialBalance.map((item: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono font-bold text-sky-400 text-xs">
                          {item.code}
                        </TableCell>
                        <TableCell className="font-medium text-slate-200">{item.name}</TableCell>
                        <TableCell className="text-right font-mono text-slate-300">
                          {formatCurrency(item.totalDebit)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-slate-300">
                          {formatCurrency(item.totalCredit)}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold text-rose-400">
                          {item.debitBalance > 0 ? formatCurrency(item.debitBalance) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold text-emerald-400">
                          {item.creditBalance > 0 ? formatCurrency(item.creditBalance) : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
