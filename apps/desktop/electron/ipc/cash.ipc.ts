import { ipcMain } from 'electron';
import { getDatabase } from '../database/client';
import * as schema from '../database/schema';
import { eq, desc, sql, and } from 'drizzle-orm';

export function registerCashIPC() {
  // List cash desks with live calculated balance
  ipcMain.handle('cash:list', async () => {
    const db = getDatabase();

    const cashDesks = db
      .select()
      .from(schema.entities)
      .where(eq(schema.entities.type, 'cash'))
      .all();

    const result = cashDesks.map((desk) => {
      const balanceRes = db
        .select({
          totalIncome: sql<number>`COALESCE(SUM(${schema.journalItems.debit}), 0)`,
          totalExpense: sql<number>`COALESCE(SUM(${schema.journalItems.credit}), 0)`,
        })
        .from(schema.journalItems)
        .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
        .where(
          and(
            eq(schema.journalItems.entityId, desk.id),
            eq(schema.journalEntries.status, 'active')
          )
        )
        .get();

      const totalIncome = balanceRes?.totalIncome || 0;
      const totalExpense = balanceRes?.totalExpense || 0;
      const balance = totalIncome - totalExpense;

      return {
        ...desk,
        totalIncome,
        totalExpense,
        balance,
      };
    });

    return result;
  });

  // Get cash desk movements (Kasa Ekstresi)
  ipcMain.handle('cash:getMovements', async (_, cashEntityId: string) => {
    const db = getDatabase();

    const cashDesk = db
      .select()
      .from(schema.entities)
      .where(eq(schema.entities.id, cashEntityId))
      .get();

    if (!cashDesk) throw new Error('Kasa bulunamadı.');

    const movements = db
      .select({
        id: schema.journalItems.id,
        date: schema.journalEntries.date,
        docNumber: schema.documents.docNumber,
        docType: schema.documents.type,
        description: schema.journalItems.description,
        income: schema.journalItems.debit,
        expense: schema.journalItems.credit,
      })
      .from(schema.journalItems)
      .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
      .leftJoin(schema.documents, eq(schema.journalEntries.documentId, schema.documents.id))
      .where(
        and(
          eq(schema.journalItems.entityId, cashEntityId),
          eq(schema.journalEntries.status, 'active')
        )
      )
      .orderBy(schema.journalEntries.date, schema.journalEntries.createdAt)
      .all();

    let runningBalance = 0;
    const itemsWithBalance = movements.map((item) => {
      runningBalance += item.income - item.expense;
      return {
        ...item,
        runningBalance,
      };
    });

    return {
      cashDesk,
      movements: itemsWithBalance,
      currentBalance: runningBalance,
    };
  });

  // Create new Cash Desk
  ipcMain.handle('cash:create', async (_, name: string) => {
    const db = getDatabase();
    const now = new Date().toISOString();

    const countRes = db
      .select({ count: sql<number>`count(*)` })
      .from(schema.entities)
      .where(eq(schema.entities.type, 'cash'))
      .get();

    const seq = ((countRes?.count || 0) + 1).toString().padStart(3, '0');
    const accountCode = `100.${seq}`;
    const accountId = `acc_100_${seq}`;

    db.insert(schema.accounts)
      .values({
        id: accountId,
        code: accountCode,
        name,
        type: 'asset',
        parentCode: '100',
        createdAt: now,
      })
      .run();

    db.insert(schema.entities)
      .values({
        id: 'cash_' + Date.now(),
        name,
        type: 'cash',
        accountId: accountId,
        isActive: true,
        createdAt: now,
      })
      .run();

    return { success: true };
  });
}
