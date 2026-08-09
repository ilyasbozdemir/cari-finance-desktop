import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUIStore } from '@/stores/ui.store';
import { TabbedTransactionPanel } from '@/components/common/TabbedTransactionPanel';

export const MainLayout: React.FC = () => {
  const { quickTransactionOpen, closeQuickTransaction } = useUIStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100 dark:bg-slate-950/60 space-y-6">
          {/* Inline Tabbed Transaction Panel (No Forced Centered Popup Modal) */}
          {quickTransactionOpen && (
            <TabbedTransactionPanel onClose={closeQuickTransaction} />
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};
