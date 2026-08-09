import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Wallet,
  Users,
  TrendingUp,
  TrendingDown,
  PieChart,
  Clock,
  Plus,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatBalanceStatus } from '@/domain/money';
import { useUIStore } from '@/stores/ui.store';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { openQuickTransaction, selectedFiscalYear } = useUIStore();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard', selectedFiscalYear],
    queryFn: () => window.api.reports.getDashboard({ fiscalYear: selectedFiscalYear }),
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-400">
        Yükleniyor...
      </div>
    );
  }

  const {
    totalCashBalance = 0,
    totalCustomerReceivables = 0,
    todayIncome = 0,
    todayExpense = 0,
    topDebtors = [],
    partnerBalances = [],
    recentTransactions = [],
  } = dashboardData || {};

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Ana Ekran & Genel Bakış</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Seçilen <span className="font-bold text-sky-500 font-mono">{selectedFiscalYear === 'all' ? 'Tüm Yıllar' : `${selectedFiscalYear} Dönemi`}</span> çift taraflı muhasebe fişlerinden anlık hesaplanan finans durumu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => openQuickTransaction('sale')}
            variant="default"
            className="gap-2 shadow-sm text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            Satış Kaydı
          </Button>
          <Button
            onClick={() => openQuickTransaction('customer_payment')}
            variant="success"
            className="gap-2 shadow-sm text-xs font-semibold"
          >
            <ArrowDownRight className="w-4 h-4" />
            Tahsilat Al
          </Button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kasa & Banka Bakiyesi */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400">Kasa & Banka Bakiyesi</CardTitle>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <Wallet className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(totalCashBalance)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Nakit + Banka Mevcudu ({selectedFiscalYear})</p>
          </CardContent>
        </Card>

        {/* Müşteri Alacakları */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400">Toplam Müşteri Alacağı</CardTitle>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight text-emerald-500">
              {formatCurrency(totalCustomerReceivables)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Müşterilerden Gelecek Paralar</p>
          </CardContent>
        </Card>

        {/* Bugünkü Gelir */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400">Bugünkü Gelir</CardTitle>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight text-cyan-500">
              {formatCurrency(todayIncome)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Bugün Giriş Yapılan Satış & Tahsilat</p>
          </CardContent>
        </Card>

        {/* Bugünkü Gider */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400">Bugünkü Gider</CardTitle>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <TrendingDown className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight text-rose-500">
              {formatCurrency(todayExpense)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Bugün Yapılan Ödeme & Giderler</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: En Borçlu Müşteriler + Ortak Bakiyeleri */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Top Debtors & Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* En Borçlu Müşteriler */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">En Borçlu Müşteriler (Alacaklarımız)</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">En yüksek bakiyeli 5 cari</p>
              </div>
              <Link to="/customers">
                <Button variant="ghost" size="sm" className="gap-1 text-sky-500 hover:text-sky-600 dark:hover:text-sky-300">
                  Tümü <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {topDebtors.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">Henüz borçlu müşteri bulunmamaktadır.</p>
              ) : (
                <div className="space-y-3">
                  {topDebtors.map((debtor: any) => (
                    <div
                      key={debtor.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500 font-bold text-xs">
                          {debtor.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{debtor.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{debtor.phone || 'Telefon Belirtilmedi'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-emerald-500">{formatCurrency(debtor.balance)}</p>
                        <Badge variant="success" className="text-[10px] mt-0.5">Alacaklıyız</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Son Yapılan İşlemler */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-500" />
                  Son Yapılan İşlemler ({selectedFiscalYear})
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Seçilen döneme ait son 6 hareket</p>
              </div>
              <Link to="/transactions">
                <Button variant="ghost" size="sm" className="gap-1 text-sky-500 hover:text-sky-600 dark:hover:text-sky-300">
                  Tüm İşlemler <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">Henüz kaydedilmiş işlem yok.</p>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {recentTransactions.map((tx: any) => (
                    <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="font-mono">
                          {tx.docNumber || tx.entryNumber}
                        </Badge>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{tx.description}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-sky-500 text-sm">
                          {formatCurrency(tx.totalAmount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 col): Ortakların Bakiyeleri */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-500" />
                Ortak Hesapları ({selectedFiscalYear})
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Şirket ortaklarının para çekme & yatırma durumu</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {partnerBalances.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">Ortak kaydı bulunamadı.</p>
              ) : (
                partnerBalances.map((partner: any) => {
                  const status = formatBalanceStatus(partner.balance, 'partner');
                  return (
                    <div
                      key={partner.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{partner.name}</span>
                        <Badge className={status.badgeClass}>{status.text}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Çekilen Para (Borç):</span>
                          <span className="font-mono font-bold text-rose-500">
                            {formatCurrency(partner.draws)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Yatırılan Para (Alacak):</span>
                          <span className="font-mono font-bold text-emerald-500">
                            {formatCurrency(partner.deposits)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400 font-semibold">Net Bakiye:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                          {formatCurrency(partner.balance)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
