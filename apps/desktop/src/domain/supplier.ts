export interface Supplier {
  id: string;
  name: string;
  type: 'supplier';
  accountId: string;
  phone?: string | null;
  taxNumber?: string | null;
  address?: string | null;
  notes?: string | null;
  isActive: boolean;
  createdAt: string;
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

export interface SupplierMovement {
  id: string;
  date: string;
  docNumber: string;
  docType: string;
  description: string;
  debit: number;
  credit: number;
  runningBalance: number;
}
