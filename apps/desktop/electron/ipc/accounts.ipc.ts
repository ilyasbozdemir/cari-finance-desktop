import { ipcMain } from 'electron';
import { getDatabase } from '../database/client';
import * as schema from '../database/schema';
import { eq, desc, sql } from 'drizzle-orm';

export function registerAccountsIPC() {
  ipcMain.handle('accounts:list', async () => {
    const db = getDatabase();

    const accountsList = db
      .select()
      .from(schema.accounts)
      .all();

    const result = accountsList.map((account) => {
      const balanceRes = db
        .select({
          totalDebit: sql<number>`COALESCE(SUM(${schema.journalItems.debit}), 0)`,
          totalCredit: sql<number>`COALESCE(SUM(${schema.journalItems.credit}), 0)`,
        })
        .from(schema.journalItems)
        .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
        .where(
          eq(schema.journalItems.accountId, account.id)
        )
        .get();

      const totalDebit = balanceRes?.totalDebit || 0;
      const totalCredit = balanceRes?.totalCredit || 0;

      let balance = 0;
      if (account.type === 'asset' || account.type === 'expense') {
        balance = totalDebit - totalCredit;
      } else {
        balance = totalCredit - totalDebit;
      }

      return {
        ...account,
        totalDebit,
        totalCredit,
        balance,
      };
    });

    return result;
  });

  // Get Journal Entries with items for Accounting Journal Book (Resmi Yevmiye Defteri)
  ipcMain.handle('accounts:getJournalEntries', async () => {
    const db = getDatabase();

    const entries = db
      .select({
        id: schema.journalEntries.id,
        entryNumber: schema.journalEntries.entryNumber,
        date: schema.journalEntries.date,
        description: schema.journalEntries.description,
        status: schema.journalEntries.status,
      })
      .from(schema.journalEntries)
      .orderBy(desc(schema.journalEntries.date), desc(schema.journalEntries.createdAt))
      .limit(200)
      .all();

    const result = entries.map((entry) => {
      const items = db
        .select({
          id: schema.journalItems.id,
          debit: schema.journalItems.debit,
          credit: schema.journalItems.credit,
          description: schema.journalItems.description,
          accountCode: schema.accounts.code,
          accountName: schema.accounts.name,
        })
        .from(schema.journalItems)
        .innerJoin(schema.accounts, eq(schema.journalItems.accountId, schema.accounts.id))
        .where(eq(schema.journalItems.journalEntryId, entry.id))
        .all();

      return {
        ...entry,
        items,
      };
    });

    return result;
  });
}
