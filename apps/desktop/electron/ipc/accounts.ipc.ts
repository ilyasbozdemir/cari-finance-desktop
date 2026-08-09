import { ipcMain } from 'electron';
import { getDatabase } from '../database/client';
import * as schema from '../database/schema';
import { eq, sql } from 'drizzle-orm';

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
}
