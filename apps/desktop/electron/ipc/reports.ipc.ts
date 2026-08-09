import { ipcMain } from 'electron';
import { getDatabase } from '../database/client';
import * as schema from '../database/schema';
import { eq, desc, sql, and, gte, lte } from 'drizzle-orm';

export function registerReportsIPC() {
  // Get Dashboard Summary Data with Fiscal Year filter support
  ipcMain.handle('reports:getDashboard', async (_, options?: { fiscalYear?: number | 'all' }) => {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];
    const year = options?.fiscalYear;

    let dateConditions: any[] = [eq(schema.journalEntries.status, 'active')];
    if (typeof year === 'number') {
      dateConditions.push(gte(schema.journalEntries.date, `${year}-01-01`));
      dateConditions.push(lte(schema.journalEntries.date, `${year}-12-31`));
    }

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
        .where(and(eq(schema.journalItems.entityId, ent.id), ...dateConditions))
        .get();
      totalCashBalance += (bRes?.debit || 0) - (bRes?.credit || 0);
    }

    // 2. Total Customer Receivables
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
        .where(and(eq(schema.journalItems.entityId, cust.id), ...dateConditions))
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
        .where(and(eq(schema.journalItems.entityId, p.id), ...dateConditions))
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
      .where(and(...dateConditions))
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

  // Get Trial Balance (Geçici ve Kesin Mizan Cetveli - Fiscal Year Filtered)
  ipcMain.handle('reports:getTrialBalance', async (_, options?: { type?: 'gecici' | 'kesin'; fiscalYear?: number | 'all' }) => {
    const db = getDatabase();
    const type = options?.type || 'gecici';
    const year = options?.fiscalYear;

    let dateConditions: any[] = [eq(schema.journalEntries.status, 'active')];
    if (typeof year === 'number') {
      dateConditions.push(gte(schema.journalEntries.date, `${year}-01-01`));
      dateConditions.push(lte(schema.journalEntries.date, `${year}-12-31`));
    }

    const accountsList = db.select().from(schema.accounts).orderBy(schema.accounts.code).all();

    const result = accountsList.map((acc) => {
      const bRes = db
        .select({
          totalDebit: sql<number>`COALESCE(SUM(${schema.journalItems.debit}), 0)`,
          totalCredit: sql<number>`COALESCE(SUM(${schema.journalItems.credit}), 0)`,
        })
        .from(schema.journalItems)
        .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
        .where(and(eq(schema.journalItems.accountId, acc.id), ...dateConditions))
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
        isClosed: type === 'kesin' && acc.code.startsWith('6'),
      };
    });

    return result.filter((a) => a.totalDebit > 0 || a.totalCredit > 0);
  });

  // Defter-i Kebir (Büyük Defter) - Fiscal Year Filtered
  ipcMain.handle('reports:getKebir', async (_, options?: { fiscalYear?: number | 'all' }) => {
    const db = getDatabase();
    const year = options?.fiscalYear;

    let dateConditions: any[] = [eq(schema.journalEntries.status, 'active')];
    if (typeof year === 'number') {
      dateConditions.push(gte(schema.journalEntries.date, `${year}-01-01`));
      dateConditions.push(lte(schema.journalEntries.date, `${year}-12-31`));
    }

    const accountsList = db.select().from(schema.accounts).orderBy(schema.accounts.code).all();

    const kebirList = accountsList.map((acc) => {
      const items = db
        .select({
          id: schema.journalItems.id,
          date: schema.journalEntries.date,
          docNumber: schema.documents.docNumber,
          description: schema.journalItems.description,
          debit: schema.journalItems.debit,
          credit: schema.journalItems.credit,
        })
        .from(schema.journalItems)
        .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
        .leftJoin(schema.documents, eq(schema.journalEntries.documentId, schema.documents.id))
        .where(and(eq(schema.journalItems.accountId, acc.id), ...dateConditions))
        .orderBy(schema.journalEntries.date)
        .all();

      const totalDebit = items.reduce((acc, i) => acc + i.debit, 0);
      const totalCredit = items.reduce((acc, i) => acc + i.credit, 0);

      return {
        accountId: acc.id,
        code: acc.code,
        name: acc.name,
        type: acc.type,
        totalDebit,
        totalCredit,
        balance: totalDebit - totalCredit,
        items,
      };
    });

    return kebirList.filter((k) => k.items.length > 0);
  });

  // Muavin Defteri (Yardımcı Defter - Fiscal Year Filtered)
  ipcMain.handle('reports:getMuavin', async (_, options?: { entityId?: string; fiscalYear?: number | 'all' }) => {
    const db = getDatabase();
    const year = options?.fiscalYear;

    let dateConditions: any[] = [eq(schema.journalEntries.status, 'active')];
    if (typeof year === 'number') {
      dateConditions.push(gte(schema.journalEntries.date, `${year}-01-01`));
      dateConditions.push(lte(schema.journalEntries.date, `${year}-12-31`));
    }

    const entitiesList = db.select().from(schema.entities).orderBy(schema.entities.name).all();

    const muavinList = entitiesList.map((ent) => {
      const items = db
        .select({
          id: schema.journalItems.id,
          date: schema.journalEntries.date,
          docNumber: schema.documents.docNumber,
          description: schema.journalItems.description,
          debit: schema.journalItems.debit,
          credit: schema.journalItems.credit,
        })
        .from(schema.journalItems)
        .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
        .leftJoin(schema.documents, eq(schema.journalEntries.documentId, schema.documents.id))
        .where(and(eq(schema.journalItems.entityId, ent.id), ...dateConditions))
        .orderBy(schema.journalEntries.date)
        .all();

      let runningBalance = 0;
      const itemsWithBalance = items.map((it) => {
        runningBalance += it.debit - it.credit;
        return { ...it, runningBalance };
      });

      const totalDebit = items.reduce((acc, i) => acc + i.debit, 0);
      const totalCredit = items.reduce((acc, i) => acc + i.credit, 0);

      return {
        entityId: ent.id,
        name: ent.name,
        type: ent.type,
        totalDebit,
        totalCredit,
        balance: runningBalance,
        items: itemsWithBalance,
      };
    });

    return muavinList.filter((m) => m.items.length > 0);
  });
}
