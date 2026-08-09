export interface Partner {
  id: string;
  name: string;
  type: 'partner';
  accountId: string;
  phone?: string | null;
  taxNumber?: string | null;
  address?: string | null;
  notes?: string | null;
  isActive: boolean;
  createdAt: string;
  totalDraws: number;
  totalDeposits: number;
  balance: number;
}
