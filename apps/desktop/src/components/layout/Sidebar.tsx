import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowRightLeft,
  BookOpen,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  LayoutDashboard,
  Moon,
  Package,
  PieChart,
  Plus,
  Settings,
  ShieldCheck,
  Sun,
  Truck,
  Users,
  Wallet,
} from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { Button } from '@/components/ui/button';
import { CompanyLogo } from '@/components/common/CompanyLogo';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
  const {
    sidebarOpen,
    toggleSidebar,
    openQuickTransaction,
    theme,
    toggleTheme,
    companyName,
    companyLogoIcon,
  } = useUIStore();

  const navItems = [
    { to: '/', label: 'Ana Ekran', icon: LayoutDashboard },
    { to: '/customers', label: 'Müşteri Carileri', icon: Users },
    { to: '/suppliers', label: 'Tedarikçi & Satıcılar', icon: Truck },
    { to: '/inventory', label: 'Stok & Ürün Takibi', icon: Package },
    { to: '/cash', label: 'Kasa Takibi', icon: Wallet },
    { to: '/banks', label: 'Banka Hesapları', icon: Building2 },
    { to: '/partners', label: 'Ortak Hesapları', icon: PieChart },
    { to: '/transactions', label: 'Tüm İşlemler', icon: ArrowRightLeft },
    { to: '/accounting', label: 'Muhasebe Defteri', icon: BookOpen },
    { to: '/reports', label: 'Raporlar & Ekstre', icon: FileSpreadsheet },
    { to: '/settings', label: 'Sistem Ayarları', icon: Settings },
  ];

  return (
    <aside
      className={clsx(
        'relative flex flex-col border-r transition-all duration-300 z-30 select-none shadow-sm dark:shadow-xl',
        theme === 'dark'
          ? 'border-slate-800/80 bg-slate-950 text-slate-200'
          : 'border-slate-200 bg-white text-slate-800',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Brand Header */}
      <div
        className={clsx(
          'flex h-14 items-center px-3 border-b border-slate-200 dark:border-slate-800/80 shrink-0',
          sidebarOpen ? 'justify-between' : 'justify-center'
        )}
      >
        {sidebarOpen ? (
          <>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <CompanyLogo
                icon={companyLogoIcon}
                className="h-8 w-8 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-md shrink-0"
              />
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-white leading-tight truncate">
                  {companyName || 'Genel Cari & Kasa'}
                </span>
                <span className="text-[10px] font-semibold text-sky-500 dark:text-sky-400">
                  Cari & Finans Motoru
                </span>
              </div>
            </div>

            <button
              onClick={toggleSidebar}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
              title="Menüyü Daralt"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center group focus:outline-none"
            title="Menüyü Genişlet"
          >
            <div className="relative flex items-center justify-center">
              <CompanyLogo
                icon={companyLogoIcon}
                className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="absolute -right-1 -bottom-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full p-0.5 shadow">
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Quick Action Button */}
      <div className="p-2.5 shrink-0">
        {sidebarOpen ? (
          <Button
            onClick={() => openQuickTransaction('sale')}
            variant="default"
            className="w-full h-9 gap-2 shadow-sm font-semibold text-xs bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 transition-all text-white"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="truncate">+ Yeni İşlem Ekle</span>
          </Button>
        ) : (
          <button
            onClick={() => openQuickTransaction('sale')}
            className="h-10 w-10 mx-auto flex items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm hover:bg-sky-400 transition-colors"
            title="Hızlı Yeni İşlem Ekle"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 px-2 py-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={!sidebarOpen ? item.label : undefined}
            className={({ isActive }) =>
              clsx(
                'flex items-center rounded-xl text-sm font-medium transition-all group',
                sidebarOpen ? 'px-3 py-2.5 gap-3' : 'justify-center h-10 w-10 mx-auto py-0 px-0',
                isActive
                  ? 'bg-sky-500/10 dark:bg-sky-600/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              )
            }
          >
            <item.icon className="h-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
            {sidebarOpen && <span className="truncate text-xs font-semibold">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-slate-200 dark:border-slate-800/80 shrink-0">
        {sidebarOpen ? (
          <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 dark:text-slate-400 px-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">Çift Taraflı Yevmiye Motoru</span>
          </div>
        ) : (
          <div className="flex justify-center" title="Çift Taraflı Yevmiye Motoru">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
        )}
      </div>
    </aside>
  );
};
