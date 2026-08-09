import { ipcMain } from 'electron';
import { getDatabase } from '../database/client';
import * as schema from '../database/schema';
import { eq, sql, and } from 'drizzle-orm';

export interface CreateBankPayload {
  name: string;
  iban?: string;
  branch?: string;
  phone?: string;
}

export function registerBanksIPC() {
  ipcMain.handle('banks:list', async () => {
    const db = getDatabase();

    const bankList = db
      .select({
        id: schema.entities.id,
        name: schema.entities.name,
        type: schema.entities.type,
        accountId: schema.entities.accountId,
        accountCode: schema.accounts.code,
        phone: schema.entities.phone,
        taxNumber: schema.entities.taxNumber,
        address: schema.entities.address,
        notes: schema.entities.notes,
        isActive: schema.entities.isActive,
        createdAt: schema.entities.createdAt,
      })
      .from(schema.entities)
      .leftJoin(schema.accounts, eq(schema.entities.accountId, schema.accounts.id))
      .where(eq(schema.entities.type, 'bank'))
      .all();

    const result = bankList.map((bank) => {
      const balanceRes = db
        .select({
          totalIncoming: sql<number>`COALESCE(SUM(${schema.journalItems.debit}), 0)`,
          totalOutgoing: sql<number>`COALESCE(SUM(${schema.journalItems.credit}), 0)`,
        })
        .from(schema.journalItems)
        .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
        .where(
          and(
            eq(schema.journalItems.entityId, bank.id),
            eq(schema.journalEntries.status, 'active')
          )
        )
        .get();

      const totalIncoming = balanceRes?.totalIncoming || 0;
      const totalOutgoing = balanceRes?.totalOutgoing || 0;
      const balance = totalIncoming - totalOutgoing;

      return {
        ...bank,
        accountCode: bank.accountCode || '102.001',
        totalIncoming,
        totalOutgoing,
        balance,
      };
    });

    return result;
  });

  ipcMain.handle('banks:getMovements', async (_, bankEntityId: string) => {
    const db = getDatabase();

    const bank = db
      .select({
        id: schema.entities.id,
        name: schema.entities.name,
        type: schema.entities.type,
        accountId: schema.entities.accountId,
        accountCode: schema.accounts.code,
        phone: schema.entities.phone,
        taxNumber: schema.entities.taxNumber,
        address: schema.entities.address,
        notes: schema.entities.notes,
      })
      .from(schema.entities)
      .leftJoin(schema.accounts, eq(schema.entities.accountId, schema.accounts.id))
      .where(eq(schema.entities.id, bankEntityId))
      .get();

    if (!bank) throw new Error('Banka kaydı bulunamadı.');

    const movements = db
      .select({
        id: schema.journalItems.id,
        date: schema.journalEntries.date,
        docNumber: schema.documents.docNumber,
        docType: schema.documents.type,
        description: schema.journalItems.description,
        incoming: schema.journalItems.debit,
        outgoing: schema.journalItems.credit,
      })
      .from(schema.journalItems)
      .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
      .leftJoin(schema.documents, eq(schema.journalEntries.documentId, schema.documents.id))
      .where(
        and(
          eq(schema.journalItems.entityId, bankEntityId),
          eq(schema.journalEntries.status, 'active')
        )
      )
      .orderBy(schema.journalEntries.date, schema.journalEntries.createdAt)
      .all();

    let runningBalance = 0;
    const itemsWithBalance = movements.map((item) => {
      runningBalance += item.incoming - item.outgoing;
      return {
        ...item,
        runningBalance,
      };
    });

    return {
      bank,
      movements: itemsWithBalance,
      currentBalance: runningBalance,
    };
  });

  ipcMain.handle('banks:create', async (_, payload: CreateBankPayload) => {
    const db = getDatabase();
    const now = new Date().toISOString();

    const countRes = db
      .select({ count: sql<number>`count(*)` })
      .from(schema.entities)
      .where(eq(schema.entities.type, 'bank'))
      .get();

    const seq = ((countRes?.count || 0) + 1).toString().padStart(3, '0');
    const accountCode = `102.${seq}`;
    const accountId = `acc_102_${seq}`;

    db.insert(schema.accounts)
      .values({
        id: accountId,
        code: accountCode,
        name: payload.name,
        type: 'asset',
        parentCode: '102',
        createdAt: now,
      })
      .run();

    db.insert(schema.entities)
      .values({
        id: 'bank_' + Date.now(),
        name: payload.name,
        type: 'bank',
        accountId: accountId,
        address: payload.branch || null,
        notes: payload.iban || null,
        phone: payload.phone || null,
        isActive: true,
        createdAt: now,
      })
      .run();

    return { success: true };
  });
}
