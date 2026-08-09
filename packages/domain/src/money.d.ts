export declare function formatCurrency(amount: number): string;
export declare function formatBalanceStatus(balance: number, type: 'customer' | 'supplier' | 'partner' | 'cash' | 'bank'): {
    text: string;
    badgeClass: string;
};
