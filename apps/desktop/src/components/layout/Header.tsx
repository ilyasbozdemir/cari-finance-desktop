import React from 'react';
import { Calendar, Lock, Plus, Sun, Moon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui.store';
import { useSessionStore } from '@/stores/session.store';
import { CompanyLogo } from '@/components/common/CompanyLogo';
import { FiscalYearSelect } from '@/components/common/FiscalYearSelect';

export const Header: React.FC = () => {
  const { openQuickTransaction, theme, toggleTheme, companyName, companyLogoIcon } = useUIStore();
  const { lock } = useSessionStore();

  const todayFormatted = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 px-4 md:px-6 backdrop-blur-md z-20 transition-colors">
      {/* Left Info Area - Frameless Native Style */}
      <div className="flex items-center gap-3 text-xs font-medium">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
          <CompanyLogo icon={companyLogoIcon} className="h-6 w-6 rounded-lg bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-sm" iconClassName="h-3.5 w-3.5" />
          <span className="truncate max-w-[240px] md:max-w-xs">
            {companyName || 'Genel Cari & Kasa Takibi (Demo/Beta)'}
          </span>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          Demo / Beta
        </span>

        {/* Dynamic Fiscal Year Selector (N, N-1..N-5) */}
        <FiscalYearSelect />

        <div className="hidden lg:flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{todayFormatted}</span>
        </div>
      </div>

      {/* Right Controls Area */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
        </button>

        <Button
          onClick={() => openQuickTransaction('sale')}
          variant="success"
          size="sm"
          className="gap-1.5 text-xs font-semibold h-8 shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Hızlı İşlem</span>
        </Button>

        <button
          onClick={lock}
          title="Ekranı Kilitle (PIN)"
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <Lock className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
};
