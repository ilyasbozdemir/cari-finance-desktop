export interface Customer {
  id: string;
  name: string;
  type: 'customer';
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

export interface CustomerMovement {
  id: string;
  date: string;
  docNumber: string;
  docType: string;
  description: string;
  debit: number;
  credit: number;
  runningBalance: number;
}
