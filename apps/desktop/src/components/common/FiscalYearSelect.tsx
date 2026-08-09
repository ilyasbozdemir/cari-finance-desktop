import React from 'react';
import { CalendarRange } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUIStore, FiscalYearType } from '@/stores/ui.store';

export const FiscalYearSelect: React.FC<{ className?: string }> = ({ className }) => {
  const { selectedFiscalYear, setSelectedFiscalYear } = useUIStore();
  const currentYear = new Date().getFullYear();

  // Generate N (current year), N-1, N-2, N-3, N-4, N-5
  const yearOptions: { value: FiscalYearType; label: string }[] = [
    { value: currentYear, label: `${currentYear} (Cari Yıl N)` },
    { value: currentYear - 1, label: `${currentYear - 1} (Yıl N-1)` },
    { value: currentYear - 2, label: `${currentYear - 2} (Yıl N-2)` },
    { value: currentYear - 3, label: `${currentYear - 3} (Yıl N-3)` },
    { value: currentYear - 4, label: `${currentYear - 4} (Yıl N-4)` },
    { value: currentYear - 5, label: `${currentYear - 5} (Yıl N-5)` },
    { value: 'all', label: 'Tüm Mali Yıllar (Devir Dahil)' },
  ];

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Select
        value={selectedFiscalYear.toString()}
        onValueChange={(val) => {
          if (val === 'all') {
            setSelectedFiscalYear('all');
          } else {
            setSelectedFiscalYear(parseInt(val, 10));
          }
        }}
      >
        <SelectTrigger className="h-8 text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-semibold gap-1.5">
          <CalendarRange className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <SelectValue placeholder="Mali Yıl Seç" />
        </SelectTrigger>
        <SelectContent>
          {yearOptions.map((opt) => (
            <SelectItem key={opt.value.toString()} value={opt.value.toString()} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
