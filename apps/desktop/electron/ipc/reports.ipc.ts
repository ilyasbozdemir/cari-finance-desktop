import { ipcMain } from 'electron';
import { getDatabase } from '../database/client';
import * as schema from '../database/schema';
import { eq, desc, sql, and, gte, lte } from 'drizzle-orm';

export function registerReportsIPC() {
  // Get Dashboard Summary Data
  ipcMain.handle('reports:getDashboard', async () => {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];

    // 1. Total Cash & Bank Balance
    const cashAndBankEntities = db
      .select()
      .from(schema.entities)
      .where(sql`${schema.entities.type} IN ('cash', 'bank')`)
      .all();

    let totalCashBalance = 0;
    for (const ent of cashAndBankEntities) {
      const bRes = db
        .select({
          debit: sql<number>`COALESCE(SUM(${schema.journalItems.debit}), 0)`,
          credit: sql<number>`COALESCE(SUM(${schema.journalItems.credit}), 0)`,
        })
        .from(schema.journalItems)
        .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
        .where(
          and(
            eq(schema.journalItems.entityId, ent.id),
            eq(schema.journalEntries.status, 'active')
          )
        )
        .get();
      totalCashBalance += (bRes?.debit || 0) - (bRes?.credit || 0);
    }

    // 2. Total Customer Receivables (Toplam Müşteri Alacağı)
    const customerEntities = db
      .select()
      .from(schema.entities)
      .where(eq(schema.entities.type, 'customer'))
      .all();

    let totalCustomerReceivables = 0;
    const customerBalances: { id: string; name: string; balance: number; phone?: string | null }[] = [];

    for (const cust of customerEntities) {
      const bRes = db
        .select({
          debit: sql<number>`COALESCE(SUM(${schema.journalItems.debit}), 0)`,
          credit: sql<number>`COALESCE(SUM(${schema.journalItems.credit}), 0)`,
        })
        .from(schema.journalItems)
        .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
        .where(
          and(
            eq(schema.journalItems.entityId, cust.id),
            eq(schema.journalEntries.status, 'active')
          )
        )
        .get();

      const bal = (bRes?.debit || 0) - (bRes?.credit || 0);
      if (bal > 0) {
        totalCustomerReceivables += bal;
      }
      customerBalances.push({
        id: cust.id,
        name: cust.name,
        phone: cust.phone,
        balance: bal,
      });
    }

    // Top Debtor Customers
    const topDebtors = customerBalances
      .filter((c) => c.balance > 0)
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5);

    // 3. Today's Income & Expense
    const todayMovements = db
      .select({
        docType: schema.documents.type,
        amount: schema.documents.totalAmount,
      })
      .from(schema.documents)
      .where(eq(schema.documents.date, today))
      .all();

    let todayIncome = 0;
    let todayExpense = 0;
    for (const mov of todayMovements) {
      if (mov.docType === 'sale' || mov.docType === 'customer_payment' || mov.docType === 'partner_deposit') {
        todayIncome += mov.amount;
      } else if (mov.docType === 'purchase' || mov.docType === 'supplier_payment' || mov.docType === 'expense' || mov.docType === 'partner_draw') {
        todayExpense += mov.amount;
      }
    }

    // 4. Partner Balances
    const partnerEntities = db
      .select()
      .from(schema.entities)
      .where(eq(schema.entities.type, 'partner'))
      .all();

    const partnerBalances = partnerEntities.map((p) => {
      const bRes = db
        .select({
          draws: sql<number>`COALESCE(SUM(${schema.journalItems.debit}), 0)`,
          deposits: sql<number>`COALESCE(SUM(${schema.journalItems.credit}), 0)`,
        })
        .from(schema.journalItems)
        .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
        .where(
          and(
            eq(schema.journalItems.entityId, p.id),
            eq(schema.journalEntries.status, 'active')
          )
        )
        .get();

      const draws = bRes?.draws || 0;
      const deposits = bRes?.deposits || 0;
      const balance = deposits - draws;

      return {
        id: p.id,
        name: p.name,
        draws,
        deposits,
        balance,
      };
    });

    // 5. Recent Transactions
    const recentTransactions = db
      .select({
        id: schema.journalEntries.id,
        entryNumber: schema.journalEntries.entryNumber,
        docNumber: schema.documents.docNumber,
        docType: schema.documents.type,
        date: schema.journalEntries.date,
        description: schema.journalEntries.description,
        totalAmount: schema.documents.totalAmount,
      })
      .from(schema.journalEntries)
      .leftJoin(schema.documents, eq(schema.journalEntries.documentId, schema.documents.id))
      .where(eq(schema.journalEntries.status, 'active'))
      .orderBy(desc(schema.journalEntries.date), desc(schema.journalEntries.createdAt))
      .limit(6)
      .all();

    return {
      totalCashBalance,
      totalCustomerReceivables,
      todayIncome,
      todayExpense,
      topDebtors,
      partnerBalances,
      recentTransactions,
    };
  });

  // Get Trial Balance (Mizan Raporu)
  ipcMain.handle('reports:getTrialBalance', async () => {
    const db = getDatabase();

    const accountsList = db.select().from(schema.accounts).orderBy(schema.accounts.code).all();

    const result = accountsList.map((acc) => {
      const bRes = db
        .select({
          totalDebit: sql<number>`COALESCE(SUM(${schema.journalItems.debit}), 0)`,
          totalCredit: sql<number>`COALESCE(SUM(${schema.journalItems.credit}), 0)`,
        })
        .from(schema.journalItems)
        .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
        .where(
          and(
            eq(schema.journalItems.accountId, acc.id),
            eq(schema.journalEntries.status, 'active')
          )
        )
        .get();

      const totalDebit = bRes?.totalDebit || 0;
      const totalCredit = bRes?.totalCredit || 0;
      const debitBalance = totalDebit > totalCredit ? totalDebit - totalCredit : 0;
      const creditBalance = totalCredit > totalDebit ? totalCredit - totalDebit : 0;

      return {
        code: acc.code,
        name: acc.name,
        type: acc.type,
        totalDebit,
        totalCredit,
        debitBalance,
        creditBalance,
      };
    });

    return result.filter((a) => a.totalDebit > 0 || a.totalCredit > 0);
  });
}
