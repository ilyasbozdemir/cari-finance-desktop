import { createHashRouter } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { SuppliersPage } from '@/pages/SuppliersPage';
import { CashPage } from '@/pages/CashPage';
import { BanksPage } from '@/pages/BanksPage';
import { PartnersPage } from '@/pages/PartnersPage';
import { InventoryPage } from '@/pages/InventoryPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { AccountingPage } from '@/pages/AccountingPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'suppliers', element: <SuppliersPage /> },
      { path: 'cash', element: <CashPage /> },
      { path: 'banks', element: <BanksPage /> },
      { path: 'partners', element: <PartnersPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'accounting', element: <AccountingPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
