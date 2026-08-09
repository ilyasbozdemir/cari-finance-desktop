import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light';
export type FiscalYearType = number | 'all';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  quickTransactionOpen: boolean;
  openQuickTransaction: (defaultType?: string) => void;
  closeQuickTransaction: () => void;
  defaultTransactionType: string;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  companyLogoIcon: string;
  setCompanyLogoIcon: (icon: string) => void;
  selectedFiscalYear: FiscalYearType;
  setSelectedFiscalYear: (year: FiscalYearType) => void;
}

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem('app_theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return 'dark';
};

const currentYear = new Date().getFullYear();

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  quickTransactionOpen: false,
  defaultTransactionType: 'sale',
  openQuickTransaction: (defaultType = 'sale') =>
    set({ quickTransactionOpen: true, defaultTransactionType: defaultType }),
  closeQuickTransaction: () => set({ quickTransactionOpen: false }),
  theme: getInitialTheme(),
  setTheme: (theme: ThemeMode) => {
    localStorage.setItem('app_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('app_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      return { theme: nextTheme };
    }),
  companyName: 'Genel Cari & Kasa Takibi (Demo/Beta)',
  setCompanyName: (name: string) => set({ companyName: name }),
  companyLogoIcon: 'building',
  setCompanyLogoIcon: (icon: string) => set({ companyLogoIcon: icon }),
  selectedFiscalYear: currentYear,
  setSelectedFiscalYear: (year: FiscalYearType) => set({ selectedFiscalYear: year }),
}));
